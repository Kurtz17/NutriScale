import midtransClient from 'midtrans-client';
import type {
  SnapTransactionParameters,
  SnapTransactionResponse,
} from 'midtrans-client';

// payment flow : https://docs.midtrans.com/reference/getting-started-with-snap
const midtrans_snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY ?? '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY ?? '',
});

interface MidtransCoreApi {
  transaction: {
    cancel(orderId: string): Promise<Record<string, unknown>>;
  };
}

const midtrans_core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY ?? '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY ?? '',
}) as unknown as MidtransCoreApi;

function createParameter(
  order_id: string,
  gross_amount: number,
): SnapTransactionParameters {
  return {
    transaction_details: {
      order_id,
      gross_amount,
    },
    expiry: {
      unit: 'minute',
      duration: 15,
    },
  } as unknown as SnapTransactionParameters;
}

export async function createMidtransTransaction(
  order_id: string,
  gross_amount: number,
): Promise<{ token: string; redirect_url: string }> {
  const parameter = createParameter(order_id, gross_amount);
  const transaction = (await midtrans_snap.createTransaction(
    parameter,
  )) as SnapTransactionResponse & { token: string };
  return {
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  };
}

/**
 * Verifies the Midtrans notification signature key.
 * Formula: SHA512(order_id + status_code + gross_amount + server_key)
 * @see https://docs.midtrans.com/reference/receiving-notifications
 */
export async function verifySignatureKey(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
): Promise<boolean> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? '';
  const payload = orderId + statusCode + grossAmount + serverKey;

  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const expectedSignature = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return expectedSignature === signatureKey;
}

/**
 * Cancels a pending transaction in Midtrans.
 * @param orderId The order ID to cancel.
 */
export async function cancelMidtransTransaction(
  orderId: string,
): Promise<unknown> {
  try {
    const response = await midtrans_core.transaction.cancel(orderId);
    return response;
  } catch (error) {
    console.error(`Failed to cancel Midtrans transaction ${orderId}:`, error);
    throw error;
  }
}
