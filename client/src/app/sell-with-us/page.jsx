"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SellWithUsForm() {
  const [formData, setFormData] = useState({
    title: "",
    contactName: "",
    telephone: "",
    email: "",
    county: "",
    town: "",
    size: "",
    askingPrice: "",
    additionalInfo: ""
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const counties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos", 
    "Uasin Gishu", "Kilifi", "Kericho", "Kakamega", "Laikipia", "Kajiado",
    "Murang'a", "Meru", "Nyeri", "Trans Nzoia", "Bungoma", "Busia",
    "Siaya", "Homa Bay", "Migori", "Kisii", "Nyamira", "Vihiga",
    "Nandi", "Elgeyo Marakwet", "Baringo", "Samburu", "Turkana",
    "West Pokot", "Marsabit", "Isiolo", "Mandera", "Wajir", "Garissa",
    "Tana River", "Lamu", "Taita Taveta", "Kwale", "Makueni", "Narok"
  ].sort();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    }
    const newPreviews = validFiles.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
    images.forEach((img, i) => dataToSend.append(`image_${i}`, img));

    try {
      const res = await fetch(`/api/sell-land`, {
        method: 'POST',
        body: dataToSend
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        setSubmitStatus('success');

        setFormData({
          title: "",
          contactName: "",
          telephone: "",
          email: "",
          county: "",
          town: "",
          size: "",
          askingPrice: "",
          additionalInfo: ""
        });
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImages([]);
        setImagePreviews([]);
      } else {
        setSubmitStatus('error');
      }

    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-white border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C] transition text-[#333] placeholder:text-[#999]";
  const labelClasses = "block text-sm font-medium text-[#2F6B3C] mb-2";

  return (
    <>
      <Navbar />
      <section className="bg-[#F6F4ED] py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2F6B3C]/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2F6B3C]/5 rounded-full translate-y-48 -translate-x-48" />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.18em] text-[#2F6B3C] mb-3">Start Your Journey</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#222] mb-4">Sell Your Land With Us</h1>
            <p className="text-[#555] text-lg max-w-2xl mx-auto">
              Tell us about your property and we'll get back to you within 24 hours with a personalized consultation.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <AnimatePresence>
              {submitStatus && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`px-6 py-4 ${submitStatus === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className={`flex items-center gap-3 ${submitStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    {submitStatus === 'success' ? (
                      <>
                        <CheckCircle size={20} />
                        <span className="text-sm font-medium">Thank you! Your submission has been received. We'll contact you shortly.</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={20} />
                        <span className="text-sm font-medium">Something went wrong. Please try again or contact us directly.</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">

              {/* Title */}
              <div>
                <label htmlFor="title" className={labelClasses}>Land Title / Name *</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className={inputClasses} placeholder="Prime Residential Plot" />
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className={labelClasses}>Contact Name *</label>
                <input type="text" id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} required className={inputClasses} placeholder="John Doe" />
              </div>

              {/* Telephone and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="telephone" className={labelClasses}>Telephone Number *</label>
                  <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required className={inputClasses} placeholder="+254 700 000000" />
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>Email Address *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder="john@example.com" />
                </div>
              </div>

              {/* County and Town */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="county" className={labelClasses}>County *</label>
                  <select id="county" name="county" value={formData.county} onChange={handleChange} required className={inputClasses}>
                    <option value="">Select County</option>
                    {counties.map(county => <option key={county} value={county}>{county}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="town" className={labelClasses}>Town/Area *</label>
                  <input type="text" id="town" name="town" value={formData.town} onChange={handleChange} required className={inputClasses} placeholder="e.g., Kilimani, Karen" />
                </div>
              </div>

              {/* Size and Asking Price */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="size" className={labelClasses}>Land Size *</label>
                  <input type="text" id="size" name="size" value={formData.size} onChange={handleChange} required className={inputClasses} placeholder="e.g., 1/4 acre, 50x100 ft" />
                </div>
                <div>
                  <label htmlFor="askingPrice" className={labelClasses}>Asking Price (KES) *</label>
                  <input type="text" id="askingPrice" name="askingPrice" value={formData.askingPrice} onChange={handleChange} required className={inputClasses} placeholder="e.g., 4,500,000" />
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className={labelClasses}>Land Images (Optional - Max 5 images, 5MB each)</label>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <AnimatePresence>
                      {imagePreviews.map((preview, index) => (
                        <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative group aspect-square rounded-lg overflow-hidden border border-[#e0e0e0]">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <motion.button type="button" onClick={() => removeImage(index)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={14} />
                          </motion.button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{images[index]?.name?.length > 15 ? images[index].name.substring(0, 12) + '...' : images[index]?.name}</div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative">
                  <input type="file" id="images" accept="image/*" multiple onChange={handleImageUpload} disabled={imagePreviews.length >= 5} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                  <div className={`w-full p-6 border-2 border-dashed rounded-lg text-center transition ${imagePreviews.length >= 5 ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-[#2F6B3C]/30 bg-[#2F6B3C]/5 hover:border-[#2F6B3C] hover:bg-[#2F6B3C]/10 cursor-pointer'}`}>
                    <Upload className={`mx-auto mb-2 ${imagePreviews.length >= 5 ? 'text-gray-400' : 'text-[#2F6B3C]'}`} size={24} />
                    <p className={`text-sm ${imagePreviews.length >= 5 ? 'text-gray-400' : 'text-[#2F6B3C]'}`}>{imagePreviews.length >= 5 ? 'Maximum 5 images reached' : 'Click to upload or drag and drop'}</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB each</p>
                    <p className="text-xs text-gray-400 mt-2">{imagePreviews.length}/5 images uploaded</p>
                  </div>
                </motion.div>
              </div>

              {/* Additional Info */}
              <div>
                <label htmlFor="additionalInfo" className={labelClasses}>Additional Information (Optional)</label>
                <textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="4" className={inputClasses} placeholder="Tell us more about your land - any unique features, documentation available, etc." />
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full px-8 py-4 text-sm font-medium tracking-widest uppercase rounded-md bg-[#2F6B3C] text-white hover:bg-[#3D8A4F] transition flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}>
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" />Submitting...</> : 'Submit Your Land Details'}
              </motion.button>

              {/* Privacy */}
              <p className="text-xs text-center text-[#666] mt-4">
                By submitting this form, you agree to our <Link href="/privacy" className="text-[#2F6B3C] hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-[#2F6B3C] hover:underline">Terms of Service</Link>. We'll never share your information with third parties.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}