import React from 'react';
import { DashboardTemplate, PlaceholderContent } from '../../../common/UI';

export const IncomeStatementDashboard: React.FC = () => {
    return (
        <DashboardTemplate title="Income Statement">
            <PlaceholderContent title="Income Statement Details" height="h-96" />
        </DashboardTemplate>
    );
};
