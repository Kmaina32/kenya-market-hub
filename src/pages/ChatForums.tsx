import React, { useState, lazy, Suspense, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { MessageCircle, Users, Globe, ArrowLeftCircle } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

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
  id: string;
  name: string;
  category: string;
  rating: number;
  verified: boolean;
  contact?: string;
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
        className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
        onClick={() => onStartChat(business.id)}
        aria-label={`Start chat with ${business.name}`}
      >
        Chat
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto border-orange-200 text-orange-600 hover:bg-orange-50"
        onClick={() => onViewDetails(business.id)}
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
  const navigate = useNavigate();

  // --- Maintenance Mode Configuration ---
  // Set this to `true` to activate full-page maintenance mode.
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(true); 
  // In a real application, you might fetch this from an API or environment variable.
  // Example: useEffect(() => { fetch('/api/maintenance-status').then(res => res.json()).then(data => setIsUnderMaintenance(data.maintenanceMode)); }, []);

  // If under maintenance, display only the maintenance message and company logo.
  if (isUnderMaintenance) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 p-4 text-center">
          {/* Company Logo */}
          <div className="mb-6 flex flex-col items-center"> {/* Added flex and items-center to ensure internal content is centered */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-white p-3">
              <img
                alt="Sokko Sasa Logo"
                src="/LOGO/Sokko.svg" // Path to your actual company logo
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">Sokko Sasa</h2>
            <p className="text-base text-gray-600 mt-1">Africa's Smart Marketplace</p>
          </div>

          {/* Maintenance Graphic */}
          <img
            // FIX: You MUST replace this with the actual path to your image asset.
            // For example: src="/images/server-maintenance.svg" or src="/assets/maintenance-animation.gif"
            // Place your chosen maintenance graphic file in your public/images or public/assets folder.
            src="/LOGO/maintenance-graphic.svg.svg" // Placeholder: Update this path!
            alt="Under Maintenance"
            className="w-32 md:w-40 h-auto mb-6 opacity-90 mx-auto" // Added mx-auto to center the image if it's not flex item
          />
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 drop-shadow-lg">
            Community Hub Under Maintenance
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl leading-relaxed">
            We're actively working to enhance our messaging and community features.
            This mini-app is temporarily unavailable as we perform essential upgrades.
            Please return to the main page to explore our other platforms.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <ArrowLeftCircle size={20} /> Return to Main Page
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

  const filteredBusinesses = React.useMemo(() => {
    return MOCK_BUSINESS_DIRECTORY.filter((business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleStartChat = useCallback((id: string) => {
    setSelectedConversationId(id);
    setSelectedTab('chat');
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    alert(`Viewing details for business ID: ${id}`);
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
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
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Messages & Community</h1>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0 bg-white p-2 rounded-lg shadow-sm">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm font-medium text-gray-700">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          {/* Original Tab Content (will only render if isUnderMaintenance is false) */}
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
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
            aria-current={selectedTab === 'chat' ? 'page' : undefined}
          >
            <Users size={24} />
            <span className="text-xs mt-1">Chat</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center p-2 rounded-md ${selectedTab === 'directory' ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
            onClick={() => setSelectedTab('directory')}
            aria-current={selectedTab === 'directory' ? 'page' : undefined}
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