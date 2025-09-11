import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type LoginForm = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8),
});
type RegisterForm = z.infer<typeof registerSchema>;

export function LoginModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { login, resetPassword, googleLogin } = useAuth();
  const [signupOpen, setSignupOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState,
    setError,
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const [loading, setLoading] = useState(false);
  const [error, setErrorMsg] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Mock handleSendOTP
  async function handleSendOTP(email: string) {
    setOtpLoading(true);
    setOtpSent(false);
    await new Promise((res) => setTimeout(res, 1000));
    setOtpLoading(false);
    setOtpSent(true);
    // In real app, send OTP to email
  }

  // Mock handlePasswordReset
  function handlePasswordReset(email: string) {
    // In real app, send password reset link
    setShowReset(false);
    setErrorMsg("If your email exists, a reset link was sent.");
  }

  // Google login
  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await googleLogin();
      window.location.href = "/dashboard";
      onOpenChange(false);
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.error || e?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-center">Sign in</DialogTitle>
          </DialogHeader>
          {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
          {!showOTP ? (
            <form
              className="grid gap-3"
              onSubmit={handleSubmit(async (v) => {
                setLoading(true);
                setErrorMsg(null);
                try {
                  await handleSendOTP(v.email);
                  setShowOTP(true);
                } catch (e: any) {
                  setErrorMsg(e?.message || "Login failed");
                } finally {
                  setLoading(false);
                }
              })}
            >
              <Input
                className=""
                placeholder="Email"
                type="email"
                autoComplete="email"
                {...register("email")}
                disabled={loading}
              />
              <div className="relative">
                <Input
                  className="pr-10"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-between items-center text-xs">
                <button type="button" className="text-blue-600 underline" onClick={() => setShowReset(true)}>
                  Forgot password?
                </button>
                <span className="text-gray-400">&nbsp;</span>
              </div>
              <Button
                type="submit"
                disabled={loading || !formState.isValid}
                className="mt-2 w-full btn-gradient text-black font-medium flex items-center justify-center"
              >
                {loading && <Loader2 className="animate-spin mr-2" size={18} />}
                Sign in
              </Button>
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full flex items-center justify-center gap-2 border-blue-500 text-blue-700 hover:bg-blue-50"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_17_40)">
                    <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.56 3.02-2.24 5.58-4.76 7.3v6.06h7.7c4.5-4.14 7.09-10.24 7.09-17.676z" fill="#4285F4"/>
                    <path d="M24.48 48c6.48 0 11.92-2.14 15.89-5.82l-7.7-6.06c-2.14 1.44-4.88 2.3-8.19 2.3-6.3 0-11.64-4.26-13.56-9.98H2.67v6.24C6.62 43.98 14.8 48 24.48 48z" fill="#34A853"/>
                    <path d="M10.92 28.44c-.5-1.44-.8-2.98-.8-4.44s.3-3 .8-4.44v-6.24H2.67A23.97 23.97 0 000 24c0 3.98.96 7.76 2.67 11.16l8.25-6.72z" fill="#FBBC05"/>
                    <path d="M24.48 9.52c3.54 0 6.68 1.22 9.16 3.62l6.86-6.86C36.4 2.14 30.96 0 24.48 0 14.8 0 6.62 4.02 2.67 10.08l8.25 6.24c1.92-5.72 7.26-9.98 13.56-9.98z" fill="#EA4335"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_17_40">
                      <path fill="#fff" d="M0 0h48v48H0z"/>
                    </clipPath>
                  </defs>
                </svg>
                <span>Continue with Google</span>
              </Button>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <button type="button" className="text-blue-600 underline" onClick={() => { setSignupOpen(true); onOpenChange(false); }}>
                  Sign up
                </button>
              </div>
            </form>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setErrorMsg(null);
                try {
                  if (otp.length !== 6) throw new Error("Invalid OTP");
                  await login((document.querySelector('input[name="email"]') as HTMLInputElement)?.value, (document.querySelector('input[name="password"]') as HTMLInputElement)?.value);
                  window.location.href = "/dashboard";
                  onOpenChange(false);
                } catch (e: any) {
                  setErrorMsg(e?.message || "OTP verification failed");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <label className="text-sm font-medium">Enter OTP sent to your email</label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOTP}
                  containerClassName="justify-center"
                  disabled={otpLoading}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {otpLoading && <Loader2 className="animate-spin mt-2" size={18} />}
                {otpSent && <span className="text-green-600 text-xs">OTP sent!</span>}
              </div>
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="mt-2 w-full btn-gradient text-black font-medium flex items-center justify-center"
              >
                {loading && <Loader2 className="animate-spin mr-2" size={18} />}
                Verify OTP & Sign in
              </Button>
              <button type="button" className="text-blue-600 underline text-xs mt-2" onClick={() => setShowOTP(false)}>
                Back to login
              </button>
            </form>
          )}
          {showReset && (
            <PasswordResetModal onClose={() => setShowReset(false)} onReset={handlePasswordReset} />
          )}
          <div className="mt-2 text-xs text-yellow-600 text-center">[Email verification required after signup]</div>
        </DialogContent>
      </Dialog>
      <SignupModal open={signupOpen} onOpenChange={setSignupOpen} />
    </React.Fragment>
  );
}

