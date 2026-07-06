import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import Head from "../Head";
import { fetchLandsWithTransform, getImageUrl, DEFAULT_IMAGE, getUniqueLocations } from "../../api/api";

gsap.registerPlugin(ScrollTrigger);

// Price ranges for filter
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under Ksh 2M", min: 0, max: 2000000 },
  { label: "Ksh 2M - 5M", min: 2000000, max: 5000000 },
  { label: "Ksh 5M - 10M", min: 5000000, max: 10000000 },
  { label: "Ksh 10M - 20M", min: 10000000, max: 20000000 },
  { label: "Above Ksh 20M", min: 20000000, max: Infinity }
];

export default function LandsForSale() {
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Refs for GSAP targets
  const headerLeftRef = useRef(null);
  const headerRightRef = useRef(null);
  const filtersRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // Animate header on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerLeftRef.current, {
        opacity: 0, x: -30, duration: 0.6, ease: "power2.out"
      });
      gsap.from(headerRightRef.current, {
        opacity: 0, x: 30, duration: 0.6, ease: "power2.out"
      });
    });
    return () => ctx.revert();
  }, []);

  // Animate cards whenever currentItems changes
  useEffect(() => {
    if (!cardsContainerRef.current) return;
    const cards = cardsContainerRef.current.querySelectorAll(".land-card");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: "top 85%",
          once: true
        }
      });
    });
    return () => ctx.revert();
  }, [currentPage, filteredLands]);

  // Animate filters panel open/close
  useEffect(() => {
    const el = filtersRef.current;
    if (!el) return;

    if (showFilters) {
      gsap.fromTo(el,
        { opacity: 0, height: 0 },
        { opacity: 1, height: "auto", duration: 0.35, ease: "power2.out", overflow: "visible" }
      );
    } else {
      gsap.to(el, {
        opacity: 0, height: 0, duration: 0.3, ease: "power2.in",
        onComplete: () => { el.style.overflow = "hidden"; }
      });
    }
  }, [showFilters]);

  // Fetch lands
  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoading(true);
        const transformedLands = await fetchLandsWithTransform();
        setLands(transformedLands);
        setFilteredLands(transformedLands);
        setLocations(getUniqueLocations(transformedLands));
      } catch (err) {
        console.error("Failed to fetch lands:", err);
        toast.error("Failed to load properties. Please refresh the page.");
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
    if (selectedLocation !== "All Locations") {
      filtered = filtered.filter(land => land.location === selectedLocation);
    }
    filtered = filtered.filter(land => {
      let priceValue = 0;
      if (land.price) {
        const cleaned = String(land.price).replace(/[^0-9.]/g, '');
        priceValue = parseFloat(cleaned) || 0;
      }
      return priceValue >= selectedPriceRange.min && priceValue <= selectedPriceRange.max;
    });
    setFilteredLands(filtered);
    setCurrentPage(1);
  }, [selectedLocation, selectedPriceRange, lands]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLands.length / itemsPerPage);

  const clearFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedPriceRange(priceRanges[0]);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    const cleaned = String(price).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat('en-KE', {
      style: 'currency', currency: 'KES', minimumFractionDigits: 0
    }).format(num).replace('KES', 'Ksh');
  };

  // Card hover handlers (replaces whileHover)
  const handleCardEnter = (e) => {
    gsap.to(e.currentTarget, { y: -10, duration: 0.3, ease: "power2.out" });
  };
  const handleCardLeave = (e) => {
    gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: "power2.out" });
  };
  const handleImgEnter = (e) => {
    gsap.to(e.currentTarget.querySelector("img"), { scale: 1.1, duration: 0.6, ease: "power2.out" });
  };
  const handleImgLeave = (e) => {
    gsap.to(e.currentTarget.querySelector("img"), { scale: 1, duration: 0.6, ease: "power2.out" });
  };

  if (loading) {
    return (
      <>
        <Head
          title="Lands & Plots for Sale | Royal Realty"
          description="Browse our collection of lands and plots for sale across Kenya."
          keywords="land for sale, plots for sale, real estate Kenya, land investment"
          type="website"
          url="https://royalrealty.co.ke/lands"
        />
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
      <Head
        title={`${selectedLocation !== "All Locations" ? `${selectedLocation} - ` : ''}Lands & Plots for Sale | Royal Realty`}
        description={`Explore ${filteredLands.length} lands and plots for sale${selectedLocation !== "All Locations" ? ` in ${selectedLocation}` : ''}.`}
        keywords={`land for sale, plots for sale${selectedLocation !== "All Locations" ? `, ${selectedLocation} land` : ''}, real estate Kenya`}
        url="https://royalrealty.co.ke/lands"
        type="website"
      />
      <Navbar />
      <section className="bg-[#F6F4ED] min-h-screen py-24 px-6" aria-label="Lands for sale">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div ref={headerLeftRef}>
              <p className="text-xs uppercase tracking-[0.18em] text-[#2F6B3C] mb-3">
                Properties For Sale
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-[#222]">
                Lands & Plots
              </h1>
            </div>

            <div ref={headerRightRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-[#2F6B3C] border border-[#2F6B3C]/20 hover:bg-[#2F6B3C] hover:text-white transition-all"
              >
                <Filter size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {/* Filters panel — always rendered, GSAP controls visibility */}
          <div ref={filtersRef} style={{ overflow: "hidden", height: 0, opacity: 0 }} className="mb-8">
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
          </div>

          {/* Results Count */}
          {filteredLands.length > 0 && (
            <div className="mb-6 text-sm text-[#666]">
              Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredLands.length)} of {filteredLands.length} properties
            </div>
          )}

          {/* Property Cards */}
          {currentItems.length > 0 ? (
            <div ref={cardsContainerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((land) => (
                <div
                  key={land.id}
                  className="land-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                >
                  <div
                    className="h-48 sm:h-56 overflow-hidden relative"
                    onMouseEnter={handleImgEnter}
                    onMouseLeave={handleImgLeave}
                  >
                    <img
                      src={getImageUrl(land.mainImage)}
                      alt={land.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-[#222] line-clamp-1">{land.title}</h3>
                    </div>
                    <p className="text-[#666] text-sm mb-2">{land.location}</p>
                    <p className="text-[#666] text-xs mb-3">{land.size}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#1F4E2F] font-semibold text-lg">
                        {formatPrice(land.price)}
                      </span>
                      <Link
                        to={`/lands/${land.slug}`}
                        className="flex items-center gap-1 text-sm text-[#2F6B3C] hover:underline"
                      >
                        <Eye size={14} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#666] text-lg">No properties match your filters.</p>
              <button onClick={clearFilters} className="mt-4 text-[#2F6B3C] hover:underline">
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
      </section>
    </>
  );
}