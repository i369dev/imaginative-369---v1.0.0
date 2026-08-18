
import React from 'react';
import { Job, User, JobAttachment } from '../../../types';
import { AssignedJobsList } from './AssignedJobsList';

interface SocialMediaManagingDashboardProps {
    jobs: Job[];
    users: User[];
    onAssignTaskToEmployee: (jobId: string, department: string, serviceName: string, taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[]; }) => void;
}

export const SocialMediaManagingDashboard: React.FC<SocialMediaManagingDashboardProps> = ({ jobs, users, onAssignTaskToEmployee }) => {
    return <AssignedJobsList jobs={jobs} departmentName="Social Media Managing" users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
};
