/**
 * E2E Pages Index
 *
 * Central export point for all page object models.
 * Import from here to access all page objects in your tests.
 */

// Base page
export { BasePage } from './base.page';

// Auth pages
export { LoginPage } from './auth/login.page';
export { SignupPage } from './auth/signup.page';
export { ForgotPasswordPage } from './auth/forgot-password.page';
export { ResetPasswordPage } from './auth/reset-password.page';

// Cities pages (if they exist)
// export { CitiesListPage } from './cities/cities-list.page';
// export { CityDetailPage } from './cities/city-detail.page';

// Meetups pages
export { MeetupsListPage } from './meetups/meetups-list.page';
export { MeetupDetailPage } from './meetups/meetup-detail.page';
export { MeetupFormPage } from './meetups/meetup-form.page';

// Community/Posts pages
export { PostsPage } from './community/posts.page';
export { PostDetailPage } from './community/post-detail.page';
export { PostFormPage } from './community/post-form.page';

// Profile pages
export { ProfilePage } from './profile/profile.page';
export { ProfileEditPage } from './profile/profile-edit.page';
export { AvatarUploadComponent } from './profile/avatar-upload.component';
