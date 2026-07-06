import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".test-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(".float-y", {
        y: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F6F4ED] py-32 overflow-hidden"
    >
      
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,#2F6B3C22,transparent_60%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        
        <p className="text-xs uppercase tracking-[0.3em] text-[#2F6B3C] mb-4">
          Client Stories
        </p>

        
        <h2 className="font-serif text-4xl md:text-6xl text-[#222] leading-tight mb-16">
          Trusted by investors
          <br />
          <span className="italic text-[#2F6B3C]">
            across Kenya
          </span>
        </h2>

        
        <div className="grid lg:grid-cols-3 gap-10 items-center">

          
          <div className="test-card float-y lg:translate-y-10">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#E7E2D6] text-left">
              <p className="text-[#555] leading-relaxed">
                “I bought my first plot in Kitengela through Royal Realty.
                The process was smooth, transparent, and I always felt informed.”
              </p>

              <div className="mt-6">
                <p className="font-medium text-[#2F6B3C]">
                  — James Mwangi
                </p>
                <p className="text-xs text-[#888]">
                  First-time Land Buyer
                </p>
              </div>
            </div>
          </div>

          {/* Center featured testimonial */}
          <div className="test-card relative">
            <div className="bg-[#2F6B3C] text-white rounded-[36px] p-10 shadow-2xl text-left">
              <p className="text-lg leading-relaxed">
                “Royal Realty helped us acquire multiple acres for our
                agricultural project. Their understanding of land value
                and legal processes gave us full confidence.”
              </p>

              <div className="mt-8">
                <p className="font-serif text-2xl">
                  Esther & David
                </p>
                <p className="text-sm text-white/70">
                  Agricultural Investors — Naivasha
                </p>
              </div>

              {/* Quote mark decoration */}
              <div className="absolute top-6 right-8 text-7xl text-white/10 font-serif">
                ”
              </div>
            </div>
          </div>

          {/* Right floating card */}
          <div className="test-card float-y lg:translate-y-16">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#E7E2D6] text-left">
              <p className="text-[#555] leading-relaxed">
                “What stood out was honesty. No hidden fees, no pressure —
                just real guidance from people who know the market.”
              </p>

              <div className="mt-6">
                <p className="font-medium text-[#2F6B3C]">
                  — Brian Otieno
                </p>
                <p className="text-xs text-[#888]">
                  Real Estate Investor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust line */}
        <div className="mt-20 text-[#666] text-sm max-w-2xl mx-auto">
          Every transaction is handled with transparency, due diligence,
          and a commitment to long-term client relationships.
        </div>
      </div>
    </section>
  );
}