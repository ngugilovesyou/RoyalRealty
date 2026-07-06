const API_BASE = import.meta.env.VITE_API_BASE || "https://royalrealty.co.ke/api";
// const API_BASE = "http://localhost:5000";
export const IMAGE_BASE = "https://royalrealty.co.ke/api";

export const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dxwzdftzm/image/upload/v1774343445/federico-respini-sYffw0LNr7s-unsplash_k08ytk.jpg";


// Helpers
export const getImageUrl = (path) => {
  if (!path) return DEFAULT_IMAGE;
  if (path.startsWith("http")) return path;
  const cleanPath = path.replace(/^\/+/, "");
  return `${IMAGE_BASE}/${cleanPath}`;
};

const getCsrfTokenFromCookie = () => {
  const match = document.cookie.match(/(?:^|;\s*)csrf_access_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const authHeaders = (extra = {}, { csrf = false } = {}) => {
  const headers = { ...extra };
  if (csrf) {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) headers["X-CSRF-TOKEN"] = csrfToken;
  }
  return headers;
};

const handleUnauthorized = () => {
  window.location.href = "/admin/auth";
  throw new Error("Unauthorized");
};


// Contact/Inquiry
export const sendContactMessage = async (formData) => {
  const response = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send message");
  }

  return response.json().catch(() => ({}));
};

export const sendPropertyInquiry = async (formData, propertyData) => {
  const payload = {
    ...formData,
    property: {
      id: propertyData.id,
      slug: propertyData.slug,
      title: propertyData.title,
      location: `${propertyData.town}, ${propertyData.county}`
    }
  };

  const response = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send inquiry");
  }

  return response.json().catch(() => ({}));
};

export const generateInquiryMessage = (property) => {
  if (!property) {
    return "I'm interested in this property. Please provide more information.";
  }
  
  return `INQUIRY DETAILS:
Property: ${property.title}
Location: ${property.town}, ${property.county}

Message:
I'm interested in this property. Please provide more information.`;
};


// Lands
export const fetchAllLands = async () => {
  const response = await fetch(`${API_BASE}/api/lands`, {
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch lands: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const transformLandData = (land) => {
  const getLocation = (land) => {
    if (land.town && land.county) return `${land.town}, ${land.county}`;
    if (land.town) return land.town;
    if (land.county) return land.county;
    return "Location not specified";
  };

  return {
    id: land.id,
    title: `${land.town || land.county || 'Land'} Plot`,
    location: getLocation(land),
    slug: land.slug,
    town: land.town,
    county: land.county,
    price: land.price,
    images: land.images || [],
    mainImage: land.images?.[0] || DEFAULT_IMAGE,
    size: land.size || "Size not specified",
    acres: land.size ? parseFloat(land.size) || 0 : 0,
    additional_info: land.additional_info || "",
    type: land.type || "Residential"
  };
};

export const fetchLandsWithTransform = async () => {
  const lands = await fetchAllLands();
  return lands.map(transformLandData);
};

export const getUniqueLocations = (lands) => {
  return [...new Set(lands.map(land => land.location))].sort();
};


// Property Details
export const fetchPropertyBySlug = async (slug) => {
  const response = await fetch(`${API_BASE}/api/lands/${slug}`, {
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch property: ${response.status}`);
  }

  return response.json();
};

// Sell Land
export const submitSellLand = async (formData, images) => {
  const dataToSend = new FormData();
  
  
  Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
  
  // Append images
  images.forEach((img, i) => dataToSend.append(`image_${i}`, img));

  const response = await fetch(`${API_BASE}/api/sell-land`, {
    method: 'POST',
    body: dataToSend,
    
  });

  const result = await response.json();

  if (!response.ok || result.status !== "success") {
    throw new Error(result.message || "Failed to submit land details");
  }

  return result;
};

export const KENYA_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos", 
  "Uasin Gishu", "Kilifi", "Kericho", "Kakamega", "Laikipia", "Kajiado",
  "Murang'a", "Meru", "Nyeri", "Trans Nzoia", "Bungoma", "Busia",
  "Siaya", "Homa Bay", "Migori", "Kisii", "Nyamira", "Vihiga",
  "Nandi", "Elgeyo Marakwet", "Baringo", "Samburu", "Turkana",
  "West Pokot", "Marsabit", "Isiolo", "Mandera", "Wajir", "Garissa",
  "Tana River", "Lamu", "Taita Taveta", "Kwale", "Makueni", "Narok"
].sort();


// Image Utilities
export const validateImageFiles = (files) => {
  const validFiles = [];
  const errors = [];

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) {
      errors.push(`${file.name} is not an image`);
    } else if (file.size > 5 * 1024 * 1024) {
      errors.push(`${file.name} exceeds 5MB limit`);
    } else {
      validFiles.push(file);
    }
  });

  return { validFiles, errors };
};

export const createImagePreviews = (files) => {
  return files.map(file => URL.createObjectURL(file));
};

export const revokeImagePreviews = (previews) => {
  previews.forEach(url => URL.revokeObjectURL(url));
};

export const formatImageName = (name, maxLength = 15) => {
  return name.length > maxLength 
    ? name.substring(0, maxLength) + '...' 
    : name;
};


// Admin API calls
export const fetchListings = async () => {
  const response = await fetch(`${API_BASE}/api/lands`, {
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });

  if (response.status === 401) {
    handleUnauthorized();
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.status}`);
  }

  const data = await response.json();
  const listingsArray = data.lands || data.data || data;
  return Array.isArray(listingsArray) ? listingsArray : [];
};

export const updateListingStatus = async (id, newStatus) => {
  const endpoint =
    newStatus === "approved"
      ? `${API_BASE}/api/admin/lands/${id}/approve`
      : `${API_BASE}/api/admin/lands/${id}/reject`;

  const response = await fetch(endpoint, {
    method: "PUT",
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }, { csrf: true }),
  });

  if (!response.ok) throw new Error("Failed to update status");
  return response.json().catch(() => ({}));
};

export const deleteListing = async (id) => {
  const response = await fetch(`${API_BASE}/api/admin/lands/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders({}, { csrf: true }),
  });

  if (!response.ok) throw new Error("Failed to delete listing");
  return true;
};

export const deleteListingsBulk = async (ids) => {
  await Promise.all(ids.map((id) => deleteListing(id)));
  return true;
};

export const fetchListingDetails = async (id) => {
  const response = await fetch(`${API_BASE}/api/admin/lands/${id}`, {
    credentials: "include",
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch listing details");
  return response.json();
};

export const updateListing = async (id, formData) => {
  const response = await fetch(`${API_BASE}/api/admin/lands/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }, { csrf: true }),
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error("Failed to update listing");
  return response.json().catch(() => ({}));
};

