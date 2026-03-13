"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Land for Sale", href: "/#lands" },
  { label: "Sell with Us", href: "/#sell" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#F6F4ED]/95 backdrop-blur-md shadow-lg py-3"
            : "bg-gradient-to-b from-[#0A1C0F]/70 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md flex items-center justify-center group-hover:scale-105 transition">
    <img
      src="/assets/edited-photo.png"  
      alt="Royal Assets Logo"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Text */}
  <span
    className={`text-xl font-semibold transition ${
      scrolled ? "text-[#2F6B3C]" : "text-white"
    }`}
    style={{ fontFamily: "Cormorant Garamond, serif" }}
  >
    Royal <span className="text-[#7A9E7E]">Assets</span>
  </span>
</Link>

          {/* DESKTOP NAV */}
          <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`relative text-xs uppercase tracking-widest transition group ${
                    scrolled
                      ? "text-gray-700 hover:text-[#2F6B3C]"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}

                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7A9E7E] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* DESKTOP CTA */}
            <Link
              href="/contact"
              className="hidden md:inline-block px-5 py-2.5 text-xs uppercase tracking-widest rounded-md text-white bg-[#2F6B3C] hover:bg-[#3D8A4F] transition shadow-md"
            >
              Book a Visit
            </Link>

            {/* MOBILE BURGER */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-white/30 text-white"
            >
              {menuOpen ? <X size={20} /> : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#F6F4ED] z-40 transform transition-transform duration-500 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">

          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#7A9E7E]/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-br from-[#2F6B3C] to-[#7A9E7E]">
                RA
              </div>
              <span
                className="text-lg font-semibold text-[#2F6B3C]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Royal <span className="text-[#7A9E7E]">Assets</span>
              </span>
            </div>

            <button onClick={() => setMenuOpen(false)}>
              <X size={18} className="text-[#2F6B3C]" />
            </button>
          </div>

          {/* LINKS */}
          <nav className="flex-1 px-6 py-8">
            <p className="text-xs uppercase tracking-widest text-[#7A9E7E] mb-6">
              Menu
            </p>

            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg text-lg hover:bg-[#2F6B3C] hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* MOBILE CTA */}
            <div className="mt-10 space-y-3 border-t pt-6 border-[#7A9E7E]/30">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-3 rounded-md bg-[#2F6B3C] text-white text-sm uppercase tracking-widest"
              >
                Book a Site Visit
              </Link>

              <Link
                href="/#lands"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-3 rounded-md border border-[#2F6B3C] text-[#2F6B3C] text-sm uppercase tracking-widest"
              >
                View Plots
              </Link>
            </div>
          </nav>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-[#7A9E7E]/20 text-xs text-[#7A9E7E]">
            © {new Date().getFullYear()} Royal Assets Ltd.
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}