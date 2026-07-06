"use client";

const metadata = {
  title: "Lands & Plots for Sale – Royal Realty",
  description:
    "Explore land and plots for sale across Kenya with Royal Realty. Filter by location, price, and size to find your ideal investment or dream property.",
  keywords: "land for sale, plots, Kenya real estate, Royal Realty, property listings",
  robots: "index, follow",
};

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Image from 'next/image'

// Default image for fallback
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80";

// Helper function to get correct image URL
const getImageUrl = (path) => {
  if (!path) return DEFAULT_IMAGE;
  if (path.startsWith("http")) return path;
  
  // Extract just the filename from the path
  const filename = path.split('/').pop();
  return `/static/uploads/${filename}`;
};

// Price ranges for filter
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under Ksh 2M", min: 0, max: 2000000 },
  { label: "Ksh 2M - 5M", min: 2000000, max: 5000000 },
  { label: "Ksh 5M - 10M", min: 5000000, max: 10000000 },
  { label: "Ksh 10M - 20M", min: 10000000, max: 20000000 },
  { label: "Above Ksh 20M", min: 20000000, max: Infinity }
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

// Improved price formatting function
const formatPrice = (price) => {
  if (!price && price !== 0) return "Price on request";
  
  // Convert to number if it's a string
  let numPrice;
  if (typeof price === 'string') {
    // Remove any non-numeric characters except decimal point
    const cleaned = price.replace(/[^0-9.]/g, '');
    numPrice = parseFloat(cleaned);
  } else {
    numPrice = price;
  }
  
  // Check if it's a valid number
  if (isNaN(numPrice) || numPrice === 0) {
    return "Price on request";
  }
  
  // Format the number with commas
  return `Ksh ${numPrice.toLocaleString('en-KE')}`;
};

// Helper function to extract location string
const getLocation = (land) => {
  if (land.town && land.county) return `${land.town}, ${land.county}`;
  if (land.town) return land.town;
  if (land.county) return land.county;
  return "Location not specified";
};

