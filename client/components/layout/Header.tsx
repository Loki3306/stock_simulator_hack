import { Link, NavLink } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoginModal, SignupModal } from "@/components/auth/AuthModals";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/builder", label: "Builder" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/learn", label: "Learn" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-black/70 glass">
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

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-md btn-gradient text-black font-medium shadow-glow hover:opacity-95 transition"
          >
            Start Building
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.name}
              </span>
              <Link
                to="/profile"
                className="text-sm text-muted-foreground hover:text-white"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-sm text-muted-foreground hover:text-white"
              >
                Logout
              </button>
              <Link
                to="/profile"
                className="h-9 w-9 rounded-full bg-card/60 border border-border/60 grid place-items-center hover:bg-card/80"
              >
                <User className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLoginOpen(true)}
                className="text-sm text-muted-foreground hover:text-white"
              >
                Sign in
              </button>
              <button
                onClick={() => setSignupOpen(true)}
                className="px-3 py-2 rounded-md border border-white/15 hover:bg-white/5"
              >
                Sign up
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
        <div className="md:hidden border-t border-border/60 bg-black/80">
          <nav className="px-4 py-3 grid gap-2">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md ${
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
            <Link
              to="/dashboard"
              className="mt-2 px-3 py-2 rounded-md btn-gradient text-black text-center font-medium"
              onClick={() => setOpen(false)}
            >
              Start Building
            </Link>
            {user && (
              <Link
                to="/profile"
                className="px-3 py-2 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
            )}
            {!user && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => {
                    setLoginOpen(true);
                    setOpen(false);
                  }}
                  className="px-3 py-2 rounded-md bg-white/5"
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setSignupOpen(true);
                    setOpen(false);
                  }}
                  className="px-3 py-2 rounded-md btn-gradient text-black"
                >
                  Sign up
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
    </header>
  );
}
