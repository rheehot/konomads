/**
 * Data Helpers for E2E Testing
 *
 * Provides helper functions to generate random test data
 * for use in automated tests.
 */

// ===========================
// String Generators
// ===========================

/**
 * Generate a random string of specified length
 */
export function randomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random alphanumeric string
 */
export function randomAlphanumeric(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random email address
 */
export function randomEmail(domain: string = 'example.com'): string {
  return `test-${randomString(8).toLowerCase()}@${domain}`;
}

/**
 * Generate a random username
 */
export function randomUsername(): string {
  const adjectives = ['happy', 'brave', 'calm', 'eager', 'gentle', 'kind', 'lively', 'proud', 'wise', 'bold'];
  const nouns = ['nomad', 'traveler', 'explorer', 'wanderer', 'adventurer', 'seeker', 'pioneer', 'voyager'];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);

  return `${adjective}${noun}${number}`;
}

/**
 * Generate a random password
 */
export function randomPassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*';

  let password = '';
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  const allChars = lowercase + uppercase + numbers + special;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// ===========================
// Number Generators
// ===========================

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max
 */
export function randomFloat(min: number, max: number, decimals: number = 2): number {
  const num = Math.random() * (max - min) + min;
  return Number(num.toFixed(decimals));
}

/**
 * Generate a random phone number (Korean format)
 */
export function randomPhoneNumber(): string {
  const areaCodes = ['010', '011', '016', '017', '018', '019'];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const middle = randomInt(1000, 9999).toString();
  const last = randomInt(1000, 9999).toString();
  return `${areaCode}-${middle}-${last}`;
}

// ===========================
// Date Generators
// ===========================

/**
 * Generate a random date within a range
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random future date
 */
export function randomFutureDate(daysFromNow: number = 30): Date {
  const now = new Date();
  const future = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
  return randomDate(now, future);
}

/**
 * Generate a random past date
 */
export function randomPastDate(daysAgo: number = 30): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return randomDate(past, now);
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format time for input fields (HH:MM)
 */
export function formatTimeForInput(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format date as ISO string
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}

// ===========================
// Location Generators
// ===========================

/**
 * Korean cities for testing
 */
export const KOREAN_CITIES = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '수원', '창원', '성남', '청주', '수원', '용인', '고양',
  '안산', '남양주', '전주', '천안', '안양'
];

/**
 * Korean regions
 */
export const KOREAN_REGIONS = [
  '수도권', '경상도', '전라도', '충청도', '강원도', '제주도'
];

/**
 * Generate a random Korean city
 */
export function randomKoreanCity(): string {
  return KOREAN_CITIES[Math.floor(Math.random() * KOREAN_CITIES.length)];
}

/**
 * Generate a random Korean region
 */
export function randomKoreanRegion(): string {
  return KOREAN_REGIONS[Math.floor(Math.random() * KOREAN_REGIONS.length)];
}

/**
 * Generate a random address
 */
export function randomAddress(): string {
  const gu = ['강남구', '서초구', '송파구', '마포구', '영등포구', '종로구', '용산구'];
  const street = randomInt(1, 100);
  const building = randomInt(1, 50);
  return `서울시 ${gu[Math.floor(Math.random() * gu.length)]} ${street}로 ${building}길`;
}

// ===========================
// Text Generators
// ===========================

/**
 * Generate random paragraph text
 */
export function randomParagraph(sentences: number = 5): string {
  const sentenceStarters = [
    '이것은', '그것은', '노마드를 위한', '디지털 노마드가',
    '원격 근무를 하는', '새로운 도시에서', '코워킹 스페이스에서',
    '카페에서 일하는', '여행하는', '삶을 즐기는'
  ];

  const middles = [
    '정말 멋진 경험입니다', '훌륭한 기회입니다', '재미있는 모험입니다',
    '새로운 발견입니다', '가치 있는 시간입니다', '놀라운 경험입니다',
    '즐거운 활동입니다', '유익한 경험입니다', '특별한 순간입니다'
  ];

  const paragraphs: string[] = [];

  for (let i = 0; i < sentences; i++) {
    const starter = sentenceStarters[Math.floor(Math.random() * sentenceStarters.length)];
    const middle = middles[Math.floor(Math.random() * middles.length)];
    const end = Math.random() > 0.5 ? '추천합니다!' : '입니다.';
    paragraphs.push(`${starter} ${middle}${end}`);
  }

  return paragraphs.join(' ');
}

/**
 * Generate random title text
 */
export function randomTitle(): string {
  const topics = ['노마드 생활', '원격 근무', '코워킹 스페이스', '디지털 노마드', '위드 노마드'];
  const actions = ['가이드', '팁', '추천', '후기', '정보'];
  const locations = ['서울에서', '부산에서', '제주에서', '전국'];

  const topic = topics[Math.floor(Math.random() * topics.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];

  if (Math.random() > 0.5) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    return `${location} ${topic} ${action}`;
  }

  return `${topic} ${action}`;
}

/**
 * Generate random bio text
 */
export function randomBio(): string {
  const bios = [
    '디지털 노마드로서 세계 각지를 여행하며 일하고 있습니다.',
    '원격 근무를 하며 새로운 장소를 탐험하는 것을 좋아합니다.',
    '자유로운 삶을 꿈꾸는 노마드입니다.',
    '카페와 코워킹 스페이스를 전전하며 일하고 있습니다.',
    '워케이션과 노마드 라이프스타일을 사랑합니다.',
    '기술과 여행을 결합한 삶을 살고 있습니다.',
  ];

  return bios[Math.floor(Math.random() * bios.length)];
}

