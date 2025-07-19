// In src/pages/ChatForums.tsx
import React from 'react';
import MainLayout from '@/components/MainLayout';
import ComprehensiveChatForums from '@/components/chat/ComprehensiveChatForums';

function ChatForums() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <ComprehensiveChatForums />
      </div>
    </MainLayout>
  );
}

export default ChatForums;