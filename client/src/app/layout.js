import "@/styles/global.css";
import { Toaster } from 'react-hot-toast';

// Set metadataBase based on environment
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://royalrealty.co.ke'
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(baseUrl),
  
  title: "Royal Realty – Modern Real Estate Brokerage",
  description:
    "Royal Realty is a real estate brokerage designed for today’s market. Serving everyone from first-time land buyers to clients looking for their dream property, with expert support throughout your investment journey.",
  keywords: "real estate, land for sale, property investment, Royal Realty, Kenya, real estate brokerage, homes, plots",
  robots: "index, follow",
  icons: {
    icon: "/assets/edited-photo.png",       
    shortcut: "/assets/edited-photo.png",   
    apple: "/assets/edited-photo.png",      
  },
  openGraph: {
    title: "Royal Realty – Modern Real Estate Brokerage",
    description:
      "Royal Realty is a real estate brokerage designed for today’s market. Serving everyone from first-time land buyers to clients looking for their dream property.",
    url: "https://royalrealty.co.ke",
    siteName: "Royal Realty",
    images: [
      {
        url: "/assets/edited-photo.png",
        width: 1200,
        height: 630,
        alt: "Royal Realty - Modern Real Estate Brokerage",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Realty – Modern Real Estate Brokerage",
    description:
      "Royal Realty is a real estate brokerage designed for today’s market. Serving everyone from first-time land buyers to clients looking for their dream property.",
    images: ["/assets/edited-photo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://royalrealty.co.ke" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Royal Realty",
              url: "https://royalrealty.co.ke",
              logo: "https://royalrealty.co.ke/assets/edited-photo.png",
              description:
                "Royal Realty is a modern real estate brokerage serving everyone from first-time land buyers to clients looking for their dream property.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE"
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["English", "Swahili"]
              },
              sameAs: [
                "https://facebook.com/royalrealty",
                "https://twitter.com/royalrealty",
                "https://instagram.com/royalrealty"
              ]
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Toaster 
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#2F6B3C',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}