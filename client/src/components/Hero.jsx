"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background with Ken Burns effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        style={{
          background:
            "linear-gradient(160deg, rgba(15,45,20,0.72) 0%, rgba(47,107,60,0.45) 50%, rgba(20,40,15,0.65) 100%), url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1800&q=80') center/cover no-repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl ml-[10vw]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-2.5 text-[#a8d4b0] text-xs font-medium tracking-[0.18em] uppercase mb-6"
        >
          Land Investment Experts
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.08] text-white mb-6"
        >
          Invest in Land.
          <br />
          <em className="italic text-[#a8d4b0]">Secure Your Future.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/80 text-lg font-light leading-relaxed max-w-md mb-11"
        >
          Own a piece of the earth that grows in value year after year.
          Explore prime land plots in strategic locations — designed for
          long-term wealth and generational prosperity.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-4 flex-wrap"
        >
          <Link
            href="/projects"
            className="px-6 py-3 bg-[#2F6B3C] text-white text-sm uppercase tracking-widest rounded-md shadow-lg hover:bg-[#3D8A4F] transition"
          >
            View Available Plots
          </Link>

          <Link
            href="/contact"
            className="px-6 py-3 border border-white text-white text-sm uppercase tracking-widest rounded-md hover:bg-white hover:text-[#2F6B3C] transition"
          >
            Book a Site Visit
          </Link>
        </motion.div>
      </div>
    </section>
  );
}