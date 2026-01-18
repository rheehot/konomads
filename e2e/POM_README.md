# Konomads E2E Test Page Object Model & Utilities

This directory contains comprehensive Page Object Models (POM) and utility files for end-to-end testing of the Konomads application.

## Overview

All POM classes extend from `BasePage` which provides common functionality for navigation, clicking, typing, waiting, and assertions.

**Total Lines of Code**: ~7,200+ lines across 13 files

## Directory Structure

```
e2e/
├── pages/
│   ├── index.ts                      # Central export for all pages
│   ├── base.page.ts                  # Base page class with common methods
│   ├── meetups/
│   │   ├── meetups-list.page.ts      # Meetups listing page
│   │   ├── meetup-detail.page.ts     # Individual meetup detail page
│   │   └── meetup-form.page.ts       # Meetup creation/edit form
│   ├── community/
│   │   ├── posts.page.ts             # Posts listing page
│   │   ├── post-detail.page.ts       # Post detail with comments
│   │   └── post-form.page.ts         # Post creation/edit form
│   └── profile/
│       ├── profile.page.ts           # User profile page
│       ├── profile-edit.page.ts      # Profile edit form
│       └── avatar-upload.component.ts # Avatar upload component
└── utils/
    ├── index.ts                      # Central export for all utils
    ├── api-helpers.ts                # Supabase API helpers
    ├── data-helpers.ts               # Random test data generators
    ├── selectors.ts                  # Common selector constants
    └── assertions.ts                 # Custom assertion helpers
```

## Page Objects

### Meetups Pages

#### **MeetupsListPage** (`meetups/meetups-list.page.ts`)
Meetups listing page with search, filtering, and pagination.

**Key Methods:**
- `goto()` - Navigate to meetups list
- `gotoCityMeetups(citySlug)` - Navigate to city-specific meetups
- `search(keyword)` - Search meetups
- `sortBy(option)` - Sort by latest, upcoming, popular
- `filterByCity(cityName)` - Filter by city
- `filterByStatus(status)` - Filter by status (open, full, closed)
- `resetFilters()` - Reset all filters
- `clickMeetupCard(index)` - Click a meetup card
- `getMeetupDetails(index)` - Get meetup card details
- `join()` / `leave()` - Join/leave meetups
- `verifyMeetupsDisplayed()` - Verify meetups are shown

**Usage Example:**
```typescript
const meetupsList = new MeetupsListPage(page);
await meetupsList.goto();
await meetupsList.search('노마드');
await meetupsList.sortBy('upcoming');
await meetupsList.verifyMeetupsDisplayed();
```

#### **MeetupDetailPage** (`meetups/meetup-detail.page.ts`)
Individual meetup detail page with full information and participant management.

**Key Methods:**
- `goto(meetupId)` - Navigate to specific meetup
- `getMeetupInfo()` - Get complete meetup information
- `join()` / `leave()` - Join/leave the meetup
- `hasJoined()` - Check if user has joined
- `isFull()` - Check if meetup is full
- `getParticipantCount()` - Get current participant count
- `addComment(comment)` - Add a comment
- `getComments()` - Get all comments
- `delete()` - Delete the meetup
- `isOrganizer()` - Check if current user is organizer

**Usage Example:**
```typescript
const meetupDetail = new MeetupDetailPage(page);
await meetupDetail.goto('meetup-123');
await meetupDetail.join();
await meetupDetail.verifyHasJoined();
```

#### **MeetupFormPage** (`meetups/meetup-form.page.ts`)
Meetup creation and editing form.

**Key Methods:**
- `gotoCreate()` / `gotoEdit(meetupId)` - Navigate to form
- `fillMeetupForm(data)` - Fill complete form
- `fillTitle(title)` - Set meetup title
- `fillDescription(description)` - Set description
- `setDate(date)` / `setTime(time)` - Set date/time
- `selectCity(cityName)` - Select city
- `setMaxParticipants(max)` - Set participant limit
- `addTags(tags)` - Add tags
- `uploadImage(filePath)` - Upload cover image
- `submit()` - Submit form
- `verifyFormDisplayed()` - Verify form is visible

