
import React from 'react';
import { Job, User, JobAttachment } from '../../../types';
import { AssignedJobsList } from './AssignedJobsList';

interface VideographyDashboardProps {
    jobs: Job[];
    users: User[];
    onAssignTaskToEmployee: (jobId: string, department: string, serviceName: string, taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[]; }) => void;
}

export const VideographyDashboard: React.FC<VideographyDashboardProps> = ({ jobs, users, onAssignTaskToEmployee }) => {
    return <AssignedJobsList jobs={jobs} departmentName="Videography" users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
};
