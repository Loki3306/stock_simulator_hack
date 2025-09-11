export type ID = string;

export interface Strategy {
  id: ID;
  ownerId: ID;
  title: string;
  description?: string;
  nodes: any[];
  edges: { from: ID; to: ID }[];
  version: number;
  tags: string[];
  privacy: "private" | "public" | "marketplace";
  createdAt: number;
  updatedAt: number;
}

export interface BacktestJob {
  id: ID;
  strategyId: ID;
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  result?: any;
  createdAt: number;
}

export interface MarketplaceItem {
  id: ID;
  strategyId: ID;
  title: string;
  price: number;
  rating: number;
  tags: string[];
  isPublished: boolean;
  createdAt: number;
}

const KEY = {
  strategies: "mock_strategies",
  backtests: "mock_backtests",
  marketplace: "mock_marketplace",
  user: "mock_user",
};

function uid(prefix = "id"): ID {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function seedOnce() {
  const seeded = read(KEY.strategies, [] as Strategy[]);
  // Force reseed if we don't have enough strategies (should have 12)
  if (seeded.length < 12) {
    seedMarketplace();
    return;
  }
}

export function forceReseed() {
  // Clear all existing data
  localStorage.removeItem(KEY.strategies);
  localStorage.removeItem(KEY.marketplace);
  localStorage.removeItem(KEY.backtests);
  
  // Reseed with fresh data
  seedMarketplace();
  
  console.log("Market data reseeded with 12 advanced strategies!");
}

export function seedMarketplace() {
  const ownerId = "mock";
  
  // Strategy 1: RSI Oversold
  const rsiNodes = [
    {
      id: uid("n"),
      type: "indicator",
      blockType: "RSI",
      position: { x: 120, y: 80 },
      parameters: { period: 14 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "LessThan",
      position: { x: 320, y: 80 },
      parameters: { threshold: 30 },
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "BUY",
      position: { x: 520, y: 80 },
      parameters: { quantity: 100 },
    },
  ];
  
  // Strategy 2: Moving Average Crossover
  const maNodes = [
    {
      id: uid("n"),
      type: "indicator",
      blockType: "SMA",
      position: { x: 100, y: 100 },
      parameters: { period: 20 },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "SMA",
      position: { x: 100, y: 200 },
      parameters: { period: 50 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "CrossAbove",
      position: { x: 350, y: 150 },
      parameters: {},
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "BUY",
      position: { x: 550, y: 150 },
      parameters: { quantity: 100 },
    },
  ];
  
  // Strategy 3: Bollinger Bands Mean Reversion
  const bbNodes = [
    {
      id: uid("n"),
      type: "indicator",
      blockType: "BollingerBands",
      position: { x: 100, y: 120 },
      parameters: { period: 20, stdDev: 2 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "PriceBelowLowerBand",
      position: { x: 350, y: 120 },
      parameters: {},
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "BUY",
      position: { x: 550, y: 80 },
      parameters: { quantity: 50 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "PriceAboveUpperBand",
      position: { x: 350, y: 200 },
      parameters: {},
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "SELL",
      position: { x: 550, y: 200 },
      parameters: { quantity: 50 },
    },
  ];
  
  // Strategy 4: MACD Momentum
  const macdNodes = [
    {
      id: uid("n"),
      type: "indicator",
      blockType: "MACD",
      position: { x: 100, y: 100 },
      parameters: { fast: 12, slow: 26, signal: 9 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "MACDCrossAbove",
      position: { x: 350, y: 100 },
      parameters: {},
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "BUY",
      position: { x: 550, y: 100 },
      parameters: { quantity: 75 },
    },
  ];
  
  // Strategy 5: Stochastic Oscillator
  const stochNodes = [
    {
      id: uid("n"),
      type: "indicator",
      blockType: "Stochastic",
      position: { x: 100, y: 100 },
      parameters: { kPeriod: 14, dPeriod: 3 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "StochOversold",
      position: { x: 350, y: 100 },
      parameters: { threshold: 20 },
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "BUY",
      position: { x: 550, y: 60 },
      parameters: { quantity: 100 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "StochOverbought",
      position: { x: 350, y: 180 },
      parameters: { threshold: 80 },
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "SELL",
      position: { x: 550, y: 180 },
      parameters: { quantity: 100 },
    },
  ];
  
  // Strategy 6: Options Iron Condor
  const ironCondorNodes = [
    {
      id: uid("n"),
      type: "option",
      blockType: "PUT",
      position: { x: 100, y: 80 },
      parameters: { strike: 95, action: "SELL", quantity: 1 },
    },
    {
      id: uid("n"),
      type: "option",
      blockType: "PUT",
      position: { x: 100, y: 140 },
      parameters: { strike: 90, action: "BUY", quantity: 1 },
    },
    {
      id: uid("n"),
      type: "option",
      blockType: "CALL",
      position: { x: 100, y: 200 },
      parameters: { strike: 105, action: "SELL", quantity: 1 },
    },
    {
      id: uid("n"),
      type: "option",
      blockType: "CALL",
      position: { x: 100, y: 260 },
      parameters: { strike: 110, action: "BUY", quantity: 1 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "PriceInRange",
      position: { x: 350, y: 170 },
      parameters: { lower: 95, upper: 105 },
    },
  ];

  // Strategy 7: Multi-Timeframe Trend Following
  const multiTimeframeNodes = [
    {
      id: uid("n"),
      type: "indicator",
      blockType: "EMA",
      position: { x: 80, y: 60 },
      parameters: { period: 20, timeframe: "1H" },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "EMA",
      position: { x: 80, y: 140 },
      parameters: { period: 50, timeframe: "4H" },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "RSI",
      position: { x: 80, y: 220 },
      parameters: { period: 14, timeframe: "1D" },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "AllTrendsAlign",
      position: { x: 300, y: 140 },
      parameters: { direction: "bullish" },
    },
    {
      id: uid("n"),
      type: "risk",
      blockType: "PositionSize",
      position: { x: 500, y: 100 },
      parameters: { riskPercent: 2, maxPosition: 25 },
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "BUY",
      position: { x: 700, y: 100 },
      parameters: { quantity: "dynamic" },
    },
    {
      id: uid("n"),
      type: "risk",
      blockType: "StopLoss",
      position: { x: 500, y: 180 },
      parameters: { type: "trailing", percent: 5 },
    },
  ];

  // Strategy 8: Volatility Breakout with Volume Confirmation
  const volatilityBreakoutNodes = [
    {
      id: uid("n"),
      type: "indicator",
      blockType: "ATR",
      position: { x: 80, y: 80 },
      parameters: { period: 14 },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "Volume",
      position: { x: 80, y: 160 },
      parameters: { period: 20, type: "SMA" },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "VolumeSpike",
      position: { x: 280, y: 120 },
      parameters: { multiplier: 1.5 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "VolatilityExpansion",
      position: { x: 280, y: 200 },
      parameters: { atrMultiplier: 2.0 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "PriceBreakout",
      position: { x: 480, y: 160 },
      parameters: { lookback: 20, direction: "both" },
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "CONDITIONAL_BUY",
      position: { x: 680, y: 120 },
      parameters: { quantity: 100, direction: "upward" },
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "CONDITIONAL_SELL",
      position: { x: 680, y: 200 },
      parameters: { quantity: 100, direction: "downward" },
    },
  ];

  // Strategy 9: Mean Reversion with Multiple Filters
  const meanReversionNodes = [
    {
      id: uid("n"),
      type: "indicator",
      blockType: "RSI",
      position: { x: 60, y: 60 },
      parameters: { period: 14 },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "CCI",
      position: { x: 60, y: 120 },
      parameters: { period: 20 },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "Williams%R",
      position: { x: 60, y: 180 },
      parameters: { period: 14 },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "Price",
      position: { x: 60, y: 240 },
      parameters: { type: "close" },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "BollingerBands",
      position: { x: 60, y: 300 },
      parameters: { period: 20, stdDev: 2 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "MultiOscillatorOversold",
      position: { x: 280, y: 150 },
      parameters: { requiredSignals: 3 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "PriceNearBollingerLower",
      position: { x: 280, y: 250 },
      parameters: { tolerance: 0.5 },
    },
    {
      id: uid("n"),
      type: "risk",
      blockType: "DiversificationCheck",
      position: { x: 480, y: 200 },
      parameters: { maxCorrelation: 0.7, maxSectorExposure: 30 },
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "SCALED_BUY",
      position: { x: 680, y: 200 },
      parameters: { tranches: 3, spacing: 2 },
    },
  ];

  // Strategy 10: Algorithmic Scalping with Machine Learning
  const algoScalpingNodes = [
    {
      id: uid("n"),
      type: "data",
      blockType: "OrderBookData",
      position: { x: 50, y: 80 },
      parameters: { depth: 10, updateFreq: "realtime" },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "VolumeProfile",
      position: { x: 50, y: 160 },
      parameters: { period: 24, resolution: "tick" },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "MicroTrend",
      position: { x: 50, y: 240 },
      parameters: { window: 50, sensitivity: 0.8 },
    },
    {
      id: uid("n"),
      type: "ml",
      blockType: "MLSignal",
      position: { x: 250, y: 160 },
      parameters: { model: "xgboost", features: 15, confidence: 0.75 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "LiquidityCheck",
      position: { x: 450, y: 120 },
      parameters: { minSpread: 0.01, minVolume: 10000 },
    },
    {
      id: uid("n"),
      type: "execution",
      blockType: "FastExecution",
      position: { x: 650, y: 120 },
      parameters: { maxLatency: 5, orderType: "IOC" },
    },
    {
      id: uid("n"),
      type: "risk",
      blockType: "RealTimeRisk",
      position: { x: 450, y: 200 },
      parameters: { maxDrawdown: 1, stopLoss: 0.1 },
    },
  ];

  // Strategy 11: Pairs Trading Statistical Arbitrage
  const pairsTradingNodes = [
    {
      id: uid("n"),
      type: "data",
      blockType: "AssetPair",
      position: { x: 80, y: 100 },
      parameters: { asset1: "AAPL", asset2: "MSFT", correlation: 0.85 },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "ZScore",
      position: { x: 280, y: 100 },
      parameters: { lookback: 60, smoothing: 5 },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "Cointegration",
      position: { x: 280, y: 180 },
      parameters: { method: "engle-granger", pValue: 0.05 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "SpreadDivergence",
      position: { x: 480, y: 140 },
      parameters: { entryThreshold: 2.0, exitThreshold: 0.5 },
    },
    {
      id: uid("n"),
      type: "action",
      blockType: "LONG_SHORT",
      position: { x: 680, y: 100 },
      parameters: { longAsset: "dynamic", shortAsset: "dynamic", hedge: 1.0 },
    },
    {
      id: uid("n"),
      type: "risk",
      blockType: "PairRisk",
      position: { x: 680, y: 180 },
      parameters: { maxSpread: 3.0, correlationMin: 0.6 },
    },
  ];

  // Strategy 12: Advanced Options Strategy - Butterfly Spreads
  const butterflyNodes = [
    {
      id: uid("n"),
      type: "indicator",
      blockType: "ImpliedVolatility",
      position: { x: 60, y: 80 },
      parameters: { window: 30, method: "black-scholes" },
    },
    {
      id: uid("n"),
      type: "indicator",
      blockType: "VolumeWeightedPrice",
      position: { x: 60, y: 160 },
      parameters: { period: 20 },
    },
    {
      id: uid("n"),
      type: "condition",
      blockType: "VolatilityContraction",
      position: { x: 280, y: 120 },
      parameters: { threshold: 20, duration: 5 },
    },
    {
      id: uid("n"),
      type: "option",
      blockType: "CALL",
      position: { x: 480, y: 60 },
      parameters: { strike: "ATM-5", action: "BUY", quantity: 1 },
    },
    {
      id: uid("n"),
      type: "option",
      blockType: "CALL",
      position: { x: 480, y: 120 },
      parameters: { strike: "ATM", action: "SELL", quantity: 2 },
    },
    {
      id: uid("n"),
      type: "option",
      blockType: "CALL",
      position: { x: 480, y: 180 },
      parameters: { strike: "ATM+5", action: "BUY", quantity: 1 },
    },
    {
      id: uid("n"),
      type: "risk",
      blockType: "OptionsRisk",
      position: { x: 680, y: 120 },
      parameters: { maxTheta: -50, deltaHedge: true, gammaLimit: 100 },
    },
  ];

  const strategies: Strategy[] = [
    {
      id: uid("s"),
      ownerId,
      title: "RSI Oversold Buy",
      description: "Buy when RSI drops below 30 - classic mean reversion strategy",
      nodes: rsiNodes,
      edges: [
        { from: rsiNodes[0].id, to: rsiNodes[1].id },
        { from: rsiNodes[1].id, to: rsiNodes[2].id },
      ],
      version: 1,
      tags: ["rsi", "mean-reversion", "beginner"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "Golden Cross MA",
      description: "Buy when 20-day SMA crosses above 50-day SMA - trend following",
      nodes: maNodes,
      edges: [
        { from: maNodes[0].id, to: maNodes[2].id },
        { from: maNodes[1].id, to: maNodes[2].id },
        { from: maNodes[2].id, to: maNodes[3].id },
      ],
      version: 1,
      tags: ["moving-average", "trend-following", "crossover"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "Bollinger Bands Squeeze",
      description: "Buy at lower band, sell at upper band - mean reversion with volatility",
      nodes: bbNodes,
      edges: [
        { from: bbNodes[0].id, to: bbNodes[1].id },
        { from: bbNodes[1].id, to: bbNodes[2].id },
        { from: bbNodes[0].id, to: bbNodes[3].id },
        { from: bbNodes[3].id, to: bbNodes[4].id },
      ],
      version: 1,
      tags: ["bollinger-bands", "mean-reversion", "volatility"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "MACD Momentum",
      description: "Buy when MACD line crosses above signal line - momentum strategy",
      nodes: macdNodes,
      edges: [
        { from: macdNodes[0].id, to: macdNodes[1].id },
        { from: macdNodes[1].id, to: macdNodes[2].id },
      ],
      version: 1,
      tags: ["macd", "momentum", "intermediate"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "Stochastic Oscillator",
      description: "Buy oversold, sell overbought using stochastic oscillator",
      nodes: stochNodes,
      edges: [
        { from: stochNodes[0].id, to: stochNodes[1].id },
        { from: stochNodes[1].id, to: stochNodes[2].id },
        { from: stochNodes[0].id, to: stochNodes[3].id },
        { from: stochNodes[3].id, to: stochNodes[4].id },
      ],
      version: 1,
      tags: ["stochastic", "oscillator", "overbought-oversold"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "Iron Condor Options",
      description: "Profit from low volatility with iron condor options strategy",
      nodes: ironCondorNodes,
      edges: [
        { from: ironCondorNodes[0].id, to: ironCondorNodes[4].id },
        { from: ironCondorNodes[1].id, to: ironCondorNodes[4].id },
        { from: ironCondorNodes[2].id, to: ironCondorNodes[4].id },
        { from: ironCondorNodes[3].id, to: ironCondorNodes[4].id },
      ],
      version: 1,
      tags: ["options", "iron-condor", "volatility", "advanced"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "Multi-Timeframe Trend System",
      description: "Advanced trend following with multiple timeframe confirmation and dynamic position sizing",
      nodes: multiTimeframeNodes,
      edges: [
        { from: multiTimeframeNodes[0].id, to: multiTimeframeNodes[3].id },
        { from: multiTimeframeNodes[1].id, to: multiTimeframeNodes[3].id },
        { from: multiTimeframeNodes[2].id, to: multiTimeframeNodes[3].id },
        { from: multiTimeframeNodes[3].id, to: multiTimeframeNodes[4].id },
        { from: multiTimeframeNodes[4].id, to: multiTimeframeNodes[5].id },
        { from: multiTimeframeNodes[4].id, to: multiTimeframeNodes[6].id },
      ],
      version: 1,
      tags: ["multi-timeframe", "trend-following", "risk-management", "professional"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "Volatility Breakout System",
      description: "High-frequency breakout strategy with volume and volatility confirmation",
      nodes: volatilityBreakoutNodes,
      edges: [
        { from: volatilityBreakoutNodes[0].id, to: volatilityBreakoutNodes[3].id },
        { from: volatilityBreakoutNodes[1].id, to: volatilityBreakoutNodes[2].id },
        { from: volatilityBreakoutNodes[2].id, to: volatilityBreakoutNodes[4].id },
        { from: volatilityBreakoutNodes[3].id, to: volatilityBreakoutNodes[4].id },
        { from: volatilityBreakoutNodes[4].id, to: volatilityBreakoutNodes[5].id },
        { from: volatilityBreakoutNodes[4].id, to: volatilityBreakoutNodes[6].id },
      ],
      version: 1,
      tags: ["breakout", "volatility", "volume", "high-frequency", "expert"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "Multi-Oscillator Mean Reversion",
      description: "Sophisticated mean reversion using multiple oscillators with risk filters",
      nodes: meanReversionNodes,
      edges: [
        { from: meanReversionNodes[0].id, to: meanReversionNodes[5].id },
        { from: meanReversionNodes[1].id, to: meanReversionNodes[5].id },
        { from: meanReversionNodes[2].id, to: meanReversionNodes[5].id },
        { from: meanReversionNodes[3].id, to: meanReversionNodes[6].id },
        { from: meanReversionNodes[4].id, to: meanReversionNodes[6].id },
        { from: meanReversionNodes[5].id, to: meanReversionNodes[7].id },
        { from: meanReversionNodes[6].id, to: meanReversionNodes[7].id },
        { from: meanReversionNodes[7].id, to: meanReversionNodes[8].id },
      ],
      version: 1,
      tags: ["mean-reversion", "multi-oscillator", "risk-management", "institutional"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "AI Scalping Algorithm",
      description: "Machine learning powered ultra-high frequency scalping with order book analysis",
      nodes: algoScalpingNodes,
      edges: [
        { from: algoScalpingNodes[0].id, to: algoScalpingNodes[3].id },
        { from: algoScalpingNodes[1].id, to: algoScalpingNodes[3].id },
        { from: algoScalpingNodes[2].id, to: algoScalpingNodes[3].id },
        { from: algoScalpingNodes[3].id, to: algoScalpingNodes[4].id },
        { from: algoScalpingNodes[4].id, to: algoScalpingNodes[5].id },
        { from: algoScalpingNodes[3].id, to: algoScalpingNodes[6].id },
      ],
      version: 1,
      tags: ["ai", "machine-learning", "scalping", "hft", "order-book", "quantitative"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "Statistical Arbitrage Pairs",
      description: "Market neutral pairs trading with cointegration and z-score analysis",
      nodes: pairsTradingNodes,
      edges: [
        { from: pairsTradingNodes[0].id, to: pairsTradingNodes[1].id },
        { from: pairsTradingNodes[0].id, to: pairsTradingNodes[2].id },
        { from: pairsTradingNodes[1].id, to: pairsTradingNodes[3].id },
        { from: pairsTradingNodes[2].id, to: pairsTradingNodes[3].id },
        { from: pairsTradingNodes[3].id, to: pairsTradingNodes[4].id },
        { from: pairsTradingNodes[3].id, to: pairsTradingNodes[5].id },
      ],
      version: 1,
      tags: ["pairs-trading", "statistical-arbitrage", "market-neutral", "quantitative"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: uid("s"),
      ownerId,
      title: "Advanced Butterfly Spreads",
      description: "Sophisticated options butterfly strategy with volatility analysis and Greeks management",
      nodes: butterflyNodes,
      edges: [
        { from: butterflyNodes[0].id, to: butterflyNodes[2].id },
        { from: butterflyNodes[1].id, to: butterflyNodes[2].id },
        { from: butterflyNodes[2].id, to: butterflyNodes[3].id },
        { from: butterflyNodes[2].id, to: butterflyNodes[4].id },
        { from: butterflyNodes[2].id, to: butterflyNodes[5].id },
        { from: butterflyNodes[3].id, to: butterflyNodes[6].id },
        { from: butterflyNodes[4].id, to: butterflyNodes[6].id },
        { from: butterflyNodes[5].id, to: butterflyNodes[6].id },
      ],
      version: 1,
      tags: ["options", "butterfly", "volatility", "greeks", "advanced"],
      privacy: "marketplace",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
  
  const marketplace: MarketplaceItem[] = [
    {
      id: uid("m"),
      strategyId: strategies[0].id,
      title: "RSI Oversold Buy",
      price: 0,
      rating: 4.6,
      tags: ["rsi", "mean-reversion", "beginner"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[1].id,
      title: "Golden Cross MA",
      price: 25,
      rating: 4.3,
      tags: ["moving-average", "trend-following"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[2].id,
      title: "Bollinger Bands Squeeze",
      price: 0,
      rating: 4.1,
      tags: ["bollinger-bands", "volatility"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[3].id,
      title: "MACD Momentum",
      price: 15,
      rating: 4.4,
      tags: ["macd", "momentum"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[4].id,
      title: "Stochastic Oscillator",
      price: 0,
      rating: 4.0,
      tags: ["stochastic", "oscillator"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[5].id,
      title: "Iron Condor Options",
      price: 50,
      rating: 4.8,
      tags: ["options", "advanced"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[6].id,
      title: "Multi-Timeframe Trend System",
      price: 125,
      rating: 4.9,
      tags: ["multi-timeframe", "professional"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[7].id,
      title: "Volatility Breakout System",
      price: 200,
      rating: 4.7,
      tags: ["breakout", "high-frequency", "expert"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[8].id,
      title: "Multi-Oscillator Mean Reversion",
      price: 150,
      rating: 4.6,
      tags: ["mean-reversion", "institutional"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[9].id,
      title: "AI Scalping Algorithm",
      price: 500,
      rating: 4.9,
      tags: ["ai", "scalping", "quantitative"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[10].id,
      title: "Statistical Arbitrage Pairs",
      price: 300,
      rating: 4.8,
      tags: ["pairs-trading", "market-neutral"],
      isPublished: true,
      createdAt: Date.now(),
    },
    {
      id: uid("m"),
      strategyId: strategies[11].id,
      title: "Advanced Butterfly Spreads",
      price: 250,
      rating: 4.7,
      tags: ["options", "butterfly", "advanced"],
      isPublished: true,
      createdAt: Date.now(),
    },
  ];
  write(KEY.strategies, strategies);
  write(KEY.marketplace, marketplace);
  write(KEY.backtests, [] as BacktestJob[]);
  write(KEY.user, { id: ownerId, name: "mock", email: "mock@example.com" });
}

export const repo = {
  user() {
    return read(KEY.user, {
      id: "mock",
      name: "mock",
      email: "mock@example.com",
    });
  },
  listStrategies(ownerId?: ID) {
    const all = read(KEY.strategies, [] as Strategy[]);
    return ownerId ? all.filter((s) => s.ownerId === ownerId) : all;
  },
  getStrategy(id: ID) {
    return (
      read(KEY.strategies, [] as Strategy[]).find((s) => s.id === id) || null
    );
  },
  saveStrategy(partial: Partial<Strategy> & { title: string }) {
    const all = read(KEY.strategies, [] as Strategy[]);
    if (partial.id) {
      const idx = all.findIndex((s) => s.id === partial.id);
      if (idx >= 0) {
        all[idx] = {
          ...all[idx],
          ...partial,
          updatedAt: Date.now(),
          version: (all[idx].version || 1) + 1,
        } as Strategy;
      }
    } else {
      const n: Strategy = {
        id: uid("s"),
        ownerId: this.user().id,
        title: partial.title,
        description: partial.description || "",
        nodes: partial.nodes || [],
        edges: partial.edges || [],
        version: 1,
        tags: partial.tags || [],
        privacy: partial.privacy || "private",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      all.push(n);
      partial.id = n.id;
    }
    write(KEY.strategies, all);
    return partial.id as ID;
  },
  deleteStrategy(id: ID) {
    const all = read(KEY.strategies, [] as Strategy[]).filter(
      (s) => s.id !== id,
    );
    write(KEY.strategies, all);
  },
  marketplace() {
    // Always ensure marketplace has the latest strategies
    const currentMarketplace = read(KEY.marketplace, [] as MarketplaceItem[]);
    const strategies = read(KEY.strategies, [] as Strategy[]);
    
    // If marketplace is empty or missing strategies, reseed
    if (currentMarketplace.length < 12 || strategies.length < 12) {
      seedMarketplace();
      return read(KEY.marketplace, [] as MarketplaceItem[]);
    }
    
    return currentMarketplace;
  },
  publish(
    strategyId: ID,
    data: { title?: string; price?: number; tags?: string[] },
  ) {
    const list = read(KEY.marketplace, [] as MarketplaceItem[]);
    const existing = list.find((m) => m.strategyId === strategyId);
    const item: MarketplaceItem = existing || {
      id: uid("m"),
      strategyId,
      title: "",
      price: 0,
      rating: 4.5,
      tags: [],
      isPublished: true,
      createdAt: Date.now(),
    };
    Object.assign(item, { ...data, isPublished: true });
    if (!existing) list.push(item);
    write(KEY.marketplace, list);
    const strategies = read(KEY.strategies, [] as Strategy[]);
    const s = strategies.find((x) => x.id === strategyId);
    if (s) {
      s.privacy = "marketplace";
      write(KEY.strategies, strategies);
    }
    return item;
  },
  importMarket(itemId: ID) {
    const list = read(KEY.marketplace, [] as MarketplaceItem[]);
    const item = list.find((m) => m.id === itemId);
    if (!item) return null;
    const source = this.getStrategy(item.strategyId);
    if (!source) return null;
    const id = this.saveStrategy({
      title: `${source.title} (Imported)`,
      nodes: source.nodes,
      edges: source.edges,
      tags: source.tags,
      privacy: "private",
    });
    return this.getStrategy(id);
  },
  enqueueBacktest(strategyId: ID) {
    const jobs = read(KEY.backtests, [] as BacktestJob[]);
    const id = uid("job");
    const job: BacktestJob = {
      id,
      strategyId,
      status: "queued",
      progress: 0,
      createdAt: Date.now(),
    };
    jobs.push(job);
    write(KEY.backtests, jobs);
    const timer = setInterval(() => {
      const js = read(KEY.backtests, [] as BacktestJob[]);
      const j = js.find((x) => x.id === id)!;
      if (!j) return clearInterval(timer);
      if (j.progress >= 100) {
        clearInterval(timer);
        return;
      }
      j.progress = Math.min(100, j.progress + Math.ceil(Math.random() * 15));
      j.status = j.progress >= 100 ? "completed" : "running";
      if (j.status === "completed") {
        j.result = {
          kpis: {
            totalReturn: 23.4,
            annualReturn: 12.3,
            sharpe: 1.45,
            maxDrawdown: -8.7,
            winRate: 62,
          },
          equityCurve: Array.from({ length: 120 }, (_, i) => ({
            date: `${i}`,
            value: 10000 + i * 45 + Math.random() * 200,
          })),
          drawdownCurve: Array.from({ length: 120 }, (_, i) => ({
            date: `${i}`,
            drawdown: -Math.random() * 10,
          })),
          trades: Array.from({ length: 60 }, (_, i) => ({
            id: i + 1,
            date: `${i}`,
            action: i % 2 ? "BUY" : "SELL",
            qty: 10,
            price: 100 + i,
            pnl: (Math.random() - 0.5) * 100,
          })),
        };
      }
      write(KEY.backtests, js);
    }, 500);
    return id;
  },
  getJob(id: ID) {
    return (
      read(KEY.backtests, [] as BacktestJob[]).find((j) => j.id === id) || null
    );
  },
  // Force refresh marketplace with new data
  refreshMarketplace() {
    seedMarketplace();
    return this.marketplace();
  },
  // Clear all data and reseed
  resetAll() {
    localStorage.removeItem(KEY.strategies);
    localStorage.removeItem(KEY.marketplace);
    localStorage.removeItem(KEY.backtests);
    localStorage.removeItem(KEY.user);
    seedMarketplace();
    return this.marketplace();
  },
};

if (typeof window !== "undefined") {
  seedOnce();
}
