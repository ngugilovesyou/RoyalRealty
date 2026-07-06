import { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Head from "../components/Head";
import Hero from "../components/Hero";
import About from "../components/About";
import FeaturedLands from "../components/Featured";
import SellWithUs from "../components/SellWithUs";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonial";

export default function HomePage() {
  return (
    <>
      <Head 
        title="Royal Realty – Modern Real Estate Brokerage"
        description="Royal Realty is a real estate brokerage designed for today's market..."
        keywords="real estate, land for sale, property investment, Kenya"
        image="https://royalrealty.co.ke/assets/edited-photo.png"
      />

      <Navbar />
      <Hero />

      <Suspense fallback={null}>
        <section id="about">
          <About />
        </section>

        <section id="lands">
          <FeaturedLands />
        </section>

        <section id="sell">
          <SellWithUs />
        </section>

        <section id="testimonials">
          <Testimonials />
        </section>
      </Suspense>

      <Footer />
    </>
  );
}