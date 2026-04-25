import {
  createHouseLedgerResponse,
  getHouseLedgerState,
  HouseLedgerAccessError,
  requireHouseLedgerOwner,
} from "./_lib/house-ledger.js";

export async function GET(request: Request) {
  try {
    const owner = await requireHouseLedgerOwner(request);
    const state = await getHouseLedgerState();

    return createHouseLedgerResponse({
      success: true,
      owner,
      ...state,
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
        : "The house ledger could not be opened.";

    return createHouseLedgerResponse({ success: false, error: message }, 500);
  }
}
