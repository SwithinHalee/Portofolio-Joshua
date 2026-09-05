"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { PERSONAL_INFO } from "@/data/portfolio";

export function Navbar() {
  const [timeString, setTimeString] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      // Format to WIB (UTC+7)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat("en-GB", options).format(now);
      setTimeString(formatted);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: "Works", href: "/#projects" },
    { label: "Dossier", href: "/#dossier" },
    { label: "Studio Setup", href: "/#workspace" },
    { label: "Experience", href: "/#experience" },
    { label: "Archive", href: "/archive" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EAEAEA] bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5 sm:px-8">
        {/* Brand & Location / Time */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <Link
            href="/"
            className="font-medium tracking-tight text-[#111111] hover:text-[#444444] transition-colors font-sans text-sm"
          >
            {PERSONAL_INFO.name}
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#787774] font-mono">
            <span className="hidden sm:inline text-[#EAEAEA]">/</span>
            <span>Tangerang, ID</span>
            {timeString ? (
              <span className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-1.5 py-0.5 text-[11px] text-[#111111]">
                {timeString} WIB
              </span>
            ) : (
              <span className="rounded bg-[#F7F6F3] border border-[#EAEAEA] px-1.5 py-0.5 text-[11px] text-[#111111]">
                WIB
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wide text-[#787774]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-[#111111] transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="inline-flex items-center gap-1 text-[#111111] hover:underline underline-offset-4 font-medium"
          >
            <span>Contact</span>
            <ArrowUpRight size={12} weight="bold" />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1 text-[#111111] hover:text-[#555555] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAEAEA] bg-[#FFFFFF] px-6 py-4">
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
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#111111] font-medium flex items-center gap-1"
            >
              <span>Contact ({PERSONAL_INFO.email})</span>
              <ArrowUpRight size={12} weight="bold" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}