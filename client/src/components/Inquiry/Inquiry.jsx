import { Suspense, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import Head from '../Head';
import { useParams } from "react-router-dom";
import { fetchPropertyBySlug, sendPropertyInquiry, generateInquiryMessage } from '../../api/api';

function InquiryForm() {
  const { slug } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await fetchPropertyBySlug(slug);
        setProperty(data);
      } catch (err) {
        console.error('Failed to fetch property:', err);
        toast.error('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  // Update message when property loads
  useEffect(() => {
    if (property) {
      setFormData(prev => ({
        ...prev,
        message: generateInquiryMessage(property)
      }));
    }
  }, [property]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sendPropertyInquiry(formData, property);
      
      setSubmitStatus('success');
      toast.success('Inquiry sent successfully!');
      setFormData(prev => ({ 
        name: '', 
        email: '', 
        phone: '',
        message: prev.message 
      }));
      
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitStatus('error');
      toast.error(error.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Head 
          title="Loading Property... | Royal Realty"
          description="Loading property inquiry page"
          keywords="property inquiry, real estate inquiry"
          type="website"
        />
        <Navbar />
        <section className="bg-[#F6F4ED] min-h-screen py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F6B3C]"></div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Prepare SEO data for the inquiry page
  const pageTitle = property
    ? `Inquiry: ${property.title} | Royal Realty`
    : 'Property Inquiry | Royal Realty';
  
  const pageDescription = property
    ? `Submit your inquiry about ${property.title}. Our team at Royal Realty will get back to you within 24 hours.`
    : 'Submit your property inquiry. Our team at Royal Realty will get back to you within 24 hours.';

  return (
    <>
      <Head 
        title={pageTitle}
        description={pageDescription}
        keywords="property inquiry, real estate inquiry, royal realty, property questions"
        type="website"
      />
      <Head
  title={pageTitle}
  description={pageDescription}
  url="https://royalrealty.co.ke/inquiry"
  image="https://res.cloudinary.com/dxwzdftzm/image/upload/v1774284401/edited-photo_uibu5g.png"
  type="website"
/>
      <Navbar />
      <section className="bg-[#F6F4ED] min-h-screen py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl font-light text-[#222] mb-4">
            Property Inquiry
          </h1>

          {/* Display property info */}
          {property && (
            <div className="mb-8 p-4 bg-[#2F6B3C]/5 border border-[#2F6B3C]/20 rounded-lg">
              <h2 className="font-medium text-[#2F6B3C] mb-2">Property Details:</h2>
              <p className="text-[#222]">
                <span className="font-medium">Title:</span> {property.title}
              </p>
              <p className="text-[#222]">
                <span className="font-medium">Location:</span> {property.town}, {property.county}
              </p>
              {property.price && (
                <p className="text-[#222]">
                  <span className="font-medium">Price:</span> Ksh {property.price.toLocaleString()}
                </p>
              )}
            </div>
          )}
        
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              Thank you! Your inquiry has been sent. We'll get back to you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              Something went wrong. Please try again or call us directly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#222] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/20"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#222] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/20"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <label className="block text-sm font-medium text-[#222] mb-2">
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/20"
                  placeholder="+254 700 000 000"
                />
              </div>

              {/* Message - Now properly populated */}
              <div>
                <label className="block text-sm font-medium text-[#222] mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/20"
                />
              </div>

              <input
                type="hidden"
                name="propertySlug"
                value={slug || ''}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Submit Inquiry'
                )}
              </button>

              {/* Contact info note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                We'll respond to your inquiry within 24 hours.
              </p>
            </div>
          </form>

          {/* Alternative contact methods */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">Prefer to call or email?</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="tel:+254705268720" 
                className="text-[#2F6B3C] hover:underline text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +254 705 268720
              </a>
              <a 
                href="mailto:info@royalrealty.com" 
                className="text-[#2F6B3C] hover:underline text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@royalrealty.com
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default function InquiryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F6F4ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2F6B3C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <InquiryForm />
    </Suspense>
  );
}