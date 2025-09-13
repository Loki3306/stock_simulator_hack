import { Link, NavLink } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/builder", label: "Builder" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/learn", label: "Learn" },
];

interface HeaderProps {
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
}

export default function Header({ onSignInClick, onSignUpClick }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/assets/logo/mark.svg" alt="Logo" className="h-8 w-8" />
            <span className="font-display text-lg font-semibold tracking-tight">
              AlgoTrader Pro
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-8">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-white"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.name}
              </span>
              <Link
                to="/profile"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Logout
              </button>
              <Link
                to="/profile"
                className="h-9 w-9 rounded-full bg-card/60 border border-border/60 grid place-items-center hover:bg-card/80 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <button
                onClick={onSignInClick}
                className="text-sm font-medium text-muted-foreground hover:text-white transition-all duration-200 hover:underline decoration-1 underline-offset-4"
              >
                Sign In
              </button>
              <button
                onClick={onSignUpClick}
                className="text-sm font-medium text-white hover:text-blue-400 transition-all duration-200 hover:underline decoration-1 underline-offset-4"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-white/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-black/80 backdrop-blur-xl">
          <nav className="px-4 py-3 grid gap-2">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {n.label}
              </NavLink>
            ))}
            
            {!user && (
              <div className="mt-3 pt-3 border-t border-border/40 grid gap-2">
                <button
                  onClick={() => {
                    onSignInClick?.();
                    setOpen(false);
                  }}
                  className="px-3 py-2 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onSignUpClick?.();
                    setOpen(false);
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
            
            {user && (
              <div className="mt-3 pt-3 border-t border-border/40 grid gap-2">
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="px-3 py-2 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white transition-colors text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
