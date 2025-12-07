import { loadStripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!key) {
    console.error("Falta VITE_STRIPE_PUBLISHABLE_KEY");
}
export const stripePromise = loadStripe(key);
