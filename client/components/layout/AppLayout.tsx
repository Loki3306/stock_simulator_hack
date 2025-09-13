import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { TrendingUp, Play } from "lucide-react";

// Import the authentication modals
import { LoginModal, SignupModal } from "@/components/auth/AuthModals";

export default function AppLayout() {
  const { user, googleLogin } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const location = useLocation();
  
  // Only show auth tab on the landing page
  const showAuthTab = location.pathname === "/" && !user;
  
  const handleGoogleSignIn = async () => {
    try {
      await googleLogin();
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient">
      {/* Simplified Sign Up Tab - Only on Landing Page */}
      {showAuthTab && (
        <div className="absolute top-24 right-5 z-40">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-5 w-80 min-h-[400px]">
            
            {/* Header */}
            <div className="text-center mb-5">
              <h3 className="text-xl font-semibold text-white mb-2">
                Get Started
              </h3>
              <p className="text-gray-300 text-sm">Create your account</p>
            </div>

            {/* Sign Up Form */}
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-all duration-200 hover:bg-white/10"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-all duration-200 hover:bg-white/10"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-all duration-200 hover:bg-white/10"
              />
            </div>

            {/* Sign Up Button */}
            <button
              onClick={() => setShowSignupModal(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-sm mb-5 hover:shadow-lg"
            >
              Sign Up
            </button>

            {/* Divider */}
            <div className="flex items-center mb-5">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="px-3 text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm mb-4 hover:shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-1">
              <span className="text-gray-300 text-xs">Already have an account? </span>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-blue-400 hover:text-blue-300 font-medium text-xs underline transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      <Header 
        onSignInClick={() => setShowLoginModal(true)}
        onSignUpClick={() => setShowSignupModal(true)}
      />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />

      {/* Authentication Modals */}
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
      />
      <SignupModal 
        open={showSignupModal} 
        onOpenChange={setShowSignupModal}
      />
    </div>
  );
}
