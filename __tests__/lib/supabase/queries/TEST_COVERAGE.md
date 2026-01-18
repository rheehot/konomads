# Supabase Query Tests Coverage

## Overview
This document provides an overview of the test coverage for Supabase query functions in the Konomads application.

## Test Files
- `profiles.test.ts` - Tests for profile-related queries (DB-001 ~ DB-006)
- `cities.test.ts` - Tests for city-related queries (DB-007 ~ DB-015)

## Test Results
✅ **All 43 tests passing**

## Profile Query Tests (DB-001 ~ DB-006)

### getProfileById (DB-001 ~ DB-003)
- ✅ DB-001: Successfully return profile when user ID exists
- ✅ DB-002: Return null when user ID does not exist (PGRST116)
- ✅ DB-003: Throw error when database error occurs

### getProfileByUsername
- ✅ Return profile when username exists
- ✅ Return null when username does not exist
- ✅ Throw error when database error occurs

### getCurrentProfile
- ✅ Return current user profile when authenticated
- ✅ Return null when user is not authenticated

### updateProfile (DB-004 ~ DB-006)
- ✅ DB-004: Successfully update profile with all fields
- ✅ DB-005: Successfully update profile with partial fields
- ✅ DB-006: Throw error when update fails

### updateAvatar
- ✅ Successfully update avatar URL
- ✅ Throw error when avatar update fails

### isUsernameAvailable
- ✅ Return true when username is available
- ✅ Return false when username is taken
- ✅ Throw error when database error occurs

## City Query Tests (DB-007 ~ DB-015)

### getCities (DB-007 ~ DB-010)
- ✅ DB-007: Return all cities ordered by overall_rating descending
- ✅ Throw error when query fails
- ✅ Return empty array when no cities exist

### getCitiesByRegion
- ✅ DB-008: Return cities filtered by region
- ✅ Return empty array when no cities in region

### getCities Sorting
- ✅ DB-009: Return cities ordered by specified field

### getCities Pagination
- ✅ DB-010: Return cities with pagination

### getCityBySlug (DB-011 ~ DB-012)
- ✅ DB-011: Return city when slug exists
- ✅ DB-012: Return null when slug does not exist
- ✅ Throw error when database error occurs

### likeCity (DB-013) - Future Implementation
- ⏳ Placeholder test for future implementation
- Tests will be implemented when likeCity function is added

### unlikeCity (DB-014) - Future Implementation
- ⏳ Placeholder test for future implementation
- Tests will be implemented when unlikeCity function is added

### getCityLikes (DB-015) - Future Implementation
- ⏳ Placeholder test for future implementation
- Tests will be implemented when getCityLikes function is added

### Additional City Functions
- ✅ getFeaturedCities: Return only featured cities
- ✅ createCity: Successfully create a new city
- ✅ updateCity: Successfully update a city
- ✅ deleteCity: Successfully delete a city

## Test Implementation Details

### Mock Strategy
- Uses custom mock Supabase client from `__tests__/mocks/supabase.ts`
- Mocks are set up in `beforeEach` to ensure test isolation
- Each test creates fresh mock data to prevent side effects

### Test Structure
- Tests are organized by function and scenario
- Each test has a descriptive name following the pattern: "should [expected behavior] when [condition]"
- Test IDs (DB-XXX) are documented in comments for traceability

### Error Handling
- Tests verify proper error throwing for database errors
- Tests verify proper handling of PGRST116 (not found) errors
- Tests verify proper handling of authentication errors

## Running the Tests

```bash
# Run all Supabase query tests
npm test -- __tests__/lib/supabase/queries/

# Run only profile tests
npm test -- __tests__/lib/supabase/queries/profiles.test.ts

# Run only city tests
npm test -- __tests__/lib/supabase/queries/cities.test.ts

# Run with coverage
npm run test:coverage -- __tests__/lib/supabase/queries/
```

## Notes

### Future Implementations
Tests DB-013, DB-014, and DB-015 are placeholder tests for functions that are not yet implemented in the codebase:
- `likeCity(userId: string, cityId: string)` - Add a like for a city
- `unlikeCity(userId: string, cityId: string)` - Remove a like for a city
- `getCityLikes(cityId: string)` - Get the count of likes for a city

These tests should be updated once the functions are implemented.

### Mock Utilities
The tests use comprehensive mock utilities from `__tests__/mocks/`:
- `createMockSupabaseClient()` - Creates a mock Supabase client
- `defaultMockData` - Default mock data for testing
- Custom mock chains for complex query scenarios
