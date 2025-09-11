export interface LearnItem {
  id: string;
  type: "blog" | "course" | "video" | "playlist";
  title: string;
  author: string;
  summary: string;
  createdAt: number;
  videoUrl?: string; // YouTube URL
  duration?: string; // Video duration like "10:30"
  createdBy?: string; // User ID or email of creator (for deletion permissions)
  category?: string; // Category like "Strategy", "Technical Analysis", etc.
  playlistVideos?: string[]; // Array of video IDs for playlists
  difficulty?: "beginner" | "intermediate" | "advanced";
  content?: string; // Full content for blogs and courses
  url?: string; // External URL for original blog/course source
}
const KEY = "mock_learn";
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function read(): LearnItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(v: LearnItem[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
}

// YouTube utility functions
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function seedLearn() {
  const cur = read();
  if (cur.length) return;
  
  write([
    // PLAYLISTS
    {
      id: "playlist_technical_analysis",
      type: "playlist",
      title: "Technical Analysis Mastery",
      author: "Trading Academy",
      summary: "Complete guide to technical analysis from basic chart reading to advanced indicators. Perfect for beginners to intermediate traders.",
      playlistVideos: ["tech_chart_reading", "tech_rsi_indicator", "tech_macd_strategy", "tech_bollinger_bands", "tech_support_resistance", "tech_fibonacci", "tech_candlestick_patterns"],
      category: "Technical Analysis",
      difficulty: "beginner",
      duration: "2:15:30",
      createdAt: Date.now() - 86400000 * 1,
    },
    {
      id: "playlist_trading_strategies",
      type: "playlist", 
      title: "Trading Strategies Fundamentals",
      author: "Strategy Masters",
      summary: "Learn different trading approaches and find your optimal trading style. From day trading to long-term investing strategies.",
      playlistVideos: ["strategy_trading_styles", "strategy_portfolio_building", "strategy_warren_buffett", "strategy_risk_management"],
      category: "Trading Strategy",
      difficulty: "beginner",
      duration: "1:45:22",
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: "playlist_risk_management",
      type: "playlist",
      title: "Risk Management & Psychology",
      author: "Risk Experts",
      summary: "Master the mental and risk management aspects of trading. Essential for consistent profitability.",
      playlistVideos: ["risk_position_sizing", "risk_stop_loss", "psychology_trading_emotions", "risk_portfolio_diversification"],
      category: "Risk Management",
      difficulty: "intermediate",
      duration: "1:32:15",
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: "playlist_market_analysis",
      type: "playlist",
      title: "Market Analysis & Economics",
      author: "Market Analysts",
      summary: "Understand market dynamics, economic indicators, and fundamental analysis for better trading decisions.",
      playlistVideos: ["market_economic_indicators", "market_volume_analysis", "fundamental_earnings_analysis", "market_sector_rotation"],
      category: "Market Analysis",
      difficulty: "intermediate",
      duration: "2:05:45",
      createdAt: Date.now() - 86400000 * 4,
    },
    {
      id: "playlist_advanced_trading",
      type: "playlist",
      title: "Advanced Trading Techniques", 
      author: "Pro Trading Institute",
      summary: "Advanced strategies for experienced traders including options, algorithms, and quantitative analysis.",
      playlistVideos: ["advanced_options_strategies", "advanced_algorithmic_trading", "advanced_quantitative_analysis", "advanced_derivatives"],
      category: "Advanced Trading",
      difficulty: "advanced",
      duration: "3:20:12",
      createdAt: Date.now() - 86400000 * 5,
    },

    // BLOGS
    {
      id: uid(),
      type: "blog",
      title: "Understanding Market Volatility and Risk Management",
      author: "Sarah Chen",
      summary: "Learn how to navigate volatile markets with proper risk management techniques and position sizing strategies.",
      content: `# Understanding Market Volatility and Risk Management

Market volatility is one of the most challenging aspects of trading and investing. Understanding how to navigate volatile markets can mean the difference between consistent profits and devastating losses.

## What is Market Volatility?

Volatility refers to the degree of variation in a trading price series over time. High volatility means large price swings, while low volatility indicates more stable prices.

### Key Volatility Indicators:
- **VIX (Fear Index)**: Measures expected volatility in the S&P 500
- **Average True Range (ATR)**: Shows average price range over time
- **Bollinger Bands**: Expand and contract based on volatility

## Risk Management Fundamentals

### 1. Position Sizing
Never risk more than 1-2% of your total capital on a single trade. This ensures you can survive a string of losses without devastating your account.

### 2. Stop Loss Orders
Always have a predetermined exit point before entering a trade. This removes emotion from the decision-making process.

### 3. Diversification
Don't put all your eggs in one basket. Spread risk across different:
- Asset classes (stocks, bonds, commodities)
- Sectors (technology, healthcare, finance)
- Geographic regions (domestic vs. international)

## Practical Strategies for Volatile Markets

### During High Volatility:
- Reduce position sizes
- Use wider stop losses
- Consider protective puts
- Focus on quality companies with strong fundamentals

### During Low Volatility:
- Look for breakout opportunities
- Consider selling volatility (covered calls)
- Prepare for potential volatility spikes

## Conclusion

Successful trading isn't about predicting market direction—it's about managing risk and protecting your capital. By implementing proper risk management techniques, you can navigate any market environment with confidence.

Remember: "It's not about being right or wrong, it's about how much money you make when you're right and how much you lose when you're wrong."`,
      createdAt: Date.now() - 86400000 * 1,
    },
    {
      id: uid(),
      type: "blog",
      title: "Fundamental Analysis: Reading Financial Statements",
      author: "Michael Rodriguez",
      summary: "Master the art of analyzing company financials, P/E ratios, and balance sheets to make informed investment decisions.",
      url: "https://www.investopedia.com/articles/fundamental-analysis/09/five-must-have-metrics-value-investors.asp",
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: uid(),
      type: "blog",
      title: "The Psychology of Trading: Overcoming Emotional Bias",
      author: "Dr. Emma Watson",
      summary: "Explore common psychological pitfalls in trading and develop mental strategies to maintain discipline and objectivity.",
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      id: uid(),
      type: "blog",
      title: "Dividend Investing Strategies for Long-term Wealth",
      author: "Robert Kim",
      summary: "Build a sustainable income stream through dividend-paying stocks and REITs with proven screening methods.",
      createdAt: Date.now() - 86400000 * 7,
    },

    // COURSES
    {
      id: uid(),
      type: "course",
      title: "Complete Stock Market Bootcamp for Beginners",
      author: "Trading Academy Pro",
      summary: "A comprehensive 8-week course covering everything from basic market concepts to advanced trading strategies.",
      content: `# Complete Stock Market Bootcamp for Beginners

Welcome to the most comprehensive stock market course designed specifically for beginners. Over the next 8 weeks, you'll transform from a complete novice to a confident trader.

## Course Overview

### Week 1: Market Fundamentals
- How the stock market works
- Types of securities (stocks, bonds, ETFs)
- Market participants and their roles
- Stock exchanges and trading hours

### Week 2: Investment Basics
- Risk vs. reward concepts
- Time value of money
- Compound interest and its power
- Investment goals and planning

### Week 3: Fundamental Analysis
- Reading financial statements
- Key financial ratios
- P/E ratio, EPS, and valuation metrics
- Industry and sector analysis

### Week 4: Technical Analysis Introduction
- Chart types and timeframes
- Support and resistance levels
- Trend identification
- Moving averages

### Week 5: Trading Strategies
- Buy and hold vs. active trading
- Day trading, swing trading, position trading
- Entry and exit strategies
- Risk management techniques

### Week 6: Advanced Concepts
- Options basics
- Dividend investing
- Market psychology
- Common trading mistakes

### Week 7: Portfolio Management
- Asset allocation
- Diversification strategies
- Rebalancing techniques
- Tax considerations

### Week 8: Putting It All Together
- Creating your trading plan
- Backtesting strategies
- Live trading simulation
- Next steps in your trading journey

## What You'll Get:
- 40+ video lessons (8+ hours)
- Downloadable resources and checklists
- Practice exercises and quizzes
- Access to our private community
- 1-on-1 mentorship session
- Certificate of completion

## Prerequisites:
- No prior experience required
- Basic computer skills
- Willingness to learn and practice

Start your journey to financial independence today!`,
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: uid(),
      type: "course",
      title: "Options Trading Mastery: From Basics to Advanced Strategies",
      author: "Options Experts",
      summary: "Master call options, put options, spreads, and advanced strategies like iron condors and butterflies.",
      url: "https://www.optionseducation.org/getting_started",
      createdAt: Date.now() - 86400000 * 4,
    },
    {
      id: uid(),
      type: "course",
      title: "Algorithmic Trading with Python",
      author: "QuantTech Institute",
      summary: "Build automated trading systems using Python, pandas, and popular trading APIs. No prior coding experience required.",
      createdAt: Date.now() - 86400000 * 6,
    },
    {
      id: uid(),
      type: "course",
      title: "Value Investing Like Warren Buffett",
      author: "Investment Legends",
      summary: "Learn the time-tested principles of value investing and how to identify undervalued companies with strong fundamentals.",
      createdAt: Date.now() - 86400000 * 8,
    },

    // TECHNICAL ANALYSIS VIDEOS
    {
      id: "tech_chart_reading",
      type: "video",
      title: "How to Read Stock Charts Like a Pro",
      author: "ChartMaster",
      summary: "Master candlestick patterns, support/resistance levels, and trend analysis in this comprehensive tutorial.",
      videoUrl: "https://www.youtube.com/watch?v=p_Pe_RCnNI0",
      duration: "18:24",
      category: "Technical Analysis",
      difficulty: "beginner",
      createdAt: Date.now() - 86400000 * 1,
    },
    {
      id: "tech_rsi_indicator",
      type: "video",
      title: "RSI Indicator Explained: Buy and Sell Signals",
      author: "Technical Analysis Hub",
      summary: "Learn how to use the Relative Strength Index (RSI) to identify overbought and oversold conditions.",
      videoUrl: "https://www.youtube.com/watch?v=CFIa7vV5OkI",
      duration: "12:33",
      category: "Technical Analysis",
      difficulty: "intermediate",
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: "strategy_portfolio_building",
      type: "video",
      title: "Building Your First Stock Portfolio: Step by Step",
      author: "Investing Simplified",
      summary: "A beginner-friendly guide to creating a diversified portfolio with proper asset allocation and risk management.",
      videoUrl: "https://www.youtube.com/watch?v=gFQNPmLKj1k",
      duration: "25:17",
      category: "Investment Strategy",
      difficulty: "beginner",
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: uid(),
      type: "video",
      title: "Market Analysis: Reading Economic Indicators",
      author: "Economic Insights",
      summary: "Understand how GDP, inflation, employment data, and Fed decisions impact stock market movements.",
      videoUrl: "https://www.youtube.com/watch?v=3dBNbJaM6HA", // Real economic analysis video
      duration: "22:45",
      createdAt: Date.now() - 86400000 * 4,
    },
    {
      id: "strategy_trading_styles",
      type: "video",
      title: "Day Trading vs Swing Trading: Which is Right for You?",
      author: "Trading Strategies",
      summary: "Compare different trading styles, time commitments, and risk profiles to find your optimal approach.",
      videoUrl: "https://www.youtube.com/watch?v=YXWgMbkeKKI",
      duration: "16:52",
      category: "Trading Strategy",
      difficulty: "beginner",
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      id: uid(),
      type: "video",
      title: "Understanding Market Cap and Stock Valuation",
      author: "Finance Fundamentals",
      summary: "Learn how to evaluate companies using market capitalization, P/E ratios, and other key valuation metrics.",
      videoUrl: "https://www.youtube.com/watch?v=NxD_NrqF6QM", // Real valuation tutorial
      duration: "14:28",
      createdAt: Date.now() - 86400000 * 6,
    },

    // ADVANCED MIXED CONTENT
    {
      id: uid(),
      type: "blog",
      title: "Cryptocurrency Trading: Bitcoin and Altcoin Strategies",
      author: "Crypto Analyst",
      summary: "Navigate the volatile crypto markets with proven trading strategies and risk management techniques.",
      createdAt: Date.now() - 86400000 * 9,
    },
    {
      id: uid(),
      type: "course",
      title: "International Markets & Currency Trading (Forex)",
      author: "Global Markets Institute",
      summary: "Master foreign exchange trading, currency pairs analysis, and international market dynamics.",
      createdAt: Date.now() - 86400000 * 10,
    },
    {
      id: uid(),
      type: "video",
      title: "Warren Buffett's Investment Philosophy Explained",
      author: "Investment Wisdom",
      summary: "Deep dive into the legendary investor's approach to picking winning stocks and building wealth over time.",
      videoUrl: "https://www.youtube.com/watch?v=7SW_4hrs1B8", // Real Buffett analysis video
      duration: "28:15",
      createdAt: Date.now() - 86400000 * 7,
    },
    {
      id: uid(),
      type: "blog",
      title: "ETF vs Mutual Funds: Complete Comparison Guide",
      author: "Fund Analysis Pro",
      summary: "Understand the key differences, costs, tax implications, and performance characteristics of ETFs versus mutual funds.",
      createdAt: Date.now() - 86400000 * 11,
    },
    {
      id: uid(),
      type: "video",
      title: "How to Use Moving Averages for Trading Signals",
      author: "Technical Trader",
      summary: "Master simple and exponential moving averages to identify trends and generate buy/sell signals.",
      videoUrl: "https://www.youtube.com/watch?v=oT9otGXXZGs", // Real moving averages tutorial
      duration: "19:33",
      createdAt: Date.now() - 86400000 * 8,
    },

    // ADDITIONAL VIDEOS
    {
      id: "tech_macd_strategy",
      type: "video",
      title: "MACD Indicator Strategy: Complete Guide",
      author: "TradingView Academy",
      summary: "Learn how to use MACD crossovers, divergences, and histogram patterns for profitable trading.",
      videoUrl: "https://www.youtube.com/watch?v=HhHtpbNvDag",
      duration: "21:15",
      category: "Technical Analysis",
      difficulty: "intermediate",
      createdAt: Date.now() - 86400000 * 9,
    },
    {
      id: uid(),
      type: "video",
      title: "Bollinger Bands Trading Strategy Explained",
      author: "Market Wizard",
      summary: "Discover how to use Bollinger Bands for volatility analysis and mean reversion strategies.",
      videoUrl: "https://www.youtube.com/watch?v=SwdWjtltqaI", // Real Bollinger Bands tutorial
      duration: "16:42",
      createdAt: Date.now() - 86400000 * 10,
    },
    {
      id: uid(),
      type: "video",
      title: "Support and Resistance Levels: The Foundation of Trading",
      author: "Chart Masters",
      summary: "Master the art of identifying key support and resistance levels for better entry and exit points.",
      videoUrl: "https://www.youtube.com/watch?v=yr8FLUDsMII", // Real support/resistance tutorial
      duration: "24:18",
      createdAt: Date.now() - 86400000 * 11,
    },
    {
      id: uid(),
      type: "video",
      title: "Fibonacci Retracement Trading Strategy",
      author: "Golden Ratio Trading",
      summary: "Use Fibonacci levels to predict price retracements and find optimal entry points in trending markets.",
      videoUrl: "https://www.youtube.com/watch?v=D3jT6wC4_Qs", // Real Fibonacci tutorial
      duration: "18:36",
      createdAt: Date.now() - 86400000 * 12,
    },
    {
      id: uid(),
      type: "video",
      title: "Volume Analysis: Reading Market Sentiment",
      author: "Volume Trader Pro",
      summary: "Learn how trading volume confirms price movements and reveals institutional buying/selling patterns.",
      videoUrl: "https://www.youtube.com/watch?v=PYYmZrn1wjs", // Real volume analysis tutorial
      duration: "20:24",
      createdAt: Date.now() - 86400000 * 13,
    },
    {
      id: uid(),
      type: "video",
      title: "Candlestick Patterns Every Trader Should Know",
      author: "Candle Master",
      summary: "Master doji, hammer, engulfing, and other essential candlestick patterns for market timing.",
      videoUrl: "https://www.youtube.com/watch?v=h2-RGgYlsNc", // Real candlestick patterns tutorial
      duration: "26:12",
      createdAt: Date.now() - 86400000 * 14,
    },

    // ADDITIONAL BLOGS
    {
      id: uid(),
      type: "blog",
      title: "Sector Rotation Strategy: Following Market Cycles",
      author: "Macro Investor",
      summary: "Learn how to identify sector rotation patterns and position your portfolio for different economic cycles.",
      createdAt: Date.now() - 86400000 * 12,
    },
    {
      id: uid(),
      type: "blog",
      title: "Risk-Reward Ratio: The Key to Profitable Trading",
      author: "Risk Management Pro",
      summary: "Master the art of calculating and managing risk-reward ratios to ensure long-term trading profitability.",
      createdAt: Date.now() - 86400000 * 13,
    },
    {
      id: uid(),
      type: "blog",
      title: "Market Maker vs. Retail Trader: Understanding the Game",
      author: "Institutional Insights",
      summary: "Understand how market makers operate and how retail traders can adapt their strategies accordingly.",
      createdAt: Date.now() - 86400000 * 14,
    },
    {
      id: uid(),
      type: "blog",
      title: "Dollar-Cost Averaging vs. Lump Sum Investing",
      author: "Investment Strategies",
      summary: "Compare systematic investing approaches and determine which strategy works best for different market conditions.",
      createdAt: Date.now() - 86400000 * 15,
    },
    {
      id: uid(),
      type: "blog",
      title: "Understanding Market Correlation and Diversification",
      author: "Portfolio Theory",
      summary: "Learn how asset correlation affects portfolio risk and how to build truly diversified investment portfolios.",
      createdAt: Date.now() - 86400000 * 16,
    },
    {
      id: uid(),
      type: "blog",
      title: "Earnings Season Trading: Strategies and Pitfalls",
      author: "Earnings Expert",
      summary: "Navigate earnings announcements with proven strategies while avoiding common trading mistakes.",
      createdAt: Date.now() - 86400000 * 17,
    },
    {
      id: uid(),
      type: "blog",
      title: "Tax-Efficient Investing: Maximizing After-Tax Returns",
      author: "Tax Strategy Advisor",
      summary: "Optimize your investment strategy for tax efficiency using IRAs, 401(k)s, and tax-loss harvesting.",
      createdAt: Date.now() - 86400000 * 18,
    },

    // ADDITIONAL COURSES
    {
      id: uid(),
      type: "course",
      title: "Swing Trading Masterclass: 30-Day Challenge",
      author: "Swing Trade Academy",
      summary: "Master swing trading techniques with daily lessons, real trade examples, and risk management strategies.",
      createdAt: Date.now() - 86400000 * 12,
    },
    {
      id: uid(),
      type: "course",
      title: "Cryptocurrency Portfolio Management",
      author: "Digital Asset Institute",
      summary: "Learn to build and manage cryptocurrency portfolios with proper risk management and DeFi strategies.",
      createdAt: Date.now() - 86400000 * 13,
    },
    {
      id: uid(),
      type: "course",
      title: "Real Estate Investment Trusts (REITs) Fundamentals",
      author: "Real Estate Investing",
      summary: "Comprehensive guide to REIT investing, including commercial, residential, and specialty REIT analysis.",
      createdAt: Date.now() - 86400000 * 14,
    },
    {
      id: uid(),
      type: "course",
      title: "Quantitative Analysis for Traders",
      author: "Quant Trading Lab",
      summary: "Learn statistical analysis, backtesting, and quantitative methods for developing trading algorithms.",
      createdAt: Date.now() - 86400000 * 15,
    },
    {
      id: uid(),
      type: "course",
      title: "Global Markets Trading: Asia, Europe & Americas",
      author: "International Markets",
      summary: "Trade across time zones with strategies for major global exchanges and currency considerations.",
      createdAt: Date.now() - 86400000 * 16,
    },
    {
      id: uid(),
      type: "course",
      title: "ESG Investing: Sustainable Finance Strategies",
      author: "Sustainable Investing",
      summary: "Master Environmental, Social, and Governance (ESG) investing principles and screening methods.",
      createdAt: Date.now() - 86400000 * 17,
    },
  ]);
}

export const learnRepo = {
  list(type?: LearnItem["type"]) {
    const all = read();
    return type ? all.filter((i) => i.type === type) : all;
  },
  create(data: Omit<LearnItem, "id" | "createdAt">) {
    const all = read();
    const it: LearnItem = { ...data, id: uid(), createdAt: Date.now() };
    all.unshift(it);
    write(all);
    return it;
  },
  delete(id: string) {
    const all = read();
    const filtered = all.filter((item) => item.id !== id);
    write(filtered);
    return filtered.length < all.length; // Returns true if item was found and deleted
  },
  getById(id: string) {
    const all = read();
    return all.find((item) => item.id === id);
  },
  clearAndReseed() {
    localStorage.removeItem(KEY);
    seedLearn();
    return read();
  },
  getPlaylistVideos(playlistId: string) {
    const playlist = this.getById(playlistId);
    if (!playlist || playlist.type !== "playlist") return [];
    
    const all = read();
    return playlist.playlistVideos?.map(videoId => 
      all.find(item => item.id === videoId)
    ).filter(Boolean) || [];
  },
  getVideosByCategory(category: string) {
    const all = read();
    return all.filter(item => item.type === "video" && item.category === category);
  },
  getExistingPlaylists() {
    const all = read();
    return all.filter(item => item.type === "playlist");
  },
  addVideoToPlaylist(videoId: string, playlistId: string) {
    const all = read();
    const playlistIndex = all.findIndex(item => item.id === playlistId && item.type === "playlist");
    if (playlistIndex === -1) return false;
    
    const playlist = all[playlistIndex];
    if (!playlist.playlistVideos) {
      playlist.playlistVideos = [];
    }
    
    // Add video if not already in playlist
    if (!playlist.playlistVideos.includes(videoId)) {
      playlist.playlistVideos.push(videoId);
      write(all);
      return true;
    }
    return false;
  },
};

if (typeof window !== "undefined") seedLearn();
