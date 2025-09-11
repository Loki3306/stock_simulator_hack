import { motion } from "framer-motion";
import Particles from "@/components/visual/Particles";

export default function Index() {
  return (
    <div className="bg-hero-gradient">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0"><Particles /></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-secondary">
              No-code algorithmic trading
            </span>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold leading-tight">
              Algorithmic Trading Made Human
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              Create, test, and refine strategies without writing code. Build
              with blocks, validate with backtests, and deploy with confidence.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href="/dashboard"
                className="px-5 py-3 rounded-md btn-gradient text-black font-medium shadow-glow"
              >
                Start Building Strategies
              </a>
              <a
                href="#demo"
                className="px-5 py-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition"
              >
                Watch Demo Video
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              {[
                { k: "Users", v: "10k+" },
                { k: "Strategies", v: "5k+" },
                { k: "Avg. Return", v: "+12.3%" },
              ].map((s) => (
                <div key={s.k} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                  <div className="text-xs text-muted-foreground">{s.k}</div>
                  <div className="font-display text-xl">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative glows */}
        <div
          className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(142,143,247,0.25), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 -left-24 h-64 w-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,170,34,0.25), transparent)",
          }}
        />
      </section>

      {/* Problem / Solution */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="rounded-xl border border-border/60 bg-card/60 p-6">
            <h3 className="font-display text-xl">The Old Way</h3>
            <p className="mt-3 text-muted-foreground">
              Wall Street tools are complex and exclusive. Coding strategies is
              slow and error-prone.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Steep learning curve</li>
              <li>• Expensive infrastructure</li>
              <li>• Manual backtesting workflow</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/60 p-6">
            <h3 className="font-display text-xl">Our Way</h3>
            <p className="mt-3 text-muted-foreground">
              Drag-drop blocks, instant validation, and one-click backtests. All
              in your browser.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Visual builder for logic</li>
              <li>• Real-time metrics and charts</li>
              <li>• Templates to start fast</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Accessibility",
              d: "No code required. Build with blocks and preview instantly.",
            },
            {
              t: "Transparency",
              d: "Clear metrics, understandable logic, shareable results.",
            },
            {
              t: "Innovation",
              d: "AI-assisted suggestions and best-practice templates.",
            },
          ].map((f) => (
            <div
              key={f.t}
              className="rounded-xl border border-border/60 bg-card-gradient p-6 hover:shadow-md transition"
            >
              <h4 className="font-display text-lg">{f.t}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section id="demo" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="rounded-xl border border-white/10 bg-white/5 aspect-video grid place-items-center text-muted-foreground">
            Demo video placeholder
          </div>
          <div className="rounded-xl border border-border/60 bg-card/60 p-6">
            <h3 className="font-display text-xl">Why AlgoTrader Pro?</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Visual strategy builder with smart defaults</li>
              <li>Real-time preview and quick sims</li>
              <li>One-click backtests with detailed results</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-8 text-center">
          <p className="text-secondary">Join 10,000+ retail investors</p>
          <h3 className="mt-2 font-display text-2xl">
            Build your first strategy in minutes
          </h3>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/dashboard"
              className="px-5 py-3 rounded-md btn-gradient text-black font-medium"
            >
              Get Started
            </a>
            <a
              href="/learn"
              className="px-5 py-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