export const createListing = async (formDataPayload) => {
  const response = await fetch(`${API_BASE}/api/admin/lands/create`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders({}, { csrf: true }),
    body: formDataPayload,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data.message || "Failed to create listing");
    err.status = response.status;
    throw err;
  }

  return data;
};

export const authenticatedFetch = async (path, options = {}) => {
  const isMutating = options.method && options.method !== "GET";

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    mode: "cors",
    headers: authHeaders(
      {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      { csrf: isMutating }
    ),
  });

  if (response.status === 401) {
    window.location.href = "/admin/auth";
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response;
};

export const fetchPendingLands = async () => {
  const timestamp = Date.now();
  const res = await authenticatedFetch(`/api/admin/lands/pending?t=${timestamp}`);
  const data = await res.json();
  return data.lands || [];
};

export const fetchApprovedLands = async () => {
  const timestamp = Date.now();
  const res = await authenticatedFetch(`/api/lands/approved?t=${timestamp}`);
  const data = await res.json();
  return data.lands || [];
};

export const fetchDashboardData = async () => {
  const [pendingLands, approvedLands] = await Promise.all([
    fetchPendingLands(),
    fetchApprovedLands(),
  ]);
  return { pendingLands, approvedLands };
};

export const rejectListing = async (id) => {
  const response = await fetch(`${API_BASE}/api/admin/lands/${id}/reject`, {
    method: "PUT",
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }, { csrf: true }),
  });

  if (!response.ok) throw new Error("Failed to reject listing");
  return response.json().catch(() => ({}));
};

export const approveListing = async (id) => {
  const response = await fetch(`${API_BASE}/api/admin/lands/${id}/approve`, {
    method: "PUT",
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }, { csrf: true }),
  });

  if (!response.ok) throw new Error("Failed to approve listing");
  return response.json().catch(() => ({}));
};


// Auth
export const loginAdmin = async ({ email, password }) => {
  const response = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data.error || data.message || "Invalid email or password");
    err.status = response.status;
    throw err;
  }

  return data; 
};

export const logoutAdmin = async () => {
  try {
    await fetch(`${API_BASE}/api/admin/logout`, {
      method: "POST",
      credentials: "include",
      headers: authHeaders({}, { csrf: true }),
    });
  } catch (err) {
    console.error("Logout request failed:", err);
  }
};

export const verifyAdminToken = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/verify`, {
      credentials: "include",
      headers: authHeaders(),
    });

    if (!response.ok) return null;

    const data = await response.json().catch(() => ({}));
    return data.admin || null;
  } catch (err) {
    console.error("Token verification error:", err);
    return undefined;
  }
};



// Price Formatter


export function formatKsh(raw) {
  if (raw == null) return "—";
  const cleaned = String(raw).replace(/[,\s]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return String(raw);
  return num.toLocaleString("en-KE");
}


// Property Details
export const getPropertyFacts = (land) => {
  const facts = [
    { label: "Size", value: land.size },
    { label: "Location", value: `${land.town}, ${land.county}` },
    ...(land.category ? [{ label: "Type", value: land.category }] : []),
  ];
  return facts;
};

export const getSideDetails = (land) => {
  const details = [
    ["Size", land.size],
    ["Town", land.town],
    ["County", land.county],
    ...(land.ref ? [["Ref", land.ref]] : []),
  ];
  return details;
};

export const getAllImages = (land) => {
  return land ? [land.main_image, ...(land.images || [])] : [];
};


// Featured Lands
export const fetchFeaturedLands = async () => {
  const response = await fetch(`${API_BASE}/api/lands/featured`, {
    credentials: "include",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch featured lands: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const formatPrice = (price) => {
  if (!price) return "Price on request";
  
  try {
    const cleaned = String(price).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num)) return "Price on request";
    
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    })
    .format(num)
    .replace("KES", "Ksh");
  } catch (error) {
    return "Price on request";
  }
};

export const transformFeaturedLand = (land) => {
  const getLocation = () => {
    if (land.town && land.county) return `${land.town}, ${land.county}`;
    if (land.town) return land.town;
    if (land.county) return land.county;
    return "Location not specified";
  };

  return {
    id: land.id,
    title: land.title || `${land.town || land.county || 'Land'} Plot`,
    slug: land.slug,
    location: getLocation(),
    price: land.price,
    images: land.images || [],
    mainImage: land.images?.[0] || DEFAULT_IMAGE,
  };
};

export const transformFeaturedLands = (lands) => {
  return lands.map(transformFeaturedLand);
};