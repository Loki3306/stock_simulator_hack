import api from './api';
import { DbStrategy } from '../stores/strategyStore';

export interface LegacyStrategyData {
  nodes: any[];
  edges: any[];
  timestamp: number;
  name?: string;
  description?: string;
}

/**
 * Migrates strategies from localStorage to database
 */
export class StrategyMigration {
  
  /**
   * Check if there are any strategies in localStorage that need migration
   */
  static checkForLocalStrategies(): boolean {
    const currentStrategy = localStorage.getItem('currentStrategy');
    const savedStrategies = localStorage.getItem('savedStrategies');
    
    return !!(currentStrategy || savedStrategies);
  }

  /**
   * Get all strategies from localStorage
   */
  static getLocalStrategies(): LegacyStrategyData[] {
    const strategies: LegacyStrategyData[] = [];
    
    // Get current working strategy
    const currentStrategy = localStorage.getItem('currentStrategy');
    if (currentStrategy) {
      try {
        const parsed = JSON.parse(currentStrategy);
        if (parsed.nodes && parsed.nodes.length > 0) {
          strategies.push({
            ...parsed,
            name: 'Current Working Strategy',
            description: 'Auto-migrated from localStorage'
          });
        }
      } catch (error) {
        console.error('Error parsing current strategy:', error);
      }
    }
    
    // Get any saved strategies (if they exist)
    const savedStrategies = localStorage.getItem('savedStrategies');
    if (savedStrategies) {
      try {
        const parsed = JSON.parse(savedStrategies);
        if (Array.isArray(parsed)) {
          strategies.push(...parsed.map((s: any) => ({
            ...s,
            name: s.name || 'Untitled Strategy',
            description: s.description || 'Auto-migrated from localStorage'
          })));
        }
      } catch (error) {
        console.error('Error parsing saved strategies:', error);
      }
    }
    
    return strategies;
  }

  /**
   * Migrate a single strategy to database
   */
  static async migrateStrategy(strategy: LegacyStrategyData): Promise<DbStrategy | null> {
    try {
      const payload = {
        title: strategy.name || 'Migrated Strategy',
        description: strategy.description || 'Auto-migrated from localStorage',
        nodes: strategy.nodes || [],
        edges: strategy.edges || [],
        tags: ['migrated'],
        privacy: 'private' as const,
      };
      
      const response = await api.post('/strategies', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to migrate strategy:', error);
      return null;
    }
  }

  /**
   * Migrate all strategies from localStorage to database
   */
  static async migrateAllStrategies(): Promise<{
    success: number;
    failed: number;
    strategies: DbStrategy[];
  }> {
    const localStrategies = this.getLocalStrategies();
    const results = {
      success: 0,
      failed: 0,
      strategies: [] as DbStrategy[]
    };
    
    for (const strategy of localStrategies) {
      const migrated = await this.migrateStrategy(strategy);
      if (migrated) {
        results.success++;
        results.strategies.push(migrated);
      } else {
        results.failed++;
      }
    }
    
    return results;
  }

  /**
   * Clear localStorage after successful migration
   */
  static clearLocalStorage(): void {
    localStorage.removeItem('currentStrategy');
    localStorage.removeItem('savedStrategies');
    localStorage.setItem('strategiesMigrated', 'true');
  }

  /**
   * Check if migration has already been completed
   */
  static hasMigrated(): boolean {
    return localStorage.getItem('strategiesMigrated') === 'true';
  }

  /**
   * Perform full migration process with user confirmation
   */
  static async performMigration(): Promise<boolean> {
    if (this.hasMigrated()) {
      console.log('Strategies already migrated');
      return true;
    }

    if (!this.checkForLocalStrategies()) {
      console.log('No local strategies to migrate');
      this.clearLocalStorage(); // Mark as migrated
      return true;
    }

    try {
      const results = await this.migrateAllStrategies();
      
      if (results.success > 0) {
        console.log(`Successfully migrated ${results.success} strategies`);
        if (results.failed > 0) {
          console.warn(`Failed to migrate ${results.failed} strategies`);
        }
        
        // Only clear localStorage if at least one strategy was migrated successfully
        this.clearLocalStorage();
        return true;
      } else {
        console.error('Failed to migrate any strategies');
        return false;
      }
    } catch (error) {
      console.error('Migration process failed:', error);
      return false;
    }
  }
}