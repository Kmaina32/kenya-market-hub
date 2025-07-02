import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import MainLayout from '@/components/MainLayout';
import { MessageCircle, Users, Globe } from 'lucide-react'; // Consider using these icons with better alignment
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI Button
import { Input } from '@/components/ui/input'; // Assuming Shadcn UI Input
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Shadcn UI Card

// Lazy load components for performance
const ImprovedForumsList = lazy(() => import('@/components/chat/ImprovedForumsList'));
const ChatInterface = lazy(() => import('@/components/chat/ChatInterface'));

// ---
// Business Directory Data (consider moving to a global state or API)
// ---
interface Business {
  id: string; // Use string for more flexible IDs (e.g., UUIDs)
  name: string;
  category: string;
  rating: number;
  verified: boolean;
  contact?: string; // Add more relevant fields
  address?: string;
}

const MOCK_BUSINESS_DIRECTORY: Business[] = [
  { id: '1', name: "Nairobi Electronics", category: "Electronics", rating: 4.5, verified: true, contact: "0712345678", address: "Tech Hub, Nairobi" },
  { id: '2', name: "Mombasa Foods", category: "Food & Beverage", rating: 4.8, verified: true, contact: "0723456789", address: "Coastal Bites, Mombasa" },
  { id: '3', name: "Kisumu Auto Parts", category: "Automotive", rating: 4.2, verified: false, contact: "0734567890", address: "Lakeside Motors, Kisumu" },
  { id: '4', name: "Nakuru Fashion", category: "Clothing", rating: 4.6, verified: true, contact: "0745678901", address: "Rift Valley Trends, Nakuru" },
  { id: '5', name: "Eldoret Agri-Supplies", category: "Agriculture", rating: 4.0, verified: true, contact: "0756789012", address: "Grain Belt, Eldoret" },
];

// ---
// BusinessCard Component (Extracted for reusability and cleaner rendering logic)
// ---
interface BusinessCardProps {
  business: Business;
  onStartChat: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = React.memo(({ business, onStartChat, onViewDetails }) => (
  <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:shadow-md transition-shadow duration-200 ease-in-out">
    <CardContent className="flex-1 min-w-0 mb-2 sm:mb-0 p-0"> {/* p-0 to remove default CardContent padding */}
      <div className="flex items-center gap-2 mb-1">
        <CardTitle className="font-medium text-base text-gray-900 truncate">
          {business.name}
        </CardTitle>
        {business.verified && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Verified
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">{business.category}</p>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-yellow-400">★</span>
        <span className="text-sm text-gray-600">{business.rating}</span>
      </div>
    </CardContent>
    <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
      <Button
        variant="default"
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => onStartChat(business.id)}
        aria-label={`Start chat with ${business.name}`}
      >
        Chat
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => onViewDetails(business.id)}
        aria-label={`View details for ${business.name}`}
      >
        View
      </Button>
    </div>
  </Card>
));

// ---
// ChatForums Main Component
// ---
const ChatForums: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'forums' | 'chat' | 'directory'>('forums');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOnline } = useOnlineStatus();

  // Memoize filtered businesses to prevent re-calculation on every render
  const filteredBusinesses = useMemo(() => {
    return MOCK_BUSINESS_DIRECTORY.filter((business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Use useCallback for event handlers to prevent unnecessary re-renders of child components
  const handleStartChat = useCallback((id: string) => {
    setSelectedConversationId(id);
    setSelectedTab('chat'); // Automatically switch to chat tab when starting a conversation
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    // In a real app, this would navigate to a business detail page or open a modal
    alert(`Viewing details for business ID: ${id}`);
    // Example: router.push(`/business/${id}`);
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50"> {/* Added a light background */}
        {/* Sidebar (desktop only) */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r p-4 space-y-2 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
          <Button
            variant={selectedTab === 'forums' ? 'secondary' : 'ghost'}
            className="justify-start w-full text-left flex items-center gap-2"
            onClick={() => setSelectedTab('forums')}
            aria-current={selectedTab === 'forums' ? 'page' : undefined}
          >
            <MessageCircle size={20} /> Forums
          </Button>
          <Button
            variant={selectedTab === 'chat' ? 'secondary' : 'ghost'}
            className="justify-start w-full text-left flex items-center gap-2"
            onClick={() => setSelectedTab('chat')}
            aria-current={selectedTab === 'chat' ? 'page' : undefined}
          >
            <Users size={20} /> Direct Chat
          </Button>
          <Button
            variant={selectedTab === 'directory' ? 'secondary' : 'ghost'}
            className="justify-start w-full text-left flex items-center gap-2"
            onClick={() => setSelectedTab('directory')}
            aria-current={selectedTab === 'directory' ? 'page' : undefined}
          >
            <Globe size={20} /> Business Directory
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Community Hub</h1>
              <p className="text-md text-gray-600">Connect, chat, and discover in real-time.</p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0 bg-white p-2 rounded-lg shadow-sm">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm font-medium text-gray-700">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          {/* Tab Content with Suspense for lazy loaded components */}
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">Loading content...</p>
            </div>
          }>
            {selectedTab === 'forums' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <MessageCircle size={24} /> Community Forums
                </h2>
                <p className="text-gray-600">Engage in discussions, ask questions, and share insights with the community.</p>
                <ImprovedForumsList />
              </section>
            )}

            {selectedTab === 'chat' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <Users size={24} /> Direct Chat
                </h2>
                <p className="text-gray-600">Connect directly with other users or businesses.</p>
                <ChatInterface selectedConversationId={selectedConversationId} />
              </section>
            )}

            {selectedTab === 'directory' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <Globe size={24} /> Business Directory
                </h2>
                <p className="text-gray-600">Explore local businesses, view their profiles, and initiate chats.</p>
                <Input
                  type="text"
                  placeholder="Search businesses by name or category..."
                  className="w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search business directory"
                />
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"> {/* Responsive grid */}
                  {filteredBusinesses.length === 0 ? (
                    <p className="text-gray-500 text-center col-span-full">No businesses found matching your search.</p>
                  ) : (
                    filteredBusinesses.map((business) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        onStartChat={handleStartChat}
                        onViewDetails={handleViewDetails}
                      />
                    ))
                  )}
                </div>
              </section>
            )}
          </Suspense>
        </main>

        {/* Mobile Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-around bg-white border-t shadow-lg p-2 md:hidden">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center p-2 rounded-md ${selectedTab === 'forums' ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-600'}`}
            onClick={() => setSelectedTab('forums')}
            aria-label="Forums tab"
          >
            <MessageCircle size={24} />
            <span className="text-xs mt-1">Forums</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center p-2 rounded-md ${selectedTab === 'chat' ? 'text-green-600 font-bold bg-green-50' : 'text-gray-600'}`}
            onClick={() => setSelectedTab('chat')}
            aria-label="Direct Chat tab"
          >
            <Users size={24} />
            <span className="text-xs mt-1">Chat</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center p-2 rounded-md ${selectedTab === 'directory' ? 'text-purple-600 font-bold bg-purple-50' : 'text-gray-600'}`}
            onClick={() => setSelectedTab('directory')}
            aria-label="Business Directory tab"
          >
            <Globe size={24} />
            <span className="text-xs mt-1">Directory</span>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatForums;