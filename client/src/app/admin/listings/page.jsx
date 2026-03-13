

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle,
  XCircle,
  ChevronDown,
  Image as ImageIcon,
  X
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedListings, setSelectedListings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  
  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [editFormData, setEditFormData] = useState({
    county: "",
    town: "",
    size: "",
    asking_price: "",
    additional_info: ""
  });

  // Fetch listings on component mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('adminToken');
      
      
      if (!token) {
        setError('No access token found. Please login again.');
        setLoading(false);
        return;
      }

      // Try both endpoints to see which one works
      const endpoints = [
        'https://royalrealtyapi.onrender.com/api/lands/approved',
        'https://royalrealtyapi.onrender.com/api/admin/lands/pending',
        'https://royalrealtyapi.onrender.com/api/lands'
      ];

      let successfulData = null;
      let errors = [];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Data from ${endpoint}:`, data);
            successfulData = data;
            setDebugInfo({ endpoint, status: response.status, data });
            break;
          } else {
            const errorText = await response.text();
            errors.push({ endpoint, status: response.status, error: errorText });
          }
        } catch (e) {
          errors.push({ endpoint, error: e.message });
        }
      }

      if (successfulData) {
        // Check different possible data structures
        const listingsArray = successfulData.lands || successfulData.data || successfulData;
        setListings(Array.isArray(listingsArray) ? listingsArray : []);
        
        if (listingsArray.length === 0) {
          setError('No listings found.');
        }
      } else {
        setError(`Failed to fetch from all endpoints: ${JSON.stringify(errors, null, 2)}`);
        
      }

    } catch (error) {
      setError(error.message);
      toast.error('Error fetching listings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = newStatus === 'approved' 
        ? `https://royalrealtyapi.onrender.com/api/admin/lands/${id}/approve`
        : `https://royalrealtyapi.onrender.com/api/admin/lands/${id}/reject`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`Listing ${newStatus} successfully`);
      fetchListings(); 
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const handleDelete = (id) => {
    setListingToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://royalrealtyapi.onrender.com/api/admin/lands/${listingToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete listing');

      toast.success('Listing deleted successfully');
      fetchListings(); // Refresh the list
      setShowDeleteModal(false);
      setListingToDelete(null);
    } catch (error) {
      toast.error('Error deleting listing');
    }
  };

  const handleEdit = async (listing) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://royalrealtyapi.onrender.com/api/admin/lands/${listing.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch listing details');

      const data = await response.json();
      setEditingListing(data);
      setEditFormData({
        county: data.county || "",
        town: data.town || "",
        size: data.size || "",
        asking_price: data.asking_price || "",
        additional_info: data.additional_info || ""
      });
      setShowEditModal(true);
    } catch (error) {
      toast.error('Error fetching listing details');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://royalrealtyapi.onrender.com/api/admin/lands/${editingListing.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) throw new Error('Failed to update listing');

      toast.success('Listing updated successfully');
      setShowEditModal(false);
      setEditingListing(null);
      fetchListings(); 
    } catch (error) {
      toast.error('Error updating listing');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedListings.length === 0) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Delete each selected listing
      await Promise.all(selectedListings.map(async (id) => {
        const response = await fetch(`https://royalrealtyapi.onrender.com/api/admin/lands/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to delete listing');
      }));

      toast.success(`${selectedListings.length} listings deleted successfully`);
      setSelectedListings([]);
      fetchListings(); // Refresh the list
    } catch (error) {
      toast.error('Error deleting listings');
    }
  };

  // Filter and sort listings
  const filteredListings = listings
    .filter(listing => {
      if (!listing) return false;
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = 
        (listing.title?.toLowerCase() || '').includes(searchString) ||
        (listing.county?.toLowerCase() || '').includes(searchString) ||
        (listing.town?.toLowerCase() || '').includes(searchString) ||
        (listing.location?.toLowerCase() || '').includes(searchString);
      
      const matchesStatus = filterStatus === "all" || listing.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        const priceA = a.asking_price || a.price || 0;
        const priceB = b.asking_price || b.price || 0;
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      } else if (sortBy === "date") {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

  const toggleSelect = (id) => {
    setSelectedListings(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedListings.length === filteredListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(filteredListings.map(l => l.id));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-[#222]">Listings</h1>
          <p className="text-[#666] mt-2">Manage all property listings</p>
        </div>
        <Link href="/admin/listings/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition"
          >
            <Plus size={18} />
            Add New Listing
          </motion.button>
        </Link>
      </div>

     
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchListings}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={18} />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C]"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C] bg-white"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" size={16} />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C] bg-white"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none" size={16} />
          </div>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            className="px-4 py-2 border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition"
          >
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>

          {/* Select All */}
          {filteredListings.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition"
            >
              {selectedListings.length === filteredListings.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-3 bg-[#2F6B3C]/5 rounded-lg"
          >
            <span className="text-sm text-[#2F6B3C] font-medium">
              {selectedListings.length} listing(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
          </motion.div>
        )}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredListings.length > 0 ? (
            filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
              >
                {/* Image Placeholder */}
                <div className="relative h-48 bg-[#2F6B3C]/10">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      onError={(e) => {
    e.target.src = "/assets/federico-respini-sYffw0LNr7s-unsplash.jpg";
  }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon size={32} className="text-[#2F6B3C]/30" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(listing.status)}`}>
                      {listing.status || 'unknown'}
                    </span>
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <input
                      type="checkbox"
                      checked={selectedListings.includes(listing.id)}
                      onChange={() => toggleSelect(listing.id)}
                      className="w-4 h-4 rounded border-[#e0e0e0] text-[#2F6B3C] focus:ring-[#2F6B3C]"
                    />
                  </div>
                  
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {listing.images?.length || 0} images
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-serif text-lg text-[#222] mb-1 line-clamp-1">
                    {listing.title || `${listing.county || 'Unknown'} Land`}
                  </h3>
                  <p className="text-sm text-[#666] mb-2">
                    {listing.town || listing.location || 'Unknown location'}, {listing.county || ''}
                  </p>
                  <p className="text-sm text-[#666] mb-1">Size: {listing.size || 'N/A'}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold text-[#2F6B3C]">
                      Ksh {(listing.asking_price || listing.price || 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="text-xs text-[#666] mb-4">
                    <p>Contact: {listing.contact_name || 'N/A'}</p>
                    <p>Email: {listing.email || 'N/A'}</p>
                    <p>Phone: {listing.telephone || 'N/A'}</p>
                    <p>Date: {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#e0e0e0]">
                    <div className="flex items-center gap-2">
                      
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(listing)}
                        className="p-1.5 text-[#666] hover:text-blue-500 transition rounded"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(listing.id)}
                        className="p-1.5 text-[#666] hover:text-red-500 transition rounded"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {listing.status === "pending" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStatusChange(listing.id, "approved")}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded transition"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStatusChange(listing.id, "rejected")}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="inline-block p-6 bg-white rounded-full mb-4">
                <Search size={32} className="text-[#999]" />
              </div>
              <h3 className="font-serif text-xl text-[#222] mb-2">No listings found</h3>
              <p className="text-[#666]">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl text-[#222]">Edit Listing</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">
                    County
                  </label>
                  <input
                    type="text"
                    value={editFormData.county}
                    onChange={(e) => setEditFormData({...editFormData, county: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">
                    Town
                  </label>
                  <input
                    type="text"
                    value={editFormData.town}
                    onChange={(e) => setEditFormData({...editFormData, town: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={editFormData.size}
                    onChange={(e) => setEditFormData({...editFormData, size: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C]"
                    placeholder="e.g., 1/4 acre"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">
                    Asking Price (Ksh)
                  </label>
                  <input
                    type="number"
                    value={editFormData.asking_price}
                    onChange={(e) => setEditFormData({...editFormData, asking_price: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#666] mb-1">
                    Additional Information
                  </label>
                  <textarea
                    value={editFormData.additional_info}
                    onChange={(e) => setEditFormData({...editFormData, additional_info: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-serif text-xl text-[#222] mb-4">Confirm Delete</h3>
              <p className="text-[#666] mb-6">Are you sure you want to delete this listing? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}