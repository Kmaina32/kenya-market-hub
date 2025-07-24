
import React from 'react';
import MainLayout from '@/components/MainLayout';

const Jobs = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Jobs & Careers</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Job marketplace coming soon...</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Jobs;
