/**
 * Central export point for all mock utilities
 *
 * This file provides a convenient way to import all testing mocks and utilities.
 * You can import specific items or use named exports.
 */

// Supabase mocks
export {
  mockSupabaseClient,
  createMockSupabaseClient,
  createMockAuth,
  createMockStorage,
  createMockQueryBuilder,
  setupSupabaseMocks,
  resetMockData,
  mockUser,
  defaultMockData,
} from './supabase'

// Types
export type {
  MockData,
  MockSupabaseClient,
  MockAuth,
  MockStorage,
  MockQueryBuilder,
} from './supabase'

// MSW handlers
export {
  handlers,
  authHandlers,
  restHandlers,
  storageHandlers,
  errorHandlers,
  errorScenarios,
  setupMSW,
  resetMockDataStore,
  updateMockDataStore,
  getMockDataStore,
} from './handlers'
