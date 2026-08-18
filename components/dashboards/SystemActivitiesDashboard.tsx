import React, { useState, useMemo } from 'react';
import { ActivityLog, ActivityLogCategory, User, Job, CameraEquipment, Products } from '../../types';
import { DashboardTemplate, InputField } from '../common/UI';
import { ActivityLogTable } from './ActivityLogTable';
import { LiveActivityFeed } from './LiveActivityFeed';
import { ProcessFlowDashboard } from './ProcessFlowDashboard';
import { UsersIcon, BriefcaseIcon, CodeIcon, CameraIcon, ClockIcon, WifiIcon, ClipboardDocumentListIcon, SitemapIcon } from '../common/Icons';

interface SystemActivitiesDashboardProps {
    activityLogs: ActivityLog[];
    users: User[];
    jobs: Job[];
    equipment: CameraEquipment[];
    products: Products;
}

const getToday = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.toISOString().split('T')[0];
};

const getThirtyDaysAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
};

export const SystemActivitiesDashboard: React.FC<SystemActivitiesDashboardProps> = (props) => {
    const { activityLogs, users, jobs, equipment, products } = props;
    const [viewMode, setViewMode] = useState<'live' | 'historical' | 'flow'>('live');
    const [activeCategory, setActiveCategory] = useState<ActivityLogCategory | 'All'>('All');
    const [startDate, setStartDate] = useState(getThirtyDaysAgo());
    const [endDate, setEndDate] = useState(getToday());

    const categories: { name: ActivityLogCategory | 'All', icon: React.ReactNode }[] = [
        { name: 'All', icon: <ClipboardDocumentListIcon className="w-5 h-5"/> },
        { name: 'User Management', icon: <UsersIcon className="w-5 h-5"/> },
        { name: 'Job Details', icon: <BriefcaseIcon className="w-5 h-5"/> },
        { name: 'Our Products', icon: <CodeIcon className="w-5 h-5"/> },
        { name: 'Camera Equipment', icon: <CameraIcon className="w-5 h-5"/> },
    ];

    const filteredLogs = useMemo(() => {
        return activityLogs.filter(log => {
            const isInCategory = activeCategory === 'All' || log.category === activeCategory;
            if (!isInCategory) return false;

            if (viewMode === 'historical') {
                const logDate = new Date(log.timestamp);
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                if (logDate < start || logDate > end) return false;
            }
            
            return true;
        });
    }, [activityLogs, activeCategory, startDate, endDate, viewMode]);

    const liveLogs = useMemo(() => filteredLogs.slice(0, 20), [filteredLogs]);

    const renderContent = () => {
        switch(viewMode) {
            case 'live':
                return <LiveActivityFeed logs={liveLogs} />;
            case 'historical':
                return <ActivityLogTable logs={filteredLogs} />;
            case 'flow':
                return <ProcessFlowDashboard 
                    activityLogs={activityLogs} 
                    users={users} 
                    jobs={jobs} 
                    equipment={equipment} 
                    products={products} 
                />;
            default:
                return null;
        }
    };

    return (
        <DashboardTemplate title="System Activity Log">
            <p className="text-neutral-400 mb-6 max-w-4xl">
                Review a detailed history of all significant actions performed within the application.
                Switch between a real-time feed, a comprehensive historical log, or an interactive process flow visualization.
            </p>
            
             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="p-1 bg-neutral-800/60 rounded-lg flex items-center space-x-1 w-full sm:w-auto">
                    <button onClick={() => setViewMode('live')} className={`flex-1 sm:flex-none flex justify-center items-center gap-2 py-1.5 px-4 rounded-md text-sm font-medium transition-colors ${viewMode === 'live' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}>
                        <WifiIcon className="w-5 h-5" />
                        Live Feed
                    </button>
                    <button onClick={() => setViewMode('historical')} className={`flex-1 sm:flex-none flex justify-center items-center gap-2 py-1.5 px-4 rounded-md text-sm font-medium transition-colors ${viewMode === 'historical' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}>
                        <ClockIcon className="w-5 h-5" />
                        Historical Log
                    </button>
                    <button onClick={() => setViewMode('flow')} className={`flex-1 sm:flex-none flex justify-center items-center gap-2 py-1.5 px-4 rounded-md text-sm font-medium transition-colors ${viewMode === 'flow' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}>
                        <SitemapIcon className="w-5 h-5" />
                        Process Flow
                    </button>
                </div>
                 {viewMode === 'live' && (
                    <div className="flex items-center gap-2 text-green-400 self-end sm:self-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="font-medium text-sm">LIVE</span>
                    </div>
                )}
            </div>

            {viewMode !== 'flow' && (
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 bg-neutral-900/40 rounded-lg border border-neutral-700/50">
                    <nav className="flex-grow w-full">
                        <label className="text-sm font-medium text-neutral-400 mb-2 block">Filter by Category</label>
                        <div className="flex space-x-1 overflow-x-auto bg-neutral-800/60 p-1 rounded-lg" aria-label="Log Categories">
                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`whitespace-nowrap py-2 px-3 rounded-md font-medium text-sm transition-colors focus:outline-none flex items-center gap-2 ${activeCategory === cat.name ? 'bg-cyan-600/20 text-cyan-300' : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'}`}
                                >
                                    {cat.icon}
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </nav>
                    
                    {viewMode === 'historical' && (
                        <div className="flex items-end gap-4 mt-4 md:mt-0 w-full md:w-auto">
                            <InputField id="startDate" label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            <InputField id="endDate" label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>
                    )}
                </div>
            )}
            
            <div>
                {renderContent()}
            </div>
        </DashboardTemplate>
    );
};