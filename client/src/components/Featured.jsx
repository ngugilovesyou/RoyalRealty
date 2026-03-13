"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
  })
};

// Add the getImageUrl function
const getImageUrl = (path) => {
  if (!path) return "/placeholder-property.jpg";
  if (path.startsWith("http")) return path;
  
  // Extract just the filename
  const filename = path.split('/').pop();
  return `/static/uploads/${filename}`;
};

export default function FeaturedLands() {
  const [lands, setLands] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch lands
  const fetchLands = async () => {
    try {
      const response = await fetch("https://royalrealtyapi.onrender.com/api/lands/featured");
      const data = await response.json();
      if (Array.isArray(data)) {
        console.log("Fetched lands:", data); // Debug log
        setLands(data);
      }
    } catch (err) {
      console.error("Failed to fetch featured lands:", err);
    }
  };

  // Check 24-hour refresh
  useEffect(() => {
    const lastFetch = localStorage.getItem("featuredLandsLastFetch");
    const now = new Date().getTime();

    if (!lastFetch || now - lastFetch > 24 * 60 * 60 * 1000) {
      fetchLands();
      localStorage.setItem("featuredLandsLastFetch", now);
    } else {
      // Optional: if you want to fetch from backend anyway on mount
      fetchLands();
    }
  }, []);

  const viewDetails = (land) => {
    setSelectedListing(land);
    setShowDetailModal(true);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Residential': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Commercial': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

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
        {lands.length > 0 ? (
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
                <div className="h-60 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={getImageUrl(land.images?.[0])}
                    alt={land.title}
                    onError={(e) => {
                      console.log("Image failed to load:", land.images?.[0]);
                      e.target.src = "/placeholder-property.jpg";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-[#222] mb-2">
                    {land.title}
                  </h3>
                  <p className="text-[#666] text-sm mb-3">{land.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1F4E2F] font-semibold">Ksh {land.price}</span>
                    <button
                      onClick={() => viewDetails(land)}
                      className="flex items-center gap-1 text-xs sm:text-sm text-[#2F6B3C] hover:underline"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white mb-4">No featured properties available.</p>
            <Link
              href="/sell-with-us"
              className="py-2 px-4 bg-[#A8D4B0] text-[#2F6B3C] rounded-lg font-semibold hover:bg-[#8CBF96] transition"
            >
              Sell With Us
            </Link>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="font-serif text-xl sm:text-2xl font-light text-[#222] mb-4">
                {selectedListing.title}
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-[#2F6B3C] mb-2">Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedListing.images?.map((img, i) => (
                      <div key={i} className="aspect-square bg-[#2F6B3C]/10 rounded-lg flex items-center justify-center">
                        <img 
                          src={getImageUrl(img)}
                          alt={`${selectedListing.title} ${i + 1}`}
                          onError={(e) => {
                            console.log("Modal image failed to load:", img);
                            e.target.src = "/placeholder-property.jpg";
                          }}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs text-[#666] mb-1">Title</p>
                    <p className="text-sm sm:text-base text-[#222] font-medium">{selectedListing.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#666] mb-1">Price</p>
                    <p className="text-sm sm:text-base text-[#2F6B3C] font-semibold">{selectedListing.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#666] mb-1">Location</p>
                    <p className="text-sm text-[#222]">{selectedListing.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#666] mb-1">Size</p>
                    <p className="text-sm text-[#222]">{selectedListing.size}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-[#2F6B3C] mb-2">Description</h3>
                  <div className="bg-[#F6F4ED] p-4 rounded-lg min-h-[80px] flex items-center">
                    <p className="text-sm text-[#666] leading-relaxed">
                      {selectedListing.additional_info || (
                        <span className="text-[#999] italic">No additional information available for this listing</span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full py-2 sm:py-3 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}