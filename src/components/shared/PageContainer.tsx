
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
