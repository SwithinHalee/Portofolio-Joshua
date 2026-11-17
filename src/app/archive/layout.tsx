import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const ARCHIVE_TITLE = "Project Archive & Technical Experiments";
const ARCHIVE_DESCRIPTION =
  "Complete index of software engineering projects, prototypes, open-source tools, and coursework built by Joshua Abdiel across web, mobile, and systems architecture.";

export const metadata: Metadata = {
  title: ARCHIVE_TITLE,
  description: ARCHIVE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/archive` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/archive`,
    title: `${ARCHIVE_TITLE} | ${SITE_NAME}`,
    description: ARCHIVE_DESCRIPTION,
  },
};

export default function ArchiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
