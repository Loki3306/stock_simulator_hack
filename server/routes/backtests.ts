import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { Backtest } from "../models/Backtest";
import EventEmitter from "events";
import { getIO } from "../ws";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const backtestsRouter = Router();

const bus = new EventEmitter();

function simulateRun(jobId: string) {
  let progress = 0;
  const tick = () => {
    progress += Math.ceil(Math.random() * 12);
    if (progress > 100) progress = 100;
    const payload = {
      jobId,
      progress,
      status: progress >= 100 ? "completed" : "running",
    };
    bus.emit("progress:" + jobId, payload);
    try {
      const io = getIO?.();
      if (io) io.to(jobId).emit("progress", payload);
    } catch {}
    if (progress < 100) setTimeout(tick, 500);
  };
  setTimeout(tick, 300);
}

/**
 * Transform front-end strategy JSON to Python model format
 * @param frontendStrategy - Strategy JSON from React Flow nodes/edges
 * @returns Transformed strategy compatible with Python backtesting engine
 */
function transformStrategyForPython(frontendStrategy: any): any {
  // The front-end exports strategy with this structure:
  // {
  //   id: string,
  //   name: string,
  //   description: string,
  //   nodes: Node[], // ReactFlow nodes
  //   edges: Edge[], // ReactFlow edges
  //   metadata: { created, lastModified, version }
  // }
  
  // Transform to match what Python expects
  return {
    id: frontendStrategy.id,
    name: frontendStrategy.name,
    description: frontendStrategy.description || '',
    nodes: frontendStrategy.nodes,
    edges: frontendStrategy.edges,
    metadata: frontendStrategy.metadata
  };
}

/**
 * Execute Python backtesting script with strategy JSON
 * @param strategy - Transformed strategy JSON
 * @returns Promise<BacktestResults>
 */
function runPythonBacktest(strategy: any): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log('Starting Python backtest...');
    console.log('Strategy to process:', JSON.stringify(strategy, null, 2));
    
    const strategyJson = JSON.stringify(strategy);
    
    const options = {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/backtest/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(strategyJson)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Django response status:', res.statusCode);
        console.log('Django response data:', data);
        
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Python backtest response received!');
            console.log('📊 Response structure:', Object.keys(result));
            console.log('📈 Metrics:', result.metrics);
            console.log('📉 Data arrays lengths:', {
              equity_curve: result.equity_curve?.length || 0,
              drawdown_curve: result.drawdown_curve?.length || 0,
              trades: result.trades?.length || 0
            });
            resolve(result);
          } else {
            reject(new Error(`Django API error (${res.statusCode}): ${result.error || data}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse Django response: ${error.message}\nRaw response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`HTTP request failed: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request to Django backend timed out'));
    });

    // Set timeout
    req.setTimeout(30000); // 30 seconds

    // Send the strategy data
    req.write(strategyJson);
    req.end();
  });
}

backtestsRouter.post("/", authenticate as any, async (req: any, res) => {
  const { strategyId, symbol = "SPY", from, to, settings } = req.body;
  const bt = await Backtest.create({
    strategyId,
    ownerId: req.user.id,
    symbol,
    from: from
      ? new Date(from)
      : new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    to: to ? new Date(to) : new Date(),
    settings,
    status: "queued",
  });
  simulateRun(String(bt._id));
  res.json({ jobId: bt._id });
});

// New route for running strategy backtests from the strategy builder
backtestsRouter.post("/run-strategy", authenticate as any, async (req: any, res) => {
  try {
    const { strategy } = req.body;
    
    if (!strategy) {
      return res.status(400).json({ error: "Strategy is required" });
    }

    console.log(`Starting backtest for strategy: ${strategy.name || 'Unnamed'}`);
    
    // Transform the strategy to Python format
    const transformedStrategy = transformStrategyForPython(strategy);
    
    // Run the Python backtest
    const backtestResults = await runPythonBacktest(transformedStrategy);
    
    console.log(`Backtest completed for strategy: ${strategy.name || 'Unnamed'}`);
    
    // Return the results
    res.json({
      success: true,
      strategy: {
        id: strategy.id,
        name: strategy.name,
        description: strategy.description
      },
      results: backtestResults
    });
    
  } catch (error) {
    console.error('Backtest error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during backtesting'
    });
  }
});

