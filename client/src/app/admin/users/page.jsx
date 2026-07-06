"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Star,
  MoreVertical,
  CheckCircle,
  XCircle,
  Ban,
  RefreshCw,
  ChevronDown,
  Grid3x3,
  List,
  Download,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

// Sample users data
const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+254 700 000000",
    location: "Nairobi",
    role: "seller",
    status: "active",
    verified: true,
    listings: 3,
    joined: "2024-01-15",
    lastActive: "2024-03-15",
    avatar: null
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+254 711 111111",
    location: "Mombasa",
    role: "buyer",
    status: "active",
    verified: true,
    listings: 0,
    joined: "2024-02-01",
    lastActive: "2024-03-14",
    avatar: null
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+254 722 222222",
    location: "Kisumu",
    role: "seller",
    status: "pending",
    verified: false,
    listings: 1,
    joined: "2024-03-01",
    lastActive: "2024-03-13",
    avatar: null
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+254 733 333333",
    location: "Nakuru",
    role: "agent",
    status: "active",
    verified: true,
    listings: 12,
    joined: "2023-11-15",
    lastActive: "2024-03-15",
    avatar: null
  },
  {
    id: 5,
    name: "Peter Kamau",
    email: "peter@example.com",
    phone: "+254 744 444444",
    location: "Kiambu",
    role: "seller",
    status: "suspended",
    verified: true,
    listings: 2,
    joined: "2024-01-20",
    lastActive: "2024-03-10",
    avatar: null
  },
  {
    id: 6,
    name: "Mary Wanjiku",
    email: "mary@example.com",
    phone: "+254 755 555555",
    location: "Nyeri",
    role: "buyer",
    status: "active",
    verified: true,
    listings: 0,
    joined: "2024-02-15",
    lastActive: "2024-03-12",
    avatar: null
  },
  {
    id: 7,
    name: "James Mwangi",
    email: "james@example.com",
    phone: "+254 766 666666",
    location: "Machakos",
    role: "agent",
    status: "active",
    verified: true,
    listings: 8,
    joined: "2023-12-01",
    lastActive: "2024-03-14",
    avatar: null
  },
  {
    id: 8,
    name: "Lucy Njeri",
    email: "lucy@example.com",
    phone: "+254 777 777777",
    location: "Thika",
    role: "seller",
    status: "inactive",
    verified: false,
    listings: 0,
    joined: "2024-03-05",
    lastActive: "2024-03-07",
    avatar: null
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("joined");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm) ||
                           user.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      const matchesStatus = filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === "joined") {
        return sortOrder === "asc" 
          ? new Date(a.joined) - new Date(b.joined)
          : new Date(b.joined) - new Date(a.joined);
      } else if (sortBy === "listings") {
        return sortOrder === "asc" 
          ? a.listings - b.listings 
          : b.listings - a.listings;
      } else if (sortBy === "lastActive") {
        return sortOrder === "asc" 
          ? new Date(a.lastActive) - new Date(b.lastActive)
          : new Date(b.lastActive) - new Date(a.lastActive);
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setShowActionMenu(null);
  };

  const handleVerifyUser = (userId) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, verified: !user.verified } : user
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "suspended":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "agent":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "seller":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "buyer":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Role', 'Status', 'Verified', 'Listings', 'Joined', 'Last Active'];
    const csvData = filteredUsers.map(u => [
      u.name,
      u.email,
      u.phone,
      u.location,
      u.role,
      u.status,
      u.verified ? 'Yes' : 'No',
      u.listings,
      u.joined,
      u.lastActive
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-list.csv';
    a.click();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#222]">Users</h1>
          <p className="text-sm sm:text-base text-[#666] mt-1">Manage all platform users</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToCSV}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition text-xs sm:text-sm"
          >
            <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Export</span>
          </motion.button>
          <Link href="/admin/users/invite">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition text-xs sm:text-sm"
            >
              <User size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Invite User</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4"
        >
          <p className="text-xs sm:text-sm text-[#666] mb-1">Total Users</p>
          <p className="text-xl sm:text-2xl font-semibold text-[#222]">{users.length}</p>
          <p className="text-xs text-green-600 mt-1">+8 this week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4"
        >
          <p className="text-xs sm:text-sm text-[#666] mb-1">Active Now</p>
          <p className="text-xl sm:text-2xl font-semibold text-[#222]">12</p>
          <p className="text-xs text-green-600 mt-1">Currently online</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4"
        >
          <p className="text-xs sm:text-sm text-[#666] mb-1">Sellers</p>
          <p className="text-xl sm:text-2xl font-semibold text-[#222]">
            {users.filter(u => u.role === 'seller').length}
          </p>
          <p className="text-xs text-blue-600 mt-1">{users.filter(u => u.role === 'seller' && u.listings > 0).length} active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4"
        >
          <p className="text-xs sm:text-sm text-[#666] mb-1">Pending</p>
          <p className="text-xl sm:text-2xl font-semibold text-[#222]">
            {users.filter(u => u.status === 'pending').length}
          </p>
          <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
        </motion.div>
      </div>

      {/* Filters - Responsive */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" size={16} />
            <input
              type="text"
              placeholder="Search users by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 sm:pr-4 py-2 text-sm border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 focus:border-[#2F6B3C]"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 text-sm border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 bg-white min-w-[100px]"
            >
              <option value="all">All Roles</option>
              <option value="buyer">Buyers</option>
              <option value="seller">Sellers</option>
              <option value="agent">Agents</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 bg-white min-w-[100px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20 bg-white min-w-[100px]"
            >
              <option value="joined">Join Date</option>
              <option value="name">Name</option>
              <option value="listings">Listings</option>
              <option value="lastActive">Last Active</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="px-3 py-2 text-sm border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition whitespace-nowrap"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>

            <div className="flex border border-[#e0e0e0] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? 'bg-[#2F6B3C] text-white' : 'bg-white text-[#666] hover:bg-[#F6F4ED]'}`}
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? 'bg-[#2F6B3C] text-white' : 'bg-white text-[#666] hover:bg-[#F6F4ED]'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Display - Responsive Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence>
            {paginatedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-md transition relative"
              >
                {/* Action Menu */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                    className="p-1.5 hover:bg-[#F6F4ED] rounded-lg transition"
                  >
                    <MoreVertical size={16} className="text-[#666]" />
                  </button>
                  
                  <AnimatePresence>
                    {showActionMenu === user.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-[#e0e0e0] py-1 z-10"
                      >
                        <button
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="w-full text-left px-4 py-2 text-sm text-[#666] hover:bg-[#F6F4ED]"
                        >
                          Set Active
                        </button>
                        <button
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => handleVerifyUser(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-[#666] hover:bg-[#F6F4ED]"
                        >
                          {user.verified ? 'Remove Verify' : 'Verify User'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Avatar */}
                <div className="flex justify-center pt-6 sm:pt-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#2F6B3C]/10 rounded-full flex items-center justify-center">
                    <User size={32} className="text-[#2F6B3C]/50 sm:w-10 sm:h-10" />
                  </div>
                </div>

                {/* User Info */}
                <div className="p-4 sm:p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="font-serif text-base sm:text-lg text-[#222]">{user.name}</h3>
                    {user.verified && (
                      <CheckCircle size={14} className="text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-left text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-[#666]">
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#666]">
                      <Phone size={14} className="flex-shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#666]">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#666]">
                      <Calendar size={14} className="flex-shrink-0" />
                      <span>Joined {new Date(user.joined).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#e0e0e0]">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-[#666]">Listings</span>
                      <span className="font-semibold text-[#222]">{user.listings}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#666]">Last Active</span>
                      <span className="text-xs text-[#666]">{user.lastActive}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDetailModal(true);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition"
                    >
                      View Profile
                    </button>
                    <button className="p-2 border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition">
                      <MessageCircle size={16} className="text-[#666]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-[#F6F4ED]">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#666]">User</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#666]">Contact</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#666]">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#666]">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#666]">Listings</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#666]">Joined</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#666]">Last Active</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#666]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#e0e0e0] hover:bg-[#F6F4ED]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#2F6B3C]/10 rounded-full flex items-center justify-center">
                          <User size={14} className="text-[#2F6B3C]/50" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-[#222]">{user.name}</span>
                            {user.verified && <CheckCircle size={12} className="text-blue-500" />}
                          </div>
                          <span className="text-xs text-[#666]">{user.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-[#222]">{user.email}</div>
                      <div className="text-xs text-[#666]">{user.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#222]">{user.listings}</td>
                    <td className="py-3 px-4 text-sm text-[#666]">{user.joined}</td>
                    <td className="py-3 px-4 text-sm text-[#666]">{user.lastActive}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailModal(true);
                          }}
                          className="p-1 text-[#666] hover:text-[#2F6B3C]"
                        >
                          View
                        </button>
                        <button className="p-1 text-[#666] hover:text-[#2F6B3C]">
                          <MessageCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 sm:mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-[#e0e0e0] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F6F4ED] transition"
          >
            Previous
          </button>
          
          <div className="flex flex-wrap gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 text-sm rounded-lg transition ${
                  currentPage === i + 1
                    ? 'bg-[#2F6B3C] text-white'
                    : 'border border-[#e0e0e0] hover:bg-[#F6F4ED]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-[#e0e0e0] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F6F4ED] transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 sm:py-12"
        >
          <div className="inline-block p-4 sm:p-6 bg-white rounded-full mb-4">
            <Search size={24} className="text-[#999] sm:w-8 sm:h-8" />
          </div>
          <h3 className="font-serif text-lg sm:text-xl text-[#222] mb-2">No users found</h3>
          <p className="text-sm sm:text-base text-[#666]">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* User Detail Modal - Responsive */}
      <AnimatePresence>
        {showDetailModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="font-serif text-xl sm:text-2xl font-light text-[#222]">User Profile</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-[#F6F4ED] rounded-lg transition"
                >
                  <XCircle size={20} className="text-[#666]" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2F6B3C]/10 rounded-full flex items-center justify-center">
                    <User size={40} className="text-[#2F6B3C]/50 sm:w-12 sm:h-12" />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-xl text-[#222]">{selectedUser.name}</h3>
                      {selectedUser.verified && (
                        <CheckCircle size={16} className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#F6F4ED] p-4 rounded-lg">
                    <p className="text-xs text-[#2F6B3C] mb-2">Contact Information</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-[#666]" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-[#666]" />
                        <span>{selectedUser.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-[#666]" />
                        <span>{selectedUser.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F6F4ED] p-4 rounded-lg">
                    <p className="text-xs text-[#2F6B3C] mb-2">Account Details</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">Member since:</span>
                        <span className="text-[#222]">{selectedUser.joined}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">Last active:</span>
                        <span className="text-[#222]">{selectedUser.lastActive}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#666]">Total listings:</span>
                        <span className="text-[#222] font-medium">{selectedUser.listings}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="bg-[#F6F4ED] p-4 rounded-lg">
                  <p className="text-xs text-[#2F6B3C] mb-3">Activity Overview</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-[#666]">Listings</p>
                      <p className="text-lg font-semibold text-[#222]">{selectedUser.listings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#666]">Views</p>
                      <p className="text-lg font-semibold text-[#222]">1,234</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#666]">Inquiries</p>
                      <p className="text-lg font-semibold text-[#222]">56</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#666]">Saved</p>
                      <p className="text-lg font-semibold text-[#222]">23</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <p className="text-sm font-medium text-[#2F6B3C] mb-3">Recent Activity</p>
                  <div className="space-y-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm p-2 hover:bg-[#F6F4ED] rounded-lg">
                        <div className="w-2 h-2 bg-[#2F6B3C] rounded-full" />
                        <span className="text-[#666]">Viewed listing "Prime Residential Plot"</span>
                        <span className="text-xs text-[#999] ml-auto">2 hours ago</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e0e0e0]">
                  <button className="flex-1 px-4 py-2 bg-[#2F6B3C] text-white rounded-lg hover:bg-[#3D8A4F] transition text-sm">
                    Send Message
                  </button>
                  <button className="flex-1 px-4 py-2 border border-[#e0e0e0] rounded-lg hover:bg-[#F6F4ED] transition text-sm">
                    View Listings
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}