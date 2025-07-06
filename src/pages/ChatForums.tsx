import React, { useState, lazy, Suspense, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { MessageCircle, Users, Globe, Wrench, ServerCrash } from 'lucide-react'; // Added Wrench and ServerCrash icons
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

// Define a simple interface for ChatInterface props to resolve the type error
interface ChatInterfaceProps {
  selectedConversationId: string | null;
}

// Lazy load components for performance
const ImprovedForumsList = lazy(() => import('@/components/chat/ImprovedForumsList'));
const ChatInterface = lazy(() => import('@/components/chat/ChatInterface')) as React.LazyExoticComponent<React.FC<ChatInterfaceProps>>;

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
    <CardContent className="flex-1 min-w-0 mb-2 sm:mb-0 p-0">
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
        className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white" // Added gradient
        onClick={() => onStartChat(business.id)}
        aria-label={`Start chat with ${business.name}`}
      >
        Chat
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto border-orange-200 text-orange-600 hover:bg-orange-50" // Consistent outline style
        onClick={() => onViewDetails(business.id)} // Ensure View button has action
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
  // --- Maintenance Mode Configuration ---
  // Set this to `true` to activate maintenance mode and disable the page.
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(true); 
  // In a real application, you might fetch this from an API or environment variable.
  // Example: useEffect(() => { fetch('/api/maintenance-status').then(res => res.json()).then(data => setIsUnderMaintenance(data.maintenanceMode)); }, []);

  // If under maintenance, display a simple message and nothing else from the component.
  if (isUnderMaintenance) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 p-4 text-center">
          {/* Maintenance Image */}
          https://www.canva.com/design/DAGsXhL8NqQ/DksI22WloWvnN03ceu2roQ/edit?utm_content=DAGsXhL8NqQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
          
          {/* Optional: Add a CSS animation for an icon if you don't have a GIF/Lottie */}
          {/* You might define a custom keyframe animation in your CSS file (e.g., global.css)
              @keyframes pulse-grow {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
              .animate-pulse-grow {
                animation: pulse-grow 2s infinite ease-in-out;
              }
          */}
          <Wrench size={64} className="text-orange-500 mb-4 animate-bounce" />
          {/* Or a ServerCrash icon */}
          {/* <ServerCrash size={64} className="text-red-500 mb-4 animate-pulse-grow" /> */}

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 drop-shadow-lg">
            Under Maintenance
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl leading-relaxed">
            We're currently performing essential updates to improve your experience. 
            The Community Hub mini-app will be back online shortly. Thank you for your patience!
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Refresh Page
          </Button>
        </div>
      </MainLayout>
    );
  }

  // --- Normal component logic starts here if not under maintenance ---
  const [selectedTab, setSelectedTab] = useState<'forums' | 'chat' | 'directory'>('forums');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOnline } = useOnlineStatus();

  // Memoize filtered businesses to prevent re-calculation on every render
  const filteredBusinesses = React.useMemo(() => {
    return MOCK_BUSINESS_DIRECTORY.filter((business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Use useCallback for event handlers to prevent unnecessary re-renders of child components
  const handleStartChat = React.useCallback((id: string) => {
    setSelectedConversationId(id);
    setSelectedTab('chat'); // Automatically switch to chat tab when starting a conversation
  }, []);

  const handleViewDetails = React.useCallback((id: string) => {
    // In a real app, this would navigate to a business detail page or open a modal
    alert(`Viewing details for business ID: ${id}`);
    // Example: router.push(`/business/${id}`);
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50"> {/* Added consistent background */}
        {/* Desktop Sidebar (md and up) */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r p-4 space-y-2 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
          <Button
            variant={selectedTab === 'forums' ? 'secondary' : 'ghost'}
            className={`justify-start w-full text-left flex items-center gap-2 ${selectedTab === 'forums' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100 hover:text-orange-600'}`}
            onClick={() => setSelectedTab('forums')}
            aria-current={selectedTab === 'forums' ? 'page' : undefined}
          >
            <MessageCircle size={20} /> Forums
          </Button>
          <Button
            variant={selectedTab === 'chat' ? 'secondary' : 'ghost'}
            className={`justify-start w-full text-left flex items-center gap-2 ${selectedTab === 'chat' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100 hover:text-orange-600'}`}
            onClick={() => setSelectedTab('chat')}
            aria-current={selectedTab === 'chat' ? 'page' : undefined}
          >
            <Users size={20} /> Direct Chat
          </Button>
          <Button
            variant={selectedTab === 'directory' ? 'secondary' : 'ghost'}
            className={`justify-start w-full text-left flex items-center gap-2 ${selectedTab === 'directory' ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-100 hover:text-orange-600'}`}
            onClick={() => setSelectedTab('directory')}
            aria-current={selectedTab === 'directory' ? 'page' : undefined}
          >
            <Globe size={20} /> Business Directory
          </Button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* Main Title / Online Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Messages & Community</h1> {/* Changed title */}
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
                <ImprovedForumsList />
              </section>
            )}

            {selectedTab === 'chat' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <Users size={24} /> Direct Chat
                </h2>
                <ChatInterface selectedConversationId={selectedConversationId} />
              </section>
            )}

            {selectedTab === 'directory' && (
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <Globe size={24} /> Business Directory
                </h2>
                <input
                  type="text"
                  placeholder="Search businesses by name or category..."
                  className="w-full p-2 border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search business directory"
                />
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"> {/* Responsive grid */}
                  {filteredBusinesses.length === 0 ? (
                    <p className="text-gray-500 text-center col-span-full">No businesses found.</p>
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

        {/* Mobile Navigation (md:hidden remains for responsive control) */}
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-around bg-white border-t shadow-lg p-2 md:hidden">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center p-2 rounded-md ${selectedTab === 'forums' ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
            onClick={() => setSelectedTab('forums')}
            aria-label="Forums tab"
          >
            <MessageCircle size={24} />
            <span className="text-xs mt-1">Forums</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center p-2 rounded-md ${selectedTab === 'chat' ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
            onClick={() => setSelectedTab('chat')}
            aria-label="Direct Chat tab"
          >
            <Users size={24} />
            <span className="text-xs mt-1">Chat</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center p-2 rounded-md ${selectedTab === 'directory' ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
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