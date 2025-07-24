
export interface Forum {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  post_count: number;
  member_count: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  forum_id?: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  image_url?: string;
  author_profile?: {
    full_name: string;
    avatar_url?: string;
  };
  category?: {
    name: string;
    color?: string;
  };
  has_liked?: boolean;
}

export interface ForumComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_comment_id?: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  author_profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type?: string;
  created_at: string;
  edited_at?: string;
  is_read: boolean;
  reply_to_message_id?: string;
}

export interface ChatConversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
  participant1?: {
    full_name: string;
    avatar_url?: string;
  };
  participant2?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  post_count: number;
  member_count: number;
  created_at: string;
  color?: string;
}

export interface UserSearchResult {
  id: string;
  full_name: string;
  avatar_url?: string;
  email: string;
}
