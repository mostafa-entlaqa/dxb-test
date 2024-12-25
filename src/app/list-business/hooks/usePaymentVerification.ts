import { toast } from '@/components/ui/use-toast'
import { verifyPaymentStatus } from '@/app/actions/bussiness-list/verify-payment'

export const usePaymentVerification = () => {
  const verifyPayment = async (
    wantsPremium: boolean,
    sessionId: string | null,
    userId: string
  ) => {
    if (wantsPremium && !sessionId) {
      toast({
        title: "Payment Required",
        description: "Please complete the payment process before submitting a premium listing.",
        variant: "destructive"
      })
      return false
    }

    const isPaid = wantsPremium ? await verifyPaymentStatus(userId, sessionId) : false
    if (wantsPremium && !isPaid) {
      toast({
        title: "Payment Verification Failed",
        description: "Your payment could not be verified. Please try again or contact support.",
        variant: "destructive"
      })
      return false
    }

    return isPaid
  }

  return { verifyPayment }
} 