// ===========================
// User Data Generators
// ===========================

/**
 * Generate random user data for registration
 */
export function randomUserData() {
  const password = randomPassword();
  return {
    email: randomEmail(),
    username: randomUsername(),
    password: password,
    confirmPassword: password,
    fullName: randomKoreanName(),
    bio: randomBio(),
  };
}

/**
 * Generate a random Korean name
 */
export function randomKoreanName(): string {
  const surnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
  const givenNames = ['민수', '서연', '도현', '예진', '준우', '지우', '하은', '시우', '주원', '지호'];

  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];

  return `${surname}${givenName}`;
}

/**
 * Generate random profile data
 */
export function randomProfileData() {
  return {
    full_name: randomKoreanName(),
    username: randomUsername(),
    bio: randomBio(),
    location: randomKoreanCity(),
    website: `https://${randomString(8).toLowerCase()}.com`,
  };
}

// ===========================
// Post Data Generators
// ===========================

/**
 * Post categories
 */
export const POST_CATEGORIES = [
  '질문', '정보', '자유', '홍보', '구인', '모임', '후기', '팁'
];

/**
 * Generate random post data
 */
export function randomPostData(overrides?: Partial<any>): any {
  const category = POST_CATEGORIES[Math.floor(Math.random() * POST_CATEGORIES.length)];

  return {
    title: randomTitle(),
    content: randomParagraph(randomInt(3, 8)),
    category: category,
    tags: randomTags(randomInt(1, 5)),
    city_id: undefined, // Should be set by test
    ...overrides,
  };
}

/**
 * Generate random tags
 */
export function randomTags(count: number = 3): string[] {
  const tagPool = [
    '원격근무', '노마드', '코워킹', '디지털노마드', '워케이션',
    '카페', '여행', '프리랜서', '스타트업', '개발자',
    '디자이너', '마케터', '라이프스타일', '힐링', '추천'
  ];

  const shuffled = tagPool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ===========================
// Meetup Data Generators
// ===========================

/**
 * Meetup statuses
 */
export const MEETUP_STATUSES = [
  'open', 'full', 'closed', 'cancelled'
];

/**
 * Generate random meetup data
 */
export function randomMeetupData(overrides?: Partial<any>): any {
  const futureDate = randomFutureDate(randomInt(7, 90));
  const futureDatePlus2Hours = new Date(futureDate.getTime() + 2 * 60 * 60 * 1000);

  return {
    title: `${randomKoreanCity()} ${randomKoreanCity()} 노마드 모임`,
    description: randomParagraph(randomInt(5, 10)),
    location: randomAddress(),
    meetup_date: formatDateISO(futureDate),
    max_participants: randomInt(5, 50),
    status: 'open',
    tags: randomTags(randomInt(2, 4)),
    city_id: undefined, // Should be set by test
    ...overrides,
  };
}

// ===========================
// Comment Data Generators
// ===========================

/**
 * Generate random comment data
 */
export function randomCommentData(): any {
  return {
    content: randomParagraph(randomInt(1, 3)),
  };
}

// ===========================
// URL Generators
// ===========================

/**
 * Generate a random URL
 */
export function randomUrl(protocol: 'http' | 'https' = 'https'): string {
  const domains = ['example.com', 'test.com', 'demo.com', 'sample.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const path = randomInt(0, 1) > 0 ? `/${randomString(8).toLowerCase()}` : '';
  return `${protocol}://${domain}${path}`;
}

/**
 * Generate social media URLs
 */
export function randomSocialUrls(username: string) {
  return {
    github: `https://github.com/${username}`,
    linkedin: `https://linkedin.com/in/${username}`,
    twitter: `https://twitter.com/${username}`,
    instagram: `https://instagram.com/${username}`,
  };
}

// ===========================
// Selection Helpers
// ===========================

/**
 * Select a random item from an array
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Select multiple random items from an array
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generate a random boolean
 */
export function randomBoolean(chance: number = 0.5): boolean {
  return Math.random() < chance;
}

// ===========================
// Test Data Sets
// ===========================

/**
 * Generate a complete test user with posts and meetups
 */
export async function generateCompleteTestData() {
  const userData = randomUserData();
  const username = userData.username;

  return {
    user: userData,
    profile: {
      ...randomProfileData(),
      username: username,
    },
    posts: Array.from({ length: randomInt(2, 5) }, () =>
      randomPostData({ tags: randomTags(randomInt(2, 4)) })
    ),
    meetups: Array.from({ length: randomInt(1, 3) }, () =>
      randomMeetupData()
    ),
    socialUrls: randomSocialUrls(username),
  };
}

/**
 * Generate invalid data for negative testing
 */
export const invalidTestData = {
  email: [
    'invalid-email',
    '@example.com',
    'user@',
    'user @example.com',
    '',
  ],
  password: [
    'short',
    'nouppercase123!',
    'NOLOWERCASE123!',
    'nospecial123',
    '',
  ],
  username: [
    '',
    'ab', // too short
    'a'.repeat(50), // too long
    'user with spaces',
    'user@special',
  ],
  url: [
    'not-a-url',
    'http://',
    'https://',
    '',
  ],
};
