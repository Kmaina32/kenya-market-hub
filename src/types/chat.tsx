/**
 * src/types/chat.ts
 *
 * Defines TypeScript interfaces for the chat forum entities:
 * Forum, ForumPost, ForumComment, and a basic UserProfile for authors.
 * These types ensure consistency and type safety across the application
 * when interacting with chat-related data from Supabase.
 */

// Basic UserProfile interface for associating posts/comments with users
// This should ideally align with your 'users' table or a derived profile view.
export interface UserProfile {
  id: string; // User's UUID
  username?: string | null; // Display name for the user
  avatar_url?: string | null; // Optional: URL to user's avatar
  // Add other relevant user fields if necessary (e.g., 'email' if displayed)
}

// Interface for a Forum (e.g., "General Discussion", "Tech Support")
export interface Forum {
  id: string; // UUID of the forum
  name: string; // Name of the forum (e.g., "General Discussion")
  description: string; // Description of the forum
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  created_by?: string; // UUID of the user who created the forum (optional, if admin-created)
  post_count?: number; // Optional: Denormalized count of posts in this forum
  last_post_at?: string | null; // Optional: Timestamp of the last post in this forum
}

// Interface for a Forum Post (a main topic or thread within a forum)
export interface ForumPost {
  id: string; // UUID of the post
  forum_id: string; // UUID of the forum this post belongs to
  user_id: string; // UUID of the user who created the post
  title: string; // Title of the post/thread
  content: string; // Main content/body of the post
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  views_count: number; // Number of times this post has been viewed
  comment_count: number; // Number of comments/replies on this post
  last_comment_at?: string | null; // Timestamp of the most recent comment
  // Optional: Embed user profile directly if fetched with the post
  author?: UserProfile;
}

// Interface for a Forum Comment (a reply to a post or another comment)
export interface ForumComment {
  id: string; // UUID of the comment
  post_id: string; // UUID of the forum post this comment belongs to
  user_id: string; // UUID of the user who created the comment
  content: string; // Content of the comment
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  parent_comment_id?: string | null; // Optional: For nested replies, UUID of the parent comment
  // Optional: Embed user profile directly if fetched with the comment
  author?: UserProfile;
}
