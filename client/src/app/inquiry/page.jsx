"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function InquiryForm() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('property');
  const propertyTitle = searchParams.get('title');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
  const title = propertyTitle ? decodeURIComponent(propertyTitle) : null;

  setFormData(prev => ({
    ...prev,
    message: title
      ? `I'm interested in ${title}. Please provide more information.`
      : `I'm interested in this property. Please provide more information.`
  }));
}, [propertyTitle]);

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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          propertyId,
          propertyTitle: propertyTitle ? decodeURIComponent(propertyTitle) : 'Not specified'
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
    <Navbar />
    <section className="bg-[#F6F4ED] min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-light text-[#222] mb-4">
          Property Inquiry
        </h1>
        
        {/* Display property info above the form */}
        {propertyTitle && (
          <div className="mb-8 p-4 bg-[#2F6B3C]/5 border border-[#2F6B3C]/20 rounded-lg">
            <h2 className="font-medium text-[#2F6B3C] mb-2">Property Details:</h2>
            <p className="text-[#222]">
              <span className="font-medium">Title:</span> {decodeURIComponent(propertyTitle)}
            </p>
            {propertyId && (
              <p className="text-[#222]">
                <span className="font-medium">Property ID:</span> #{propertyId}
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
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C]"
              />
            </div>


            {/* Message - Now properly populated */}
            <div>
              <label className="block text-sm font-medium text-[#222] mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-[#2F6B3C]/20 rounded-lg focus:outline-none focus:border-[#2F6B3C]"
              />
            </div>

            {/* Hidden field for property ID */}
            {propertyId && (
              <input type="hidden" name="propertyId" value={propertyId} />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </section>
    <Footer />
    </>
  );
}

export default function InquiryPage() {
  return (
    <Suspense fallback={<div className="text-center py-24">Loading...</div>}>
      <InquiryForm />
    </Suspense>
  );
}