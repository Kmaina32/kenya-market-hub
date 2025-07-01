
import React from 'react';
import MainLayout from '@/components/MainLayout';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard.</p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
