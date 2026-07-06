"use client";

import { motion } from "framer-motion";
import About from "../components/About";
import FeaturedLands from "../components/Featured";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import SellWithUs from "../components/SellWitUs";

export default function Page() {
  return (
    <div>
      <Navbar />
      <Hero />
      
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <About />
      </motion.section>
      
      <motion.section
        id="lands"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <FeaturedLands />
      </motion.section>
      
      <motion.section
        id="sell"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <SellWithUs />
      </motion.section>
      
      <Footer />
    </div>
  );
}