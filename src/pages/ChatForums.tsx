
import React from 'react';
import MainLayout from '@/components/MainLayout';
import SocialMediaChatInterface from '@/components/chat/SocialMediaChatInterface';

function ChatForums() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <SocialMediaChatInterface />
      </div>
    </MainLayout>
  );
}

export default ChatForums;