**Usage Example:**
```typescript
const meetupForm = new MeetupFormPage(page);
await meetupForm.gotoCreate();
await meetupForm.fillMeetupForm({
  title: '서울 노마드 모임',
  description: '모임 설명',
  city: '서울',
  date: '2024-03-15',
  time: '14:00',
  maxParticipants: 20,
  tags: ['노마드', '네트워킹']
});
await meetupForm.submit();
```

### Community/Posts Pages

#### **PostsPage** (`community/posts.page.ts`)
Posts listing page with category filtering and search.

**Key Methods:**
- `goto()` - Navigate to posts list
- `gotoCityPosts(citySlug)` - Navigate to city-specific posts
- `search(keyword)` - Search posts
- `selectCategory(category)` - Filter by category
- `sortBy(option)` - Sort posts
- `clickPostByTitle(title)` - Click a post
- `getPostDetails(index)` - Get post card details
- `likePost(index)` / `bookmarkPost(index)` - Interact with posts
- `getPinnedPosts()` - Get pinned posts

**Usage Example:**
```typescript
const postsPage = new PostsPage(page);
await postsPage.goto();
await postsPage.selectCategory('질문');
await postsPage.sortBy('popular');
```

#### **PostDetailPage** (`community/post-detail.page.ts`)
Post detail page with full content and comments.

**Key Methods:**
- `goto(postId)` - Navigate to specific post
- `getPostInfo()` - Get complete post information
- `toggleLike()` / `toggleBookmark()` - Like/bookmark post
- `addComment(comment)` - Add a comment
- `getComments()` - Get all comments
- `replyToComment(index)` - Reply to a comment
- `editComment(index, newContent)` - Edit a comment
- `deleteComment(index)` - Delete a comment
- `toggleLikeComment(index)` - Like a comment
- `getRelatedPostTitles()` - Get related posts

**Usage Example:**
```typescript
const postDetail = new PostDetailPage(page);
await postDetail.goto('post-123');
await postDetail.addComment('좋은 글이네요!');
await postDetail.verifyCommentDisplayed('좋은 글이네요!');
```

#### **PostFormPage** (`community/post-form.page.ts`)
Post creation and editing form with rich text editor.

**Key Methods:**
- `gotoCreate()` / `gotoEdit(postId)` - Navigate to form
- `fillPostForm(data)` - Fill complete form
- `fillTitle(title)` - Set post title
- `fillContent(content)` - Set post content
- `selectCategory(category)` - Select category
- `addTags(tags)` - Add tags
- `uploadImage(filePath)` - Upload image
- `makeBold()` / `makeItalic()` - Rich text formatting
- `insertLink(url)` / `insertImage(url)` - Insert media
- `insertCodeBlock(code)` - Insert code block
- `submit()` - Submit form
- `saveDraft()` - Save as draft

**Usage Example:**
```typescript
const postForm = new PostFormPage(page);
await postForm.gotoCreate();
await postForm.fillPostForm({
  title: '노마드 생활 팁',
  content: '디지털 노마드로서...',
  category: '정보',
  tags: ['노마드', '팁']
});
await postForm.submit();
```

### Profile Pages

#### **ProfilePage** (`profile/profile.page.ts`)
User profile page with posts, meetups, and stats.

**Key Methods:**
- `goto(usernameOrId)` - Navigate to profile
- `gotoMyProfile()` - Navigate to own profile
- `getProfileInfo()` - Get complete profile information
- `follow()` / `unfollow()` - Follow/unfollow user
- `isFollowing()` - Check if following
- `switchToPosts()` / `switchToMeetups()` - Switch tabs
- `getPostTitles()` - Get user's posts
- `getMeetupTitles()` - Get user's meetups
- `getBadges()` - Get user badges
- `verifyCanEditProfile()` - Check if can edit

**Usage Example:**
```typescript
const profilePage = new ProfilePage(page);
await profilePage.goto('nomad123');
await profilePage.follow();
await profilePage.verifyIsFollowing();
```

#### **ProfileEditPage** (`profile/profile-edit.page.ts`)
Profile editing form.

