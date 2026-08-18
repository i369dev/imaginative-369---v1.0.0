import React from 'react';
import { ActivityLog } from '../../types';
import { UsersIcon, BriefcaseIcon, CodeIcon, CameraIcon, ClipboardDocumentListIcon } from '../common/Icons';

// Helper to get a relevant icon for each category
const getCategoryIcon = (category: ActivityLog['category']) => {
    const iconProps = { className: "h-5 w-5 text-white" };
    switch (category) {
        case 'User Management': return <UsersIcon {...iconProps} />;
        case 'Job Details': return <BriefcaseIcon {...iconProps} />;
        case 'Our Products': return <CodeIcon {...iconProps} />;
        case 'Camera Equipment': return <CameraIcon {...iconProps} />;
        default: return <ClipboardDocumentListIcon {...iconProps} />;
    }
};

// Helper to get a relevant color for each category
const getCategoryColor = (category: ActivityLog['category']) => {
    switch (category) {
        case 'User Management': return 'bg-blue-500';
        case 'Job Details': return 'bg-purple-500';
        case 'Our Products': return 'bg-teal-500';
        case 'Camera Equipment': return 'bg-orange-500';
        default: return 'bg-gray-500';
    }
};

// Helper to format time since event
const timeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    if (seconds < 10) return "just now";
    return Math.floor(seconds) + " seconds ago";
};


interface LiveActivityFeedProps {
    logs: ActivityLog[];
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ logs }) => {
    if (logs.length === 0) {
        return (
            <div className="text-center py-16 text-neutral-500 flex flex-col items-center gap-3">
                 <ClipboardDocumentListIcon className="w-12 h-12" />
                <p className="text-lg">Waiting for system activity...</p>
                <p className="text-sm max-w-md">As actions are performed in the app, they will appear here in real-time.</p>
            </div>
        );
    }

    return (
        <div className="relative pl-8">
            {/* The vertical timeline bar */}
            <div className="absolute left-3 top-0 h-full w-0.5 bg-neutral-800" />
            <div className="space-y-8">
                {logs.map(log => (
                    <div key={log.id} className="activity-item relative flex items-start gap-4">
                        {/* The dot on the timeline */}
                        <div className={`absolute left-0 top-2 h-6 w-6 rounded-full flex items-center justify-center ${getCategoryColor(log.category)}`}>
                             {getCategoryIcon(log.category)}
                        </div>
                        
                        <div className="glass-card flex-1 rounded-lg p-4 w-full ml-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-white capitalize">{log.user}
                                        <span className="text-neutral-400 font-normal"> performed an action</span>
                                    </p>
                                     <p className="text-sm text-neutral-400">
                                        {timeSince(log.timestamp)} in <span className="font-medium text-neutral-300">{log.category}</span>
                                    </p>
                                </div>
                                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-700/60 text-neutral-300 whitespace-nowrap">
                                    {log.action.replace(/_/g, ' ').toLowerCase()}
                                </span>
                            </div>
                            <div className="mt-3 text-neutral-300 text-sm border-t border-neutral-700/50 pt-3">
                                {log.details}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
