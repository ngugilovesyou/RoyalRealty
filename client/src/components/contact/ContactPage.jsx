import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";
import toast from "react-hot-toast";
import Head from "../Head";
import { sendContactMessage } from "../../api/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendContactMessage(formData);

      setStatus("success");
      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        message: ""
      });

    } catch (err) {
      setStatus("error");
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
     <Head
  title="Contact Us | Royal Realty"
  description="Get in touch with Royal Realty for real estate inquiries, property listings, and investment opportunities in Kenya."
  url="https://royalrealty.co.ke/contact-us"
  image="https://res.cloudinary.com/dxwzdftzm/image/upload/v1774284401/edited-photo_uibu5g.png"
  type="website"
/>
      <Navbar />

      <main className="bg-gradient-to-b from-[#2F6B3C]/15 to-[#F6F4ED] min-h-screen pt-28 pb-24 px-6">

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-xl shadow-md">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2F6B3C] mb-6">
              Get in Touch
            </h2>

            <p className="text-[#555] text-sm mb-8 leading-relaxed">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {/* Status Messages */}
            {status === "success" && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                Something went wrong. Please try again or contact us directly.
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2F6B3C] text-white px-6 py-3 rounded-md text-sm uppercase tracking-widest hover:bg-[#3D8A4F] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>

            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center bg-white p-10 rounded-xl shadow-md">

            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2F6B3C] mb-6">
              Contact Information
            </h2>

            <div className="space-y-5 text-sm text-[#333]">

              <p>
                <span className="font-medium">Phone:</span>{" "}
                <a
                  href="tel:+254705268720"
                  className="text-[#2F6B3C] hover:underline"
                >
                  +254 705 268720
                </a>
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:info@royalrealty.com"
                  className="text-[#2F6B3C] hover:underline"
                >
                  info@royalrealty.com
                </a>
              </p>

              <p>
                <span className="font-medium">Address:</span>{" "}
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Pioneer+House+306A+Kenyatta+Avenue+Nairobi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F6B3C] hover:underline"
                >
                  Pioneer House, 306A, Kenyatta Avenue
                </a>
              </p>

              <p>
                <span className="font-medium">Mailing:</span> 3991-00100, Nairobi
              </p>


              {/* Social Media Links (Optional) */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <h3 className="font-medium text-[#2F6B3C] mb-2">Follow Us</h3>
                <div className="flex gap-4">
                  <a 
                    href="#" 
                    className="text-[#2F6B3C] hover:text-[#3D8A4F] transition"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="text-[#2F6B3C] hover:text-[#3D8A4F] transition"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="text-[#2F6B3C] hover:text-[#3D8A4F] transition"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}