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

      const scrollPosition = window.scrollY + 200;
      const sections = ["projects", "dossier"];

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
    { label: "About", href: "/#about", id: "about" },
    { label: "Work", href: "/#projects", id: "projects" },
    { label: "Dossier", href: "/#dossier", id: "dossier" },
    { label: "Archive", href: "/archive", id: "archive" },
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
            {PERSONAL_INFO.name}
          </Link>

          <span className="hidden sm:inline-block text-[#D5D5D5]">/</span>

          <span className="hidden sm:inline-block font-mono text-xs text-[#787774]">
            Tangerang, ID {timeString && `· ${timeString} WIB`}
          </span>
        </div>

        {/* Minimalist Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono">
          {navLinks.map((link) => {
            const isActive =
              link.id === "archive" ? pathname === "/archive" : isHome && activeSection === link.id;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors ${
                  isActive ? "text-[#111111] font-medium" : "text-[#787774] hover:text-[#111111]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="inline-flex items-center gap-1 text-[#111111] hover:text-[#555555] transition-colors font-medium"
          >
            <span>Contact</span>
            <ArrowUpRight size={11} weight="bold" />
          </a>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-[#111111] hover:text-[#555555] transition-colors"
          aria-label="Toggle menu"
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
            <div className="flex flex-col gap-3 font-mono text-xs text-[#787774]">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-[#111111] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-[#EAEAEA] pt-2 mt-1">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-[#111111] font-medium flex items-center justify-between"
                >
                  <span>{PERSONAL_INFO.email}</span>
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