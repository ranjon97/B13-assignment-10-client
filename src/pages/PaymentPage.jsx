import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CreditCard, ShieldCheck } from "lucide-react";
import { classApi } from "@/api/classApi";
import { bookingApi } from "@/api/bookingApi";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";

export function PaymentPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [fitnessClass, setFitnessClass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadClass() {
      try {
        const data = await classApi.getClass(classId);
        setFitnessClass(data);
      } catch (err) {
        toast.error(err.message || "Unable to load class");
        navigate("/classes");
      } finally {
        setIsLoading(false);
      }
    }
    loadClass();
  }, [classId, navigate]);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const { checkoutUrl } = await bookingApi.createCheckoutSession(classId);
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(err.message || "Unable to start checkout");
      setIsProcessing(false);
    }
  };

  if (isLoading) return <PageSpinner />;
  if (!fitnessClass) return null;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 sm:px-6">
      <div className="w-full rounded-2xl border border-border-subtle bg-surface p-8">
        <div className="flex items-center gap-2 text-pulse">
          <CreditCard size={20} />
          <span className="font-mono text-xs uppercase tracking-widest">Secure Checkout</span>
        </div>

        <h1 className="mt-4 font-display text-2xl tracking-wide text-paper">{fitnessClass.name}</h1>
        <p className="mt-1 text-sm text-muted">Trainer: {fitnessClass.trainer?.name}</p>

        <div className="mt-8 flex items-center justify-between border-y border-border-subtle py-4">
          <span className="text-sm text-muted">Total due today</span>
          <span className="font-display text-3xl text-pulse">{formatCurrency(fitnessClass.price)}</span>
        </div>

        <Button onClick={handlePay} isLoading={isProcessing} className="mt-8 w-full">
          Pay with Stripe
        </Button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
          <ShieldCheck size={13} /> Payments are processed securely by Stripe
        </p>
      </div>
    </div>
  );
}
