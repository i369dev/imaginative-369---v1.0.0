
import React from 'react';
import { Job, User, JobAttachment } from '../../../types';
import { AssignedJobsList } from './AssignedJobsList';

interface PhotographyDashboardProps {
    jobs: Job[];
    users: User[];
    onAssignTaskToEmployee: (jobId: string, department: string, serviceName: string, taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[]; }) => void;
}

export const PhotographyDashboard: React.FC<PhotographyDashboardProps> = ({ jobs, users, onAssignTaskToEmployee }) => {
    return <AssignedJobsList jobs={jobs} departmentName="Photography" users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
};
