"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-[#2F6B3C]/15 to-[#F6F4ED] min-h-screen pt-28 pb-24 px-6">

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-xl shadow-md">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2F6B3C] mb-6">
              Get in Touch
            </h2>

            <p className="text-[#555] text-sm mb-8 leading-relaxed">
              Fill out the form below and we’ll get back to you as soon as possible.
            </p>

            <form className="space-y-6">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Your Message"
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#2F6B3C] text-white px-6 py-3 rounded-md text-sm uppercase tracking-widest hover:bg-[#3D8A4F] transition"
              >
                Send Message
              </button>

            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center bg-white p-10 rounded-xl shadow-md">

            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2F6B3C] mb-6">
              Contact Information
            </h2>

            <div className="space-y-5 text-sm text-[#333]">

              <p>
                <span className="font-medium">Phone:</span>{" "}
                <Link
                  href="tel:+254705268720"
                  className="text-[#2F6B3C] hover:underline"
                >
                  +254 705 268720
                </Link>
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                <Link
                  href="mailto:info@royalrealty.com"
                  className="text-[#2F6B3C] hover:underline"
                >
                  info@royalrealty.com
                </Link>
              </p>

              <p>
                <span className="font-medium">Address:</span>{" "}
                <Link
                  href="https://www.google.com/maps/search/?api=1&query=Pioneer+House+306A+Kenyatta+Avenue+Nairobi"
                  target="_blank"
                  className="text-[#2F6B3C] hover:underline"
                >
                  Pioneer House, 306A, Kenyatta Avenue
                </Link>
              </p>

              <p>
                <span className="font-medium">Mailing:</span> 3991-00100, Nairobi
              </p>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}