export function SignupModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { register: signup, sendVerification } = useAuth();
  const {
    register,
    handleSubmit,
    formState,
    setError,
    watch,
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const [loading, setLoading] = useState(false);
  const [error, setErrorMsg] = useState<string | null>(null);
  const password = watch("password");
  const [verificationSent, setVerificationSent] = useState(false);

  // Email verification after signup
  const handleSendVerification = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await sendVerification();
      setVerificationSent(true);
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.error || e?.message || "Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create account</DialogTitle>
        </DialogHeader>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <form
          className="grid gap-3"
          onSubmit={handleSubmit(async (v) => {
            setLoading(true);
            setErrorMsg(null);
            try {
              await signup(v.name, v.username, v.email, v.password);
              onOpenChange(false);
            } catch (e: any) {
              setErrorMsg(e?.message || "Signup failed");
            } finally {
              setLoading(false);
            }
          })}
        >
          <input
            className="rounded-md bg-card/60 border border-border/60 px-3 py-2"
            placeholder="Name"
            {...register("name")}
          />
          <input
            className="rounded-md bg-card/60 border border-border/60 px-3 py-2"
            placeholder="Username"
            {...register("username")}
          />
          <input
            className="rounded-md bg-card/60 border border-border/60 px-3 py-2"
            placeholder="Email"
            type="email"
            {...register("email")}
          />
          <input
            className="rounded-md bg-card/60 border border-border/60 px-3 py-2"
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {/* Password requirements feedback */}
          <ul className="text-xs text-gray-500 mt-1 mb-2">
            <li className={password && password.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
            <li className={password && /[A-Z]/.test(password) ? "text-green-600" : ""}>Contains uppercase letter</li>
            <li className={password && /[0-9]/.test(password) ? "text-green-600" : ""}>Contains a number</li>
          </ul>
          <button
            disabled={loading || !formState.isValid}
            className="mt-2 px-4 py-2 rounded-md btn-gradient text-black font-medium"
          >
            Create account
          </button>
        </form>
        {/* Email verification UI */}
        <div className="mt-2 text-xs text-yellow-600">
          {!verificationSent ? (
            <button className="underline" onClick={handleSendVerification} disabled={loading}>
              Send verification email
            </button>
          ) : (
            "Verification email sent!"
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PasswordResetModal({ onClose, onReset }: { onClose: () => void; onReset: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="mt-4 p-3 border rounded bg-gray-50">
      {!submitted ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            onReset(email);
            setSubmitted(true);
          }}
          className="flex flex-col gap-2"
        >
          <input
            className="rounded-md border px-2 py-1"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button className="btn-gradient rounded px-3 py-1" type="submit">Send reset link</button>
        </form>
      ) : (
        <div className="text-green-600 text-sm">If your email exists, a reset link was sent.</div>
      )}
      <button className="text-blue-600 underline text-xs mt-2" onClick={onClose}>Close</button>
    </div>
  );
}