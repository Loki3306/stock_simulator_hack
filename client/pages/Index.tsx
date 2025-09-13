import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Particles from "@/components/visual/Particles";
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  Users, 
  BarChart3, 
  Play, 
  Check, 
  ArrowRight,
  Star,
  ChevronRight,
  DollarSign,
  PieChart,
  Activity
} from "lucide-react";
import { useState } from "react";
import { SignupModal } from "@/components/auth/AuthModals";

export default function Index() {
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <div className="bg-hero-gradient relative">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-l from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>



      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Particles />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 pr-[420px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="px-5 py-3 rounded-md btn-gradient text-black font-medium shadow-glow group inline-flex items-center gap-2"
                >
                  Start Building Strategies
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.a
                href="#demo"
                className="px-5 py-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition inline-flex items-center gap-2 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Watch Demo Video
              </motion.a>
            </div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl"
            >
              {[
                { icon: <Shield className="w-5 h-5" />, title: "No Coding Required", desc: "Visual drag-and-drop interface" },
                { icon: <Zap className="w-5 h-5" />, title: "Real-time Testing", desc: "Instant backtesting results" },
                { icon: <Target className="w-5 h-5" />, title: "Risk Management", desc: "Built-in safety controls" },
                { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics Dashboard", desc: "Performance insights" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-blue-400 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Trusted by 10,000+ traders</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>5,000+ strategies created</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Bank-level security</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative glows */}
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl bg-gradient-radial from-purple-400/25 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 -left-24 h-64 w-64 rounded-full blur-3xl bg-gradient-radial from-orange-400/25 to-transparent" />
      </section>

      {/* Problem / Solution */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-16 pr-[420px]">
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

      {/* Interactive Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Built for Modern Traders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in algorithmic trading, made simple and accessible
          </p>
        </motion.div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              t: "Accessibility",
              d: "No code required. Build with blocks and preview instantly.",
              icon: <Users className="w-6 h-6" />,
              color: "from-blue-500 to-cyan-500"
            },
            {
              t: "Transparency",
              d: "Clear metrics, understandable logic, shareable results.",
              icon: <Shield className="w-6 h-6" />,
              color: "from-green-500 to-emerald-500"
            },
            {
              t: "Innovation",
              d: "AI-assisted suggestions and best-practice templates.",
              icon: <Zap className="w-6 h-6" />,
              color: "from-purple-500 to-pink-500"
            },
          ].map((f, index) => (
            <motion.div
              key={f.t}
              className="rounded-xl border border-border/60 bg-card-gradient p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              viewport={{ once: true }}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${f.color} mb-4 text-white group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="font-display text-lg mb-2 group-hover:text-white transition-colors">{f.t}</h4>
                <p className="text-sm text-muted-foreground group-hover:text-gray-300 transition-colors">{f.d}</p>
              </div>
              
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Demo Showcase */}
      <section
        id="demo"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            See It In Action
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Watch how easy it is to build profitable trading strategies
          </motion.p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <motion.div 
            className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] aspect-video relative overflow-hidden group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Simulated Strategy Builder Interface */}
            <div className="absolute inset-4 bg-black/90 rounded-lg p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-xs text-gray-400 ml-2">Strategy Builder</span>
              </div>
              
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="bg-blue-500/20 rounded p-2 text-xs text-blue-300 border border-blue-500/30">
                  Moving Average
                </div>
                <div className="bg-green-500/20 rounded p-2 text-xs text-green-300 border border-green-500/30">
                  Buy Signal
                </div>
                <div className="bg-red-500/20 rounded p-2 text-xs text-red-300 border border-red-500/30">
                  Stop Loss
                </div>
                <div className="bg-purple-500/20 rounded p-2 text-xs text-purple-300 border border-purple-500/30">
                  RSI Filter
                </div>
                <div className="bg-orange-500/20 rounded p-2 text-xs text-orange-300 border border-orange-500/30">
                  Position Size
                </div>
                <div className="bg-cyan-500/20 rounded p-2 text-xs text-cyan-300 border border-cyan-500/30">
                  Profit Target
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                  <Play className="w-3 h-3" />
                  <span>Click to see live demo</span>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="rounded-xl border border-border/60 bg-card/60 p-6">
              <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Why AlgoTrader Pro?
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <motion.div 
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                  <span className="group-hover:text-white transition-colors">Visual strategy builder with smart defaults</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                  <span className="group-hover:text-white transition-colors">Real-time preview and quick simulations</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  <span className="group-hover:text-white transition-colors">One-click backtests with detailed results</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                  <span className="group-hover:text-white transition-colors">Deploy to live trading in seconds</span>
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/builder"
                  className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Try Builder Now
                </Link>
              </motion.div>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/learn"
                  className="block px-4 py-3 border border-white/20 bg-white/5 hover:bg-white/10 text-center rounded-lg transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Professional Trading Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build, test, and deploy profitable trading strategies
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Real-time Market Data",
              description: "Live price feeds, volume analysis, and market indicators updated every second"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Risk Management",
              description: "Advanced stop-loss, position sizing, and portfolio protection tools"
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Lightning Fast Execution",
              description: "Sub-millisecond order execution with smart routing algorithms"
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "Advanced Analytics",
              description: "Comprehensive backtesting, performance metrics, and detailed reporting"
            },
            {
              icon: <Target className="w-8 h-8" />,
              title: "Strategy Optimization",
              description: "AI-powered parameter tuning and strategy enhancement suggestions"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Community Strategies",
              description: "Access proven strategies from top performers in our marketplace"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 transition-all duration-300 group"
            >
              <div className="text-blue-400 mb-4 group-hover:text-blue-300 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-muted-foreground">
              Join a growing community of successful traders
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="w-6 h-6" />, stat: "25,000+", label: "Active Users" },
              { icon: <DollarSign className="w-6 h-6" />, stat: "$50M+", label: "Total Volume" },
              { icon: <PieChart className="w-6 h-6" />, stat: "15,000+", label: "Strategies Created" },
              { icon: <Activity className="w-6 h-6" />, stat: "94%", label: "Success Rate" }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-colors">
                  {item.icon}
                </div>
                <div className="font-display text-2xl md:text-3xl font-bold mb-2">{item.stat}</div>
                <div className="text-muted-foreground text-sm">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              name: "Sarah Chen",
              role: "Day Trader",
              content: "This platform transformed my trading. I went from losing money to consistent 15% monthly returns.",
              rating: 5
            },
            {
              name: "Mike Rodriguez",
              role: "Portfolio Manager",
              content: "The visual strategy builder is incredible. I can prototype ideas in minutes instead of hours.",
              rating: 5
            },
            {
              name: "Emma Thompson",
              role: "Quantitative Analyst",
              content: "Best backtesting engine I've used. The accuracy and speed are unmatched in this price range.",
              rating: 5
            }
          ].map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your trading style
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              name: "Starter",
              price: "Free",
              features: ["5 Active Strategies", "Basic Backtesting", "Community Access", "Email Support"],
              popular: false
            },
            {
              name: "Pro",
              price: "$29/mo",
              features: ["Unlimited Strategies", "Advanced Backtesting", "Real-time Data", "Priority Support", "API Access"],
              popular: true
            },
            {
              name: "Enterprise",
              price: "Custom",
              features: ["White-label Solution", "Dedicated Support", "Custom Integrations", "Advanced Analytics", "Team Management"],
              popular: false
            }
          ].map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`rounded-xl border p-6 relative ${
                plan.popular 
                  ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10' 
                  : 'border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="font-display text-3xl font-bold mb-4">{plan.price}</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {plan.name === "Enterprise" ? (
                <button 
                  onClick={() => window.open('mailto:sales@algotrader.com?subject=Enterprise Plan Inquiry', '_blank')}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 border border-white/15 bg-white/5 hover:bg-white/10"
                >
                  Contact Sales
                </button>
              ) : plan.name === "Starter" ? (
                <Link
                  to="/dashboard"
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-center block border border-white/15 bg-white/5 hover:bg-white/10"
                >
                  Get Started
                </Link>
              ) : (
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                >
                  Get Started
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="space-y-6">
          {[
            {
              q: "Do I need programming experience to use this platform?",
              a: "Not at all! Our visual drag-and-drop interface allows anyone to build sophisticated trading strategies without writing a single line of code."
            },
            {
              q: "How accurate are the backtesting results?",
              a: "Our backtesting engine uses high-quality historical data with realistic slippage and commission models to provide accurate results that closely match live trading performance."
            },
            {
              q: "Can I use my own broker?",
              a: "Yes! We support integration with most major brokers through standard APIs. You can also paper trade to test strategies without real money."
            },
            {
              q: "Is my data and strategies secure?",
              a: "Absolutely. We use enterprise-grade encryption and security measures to protect your data. Your strategies remain private and are never shared without your permission."
            }
          ].map((faq, index) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer group"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all duration-300" />
                {faq.q}
              </h3>
              <p className="text-muted-foreground leading-relaxed group-hover:text-gray-300 transition-colors">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of traders who have already discovered the power of algorithmic trading made simple.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Start Building Now
              <Play className="w-4 h-4" />
            </Link>
            <Link
              to="/learn"
              className="px-8 py-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Explore Learning Resources
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Signup Modal */}
      <SignupModal 
        open={showSignupModal} 
        onOpenChange={setShowSignupModal}
      />
    </div>
  );
}
