import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

export type CarSemProduct = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  collection: string;
  image_url: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  status: "active" | "draft" | "archived";
};

export type CarSemOrder = {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: "pending" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  total: number;
  created_at: string;
};

export type CarSemCustomer = {
  id: string;
  email: string;
  full_name: string | null;
  orders_count: number;
  total_spent: number;
  last_order_at: string | null;
};
