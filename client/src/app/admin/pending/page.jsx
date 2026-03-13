"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Eye,
  Clock,
  MapPin,
  DollarSign,
  Maximize2,
  User,
  Calendar,
  Search,
  Save,
  Edit,
  Filter,
  ChevronDown,
  X
} from "lucide-react";
import Link from "next/link";

// Array of counties
const counties = [
  "Mombasa","Kwale","Kilifi","Tana River","Lamu","Taita-Taveta","Garissa","Wajir",
  "Mandera","Marsabit","Isiolo","Meru","Tharaka-Nithi","Embu","Kitui","Machakos",
  "Makueni","Nyandarua","Nyeri","Kirinyaga","Murang'a","Kiambu","Turkana","West Pokot",
  "Samburu","Trans-Nzoia","Uasin Gishu","Elgeyo-Marakwet","Nandi","Baringo","Laikipia",
  "Nakuru","Narok","Kajiado","Kericho","Bomet","Kakamega","Vihiga","Bungoma","Busia",
  "Siaya","Kisumu","Homa Bay","Migori","Kisii","Nyamira","Nairobi"
];

export default function PendingApprovals() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCounty, setFilterCounty] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  

const API_BASE = "";  

const getImageUrl = (path) => {
  if (!path) return "/placeholder-property.jpg";
  if (path.startsWith("http")) return path;
  
  // Get just the filename from whatever path format
  const filename = path.split('/').pop();
  
  // Serve from the static/uploads directory
  return `/static/uploads/${filename}`;
};


  // Fetch pending lands
  const fetchPendingLands = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error("No authentication token found");
        setListings([]);
        return;
      }

      const res = await fetch("https://royalrealtyapi.onrender.com/api/admin/lands/pending", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/auth';
        return;
      }

      const data = await res.json();
      
      if (data.lands && Array.isArray(data.lands)) {
        setListings(data.lands);
      } else {
        console.error("Unexpected response format:", data);
        setListings([]);
      }
    } catch (err) {
      console.error("Error fetching pending lands:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLands();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://royalrealtyapi.onrender.com/api/admin/lands/${id}/approve`, { 
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        setListings(prev => prev.filter(listing => listing.id !== id));
        if (selectedListing?.id === id) {
          setShowDetailModal(false);
          setSelectedListing(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://royalrealtyapi.onrender.com/api/admin/lands/${id}/reject`, { 
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        setListings(prev => prev.filter(listing => listing.id !== id));
        if (selectedListing?.id === id) {
          setShowDetailModal(false);
          setSelectedListing(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedListing) return;
    
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://royalrealtyapi.onrender.com/api/admin/lands/${selectedListing.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          county: selectedListing.county,
          town: selectedListing.town,
          size: selectedListing.size,
          asking_price: selectedListing.asking_price,
          additional_info: selectedListing.additional_info,
        }),
      });
      
      if (res.ok) {
        // Update the listing in the local state
        setListings(prev => prev.map(item => 
          item.id === selectedListing.id ? selectedListing : item
        ));
        // Show success message or toast here
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveAndApprove = async () => {
    await handleSave();
    await handleApprove(selectedListing.id);
  };

  const viewDetails = (listing) => {
    setSelectedListing({ ...listing });
    setShowDetailModal(true);
  };

  // Calculate total pending value
  const totalPendingValue = listings.reduce((sum, listing) => sum + (listing.asking_price || 0), 0);

  // Filter and search
  const filteredListings = listings
    .filter((l) => {
      const matchesSearch = 
        (l.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (l.town?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (l.county?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (l.contact_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesCounty = filterCounty === "all" || l.county === filterCounty;
      
      return matchesSearch && matchesCounty;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" 
          ? (a.asking_price || 0) - (b.asking_price || 0)
          : (b.asking_price || 0) - (a.asking_price || 0);
      }
      if (sortBy === "date") {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F6B3C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light text-[#222]">Pending Approvals</h1>
        <p className="text-[#666] mt-2">Review and approve new property listings</p>
      </div>

      {/* Stats and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#222]">{listings.length}</p>
              <p className="text-sm text-[#666]">Pending Review</p>
            </div>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by title, location, or seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter size={18} />
                Filters
                <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-hidden"
                >
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">County</label>
                    <select
                      value={filterCounty}
                      onChange={(e) => setFilterCounty(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg text-sm"
                    >
                      <option value="all">All Counties</option>
                      {counties.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg text-sm"
                    >
                      <option value="date">Date</option>
                      <option value="price">Price</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Sort Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg text-sm"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {paginatedListings.length} of {filteredListings.length} pending listings
      </div>

      {/* Pending Listings */}
      <div className="space-y-4">
        <AnimatePresence>
          {paginatedListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Image Placeholder */}
                <div className="lg:w-48 h-32 bg-[#2F6B3C]/10 rounded-lg flex items-center justify-center">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
  src={getImageUrl(listing.images[0])}
  onError={(e) => {
    e.target.src = "/placeholder-property.jpg";
  }}
  alt={listing.title}
  className="w-full h-full object-cover rounded-lg"
/>
                  ) : (
                    <span className="text-[#2F6B3C]/50 text-sm">
                      {listing.images?.length || 0} images
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-serif text-xl text-[#222] mb-1">
                        {listing.title || 'Untitled'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#666]">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {listing.town}, {listing.county}
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize2 size={14} />
                          {listing.size}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-[#2F6B3C]">
                      Ksh {listing.asking_price?.toLocaleString() || '0'}
                    </span>
                  </div>

                  <p className="text-[#666] text-sm mb-4 line-clamp-2">
                    {listing.additional_info || 'No description provided'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#666] mb-4">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {listing.contact_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApprove(listing.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReject(listing.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Reject
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => viewDetails(listing)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition text-sm"
                    >
                      <Eye size={16} />
                      View/Edit
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(p-1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i+1)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  currentPage === i+1 
                    ? 'bg-[#2F6B3C] text-white' 
                    : 'border hover:bg-gray-50'
                }`}
              >
                {i+1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {listings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-block p-6 bg-white rounded-full mb-4">
            <CheckCircle size={32} className="text-[#2F6B3C]" />
          </div>
          <h3 className="font-serif text-xl text-[#222] mb-2">All caught up!</h3>
          <p className="text-[#666]">No pending listings to review</p>
        </motion.div>
      )}

      {/* Detail/Edit Modal */}
      <AnimatePresence>
        {showDetailModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-light text-[#222]">
                  Edit Listing
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-[#F6F4ED] rounded-lg transition"
                >
                  <X size={20} className="text-[#666]" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Images */}
                {selectedListing.images && selectedListing.images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[#2F6B3C] mb-3">Images</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {selectedListing.images.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-[#2F6B3C]/10 rounded-lg overflow-hidden">
                          <img
  src={getImageUrl(img)} 
      alt={selectedListing.title}
  onError={(e) => {
    e.target.src = "/placeholder-property.jpg";
  }}
  className="w-full h-full object-cover rounded-lg"
/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editable Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-[#666] mb-1 block">Title</label>
                    <input
                      type="text"
                      value={selectedListing.title || ''}
                      onChange={(e) => setSelectedListing({...selectedListing, title: e.target.value})}
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#666] mb-1 block">County</label>
                    <select
                      value={selectedListing.county}
                      onChange={(e) => setSelectedListing({...selectedListing, county: e.target.value})}
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                    >
                      {counties.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#666] mb-1 block">Town</label>
                    <input
                      type="text"
                      value={selectedListing.town || ''}
                      onChange={(e) => setSelectedListing({...selectedListing, town: e.target.value})}
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#666] mb-1 block">Size</label>
                    <input
                      type="text"
                      value={selectedListing.size || ''}
                      onChange={(e) => setSelectedListing({...selectedListing, size: e.target.value})}
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#666] mb-1 block">Asking Price (Ksh)</label>
                    <input
                      type="number"
                      value={selectedListing.asking_price || ''}
                      onChange={(e) => setSelectedListing({...selectedListing, asking_price: parseInt(e.target.value)})}
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs text-[#666] mb-1 block">Additional Information</label>
                    <textarea
                      value={selectedListing.additional_info || ''}
                      onChange={(e) => setSelectedListing({...selectedListing, additional_info: e.target.value})}
                      rows="4"
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                    />
                  </div>
                </div>

                {/* Seller Info (Read-only) */}
                <div>
                  <h3 className="text-sm font-medium text-[#2F6B3C] mb-3">Seller Information</h3>
                  <div className="bg-[#F6F4ED] p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      <span className="text-[#666]">Name:</span>{' '}
                      <span className="text-[#222]">{selectedListing.contact_name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[#666]">Email:</span>{' '}
                      <span className="text-[#222]">{selectedListing.email}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[#666]">Phone:</span>{' '}
                      <span className="text-[#222]">{selectedListing.telephone}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-[#666]">Submitted:</span>{' '}
                      <span className="text-[#222]">
                        {selectedListing.created_at ? new Date(selectedListing.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#e0e0e0]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    <Save size={18} />
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveAndApprove}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Save & Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-3 border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};