# App Page Tests

This directory contains tests for page components in the application.

## Test Coverage

### City Detail Page (`cities-slug-page.test.tsx`)
- **Test IDs: PG-011 ~ PG-014**

#### PG-011: Basic Rendering and City Information
- Renders city name and region in hero section
- Displays city rating with star icon
- Shows city description
- Renders badges for popular cities
- Shows review and like counts
- Handles invalid city slugs with notFound
- Displays navigation buttons (back, home)

#### PG-012: Related Cities Section
- Renders related cities from the same region
- Handles cases with no related cities
- Displays related city ratings
- Shows related city monthly costs

#### PG-013: Living Cost and Infrastructure Information
- Displays monthly cost, studio rent, and deposit
- Shows internet speed with rocket icon for fast connections (>= 1000Mbps)
- Renders cafe count and coworking space information

#### PG-014: Weather and Environment Information
- Shows current and average temperatures
- Displays air quality with appropriate labels (좋음/보통/나쁨)
- Renders weather and environment section title

### Login Page (`login-page.test.tsx`)
- **Test IDs: PG-022 ~ PG-023**

#### PG-022: Login Form Rendering
- Renders page title and subtitle
- Displays email and password input fields
- Shows proper placeholders for inputs
- Renders submit button
- Displays forgot password link
- Shows register link with prompt text
- No error message when no errors present

#### PG-023: Form Validation and Error Display
- Shows error for invalid credentials
- Displays error for unconfirmed email
- Shows generic error for unknown errors
- Error messages appear in styled error boxes
- Proper form structure and accessibility
- Correct label associations

### Register Page (`register-page.test.tsx`)
- **Test IDs: PG-024 ~ PG-025**

#### PG-024: Register Form Rendering
- Renders page title and subtitle
- Displays email and password input fields
- Shows password hint text
- Renders terms and conditions checkbox
- Displays terms and privacy policy links
- Shows submit button
- Displays login link with prompt text
- No error message when no errors present

#### PG-025: Form Validation and Error Display
- Shows error for already registered email
- Displays error for short password
- Shows error for invalid credentials
- Displays generic error for unknown errors
- Error messages appear in styled error boxes
- Password field has minLength attribute
- Proper form structure and accessibility
- Correct label associations including checkbox

### Meetups Page (`meetups-page.test.tsx`)
- **Test IDs: PG-015 ~ PG-017**
- **Status: Placeholder** (page not yet implemented)

#### PG-015: Basic Rendering
- Will test meetups page rendering
- Will display list of meetups
- Will show meetup details

#### PG-016: Filtering Functionality
- Will test filter options (city, type, date)
- Will filter by city and type
- Will display filtered results

#### PG-017: Join Button and Interaction
- Will test join/participate button
- Will disable button when full
- Will show attendee counts
- Will handle join for authenticated users
- Will redirect unauthenticated users to login

### Profile Page (`profile-page.test.tsx`)
- **Test IDs: PG-018 ~ PG-021**
- **Status: Placeholder** (page not yet implemented)

#### PG-018: Basic Rendering
- Will test profile page rendering
- Will display user information
- Will show user avatar
- Will redirect unauthenticated users

#### PG-019: Edit Mode
- Will test edit button functionality
- Will show editable form fields
- Will have cancel button
- Will preserve existing values

#### PG-020: Avatar Upload
- Will test avatar upload functionality
- Will show file picker
- Will validate image types
- Will show image preview
- Will display error for invalid files

#### PG-021: Save and Update
- Will test save button
- Will validate required fields
- Will show loading state
- Will display success/error messages
- Will update UI after save
- Will exit edit mode after save

## Running Tests

Run all app page tests:
```bash
npm test -- __tests__/app
```

Run specific test file:
```bash
npm test -- __tests__/app/cities-slug-page.test.tsx
```

Run with coverage:
```bash
npm run test:coverage -- __tests__/app
```

## Test Structure

Each test file follows this structure:
1. Imports and mocks setup
2. Describe blocks for each test ID group
3. Individual it() tests for specific behaviors
4. Proper cleanup in beforeEach hooks

## Mocking Strategy

Tests use comprehensive mocking for:
- Next.js modules (navigation, link, headers)
- Supabase client (auth, database queries)
- Server actions (login, signup)
- External dependencies

## Notes

- Meetups and profile pages are currently placeholders and will be fully implemented when those pages are created
- Tests use Vitest and @testing-library/react
- All page tests are async since they're Next.js server components
- Error handling and edge cases are covered
