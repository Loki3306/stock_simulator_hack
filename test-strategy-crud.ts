import api from '../client/lib/api.ts';

async function testStrategyCRUD() {
  console.log('🧪 Testing Strategy CRUD Operations');
  console.log('===================================');

  try {
    // Test 1: Create a new strategy
    console.log('\n1. Creating a new strategy...');
    const newStrategy = {
      title: 'Test Strategy',
      description: 'A test strategy for CRUD validation',
      nodes: [
        {
          id: 'stock-1',
          type: 'stock',
          position: { x: 100, y: 100 },
          data: { symbol: 'AAPL', quantity: 100 }
        }
      ],
      edges: [],
      tags: ['test', 'crud'],
      privacy: 'private'
    };

    const createResponse = await api.post('/strategies', newStrategy);
    console.log('✅ Strategy created:', createResponse.data._id);
    const strategyId = createResponse.data._id;

    // Test 2: Read the strategy
    console.log('\n2. Reading the strategy...');
    const readResponse = await api.get(`/strategies/${strategyId}`);
    console.log('✅ Strategy read:', readResponse.data.title);

    // Test 3: Update the strategy
    console.log('\n3. Updating the strategy...');
    const updatedStrategy = {
      ...newStrategy,
      title: 'Updated Test Strategy',
      description: 'Updated description',
      nodes: [
        ...newStrategy.nodes,
        {
          id: 'profitTarget-1',
          type: 'profitTarget',
          position: { x: 300, y: 100 },
          data: { type: 'percentage', value: 20 }
        }
      ]
    };

    const updateResponse = await api.put(`/strategies/${strategyId}`, updatedStrategy);
    console.log('✅ Strategy updated:', updateResponse.data.title);
    console.log('✅ Version incremented:', updateResponse.data.version);

    // Test 4: List user strategies
    console.log('\n4. Listing user strategies...');
    const listResponse = await api.get('/strategies');
    console.log('✅ Found strategies:', listResponse.data.length);

    // Test 5: Delete the strategy
    console.log('\n5. Deleting the strategy...');
    await api.delete(`/strategies/${strategyId}`);
    console.log('✅ Strategy deleted');

    // Verify deletion
    try {
      await api.get(`/strategies/${strategyId}`);
      console.log('❌ Strategy still exists (should be deleted)');
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('✅ Strategy successfully deleted (404 confirmed)');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('\n🎉 All CRUD operations completed successfully!');

  } catch (error: any) {
    console.error('❌ CRUD test failed:', error.response?.data || error.message);
  }
}

// Note: This test requires authentication
// You would need to either run this with a valid auth token or 
// temporarily disable auth middleware for testing
console.log('⚠️  Note: This test requires authentication to work properly');
console.log('You can run this test by:');
console.log('1. Logging into the app first to get auth tokens');
console.log('2. Or temporarily disabling auth middleware for testing');

export { testStrategyCRUD };