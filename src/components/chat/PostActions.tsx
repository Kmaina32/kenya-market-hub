
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Bookmark, Trash2, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ForumPost } from '@/types/chat';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostActionsProps {
  post: ForumPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (post: ForumPost) => void;
  onBookmark: (postId: string) => void;
  onDelete?: (postId: string) => void;
  isLiking?: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onDelete,
  isLiking = false
}) => {
  const { user } = useAuth();
  const isAuthor = user?.id === post.author_id;

  return (
    <div className="border-t border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            disabled={isLiking}
            className={`text-gray-500 hover:text-red-500 hover:bg-red-50 px-2 sm:px-3 ${
              post.has_liked ? 'text-red-500 bg-red-50' : ''
            }`}
          >
            <Heart className={`h-4 w-4 mr-1 sm:mr-2 ${post.has_liked ? 'fill-current' : ''}`} />
            <span className="text-xs sm:text-sm font-medium">{post.like_count}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComment(post.id)}
            className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-2 sm:px-3"
          >
            <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium">{post.reply_count}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(post)}
            className="text-gray-500 hover:text-green-500 hover:bg-green-50 px-2 sm:px-3"
          >
            <Share2 className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Share</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(post.id)}
            className="text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 p-2"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          
          {isAuthor && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={() => onDelete(post.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostActions;