**Key Methods:**
- `goto()` - Navigate to edit page
- `fillProfileForm(data)` - Fill complete form
- `fillFullName(name)` / `fillUsername(username)` - Basic info
- `fillBio(bio)` - Set bio
- `fillSocialLinks(social)` - Set social media links
- `setProfileVisibility(level)` - Set privacy
- `uploadAvatar(filePath)` - Upload avatar
- `removeAvatar()` - Remove avatar
- `save()` - Save changes
- `verifySavedSuccessfully()` - Verify save success

**Usage Example:**
```typescript
const profileEdit = new ProfileEditPage(page);
await profileEdit.goto();
await profileEdit.fillProfileForm({
  fullName: '홍길동',
  username: 'nomad123',
  bio: '디지털 노마드',
  socialLinks: {
    github: 'githubuser',
    twitter: 'twitteruser'
  }
});
await profileEdit.save();
```

#### **AvatarUploadComponent** (`profile/avatar-upload.component.ts`)
Reusable avatar upload component with editing tools.

**Key Methods:**
- `uploadAvatar(filePath, options)` - Upload and optionally edit
- `removeAvatar()` - Remove current avatar
- `rotate(degrees)` - Rotate avatar
- `zoom(level)` - Set zoom level
- `crop()` - Crop avatar
- `hasAvatar()` - Check if avatar is set
- `isModalOpen()` - Check if upload modal is open
- `verifyAvatarDisplayed()` - Verify avatar is visible

**Usage Example:**
```typescript
const avatarUpload = new AvatarUploadComponent(page);
await avatarUpload.uploadAvatar('/path/to/image.jpg', {
  rotate: 1,
  zoom: 80,
  confirm: true
});
await avatarUpload.verifyAvatarDisplayed();
```

## Utility Files

### **api-helpers.ts**

Supabase API helpers for backend interactions in tests.

**Key Functions:**
- `signUpUser(email, password)` - Create new user
- `signInUser(email, password)` - Sign in user
- `signOutUser(accessToken)` - Sign out user
- `deleteUser(userId)` - Delete user account
- `queryTable(tableName, options)` - Query Supabase tables
- `insertRecord(tableName, data)` - Insert record
- `updateRecord(tableName, id, data)` - Update record
- `deleteRecord(tableName, id)` - Delete record
- `cleanupTestData(options)` - Clean up test data
- `verifyRecordExists(tableName, id)` - Verify record exists

**Specialized Helpers:**
- `profileHelpers.*` - Profile CRUD operations
- `postHelpers.*` - Post CRUD operations
- `commentHelpers.*` - Comment CRUD operations
- `meetupHelpers.*` - Meetup CRUD operations
- `cityHelpers.*` - City queries

**Usage Example:**
```typescript
import { signUpUser, postHelpers, cleanupTestData } from '@/utils/api-helpers';

// Create test user
const { user, session } = await signUpUser('test@example.com', 'password123');

// Create test post
const post = await postHelpers.createPost({
  title: 'Test Post',
  content: 'Test content',
  user_id: user.id
}, session.access_token);

// Clean up
await cleanupTestData({
  postIds: [post.id],
  userIds: [user.id],
  accessToken: session.access_token
});
```

### **data-helpers.ts**

Random test data generators for creating realistic test data.

**Key Functions:**
- `randomString(length)` - Generate random string
- `randomEmail(domain)` - Generate random email
- `randomUsername()` - Generate random username
- `randomPassword(length)` - Generate secure password
- `randomPhoneNumber()` - Generate Korean phone number
- `randomKoreanCity()` - Get random Korean city
- `randomKoreanName()` - Generate Korean name
- `randomParagraph(sentences)` - Generate random text
- `randomTitle()` - Generate random post title
- `randomBio()` - Generate random bio
- `randomDate(start, end)` - Generate random date
- `randomFutureDate(daysFromNow)` - Generate future date
- `randomUserData()` - Generate complete user data
- `randomPostData()` - Generate post data
- `randomMeetupData()` - Generate meetup data

