import { createBrowserRouter } from "react-router-dom";
import HomePage from "./src/pages/HomePage";
import ErrorBoundary from "./src/pages/ErrorBoundary";

const lazyRoute = (importFn) => ({
  lazy: async () => ({ Component: (await importFn()).default }),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/lands/:slug",
    ...lazyRoute(() => import("./src/components/LandDetails")),
  },
  {
    path: "/contact-us",
    ...lazyRoute(() => import("./src/components/contact/ContactPage")),
  },
  {
    path: "/inquiry/:slug",
    ...lazyRoute(() => import("./src/components/Inquiry/Inquiry")),
  },
  {
    path: "/sell-with-us",
    ...lazyRoute(() => import("./src/components/sell-with-us/SellWithUsForm")),
  },
  {
    path: "/projects",
    ...lazyRoute(() => import("./src/components/projects/LandsForSale")),
  },
  {
    path: "/admin/auth",
    ...lazyRoute(() => import("./src/components/admin/Auth")),
  },
  {
    path: "/admin",
    ...lazyRoute(() => import("./src/components/admin/AdminLayout")),
    children: [
      {
        index: true,
        ...lazyRoute(() => import("./src/components/admin/AdminDashboard")),
      },
      {
        path: "listings",
        ...lazyRoute(() => import("./src/components/admin/listings/ListingPage")),
      },
      {
        path: "listings/new",
        ...lazyRoute(() => import("./src/components/admin/new/AdminCreateListingPage")),
      },
      {
        path: "approved",
        ...lazyRoute(() => import("./src/components/admin/AdminLandApproval")),
      },
      {
        path: "pending",
        ...lazyRoute(() => import("./src/components/admin/PendingApprovals")),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorBoundary />,
  },
]);

export default router;