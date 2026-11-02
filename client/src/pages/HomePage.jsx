import { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Head from "../components/Head";
import Hero from "../components/Hero";
import About from "../components/About";
import FeaturedLands from "../components/Featured";

const SellWithUs = lazy(() => import("../components/SellWithUs"));
const Testimonials = lazy(() => import("../components/Testimonial"));
const Footer = lazy(() => import("../components/Footer"));


const Placeholder = ({ h }) => <div style={{ minHeight: h }} aria-hidden="true" />;

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

      <section id="about">
        <About />
      </section>

      <FeaturedLands />

      <Suspense fallback={<Placeholder h={600} />}>
        <section id="sell">
          <SellWithUs />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
      </Suspense>

      <Suspense fallback={<Placeholder h={320} />}>
        <Footer />
      </Suspense>
    </>
  );
}