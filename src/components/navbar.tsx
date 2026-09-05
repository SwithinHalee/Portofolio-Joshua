"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { PERSONAL_INFO } from "@/data/portfolio";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [timeString, setTimeString] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("projects");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
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
      setScrolled(window.scrollY > 20);

      if (!isHome) return;

      const sections = ["projects", "dossier", "principles", "workspace", "experience"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const navLinks = [
    { label: "Works", href: "/#projects", id: "projects" },
    { label: "Dossier", href: "/#dossier", id: "dossier" },
    { label: "Principles", href: "/#principles", id: "principles" },
    { label: "Studio", href: "/#workspace", id: "workspace" },
    { label: "Experience", href: "/#experience", id: "experience" },
    { label: "Archive", href: "/archive", id: "archive" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-[#EAEAEA] bg-white/95 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
          : "border-[#EAEAEA] bg-white/85 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5 sm:px-8">
        {/* Brand & Location / Time */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <Link
            href="/"
            className="font-medium tracking-tight text-[#111111] hover:text-[#444444] transition-colors font-sans text-sm flex items-center gap-2"
          >
            <span>{PERSONAL_INFO.name}</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#111111]/30"></span>
            <span className="font-mono text-xs text-[#787774] font-normal">Portfolio</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#787774] font-mono">
            <span className="hidden sm:inline text-[#EAEAEA]">/</span>
            <span>Tangerang, ID</span>
            {timeString ? (
              <span className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-1.5 py-0.5 text-[11px] text-[#111111] tabular-nums font-mono">
                {timeString} WIB
              </span>
            ) : (
              <span className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-1.5 py-0.5 text-[11px] text-[#111111]">
                WIB
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation with tactile sliding pill */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono text-[#787774]">
          {navLinks.map((link) => {
            const isActive =
              link.id === "archive" ? pathname === "/archive" : isHome && activeSection === link.id;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-3 py-1.5 transition-colors rounded-[4px] ${
                  isActive ? "text-[#111111] font-medium" : "hover:text-[#111111]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#F7F6F3] border border-[#EAEAEA] rounded-[4px] -z-10"
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="h-4 w-[1px] bg-[#EAEAEA] mx-2"></div>

          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1.5 text-[#111111] hover:bg-[#F7F6F3] transition-colors font-medium border border-transparent hover:border-[#EAEAEA]"
          >
            <span>Contact</span>
            <ArrowUpRight size={12} weight="bold" />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-[#111111] hover:bg-[#F7F6F3] rounded-[4px] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {/* Mobile Dropdown with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-[#EAEAEA] bg-[#FFFFFF] px-6 py-4 overflow-hidden"
          >
            <div className="flex flex-col gap-2 font-mono text-xs text-[#787774]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 rounded hover:bg-[#F7F6F3] hover:text-[#111111] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-[#EAEAEA] my-1 pt-2">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 text-[#111111] font-medium flex items-center justify-between rounded hover:bg-[#F7F6F3]"
                >
                  <span>Direct Email ({PERSONAL_INFO.email})</span>
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