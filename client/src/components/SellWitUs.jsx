"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SellWithUs() {
  return (
    <section id="sell" className="relative bg-[#F6F4ED] py-24 px-6">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.18em] text-[#2F6B3C] mb-3"
        >
          Sell With Us
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-serif font-light text-[#2F6B3C] mb-8"
        >
          HARD DECISION MADE EASY
        </motion.h2>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-[#333333] text-lg leading-relaxed mb-6">
            For many, selling land is one of the largest decisions in a lifetime, 
            and we don’t take that responsibility lightly. With our “client first” philosophy, 
            we’ll be there for you every step of the way.
          </p>

          <p className="text-[#333333] text-lg leading-relaxed mb-6">
            We’re a business that prides itself on honesty, integrity, and purpose. 
            When you list with us, we will know your land like it’s our own, amplify your listing’s exposure, 
            maximize your return, and make your experience as frictionless as possible.
          </p>

          <p className="text-[#333333] text-lg leading-relaxed mb-8">
            Our clients invariably become our friends, and we want to keep it that way!
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/sell-with-us"
            className="inline-block px-8 py-3.5 text-sm font-medium tracking-widest uppercase rounded-md bg-[#2F6B3C] text-white hover:bg-[#3D8A4F] transition"
          >
            Contact Us To Get Started
          </Link>
        </motion.div>
      </div>
    </section>
  );
}