
import React, { useState } from 'react';
import { DashboardTemplate, PlaceholderContent } from '../common/UI';

// Import new dashboard components
import { 
    EmployeeWorkProgressDashboard,
    SalaryDashboard
} from './finance/payroll/index.ts';

import {
    BalanceSheetDashboard,
    IncomeStatementDashboard,
    CashFlowStatementDashboard
} from './finance/reporting/index.ts';

import {
    GeneralLedgerDashboard,
    AccountsPayableDashboard,
    AccountsReceivableDashboard
} from './finance/accounting/index.ts';

export const FinanceDashboard: React.FC = () => {
    // State for main tabs
    const [activeTab, setActiveTab] = useState('Payroll Records');
    const mainTabs = ['Payroll Records', 'Financial Reporting', 'Accounting'];

    // State for Payroll Records sub-tabs
    const [activePayrollTab, setActivePayrollTab] = useState('Attendance');
    const payrollSubTabs = ['Employee Work Progress', 'Attendance', 'Salary'];

    // State for Financial Reporting sub-tabs
    const [activeReportingTab, setActiveReportingTab] = useState('Balance Sheet');
    const reportingSubTabs = ['Balance Sheet', 'Income Statement', 'Cash Flow Statement'];

    // State for Accounting sub-tabs
    const [activeAccountingTab, setActiveAccountingTab] = useState('General Ledger');
    const accountingSubTabs = ['General Ledger', 'Accounts Payable', 'Accounts Receivable'];

    // Common styles for tabs
    const mainTabStyle = (tab: string) => 
        `whitespace-nowrap py-3 px-4 rounded-t-lg font-medium text-base transition-colors focus:outline-none ${activeTab === tab ? 'bg-neutral-800/60 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/30'}`;
        
    const subTabStyle = (activeSubTab: string, tab: string) => 
        `whitespace-nowrap py-2 px-3 rounded-md font-medium text-sm transition-colors focus:outline-none ${activeSubTab === tab ? 'bg-cyan-600/20 text-cyan-300' : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'}`;


    const renderPayrollContent = () => {
        switch(activePayrollTab) {
            case 'Employee Work Progress': return <EmployeeWorkProgressDashboard />;
            case 'Attendance': return <PlaceholderContent title="Attendance records are now managed by the HR department." height="h-96" />;
            case 'Salary': return <SalaryDashboard />;
            default: return null;
        }
    };

    const renderReportingContent = () => {
        switch(activeReportingTab) {
            case 'Balance Sheet': return <BalanceSheetDashboard />;
            case 'Income Statement': return <IncomeStatementDashboard />;
            case 'Cash Flow Statement': return <CashFlowStatementDashboard />;
            default: return null;
        }
    };
    
    const renderAccountingContent = () => {
        switch(activeAccountingTab) {
            case 'General Ledger': return <GeneralLedgerDashboard />;
            case 'Accounts Payable': return <AccountsPayableDashboard />;
            case 'Accounts Receivable': return <AccountsReceivableDashboard />;
            default: return null;
        }
    };

    const renderContent = () => {
        const subNavWrapperClass = "flex items-center space-x-2 p-2 bg-neutral-900/50 rounded-lg";
        switch (activeTab) {
            case 'Payroll Records':
                 return (
                    <div>
                        <nav className={subNavWrapperClass} aria-label="Sub Tabs">
                            {payrollSubTabs.map((tab) => (
                                <button key={tab} onClick={() => setActivePayrollTab(tab)} className={subTabStyle(activePayrollTab, tab)}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                        <div className="mt-4 pt-4">
                            {renderPayrollContent()}
                        </div>
                    </div>
                );
            
            case 'Financial Reporting':
                return (
                    <div>
                        <nav className={subNavWrapperClass} aria-label="Sub Tabs">
                            {reportingSubTabs.map((tab) => (
                                <button key={tab} onClick={() => setActiveReportingTab(tab)} className={subTabStyle(activeReportingTab, tab)}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                        <div className="mt-4 pt-4">
                            {renderReportingContent()}
                        </div>
                    </div>
                );
            
            case 'Accounting':
                return (
                     <div>
                        <nav className={subNavWrapperClass} aria-label="Sub Tabs">
                            {accountingSubTabs.map((tab) => (
                                <button key={tab} onClick={() => setActiveAccountingTab(tab)} className={subTabStyle(activeAccountingTab, tab)}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                         <div className="mt-4 pt-4">
                            {renderAccountingContent()}
                         </div>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <DashboardTemplate title="Finance Dashboard">
            <div className="border-b border-neutral-800">
                <nav className="flex space-x-2" aria-label="Tabs">
                    {mainTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={mainTabStyle(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-4 p-4 bg-neutral-800/30 rounded-b-lg rounded-r-lg">
                {renderContent()}
            </div>
        </DashboardTemplate>
    );
};
