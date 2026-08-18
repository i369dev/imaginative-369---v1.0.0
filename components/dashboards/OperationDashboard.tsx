
import React, { useState, useMemo } from 'react';
import { DashboardTemplate } from '../common/UI';
import { Job, User, JobAttachment } from '../../types';
import {
    LiveStatusBoard,
    GraphicDesigningDashboard,
    VideoEditingDashboard,
    VideographyDashboard,
    PhotographyDashboard,
    SocialMediaManagingDashboard
} from './operation/index.ts';

interface OperationDashboardProps {
    allJobs: Job[];
    users: User[];
    onAssignTaskToEmployee: (jobId: string, department: string, serviceName: string, taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[] }) => void;
}

export const OperationDashboard: React.FC<OperationDashboardProps> = (props) => {
    const { allJobs, users, onAssignTaskToEmployee } = props;

    const [activeTab, setActiveTab] = useState('Live Status Board');
    const tabs = [
        'Live Status Board',
        'Graphic Designing',
        'Video Editing',
        'Videography',
        'Photography',
        'Social Media Managing'
    ];

    const departmentalJobs = useMemo(() => {
        const opsJobs = {
            graphicDesigning: [] as Job[],
            videoEditing: [] as Job[],
            videography: [] as Job[],
            photography: [] as Job[],
            socialMediaManaging: [] as Job[],
        };

        for (const job of allJobs) {
            if (job.isAssigned) {
                if (job.graphicDesign.enabled) opsJobs.graphicDesigning.push(job);
                // For video production, assign to both editing and videography for now
                if (job.videoProduction.enabled) {
                    opsJobs.videoEditing.push(job);
                    opsJobs.videography.push(job);
                }
                if (job.photography.enabled) opsJobs.photography.push(job);
                if (job.digitalMarketing.enabled) opsJobs.socialMediaManaging.push(job);
            }
        }
        return opsJobs;
    }, [allJobs]);

    const renderContent = () => {
        switch(activeTab) {
            case 'Live Status Board':
                return <LiveStatusBoard allJobs={allJobs} />;
            case 'Graphic Designing':
                return <GraphicDesigningDashboard jobs={departmentalJobs.graphicDesigning} users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
            case 'Video Editing':
                return <VideoEditingDashboard jobs={departmentalJobs.videoEditing} users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
            case 'Videography':
                return <VideographyDashboard jobs={departmentalJobs.videography} users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
            case 'Photography':
                return <PhotographyDashboard jobs={departmentalJobs.photography} users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
            case 'Social Media Managing':
                return <SocialMediaManagingDashboard jobs={departmentalJobs.socialMediaManaging} users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
            default:
                return null;
        }
    };

    return (
        <DashboardTemplate title="Operations Dashboard">
            <div className="border-b border-neutral-800">
                <nav className="flex space-x-2 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm transition-colors focus:outline-none ${activeTab === tab ? 'bg-neutral-700/80 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">
                {renderContent()}
            </div>
        </DashboardTemplate>
    );
};
