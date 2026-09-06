"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { PERSONAL_INFO } from "@/data/portfolio";
import { cleanEmail } from "@/lib/portfolio-store";
import { usePortfolio } from "@/components/portfolio-provider";

export function Navbar() {
  const { data } = usePortfolio();
  const personalInfo = data.personalInfo ?? PERSONAL_INFO;
  const email = cleanEmail(personalInfo.email);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [timeString, setTimeString] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Stable document top of the Dossier section. Dossier is sticky-pinned
  // (md+) while Principles overlaps it, so its bounding rect drifts with
  // scroll — the wrapper never sticks, hence its offsetTop stays exact.
  function dossierDocTop() {
    const wrap = document.getElementById("dossier-stack");
    if (wrap) return wrap.offsetTop;
    const el = document.getElementById("dossier");
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }

  function scrollToSection(id: string) {
    const header = document.querySelector("header");
    const headerH = header ? header.getBoundingClientRect().height : 59;
    if (id === "dossier") {
      window.scrollTo({ top: Math.max(0, dossierDocTop() - headerH + 1), behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH + 1;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function handleAnchorClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (isHome) {
      window.history.replaceState(null, "", `/#${id}`);
      scrollToSection(id);
    } else {
      // Navigate home first; the effect below scrolls once the section exists
      router.push(`/#${id}`);
    }
  }

  // After cross-page navigation (e.g. Archive -> About/Work/Dossier/Contact),
  // wait for the home section to mount then scroll with header offset.
  // Also covers direct loads like /#dossier and hash back/forward.
  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    if (!["about", "projects", "dossier", "contact"].includes(hash)) return;

    let attempts = 0;
    const maxAttempts = 40;
    const timer = setInterval(() => {
      attempts += 1;
      if (document.getElementById(hash)) {
        clearInterval(timer);
        scrollToSection(hash);
      } else if (attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [pathname]);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTimeString(new Intl.DateTimeFormat("en-GB", options).format(now));
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 15);

      if (!isHome) return;

      // Contact locks to the black 08/INITIATION container (same rule as dossier rail)
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        const cRect = contactEl.getBoundingClientRect();
        if (cRect.top <= window.innerHeight * 0.65 && cRect.bottom >= 120) {
          setActiveSection("contact");
          return;
        }
      }

      const probe = window.scrollY + 100;
      const topOf = (id: string) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
      };

      const aboutTop = topOf("about");
      const projectsTop = topOf("projects");
      const dossierTop = dossierDocTop();

      if (probe >= dossierTop) {
        // Dossier stays active through stacking / principles / studio / chrono
        setActiveSection("dossier");
      } else if (probe >= projectsTop) {
        setActiveSection("projects");
      } else if (probe >= aboutTop - 80) {
        setActiveSection("about");
      } else {
        setActiveSection("");
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const navLinks = [
    { label: "About", href: "/#about", id: "about" },
    { label: "Work", href: "/#projects", id: "projects" },
    { label: "Dossier", href: "/#dossier", id: "dossier" },
    { label: "Archive", href: "/archive", id: "archive" },
    { label: "Contact", href: "/#contact", id: "contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        scrolled
          ? "border-[#EAEAEA] bg-white/95 backdrop-blur-md"
          : "border-[#EAEAEA]/80 bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
        {/* Brand & Clean Muted Location */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-medium tracking-tight text-[#111111] hover:text-[#444444] transition-colors text-sm font-sans"
          >
            {personalInfo.name}
          </Link>

          <span className="hidden sm:inline-block text-[#D5D5D5]">/</span>

          <span className="hidden sm:inline-block font-mono text-xs text-[#616161]">
            Tangerang, ID {timeString && `· ${timeString} WIB`}
          </span>
        </div>

        {/* Minimalist Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono">
          {navLinks.map((link) => {
            const isPage = link.id === "archive";
            const isActive = isPage
              ? pathname === "/archive"
              : isHome && activeSection === link.id;
            const isContact = link.id === "contact";

            if (isPage) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors ${
                    isActive ? "text-[#111111] font-medium" : "text-[#616161] hover:text-[#111111]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.id)}
                className={`inline-flex items-center gap-1 transition-colors ${
                  isContact
                    ? isActive
                      ? "text-[#111111] font-medium"
                      : "text-[#111111] hover:text-[#555555] font-medium"
                    : isActive
                    ? "text-[#111111] font-medium"
                    : "text-[#616161] hover:text-[#111111]"
                }`}
              >
                <span>{link.label}</span>
                {isContact && <ArrowUpRight size={11} weight="bold" />}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-1 text-[#111111] hover:text-[#555555] transition-colors"
        >
          {mobileMenuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-[#EAEAEA] bg-[#FFFFFF] px-6 py-4 overflow-hidden"
          >
            <div id="mobile-navigation" className="flex flex-col gap-3 font-mono text-xs text-[#616161]">
              {navLinks.map((link) =>
                link.id === "archive" ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 hover:text-[#111111] transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.id)}
                    className="py-1 hover:text-[#111111] transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="border-t border-[#EAEAEA] pt-2 mt-1">
                <a
                  href={`mailto:${email}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-[#111111] font-medium flex items-center justify-between"
                >
                  <span>{email}</span>
                  <ArrowUpRight size={12} weight="bold" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}