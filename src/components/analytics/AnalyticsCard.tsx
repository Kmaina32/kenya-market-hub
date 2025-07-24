
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color?: string;
  subtitle?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'text-blue-600',
  subtitle 
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {change !== undefined && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-2">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
              {isPositive ? '+' : ''}{change.toFixed(1)}%
            </Badge>
            <span>vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
