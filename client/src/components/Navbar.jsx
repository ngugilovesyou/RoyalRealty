import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Properties", href: "/projects" },
  { label: "Sell with Us", href: "/sell-with-us" },
  { label: "Contact", href: "/contact-us" },
];

const LOGO_SRC =
  "https://res.cloudinary.com/dxwzdftzm/image/upload/f_auto,q_auto,w_80,h_80,c_fill/v1774284401/edited-photo_uibu5g.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleHashLinkClick = (href) => {
    setMenuOpen(false);
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (path === "/" && location.pathname === "/") {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-4">
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 bg-gradient-to-b from-[#0A1C0F]/70 to-transparent transition-opacity duration-300 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 bg-[#F6F4ED] shadow-lg transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
            onClick={() => handleHashLinkClick("/")}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
              <img
                src={LOGO_SRC}
                alt="Royal Assets Logo"
                width="40"
                height="40"
                className="w-full h-full object-cover"
              />
            </div>

            <span
              className={`text-xl font-semibold ${scrolled ? "text-[#2F6B3C]" : "text-white"}`}
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
                  to={link.href}
                  onClick={() => handleHashLinkClick(link.href)}
                  className={`relative text-xs uppercase tracking-widest group ${
                    scrolled
                      ? "text-gray-700 hover:text-[#2F6B3C]"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#7A9E7E] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact-us"
              className="hidden md:inline-block px-5 py-2.5 text-xs uppercase tracking-widest rounded-md text-white bg-[#2F6B3C] hover:bg-[#3D8A4F] transition-colors shadow-md"
            >
              Book a Visit
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg border ${
                scrolled
                  ? "border-[#2F6B3C]/30 text-[#2F6B3C]"
                  : "border-white/30 text-white"
              }`}
            >
              {menuOpen ? <X size={20} /> : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#F6F4ED] z-40 md:hidden transition-[transform,visibility] duration-300 ${
          menuOpen ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}
      >
        <div className="flex flex-col h-full">
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
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={18} className="text-[#2F6B3C]" />
            </button>
          </div>

          <nav className="flex-1 px-6 py-8">
            <p className="text-xs uppercase tracking-widest text-[#7A9E7E] mb-6">Menu</p>

            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    onClick={() => handleHashLinkClick(link.href)}
                    className="block px-3 py-3 rounded-lg text-lg hover:bg-[#2F6B3C] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-3 border-t pt-6 border-[#7A9E7E]/30">
              <Link
                to="/contact-us"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-3 rounded-md bg-[#2F6B3C] text-white text-sm uppercase tracking-widest"
              >
                Book a Site Visit
              </Link>
              <Link
                to="/#lands"
                onClick={() => handleHashLinkClick("/#lands")}
                className="block text-center py-3 rounded-md border border-[#2F6B3C] text-[#2F6B3C] text-sm uppercase tracking-widest"
              >
                View Properties
              </Link>
            </div>
          </nav>

          <div className="px-6 py-4 border-t border-[#7A9E7E]/20 text-xs text-[#7A9E7E]">
            © {new Date().getFullYear()} Royal Assets Ltd.
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  );
}