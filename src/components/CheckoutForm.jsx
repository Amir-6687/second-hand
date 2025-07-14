import React from "react";
import "../styles/checkout.css";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // به صورت داینامیک دامنه فعلی را استفاده کن
        return_url: window.location.origin + "/payment-success",
      },
    });

    if (error) {
      setError(true);
      setMessage(error.message);
    } else {
      setError(false);
      setMessage("Zahlung erfolgreich!");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <PaymentElement className="StripeElement" />
      <button
        disabled={isProcessing || !stripe || !elements}
        className="btn-primary"
      >
        {isProcessing ? "Wird verarbeitet..." : "Jetzt bezahlen"}
      </button>
      {message && (
        <p className={`message ${error ? "error" : "success"}`}>{message}</p>
      )}
    </form>
  );
}
