import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Profile Page Object Model
 *
 * Represents the user profile page where users can view their own
 * or other users' profile information.
 */
export class ProfilePage extends BasePage {
  readonly page: Page;

  // ===========================
  // Selectors
  // ===========================

  // Profile header
  readonly profileAvatar: Locator;
  readonly profileName: Locator;
  readonly profileUsername: Locator;
  readonly profileBio: Locator;
  readonly profileLocation: Locator;
  readonly profileWebsite: Locator;
  readonly profileJoinedDate: Locator;

  // Stats section
  readonly postsCount: Locator;
  readonly meetupsCount: Locator;
  readonly followersCount: Locator;
  readonly followingCount: Locator;
  readonly likesCount: Locator;

  // Action buttons
  readonly editProfileButton: Locator;
  readonly followButton: Locator;
  readonly unfollowButton: Locator;
  readonly messageButton: Locator;
  readonly shareButton: Locator;
  readonly moreOptionsButton: Locator;

  // Tabs/Sections
  readonly profileTabs: Locator;
  readonly postsTab: Locator;
  readonly meetupsTab: Locator;
  readonly likesTab: Locator;
  readonly aboutTab: Locator;

  // Content sections
  readonly postsSection: Locator;
  readonly postsList: Locator;
  readonly meetupsSection: Locator;
  readonly meetupsList: Locator;
  readonly aboutSection: Locator;

  // Empty states
  readonly noPostsMessage: Locator;
  readonly noMeetupsMessage: Locator;

  // Badges and achievements
  readonly badgesContainer: Locator;
  readonly badge: Locator;

  // Social links
  readonly socialLinks: Locator;
  readonly githubLink: Locator;
  readonly linkedinLink: Locator;
  readonly twitterLink: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Initialize selectors
    this.profileAvatar = page.locator('[data-testid="profile-avatar"], .profile-avatar img');
    this.profileName = page.locator('[data-testid="profile-name"], .profile-name, h1');
    this.profileUsername = page.locator('[data-testid="profile-username"], .profile-username');
    this.profileBio = page.locator('[data-testid="profile-bio"], .profile-bio');
    this.profileLocation = page.locator('[data-testid="profile-location"], .profile-location');
    this.profileWebsite = page.locator('[data-testid="profile-website"], .profile-website a');
    this.profileJoinedDate = page.locator('[data-testid="joined-date"], .joined-date');

    this.postsCount = page.locator('[data-testid="posts-count"], .stat-item:has-text("Posts") .stat-value');
    this.meetupsCount = page.locator('[data-testid="meetups-count"], .stat-item:has-text("Meetups") .stat-value');
    this.followersCount = page.locator('[data-testid="followers-count"], .stat-item:has-text("Followers") .stat-value');
    this.followingCount = page.locator('[data-testid="following-count"], .stat-item:has-text("Following") .stat-value');
    this.likesCount = page.locator('[data-testid="likes-count"], .stat-item:has-text("Likes") .stat-value');

    this.editProfileButton = page.locator('button:has-text("프로필 편집"), button:has-text("Edit Profile"), a[href*="/edit"]');
    this.followButton = page.locator('button:has-text("팔로우"), button:has-text("Follow")');
    this.unfollowButton = page.locator('button:has-text("팔로우 취소"), button:has-text("Unfollow"), button:has-text("Following")');
    this.messageButton = page.locator('button:has-text("메시지"), button:has-text("Message")');
    this.shareButton = page.locator('button[aria-label*="share" i], button:has([data-lucide="share"])');
    this.moreOptionsButton = page.locator('button[aria-label*="more" i], button:has([data-lucide="more-vertical"])');

    this.profileTabs = page.locator('[data-testid="profile-tabs"], .profile-tabs');
    this.postsTab = page.locator('button:has-text("게시글"), button:has-text("Posts"), [data-tab="posts"]');
    this.meetupsTab = page.locator('button:has-text("모임"), button:has-text("Meetups"), [data-tab="meetups"]');
    this.likesTab = page.locator('button:has-text("좋아요"), button:has-text("Likes"), [data-tab="likes"]');
    this.aboutTab = page.locator('button:has-text("소개"), button:has-text("About"), [data-tab="about"]');

    this.postsSection = page.locator('[data-testid="posts-section"], .posts-section');
    this.postsList = page.locator('[data-testid="posts-list"], .posts-list .post-card');
    this.meetupsSection = page.locator('[data-testid="meetups-section"], .meetups-section');
    this.meetupsList = page.locator('[data-testid="meetups-list"], .meetups-list .meetup-card');
    this.aboutSection = page.locator('[data-testid="about-section"], .about-section');

    this.noPostsMessage = page.locator('[data-testid="no-posts"], .empty-state:has-text("게시글")');
    this.noMeetupsMessage = page.locator('[data-testid="no-meetups"], .empty-state:has-text("모임")');

