/**
 * Common Selector Constants for E2E Testing
 *
 * Centralized selector definitions to maintain consistency
 * across all page objects and tests.
 */

// ===========================
// Common Selectors
// ===========================

export const commonSelectors = {
  // Navigation
  nav: {
    header: 'nav, header',
    navigation: '[data-testid="navigation"], .navigation',
    homeLink: 'a[href="/"], [data-testid="home-link"]',
    logo: '[data-testid="logo"], .logo',
  },

  // Buttons
  button: {
    submit: 'button[type="submit"], [data-testid="submit-button"]',
    cancel: 'button:has-text("취소"), button:has-text("Cancel"), [data-testid="cancel-button"]',
    confirm: 'button:has-text("확인"), button:has-text("Confirm"), [data-testid="confirm-button"]',
    delete: 'button:has-text("삭제"), button:has-text("Delete"), [data-testid="delete-button"]',
    edit: 'button:has-text("수정"), button:has-text("Edit"), [data-testid="edit-button"]',
    save: 'button:has-text("저장"), button:has-text("Save"), [data-testid="save-button"]',
    close: 'button:has-text("닫기"), button:has-text("Close"), [aria-label="close"]',
    back: 'button:has([data-lucide="arrow-left"]), button[aria-label*="back" i]',
    more: 'button:has([data-lucide="more-vertical"]), button[aria-label*="more" i]',
  },

  // Forms
  form: {
    container: 'form, [data-testid="form"]',
    input: 'input, [data-testid="input"]',
    textarea: 'textarea, [data-testid="textarea"]',
    select: 'select, [data-testid="select"]',
    checkbox: 'input[type="checkbox"]',
    radio: 'input[type="radio"]',
    label: 'label',
    error: '.error, [data-testid="error"], .error-message',
    success: '.success, [data-testid="success"], .success-message',
    validationError: '.validation-error, [data-testid="validation-error"]',
  },

  // Loading states
  loading: {
    spinner: '.spinner, [data-testid="spinner"]',
    skeleton: '.skeleton, [data-testid="skeleton"]',
    loader: '.loader, [data-testid="loader"]',
    overlay: '.loading-overlay, [data-testid="loading-overlay"]',
  },

  // Modals and dialogs
  modal: {
    container: '[role="dialog"], .modal, [data-testid="modal"]',
    title: '[role="dialog"] h1, [role="dialog"] h2, .modal-title',
    content: '[role="dialog"] .modal-content',
    footer: '[role="dialog"] .modal-footer',
    closeButton: '[role="dialog"] button[aria-label="close"], .modal-close',
    overlay: '.modal-overlay, [data-testid="modal-overlay"]',
  },

  // Empty states
  emptyState: {
    container: '.empty-state, [data-testid="empty-state"]',
    icon: '.empty-state-icon, [data-testid="empty-icon"]',
    title: '.empty-state-title, [data-testid="empty-title"]',
    message: '.empty-state-message, [data-testid="empty-message"]',
    action: '.empty-state-action, [data-testid="empty-action"]',
  },

  // Pagination
  pagination: {
    container: '.pagination, nav[aria-label="pagination"]',
    previous: 'button[aria-label="previous"], .pagination-prev',
    next: 'button[aria-label="next"], .pagination-next',
    page: '.pagination-page',
    info: '.page-info, [data-testid="page-info"]',
  },

  // Cards
  card: {
    container: '.card, [data-testid="card"]',
    title: '.card-title, [data-testid="card-title"]',
    content: '.card-content, [data-testid="card-content"]',
    footer: '.card-footer, [data-testid="card-footer"]',
    image: '.card-image, [data-testid="card-image"]',
  },
} as const;

// ===========================
// Auth Selectors
// ===========================

