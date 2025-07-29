
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useForumComments } from '@/hooks/useForumComments';

interface PostCommentsProps {
  postId: string;
  onAddComment: (postId: string, content: string) => void;
  isAddingComment?: boolean;
}

const PostComments: React.FC<PostCommentsProps> = ({
  postId,
  onAddComment,
  isAddingComment = false
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { data: comments } = useForumComments(postId);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(postId, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="border-t border-gray-100">
      {comments && comments.length > 0 && (
        <div className="px-3 sm:px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 hover:text-blue-500 text-xs sm:text-sm"
          >
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {showComments ? 'Hide' : 'Show'} {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}

      {showComments && comments && comments.length > 0 && (
        <div className="px-3 sm:px-4 py-2 space-y-3 bg-gray-50">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2 sm:space-x-3">
              <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                <AvatarImage src={comment.author_profile?.avatar_url} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                  {comment.author_profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg px-3 py-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                    {comment.author_profile?.full_name || 'Anonymous'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-800 mt-1">{comment.content}</p>
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
        <form onSubmit={handleSubmitComment} className="px-3 sm:px-4 py-3 bg-gray-50">
          <div className="flex space-x-2 sm:space-x-3">
            <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                {user.email?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[50px] sm:min-h-[60px] resize-none text-xs sm:text-sm"
              />
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || isAddingComment}
                  className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
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
