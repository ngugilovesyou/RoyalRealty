"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check, X, Trash, Save, Filter, ChevronDown } from "lucide-react";
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

export default function AdminLandApproval() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCounty, setFilterCounty] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedLand, setSelectedLand] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 9;

 

const API_BASE = "";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${API_BASE}${path}`;
};

  // Fetch approved lands
  const fetchApprovedLands = async () => {
    setLoading(true);
    try {
      // Get token from storage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        // Redirect to login or show error
        console.error("No authentication token found");
        setLands([]);
        return;
      }

      const res = await fetch("/api/lands/approved", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        // Redirect to login
        window.location.href = '/admin/auth';
        return;
      }

      const data = await res.json();
      
      if (Array.isArray(data)) {
        setLands(data);
      } else if (data.lands && Array.isArray(data.lands)) {
        setLands(data.lands);
      } else {
        console.error("Unexpected response format:", data);
        setLands([]);
      }
    } catch (err) {
      console.error("Error fetching approved lands:", err);
      setLands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedLands();
  }, []);

  // View details
  const viewDetails = (land) => {
    setSelectedLand({ ...land });
    setShowDetailModal(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this approved listing?")) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/lands/${id}`, { 
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) fetchApprovedLands();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Reject (move back to pending)
  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to move this listing back to pending?")) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/lands/${id}/reject`, { 
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) fetchApprovedLands();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Save updates
  const handleSave = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/lands/${selectedLand.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          county: selectedLand.county,
          town: selectedLand.town,
          size: selectedLand.size,
          asking_price: selectedLand.asking_price,
          additional_info: selectedLand.additional_info,
        }),
      });
      if (res.ok) fetchApprovedLands();
      setShowDetailModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Filter, search, sort
  const filteredLands = lands
    .filter((l) => {
      const matchesSearch =
        (l.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (l.town?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (l.county?.toLowerCase() || '').includes(searchTerm.toLowerCase());
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
      if (sortBy === "size") {
        const sizeA = parseFloat(a.size) || 0;
        const sizeB = parseFloat(b.size) || 0;
        return sortOrder === "asc" ? sizeA - sizeB : sizeB - sizeA;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredLands.length / itemsPerPage);
  const paginatedLands = filteredLands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats
  const totalApproved = lands.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F6B3C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#222]">
              Approved Listings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all approved land listings
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#2F6B3C]">{totalApproved}</p>
              <p className="text-xs text-gray-500">Total Listings</p>
            </div>
           
          </div>
        </div>

        {/* Search and Filters Toggle */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by title, town, or county..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
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
                  className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
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
                  className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                >
                  <option value="date">Date</option>
                  <option value="price">Price</option>
                  <option value="size">Size</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Sort Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {paginatedLands.length} of {filteredLands.length} listings
      </div>

      {/* Listings Grid */}
      {paginatedLands.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">No approved listings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {paginatedLands.map((land) => (
              <motion.div
                key={land.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="h-48 bg-gray-200 relative">
                  {land.images && land.images.length > 0 ? (
                    <img 
  src={getImageUrl(land.images[0])}
  alt={land.title}
  onError={(e) => {
    e.target.src = "/placeholder-property.jpg";
  }}
  className="w-full h-full object-cover"
/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Approved
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-1">{land.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {land.town}, {land.county}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Size: {land.size}
                  </p>
                  <p className="text-lg font-semibold text-[#2F6B3C] mb-3">
                    Ksh {land.asking_price?.toLocaleString() || '0'}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t">
                    <button
                      onClick={() => viewDetails(land)}
                      className="flex items-center gap-1 text-sm text-[#2F6B3C] hover:underline"
                    >
                      <Eye size={16} /> View/Edit
                    </button>
                    <button
                      onClick={() => handleReject(land.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
                    >
                      <X size={14} /> Reject
                    </button>
                    <button
                      onClick={() => handleDelete(land.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                    >
                      <Trash size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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

      {/* Detail/Edit Modal */}
      <AnimatePresence>
        {showDetailModal && selectedLand && (
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
              className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-medium mb-4">Edit Listing</h2>

              {/* Images */}
              {selectedLand.images && selectedLand.images.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs text-gray-600 mb-2 block">Images</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedLand.images.map((img, idx) => (
                      <img
  key={idx}
  src={getImageUrl(img)}
  alt={`Property ${idx + 1}`}
  onError={(e) => {
    e.target.src = "/placeholder-property.jpg";
  }}
  className="h-24 w-24 object-cover rounded-lg flex-shrink-0"
/>
                    ))}
                  </div>
                </div>
              )}

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">County</label>
                  <select
                    className="w-full border px-3 py-2 rounded-lg"
                    value={selectedLand.county}
                    onChange={(e) => setSelectedLand({...selectedLand, county: e.target.value})}
                  >
                    {counties.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Town</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded-lg"
                    value={selectedLand.town || ''}
                    onChange={(e) => setSelectedLand({...selectedLand, town: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Size</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded-lg"
                    value={selectedLand.size || ''}
                    onChange={(e) => setSelectedLand({...selectedLand, size: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Asking Price (Ksh)</label>
                  <input
                    type="number"
                    className="w-full border px-3 py-2 rounded-lg"
                    value={selectedLand.asking_price || ''}
                    onChange={(e) => setSelectedLand({...selectedLand, asking_price: parseInt(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Additional Info</label>
                  <textarea
                    className="w-full border px-3 py-2 rounded-lg"
                    rows="4"
                    value={selectedLand.additional_info || ''}
                    onChange={(e) => setSelectedLand({...selectedLand, additional_info: e.target.value})}
                  />
                </div>

                {/* Contact Info (Read-only) */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                  <p className="text-sm"><span className="text-gray-600">Name:</span> {selectedLand.contact_name}</p>
                  <p className="text-sm"><span className="text-gray-600">Phone:</span> {selectedLand.telephone}</p>
                  <p className="text-sm"><span className="text-gray-600">Email:</span> {selectedLand.email}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#1e4f2a] transition-colors disabled:opacity-50"
                >
                  <Save size={18} /> Save Changes
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}