export const authSelectors = {
  // Login page
  login: {
    form: 'form[data-testid="login-form"], #login-form',
    emailInput: 'input[name="email"], [data-testid="email-input"]',
    passwordInput: 'input[name="password"], [data-testid="password-input"]',
    submitButton: 'button[type="submit"], [data-testid="login-button"]',
    rememberMe: 'input[name="remember"], [data-testid="remember-me"]',
    forgotPassword: 'a[href*="forgot-password"], [data-testid="forgot-password"]',
    signupLink: 'a[href*="register"], a[href*="signup"], [data-testid="signup-link"]',
  },

  // Register page
  register: {
    form: 'form[data-testid="register-form"], #register-form',
    emailInput: 'input[name="email"], [data-testid="email-input"]',
    passwordInput: 'input[name="password"], [data-testid="password-input"]',
    confirmPasswordInput: 'input[name="confirmPassword"], input[name="confirm_password"]',
    usernameInput: 'input[name="username"], [data-testid="username-input"]',
    submitButton: 'button[type="submit"], [data-testid="register-button"]',
    loginLink: 'a[href*="login"], [data-testid="login-link"]',
  },

  // Password reset
  forgotPassword: {
    form: 'form[data-testid="forgot-password-form"]',
    emailInput: 'input[name="email"]',
    submitButton: 'button[type="submit"]',
    backLink: 'a[href*="login"]',
  },

  // Common auth elements
  auth: {
    userMenu: '[data-testid="user-menu"], .user-menu',
    logoutButton: 'button:has-text("로그아웃"), button:has-text("Logout")',
    avatar: '[data-testid="user-avatar"], .user-avatar',
  },
} as const;

// ===========================
// Community/Posts Selectors
// ===========================

export const postsSelectors = {
  // Posts list page
  list: {
    container: '[data-testid="posts-list"], .posts-list',
    searchInput: 'input[name="search"], [data-testid="search-input"]',
    categoryTabs: '.category-tabs, [data-testid="category-tabs"]',
    sortSelect: 'select[name="sort"], [data-testid="sort-select"]',
    createButton: 'a[href*="/posts/create"], button:has-text("글쓰기")',
    emptyState: '.empty-state, [data-testid="no-posts"]',
  },

  // Post card
  card: {
    container: '[data-testid="post-card"], .post-card',
    title: '[data-testid="post-title"], .post-title',
    content: '[data-testid="post-content"], .post-content',
    author: '[data-testid="post-author"], .post-author',
    date: '[data-testid="post-date"], .post-date',
    likes: '[data-testid="post-likes"], .post-likes',
    comments: '[data-testid="post-comments"], .post-comments',
    views: '[data-testid="post-views"], .post-views',
    tags: '[data-testid="post-tags"], .post-tags .tag',
    likeButton: 'button[aria-label*="like" i]',
    bookmarkButton: 'button[aria-label*="bookmark" i]',
  },

  // Post detail page
  detail: {
    container: '[data-testid="post-detail"]',
    title: '[data-testid="post-title"]',
    content: '[data-testid="post-content"]',
    author: '[data-testid="post-author"]',
    date: '[data-testid="post-date"]',
    editButton: 'a[href*="/edit"], button:has-text("수정")',
    deleteButton: 'button:has-text("삭제"), button[aria-label*="delete" i]',
  },

  // Comments
  comments: {
    container: '[data-testid="comments-section"], .comments-section',
    list: '[data-testid="comments-list"], .comments-list',
    item: '[data-testid="comment"], .comment',
    author: '[data-testid="comment-author"], .comment-author',
    content: '[data-testid="comment-content"], .comment-content',
    date: '[data-testid="comment-date"], .comment-date',
    likes: '[data-testid="comment-likes"], .comment-likes',
    input: '[data-testid="comment-input"], textarea[name="comment"]',
    submitButton: 'button[type="submit"], button:has-text("댓글 작성")',
    replyButton: 'button:has-text("답글"), button:has-text("Reply")',
    editButton: 'button[aria-label*="edit comment" i]',
    deleteButton: 'button[aria-label*="delete comment" i]',
  },

  // Post form
  form: {
    container: 'form[data-testid="post-form"]',
    titleInput: 'input[name="title"], [data-testid="title-input"]',
    contentTextarea: 'textarea[name="content"], [data-testid="content-input"]',
    categorySelect: 'select[name="category"], [data-testid="category-select"]',
    citySelect: 'select[name="city"], [data-testid="city-select"]',
    tagsInput: 'input[name="tags"], [data-testid="tags-input"]',
    submitButton: 'button[type="submit"], button:has-text("게시")',
    saveDraftButton: 'button:has-text("임시 저장")',
  },
} as const;

// ===========================
// Meetups Selectors
// ===========================

