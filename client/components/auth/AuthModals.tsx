import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { login } = useAuth();
  const { register, handleSubmit, formState } = useForm<{
    email: string;
    password: string;
  }>({ resolver: zodResolver(loginSchema) });
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={handleSubmit(async (v) => {
            setLoading(true);
            try {
              await login(v.email, v.password);
              onOpenChange(false);
            } finally {
              setLoading(false);
            }
          })}
        >
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
          <button
            disabled={loading || !formState.isValid}
            className="mt-2 px-4 py-2 rounded-md btn-gradient text-black font-medium"
          >
            Sign in
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SignupModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { register: signup } = useAuth();
  const { register, handleSubmit, formState } = useForm<{
    name: string;
    email: string;
    password: string;
  }>({ resolver: zodResolver(registerSchema) });
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create account</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={handleSubmit(async (v) => {
            setLoading(true);
            try {
              await signup(v.name, v.email, v.password);
              onOpenChange(false);
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
          <button
            disabled={loading || !formState.isValid}
            className="mt-2 px-4 py-2 rounded-md btn-gradient text-black font-medium"
          >
            Create account
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
