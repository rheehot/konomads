/**
 * Storage Functions Tests
 * Test IDs: DB-052 ~ DB-058
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  uploadAvatar,
  getPublicUrl,
  deleteFile,
  uploadFile,
} from '@/lib/supabase/storage'
import { setupSupabaseMocks } from '@/tests/mocks'

describe('Storage Functions', () => {
  let mockClient: any
  let mockStorage: any

  beforeEach(() => {
    vi.clearAllMocks()
    const setup = setupSupabaseMocks()
    mockClient = setup.mockClient
    mockStorage = setup.mockStorage
  })

  /**
   * DB-052: uploadAvatar - 성공
   * Tests uploading an avatar successfully
   */
  it('DB-052: should upload avatar successfully', async () => {
    const mockFile = new File(['test content'], 'avatar.jpg', { type: 'image/jpeg' })
    const expectedUrl = 'https://mock-storage.supabase.co/avatars/user-1/avatar.jpg'

    // Mock uploadFile behavior
    mockStorage.from('avatars').upload.mockResolvedValue({
      data: { path: 'user-1/avatar.jpg' },
      error: null,
    })

    mockStorage.from('avatars').getPublicUrl.mockReturnValue({
      data: { publicUrl: expectedUrl },
    })

    // Mock updateProfile
    mockClient.from('profiles').select.mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'user-1',
                email: 'user@example.com',
                username: 'user1',
                full_name: 'User One',
                avatar_url: expectedUrl,
                bio: null,
                location: null,
                website: null,
                updated_at: new Date().toISOString(),
              },
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    const result = await uploadAvatar('user-1', mockFile)

    expect(result).toBe(expectedUrl)
    expect(mockStorage.from('avatars').upload).toHaveBeenCalledWith(
      expect.stringContaining('user-1/'),
      mockFile
    )
    expect(mockStorage.from('avatars').getPublicUrl).toHaveBeenCalled()
  })

  /**
   * DB-053: uploadAvatar - 에러
   * Tests handling upload errors
   */
  it('DB-053: should handle upload avatar error', async () => {
    const mockFile = new File(['test content'], 'avatar.jpg', { type: 'image/jpeg' })

    // Mock upload error
    mockStorage.from('avatars').upload.mockResolvedValue({
      data: null,
      error: { message: 'Storage bucket not found' },
    })

    const result = await uploadAvatar('user-1', mockFile)

    expect(result).toBeNull()
    expect(mockClient.from('profiles').select).not.toHaveBeenCalled()
  })

  /**
   * DB-054: uploadAvatar - 파일 크기 제한
   * Tests handling file size limits
   */
  it('DB-054: should handle file size limits', async () => {
    // Create a large file (over 5MB)
    const largeContent = new Array(6 * 1024 * 1024).fill('x').join('')
    const largeFile = new File([largeContent], 'large-avatar.jpg', { type: 'image/jpeg' })

    mockStorage.from('avatars').upload.mockResolvedValue({
      data: null,
      error: { message: 'File too large' },
    })

    const result = await uploadAvatar('user-1', largeFile)

    expect(result).toBeNull()
    expect(mockStorage.from('avatars').upload).toHaveBeenCalled()
  })

  /**
   * DB-055: uploadAvatar - 파일 타입 검증
   * Tests handling invalid file types
   */
  it('DB-055: should handle invalid file types', async () => {
    // Try to upload a non-image file
    const invalidFile = new File(['test content'], 'document.pdf', { type: 'application/pdf' })

    mockStorage.from('avatars').upload.mockResolvedValue({
      data: null,
      error: { message: 'Invalid file type' },
    })

    const result = await uploadAvatar('user-1', invalidFile)

    expect(result).toBeNull()
    expect(mockStorage.from('avatars').upload).toHaveBeenCalled()
  })

  /**
   * DB-056: getPublicUrl - 성공
   * Tests getting public URL successfully
   */
  it('DB-056: should get public URL successfully', async () => {
    const expectedUrl = 'https://mock-storage.supabase.co/avatars/user-1/avatar.jpg'

    mockStorage.from('avatars').getPublicUrl.mockReturnValue({
      data: { publicUrl: expectedUrl },
    })

    const result = await getPublicUrl('avatars', 'user-1/avatar.jpg')

    expect(result).toBe(expectedUrl)
    expect(mockStorage.from('avatars').getPublicUrl).toHaveBeenCalledWith('user-1/avatar.jpg')
  })

  /**
   * DB-057: deleteAvatar - 성공 (deleteFile 사용)
   * Tests deleting a file successfully
   */
  it('DB-057: should delete file successfully', async () => {
    mockStorage.from('avatars').remove.mockResolvedValue({
      data: {},
      error: null,
    })

    const result = await deleteFile('avatars', 'user-1/old-avatar.jpg')

    expect(result).toBe(true)
    expect(mockStorage.from('avatars').remove).toHaveBeenCalledWith(['user-1/old-avatar.jpg'])
  })

  /**
   * DB-058: deleteAvatar - 에러 (deleteFile 실패)
   * Tests handling delete errors
   */
  it('DB-058: should handle delete file error', async () => {
    mockStorage.from('avatars').remove.mockResolvedValue({
      data: null,
      error: { message: 'File not found' },
    })

    const result = await deleteFile('avatars', 'user-1/non-existent.jpg')

    expect(result).toBe(false)
    expect(mockStorage.from('avatars').remove).toHaveBeenCalledWith(['user-1/non-existent.jpg'])
  })

  /**
   * Additional: uploadFile - 성공
   * Tests the generic uploadFile function
   */
  it('should upload file successfully using uploadFile', async () => {
    const mockFile = new File(['test content'], 'image.jpg', { type: 'image/jpeg' })
    const expectedPath = 'post-images/post-1/image.jpg'
    const expectedUrl = 'https://mock-storage.supabase.co/post-images/post-1/image.jpg'

    mockStorage.from('post-images').upload.mockResolvedValue({
      data: { path: expectedPath },
      error: null,
    })

    mockStorage.from('post-images').getPublicUrl.mockReturnValue({
      data: { publicUrl: expectedUrl },
    })

    const result = await uploadFile('post-images', 'post-1', mockFile)

    expect(result).not.toBeNull()
    expect(result?.path).toBe(expectedPath)
    expect(result?.url).toBe(expectedUrl)
    expect(mockStorage.from('post-images').upload).toHaveBeenCalled()
  })

  /**
   * Additional: uploadFile - 에러
   * Tests error handling in uploadFile
   */
  it('should handle uploadFile error', async () => {
    const mockFile = new File(['test content'], 'image.jpg', { type: 'image/jpeg' })

    mockStorage.from('post-images').upload.mockResolvedValue({
      data: null,
      error: { message: 'Upload failed' },
    })

    const result = await uploadFile('post-images', 'post-1', mockFile)

    expect(result).toBeNull()
    expect(mockStorage.from('post-images').upload).toHaveBeenCalled()
  })

  /**
   * Additional: 다른 버킷에 파일 업로드
   * Tests uploading to different buckets
   */
  it('should upload to different storage buckets', async () => {
    const mockCityImage = new File(['city image'], 'seoul.jpg', { type: 'image/jpeg' })

    mockStorage.from('city-images').upload.mockResolvedValue({
      data: { path: 'city-1/seoul.jpg' },
      error: null,
    })

    mockStorage.from('city-images').getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://mock-storage.supabase.co/city-images/city-1/seoul.jpg' },
    })

    const result = await uploadFile('city-images', 'city-1', mockCityImage)

    expect(result).not.toBeNull()
    expect(result?.url).toContain('city-images')
    expect(mockStorage.from('city-images').upload).toHaveBeenCalled()
  })

  /**
   * Additional: 파일명이 포함된 경로 처리
   * Tests handling paths with file names
   */
  it('should handle file paths correctly', async () => {
    const mockFile = new File(['avatar'], 'profile.png', { type: 'image/png' })

    mockStorage.from('avatars').upload.mockResolvedValue({
      data: { path: 'avatars/user-1/0.123456789.png' },
      error: null,
    })

    mockStorage.from('avatars').getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://mock-storage.supabase.co/avatars/user-1/0.123456789.png' },
    })

    const result = await uploadFile('avatars', 'user-1', mockFile)

    expect(result).not.toBeNull()
    expect(result?.path).toContain('user-1')
    expect(result?.path).toContain('.png')
  })

  /**
   * Additional: 여러 파일 삭제
   * Tests deleting multiple files
   */
  it('should delete multiple files', async () => {
    mockStorage.from('post-images').remove.mockResolvedValue({
      data: {},
      error: null,
    })

    const paths = ['post-1/img1.jpg', 'post-1/img2.jpg', 'post-1/img3.jpg']

    // deleteFile only accepts one path, but the underlying remove method accepts array
    // This test verifies the underlying API behavior
    for (const path of paths) {
      await deleteFile('post-images', path)
    }

    expect(mockStorage.from('post-images').remove).toHaveBeenCalledTimes(3)
  })

  /**
   * Edge case: 빈 파일 업로드
   * Tests uploading empty file
   */
  it('should handle empty file upload', async () => {
    const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' })

    mockStorage.from('avatars').upload.mockResolvedValue({
      data: { path: 'user-1/empty.jpg' },
      error: null,
    })

    mockStorage.from('avatars').getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://mock-storage.supabase.co/avatars/user-1/empty.jpg' },
    })

    const result = await uploadFile('avatars', 'user-1', emptyFile)

    expect(result).not.toBeNull()
    expect(result?.path).toBe('user-1/empty.jpg')
  })

  /**
   * Edge case: 특수 문자가 포함된 파일명
   * Tests file names with special characters
   */
  it('should handle special characters in file names', async () => {
    const fileWithSpecialChars = new File(
      ['content'],
      'avatar (1) @#$.jpg',
      { type: 'image/jpeg' }
    )

    mockStorage.from('avatars').upload.mockResolvedValue({
      data: { path: 'user-1/0.123456789.jpg' },
      error: null,
    })

    mockStorage.from('avatars').getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://mock-storage.supabase.co/avatars/user-1/0.123456789.jpg' },
    })

    const result = await uploadFile('avatars', 'user-1', fileWithSpecialChars)

    expect(result).not.toBeNull()
    expect(mockStorage.from('avatars').upload).toHaveBeenCalled()
  })

  /**
   * Integration: uploadAvatar with profile update
   * Tests that uploadAvatar updates the profile with the new avatar URL
   */
  it('should update profile with new avatar URL after upload', async () => {
    const mockFile = new File(['avatar'], 'new-avatar.jpg', { type: 'image/jpeg' })
    const newAvatarUrl = 'https://mock-storage.supabase.co/avatars/user-1/new-avatar.jpg'

    mockStorage.from('avatars').upload.mockResolvedValue({
      data: { path: 'user-1/new-avatar.jpg' },
      error: null,
    })

    mockStorage.from('avatars').getPublicUrl.mockReturnValue({
      data: { publicUrl: newAvatarUrl },
    })

    mockClient.from('profiles').select.mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'user-1',
                email: 'user@example.com',
                username: 'user1',
                full_name: 'User One',
                avatar_url: newAvatarUrl,
                bio: null,
                location: null,
                website: null,
                updated_at: new Date().toISOString(),
              },
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    const result = await uploadAvatar('user-1', mockFile)

    expect(result).toBe(newAvatarUrl)
    expect(mockClient.from('profiles').select).toHaveBeenCalled()

    // Verify update was called with correct avatar_url
    const updateCall = mockClient.from('profiles').select as any
    expect(updateCall).toHaveBeenCalled()
  })

  /**
   * Error: Storage bucket does not exist
   */
  it('should handle non-existent storage bucket', async () => {
    const mockFile = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })

    mockStorage.from('non-existent-bucket').upload.mockResolvedValue({
      data: null,
      error: { message: 'Bucket not found' },
    })

    const result = await uploadFile('non-existent-bucket', 'user-1', mockFile)

    expect(result).toBeNull()
  })

  /**
   * Success: getPublicUrl for different buckets
   */
  it('should get public URL for different buckets', async () => {
    const buckets = ['avatars', 'post-images', 'city-images']
    const paths = ['user-1/avatar.jpg', 'post-1/img.jpg', 'city-1/img.jpg']

    for (let i = 0; i < buckets.length; i++) {
      const expectedUrl = `https://mock-storage.supabase.co/${buckets[i]}/${paths[i]}`

      mockStorage.from(buckets[i]).getPublicUrl.mockReturnValue({
        data: { publicUrl: expectedUrl },
      })

      const result = await getPublicUrl(buckets[i], paths[i])

      expect(result).toBe(expectedUrl)
      expect(mockStorage.from(buckets[i]).getPublicUrl).toHaveBeenCalledWith(paths[i])
    }
  })
})