**Constants:**
- `KOREAN_CITIES` - Array of Korean cities
- `KOREAN_REGIONS` - Array of Korean regions
- `POST_CATEGORIES` - Post category options
- `MEETUP_STATUSES` - Meetup status options

**Usage Example:**
```typescript
import { randomUserData, randomPostData, randomKoreanCity } from '@/utils/data-helpers';

// Generate test user data
const userData = randomUserData();

// Generate post data with custom values
const postData = randomPostData({
  title: 'Custom Title',
  category: '정보'
});

// Get a random city
const city = randomKoreanCity();
```

### **selectors.ts**

Centralized selector constants for consistency across tests.

**Selector Groups:**
- `commonSelectors` - Common UI elements (buttons, forms, modals, etc.)
- `authSelectors` - Authentication pages
- `postsSelectors` - Posts and comments
- `meetupsSelectors` - Meetups pages
- `profileSelectors` - Profile pages
- `citiesSelectors` - Cities pages
- `a11ySelectors` - Accessibility selectors

**Helper Functions:**
- `byTestId(id)` - Create data-testid selector
- `byText(text)` - Create text selector
- `byRole(role, name)` - Create ARIA role selector
- `combineSelectors(...selectors)` - Combine with OR logic
- `selector()` - Chainable selector builder

**Usage Example:**
```typescript
import { byTestId, selector, commonSelectors } from '@/utils/selectors';

// Using helper functions
const submitButton = byTestId('submit-button');
const modal = byRole('dialog', 'Create Post');

// Using builder
const mySelector = selector()
  .addClass('post-card')
  .addTestId('post-123')
  .build();

// Using predefined selectors
const { button, form } = commonSelectors;
```

### **assertions.ts**

Custom assertion helpers extending Playwright's expect.

**Assertion Categories:**

**Page Assertions:**
- `assertUrl(page, expectedPath)` - Assert URL contains path
- `assertExactUrl(page, expectedUrl)` - Assert exact URL
- `assertTitle(page, expectedTitle)` - Assert page title
- `assertPath(page, expectedPath)` - Assert pathname
- `assertQueryParam(page, param, value)` - Assert query param

**Element Visibility:**
- `assertVisible(locator)` - Assert element visible
- `assertHidden(locator)` - Assert element hidden
- `assertAllVisible(locators)` - Assert all visible
- `assertOneVisible(locators)` - Assert exactly one visible

**Text Content:**
- `assertText(locator, expectedText)` - Assert contains text
- `assertExactText(locator, expectedText)` - Assert exact text
- `assertTextMatch(locator, pattern)` - Assert matches regex
- `assertNoText(locator, unexpectedText)` - Assert no text

**State:**
- `assertEnabled(locator)` - Assert enabled
- `assertDisabled(locator)` - Assert disabled
- `assertChecked(locator)` - Assert checked
- `assertFocused(locator)` - Assert focused

**Count:**
- `assertCount(locator, expectedCount)` - Assert exact count
- `assertAtLeast(locator, minCount)` - Assert minimum count
- `assertAtMost(locator, maxCount)` - Assert maximum count

**Forms:**
- `assertValue(locator, expectedValue)` - Assert input value
- `assertHasErrors(errorLocator)` - Assert validation errors
- `assertFormData(page, expectedData)` - Assert form data

**Async:**
- `assertBecomesVisible(locator, timeout)` - Wait for visible
- `assertBecomesHidden(locator, timeout)` - Wait for hidden

**Soft Assertions:**
- `softAssert(condition, message)` - Non-failing assertion
- `assertSoftAssertions()` - Fail if any soft assertions failed

**Usage Example:**
```typescript
import { assertUrl, assertVisible, assertText, assertCount } from '@/utils/assertions';

// Assert page state
await assertUrl(page, '/meetups');
await assertVisible(meetupList.meetupCards.first());
await assertText(meetupList.meetupCards.first(), '서울 모임');
await assertCount(meetupList.meetupCards, 5);

// Soft assertions (don't fail immediately)
softAssert(condition1, 'Condition 1 failed');
softAssert(condition2, 'Condition 2 failed');
assertSoftAssertions(); // Fails here if any failed
```