export const meetupsSelectors = {
  // Meetups list page
  list: {
    container: '[data-testid="meetups-list"], .meetups-list',
    searchInput: 'input[name="search"], [data-testid="search-input"]',
    sortSelect: 'select[name="sort"], [data-testid="sort-select"]',
    cityFilter: 'select[name="city"], [data-testid="city-filter"]',
    statusFilter: 'select[name="status"], [data-testid="status-filter"]',
    createButton: 'a[href*="/meetups/create"], button:has-text("모임 만들기")',
    emptyState: '.empty-state, [data-testid="no-meetups"]',
  },

  // Meetup card
  card: {
    container: '[data-testid="meetup-card"], .meetup-card',
    title: '[data-testid="meetup-title"], .meetup-title',
    description: '[data-testid="meetup-description"], .meetup-description',
    date: '[data-testid="meetup-date"], .meetup-date',
    time: '[data-testid="meetup-time"], .meetup-time',
    location: '[data-testid="meetup-location"], .meetup-location',
    participants: '[data-testid="participants"], .participants',
    status: '[data-testid="status"], .status, .badge',
    tags: '[data-testid="tags"], .tags .tag',
  },

  // Meetup detail page
  detail: {
    container: '[data-testid="meetup-detail"]',
    title: '[data-testid="meetup-title"]',
    description: '[data-testid="meetup-description"]',
    date: '[data-testid="meetup-date"]',
    location: '[data-testid="meetup-location"]',
    joinButton: 'button:has-text("참가하기"), button:has-text("Join")',
    leaveButton: 'button:has-text("참가 취소"), button:has-text("Leave")',
    participantList: '[data-testid="participant-list"], .participant-list',
    organizer: '[data-testid="organizer"], .organizer',
  },

  // Meetup form
  form: {
    container: 'form[data-testid="meetup-form"]',
    titleInput: 'input[name="title"], [data-testid="title-input"]',
    descriptionTextarea: 'textarea[name="description"], [data-testid="description-input"]',
    dateInput: 'input[type="date"], input[name="date"]',
    timeInput: 'input[type="time"], input[name="time"]',
    locationInput: 'input[name="location"], [data-testid="location-input"]',
    citySelect: 'select[name="city"], [data-testid="city-select"]',
    maxParticipantsInput: 'input[name="max_participants"]',
    submitButton: 'button[type="submit"], button:has-text("만들기")',
  },
} as const;

// ===========================
// Profile Selectors
// ===========================

export const profileSelectors = {
  // Profile page
  page: {
    container: '[data-testid="profile-page"], .profile-page',
    avatar: '[data-testid="profile-avatar"], .profile-avatar img',
    name: '[data-testid="profile-name"], .profile-name',
    username: '[data-testid="profile-username"], .profile-username',
    bio: '[data-testid="profile-bio"], .profile-bio',
    location: '[data-testid="profile-location"], .profile-location',
    website: '[data-testid="profile-website"], .profile-website a',
    joinedDate: '[data-testid="joined-date"], .joined-date',
    editButton: 'button:has-text("프로필 편집"), a[href*="/edit"]',
    followButton: 'button:has-text("팔로우"), button:has-text("Follow")',
    messageButton: 'button:has-text("메시지"), button:has-text("Message")',
  },

  // Stats section
  stats: {
    container: '[data-testid="profile-stats"], .profile-stats',
    postsCount: '[data-testid="posts-count"], .stat-item:has-text("Posts")',
    meetupsCount: '[data-testid="meetups-count"], .stat-item:has-text("Meetups")',
    followersCount: '[data-testid="followers-count"], .stat-item:has-text("Followers")',
    followingCount: '[data-testid="following-count"], .stat-item:has-text("Following")',
  },

  // Profile tabs
  tabs: {
    container: '[data-testid="profile-tabs"], .profile-tabs',
    posts: 'button:has-text("게시글"), button:has-text("Posts"), [data-tab="posts"]',
    meetups: 'button:has-text("모임"), button:has-text("Meetups"), [data-tab="meetups"]',
    likes: 'button:has-text("좋아요"), button:has-text("Likes"), [data-tab="likes"]',
    about: 'button:has-text("소개"), button:has-text("About"), [data-tab="about"]',
  },

  // Profile edit form
  edit: {
    container: 'form[data-testid="profile-edit-form"]',
    avatarContainer: '[data-testid="avatar-container"]',
    avatarUpload: 'input[type="file"][accept*="image"]',
    fullNameInput: 'input[name="full_name"], [data-testid="full-name-input"]',
    usernameInput: 'input[name="username"], [data-testid="username-input"]',
    bioTextarea: 'textarea[name="bio"], [data-testid="bio-input"]',
    locationInput: 'input[name="location"], [data-testid="location-input"]',
    websiteInput: 'input[name="website"], [data-testid="website-input"]',
    saveButton: 'button[type="submit"], button:has-text("저장")',
  },

  // Avatar upload component
  avatarUpload: {
    container: '[data-testid="avatar-upload"], .avatar-upload-container',
    image: '[data-testid="avatar-image"], .avatar-image img',
    uploadButton: 'button[aria-label*="upload" i]',
    removeButton: 'button[aria-label*="remove" i]',
    previewModal: '[data-testid="avatar-preview-modal"]',
    rotateButton: 'button[aria-label*="rotate" i]',
    zoomSlider: 'input[type="range"]',
  },
} as const;

