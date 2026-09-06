import type { Metadata } from "next";
import {
  LegalLayout,
  LegalSection,
  LEGAL_LAST_UPDATED,
} from "@/components/legal-layout";
import { PERSONAL_INFO } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Privacy Policy | Joshua Abdiel",
  description:
    "Privacy policy for Joshua Abdiel's personal portfolio: what data is (and is not) collected, your rights under Indonesia's PDP Law, and contact details.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal / Privacy"
      title="Privacy Policy"
      description="This is a personal portfolio site. It is designed to collect as little personal data as technically possible. This page explains exactly what happens when you visit."
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      <LegalSection id="scope" index="01" title="Who operates this site">
        <p>
          This website is the personal engineering portfolio of{" "}
          <strong className="font-medium text-[#111111]">
            {PERSONAL_INFO.name}
          </strong>
          , based in {PERSONAL_INFO.location}. It is a personal, non-commercial
          showcase of projects and experience — not a registered company, online
          store, or data-driven service. There are no accounts, checkouts,
          newsletters, or contact-form databases on this site.
        </p>
        <p>
          Contact for privacy matters:{" "}
          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Privacy%20request`}
            className="font-medium text-[#111111] underline underline-offset-4"
          >
            {PERSONAL_INFO.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="data-collected" index="02" title="Data this site collects">
        <p>
          <strong className="font-medium text-[#111111]">
            Directly: nothing, unless you email.
          </strong>{" "}
          Browsing the portfolio, filtering the project archive, and expanding
          case-study sections all happen locally in your browser. No input is
          sent to a server, stored in a database, or shared with anyone.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-[#111111]">
              Archive filter search:
            </strong>{" "}
            the keyword you type stays in page memory (React state) and is never
            transmitted or logged.
          </li>
          <li>
            <strong className="font-medium text-[#111111]">
              Copy-email buttons:
            </strong>{" "}
            copying an address uses your browser clipboard only.
          </li>
          <li>
            <strong className="font-medium text-[#111111]">Email links:</strong>{" "}
            selecting an email link opens your own email application. If you
            choose to send an email, you voluntarily share your name, address,
            and message content so a reply is possible. That correspondence is
            kept only as long as needed to respond.
          </li>
        </ul>
        <p>
          The site does not run analytics, advertising trackers, or behavioral
          profiling. There is no analytics dashboard recording your visits on
          this domain.
        </p>
      </LegalSection>

      <LegalSection
        id="automatically-logged"
        index="03"
        title="Data the hosting provider may log"
      >
        <p>
          Like virtually all websites, the hosting infrastructure (e.g. the
          platform serving these pages) may automatically process strictly
          technical records needed to deliver the site securely — such as IP
          address, date and time, requested URL, and user-agent string — for
          security, load balancing, and error diagnosis. This site operator does
          not purchase, combine, or resell those logs, and does not use them to
          identify individuals.
        </p>
      </LegalSection>

      <LegalSection id="cookies" index="04" title="Cookies and tracking">
        <p>
          This site does not set advertising or analytics cookies. No cookie
          consent banner is shown because there is nothing non-essential to
          consent to. See the dedicated{" "}
          <a
            href="/cookies"
            className="font-medium text-[#111111] underline underline-offset-4"
          >
            Cookie Policy
          </a>{" "}
          for the full breakdown.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" index="05" title="Third-party links">
        <p>
          Project cards link out to independent third parties: GitHub
          repositories, LinkedIn, and the CarbonEthics website. Selecting those
          links leaves this site and loads content governed by that
          provider&apos;s own privacy terms. No content from those providers is
          embedded in these pages (no iframes, feeds, or players), so they
          receive no data from this site until you choose to visit them.
        </p>
        <p>
          Fonts (Geist, Newsreader) are self-hosted through the application
          bundle — loading a page does not contact external font servers.
        </p>
      </LegalSection>

      <LegalSection id="legal-basis" index="06" title="Legal basis and your rights">
        <p>
          This site is operated from Indonesia and is subject to{" "}
          <strong className="font-medium text-[#111111]">
            Law No. 27 of 2022 on Personal Data Protection (UU PDP)
          </strong>
          . Visitors from the European Economic Area are additionally respected
          under the principles of the EU General Data Protection Regulation
          (GDPR). In practice, because no personal data is collected through
          browsing, there is minimal processing to object to — but your rights
          still apply to any email correspondence:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Right to know what personal data is held about you.</li>
          <li>Right to request correction of inaccurate data.</li>
          <li>
            Right to request deletion of correspondence you sent (“right to be
            forgotten”), subject to legal retention duties.
          </li>
          <li>Right to withdraw consent for further correspondence.</li>
          <li>
            Right to lodge a complaint with Indonesia&apos;s data protection
            authority, or with your local supervisory authority if you are in
            the EU/EEA.
          </li>
        </ul>
        <p>
          To exercise any right, email{" "}
          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Data%20rights%20request`}
            className="font-medium text-[#111111] underline underline-offset-4"
          >
            {PERSONAL_INFO.email}
          </a>{" "}
          with the subject “Data rights request”. Requests are answered within
          a reasonable time, no later than 30 days.
        </p>
      </LegalSection>

      <LegalSection id="children" index="07" title="Children">
        <p>
          This portfolio is a professional showcase and is not directed at
          children. No personal data from children is knowingly collected. If
          you believe a child has sent personal information by email, contact
          the operator and it will be deleted promptly.
        </p>
      </LegalSection>

      <LegalSection id="changes" index="08" title="Changes to this policy">
        <p>
          If this site ever adds analytics, a contact form backend, comments, or
          any other data processing, this policy will be updated first, the
          “Last updated” date revised, and — where required — a consent
          mechanism added before the new processing begins. Material changes
          will be noted here rather than hidden.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
