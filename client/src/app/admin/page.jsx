"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    {
      title: "Total Listings",
      value: "0",
      color: "bg-blue-500"
    },
    {
      title: "Pending Approval",
      value: "0",
      color: "bg-yellow-500"
    },
    {
      title: "Approved Listings",
      value: "0",
      color: "bg-green-500"
    },
    {
      title: "Total Value",
      value: "Ksh 0",
      color: "bg-purple-500"
    }
  ]);

  const [allListings, setAllListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Helper function for authenticated requests - FIXED VERSION
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      window.location.href = '/admin/auth';
      throw new Error('No authentication token found');
    }

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // MOVED OUT OF HEADERS - this is correct
        mode: 'cors', // Explicitly set CORS mode
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/auth';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  // Update paginated listings when page changes or allListings changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setRecentListings(allListings.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(allListings.length / itemsPerPage));
  }, [currentPage, allListings, itemsPerPage]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Add timestamp to avoid cache
        const timestamp = Date.now();
        
        // Fetch pending lands
        const pendingRes = await authenticatedFetch(
          `/api/admin/lands/pending?t=${timestamp}`
        );
        const pendingData = await pendingRes.json();
        
        // Fetch approved lands
        const approvedRes = await authenticatedFetch(
          `/api/lands/approved?t=${timestamp}`
        );
        const approvedData = await approvedRes.json();

        // Process pending lands
        const pendingLands = pendingData.lands || [];
        const approvedLands = approvedData.lands || [];
        
        setPendingCount(pendingLands.length);

        // Calculate total value of approved lands
        const totalValue = approvedLands.reduce((sum, land) => {
  const cleaned = String(land.asking_price || '0').replace(/[^0-9.]/g, '');
  return sum + (parseFloat(cleaned) || 0);
}, 0);

        // Format total value in Ksh
        const formattedTotalValue = new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(totalValue).replace('KES', 'Ksh');

        // Update stats
        setStats([
          {
            title: "Total Listings",
            value: (pendingLands.length + approvedLands.length).toString(),
            color: "bg-blue-500"
          },
          {
            title: "Pending Approval",
            value: pendingLands.length.toString(),
            color: "bg-yellow-500"
          },
          {
            title: "Approved Listings",
            value: approvedLands.length.toString(),
            color: "bg-green-500"
          }
        ]);

        // Combine and sort all listings (both pending and approved)
        const combinedListings = [
          ...pendingLands.map(land => ({
            ...land,
            status: 'pending',
            date: land.created_at ? new Date(land.created_at).toLocaleDateString('en-KE') : 'N/A',
            created_at: land.created_at
          })),
          ...approvedLands.map(land => ({
            ...land,
            status: 'approved',
            date: land.approved_at ? new Date(land.approved_at).toLocaleDateString('en-KE') : 
                   land.created_at ? new Date(land.created_at).toLocaleDateString('en-KE') : 'N/A',
            created_at: land.created_at
          }))
        ]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        setAllListings(combinedListings);
        setCurrentPage(1); // Reset to first page when new data loads

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
        
        
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2F6B3C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666]">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-xl">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#2F6B3C] text-white rounded hover:bg-[#1e4f2a] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-light text-[#222]">Dashboard</h1>
          <p className="text-[#666] mt-2">Welcome back! Here's what's happening with your listings.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#666] mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-[#222]">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                  {index === 0 && <MapPin className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />}
                  {index === 1 && <TrendingUp className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />}
                  {index === 2 && <Users className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />}
                  {index === 3 && <DollarSign className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Listings with Pagination */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-light text-[#222]">Recent Listings</h2>
            <Link 
              href="/admin/listings"
              className="text-sm text-[#2F6B3C] hover:underline"
            >
              View All
            </Link>
          </div>

          {allListings.length === 0 ? (
            <p className="text-center text-[#666] py-8">No listings found</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e0e0e0]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#666]">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#666]">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#666]">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#666]">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#666]">Submitted By</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#666]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentListings.map((listing, index) => (
                      <motion.tr
                        key={listing.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-[#e0e0e0] hover:bg-[#F6F4ED] transition"
                      >
                        <td className="py-3 px-4 text-sm text-[#222]">{listing.title || 'Untitled'}</td>
                        <td className="py-3 px-4 text-sm text-[#666]">
                          {listing.town ? `${listing.town}, ${listing.county}` : listing.county || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-[#2F6B3C]">
  {listing.asking_price ? (() => {
    const cleaned = String(listing.asking_price).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? listing.asking_price : 
      new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
      }).format(num).replace('KES', 'Ksh');
  })() : 'N/A'}
</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'approved' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#666]">{listing.contact_name || 'N/A'}</td>
                        <td className="py-3 px-4 text-sm text-[#666]">{listing.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#e0e0e0]">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#666]">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-[#666]">entries</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#666]">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, allListings.length)} of {allListings.length} entries
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded hover:bg-[#F6F4ED] disabled:opacity-50 disabled:cursor-not-allowed"
                    title="First page"
                  >
                    <ChevronsLeft size={18} />
                  </button>
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded hover:bg-[#F6F4ED] disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 mx-2">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded text-sm ${
                            currentPage === pageNum
                              ? 'bg-[#2F6B3C] text-white'
                              : 'hover:bg-[#F6F4ED] text-[#666]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded hover:bg-[#F6F4ED] disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded hover:bg-[#F6F4ED] disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Last page"
                  >
                    <ChevronsRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            title="Pending Approvals"
            count={pendingCount}
            description="Listings waiting for review"
            link="/admin/pending"
            color="yellow"
          />
          <QuickActionCard
            title="Approved Listings"
            count={stats[2].value}
            description="Successfully approved properties"
            link="/admin/approved"
            color="green"
          />
          <QuickActionCard
            title="Total Listings"
            count={stats[0].value}
            description="All property listings"
            link="/admin/listings"
            color="blue"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function QuickActionCard({ title, count, description, link, color }) {
  const colors = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700"
  };

  return (
    <Link href={link}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`${colors[color]} p-6 rounded-xl border cursor-pointer`}
      >
        <p className="text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl font-semibold mb-2">{count}</p>
        <p className="text-sm opacity-80">{description}</p>
      </motion.div>
    </Link>
  );
}