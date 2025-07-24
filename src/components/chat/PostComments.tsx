
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ForumComment } from '@/types/chat';

interface PostCommentsProps {
  postId: string;
  comments: ForumComment[];
  onAddComment: (postId: string, content: string) => void;
  isAddingComment?: boolean;
}

const PostComments: React.FC<PostCommentsProps> = ({
  postId,
  comments,
  onAddComment,
  isAddingComment = false
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(postId, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="border-t border-gray-100">
      {comments.length > 0 && (
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 hover:text-blue-500"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {showComments ? 'Hide' : 'Show'} {comments.length} comments
          </Button>
        </div>
      )}

      {showComments && (
        <div className="px-4 py-2 space-y-3 bg-gray-50">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={comment.author_profile?.avatar_url} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                  {comment.author_profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-white rounded-lg px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {comment.author_profile?.full_name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {user && (
        <form onSubmit={handleSubmitComment} className="px-4 py-3 bg-gray-50">
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-orange-100 text-orange-600">
                {user.email?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || isAddingComment}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isAddingComment ? 'Posting...' : 'Comment'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostComments;
