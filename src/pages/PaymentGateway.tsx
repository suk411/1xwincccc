import { useLocation } from "react-router-dom";
import { useTransitionNavigate } from "@/providers/NavigationProvider";
import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import { useState } from "react";

const PaymentGateway = () => {
  const location = useLocation();
  const { navigateWithTransition } = useTransitionNavigate();
  const [loading, setLoading] = useState(true);
  const paymentUrl = (location.state as any)?.paymentUrl || "";

  if (!paymentUrl) {
    navigateWithTransition("/bank", { replace: true });
    return null;
  }

  return (
    <main className="relative flex-1 flex flex-col max-w-screen-lg mx-auto w-full h-screen bg-white">
      <PageHeader title="Payment" />
      {loading && <Loader label="Loading payment..." />}
      <iframe
        src={paymentUrl}
        className="flex-1 w-full border-0"
        style={{ display: loading ? "none" : "block" }}
        onLoad={() => setLoading(false)}
        allow="payment"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      />
    </main>
  );
};

export default PaymentGateway;
