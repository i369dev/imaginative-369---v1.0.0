
import React from 'react';
import { Job, User, JobAttachment } from '../../../types';
import { AssignedJobsList } from './AssignedJobsList';

interface GraphicDesigningDashboardProps {
    jobs: Job[];
    users: User[];
    onAssignTaskToEmployee: (jobId: string, department: string, serviceName: string, taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[]; }) => void;
}

export const GraphicDesigningDashboard: React.FC<GraphicDesigningDashboardProps> = ({ jobs, users, onAssignTaskToEmployee }) => {
    return <AssignedJobsList jobs={jobs} departmentName="Graphic Design" users={users} onAssignTaskToEmployee={onAssignTaskToEmployee} />;
};
