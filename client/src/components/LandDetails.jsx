import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { 
  fetchPropertyBySlug, 
  formatKsh, 
  getPropertyFacts, 
  getSideDetails, 
  getAllImages 
} from "../api/api";
import Head from "./Head";

export default function LandDetails() {
  const { slug } = useParams();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLand = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPropertyBySlug(slug);
        setLand(data);
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError(err.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchLand();
    }
  }, [slug]);

  const allImages = getAllImages(land);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevImage = useCallback(
    () => setLightbox((i) => (i - 1 + allImages.length) % allImages.length),
    [allImages.length]
  );
  const nextImage = useCallback(
    () => setLightbox((i) => (i + 1) % allImages.length),
    [allImages.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, prevImage, nextImage]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f1eb]">
        <div className="w-8 h-px bg-[#b08d57] animate-pulse" />
      </div>
    );
  }

  if (error || !land) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f1eb] px-6">
        <p className="font-serif text-lg text-[#7a6f60] mb-4">
          {error || "Property not found."}
        </p>
        <button
          onClick={() => window.location.href = "/lands"}
          className="text-[#b08d57] hover:underline text-sm"
        >
          ← Back to properties
        </button>
      </div>
    );
  }

  const facts = getPropertyFacts(land);
  const sideDetails = getSideDetails(land);

  return (
    <>
      <Head
  title={
    land?.title
      ? `${land.title} | Royal Realty Kenya`
      : "Royal Realty Kenya"
  }
  description={
    land
      ? `${land.size || "Prime"} land for sale in ${land.town || "Kenya"}, ${land.county || ""}. ${
          land.price ? `Ksh ${formatKsh(land.price)}.` : "Contact for pricing."
        }`
      : "Royal Realty Kenya - Verified land and property listings in Kenya."
  }
  url={`https://royalrealty.co.ke/lands/${land.slug || slug}`}
  image={land?.mainImage || land?.images?.[0]}
  type="website"
/>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button
            className="fixed top-4 right-4 z-50 w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 text-sm hover:text-white hover:border-white/40 transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev */}
          <button
            className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center border border-white/15 text-white/50 hover:text-white hover:border-white/35 transition-colors"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous"
          >
            ←
          </button>

          <img
            src={allImages[lightbox]}
            alt={`${land.title} — photo ${lightbox + 1}`}
            className="max-w-[88vw] max-h-[86vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center border border-white/15 text-white/50 hover:text-white hover:border-white/35 transition-colors"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next"
          >
            →
          </button>

          {/* Counter */}
          <span className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.18em] text-white/35 font-['Jost']">
            {lightbox + 1} / {allImages.length}
          </span>
        </div>
      )}

      <div className="bg-[#f4f1eb] min-h-screen font-['Jost'] text-[#1c1a17]">

        {/* ── Hero ── */}
        <div
          className="relative h-[55vw] min-h-[280px] max-h-[680px] overflow-hidden cursor-zoom-in"
          onClick={() => setLightbox(0)}
        >
          <img
            src={land.main_image}
            alt={land.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

          {/* Text — bottom left on all sizes */}
          <div className="absolute bottom-6 left-5 md:bottom-10 md:left-10 max-w-[85%] md:max-w-xl">
            <p className="text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#b5a06e]/90 font-['Jost'] font-light mb-2">
              {land.town}&nbsp;&nbsp;—&nbsp;&nbsp;{land.county}
            </p>
            <h1 className="font-['Cormorant_Garamond'] font-light italic text-white leading-tight text-3xl sm:text-4xl md:text-5xl">
              {land.title}
            </h1>
          </div>

          {/* Photo hint — only md+ */}
          <span className="hidden md:block absolute bottom-4 right-5 text-[10px] tracking-[0.14em] uppercase text-white/30 font-light">
            Tap to view ↗
          </span>
        </div>

        {/* ── Body ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-10 lg:gap-16 items-start">

            {/* ── Left ── */}
            <div>
              <h2 className="font-['Cormorant_Garamond'] font-normal text-xl md:text-2xl text-[#1c1a17] border-b border-[#b08d57]/25 pb-3 mb-4">
                About this property
              </h2>
              <p className="font-['Jost'] font-light text-sm md:text-[15px] leading-[1.9] text-[#4e4539] mb-8">
                {land.additional_info || "No additional information available."}
              </p>

              {/* Facts */}
              <div className="flex flex-wrap gap-x-8 gap-y-4 mb-12">
                {facts.map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-[#b08d57] font-light mb-1">
                      {label}
                    </p>
                    <p className="font-['Cormorant_Garamond'] font-normal text-[17px] text-[#1c1a17]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Gallery */}
              {land.images?.length > 0 && (
                <>
                  <h2 className="font-['Cormorant_Garamond'] font-normal text-xl md:text-2xl text-[#1c1a17] border-b border-[#b08d57]/25 pb-3 mb-4">
                    Photos
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {land.images.map((img, idx) => (
                      <button
                        key={idx}
                        className="relative overflow-hidden aspect-[4/3] group block border-0 p-0 bg-transparent cursor-zoom-in"
                        onClick={() => setLightbox(idx + 1)}
                        aria-label={`Open photo ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${land.title} photo ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ── Sidebar — sticky on desktop, bottom sheet trigger on mobile ── */}
            <aside className="lg:sticky lg:top-24">

              {/* Mobile: floating bar at bottom */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1c1a17] flex items-center justify-between px-5 py-4 border-t border-[#b08d57]/20">
                <div>
                  <p className="text-[9px] tracking-[0.18em] uppercase text-[#b08d57]/70 font-light mb-0.5">Price</p>
                  <p className="font-['Cormorant_Garamond'] font-light text-white text-xl leading-none">
                    <span className="font-['Jost'] text-xs text-[#7a6f60] mr-1">Ksh</span>
                    {formatKsh(land.price)}
                  </p>
                </div>
                <button
                  className="bg-[#b08d57] text-[#1c1a17] font-['Jost'] font-light text-[10px] tracking-[0.2em] uppercase px-5 py-3 hover:bg-[#c9a86a] transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  Inquire
                </button>
              </div>

              {/* Mobile: sheet overlay */}
              {sidebarOpen && (
                <div
                  className="lg:hidden fixed inset-0 z-50 flex items-end"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div
                    className="w-full bg-white border-t border-[#b08d57]/30 p-6 pb-10 max-h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-5">
                      <p className="font-['Cormorant_Garamond'] font-light text-xl text-[#1c1a17]">
                        Property details
                      </p>
                      <button
                        className="text-[#7a6f60] text-sm hover:text-[#1c1a17] transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <PropertyCard land={land} sideDetails={sideDetails} />
                  </div>
                </div>
              )}

              {/* Desktop card — always visible */}
              <div className="hidden lg:block">
                <PropertyCard land={land} sideDetails={sideDetails} />
              </div>
            </aside>

          </div>
        </div>

        {/* Spacer so mobile content doesn't hide behind the bottom bar */}
        <div className="h-20 lg:hidden" />
      </div>
    </>
  );
}

function PropertyCard({ land, sideDetails }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white border border-[#b08d57]/30 p-6 md:p-7">
      <p className="text-[9px] tracking-[0.2em] uppercase text-[#7a6f60] font-light mb-1.5">
        Price
      </p>
      <p className="font-['Cormorant_Garamond'] font-light text-[#1c1a17] text-3xl leading-none mb-1">
        <span className="font-['Jost'] text-xs text-[#7a6f60] mr-1.5">Ksh</span>
        {formatKsh(land.price)}
      </p>

      <div className="h-px bg-[#b08d57]/20 my-5" />

      <table className="w-full">
        <tbody>
          {sideDetails.map(([label, val]) => (
            <tr key={label} className="border-b border-[#b08d57]/10 last:border-0">
              <td className="py-2.5 text-[10px] tracking-[0.06em] text-[#7a6f60] font-light w-[40%]">
                {label}
              </td>
              <td className="py-2.5 text-[13px] text-[#1c1a17] font-light text-right">
                {val}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="h-px bg-[#b08d57]/20 my-5" />

      <button 
        className="w-full bg-[#1c1a17] text-[#e8dcc8] font-['Jost'] font-light text-[10px] tracking-[0.22em] uppercase py-3.5 hover:bg-[#b08d57] hover:text-[#1c1a17] transition-colors duration-200"
        onClick={() => {
          navigate(`/inquiry/${land.slug}`);
        }}
      >
        Inquire
      </button>
    </div>
  );
}