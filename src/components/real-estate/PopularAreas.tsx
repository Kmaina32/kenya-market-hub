
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface PopularAreasProps {
  onAreaSelect: (area: string) => void;
}

const PopularAreas: React.FC<PopularAreasProps> = ({ onAreaSelect }) => {
  const popularAreas = [
    'Kilimani', 'Karen', 'Westlands', 'Parklands', 'Lavington', 'Kileleshwa'
  ];

  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8">Popular Areas</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {popularAreas.map((area, index) => (
          <Button 
            key={index} 
            variant="outline" 
            className="p-4 h-auto"
            onClick={() => onAreaSelect(area)}
          >
            <div className="text-center">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <span className="font-medium">{area}</span>
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
};

export default PopularAreas;
