import { loadStripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!key) {
    console.error("Falta VITE_STRIPE_PUBLISHABLE_KEY. Verifica tus variables de entorno en Vercel.");
    key = ""; // Evita crash, pero Stripe no cargará
}
export const stripePromise = key ? loadStripe(key) : null;