    this.badgesContainer = page.locator('[data-testid="badges"], .badges-container');
    this.badge = page.locator('[data-testid="badge"], .badge');

    this.socialLinks = page.locator('[data-testid="social-links"], .social-links');
    this.githubLink = page.locator('a[href*="github.com"], [data-testid="github-link"]');
    this.linkedinLink = page.locator('a[href*="linkedin.com"], [data-testid="linkedin-link"]');
    this.twitterLink = page.locator('a[href*="twitter.com"], a[href*="x.com"], [data-testid="twitter-link"]');
  }

  // ===========================
  // Navigation
  // ===========================

  /**
   * Navigate to a user's profile page
   * @param usernameOrId - Username or user ID
   */
  async goto(usernameOrId: string): Promise<void> {
    await this.goto(`/profile/${usernameOrId}`);
  }

  /**
   * Navigate to the current user's profile
   */
  async gotoMyProfile(): Promise<void> {
    await this.goto('/profile');
  }

  // ===========================
  // Profile Information
  // ===========================

  /**
   * Get the profile name
   */
  async getName(): Promise<string> {
    return await this.profileName.textContent() || '';
  }

  /**
   * Get the profile username
   */
  async getUsername(): Promise<string> {
    const text = await this.profileUsername.textContent() || '';
    return text.replace('@', '');
  }

  /**
   * Get the profile bio
   */
  async getBio(): Promise<string> {
    return await this.profileBio.textContent() || '';
  }

  /**
   * Get the profile location
   */
  async getLocation(): Promise<string> {
    return await this.profileLocation.textContent() || '';
  }

  /**
   * Get the profile website URL
   */
  async getWebsite(): Promise<string> {
    return await this.profileWebsite.getAttribute('href') || '';
  }

  /**
   * Get the joined date
   */
  async getJoinedDate(): Promise<string> {
    return await this.profileJoinedDate.textContent() || '';
  }

  /**
   * Get complete profile information
   */
  async getProfileInfo(): Promise<{
    name: string;
    username: string;
    bio: string;
    location: string;
    website: string;
    joinedDate: string;
    postsCount: number;
    meetupsCount: number;
    followersCount: number;
    followingCount: number;
    likesCount: number;
  }> {
    return {
      name: await this.getName(),
      username: await this.getUsername(),
      bio: await this.getBio(),
      location: await this.getLocation(),
      website: await this.getWebsite(),
      joinedDate: await this.getJoinedDate(),
      postsCount: await this.getPostsCount(),
      meetupsCount: await this.getMeetupsCount(),
      followersCount: await this.getFollowersCount(),
      followingCount: await this.getFollowingCount(),
      likesCount: await this.getLikesCount(),
    };
  }

  // ===========================
  // Stats
  // ===========================

  /**
   * Get the posts count
   */
  async getPostsCount(): Promise<number> {
    const text = await this.postsCount.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Get the meetups count
   */
  async getMeetupsCount(): Promise<number> {
    const text = await this.meetupsCount.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Get the followers count
   */
  async getFollowersCount(): Promise<number> {
    const text = await this.followersCount.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Get the following count
   */
  async getFollowingCount(): Promise<number> {
    const text = await this.followingCount.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Get the likes count
   */
  async getLikesCount(): Promise<number> {
    const text = await this.likesCount.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  // ===========================
  // Actions
  // ===========================

  /**
   * Click the edit profile button
   */
  async clickEditProfile(): Promise<void> {
    await this.editProfileButton.click();
  }

  /**
   * Follow the user
   */
  async follow(): Promise<void> {
    await this.followButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Unfollow the user
   */
  async unfollow(): Promise<void> {
    await this.unfollowButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Check if the user is being followed
   */
  async isFollowing(): Promise<boolean> {
    return await this.unfollowButton.isVisible();
  }

  /**
   * Click the message button
   */
  async message(): Promise<void> {
    await this.messageButton.click();
  }

  /**
   * Share the profile
   */
  async share(): Promise<void> {
    await this.shareButton.click();
  }

  /**
   * Click the more options button
   */
  async clickMoreOptions(): Promise<void> {
    await this.moreOptionsButton.click();
  }

  // ===========================
  // Tabs and Content
  // ===========================

  /**
   * Switch to the posts tab
   */
  async switchToPosts(): Promise<void> {
    await this.postsTab.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Switch to the meetups tab
   */
  async switchToMeetups(): Promise<void> {
    await this.meetupsTab.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Switch to the likes tab
   */
  async switchToLikes(): Promise<void> {
    await this.likesTab.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Switch to the about tab
   */
  async switchToAbout(): Promise<void> {
    await this.aboutTab.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Get all post titles on the profile
   */
  async getPostTitles(): Promise<string[]> {
    const titles: string[] = [];
    const posts = await this.postsList.all();

    for (const post of posts) {
      const title = await post.locator('.post-title, h2, h3').textContent();
      if (title) titles.push(title);
    }

    return titles;
  }

  /**
   * Get all meetup titles on the profile
   */
  async getMeetupTitles(): Promise<string[]> {
    const titles: string[] = [];
    const meetups = await this.meetupsList.all();

    for (const meetup of meetups) {
      const title = await meetup.locator('.meetup-title, h2, h3').textContent();
      if (title) titles.push(title);
    }

    return titles;
  }

  /**
   * Click on a post by index
   * @param index - Zero-based index of the post
   */
  async clickPost(index: number): Promise<void> {
    await this.postsList.nth(index).click();
  }

  /**
   * Click on a meetup by index
   * @param index - Zero-based index of the meetup
   */
  async clickMeetup(index: number): Promise<void> {
    await this.meetupsList.nth(index).click();
  }

  // ===========================
  // Badges and Social Links
  // ===========================

  /**
   * Get all badges
   */
  async getBadges(): Promise<string[]> {
    const badges: string[] = [];
    const badgeElements = await this.badge.all();

    for (const badge of badgeElements) {
      const text = await badge.textContent();
      if (text) badges.push(text);
    }

    return badges;
  }

  /**
   * Click on a social link
   * @param platform - Social platform ('github', 'linkedin', 'twitter')
   */
  async clickSocialLink(platform: 'github' | 'linkedin' | 'twitter'): Promise<void> {
    const linkMap = {
      github: this.githubLink,
      linkedin: this.linkedinLink,
      twitter: this.twitterLink,
    };

    await linkMap[platform].click();
  }

  // ===========================
  // Assertion Methods
  // ===========================

  /**
   * Verify that the profile page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.profileName).toBeVisible();
    await expect(this.profileAvatar).toBeVisible();
  }

  /**
   * Verify the profile name
   * @param expectedName - Expected name
   */
  async verifyName(expectedName: string): Promise<void> {
    await expect(this.profileName).toContainText(expectedName);
  }

  /**
   * Verify the profile username
   * @param expectedUsername - Expected username
   */
  async verifyUsername(expectedUsername: string): Promise<void> {
    await expect(this.profileUsername).toContainText(expectedUsername);
  }

  /**
   * Verify the profile bio
   * @param expectedBio - Expected bio content
   */
  async verifyBio(expectedBio: string): Promise<void> {
    await expect(this.profileBio).toContainText(expectedBio);
  }

  /**
   * Verify that the edit profile button is visible (own profile)
   */
  async verifyCanEditProfile(): Promise<void> {
    await expect(this.editProfileButton).toBeVisible();
  }

  /**
   * Verify that the follow button is visible (other user's profile)
   */
  async verifyCanFollow(): Promise<void> {
    await expect(this.followButton).toBeVisible();
  }

  /**
   * Verify that the user is being followed
   */
  async verifyIsFollowing(): Promise<void> {
    await expect(this.unfollowButton).toBeVisible();
  }

  /**
   * Verify the posts count
   * @param expectedCount - Expected count
   */
  async verifyPostsCount(expectedCount: number): Promise<void> {
    const count = await this.getPostsCount();
    expect(count).toBe(expectedCount);
  }

  /**
   * Verify the followers count
   * @param expectedCount - Expected count
   */
  async verifyFollowersCount(expectedCount: number): Promise<void> {
    const count = await this.getFollowersCount();
    expect(count).toBe(expectedCount);
  }

  /**
   * Verify that posts are displayed
   */
  async verifyPostsDisplayed(): Promise<void> {
    await expect(this.postsList.first()).toBeVisible();
  }

  /**
   * Verify that no posts message is displayed
   */
  async verifyNoPosts(): Promise<void> {
    await expect(this.noPostsMessage).toBeVisible();
  }

  /**
   * Verify that badges are displayed
   * @param expectedBadges - Expected badges
   */
  async verifyBadges(expectedBadges: string[]): Promise<void> {
    const badges = await this.getBadges();
    expect(badges).toEqual(expect.arrayContaining(expectedBadges));
  }

  /**
   * Verify that a specific tab is active
   * @param tabName - Tab name ('posts', 'meetups', 'likes', 'about')
   */
  async verifyTabActive(tabName: string): Promise<void> {
    const tabMap: Record<string, Locator> = {
      posts: this.postsTab,
      meetups: this.meetupsTab,
      likes: this.likesTab,
      about: this.aboutTab,
    };

    await expect(tabMap[tabName]).toHaveAttribute('aria-selected', 'true');
  }

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Wait for the page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState();
    await expect(this.profileName).toBeVisible();
    await expect(this.profileAvatar).toBeVisible();
  }

  /**
   * Check if viewing own profile
   */
  async isOwnProfile(): Promise<boolean> {
    return await this.editProfileButton.isVisible();
  }

  /**
   * Get the profile avatar URL
   */
  async getAvatarUrl(): Promise<string> {
    return await this.profileAvatar.getAttribute('src') || '';
  }
}
