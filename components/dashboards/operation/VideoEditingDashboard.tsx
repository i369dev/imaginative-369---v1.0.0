
import React from 'react';
import { Job, User, JobAttachment } from '../../../types';
import { AssignedJobsList } from './AssignedJobsList';

interface VideoEditingDashboardProps {
    jobs: Job[];
    users: User[];
    onAssignTaskToEmployee: (jobId: string, department: string, serviceName: string, taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[]; }) => void;
}

export const VideoEditingDashboard: React.FC<VideoEditingDashboardProps> = ({ jobs, users, onAssignTaskToEmployee }) => {
    return <AssignedJobsList jobs={jobs} departmentName="Video Editing" users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
};
