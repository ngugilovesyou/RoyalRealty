import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Eye, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import Head from "../Head";
import {
  fetchLandsWithTransform,
  getImageUrl,
  DEFAULT_IMAGE,
  getUniqueLocations,
} from "../../api/api";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under Ksh 2M", min: 0, max: 2000000 },
  { label: "Ksh 2M - 5M", min: 2000000, max: 5000000 },
  { label: "Ksh 5M - 10M", min: 5000000, max: 10000000 },
  { label: "Ksh 10M - 20M", min: 10000000, max: 20000000 },
  { label: "Above Ksh 20M", min: 20000000, max: Infinity },
];

const ITEMS_PER_PAGE = 6;

// Created once. Building an Intl.NumberFormat is slow, so don't do it per card.
const priceFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 0,
});

const parsePrice = (price) =>
  price ? parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0 : 0;

const formatPrice = (price) => {
  if (!price) return "Price on request";
  const num = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return price;
  return priceFormatter.format(num).replace("KES", "Ksh");
};

// Entrance animation: CSS only (opacity + transform are compositor-only)
const styles = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
.fade-up { animation: fadeUp .5s ease-out both; animation-delay: calc(var(--i, 0) * 60ms); }
@media (prefers-reduced-motion: reduce) { .fade-up { animation: none; } }
`;

function LandCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse" aria-hidden="true">
      <div className="h-48 sm:h-56 bg-gray-200" />
      <div className="p-5">
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-1/3 bg-gray-200 rounded mb-4" />
        <div className="flex justify-between items-center">
          <div className="h-6 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function LandsForSale() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await fetchLandsWithTransform();
        if (active) setLands(data);
      } catch (err) {
        console.error("Failed to fetch lands:", err);
        if (active) {
          setError(true);
          toast.error("Failed to load properties. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Derived data: no extra state, no extra render pass
  const locations = useMemo(() => getUniqueLocations(lands), [lands]);

  const filteredLands = useMemo(() => {
    return lands.filter((land) => {
      if (selectedLocation !== "All Locations" && land.location !== selectedLocation) return false;
      const p = parsePrice(land.price);
      return p >= selectedPriceRange.min && p <= selectedPriceRange.max;
    });
  }, [lands, selectedLocation, selectedPriceRange]);

  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
  const indexOfLastItem = indexOfFirstItem + ITEMS_PER_PAGE;
  const currentItems = filteredLands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLands.length / ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedPriceRange(priceRanges[0]);
    setCurrentPage(1);
  };

  const paginate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const locationSuffix = selectedLocation !== "All Locations" ? ` in ${selectedLocation}` : "";

  return (
    <>
      <style>{styles}</style>
      <Head
        title={`${selectedLocation !== "All Locations" ? `${selectedLocation} - ` : ""}Lands & Plots for Sale | Royal Realty`}
        description={
          loading
            ? "Browse our collection of lands and plots for sale across Kenya."
            : `Explore ${filteredLands.length} lands and plots for sale${locationSuffix}.`
        }
        keywords={`land for sale, plots for sale${selectedLocation !== "All Locations" ? `, ${selectedLocation} land` : ""}, real estate Kenya`}
        url="https://royalrealty.co.ke/projects"
        type="website"
      />
      <Navbar />
      <section className="bg-[#F6F4ED] min-h-screen py-24 px-6" aria-label="Lands for sale">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div className="fade-up">
              <p className="text-xs uppercase tracking-[0.18em] text-[#2F6B3C] mb-3">
                Properties For Sale
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-[#222]">
                Lands & Plots
              </h1>
            </div>

            <button
              onClick={() => setShowFilters((s) => !s)}
              disabled={loading}
              className="fade-up flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-[#2F6B3C] border border-[#2F6B3C]/20 hover:bg-[#2F6B3C] hover:text-white transition-colors disabled:opacity-50"
            >
              <Filter size={18} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && !loading && (
            <div className="fade-up mb-8 bg-white p-6 rounded-xl shadow-sm">
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
                  <label htmlFor="loc" className="block text-xs text-[#666] mb-2">Location</label>
                  <select
                    id="loc"
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C]"
                  >
                    <option value="All Locations">All Locations</option>
                    {locations.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-xs text-[#666] mb-2">Price Range</label>
                  <select
                    id="price"
                    value={selectedPriceRange.label}
                    onChange={(e) => {
                      setSelectedPriceRange(priceRanges.find((r) => r.label === e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C]"
                  >
                    {priceRanges.map((r) => (
                      <option key={r.label} value={r.label}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="mb-6 text-sm text-[#666] min-h-[20px]">
            {loading ? (
              <div className="h-4 w-52 bg-gray-200 rounded animate-pulse" />
            ) : (
              filteredLands.length > 0 &&
              `Showing ${indexOfFirstItem + 1}–${Math.min(indexOfLastItem, filteredLands.length)} of ${filteredLands.length} properties`
            )}
          </div>

          {/* Cards */}
          {loading ? (
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              role="status"
              aria-label="Loading properties"
            >
              {Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
                <LandCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-[#666] text-lg">We couldn't load the properties.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-[#2F6B3C] hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : currentItems.length > 0 ? (
            <div
              key={`${currentPage}-${selectedLocation}-${selectedPriceRange.label}`}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentItems.map((land, i) => (
                <div
                  key={land.id}
                  style={{ "--i": i }}
                  className="fade-up group bg-white rounded-xl overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="h-48 sm:h-56 overflow-hidden">
                    <img
                      src={getImageUrl(land.mainImage)}
                      alt={land.title}
                      width="400"
                      height="224"
                      loading={i < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-[#222] line-clamp-1 mb-2">{land.title}</h3>
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
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-[#2F6B3C] text-[#2F6B3C] hover:bg-[#2F6B3C] hover:text-white"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-lg border transition-colors ${
                    currentPage === i + 1
                      ? "bg-[#2F6B3C] text-white border-[#2F6B3C]"
                      : "border-[#2F6B3C]/20 text-[#2F6B3C] hover:bg-[#2F6B3C] hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-[#2F6B3C] text-[#2F6B3C] hover:bg-[#2F6B3C] hover:text-white"
                }`}
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