export default function LandsForSale() {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch lands from backend
  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://royalrealtyapi.onrender.com/api/lands");
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const transformedLands = data.map(land => {
            let priceValue = 0;
            if (land.price) {
              if (typeof land.price === 'string') {
                priceValue = parseFloat(land.price.replace(/[^0-9.-]/g, ''));
              } else if (typeof land.price === 'number') {
                priceValue = land.price;
              }
            }
            
            // If price is still NaN or 0, check if it might be in thousands
            if (isNaN(priceValue) || priceValue === 0) {
              // Maybe it's stored as "2" meaning 2 million?
              if (land.price === "2" || land.price === 2) {
                priceValue = 2000000;
              }
            }
            
            return {
              id: land.id,
              title: `${land.town || land.county || 'Land'} Plot`,
              location: getLocation(land),
              town: land.town,
              county: land.county,
              price: priceValue,
              rawPrice: land.price, 
              priceFormatted: formatPrice(priceValue),
              images: land.images || [],
              mainImage: land.images?.[0] || DEFAULT_IMAGE,
              size: land.size || "Size not specified",
              acres: land.size ? parseFloat(land.size) || 0 : 0,
              additional_info: land.additional_info || "",
              type: land.type || "Residential"
            };
          });
          
          setLands(transformedLands);
          setFilteredLands(transformedLands);
          
          const uniqueLocations = [...new Set(transformedLands.map(land => land.location))].sort();
          setLocations(uniqueLocations);
        }
      } catch (err) {
        console.error("Failed to fetch lands:", err);
        setLands([]);
        setFilteredLands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = lands;

    // Filter by location
    if (selectedLocation !== "All Locations") {
      filtered = filtered.filter(land => land.location === selectedLocation);
    }

    // Filter by price range
    filtered = filtered.filter(land => 
      land.price >= selectedPriceRange.min && land.price <= selectedPriceRange.max
    );

    setFilteredLands(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedLocation, selectedPriceRange, lands]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLands.length / itemsPerPage);

  const viewDetails = (land) => {
    setSelectedListing(land);
    setShowDetailModal(true);
  };

  const clearFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedPriceRange(priceRanges[0]);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageError = (landId) => {
    setImageErrors(prev => ({ ...prev, [landId]: true }));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="bg-[#F6F4ED] min-h-screen py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F6B3C]"></div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="bg-[#F6F4ED] min-h-screen py-24 px-6" aria-label="Lands for sale">
        <div className="max-w-7xl mx-auto">
         
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#2F6B3C] mb-3">
                Properties For Sale
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-[#222]">
                Lands & Plots
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-[#2F6B3C] border border-[#2F6B3C]/20 hover:bg-[#2F6B3C] hover:text-white transition-all"
              >
                <Filter size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </motion.div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-[#222]">Filter Properties</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#2F6B3C] hover:underline flex items-center gap-1"
                    >
                      <X size={14} />
                      Clear Filters
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Location Filter */}
                    <div>
                      <label className="block text-xs text-[#666] mb-2">Location</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full p-2 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C]"
                      >
                        <option value="All Locations">All Locations</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <label className="block text-xs text-[#666] mb-2">Price Range</label>
                      <select
                        value={selectedPriceRange.label}
                        onChange={(e) => {
                          const range = priceRanges.find(r => r.label === e.target.value);
                          setSelectedPriceRange(range);
                        }}
                        className="w-full p-2 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C]"
                      >
                        {priceRanges.map(range => (
                          <option key={range.label} value={range.label}>{range.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          {filteredLands.length > 0 && (
            <div className="mb-6 text-sm text-[#666]">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredLands.length)} of {filteredLands.length} properties
            </div>
          )}

          {/* Property Cards */}
          {currentItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((land, index) => (
                <motion.div
                  key={land.id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={cardVariants}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition"
                >
                  {/* Image */}
                  <div className="h-48 sm:h-56 overflow-hidden relative">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={getImageUrl(land.mainImage)}
                      alt={land.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-[#222] line-clamp-1">
                        {land.title}
                      </h3>
                    </div>
                    
                    <p className="text-[#666] text-sm mb-2">{land.location}</p>
                    <p className="text-[#666] text-xs mb-3">{land.size}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#1F4E2F] font-semibold text-lg">
                        {land.priceFormatted}
                      </span>
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
            <div className="text-center py-16">
              <p className="text-[#666] text-lg">No properties match your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[#2F6B3C] hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${
                  currentPage === 1 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-[#2F6B3C] text-[#2F6B3C] hover:bg-[#2F6B3C] hover:text-white'
                } transition`}
              >
                <ChevronLeft size={20} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-lg border ${
                    currentPage === i + 1
                      ? 'bg-[#2F6B3C] text-white border-[#2F6B3C]'
                      : 'border-[#2F6B3C]/20 text-[#2F6B3C] hover:bg-[#2F6B3C] hover:text-white'
                  } transition`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border ${
                  currentPage === totalPages
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-[#2F6B3C] text-[#2F6B3C] hover:bg-[#2F6B3C] hover:text-white'
                } transition`}
              >
                <ChevronRight size={20} />
              </button>
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
                  {/* Images */}
                  {selectedListing.images && selectedListing.images.length > 0 && (
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-[#2F6B3C] mb-2">Images</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {selectedListing.images.slice(0, 4).map((img, i) => (
                          <div key={i} className="aspect-square bg-[#2F6B3C]/10 rounded-lg overflow-hidden">
                            <img 
                              src={getImageUrl(img)}
                              alt={`${selectedListing.title} ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = getImageUrl(selectedListing.mainImage);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-[#2F6B3C] mb-2">Description</h3>
                    <div className="bg-[#F6F4ED] p-4 rounded-lg">
                      <p className="text-sm text-[#666] leading-relaxed">
                        {selectedListing.additional_info || (
                          <span className="text-[#999] italic">
                            No additional information available for this listing
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-[#666] mb-1">Price</p>
                      <p className="text-sm sm:text-base text-[#2F6B3C] font-semibold">{selectedListing.priceFormatted}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#666] mb-1">Location</p>
                      <p className="text-sm text-[#222]">{selectedListing.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#666] mb-1">Size</p>
                      <p className="text-sm text-[#222]">{selectedListing.size}</p>
                    </div>
                    {selectedListing.acres > 0 && (
                      <div>
                        <p className="text-xs text-[#666] mb-1">Acres</p>
                        <p className="text-sm text-[#222]">{selectedListing.acres} acres</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="py-2 sm:py-3 border border-[#2F6B3C] text-[#2F6B3C] rounded-lg hover:bg-[#2F6B3C] hover:text-white transition text-sm sm:text-base"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        window.open(
                          `/inquiry?property=${selectedListing.id}&title=${encodeURIComponent(selectedListing.title)}`,
                          "_blank"
                        );
                      }}
                      className="w-full py-2 sm:py-3 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition text-sm sm:text-base"
                    >
                      Inquire Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}