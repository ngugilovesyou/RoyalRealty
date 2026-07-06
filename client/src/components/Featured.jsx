import { Link } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { getImageUrl,
  fetchFeaturedLands, 
  transformFeaturedLands, 
  formatPrice,
  DEFAULT_IMAGE
 } from "../api/api";

export default function FeaturedLands() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFeaturedLands();
        const transformedData = transformFeaturedLands(data);
        setLands(transformedData);
      } catch (err) {
        console.error("Failed to fetch featured lands:", err);
        setError(err.message || "Failed to load featured properties");
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  return (
    <section id="lands" className="bg-[#2F6B3C] py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-end mb-14 flex-wrap gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#A8D4B0] mb-3">
              Featured Land
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-white">
              Land Available for Investment
            </h2>
          </div>

          <Link
            to="/projects"
            className="flex items-center gap-2 text-[#A8D4B0] text-sm uppercase tracking-widest hover:gap-3 transition-all"
          >
            View All Listings
            <ArrowRight size={18} />
          </Link>
        </div>

        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center text-white/80 py-12">
            <p className="mb-2">🌿 Failed to Get Lands</p>
            <p className="text-sm text-white/60 mb-4">Please try refreshing the page</p>
            <button
              onClick={() => window.location.reload()}
              className="py-2 px-4 bg-[#A8D4B0] text-[#2F6B3C] rounded-lg font-semibold hover:bg-[#8CBF96] transition"
            >
              Try Again
            </button>
          </div>
        ) : lands.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {lands.map((land) => (
              <div
                key={land.id}
                className="
                  group bg-white rounded-xl overflow-hidden shadow-sm
                  hover:shadow-xl transition-transform duration-300
                  hover:-translate-y-2
                "
              >
                {/* IMAGE */}
                <div className="h-60 overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(land.mainImage)}
                    alt={land.title}
                    loading="lazy"
                    decoding="async"
                    className="
                      w-full h-full object-cover
                      transform group-hover:scale-105
                      transition-transform duration-500
                    "
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="font-serif text-xl text-[#222] mb-2 line-clamp-1">
                    {land.title}
                  </h3>

                  <p className="text-[#666] text-sm mb-3">
                    {land.location}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-[#1F4E2F] font-semibold">
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
          <div className="text-center text-white py-12">
            <p className="mb-4 text-lg">No featured properties available at the moment.</p>
            <p className="text-sm text-white/70 mb-6">
              Check back soon or list your property with us.
            </p>
            <Link
              to="/sell-with-us"
              className="inline-block py-3 px-6 bg-[#A8D4B0] text-[#2F6B3C] rounded-lg font-semibold hover:bg-[#8CBF96] transition"
            >
              Sell With Us
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}