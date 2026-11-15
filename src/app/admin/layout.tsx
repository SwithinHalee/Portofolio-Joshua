import type { Metadata } from "next";
import { notFound } from "next/navigation";

/** The content studio must never appear in search results. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout() {
  notFound();
}