## BasePage Class

All page objects extend `BasePage` which provides:

**Navigation:**
- `goto(path)` - Navigate to path
- `gotoHome()` - Navigate to home
- `reload()` - Reload page
- `goBack()` / `goForward()` - Browser history

**Actions:**
- `click(selector)` - Click element
- `fill(selector, text)` - Fill input
- `check(selector)` / `uncheck(selector)` - Checkbox/radio
- `selectOption(selector, value)` - Select dropdown

**Waiting:**
- `waitFor(ms)` - Wait milliseconds
- `waitForNetworkIdle()` - Wait for network idle
- `waitForVisible(selector)` - Wait for visible
- `waitForHidden(selector)` - Wait for hidden

**Getters:**
- `getText(selector)` - Get element text
- `getAttribute(selector, attr)` - Get attribute
- `count(selector)` - Count elements
- `getUrl()` - Get current URL

**Utilities:**
- `screenshot(filename)` - Take screenshot
- `scrollToBottom()` / `scrollToTop()` - Scroll page
- `clearCookies()` - Clear cookies
- `evaluate(fn)` - Execute JavaScript

## Best Practices

### 1. Import from Index Files
```typescript
// Good - import from index
import { MeetupsListPage, ProfilePage } from '@/pages';
import { randomUserData, assertVisible } from '@/utils';

// Avoid - import from individual files
import { MeetupsListPage } from '@/pages/meetups/meetups-list.page';
```

### 2. Chain Page Object Methods
```typescript
const meetupsList = new MeetupsListPage(page);
await meetupsList.goto();
await meetupsList.search('노마드');
await meetupsList.sortBy('upcoming');
await meetupsList.clickMeetupCard(0);
```

### 3. Use Helper Functions for Test Data
```typescript
import { randomUserData, randomMeetupData } from '@/utils';

const user = randomUserData();
const meetup = randomMeetupData({ city_id: cityId });
```

### 4. Use Custom Assertions
```typescript
import { assertUrl, assertVisible, assertText } from '@/utils';

await assertUrl(page, '/meetups/123');
await assertVisible(meetupDetail.title);
await assertText(meetupDetail.title, 'Seoul Nomad Meetup');
```

### 5. Clean Up Test Data
```typescript
import { signUpUser, cleanupTestData } from '@/utils';

const { user, session } = await signUpUser(email, password);

try {
  // Run test
} finally {
  await cleanupTestData({
    userIds: [user.id],
    accessToken: session.access_token
  });
}
```

## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { MeetupsListPage, MeetupFormPage, MeetupDetailPage } from '@/pages';
import { randomMeetupData, assertUrl, assertVisible } from '@/utils';

test.describe('Meetups', () => {
  test('should create and view a new meetup', async ({ page }) => {
    const meetupsList = new MeetupsListPage(page);
    const meetupForm = new MeetupFormPage(page);
    const meetupDetail = new MeetupDetailPage(page);

    // Navigate to meetups
    await meetupsList.goto();
    await assertUrl(page, '/meetups');

    // Click create
    await meetupsList.clickCreateMeetup();

    // Fill form
    const meetupData = randomMeetupData();
    await meetupForm.fillMeetupForm(meetupData);
    await meetupForm.submit();

    // Verify created
    await meetupDetail.verifyPageLoaded();
    await assertVisible(meetupDetail.meetupTitle);
    await assertText(meetupDetail.meetupTitle, meetupData.title);
  });
});
```

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
# Supabase (for API helpers)
E2E_SUPABASE_URL=your_supabase_url
E2E_SUPABASE_ANON_KEY=your_supabase_anon_key
E2E_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
BASE_URL=http://localhost:3000
```

## Contributing

When adding new page objects or utilities:

1. Extend from `BasePage`
2. Follow the naming conventions (e.g., `*Page`, `*Component`)
3. Add comprehensive JSDoc comments
4. Include usage examples
5. Export from index files
6. Update this README

## Support

For issues or questions about the POM structure:
- Check existing page objects for patterns
- Review Playwright documentation: https://playwright.dev
- Follow the Konomads coding standards
