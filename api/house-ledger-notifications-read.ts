import {
  createHouseLedgerResponse,
  HouseLedgerAccessError,
  markHouseLedgerNotificationsRead,
  requireHouseLedgerOwner,
} from "./_lib/house-ledger.js";

type ReadPayload = {
  notificationId?: string | null;
};

export async function POST(request: Request) {
  try {
    await requireHouseLedgerOwner(request);
    const body = (await request.json()) as ReadPayload;
    const result = await markHouseLedgerNotificationsRead({
      notificationId: body.notificationId,
    });

    return createHouseLedgerResponse({
      success: true,
      ...result,
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
        : "Ledger notifications could not be updated.";

    return createHouseLedgerResponse({ success: false, error: message }, 500);
  }
}
