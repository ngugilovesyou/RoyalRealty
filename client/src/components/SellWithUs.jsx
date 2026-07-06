import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SellWithUs() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const imgLeftRef = useRef(null);
  const imgRightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // MAIN CONTENT (single animation = cheaper)
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // TRUST CARD
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // LEFT IMAGE
      gsap.from(imgLeftRef.current, {
        opacity: 0,
        x: -80,
        rotate: -8,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      // RIGHT IMAGE
      gsap.from(imgRightRef.current, {
        opacity: 0,
        x: 80,
        rotate: 6,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sell"
      className="relative bg-[#F6F4ED] py-28 overflow-hidden"
    >
      {/* RIGHT IMAGE */}
      <div
        ref={imgRightRef}
        className="hidden lg:block absolute right-10 top-24 will-change-transform"
      >
        <div className="w-80 overflow-hidden rounded-[32px] shadow-2xl rotate-[5deg]">
          <img
            src="https://res.cloudinary.com/dxwzdftzm/image/upload/v1782117235/joseph-malone-ryfkelQAEbA-unsplash_x3unhe.jpg"
            loading="lazy"
            decoding="async"
            alt="sell property"
            className="h-[420px] w-full object-cover"
          />
        </div>
      </div>

      {/* LEFT IMAGE */}
      <div
        ref={imgLeftRef}
        className="hidden lg:block absolute left-10 bottom-16 will-change-transform"
      >
        <div className="w-64 overflow-hidden rounded-[28px] shadow-xl rotate-[-7deg]">
          <img
            src="https://res.cloudinary.com/dxwzdftzm/image/upload/v1782117040/abbas-tehrani-9HHBhTULZ_o-unsplash_cs7aus.jpg"
            loading="lazy"
            decoding="async"
            alt="real estate"
            className="h-72 w-full object-cover"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div
        ref={contentRef}
        className="max-w-6xl mx-auto px-6 relative z-10"
      >
        {/* Label */}
        <p className="text-xs uppercase tracking-[0.3em] text-[#2F6B3C] mb-4">
          Sell With Us
        </p>

        {/* Heading */}
        <h2 className="font-serif text-5xl md:text-6xl text-[#222] leading-tight max-w-3xl">
          Hard Decision
          <br />
          Made Easy.
        </h2>

        {/* GRID */}
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-20 mt-16 items-start">
          
         
          <div className="space-y-8">
            <p className="text-lg leading-relaxed text-[#555]">
             For many, selling land is one of the largest decisions in a lifetime, and we don't take that responsibility lightly. With our "client first" philosophy, we'll be there for you every step of the way.
            </p>

            <p className="text-lg leading-relaxed text-[#555]">
              We're a business that prides itself on honesty, integrity, and purpose. When you list with us, we will know your land like it's our own, amplify your listing's exposure, maximize your return, and make your experience as frictionless as possible.
            </p>

            <p className="text-lg leading-relaxed text-[#555]">
              Our clients become long-term partners.
            </p>

            
            <Link
              to="/sell-with-us"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#2F6B3C] text-white uppercase tracking-widest text-sm shadow-lg hover:bg-[#3D8A4F] transition"
            >
              Start Selling Today →
            </Link>
          </div>

          {/* CARD */}
          <div ref={cardRef}>
            <div className="bg-white rounded-[32px] p-10 shadow-xl border border-[#E7E2D6]">
              
              <div className="mb-8">
                <h3 className="font-serif text-5xl text-[#2F6B3C]">100%</h3>
                <p className="uppercase tracking-widest text-sm text-[#777] mt-2">
                  Client Focused
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-serif text-5xl text-[#2F6B3C]">Maximum</h3>
                <p className="uppercase tracking-widest text-sm text-[#777] mt-2">
                  Listing Exposure
                </p>
              </div>

              <div>
                <h3 className="font-serif text-5xl text-[#2F6B3C]">Local</h3>
                <p className="uppercase tracking-widest text-sm text-[#777] mt-2">
                  Market Experts
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}