"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PERSONAL_INFO } from "@/data/portfolio";
import { usePortfolio } from "@/components/portfolio-provider";
import { useSplash } from "@/components/splash-intro";
import { scrollWithWeight } from "@/components/weighted-scroll";

export function Navbar() {
  const { data } = usePortfolio();
  const { isBrandVisible, isChromeVisible } = useSplash();
  const personalInfo = data.personalInfo ?? PERSONAL_INFO;
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isHome = pathname === "/";
  const [contactActive, setContactActive] = useState(false);

  const scrollToContact = useCallback(() => {
    scrollWithWeight(() => {
      const el = document.getElementById("contact");
      if (!el) return window.scrollY;
      const isXl = window.matchMedia("(min-width: 1280px)").matches;
      const offset = isXl ? 32 : 76;
      return Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
    });
  }, []);

  function handleContactClick(e: React.MouseEvent) {
    e.preventDefault();
    if (isHome) {
      window.history.replaceState(null, "", "/#contact");
      scrollToContact();
    } else {
      router.push("/#contact");
    }
  }

  // Handle cross-page navigation or direct load with #contact hash
  useEffect(() => {
    if (pathname !== "/") return;
    if (window.location.hash !== "#contact") return;

    let attempts = 0;
    const maxAttempts = 40;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (document.getElementById("contact")) {
        window.clearInterval(timer);
        scrollToContact();
      } else if (attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, scrollToContact]);

  useEffect(() => {
    if (!isHome) return;

    function handleScroll() {
      const contactEl = document.getElementById("contact");
      if (!contactEl) {
        setContactActive(false);
        return;
      }
      const cRect = contactEl.getBoundingClientRect();
      setContactActive(cRect.top <= window.innerHeight * 0.65 && cRect.bottom >= 120);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  if (isAdmin) return null;

  const isArchiveActive = pathname === "/archive";
  const isContactHighlighted = isHome && contactActive;

  return (
    <>
      {/* Top-Left Brand: crowns the desktop side panel column on xl+, containerless across viewports */}
      <Link
        href="/"
        data-navbar-brand-link
        aria-label={`${personalInfo.name} Home`}
        className={`fixed left-4 sm:left-6 xl:left-4 2xl:left-8 top-4 sm:top-5 xl:top-6 z-40 inline-flex items-center p-0 border-0 bg-transparent mix-blend-difference antialiased shadow-none font-sans font-medium tracking-[-0.025em] text-[#FFFFFF] transition-colors duration-200 hover:text-[#FFFFFF]/70 ${
          isBrandVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <span
          data-navbar-brand
          className="text-[15px] sm:text-[16px] xl:text-[19px] 2xl:text-[22px] leading-[1.15] whitespace-nowrap"
        >
          {personalInfo.name}
        </span>
      </Link>

      {/* Top-Right Borderless Typographic Controls (Archive & Contact) with pixel-per-pixel blend */}
      <nav
        aria-label="Primary actions"
        data-navbar-chrome
        className={`fixed right-4 sm:right-6 2xl:right-8 top-4 sm:top-5 xl:top-[27px] z-50 flex items-center gap-5 sm:gap-6 bg-transparent mix-blend-difference antialiased transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isChromeVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <Link
          href="/archive"
          className={`inline-flex items-center p-0 border-0 bg-transparent shadow-none font-sans text-[13px] leading-[1.15] tracking-[-0.01em] transition-colors duration-200 active:scale-[0.98] ${
            isArchiveActive
              ? "text-[#FFFFFF] font-medium underline underline-offset-4 decoration-[1.5px]"
              : "text-[#FFFFFF]/65 hover:text-[#FFFFFF] font-normal"
          }`}
        >
          Archive
        </Link>

        <Link
          href="/#contact"
          onClick={handleContactClick}
          className={`inline-flex items-center gap-1 p-0 border-0 bg-transparent shadow-none font-sans text-[13px] leading-[1.15] tracking-[-0.01em] transition-colors duration-200 active:scale-[0.98] ${
            isContactHighlighted
              ? "text-[#FFFFFF] font-medium underline underline-offset-4 decoration-[1.5px]"
              : "text-[#FFFFFF]/65 hover:text-[#FFFFFF] font-normal"
          }`}
        >
          <span>Contact</span>
          <ArrowUpRight size={11} weight="bold" aria-hidden="true" />
        </Link>
      </nav>
    </>
  );
}
