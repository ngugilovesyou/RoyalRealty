"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const lands = [
  {
    id: 1,
    title: "Prime Residential Plot",
    location: "Kilimani",
    price: "Ksh 4,500,000",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
  },
  {
    id: 2,
    title: "Scenic Investment Land",
    location: "Naivasha",
    price: "Ksh. 3,000,000",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
  },
  {
    id: 3,
    title: "Future Development Plot",
    location: "Kitengela",
    price: "Ksh 2,500,000",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFuZHxlbnwwfHwwfHx8MA%3D%3D",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

export default function FeaturedLands() {
  return (
    <section id="lands" className="bg-[#2F6B3C] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-14 flex-wrap gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[#A8D4B0] mb-3">
              Featured Land
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-white">
              Land Available for Investment
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/projects"
              className="flex items-center gap-2 text-[#A8D4B0] text-sm uppercase tracking-widest hover:gap-3 transition-all"
            >
              View All Listings
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Land Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lands.map((land, index) => (
            <motion.div
              key={land.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              {/* Image */}
              <div className="h-60 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={land.image}
                  alt={land.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-xl text-[#222] mb-2">
                  {land.title}
                </h3>
                <p className="text-[#666] text-sm mb-3">{land.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#1F4E2F] font-semibold">
                    {land.price}
                  </span>
                  <Link
                    href="/projects"
                    className="text-sm text-[#1F4E2F] hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}