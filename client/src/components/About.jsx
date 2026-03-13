"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" aria-label="About Royal Realty" className="bg-[#F6F4ED] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.18em] text-[#2F6B3C] mb-4"
        >
          Who Are We?
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#222] mb-10 leading-tight"
        >
          A modern real estate brokerage
          <br />
          <em className="text-[#2F6B3C]">built for today's market</em>
        </motion.h2>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6 text-[#555] text-lg leading-relaxed max-w-3xl mx-auto"
        >
          <p>
            Royal Realty is a real estate brokerage designed for today’s market.
            Our brand proudly serves everyone, from first-time land buyers to
            clients searching for the perfect piece of land to build their dream home.
          </p>

          <p>
            When you work with us, you can always expect team members who are
            down-to-earth local experts focused on providing you with the very
            best in service, skills, and support throughout your investment journey.
          </p>
        </motion.div>
      </div>
    </section>
  );
}