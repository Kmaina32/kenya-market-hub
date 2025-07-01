
import React from 'react';
import MainLayout from '@/components/MainLayout';

const Home = () => {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <h1 className="text-3xl font-bold">Welcome to Marketplace</h1>
        <p className="text-gray-600 mt-4">Your one-stop platform for all services</p>
      </div>
    </MainLayout>
  );
};

export default Home;
