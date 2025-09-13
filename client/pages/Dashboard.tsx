import { useMemo, useState, useEffect } from "react";
import MetricCard from "@/components/custom/MetricCard";
import ChartComponent from "@/components/custom/ChartComponent";
import { Bell, Search, User, Plus, TrendingUp, Activity, Zap, Target, X, CheckCircle, AlertTriangle, Info, Settings, LogOut, CreditCard, HelpCircle, Shield, BarChart3, PieChart, Calendar, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function genSeries(len = 30, base = 100, vol = 2) {
  const out: { date: string; value: number }[] = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.5) * vol;
    out.push({
      date: `D${i + 1}`,
      value: Math.max(0, Math.round(v * 100) / 100),
    });
  }
  return out;
}

export default function Dashboard() {
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Trade Executed Successfully",
      message: "Your buy order for 100 shares of AAPL has been filled at $178.32",
      time: "2 minutes ago",
      read: false,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20"
    },
    {
      id: 2,
      type: "warning",
      title: "High Volatility Alert",
      message: "TSLA showing unusual price movements. Consider reviewing your positions.",
      time: "15 minutes ago",
      read: false,
      icon: AlertTriangle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20"
    },
    {
      id: 3,
      type: "info",
      title: "Strategy Performance Update",
      message: "Your RSI Oversold strategy has generated a +5.2% return this week",
      time: "1 hour ago",
      read: true,
      icon: Info,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      id: 4,
      type: "success",
      title: "Backtest Completed",
      message: "MA Crossover strategy backtest finished with 68% win rate",
      time: "2 hours ago",
      read: true,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20"
    },
    {
      id: 5,
      type: "warning",
      title: "Risk Limit Approached",
      message: "Portfolio risk exposure is at 85% of your maximum threshold",
      time: "3 hours ago",
      read: false,
      icon: AlertTriangle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const market = useMemo(
    () => ({
      SPY: genSeries(40, 450, 2),
      QQQ: genSeries(40, 380, 2.4),
      BTC: genSeries(40, 69000, 250),
    }),
    [],
  );

  // Initialize visible sections for animations
  useEffect(() => {
    setVisibleSections(new Set(['header', 'stats', 'content']));
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-[#F0F0F0]">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Header */}
        <motion.div 
          data-section-id="header"
          className={`text-center mb-6 sm:mb-8 transition-all duration-1000 ${
            visibleSections.has('header') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-8'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-6">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] bg-clip-text text-transparent mb-3 sm:mb-4">
              Trading Dashboard
            </h1>
            <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-[#4A90E2]/20 via-[#3A7BD5]/20 to-[#4A90E2]/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          </div>
          <p className="text-base sm:text-lg text-[#AFAFAF] mb-6 sm:mb-8 max-w-4xl mx-auto px-2 sm:px-0">
            Monitor your strategies, analyze performance, and optimize your trading approach
          </p>

          {/* Enhanced Search and Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="relative group flex-1 w-full sm:w-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4A90E2] via-[#3A7BD5] to-[#4A90E2] rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-[#202020] backdrop-blur-md border border-[#4A90E2]/30 rounded-lg shadow-xl flex items-center">
                <Search className="w-5 h-5 text-[#AFAFAF] ml-4" />
                <input
                  className="flex-1 px-3 py-3 bg-transparent border-0 focus:outline-none placeholder:text-[#AFAFAF] text-[#F0F0F0] text-sm font-medium"
                  placeholder="Search strategies, stocks..."
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 rounded-xl bg-[#202020]/80 border border-[#4A90E2]/30 hover:bg-[#4A90E2]/10 transition-all duration-300 group"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-[#4A90E2] group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      
                      {/* Notifications Panel */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-16 right-0 z-50 w-96 max-h-96 bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                      >
                        {/* Header */}
                        <div className="p-4 border-b border-[#4A90E2]/20 bg-gradient-to-r from-[#4A90E2]/10 to-[#3A7BD5]/10">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-[#F0F0F0]">
                              Notifications {unreadCount > 0 && `(${unreadCount})`}
                            </h3>
                            <div className="flex items-center gap-2">
                              {unreadCount > 0 && (
                                <button
                                  onClick={markAllAsRead}
                                  className="text-xs text-[#4A90E2] hover:text-[#3A7BD5] transition-colors"
                                >
                                  Mark all read
                                </button>
                              )}
                              <button
                                onClick={() => setShowNotifications(false)}
                                className="p-1 hover:bg-[#4A90E2]/20 rounded transition-colors"
                                aria-label="Close notifications"
                              >
                                <X className="w-4 h-4 text-[#AFAFAF]" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notification) => {
                            const IconComponent = notification.icon;
                            return (
                              <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-4 border-b border-[#4A90E2]/10 hover:bg-[#4A90E2]/5 transition-colors cursor-pointer ${
                                  !notification.read ? 'bg-[#4A90E2]/5' : ''
                                }`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-1.5 rounded-full ${notification.bgColor} border ${notification.borderColor}`}>
                                    <IconComponent className={`w-4 h-4 ${notification.color}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className={`font-medium text-sm ${
                                        !notification.read ? 'text-[#F0F0F0]' : 'text-[#CFCFCF]'
                                      }`}>
                                        {notification.title}
                                      </p>
                                      {!notification.read && (
                                        <div className="w-2 h-2 rounded-full bg-[#4A90E2]"></div>
                                      )}
                                    </div>
                                    <p className="text-xs text-[#AFAFAF] mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-[#AFAFAF] mt-1">
                                      {notification.time}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-[#4A90E2]/20 bg-gradient-to-r from-[#4A90E2]/5 to-[#3A7BD5]/5">
                          <button className="w-full text-center text-sm text-[#4A90E2] hover:text-[#3A7BD5] transition-colors">
                            View All Notifications
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] p-0.5 hover:shadow-lg hover:shadow-[#4A90E2]/25 transition-all duration-300"
                  aria-label="Open user menu"
                >
                  <div className="h-full w-full rounded-lg bg-[#202020] flex items-center justify-center hover:bg-[#4A90E2]/10 transition-colors">
                    <User className="h-5 w-5 text-[#4A90E2]" />
                  </div>
                </button>

                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      {/* User Menu Panel */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-12 right-0 z-50 w-72 bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                      >
                        {/* User Info Header */}
                        <div className="p-4 border-b border-[#4A90E2]/20 bg-gradient-to-r from-[#4A90E2]/10 to-[#3A7BD5]/10">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] p-0.5">
                              <div className="h-full w-full rounded-full bg-[#202020] flex items-center justify-center">
                                <User className="h-6 w-6 text-[#4A90E2]" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#F0F0F0]">John Trader</h3>
                              <p className="text-sm text-[#AFAFAF]">Premium Member</p>
                            </div>
                          </div>
                        </div>

                        {/* Account Overview */}
                        <div className="p-4 border-b border-[#4A90E2]/20">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-[#2A2A2A]/50 rounded-lg p-3">
                              <p className="text-[#AFAFAF] text-xs">Portfolio Value</p>
                              <p className="text-[#F0F0F0] font-bold">$52,847</p>
                            </div>
                            <div className="bg-[#2A2A2A]/50 rounded-lg p-3">
                              <p className="text-[#AFAFAF] text-xs">Total Return</p>
                              <p className="text-green-400 font-bold">+24.8%</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          {[
                            { icon: User, label: "Profile Settings", href: "/profile" },
                            { icon: CreditCard, label: "Billing & Subscription", href: "/billing" },
                            { icon: Settings, label: "Trading Preferences", href: "/settings" },
                            { icon: Shield, label: "Security & Privacy", href: "/security" },
                            { icon: HelpCircle, label: "Help & Support", href: "/support" }
                          ].map((item, i) => {
                            const IconComponent = item.icon;
                            return (
                              <motion.a
                                key={i}
                                href={item.href}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#4A90E2]/10 transition-colors group"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <IconComponent className="w-4 h-4 text-[#AFAFAF] group-hover:text-[#4A90E2] transition-colors" />
                                <span className="text-sm text-[#F0F0F0] group-hover:text-[#4A90E2] transition-colors">
                                  {item.label}
                                </span>
                              </motion.a>
                            );
                          })}
                        </div>

                        {/* Logout */}
                        <div className="p-2 border-t border-[#4A90E2]/20">
                          <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors group w-full text-left"
                            onClick={() => {
                              setShowUserMenu(false);
                              // Add logout functionality here
                              console.log("Logging out...");
                            }}
                          >
                            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
                            <span className="text-sm text-red-400 group-hover:text-red-300 transition-colors">
                              Sign Out
                            </span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div 
          data-section-id="stats"
          className={`mb-8 sm:mb-12 transition-all duration-1000 delay-300 ${
            visibleSections.has('stats') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            <motion.div 
              className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden group hover:border-[#4A90E2]/40 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
                  <span className="text-xs text-[#4A90E2] font-medium">+5.2%</span>
                </div>
                <MetricCard
                  title="Portfolio Value"
                  value={12543.67}
                  change={5.2}
                  format="currency"
                  trend="up"
                />
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden group hover:border-[#4A90E2]/40 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-[#4A90E2]" />
                </div>
                <MetricCard title="Active Strategies" value={3} format="number" />
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden group hover:border-[#4A90E2]/40 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-[#4A90E2]" />
                  <span className="text-xs text-[#4A90E2] font-medium">+8.4%</span>
                </div>
                <MetricCard
                  title="Monthly Return"
                  value={8.4}
                  change={8.4}
                  format="percentage"
                  trend="up"
                />
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden group hover:border-[#4A90E2]/40 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-[#4A90E2]" />
                </div>
                <MetricCard title="Risk Score" value={50} format="number" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Performance Overview Section */}
        <motion.div 
          className="grid gap-6 sm:gap-8 lg:grid-cols-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Portfolio Performance Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-[#F0F0F0]">Portfolio Performance</h2>
                <select className="bg-[#2A2A2A] border border-[#4A90E2]/30 rounded-lg px-3 py-1 text-[#F0F0F0] text-sm" aria-label="Select time period">
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              
              <div className="mb-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-[#AFAFAF] text-xs">Total Return</p>
                    <p className="text-green-400 font-bold text-lg">+24.8%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#AFAFAF] text-xs">Best Day</p>
                    <p className="text-green-400 font-bold text-lg">+8.2%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#AFAFAF] text-xs">Worst Day</p>
                    <p className="text-red-400 font-bold text-lg">-3.1%</p>
                  </div>
                </div>
                
                <div className="bg-[#1A1A1A] border border-[#4A90E2]/10 rounded-lg p-4">
                  <ChartComponent
                    type="area"
                    data={genSeries(30, 10000, 200)}
                    height={200}
                    showTooltips={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <h2 className="font-display text-xl font-bold text-[#F0F0F0] mb-6">Today's Summary</h2>
              
              <div className="space-y-4">
                <div className="bg-[#2A2A2A]/50 border border-[#4A90E2]/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#AFAFAF] text-sm">P&L Today</span>
                    <span className="text-green-400 font-bold">+$1,247</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>

                <div className="bg-[#2A2A2A]/50 border border-[#4A90E2]/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#AFAFAF] text-sm">Active Positions</span>
                    <span className="text-[#4A90E2] font-bold">12</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 text-center">
                      <p className="text-xs text-[#AFAFAF]">Winning</p>
                      <p className="text-green-400 font-bold">8</p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-[#AFAFAF]">Losing</p>
                      <p className="text-red-400 font-bold">4</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2A2A2A]/50 border border-[#4A90E2]/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#AFAFAF] text-sm">Win Rate</span>
                    <span className="text-[#4A90E2] font-bold">67%</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] h-2 rounded-full w-2/3"></div>
                  </div>
                </div>

                <motion.button 
                  onClick={() => setShowDetailedReport(true)}
                  className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  View Detailed Report
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Content Grid */}
        <motion.div 
          data-section-id="content"
          className={`transition-all duration-1000 delay-500 ${
            visibleSections.has('content') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Recent Strategies - Enhanced */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F0F0F0]">Recent Strategies</h2>
                  <motion.a
                    href="/builder"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    Create New
                  </motion.a>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { name: "Momentum Trader", return: "+8.4%", status: "Active", color: "green" },
                    { name: "RSI Oversold", return: "+5.2%", status: "Active", color: "green" }, 
                    { name: "MA Crossover", return: "+6.8%", status: "Paused", color: "yellow" },
                    { name: "Bollinger Squeeze", return: "-2.1%", status: "Testing", color: "red" },
                  ].map((strategy, i) => (
                    <motion.div
                      key={i}
                      className="bg-gradient-to-br from-[#2A2A2A] to-[#252525] border border-[#4A90E2]/20 rounded-xl p-4 hover:border-[#4A90E2]/40 hover:shadow-lg hover:shadow-[#4A90E2]/10 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-[#F0F0F0] group-hover:text-[#4A90E2] transition-colors">{strategy.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-[#AFAFAF]">
                              Updated {2 + i}d ago
                            </p>
                            <div className={`w-2 h-2 rounded-full ${
                              strategy.color === 'green' ? 'bg-green-400' :
                              strategy.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                            } animate-pulse`}></div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              strategy.status === 'Active' ? 'bg-green-400/20 text-green-400' :
                              strategy.status === 'Paused' ? 'bg-yellow-400/20 text-yellow-400' :
                              'bg-blue-400/20 text-blue-400'
                            }`}>{strategy.status}</span>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${
                          strategy.color === 'green' ? 'text-green-400' :
                          strategy.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {strategy.return}
                        </span>
                      </div>
                      <div className="mb-3 bg-[#1A1A1A] border border-[#4A90E2]/10 rounded-lg p-2">
                        <ChartComponent
                          type="area"
                          data={genSeries(24, 100 + i * 5, 3)}
                          height={80}
                          showTooltips={false}
                        />
                      </div>
                      <div className="flex gap-2">
                        <a
                          href="/builder"
                          className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#4A90E2]/30 text-[#4A90E2] hover:bg-[#4A90E2]/10 transition-all duration-300 text-center"
                        >
                          Edit
                        </a>
                        <a
                          href="/backtest/mock"
                          className="flex-1 px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] text-white hover:shadow-lg transition-all duration-300 text-center"
                        >
                          Backtest
                        </a>
                      </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Add Strategy Prompt */}
                <motion.div 
                  className="mt-4 p-4 border-2 border-dashed border-[#4A90E2]/30 rounded-lg text-center hover:border-[#4A90E2]/50 transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className="text-[#AFAFAF] text-sm mb-2">Ready to create your next winning strategy?</p>
                  <motion.a
                    href="/builder"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    Build New Strategy
                  </motion.a>
                </motion.div>

                {/* Market Watchlist */}
                <motion.div 
                  className="mt-8 bg-gradient-to-br from-[#1F1F1F] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl p-6 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/3 to-transparent opacity-50"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-lg font-bold text-[#F0F0F0]">Market Watchlist</h3>
                      <button className="text-[#4A90E2] text-sm font-medium hover:text-[#3A7BD5] transition-colors">
                        + Add Symbol
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { symbol: "AAPL", price: "$178.32", change: "+2.4%", changeColor: "text-green-400" },
                        { symbol: "TSLA", price: "$248.50", change: "+1.8%", changeColor: "text-green-400" },
                        { symbol: "NVDA", price: "$432.18", change: "-0.9%", changeColor: "text-red-400" },
                        { symbol: "MSFT", price: "$418.75", change: "+0.5%", changeColor: "text-green-400" }
                      ].map((stock, i) => (
                        <motion.div
                          key={i}
                          className="bg-[#2A2A2A]/30 border border-[#4A90E2]/10 rounded-lg p-3 hover:border-[#4A90E2]/30 transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + i * 0.1 }}
                        >
                          <p className="font-bold text-[#F0F0F0] text-sm">{stock.symbol}</p>
                          <p className="text-[#AFAFAF] text-xs">{stock.price}</p>
                          <p className={`text-xs font-medium ${stock.changeColor}`}>{stock.change}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Trading Signals */}
                <motion.div 
                  className="mt-6 bg-gradient-to-br from-[#1F1F1F] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl p-6 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/3 to-transparent opacity-50"></div>
                  <div className="relative z-10">
                    <h3 className="font-display text-lg font-bold text-[#F0F0F0] mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#4A90E2]" />
                      Live Trading Signals
                    </h3>
                    <div className="space-y-3">
                      {[
                        { signal: "BUY", symbol: "AAPL", confidence: "95%", reason: "Bullish divergence detected", color: "bg-green-500" },
                        { signal: "SELL", symbol: "META", confidence: "78%", reason: "Overbought conditions", color: "bg-red-500" },
                        { signal: "HOLD", symbol: "GOOGL", confidence: "65%", reason: "Sideways trend", color: "bg-yellow-500" }
                      ].map((signal, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-4 p-3 bg-[#2A2A2A]/30 border border-[#4A90E2]/10 rounded-lg hover:border-[#4A90E2]/30 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + i * 0.1 }}
                        >
                          <div className={`px-2 py-1 ${signal.color} rounded text-white text-xs font-bold`}>
                            {signal.signal}
                          </div>
                          <div className="flex-1">
                            <p className="text-[#F0F0F0] font-medium text-sm">{signal.symbol}</p>
                            <p className="text-[#AFAFAF] text-xs">{signal.reason}</p>
                          </div>
                          <span className="text-[#4A90E2] text-sm font-bold">{signal.confidence}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Market Overview & Quick Actions - Enhanced */}
            <div className="grid gap-6">
              {/* Market Overview */}
              <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <h2 className="font-display text-xl font-bold text-[#F0F0F0] mb-4">Market Overview</h2>
                  <div className="grid gap-4">
                    {Object.entries(market).map(([sym, data]) => (
                      <div
                        key={sym}
                        className="bg-[#2A2A2A]/50 border border-[#4A90E2]/20 rounded-lg p-3 hover:border-[#4A90E2]/40 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-semibold text-[#F0F0F0]">{sym}</span>
                          <span className="text-[#4A90E2] font-medium">Bullish</span>
                        </div>
                        <ChartComponent
                          type="line"
                          data={data}
                          height={80}
                          showTooltips={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <h2 className="font-display text-xl font-bold text-[#F0F0F0] mb-4">Quick Actions</h2>
                  <div className="grid gap-3">
                    <motion.a
                      href="/builder"
                      className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] text-white font-semibold text-center hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Create New Strategy
                    </motion.a>
                    <motion.button 
                      className="px-4 py-3 rounded-lg bg-[#2A2A2A]/50 border border-[#4A90E2]/30 text-[#4A90E2] hover:bg-[#4A90E2]/10 transition-all duration-300 font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Import Template
                    </motion.button>
                    <motion.button 
                      className="px-4 py-3 rounded-lg bg-[#2A2A2A]/50 border border-[#4A90E2]/30 text-[#4A90E2] hover:bg-[#4A90E2]/10 transition-all duration-300 font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Run Backtest
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Getting Started Tips */}
              <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <h2 className="font-display text-lg font-bold text-[#F0F0F0] mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#4A90E2]" />
                    Pro Tips
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#2A2A2A]/30 border border-[#4A90E2]/10 rounded-lg">
                      <p className="text-[#F0F0F0] text-sm font-medium mb-1">Diversify Your Strategies</p>
                      <p className="text-[#AFAFAF] text-xs">Combine different indicators for better risk management</p>
                    </div>
                    <div className="p-3 bg-[#2A2A2A]/30 border border-[#4A90E2]/10 rounded-lg">
                      <p className="text-[#F0F0F0] text-sm font-medium mb-1">Regular Backtesting</p>
                      <p className="text-[#AFAFAF] text-xs">Test your strategies on historical data before going live</p>
                    </div>
                    <div className="p-3 bg-[#2A2A2A]/30 border border-[#4A90E2]/10 rounded-lg">
                      <p className="text-[#F0F0F0] text-sm font-medium mb-1">Monitor Market News</p>
                      <p className="text-[#AFAFAF] text-xs">Stay informed about events that might impact your trades</p>
                    </div>
                  </div>
                  <motion.a
                    href="/learn"
                    className="block mt-4 px-4 py-2 text-center text-[#4A90E2] border border-[#4A90E2]/30 rounded-lg hover:bg-[#4A90E2]/10 transition-all duration-300 text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                  >
                    Learn More
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity & Performance Analytics */}
        <motion.div 
          className="grid gap-6 sm:gap-8 lg:grid-cols-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Recent Activity Feed */}
          <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <h2 className="font-display text-xl font-bold text-[#F0F0F0] mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { 
                    action: "Strategy Created", 
                    name: "Momentum Trader", 
                    time: "2 hours ago", 
                    type: "success",
                    url: "/builder",
                    description: "View your newly created trading strategy"
                  },
                  { 
                    action: "Backtest Completed", 
                    name: "RSI Oversold", 
                    time: "4 hours ago", 
                    type: "info",
                    url: "/backtest",
                    description: "Check backtest results and performance metrics"
                  },
                  { 
                    action: "Trade Executed", 
                    name: "AAPL Buy Signal", 
                    time: "6 hours ago", 
                    type: "success",
                    url: "/dashboard",
                    description: "View trade details and current position"
                  },
                  { 
                    action: "Alert Triggered", 
                    name: "High Volatility Warning", 
                    time: "1 day ago", 
                    type: "warning",
                    url: "/dashboard",
                    description: "Review market conditions and adjust strategy"
                  },
                  { 
                    action: "Portfolio Rebalanced", 
                    name: "Risk Management", 
                    time: "2 days ago", 
                    type: "info",
                    url: "/dashboard",
                    description: "View updated portfolio allocation"
                  }
                ].map((activity, i) => (
                  <motion.a
                    key={i}
                    href={activity.url}
                    className="flex items-center gap-4 p-3 bg-[#2A2A2A]/50 border border-[#4A90E2]/10 rounded-lg hover:border-[#4A90E2]/30 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    title={activity.description}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'success' ? 'bg-green-400' :
                      activity.type === 'warning' ? 'bg-yellow-400' : 'bg-[#4A90E2]'
                    } animate-pulse`}></div>
                    <div className="flex-1">
                      <p className="text-[#F0F0F0] font-medium text-sm group-hover:text-[#4A90E2] transition-colors">{activity.action}</p>
                      <p className="text-[#AFAFAF] text-xs">{activity.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#AFAFAF] text-xs">{activity.time}</span>
                      <svg 
                        className="w-3 h-3 text-[#AFAFAF] group-hover:text-[#4A90E2] transition-colors opacity-0 group-hover:opacity-100"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.a>
                ))}
              </div>
              <motion.a
                href="/dashboard?tab=activity"
                className="block w-full mt-4 px-4 py-2 text-center text-[#4A90E2] border border-[#4A90E2]/30 rounded-lg hover:bg-[#4A90E2]/10 transition-all duration-300 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
              >
                View All Activity →
              </motion.a>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <h2 className="font-display text-xl font-bold text-[#F0F0F0] mb-6">Performance Analytics</h2>
              
              {/* Performance Chart */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#AFAFAF] text-sm">Portfolio Growth</span>
                  <span className="text-[#4A90E2] font-semibold">+24.8%</span>
                </div>
                <ChartComponent
                  type="area"
                  data={genSeries(30, 10000, 200)}
                  height={120}
                  showTooltips={false}
                />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2A2A2A]/50 border border-[#4A90E2]/10 rounded-lg p-3">
                  <p className="text-[#AFAFAF] text-xs mb-1">Sharpe Ratio</p>
                  <p className="text-[#F0F0F0] font-bold">1.45</p>
                </div>
                <div className="bg-[#2A2A2A]/50 border border-[#4A90E2]/10 rounded-lg p-3">
                  <p className="text-[#AFAFAF] text-xs mb-1">Max Drawdown</p>
                  <p className="text-red-400 font-bold">-8.2%</p>
                </div>
                <div className="bg-[#2A2A2A]/50 border border-[#4A90E2]/10 rounded-lg p-3">
                  <p className="text-[#AFAFAF] text-xs mb-1">Win Rate</p>
                  <p className="text-green-400 font-bold">68%</p>
                </div>
                <div className="bg-[#2A2A2A]/50 border border-[#4A90E2]/10 rounded-lg p-3">
                  <p className="text-[#AFAFAF] text-xs mb-1">Avg. Return</p>
                  <p className="text-[#4A90E2] font-bold">3.2%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Performing Assets & Risk Management */}
        <motion.div 
          className="grid gap-6 sm:gap-8 lg:grid-cols-3 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* Top Performing Assets */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-[#F0F0F0]">Top Performing Assets</h2>
                <select 
                  className="bg-[#2A2A2A] border border-[#4A90E2]/30 rounded-lg px-3 py-1 text-[#F0F0F0] text-sm"
                  aria-label="Select time period for top performing assets"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
              
              <div className="space-y-4">
                {[
                  { symbol: "NVDA", name: "NVIDIA Corporation", change: "+12.4%", price: "$432.18", volume: "2.1M" },
                  { symbol: "TSLA", name: "Tesla Inc.", change: "+8.7%", price: "$248.50", volume: "1.8M" },
                  { symbol: "AAPL", name: "Apple Inc.", change: "+5.2%", price: "$178.32", volume: "3.2M" },
                  { symbol: "MSFT", name: "Microsoft Corp.", change: "+4.1%", price: "$418.75", volume: "1.5M" },
                  { symbol: "GOOGL", name: "Alphabet Inc.", change: "+3.8%", price: "$142.56", volume: "1.1M" }
                ].map((asset, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between p-4 bg-[#2A2A2A]/50 border border-[#4A90E2]/10 rounded-lg hover:border-[#4A90E2]/30 transition-all duration-300 group cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{asset.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="text-[#F0F0F0] font-semibold group-hover:text-[#4A90E2] transition-colors">{asset.symbol}</p>
                        <p className="text-[#AFAFAF] text-xs">{asset.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#F0F0F0] font-semibold">{asset.price}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-medium text-sm">{asset.change}</span>
                        <span className="text-[#AFAFAF] text-xs">{asset.volume}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Management Panel */}
          <div className="space-y-6">
            {/* Portfolio Allocation */}
            <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
              <div className="relative z-10">
                <h3 className="font-display text-lg font-bold text-[#F0F0F0] mb-4">Portfolio Allocation</h3>
                <div className="space-y-3">
                  {[
                    { category: "Stocks", percentage: 65, color: "#4A90E2" },
                    { category: "Crypto", percentage: 20, color: "#3A7BD5" },
                    { category: "Bonds", percentage: 10, color: "#6B7280" },
                    { category: "Cash", percentage: 5, color: "#10B981" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#AFAFAF]">{item.category}</span>
                        <span className="text-[#F0F0F0] font-medium">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#2A2A2A] rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: 1 + i * 0.1 }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Alerts */}
            <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
              <div className="relative z-10">
                <h3 className="font-display text-lg font-bold text-[#F0F0F0] mb-4">Risk Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-[#F0F0F0] text-sm font-medium">High Correlation</p>
                      <p className="text-[#AFAFAF] text-xs">Tech stocks correlation at 85%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-[#F0F0F0] text-sm font-medium">Rebalance Suggested</p>
                      <p className="text-[#AFAFAF] text-xs">Portfolio drift detected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Economic Calendar & News Feed */}
        <motion.div 
          className="grid gap-6 sm:gap-8 lg:grid-cols-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {/* Economic Calendar */}
          <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <h2 className="font-display text-xl font-bold text-[#F0F0F0] mb-6">Economic Calendar</h2>
              <div className="space-y-4">
                {[
                  { 
                    time: "09:30 EST", 
                    event: "US GDP Growth Rate", 
                    impact: "high", 
                    currency: "USD",
                    url: "https://www.forexfactory.com/calendar"
                  },
                  { 
                    time: "14:00 EST", 
                    event: "Fed Interest Rate Decision", 
                    impact: "high", 
                    currency: "USD",
                    url: "https://www.federalreserve.gov/"
                  },
                  { 
                    time: "16:30 EST", 
                    event: "Crude Oil Inventories", 
                    impact: "medium", 
                    currency: "USD",
                    url: "https://www.eia.gov/"
                  },
                  { 
                    time: "Tomorrow", 
                    event: "Non-Farm Payrolls", 
                    impact: "high", 
                    currency: "USD",
                    url: "https://www.bls.gov/news.release/empsit.nr0.htm"
                  }
                ].map((event, i) => (
                  <motion.a
                    key={i}
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-[#2A2A2A]/50 border border-[#4A90E2]/10 rounded-lg hover:border-[#4A90E2]/30 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        event.impact === 'high' ? 'bg-red-400' : 
                        event.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`}></div>
                      <div>
                        <p className="text-[#F0F0F0] font-medium text-sm group-hover:text-[#4A90E2] transition-colors">{event.event}</p>
                        <p className="text-[#AFAFAF] text-xs">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#4A90E2] font-bold text-sm">{event.currency}</span>
                      <svg 
                        className="w-3 h-3 text-[#AFAFAF] group-hover:text-[#4A90E2] transition-colors"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Market News */}
          <div className="bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-xl sm:rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <h2 className="font-display text-xl font-bold text-[#F0F0F0] mb-6">Market News</h2>
              <div className="space-y-4">
                {[
                  { 
                    title: "Fed Signals Dovish Stance on Interest Rates", 
                    time: "2 hours ago", 
                    source: "Reuters",
                    url: "https://www.reuters.com/markets/us/",
                    excerpt: "Federal Reserve officials hint at potential rate cuts in upcoming meetings amid economic uncertainty."
                  },
                  { 
                    title: "Tech Stocks Rally on AI Breakthrough News", 
                    time: "4 hours ago", 
                    source: "Bloomberg",
                    url: "https://www.bloomberg.com/technology",
                    excerpt: "Major technology companies see significant gains following announcements of new artificial intelligence capabilities."
                  },
                  { 
                    title: "Oil Prices Surge Amid Supply Concerns", 
                    time: "6 hours ago", 
                    source: "WSJ",
                    url: "https://www.wsj.com/news/markets",
                    excerpt: "Crude oil futures rise sharply as geopolitical tensions threaten global supply chains."
                  },
                  { 
                    title: "Crypto Market Shows Signs of Recovery", 
                    time: "8 hours ago", 
                    source: "CoinDesk",
                    url: "https://www.coindesk.com/",
                    excerpt: "Bitcoin and major altcoins gain momentum as institutional adoption continues to grow."
                  }
                ].map((news, i) => (
                  <motion.a
                    key={i}
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-[#2A2A2A]/50 border border-[#4A90E2]/10 rounded-lg hover:border-[#4A90E2]/30 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      // Add analytics tracking or custom behavior here if needed
                      console.log(`Opening news: ${news.title}`);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-[#F0F0F0] font-medium text-sm group-hover:text-[#4A90E2] transition-colors line-clamp-2 flex-1 mr-2">
                        {news.title}
                      </p>
                      <svg 
                        className="w-4 h-4 text-[#AFAFAF] group-hover:text-[#4A90E2] transition-colors flex-shrink-0 mt-0.5"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-[#AFAFAF] text-xs mb-2 line-clamp-2 group-hover:text-[#CFCFCF] transition-colors">
                      {news.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#AFAFAF] text-xs font-medium group-hover:text-[#4A90E2] transition-colors">{news.source}</span>
                      <span className="text-[#AFAFAF] text-xs">{news.time}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
              <motion.a
                href="https://www.marketwatch.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-4 px-4 py-2 text-center text-[#4A90E2] border border-[#4A90E2]/30 rounded-lg hover:bg-[#4A90E2]/10 transition-all duration-300 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
              >
                View All News →
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Report Modal */}
      <AnimatePresence>
        {showDetailedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDetailedReport(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-[#202020] to-[#1A1A1A] border border-[#4A90E2]/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#4A90E2]/20 bg-gradient-to-r from-[#4A90E2]/10 to-[#3A7BD5]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-[#4A90E2]" />
                    <h2 className="text-2xl font-bold text-[#F0F0F0]">Detailed Trading Report</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2]/20 border border-[#4A90E2]/30 rounded-lg text-[#4A90E2] hover:bg-[#4A90E2]/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Download className="w-4 h-4" />
                      Export PDF
                    </motion.button>
                    <button
                      onClick={() => setShowDetailedReport(false)}
                      className="p-2 hover:bg-[#4A90E2]/20 rounded-lg transition-colors"
                      aria-label="Close detailed report"
                    >
                      <X className="w-5 h-5 text-[#AFAFAF]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { title: "Total P&L", value: "+$12,847", change: "+24.8%", color: "text-green-400", icon: TrendingUp },
                    { title: "Win Rate", value: "67%", change: "+5% vs last month", color: "text-blue-400", icon: Target },
                    { title: "Total Trades", value: "156", change: "+12 this week", color: "text-purple-400", icon: Activity },
                    { title: "Avg. Return", value: "3.2%", change: "Per trade", color: "text-orange-400", icon: BarChart3 }
                  ].map((stat, i) => {
                    const IconComponent = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gradient-to-br from-[#2A2A2A] to-[#252525] border border-[#4A90E2]/20 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className={`w-5 h-5 ${stat.color}`} />
                          <p className="text-[#AFAFAF] text-sm">{stat.title}</p>
                        </div>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-[#AFAFAF]">{stat.change}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Performance Chart */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-[#2A2A2A] to-[#252525] border border-[#4A90E2]/20 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4">Portfolio Performance (30 Days)</h3>
                    <div className="h-64 bg-[#1A1A1A] border border-[#4A90E2]/10 rounded-lg p-4">
                      <ChartComponent
                        type="area"
                        data={genSeries(30, 10000, 200)}
                        height={220}
                        showTooltips={true}
                      />
                    </div>
                  </motion.div>

                  {/* Asset Allocation */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-[#2A2A2A] to-[#252525] border border-[#4A90E2]/20 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4">Asset Allocation</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Technology", percentage: 45, color: "#4A90E2", value: "$23,780" },
                        { name: "Healthcare", percentage: 25, color: "#3A7BD5", value: "$13,212" },
                        { name: "Finance", percentage: 20, color: "#6B7280", value: "$10,569" },
                        { name: "Energy", percentage: 10, color: "#10B981", value: "$5,286" }
                      ].map((asset, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[#F0F0F0] text-sm">{asset.name}</span>
                            <div className="text-right">
                              <span className="text-[#F0F0F0] font-semibold">{asset.percentage}%</span>
                              <p className="text-[#AFAFAF] text-xs">{asset.value}</p>
                            </div>
                          </div>
                          <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full"
                              style={{ backgroundColor: asset.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${asset.percentage}%` }}
                              transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Recent Trades Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-[#2A2A2A] to-[#252525] border border-[#4A90E2]/20 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4">Recent Trades</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#4A90E2]/20">
                          <th className="text-left text-[#AFAFAF] text-sm py-3">Symbol</th>
                          <th className="text-left text-[#AFAFAF] text-sm py-3">Type</th>
                          <th className="text-left text-[#AFAFAF] text-sm py-3">Quantity</th>
                          <th className="text-left text-[#AFAFAF] text-sm py-3">Price</th>
                          <th className="text-left text-[#AFAFAF] text-sm py-3">P&L</th>
                          <th className="text-left text-[#AFAFAF] text-sm py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { symbol: "AAPL", type: "BUY", qty: 100, price: "$178.32", pl: "+$847", date: "Today", plColor: "text-green-400" },
                          { symbol: "TSLA", type: "SELL", qty: 50, price: "$248.50", pl: "+$1,240", date: "Yesterday", plColor: "text-green-400" },
                          { symbol: "NVDA", type: "BUY", qty: 25, price: "$432.18", pl: "-$124", date: "2 days ago", plColor: "text-red-400" },
                          { symbol: "MSFT", type: "SELL", qty: 75, price: "$418.75", pl: "+$683", date: "3 days ago", plColor: "text-green-400" }
                        ].map((trade, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.05 }}
                            className="border-b border-[#4A90E2]/10 hover:bg-[#4A90E2]/5 transition-colors"
                          >
                            <td className="py-3 text-[#F0F0F0] font-medium">{trade.symbol}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {trade.type}
                              </span>
                            </td>
                            <td className="py-3 text-[#AFAFAF]">{trade.qty}</td>
                            <td className="py-3 text-[#F0F0F0]">{trade.price}</td>
                            <td className={`py-3 font-semibold ${trade.plColor}`}>{trade.pl}</td>
                            <td className="py-3 text-[#AFAFAF] text-sm">{trade.date}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
