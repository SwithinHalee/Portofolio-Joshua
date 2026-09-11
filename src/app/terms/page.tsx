import type { Metadata } from "next";
import {
  LegalLayout,
  LegalSection,
  LEGAL_LAST_UPDATED,
} from "@/components/legal-layout";
import { PERSONAL_INFO } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Terms and Conditions | Joshua Abdiel",
  description:
    "Terms of use for Joshua Abdiel's personal portfolio: permitted use, intellectual property, external links, and liability limits.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal / Terms"
      title="Terms and Conditions"
      description="The ground rules for using this personal portfolio: what you may do with its content, who owns what, and where liability ends."
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      <LegalSection id="about-site" index="01" title="What this site is">
        <p>
          This website is the personal portfolio of{" "}
          <strong className="font-medium text-[#111111]">
            {PERSONAL_INFO.name}
          </strong>{" "}
          ({PERSONAL_INFO.location}). It presents selected engineering work,
          education history, and technical writing for informational and
          professional-evaluation purposes only. Nothing on this site constitutes
          professional advice, a job offer, an investment recommendation, or a
          guarantee of availability or results.
        </p>
        <p>
          Operated as an individual. This is not a registered business entity,
          and no company registration, VAT, or trade-license numbers apply.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" index="02" title="Acceptable use">
        <p>You agree to use this site lawfully and in good faith. You must not:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Attempt to disrupt, probe, scrape aggressively, or gain unauthorized
            access to the site or its hosting infrastructure.
          </li>
          <li>
            Misrepresent the operator&apos;s identity, copy the site wholesale
            and present it as your own work, or harvest the published email
            address for spam or unsolicited bulk outreach.
          </li>
          <li>
            Rely on project metrics or descriptions as warranties — they describe
            personal and internship work in specific contexts (see “Accuracy”
            below).
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="ip" index="03" title="Intellectual property">
        <p>
          <strong className="font-medium text-[#111111]">
            Original content:
          </strong>{" "}
          the design, text, layout, and original photographs on this site (such
          as the portrait and workspace photography) belong to{" "}
          {PERSONAL_INFO.name} unless stated otherwise. You may link to public
          pages and quote brief excerpts with clear attribution and a link back,
          but you may not republish substantial portions or claim the work as
          your own.
        </p>
        <p>
          <strong className="font-medium text-[#111111]">
            Project and employer material:
          </strong>{" "}
          project names, screenshots, and descriptions relating to CarbonEthics
          and other engagements are shown as a factual record of work performed.
          All trademarks and rights in those names and platforms belong to their
          respective owners. Open-source repositories linked from this site are
          governed by their own repository licenses.
        </p>
        <p>
          <strong className="font-medium text-[#111111]">
            Third-party game content:
          </strong>{" "}
          the “PokeAPI Virtual Explorer” project displays data and sprites
          served by the public PokeAPI. Pokémon character names and imagery are
          property of Nintendo / Creatures Inc. / GAME FREAK inc. They are used
          here solely to demonstrate API integration and are not claimed as
          original work.
        </p>
      </LegalSection>

      <LegalSection id="accuracy" index="04" title="Accuracy of project information">
        <p>
          Project pages describe work truthfully to the best of the
          operator&apos;s knowledge, but performance figures (for example load
          times or cache behavior) reflect measurements taken in specific local
          or lab conditions and will vary by device, network, and third-party
          API availability. They are illustrations of engineering approach, not
          guarantees that identical results will occur in your environment. No
          testimonials or client reviews are published on this site; any quoted
          statements are the operator&apos;s own engineering notes.
        </p>
      </LegalSection>

      <LegalSection id="external-links" index="05" title="External links">
        <p>
          This site links to GitHub, LinkedIn, web-staging.carbonethics.co, and referenced
          technical sources. Those destinations are operated by third parties.
          Their availability, accuracy, and practices are outside the control of
          this site&apos;s operator, and linking does not imply endorsement of
          everything they publish. Follow external links at your own discretion
          and review their terms before interacting.
        </p>
      </LegalSection>

      <LegalSection id="liability" index="06" title="Limitation of liability">
        <p>
          The site is provided “as is” without warranties of any kind, to the
          maximum extent permitted by applicable law. To the extent permitted by
          Indonesian law (including the ITE Law and the Civil Code), the
          operator is not liable for indirect, incidental, or consequential loss
          arising from your use of, or inability to use, this site or linked
          third-party content. Nothing in these terms limits liability that
          cannot legally be limited, including liability for fraud or willful
          misconduct.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" index="07" title="Governing law">
        <p>
          These terms are governed by the laws of the Republic of Indonesia. If
          you access the site from another country, you remain responsible for
          complying with your local laws. Disputes should first be raised
          informally by email to{" "}
          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Terms%20enquiry`}
            className="font-medium text-[#111111] underline underline-offset-4"
          >
            {PERSONAL_INFO.email}
          </a>{" "}
          so they can be resolved in good faith.
        </p>
      </LegalSection>

      <LegalSection id="changes" index="08" title="Changes to these terms">
        <p>
          These terms may be updated to reflect site changes or legal
          requirements. The “Last updated” date at the top records the current
          version. Continued use of the site after an update constitutes
          acceptance of the revised terms.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
