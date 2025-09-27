// app/checkout/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type CartItem = { id: string; name: string; price: number; qty: number };


export default function Checkout() {
  const router = useRouter();
  const [processing, setProcessing] = React.useState(false);
  const [promo, setPromo] = React.useState("");
  const [fields, setFields] = React.useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  // Example cart; replace with your real data/store
  const cart: CartItem[] = [
    { id: "tee", name: "Zara", price: 249.99, qty: 1 }
  ];

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promo.trim().toUpperCase() === "TRYON10" ? subtotal * 0.1 : 0;
  const shipping = subtotal - discount >= 75 ? 0 : 6.99;
  const taxRate = 0.08; // sample
  const tax = (subtotal - discount) * taxRate;
  const total = Math.max(0, subtotal - discount) + shipping + tax;

  const canSubmit =
    !processing &&
    fields.name &&
    /\S+@\S+\.\S+/.test(fields.email) &&
    fields.address &&
    fields.city &&
    fields.state &&
    fields.zip;

  const onChange =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const pay = async () => {
    if (!canSubmit) return;
    setProcessing(true);

    // TODO: replace with real payment (Stripe Payment Element on a server-created PaymentIntent)
    // Example: await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ ...fields, cart }) })
    await new Promise((r) => setTimeout(r, 800));

    setProcessing(false);
    router.push("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-lightpink/40">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur md:grid-cols-2">
      {/* Form */}
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Checkout</h1>

        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm">
            Name
            <input
              className="input bg-white"
              value={fields.name}
              onChange={onChange("name")}
              autoComplete="name"
            />
          </label>
          <label className="text-sm">
            Email
            <input
              className="input bg-white"
              value={fields.email}
              onChange={onChange("email")}
              autoComplete="email"
              type="email"
            />
          </label>
          <label className="text-sm">
            Address
            <input
              className="input bg-white"
              value={fields.address}
              onChange={onChange("address")}
              autoComplete="street-address"
            />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm col-span-2">
              City
              <input
                className="input bg-white"
                value={fields.city}
                onChange={onChange("city")}
                autoComplete="address-level2"
              />
            </label>
            <label className="text-sm ">
              State
              <input
                className="input bg-white"
                value={fields.state}
                onChange={onChange("state")}
                autoComplete="address-level1"
              />
            </label>
          </div>
          <label className="text-sm">
            ZIP
            <input
              className="input bg-white"
              value={fields.zip}
              onChange={onChange("zip")}
              autoComplete="postal-code"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            placeholder="Promo code"
            className="w-40 rounded-md border px-3 py-2 bg-white text-sm font-mono"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
          />
          <button className="text-sm bg-darkpink/20 font-semibold text-darkpink border-1 rounded-2xl p-2 hover:scale-[1.02] transition-all"> <code>Apply</code></button>
        </div>

        <button
          disabled={!canSubmit}
          onClick={pay}
          className={`w-full font-semibold rounded-md px-4 py-3 text-white ${
            canSubmit ? "bg-black hover:opacity-90" : "bg-green hover:scale-[1.02] transition-all"
          }`}
        >
          {processing ? "Processing..." : "Pay now"}
        </button>

        <p className="text-xs text-gray-500">
          <code>Demo only. Replace with a real payment flow (Stripe Payment Element) before going live.</code>
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border p-6 shadow-sm bg-white">
        <h2 className="mb-3 text-lg font-semibold">Order summary</h2>
        <ul className="divide-y">
          {cart.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">Qty {item.qty}</p>
              </div>
              <p className="text-sm">${(item.price * item.qty).toFixed(2)}</p>
            </li>
          ))}
        </ul>
         <hr className="border-black-300 my-4"></hr>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
