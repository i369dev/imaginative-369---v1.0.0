import React from 'react';
import { DashboardTemplate, PlaceholderContent } from '../../../common/UI';

export const GeneralLedgerDashboard: React.FC = () => {
    return (
        <DashboardTemplate title="General Ledger">
            <PlaceholderContent title="General Ledger Details" height="h-96" />
        </DashboardTemplate>
    );
};
