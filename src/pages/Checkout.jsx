// نسخه جدید Checkout.jsx – امن و آماده‌ی پرداخت واقعی
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { apiFetch } from "../lib/api";

const stripePromise = loadStripe(
  "pk_test_51RdaawIHmfIW1XwW1vpUdbnY3i9lqzR8X8KfCqXzM3wgIAHGnLjOj12TzCQjq1SuBbTMVp78VwWtRqkKCOv1LC2K00ZSm5SxXl"
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    apiFetch("/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({ amount: 1000 }), // مثال تستی
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🎯 Client Secret from backend:", data.clientSecret); // ✅ اینجا
        setClientSecret(data.clientSecret);
      });
  }, []);

  const appearance = { theme: "stripe" };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
