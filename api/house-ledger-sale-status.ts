import {
  createHouseLedgerResponse,
  HouseLedgerAccessError,
  isValidFulfillmentStatus,
  requireHouseLedgerOwner,
  updateHouseLedgerSaleStatus,
} from "./_lib/house-ledger.js";

type StatusPayload = {
  saleId?: string;
  fulfillmentStatus?: string;
};

export async function POST(request: Request) {
  try {
    await requireHouseLedgerOwner(request);
    const body = (await request.json()) as StatusPayload;
    const saleId = (body.saleId || "").trim();
    const fulfillmentStatus = (body.fulfillmentStatus || "").trim();

    if (!saleId || !isValidFulfillmentStatus(fulfillmentStatus)) {
      return createHouseLedgerResponse(
        {
          success: false,
          error: "A sale id and valid fulfillment status are required.",
        },
        400,
      );
    }

    const sale = await updateHouseLedgerSaleStatus({
      saleId,
      fulfillmentStatus,
    });

    return createHouseLedgerResponse({
      success: true,
      sale,
    });
  } catch (error) {
    if (error instanceof HouseLedgerAccessError) {
      return createHouseLedgerResponse(
        { success: false, error: error.message },
        error.status,
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "The sale line could not be updated.";

    return createHouseLedgerResponse({ success: false, error: message }, 500);
  }
}
