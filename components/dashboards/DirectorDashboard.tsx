import React from 'react';
import { Card, DashboardTemplate, PlaceholderContent } from '../common/UI';
import { DollarIcon, ChartIcon, UsersIcon } from '../common/Icons';

export const DirectorDashboard: React.FC = () => (
  <DashboardTemplate title="Director's Dashboard">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Company Revenue (YTD)" value="$12.8M" icon={<DollarIcon />} />
        <Card title="Market Share" value="15.2%" icon={<ChartIcon />} />
        <Card title="Employee Satisfaction" value="92%" icon={<UsersIcon />} />
    </div>
    <PlaceholderContent title="Quarterly Performance Review Chart" />
  </DashboardTemplate>
);