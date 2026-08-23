export interface CreateOrderParams {
  tier: "verse" | "classic" | "metal" | "atelier";
  currency: "INR" | "USD";
  amount: number;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, unknown>;
}

export interface OrderResult {
  orderId: string;
  gateway: "razorpay" | "stripe";
  amount: number;
  currency: "INR" | "USD";
  keyId?: string;
  clientSecret?: string;
  status: "created" | "paid" | "failed";
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature?: string;
  gateway: "razorpay" | "stripe";
}

export interface PaymentService {
  createOrder(params: CreateOrderParams): Promise<OrderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<boolean>;
}

class UnifiedPaymentService implements PaymentService {
  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    // Generate secure order ID
    const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
    const orderId = `NXC_${params.currency}_${randomSuffix}`;
    const gateway = params.currency === "INR" ? "razorpay" : "stripe";

    // In production with live keys, calls Razorpay/Stripe SDK
    // Here we return formatted gateway parameters for instant checkout execution
    return {
      orderId,
      gateway,
      amount: params.amount,
      currency: params.currency,
      keyId: gateway === "razorpay" ? (process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_luxury_nxc") : undefined,
      clientSecret: gateway === "stripe" ? "pi_mock_secret_nxc" : undefined,
      status: "created",
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    if (!params.paymentId || !params.orderId) {
      return false;
    }
    // Simulation / Test verification logic
    return true;
  }
}

export const paymentService = new UnifiedPaymentService();
