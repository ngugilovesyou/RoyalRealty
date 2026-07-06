import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // TEXT ANIMATION
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

      // LEFT IMAGE (light animation)
      gsap.from(leftImgRef.current, {
        opacity: 0,
        x: -60,
        rotate: -10,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // RIGHT IMAGE
      gsap.from(rightImgRef.current, {
        opacity: 0,
        x: 60,
        rotate: 10,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-[#F6F4ED] py-28 overflow-hidden"
    >
      {/* Floating Image 1 */}
      <div
        ref={leftImgRef}
        className="hidden lg:block absolute left-12 top-28 will-change-transform"
      >
        <div className="w-64 overflow-hidden rounded-3xl shadow-2xl rotate-[-8deg]">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"
            className="h-80 w-full object-cover"
            loading="lazy"
            decoding="async"
            alt="real estate"
          />
        </div>
      </div>

      {/* Floating Image 2 */}
      <div
        ref={rightImgRef}
        className="hidden lg:block absolute right-16 bottom-20 will-change-transform"
      >
        <div className="w-72 overflow-hidden rounded-3xl shadow-2xl rotate-[6deg]">
          <img
            src="https://res.cloudinary.com/dxwzdftzm/image/upload/v1782117376/siva-xu-tXi-fAdCqWg-unsplash_xyjq7r.jpg"
            className="h-96 w-full object-cover"
            loading="lazy"
            decoding="async"
            alt="landscape"
          />
        </div>
      </div>

      {/* CONTENT */}
      <div
        ref={contentRef}
        className="max-w-5xl mx-auto px-6 relative z-10"
      >
        <p className="text-center text-xs uppercase tracking-[0.3em] text-[#2F6B3C] mb-6">
          Who Are We?
        </p>

        <h2 className="text-center font-serif text-5xl md:text-6xl leading-tight text-[#222]">
          A modern real estate
          <br />
          brokerage built for
          <br />
          <span className="italic text-[#2F6B3C]">
            today's market
          </span>
        </h2>

        <div className="max-w-3xl mx-auto mt-14">
          <p className="text-xl leading-relaxed text-[#555] text-center">
            Royal Realty is a real estate brokerage designed for today's market. Our brand proudly serves everyone, from first-time land buyers to clients searching for the perfect piece of land to build their dream home.
          </p>

          <p className="text-xl leading-relaxed text-[#555] text-center mt-8">
            When you work with us, you can always expect team members who are down-to-earth local experts focused on providing you with the very best in service, skills, and support throughout your investment journey.
          </p>
        </div>

        
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 text-center">
          <div>
            <h3 className="text-4xl font-serif text-[#2F6B3C]">5+</h3>
            <p className="text-sm uppercase tracking-widest text-[#666] mt-2">
              Years Experience
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-serif text-[#2F6B3C]">50+</h3>
            <p className="text-sm uppercase tracking-widest text-[#666] mt-2">
              Acres Sold
            </p>
          </div>

          <div>
            <h3 className="text-4xl font-serif text-[#2F6B3C]">100%</h3>
            <p className="text-sm uppercase tracking-widest text-[#666] mt-2">
              Verified Titles
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}