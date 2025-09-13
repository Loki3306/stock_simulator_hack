import api from '../lib/api';

// Migration utility to transfer localStorage strategies to database
export class StrategyMigration {
  
  static async migrateLocalStorageStrategies() {
    console.log('🔄 Starting strategy migration from localStorage to database...');
    
    const migratedStrategies = [];
    const errors = [];
    
    try {
      // Look for various localStorage keys that might contain strategies
      const strategyKeys = [];
      
      // Check all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('strategy') || 
          key.includes('Strategy') ||
          key === 'currentStrategy' ||
          key.startsWith('algotrader_') ||
          key.includes('trading_strategy')
        )) {
          strategyKeys.push(key);
        }
      }
      
      console.log(`📋 Found ${strategyKeys.length} potential strategy keys in localStorage:`, strategyKeys);
      
      for (const key of strategyKeys) {
        try {
          const data = localStorage.getItem(key);
          if (!data) continue;
          
          let strategyData;
          try {
            strategyData = JSON.parse(data);
          } catch (e) {
            console.warn(`❌ Failed to parse data for key ${key}:`, e);
            continue;
          }
          
          // Validate strategy data structure
          if (!this.isValidStrategyData(strategyData)) {
            console.warn(`❌ Invalid strategy data for key ${key}:`, strategyData);
            continue;
          }
          
          // Convert to database format
          const dbStrategy = this.convertToDbFormat(strategyData, key);
          
          // Save to database
          console.log(`💾 Migrating strategy from ${key}...`);
          const response = await api.post('/strategies', dbStrategy);
          
          migratedStrategies.push({
            originalKey: key,
            strategy: response.data,
          });
          
          console.log(`✅ Successfully migrated strategy: ${dbStrategy.title}`);
          
        } catch (error) {
          console.error(`❌ Failed to migrate strategy from ${key}:`, error);
          errors.push({ key, error: error.message });
        }
      }
      
      // Clean up localStorage after successful migration
      if (migratedStrategies.length > 0) {
        console.log(`🧹 Cleaning up localStorage...`);
        strategyKeys.forEach(key => {
          const backup = localStorage.getItem(key);
          localStorage.setItem(`${key}_backup_${Date.now()}`, backup);
          localStorage.removeItem(key);
        });
      }
      
      console.log(`🎉 Migration completed! Migrated ${migratedStrategies.length} strategies.`);
      if (errors.length > 0) {
        console.warn(`⚠️ ${errors.length} errors occurred:`, errors);
      }
      
      return {
        success: true,
        migrated: migratedStrategies,
        errors,
      };
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        success: false,
        migrated: migratedStrategies,
        errors: [...errors, { general: error.message }],
      };
    }
  }
  
  static isValidStrategyData(data) {
    // Check if data has the basic structure of a strategy
    if (!data || typeof data !== 'object') return false;
    
    // Must have nodes array (even if empty)
    if (!Array.isArray(data.nodes)) return false;
    
    // Must have edges array (even if empty)  
    if (!Array.isArray(data.edges)) return false;
    
    return true;
  }
  
  static convertToDbFormat(strategyData, originalKey) {
    // Extract title from key or use default
    let title = 'Migrated Strategy';
    if (originalKey === 'currentStrategy') {
      title = 'Current Strategy (Migrated)';
    } else if (originalKey.includes('strategy')) {
      title = originalKey.replace(/[_-]/g, ' ').replace(/strategy/gi, 'Strategy');
    }
    
    // If strategy has a name field, use that
    if (strategyData.name) {
      title = strategyData.name;
    } else if (strategyData.title) {
      title = strategyData.title;
    }
    
    return {
      title: title,
      description: strategyData.description || `Migrated from localStorage (${originalKey})`,
      nodes: strategyData.nodes || [],
      edges: strategyData.edges || [],
      tags: strategyData.tags || ['migrated', 'localStorage'],
      privacy: 'private',
    };
  }
  
  static async debugCurrentStorage() {
    console.log('🔍 Debugging current storage state...');
    
    // Check localStorage
    console.log('\n📦 LocalStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`  ${key}: ${value?.substring(0, 100)}${value?.length > 100 ? '...' : ''}`);
    }
    
    // Check database
    console.log('\n🗃️ Database strategies:');
    try {
      const response = await api.get('/strategies');
      const strategies = response.data;
      console.log(`Found ${strategies.length} strategies in database:`);
      strategies.forEach((strategy, index) => {
        console.log(`  ${index + 1}. ${strategy.title} (${strategy._id})`);
        console.log(`     Nodes: ${strategy.nodes?.length || 0}, Edges: ${strategy.edges?.length || 0}`);
        console.log(`     Created: ${new Date(strategy.createdAt).toLocaleDateString()}`);
      });
    } catch (error) {
      console.error('Failed to fetch database strategies:', error);
    }
  }
}

// Make available globally for browser console
if (typeof window !== 'undefined') {
  window.StrategyMigration = StrategyMigration;
}