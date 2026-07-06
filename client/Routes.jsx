import { createBrowserRouter } from "react-router-dom";
import HomePage from "./src/pages/HomePage";
import LandsForSale from "./src/components/projects/LandsForSale";
import ContactPage from "./src/components/contact/ContactPage";
import InquiryPage from "./src/components/Inquiry/Inquiry";
import SellWithUsForm from "./src/components/sell-with-us/SellWithUsForm";
import AdminLogin from "./src/components/admin/Auth";
import AdminLayout from "./src/components/admin/AdminLayout";
import AdminDashboard from "./src/components/admin/AdminDashboard";
import ListingsPage from "./src/components/admin/listings/ListingPage";
import AdminCreateListingPage from "./src/components/admin/new/AdminCreateListingPage";
import AdminLandApproval from "./src/components/admin/AdminLandApproval";
import PendingApprovals from "./src/components/admin/PendingApprovals";
import ErrorBoundary from "./src/pages/ErrorBoundary";
import LandDetails from "./src/components/LandDetails";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/lands/:slug",
    element: <LandDetails />,
  },
  {
    path: "/contact-us",
    element: <ContactPage />,
  },
  {
    path: "/inquiry/:slug",
    element: <InquiryPage />,
  },
  {
    path: "/sell-with-us",
    element: <SellWithUsForm />,
  },
  {
    path: "/projects",
    element: <LandsForSale />, 
  },
  {
    path: "/admin/auth",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "listings",
        element: <ListingsPage />,
      },
      {
        path: "listings/new",
        element: <AdminCreateListingPage />,
      },
      {
        path: "approved",
        element: <AdminLandApproval />,
      },
      {
        path: "pending",
        element: <PendingApprovals />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);

export default router;