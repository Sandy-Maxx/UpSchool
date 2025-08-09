#!/usr/bin/env node

/**
 * Stage 1 Integration Test Script
 * Tests that all major Stage 1 components can be loaded and instantiated
 */

// Import major Stage 1 components
import { API_CONFIG, AUTH_CONFIG, PORTAL_CONFIG } from './src/shared/constants/index';
import { api } from './src/shared/services/api/client';
import { store, persistor } from './src/shared/store';
import type { RootState } from './src/shared/store';
import { authSlice } from './src/shared/store/slices/authSlice';
import { uiSlice } from './src/shared/store/slices/uiSlice';
import { notificationSlice } from './src/shared/store/slices/notificationSlice';

// Test counter
let tests = 0;
let passed = 0;

function test(name: string, testFn: () => void): void {
  tests++;
  try {
    testFn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error}`);
  }
}

console.log('🚀 Starting Stage 1 Integration Tests\n');

// Test 1: Constants are properly defined
test('Constants are properly defined', () => {
  if (!API_CONFIG.BASE_URL) throw new Error('API_CONFIG.BASE_URL not defined');
  if (!AUTH_CONFIG.TOKEN_STORAGE_KEY) throw new Error('AUTH_CONFIG.TOKEN_STORAGE_KEY not defined');
  if (!PORTAL_CONFIG.DEFAULT_PORTAL) throw new Error('PORTAL_CONFIG.DEFAULT_PORTAL not defined');
});

// Test 2: API client can be instantiated
test('API client is properly instantiated', () => {
  if (typeof api.get !== 'function') throw new Error('API client get method not available');
  if (typeof api.post !== 'function') throw new Error('API client post method not available');
  if (typeof api.getPortalType !== 'function') throw new Error('API client getPortalType method not available');
});

// Test 3: Redux store is properly configured
test('Redux store is properly configured', () => {
  if (!store) throw new Error('Redux store not available');
  if (!persistor) throw new Error('Redux persistor not available');
  if (typeof store.dispatch !== 'function') throw new Error('Store dispatch method not available');
  if (typeof store.getState !== 'function') throw new Error('Store getState method not available');
});

// Test 4: Auth slice is properly configured
test('Auth slice is properly configured', () => {
  const state = store.getState() as RootState;
  if (typeof state.auth === 'undefined') throw new Error('Auth state not available');
  if (typeof state.auth.isAuthenticated !== 'boolean') throw new Error('Auth isAuthenticated not boolean');
});

// Test 5: UI slice is properly configured
test('UI slice is properly configured', () => {
  const state = store.getState() as RootState;
  if (typeof state.ui === 'undefined') throw new Error('UI state not available');
  if (typeof state.ui.sidebarOpen !== 'boolean') throw new Error('UI sidebarOpen not boolean');
});

// Test 6: Notification slice is properly configured
test('Notification slice is properly configured', () => {
  const state = store.getState() as RootState;
  if (typeof state.notifications === 'undefined') throw new Error('Notifications state not available');
  if (!Array.isArray(state.notifications.items)) throw new Error('Notifications items not array');
});

// Test 7: Redux actions can be dispatched
test('Redux actions can be dispatched', () => {
  // Test UI action
  store.dispatch(uiSlice.actions.toggleSidebar());
  
  // Test notification action
  store.dispatch(notificationSlice.actions.addNotification({
    id: 'test-notification',
    type: 'info',
    title: 'Test',
    message: 'Testing notifications',
    timestamp: Date.now(),
  }));
  
  const state = store.getState() as RootState;
  if (state.notifications.items.length === 0) {
    throw new Error('Notification was not added to state');
  }
});

// Test 8: API client portal detection
test('API client portal detection works', () => {
  const portalType = api.getPortalType();
  if (portalType !== 'saas' && portalType !== 'tenant') {
    throw new Error(`Invalid portal type: ${portalType}`);
  }
});

// Summary
console.log('\n📊 Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${tests - passed}`);
console.log(`📈 Success Rate: ${Math.round((passed / tests) * 100)}%\n`);

if (passed === tests) {
  console.log('🎉 All Stage 1 integration tests passed!');
  console.log('✨ The foundation is ready for Stage 2 development.');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the issues above.');
  process.exit(1);
}
