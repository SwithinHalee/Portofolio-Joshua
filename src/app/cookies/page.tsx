import type { Metadata } from "next";
import {
  LegalLayout,
  LegalSection,
  LEGAL_LAST_UPDATED,
} from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Cookie Policy | Joshua Abdiel",
  description:
    "Cookie policy for Joshua Abdiel's portfolio: no advertising or analytics cookies, no consent banner needed, and how to manage cookies in your browser.",
};

export default function CookiesPage() {
  return (
    <LegalLayout
      eyebrow="Legal / Cookies"
      title="Cookie Policy"
      description="Short version: this site does not use advertising or analytics cookies, so there is no cookie banner — there is nothing non-essential to consent to."
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      <LegalSection id="do-we-use" index="01" title="Do we need cookie consent?">
        <p>
          <strong className="font-medium text-[#111111]">
            No consent banner is required for this site as currently built.
          </strong>{" "}
          Consent banners are required when a site stores or reads
          non-essential cookies or trackers (advertising, analytics,
          cross-site profiling). This portfolio sets none of those. Under both
          Indonesia&apos;s PDP Law and the EU ePrivacy/GDPR framework, strictly
          necessary technical processing that you explicitly request (delivering
          the page you asked for) does not require prior consent.
        </p>
        <p>
          If analytics, embedded players, chat widgets, or similar features are
          ever added, this policy will be updated first and a consent mechanism
          introduced before those tools load.
        </p>
      </LegalSection>

      <LegalSection id="what-we-set" index="02" title="What this site stores">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-[#111111]">
              No first-party tracking cookies.
            </strong>{" "}
            Browsing, filtering the archive, expanding project details, and
            copying the email address use in-memory page state only.
          </li>
          <li>
            <strong className="font-medium text-[#111111]">
              No third-party cookies.
            </strong>{" "}
            There are no embedded YouTube players, maps, social feeds,
            advertising scripts, or analytics beacons on these pages, so no
            third party can set cookies through this site.
          </li>
          <li>
            <strong className="font-medium text-[#111111]">
              Hosting-level essentials only.
            </strong>{" "}
            The hosting platform may use strictly necessary load-balancing or
            security processing to deliver pages. That processing is not used
            for profiling and is not accessible to the site operator for
            marketing purposes.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="local-storage" index="03" title="Local storage and cache">
        <p>
          This site does not currently persist preferences in{" "}
          <code className="rounded border border-[#EAEAEA] bg-[#F7F6F3] px-1 font-mono text-[13px]">
            localStorage
          </code>{" "}
          or{" "}
          <code className="rounded border border-[#EAEAEA] bg-[#F7F6F3] px-1 font-mono text-[13px]">
            sessionStorage
          </code>
          . Your browser may still cache static assets (images, stylesheets) on
          your own device to load repeat visits faster — that cache lives under
          your control and can be cleared at any time in your browser settings.
        </p>
      </LegalSection>

      <LegalSection id="manage" index="04" title="Managing cookies in your browser">
        <p>
          Because this site sets no optional cookies, there is nothing to opt
          out of here. Generally, you can block or delete cookies for any site
          from your browser settings (typically under Privacy or Site
          Settings). Blocking strictly necessary technical processing may
          degrade how websites function, but blocking optional categories will
          not break this portfolio.
        </p>
      </LegalSection>

      <LegalSection id="changes" index="05" title="Changes to this policy">
        <p>
          Any future introduction of analytics or embedded third-party content
          will be disclosed here before it goes live, together with the legal
          basis, retention, and an opt-in consent control. The “Last updated”
          date records the current version.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
