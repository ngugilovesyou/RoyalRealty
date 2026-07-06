import { useRouteError, useNavigate } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  // Safe extraction — error can be null
  const message =
    error?.statusText ||
    error?.message ||
    (typeof error === "string" ? error : null) ||
    "An unexpected error occurred";

  const status = error?.status || error?.statusCode || null;

  return (
    <div className="min-h-screen bg-[#F6F4ED] flex items-center justify-center p-6 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .error-card {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .leaf-icon {
          animation: sway 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-4deg); }
          50%       { transform: rotate(4deg); }
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.12);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .btn-primary:hover::after { opacity: 1; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(47,107,60,0.35); }
        .btn-primary:active { transform: translateY(0); }

        .btn-secondary {
          transition: all 0.2s ease;
          border: 1.5px solid #d0cfc7;
        }
        .btn-secondary:hover {
          border-color: #2F6B3C;
          color: #2F6B3C;
          background: rgba(47,107,60,0.05);
        }

        .status-badge {
          animation: pulse 2.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }

        .squiggle {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw 1s 0.3s ease forwards;
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="error-card w-full max-w-lg">
        {/* Top decorative strip */}
        <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-[#2F6B3C] via-[#5A9E6A] to-[#A8C5A0]" />

        <div className="bg-white rounded-b-2xl shadow-xl shadow-[#2F6B3C]/10 p-10">

          {/* Icon area */}
          <div className="flex justify-center mb-7">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#F6F4ED]">
              {/* Outer ring */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="37" fill="none" stroke="#e8e5dc" strokeWidth="1.5" strokeDasharray="6 4" />
              </svg>

              {/* Wilting leaf / error symbol */}
              <svg className="leaf-icon w-9 h-9" viewBox="0 0 36 36" fill="none">
                <path d="M18 4C18 4 28 10 28 20C28 26.627 23.627 31 18 31C12.373 31 8 26.627 8 20C8 10 18 4 18 4Z"
                  fill="#D4EDDA" stroke="#2F6B3C" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M18 31V34M18 15V24" stroke="#2F6B3C" strokeWidth="1.5" strokeLinecap="round"/>
                <path className="squiggle" d="M14 19C14 19 15.5 17.5 18 19C20.5 20.5 22 19 22 19"
                  fill="none" stroke="#2F6B3C" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Status badge */}
          {status && (
            <div className="flex justify-center mb-4">
              <span className="status-badge inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-[#2F6B3C] bg-[#F0F7F1] px-3 py-1 rounded-full border border-[#c5dfc9]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B3C] inline-block" />
                Error {status}
              </span>
            </div>
          )}

          {/* Heading */}
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }}
              className="text-[#1a1a1a] text-3xl text-center mb-3 italic">
            Something went wrong
          </h1>

          {/* Divider squiggle */}
          <div className="flex justify-center mb-5">
            <svg width="60" height="10" viewBox="0 0 60 10">
              <path d="M0 5 Q15 0 30 5 Q45 10 60 5"
                fill="none" stroke="#A8C5A0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Error message */}
          <p style={{ fontFamily: "'DM Sans', sans-serif" }}
             className="text-[#555] text-center text-sm leading-relaxed mb-8 px-2">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/")}
              className="btn-primary flex-1 px-5 py-3 bg-[#2F6B3C] text-white text-sm font-medium rounded-xl"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Go back home
            </button>
          
          </div>
         
        </div>
      </div>
    </div>
  );
}