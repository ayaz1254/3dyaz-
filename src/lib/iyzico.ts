/**
 * Iyzico Payment Gateway Client
 * 
 * Node.js/Edge-compatible client for iyzico 3D Secure payments.
 * Uses native Web Crypto API (no external dependencies).
 * 
 * 3D Secure Flow:
 *   1. Init 3DS → POST /payment/3dsecure/initialize → returns threeDSHtmlContent
 *   2. Render threeDSHtmlContent in user's browser → bank OTP page
 *   3. Bank redirects to callbackUrl with paymentId
 *   4. Auth 3DS → POST /payment/3dsecure/auth → completes payment
 * 
 * Environment variables:
 *   IYZICO_API_KEY      - Merchant API key (sandbox or production)
 *   IYZICO_SECRET_KEY   - Merchant secret key
 *   IYZICO_BASE_URL     - https://sandbox-api.iyzipay.com or https://api.iyzipay.com
 */

interface IyzicoConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
}

interface Init3DSRequest {
  locale: string;
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: string;
  installment: string;
  basketId: string;
  paymentChannel: string;
  paymentGroup: string;
  callbackUrl: string;
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
    registerCard: string;
  };
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    identityNumber: string;
    registrationAddress: string;
    city: string;
    country: string;
    ip: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  basketItems: {
    id: string;
    name: string;
    category1: string;
    itemType: string;
    price: string;
  }[];
}

interface Auth3DSRequest {
  locale: string;
  conversationId: string;
  paymentId: string;
}

interface IyzicoResponse {
  status: "success" | "failure";
  errorCode?: string;
  errorMessage?: string;
  [key: string]: unknown;
}

interface Init3DSResponse extends IyzicoResponse {
  threeDSHtmlContent?: string;
  paymentId?: string;
  conversationId?: string;
}

interface Auth3DSResponse extends IyzicoResponse {
  paymentId?: string;
  paymentStatus?: string;
  conversationId?: string;
}

let config: IyzicoConfig | null = null;

function getConfig(): IyzicoConfig {
  if (!config) {
    config = {
      apiKey: process.env.IYZICO_API_KEY || "",
      secretKey: process.env.IYZICO_SECRET_KEY || "",
      baseUrl: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
    };
    if (!config.apiKey || !config.secretKey) {
      console.warn("[iyzico] IYZICO_API_KEY or IYZICO_SECRET_KEY not configured");
    }
  }
  return config;
}

/**
 * Generate IYZWSv2 authorization header.
 * Format: "IYZWSv2 " + base64(apiKey + ":" + base64(HMAC-SHA256(secretKey, rawBody)))
 */
async function generateAuthHeader(
  apiKey: string,
  secretKey: string,
  rawBody: string
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const bodyData = encoder.encode(rawBody);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, bodyData);
  const hmacBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  const authString = `${apiKey}:${hmacBase64}`;
  const authBase64 = btoa(authString);

  return `IYZWSv2 ${authBase64}`;
}

/**
 * POST to iyzico API with HMAC-SHA256 signing
 */
async function iyzicoPost<T extends IyzicoResponse>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const { apiKey, secretKey, baseUrl } = getConfig();
  const rawBody = JSON.stringify(body);

  const authorization = await generateAuthHeader(apiKey, secretKey, rawBody);

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: rawBody,
  });

  const result: T = await response.json();

  if (result.status === "failure") {
    throw new IyzicoError(
      result.errorMessage || "Iyzico ödeme hatası",
      result.errorCode || "UNKNOWN",
      result
    );
  }

  return result;
}

export class IyzicoError extends Error {
  code: string;
  rawResponse: Record<string, unknown>;

  constructor(message: string, code: string, rawResponse: Record<string, unknown>) {
    super(message);
    this.name = "IyzicoError";
    this.code = code;
    this.rawResponse = rawResponse;
  }
}

/**
 * Initialize 3D Secure payment.
 * 
 * @returns threeDSHtmlContent - base64 encoded HTML form to render in browser
 * @returns paymentId - iyzico payment reference
 */
export async function init3DS(
  request: Init3DSRequest
): Promise<Init3DSResponse> {
  return iyzicoPost<Init3DSResponse>("/payment/3dsecure/initialize", {
    ...request,
    // Ensure all required fields are present
    installment: request.installment || "1",
    paymentChannel: request.paymentChannel || "WEB",
    paymentGroup: request.paymentGroup || "PRODUCT",
    currency: request.currency || "TRY",
  });
}

/**
 * Complete 3D Secure payment after bank callback.
 * 
 * @param paymentId - paymentId from bank callback
 * @param conversationId - merchant reference (orderId)
 */
export async function auth3DS(
  paymentId: string,
  conversationId: string
): Promise<Auth3DSResponse> {
  const request: Auth3DSRequest = {
    locale: "tr",
    conversationId,
    paymentId,
  };
  return iyzicoPost<Auth3DSResponse>("/payment/3dsecure/auth", request as unknown as Record<string, unknown>);
}

/**
 * Check config status without making API calls.
 */
export function isIyzicoConfigured(): boolean {
  const { apiKey, secretKey } = getConfig();
  return !!(apiKey && secretKey);
}

/**
 * Reset config (useful for testing/config changes)
 */
export function resetConfig(): void {
  config = null;
}
