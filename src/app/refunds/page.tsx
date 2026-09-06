import type { Metadata } from "next";
import {
  LegalLayout,
  LegalSection,
  LEGAL_LAST_UPDATED,
} from "@/components/legal-layout";
import { PERSONAL_INFO } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Refund Policy | Joshua Abdiel",
  description:
    "Refund policy for Joshua Abdiel's portfolio: no goods or services are sold through this site, so no payments or refunds apply.",
};

export default function RefundsPage() {
  return (
    <LegalLayout
      eyebrow="Legal / Refunds"
      title="Refund Policy"
      description="Nothing is sold through this website, so there is nothing to refund. This page states that plainly so there is no ambiguity."
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      <LegalSection id="no-sales" index="01" title="No sales on this site">
        <p>
          This is a personal portfolio. It does not offer products, paid
          downloads, tickets, subscriptions, courses, or checkout functionality
          of any kind. No payment details are requested or processed anywhere
          on this site, and consequently{" "}
          <strong className="font-medium text-[#111111]">
            no refunds can or do arise from using it
          </strong>
          .
        </p>
      </LegalSection>

      <LegalSection id="future-work" index="02" title="Future paid engagements">
        <p>
          If {PERSONAL_INFO.name} ever agrees to paid freelance or contract
          work as a result of an introduction made through this site, payment,
          delivery, revision, and refund terms will be agreed in writing
          separately (for example in a statement of work or service agreement)
          before work begins. Those separately agreed terms — not this page —
          will govern that engagement.
        </p>
      </LegalSection>

      <LegalSection id="mistaken-payment" index="03" title="Mistaken payments">
        <p>
          If you believe you have sent money to someone impersonating this
          site&apos;s operator, or made a payment in error connected to these
          pages, email{" "}
          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Mistaken%20payment%20report`}
            className="font-medium text-[#111111] underline underline-offset-4"
          >
            {PERSONAL_INFO.email}
          </a>{" "}
          immediately with relevant details (date, amount, method, and any
          correspondence). Genuine reports will be reviewed in good faith,
          though recovery of funds sent to third parties cannot be guaranteed.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