// Test route for running strategy backtests without authentication (for development)
backtestsRouter.post("/run-strategy-test", async (req: any, res) => {
  console.log('=== RECEIVED BACKTEST REQUEST ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { strategy } = req.body;
    
    if (!strategy) {
      console.log('ERROR: No strategy in request body');
      return res.status(400).json({ error: "Strategy is required" });
    }

    console.log(`Starting test backtest for strategy: ${strategy.name || 'Unnamed'}`);
    console.log('Strategy nodes count:', strategy.nodes?.length || 0);
    console.log('Strategy edges count:', strategy.edges?.length || 0);
    
    // Transform the strategy to Python format
    const transformedStrategy = transformStrategyForPython(strategy);
    console.log('Transformed strategy:', JSON.stringify(transformedStrategy, null, 2));
    console.log('Transformed strategy:', JSON.stringify(transformedStrategy, null, 2));
    
    // Run the Python backtest
    console.log('Calling Python backtest...');
    const backtestResults = await runPythonBacktest(transformedStrategy);
    console.log('Python backtest response received:', typeof backtestResults, Object.keys(backtestResults || {}));
    
    console.log(`Test backtest completed for strategy: ${strategy.name || 'Unnamed'}`);
    
    // Return the results
    const response = {
      success: true,
      strategy: {
        id: strategy.id,
        name: strategy.name,
        description: strategy.description
      },
      results: backtestResults
    };
    
    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
    
  } catch (error) {
    console.error('Test backtest error:', error);
    console.error('Error stack:', error.stack);
    const errorResponse = {
      success: false,
      error: error.message || 'An error occurred during backtesting'
    };
    console.log('Sending error response:', JSON.stringify(errorResponse, null, 2));
    res.status(500).json(errorResponse);
  }
});

backtestsRouter.get("/:jobId", authenticate as any, async (req: any, res) => {
  const bt = await Backtest.findById(req.params.jobId);
  if (!bt) return res.status(404).json({ error: "Not found" });
  if (String(bt.ownerId) !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });
  res.json(bt);
});

backtestsRouter.get(
  "/history/list",
  authenticate as any,
  async (req: any, res) => {
    const list = await Backtest.find({ ownerId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(list);
  },
);

// SSE fallback for job progress (dev)
backtestsRouter.get(
  "/stream/:jobId",
  authenticate as any,
  async (req: any, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const { jobId } = req.params;
    const onProgress = (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      if (data.status === "completed") {
        // save a mocked result
        Backtest.findByIdAndUpdate(jobId, {
          status: "completed",
          result: {
            kpis: {
              totalReturn: 23.4,
              annualReturn: 12.3,
              sharpe: 1.45,
              maxDrawdown: -8.7,
              winRate: 62,
            },
            equityCurve: Array.from({ length: 100 }, (_, i) => ({
              ts: Date.now() - (100 - i) * 86400000,
              value: 10000 + i * 45 + Math.random() * 200,
            })),
            trades: Array.from({ length: 50 }, (_, i) => ({
              id: i + 1,
              ts: Date.now() - (50 - i) * 86400000,
              type: i % 2 ? "BUY" : "SELL",
              qty: 10,
              price: 100 + i,
              pnl: (Math.random() - 0.5) * 100,
            })),
            safetyFlags: ["Low correlation risk", "Moderate volatility"],
          },
        }).exec();
        res.end();
        bus.removeListener("progress:" + jobId, onProgress);
      }
    };
    bus.on("progress:" + jobId, onProgress);
    req.on("close", () => bus.removeListener("progress:" + jobId, onProgress));
  },
);
