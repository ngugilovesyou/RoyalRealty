import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const images = [
  "https://res.cloudinary.com/dxwzdftzm/image/upload/v1782053049/nathan-cima-mh77deZj7_I-unsplash_llqaqh.jpg",
  
];

  useEffect(() => {
    let ctx;

    
    const timeout = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.from(titleRef.current.querySelectorAll("h1"), {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
        });

        gsap.from(".hero-btn", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
        });

        gsap.from(".stat-item", {
          y: 15,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
        });

        gsap.to(".floating-card", {
          y: 10,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.15,
        });

        
        gsap.to(".orbit-ring", {
          rotate: 360,
          duration: 60,
          repeat: -1,
          ease: "none",
        });
      }, heroRef);
    }, 150);

    return () => {
      clearTimeout(timeout);
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden bg-black">

      
      <div className="absolute inset-0">
        <img
          src={images[0]}
          alt="Royal Realty Hero"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover scale-105"
        />
      </div>

      
      <div className="absolute inset-0 bg-gradient-to-r from-[#07120a]/90 via-[#12331c]/70 to-transparent" />

      
      <div className="orbit-ring absolute right-20 top-20 w-[400px] h-[400px] rounded-full border border-[#A8D4B0]/20" />

      
      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-6 md:px-8">

        <div className="max-w-2xl">

          <div className="text-[#A8D4B0] uppercase tracking-[0.3em] text-[10px] mb-4">
            Modern Real Estate Brokerage
          </div>

          <div ref={titleRef}>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-none">
              Invest in Land.
            </h1>

            <h1 className="font-serif italic text-5xl md:text-7xl text-[#A8D4B0]">
              Secure Your Future.
            </h1>
          </div>

          <p className="mt-6 text-white/80 text-base md:text-xl leading-relaxed max-w-xl">
            Explore premium land projects built for long-term wealth creation.
          </p>

          <div className="flex gap-3 mt-8">
            <Link to="/projects" className="hero-btn px-6 py-3 bg-[#2F6B3C] text-white">
              View Projects
            </Link>

            <Link to="/contact-us" className="hero-btn px-6 py-3 border border-white text-white">
              Book Site Visit
            </Link>
          </div>

          <div className="flex gap-8 mt-10">
            <div className="stat-item">
              <h3 className="text-white text-2xl">50+</h3>
              <p className="text-white/60 text-xs">Locations</p>
            </div>

            <div className="stat-item">
              <h3 className="text-white text-2xl">100%</h3>
              <p className="text-white/60 text-xs">Verified</p>
            </div>

            <div className="stat-item">
              <h3 className="text-white text-2xl">Title Deeds</h3>
              <p className="text-white/60 text-xs">Guaranteed</p>
            </div>
          </div>
        </div>

        

      </div>
    </section>
  );
}

