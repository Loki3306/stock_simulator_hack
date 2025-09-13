/**
 * Test script for the new real backtesting engine
 * This creates a simple RSI strategy and runs a backtest
 */
import { BacktestEngine, BacktestConfig } from './server/backtesting/BacktestEngine';

// Simple RSI strategy nodes
const testNodes = [
  {
    id: 'rsi-1',
    type: 'indicator',
    blockType: 'RSI',
    position: { x: 100, y: 100 },
    parameters: { period: 14 }
  },
  {
    id: 'condition-1',
    type: 'condition',
    blockType: 'LessThan',
    position: { x: 300, y: 100 },
    parameters: { threshold: 30 }
  },
  {
    id: 'action-1',
    type: 'action',
    blockType: 'BUY',
    position: { x: 500, y: 80 },
    parameters: { quantity: 100 }
  },
  {
    id: 'condition-2',
    type: 'condition',
    blockType: 'GreaterThan',
    position: { x: 300, y: 200 },
    parameters: { threshold: 70 }
  },
  {
    id: 'action-2',
    type: 'action',
    blockType: 'SELL',
    position: { x: 500, y: 200 },
    parameters: { quantity: 100 }
  }
];

// Simple edges connecting the nodes
const testEdges = [
  { id: 'e1', source: 'rsi-1', target: 'condition-1' },
  { id: 'e2', source: 'condition-1', target: 'action-1' },
  { id: 'e3', source: 'rsi-1', target: 'condition-2' },
  { id: 'e4', source: 'condition-2', target: 'action-2' }
];

async function testBacktestEngine() {
  console.log('🧪 Testing Real Backtesting Engine');
  console.log('==================================');
  
  try {
    // Configuration for backtest
    const config: BacktestConfig = {
      symbol: 'AAPL',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      initialCapital: 10000,
      interval: '1d',
      commission: 1,
      slippage: 0.001
    };
    
    console.log(`📊 Config: ${config.symbol} from ${config.startDate.toISOString()} to ${config.endDate.toISOString()}`);
    console.log(`💰 Initial Capital: $${config.initialCapital}`);
    console.log(`📈 Strategy: RSI Oversold/Overbought (${testNodes.length} nodes, ${testEdges.length} edges)`);
    
    // Create and run backtest
    const engine = new BacktestEngine(config, testNodes, testEdges);
    const result = await engine.runBacktest();
    
    console.log('\n✅ Backtest Results:');
    console.log('====================');
    console.log(`📊 Status: ${result.status}`);
    console.log(`💼 Total Trades: ${result.metrics.totalTrades}`);
    console.log(`💰 Final Equity: $${result.metrics.finalEquity.toFixed(2)}`);
    console.log(`📈 Total Return: ${result.metrics.totalReturn.toFixed(2)}%`);
    console.log(`🏆 Win Rate: ${result.metrics.winRate.toFixed(1)}%`);
    console.log(`📉 Max Drawdown: ${result.metrics.maxDrawdown.toFixed(2)}%`);
    console.log(`🔥 Sharpe Ratio: ${result.metrics.sharpeRatio.toFixed(2)}`);
    console.log(`⚖️ Profit Factor: ${result.metrics.profitFactor.toFixed(2)}`);
    
    if (result.trades.length > 0) {
      console.log(`\n📋 Sample Trades (first 3):`);
      result.trades.slice(0, 3).forEach((trade, i) => {
        console.log(`${i + 1}. ${trade.side.toUpperCase()} ${trade.quantity} @ $${trade.entryPrice.toFixed(2)} → $${trade.exitPrice.toFixed(2)} PnL: $${trade.pnl.toFixed(2)}`);
      });
    }
    
    console.log(`\n📊 Equity curve has ${result.equityCurve.length} data points`);
    console.log(`🔢 Calculated ${Object.keys(result.indicators).length} indicator series`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Export for use
export { testBacktestEngine };

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testBacktestEngine()
    .then(() => {
      console.log('\n🎉 Test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}