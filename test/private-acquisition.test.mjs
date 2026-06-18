import assert from "node:assert/strict";
import test from "node:test";
import {
  getPresentationState,
  hasCompletedDeliveryDetails,
  normalizeDeliveryDetailsInput,
  normalizeReferenceCode,
  serializeAcquisitionSession,
  validateDeliveryDetailsInput,
} from "../api/_lib/private-acquisition.js";

const completeSession = {
  id: "session_1",
  reference_code: "PRA-VIS-ABC123",
  client_name: "A Client",
  client_email: "client@example.com",
  client_phone: "+52 5555555555",
  product_name: "Praeliator VIS",
  product_snapshot: { format: "16 oz" },
  order_snapshot: {},
  quantity: 1,
  currency: "mxn",
  subtotal_amount: 600000,
  shipping_amount: 30000,
  total_amount: 630000,
  shipping_country: "Mexico",
  shipping_region: "CDMX",
  shipping_city: "Mexico City",
  shipping_postal_code: "01000",
  shipping_address_line1: "Avenida Reforma 100",
  shipping_address_line2: null,
  shipping_recipient_name: null,
  shipping_delivery_notes: null,
  delivery_details_completed_at: "2026-06-17T00:00:00.000Z",
  expires_at: "2026-06-18T00:00:00.000Z",
  status: "validated",
  paid_at: null,
  validated_at: "2026-06-17T00:00:00.000Z",
};

test("normalizes reference codes for private acquisition access", () => {
  assert.equal(normalizeReferenceCode(" pra-vis abc-123 "), "PRAVISABC123");
});

test("classifies terminal payment and issuance states", () => {
  assert.equal(getPresentationState(null), "invalid");
  assert.equal(getPresentationState({ status: "paid" }), "paid");
  assert.equal(getPresentationState({ status: "revoked" }), "revoked");
  assert.equal(getPresentationState({ status: "expired" }), "expired");
  assert.equal(getPresentationState({ status: "validated" }), "active");
});

test("requires complete confirmed delivery details before payment", () => {
  assert.equal(hasCompletedDeliveryDetails(completeSession), true);
  assert.equal(
    hasCompletedDeliveryDetails({
      ...completeSession,
      shipping_postal_code: "",
    }),
    false,
  );
  assert.equal(
    hasCompletedDeliveryDetails({
      ...completeSession,
      delivery_details_completed_at: null,
    }),
    false,
  );
});

test("validates and normalizes delivery details input", () => {
  const input = {
    clientName: "  A Client ",
    clientEmail: " CLIENT@EXAMPLE.COM ",
    clientPhone: "+52 5555555555",
    shippingCountry: " Mexico ",
    shippingRegion: " CDMX ",
    shippingCity: " Mexico City ",
    shippingPostalCode: " 01000 ",
    shippingAddressLine1: " Avenida Reforma 100 ",
    shippingDeliveryNotes: " Please call before delivery. ",
    confirmDetails: true,
  };

  assert.deepEqual(validateDeliveryDetailsInput(input).fieldErrors, {});
  assert.equal(normalizeDeliveryDetailsInput(input).clientEmail, "client@example.com");
  assert.equal(normalizeDeliveryDetailsInput(input).shippingPostalCode, "01000");
});

test("serializes acquisition sessions from delivery snapshot fallback", () => {
  const serialized = serializeAcquisitionSession({
    ...completeSession,
    client_name: null,
    shipping_city: null,
    order_snapshot: {
      deliveryDetails: {
        clientName: "Snapshot Client",
        shippingCity: "Guadalajara",
        completedAt: "2026-06-17T01:00:00.000Z",
      },
    },
  });

  assert.equal(serialized.clientName, "Snapshot Client");
  assert.equal(serialized.shippingCity, "Guadalajara");
  assert.equal(
    serialized.deliveryDetailsCompletedAt,
    "2026-06-17T00:00:00.000Z",
  );
});
