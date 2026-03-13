"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, DollarSign, Maximize2, Save, User, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos",
  "Uasin Gishu", "Kilifi", "Kericho", "Kakamega", "Laikipia", "Kajiado",
  "Murang'a", "Meru", "Nyeri", "Trans Nzoia", "Bungoma", "Busia",
  "Siaya", "Homa Bay", "Migori", "Kisii", "Nyamira", "Vihiga",
  "Nandi", "Elgeyo Marakwet", "Baringo", "Samburu", "Turkana",
  "West Pokot", "Marsabit", "Isiolo", "Mandera", "Wajir", "Garissa",
  "Tana River", "Lamu", "Taita Taveta", "Kwale", "Makueni", "Narok"
].sort();

const SIZE_UNITS = [
  { value: 'acre', label: 'Acres' },
  { value: 'hectare', label: 'Hectares' },
  { value: 'sqft', label: 'Sq Ft' }
];

export default function AdminCreateListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    county: "",
    town: "",
    size: "",
    sizeUnit: "acre",
    askingPrice: "",
    additionalInfo: "",
    contact_name: "",
    telephone: "",
    email: ""
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [useAdminInfo, setUseAdminInfo] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      toast.error("Please upload valid image files (JPEG, PNG, or WebP) under 5MB");
      return;
    }

    if (validFiles.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);

    e.target.value = '';
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.county?.trim()) newErrors.county = "County is required";
    if (!formData.town?.trim()) newErrors.town = "Town is required";
    if (!formData.size?.trim()) newErrors.size = "Size is required";
    if (!formData.askingPrice?.trim()) newErrors.askingPrice = "Asking price is required";
    
    // Only validate contact fields if not using admin info
    if (!useAdminInfo) {
      if (!formData.contact_name?.trim()) newErrors.contact_name = "Contact name is required";
      if (!formData.telephone?.trim()) newErrors.telephone = "Telephone is required";
      if (!formData.email?.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/admin/auth');
        return;
      }

      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append('title', formData.title || `${formData.county} Land`);
      formDataToSend.append('county', formData.county);
      formDataToSend.append('town', formData.town);
      formDataToSend.append('size', `${formData.size} ${formData.sizeUnit}`);
      formDataToSend.append('askingPrice', formData.askingPrice);
      formDataToSend.append('additionalInfo', formData.additionalInfo || '');
      
      // Add contact info (use admin info flag to determine if we send custom values)
      if (!useAdminInfo) {
        formDataToSend.append('contact_name', formData.contact_name);
        formDataToSend.append('telephone', formData.telephone);
        formDataToSend.append('email', formData.email);
      }
      
      // Add images
      images.forEach((image, index) => {
        formDataToSend.append(`image_${index}`, image);
      });

      const res = await fetch('https://royalrealtyapi.onrender.com/api/admin/lands/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await res.json();

      if (res.ok) {
        // Clean up preview URLs
        imagePreviews.forEach(URL.revokeObjectURL);
        
        // Redirect to listings page with success message
        router.push('/admin/listings?created=true');
      } else {
        toast.error('Failed to create listing');
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/listings" 
          className="flex items-center gap-2 text-[#666] hover:text-[#2F6B3C] transition"
        >
          <ArrowLeft size={18} />
          <span>Back to Listings</span>
        </Link>
        <h1 className="font-serif text-3xl font-light text-[#222]">
          Create New Listing (Admin)
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="font-serif text-xl font-light text-[#222]">
            Property Details
          </h2>

          {/* Admin Info Toggle */}
          <div className="bg-[#F6F4ED] p-4 rounded-lg">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={useAdminInfo}
                onChange={(e) => setUseAdminInfo(e.target.checked)}
                className="w-4 h-4 text-[#2F6B3C]"
              />
              <span className="text-sm text-[#222]">
                Use my admin contact information (auto-approves listing)
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title (Optional) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#2F6B3C] mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                placeholder="e.g., Prime Agricultural Land"
              />
            </div>

            {/* County */}
            <div>
              <label className="block text-sm font-medium text-[#2F6B3C] mb-2">
                County <span className="text-red-500">*</span>
              </label>
              <select
                name="county"
                value={formData.county}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 ${
                  errors.county ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select County</option>
                {COUNTIES.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
              {errors.county && (
                <p className="text-xs text-red-500 mt-1">{errors.county}</p>
              )}
            </div>

            {/* Town */}
            <div>
              <label className="block text-sm font-medium text-[#2F6B3C] mb-2">
                Town/City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="town"
                value={formData.town}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 ${
                  errors.town ? 'border-red-500' : ''
                }`}
                placeholder="e.g., Nairobi"
              />
              {errors.town && (
                <p className="text-xs text-red-500 mt-1">{errors.town}</p>
              )}
            </div>

            {/* Land Size */}
            <div>
              <label className="block text-sm font-medium text-[#2F6B3C] mb-2">
                Land Size <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 ${
                      errors.size ? 'border-red-500' : ''
                    }`}
                    placeholder="1/4"
                  />
                </div>
                <select
                  name="sizeUnit"
                  value={formData.sizeUnit}
                  onChange={handleChange}
                  className="w-28 px-3 py-3 border rounded-lg focus:outline-none"
                >
                  {SIZE_UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
              {errors.size && (
                <p className="text-xs text-red-500 mt-1">{errors.size}</p>
              )}
            </div>

            {/* Asking Price */}
            <div>
              <label className="block text-sm font-medium text-[#2F6B3C] mb-2">
                Asking Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                <input
                  type="text"
                  name="askingPrice"
                  value={formData.askingPrice}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setFormData(prev => ({ ...prev, askingPrice: value }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 ${
                    errors.askingPrice ? 'border-red-500' : ''
                  }`}
                  placeholder="45000"
                />
              </div>
              {errors.askingPrice && (
                <p className="text-xs text-red-500 mt-1">{errors.askingPrice}</p>
              )}
            </div>

            {/* Additional Info */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#2F6B3C] mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                placeholder="Any extra information about the property"
              />
            </div>

            {/* Contact Information - Only show if not using admin info */}
            {!useAdminInfo && (
              <>
                <div className="md:col-span-2">
                  <h3 className="font-serif text-lg font-light text-[#222] mb-4">
                    Contact Information
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2F6B3C] mb-2">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                    <input
                      type="text"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 ${
                        errors.contact_name ? 'border-red-500' : ''
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.contact_name && (
                    <p className="text-xs text-red-500 mt-1">{errors.contact_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2F6B3C] mb-2">
                    Telephone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 ${
                        errors.telephone ? 'border-red-500' : ''
                      }`}
                      placeholder="+254 123 456 789"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-xs text-red-500 mt-1">{errors.telephone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2F6B3C] mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="font-serif text-xl font-light text-[#222]">
            Property Images
          </h2>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <motion.div
                  key={preview}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group aspect-square rounded-lg overflow-hidden border"
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            whileHover={{ scale: images.length >= 10 ? 1 : 1.02 }}
            className="relative"
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              disabled={images.length >= 10}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`w-full p-6 border-2 border-dashed rounded-lg text-center transition ${
              images.length >= 10
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-[#2F6B3C]/30 bg-[#2F6B3C]/5 hover:border-[#2F6B3C] hover:bg-[#2F6B3C]/10 cursor-pointer'
            }`}>
              <Upload className={`mx-auto mb-2 ${
                images.length >= 10 ? 'text-gray-400' : 'text-[#2F6B3C]'
              }`} size={24} />
              <p className={`text-sm ${
                images.length >= 10 ? 'text-gray-400' : 'text-[#2F6B3C]'
              }`}>
                {images.length >= 10 
                  ? 'Maximum 10 images reached'
                  : 'Click to upload or drag and drop'
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPEG, WebP up to 5MB each
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {images.length}/10 images uploaded
              </p>
            </div>
          </motion.div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border rounded-lg hover:bg-[#F6F4ED] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Listing
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}