import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1D4027] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <div className="py-16 grid md:grid-cols-3 gap-12">

          {/* Contact */}
          <div>
            <h3 className="uppercase tracking-widest text-sm text-[#A8D4B0] mb-6">
              Contact
            </h3>

            <div className="space-y-3 text-white/75 leading-relaxed">
              <p>+254 705 268720</p>
              <p>Pioneer House, 306A</p>
              <p>Kenyatta Avenue</p>
              <p>Nairobi, Kenya</p>
              <p>3991-00100 Nairobi</p>

              <a
                href="mailto:info@royalrealty.com"
                className="block hover:text-white transition"
              >
                info@royalrealty.com
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="uppercase tracking-widest text-sm text-[#A8D4B0] mb-6">
              Explore
            </h3>

            <div className="space-y-3">
              <Link
                to="/"
                className="block text-white/75 hover:text-white transition"
              >
                Home
              </Link>

              <Link
                to="/projects"
                className="block text-white/75 hover:text-white transition"
              >
                Projects
              </Link>

              <Link
                to="/sell-with-us"
                className="block text-white/75 hover:text-white transition"
              >
                Sell With Us
              </Link>

              <Link
                to="/contact-us"
                className="block text-white/75 hover:text-white transition"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Trust & Social */}
          <div>
            <h3 className="uppercase tracking-widest text-sm text-[#A8D4B0] mb-6">
              Why Royal Realty
            </h3>

            <div className="space-y-3 text-white/75">
              <p>✓ Verified Land Ownership</p>
              <p>✓ Transparent Transactions</p>
              <p>✓ Local Market Expertise</p>
              <p>✓ Client-First Service</p>
            </div>

            <div className="mt-8">
              <h4 className="uppercase tracking-widest text-sm text-[#A8D4B0] mb-4">
                Follow Us
              </h4>

              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="group w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#A8D4B0] hover:border-[#A8D4B0] hover:-translate-y-1 transition-all duration-300"
                >
                  <FaFacebookF className="text-white/70 group-hover:text-[#1D4027]" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="group w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#A8D4B0] hover:border-[#A8D4B0] hover:-translate-y-1 transition-all duration-300"
                >
                  <FaInstagram className="text-white/70 group-hover:text-[#1D4027]" />
                </a>

                <a
                  href="https://wa.me/254705268720"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="group w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#A8D4B0] hover:border-[#A8D4B0] hover:-translate-y-1 transition-all duration-300"
                >
                  <FaWhatsapp className="text-white/70 group-hover:text-[#1D4027]" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="group w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#A8D4B0] hover:border-[#A8D4B0] hover:-translate-y-1 transition-all duration-300"
                >
                  <FaLinkedinIn className="text-white/70 group-hover:text-[#1D4027]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Royal Realty. All rights reserved.
          </p>

          <p className="text-sm text-white/40 italic">
            Helping Kenyans build wealth through strategic land investment.
          </p>
        </div>
      </div>
    </footer>
  );
}