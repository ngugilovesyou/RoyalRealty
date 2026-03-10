"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2F6B3C] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* Contact Info */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="text-sm space-y-2">
            <li>
              <span className="font-medium">Phone:</span> +254 705 268720
            </li>
            <li>
              <span className="font-medium">Address:</span> Pioneer House, 306A, Kenyatta Avenue
            </li>
            <li>
              <span className="font-medium">Mailing:</span> 3991-00100, Nairobi
            </li>
            <li>
              <span className="font-medium">Email:</span>{" "}
              <Link href="mailto:info@royalrealty.com" className="hover:underline">
                info@royalrealty.com
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">About Us</Link>
            </li>
            <li>
              <Link href="/projects" className="hover:underline">Projects</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Branding */}
        <div>
          <h3 className="font-serif text-lg font-semibold mb-4">Royal Realty</h3>
          <p className="text-sm text-white/80 leading-relaxed mb-4">
            Helping you invest in land securely, with honesty, transparency, and care for over 15 years.
          </p>
          <p className="text-xs text-white/60">&copy; {new Date().getFullYear()} Royal Realty. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}