// ===========================
// Cities Selectors
// ===========================

export const citiesSelectors = {
  // Cities list page
  list: {
    container: '[data-testid="cities-list"], .cities-list',
    searchInput: 'input[name="search"], [data-testid="search-input"]',
    sortSelect: 'select[name="sort"], [data-testid="sort-select"]',
    regionFilter: 'select[name="region"], [data-testid="region-filter"]',
    emptyState: '.empty-state, [data-testid="no-cities"]',
  },

  // City card
  card: {
    container: '[data-testid="city-card"], .city-card',
    name: '[data-testid="city-name"], .city-name',
    region: '[data-testid="city-region"], .city-region',
    rating: '[data-testid="city-rating"], .city-rating',
    image: '[data-testid="city-image"], .city-image img',
    nomadsCount: '[data-testid="nomads-count"], .nomads-count',
  },

  // City detail page
  detail: {
    container: '[data-testid="city-detail"], .city-detail',
    name: '[data-testid="city-name"]',
    description: '[data-testid="city-description"]',
    rating: '[data-testid="city-rating"]',
    stats: '[data-testid="city-stats"], .city-stats',
  },
} as const;

// ===========================
// Accessibility Selectors
// ===========================

export const a11ySelectors = {
  // ARIA attributes
  aria: {
    label: '[aria-label]',
    labelledby: '[aria-labelledby]',
    describedby: '[aria-describedby]',
    hidden: '[aria-hidden="true"]',
    expanded: '[aria-expanded]',
    checked: '[aria-checked]',
    pressed: '[aria-pressed]',
  },

  // Focus
  focus: {
    visible: ':focus-visible',
    tabbable: ':tabbable',
  },

  // Semantic elements
  semantic: {
    main: 'main',
    nav: 'nav',
    header: 'header',
    footer: 'footer',
    article: 'article',
    section: 'section',
    aside: 'aside',
  },

  // Images
  images: {
    withoutAlt: 'img:not([alt])',
    withEmptyAlt: 'img[alt=""]',
  },

  // Forms
  forms: {
    withoutLabel: 'input:not([aria-label]):not([id])',
    withLabel: 'input[aria-label], input[id]',
  },
} as const;

// ===========================
// Utility Functions
// ===========================

/**
 * Combine multiple selectors with OR logic
 */
export function combineSelectors(...selectors: string[]): string {
  return selectors.join(', ');
}

/**
 * Create a selector with data-testid attribute
 */
export function byTestId(id: string): string {
  return `[data-testid="${id}"]`;
}

/**
 * Create a selector by text content
 */
export function byText(text: string, exact: boolean = false): string {
  return exact ? `text="${text}"` : `text=${text}`;
}

/**
 * Create a selector by role
 */
export function byRole(role: string, name?: string): string {
  return name
    ? `[role="${role}"][aria-label="${name}"]`
    : `[role="${role}"]`;
}

/**
 * Create a selector by placeholder
 */
export function byPlaceholder(text: string): string {
  return `[placeholder*="${text}"]`;
}

/**
 * Type-safe selector builder
 */
export class SelectorBuilder {
  private parts: string[] = [];

  add(selector: string): this {
    this.parts.push(selector);
    return this;
  }

  addTestId(id: string): this {
    return this.add(byTestId(id));
  }

  addClass(className: string): this {
    return this.add(`.${className}`);
  }

  addId(id: string): this {
    return this.add(`#${id}`);
  }

  addAttribute(attr: string, value: string): this {
    return this.add(`[${attr}="${value}"]`);
  }

  build(): string {
    return this.parts.join(' ');
  }

  buildOr(...alternatives: string[]): string {
    return [this.build(), ...alternatives].join(', ');
  }
}

/**
 * Helper to create a selector builder
 */
export function selector(): SelectorBuilder {
  return new SelectorBuilder();
}

// ===========================
// Data Attributes
// ===========================

/**
 * Get a data attribute selector
 */
export const dataAttr = {
  test: (id: string) => `[data-testid="${id}"]`,
  state: (state: string) => `[data-state="${state}"]`,
  loading: () => `[data-loading="true"]`,
  disabled: () => `[data-disabled="true"]`,
  value: (value: string) => `[data-value="${value}"]`,
};
