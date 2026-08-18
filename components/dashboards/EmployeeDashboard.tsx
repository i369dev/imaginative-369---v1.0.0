


import React, { useMemo, useState, useEffect } from 'react';
import { DashboardTemplate, ConfirmationModal } from '../common/UI';
import { User, Job, TaskStatus, ActivityLog, AttendanceRecord, JobAssignment, FileInfo, EmployeeUIConfig, EmployeeUICard } from '../../types';
import { CheckIcon, LightBulbIcon, ChartPieIcon, CloseIcon, PaperClipIcon, LinkIcon, EditIcon, DeleteIcon, ClockIcon } from '../common/Icons';
import { EmployeeAttendanceCard } from '../common/AttendanceCard';
import { calculateAttendanceData, getBillingCycle } from '../../utils/attendance';


interface EmployeeTask extends JobAssignment {
    jobId: string;
    customerName: string;
    department: string;
    service: string;
}

interface CompletionModalProps {
    task: EmployeeTask;
    isOpen: boolean;
    onClose: () => void;
    onPreview: (details: { completionNotes: string; completionAttachment?: { type: 'file' | 'link'; value: string; fileInfo?: FileInfo } }) => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ task, isOpen, onClose, onPreview }) => {
    const [notes, setNotes] = useState('');
    const [attachmentType, setAttachmentType] = useState<'link' | 'file'>('link');
    const [attachmentValue, setAttachmentValue] = useState('');
    const [fileInfo, setFileInfo] = useState<FileInfo | undefined>();

    useEffect(() => {
        // Reset state when modal opens for a new task
        setNotes('');
        setAttachmentType('link');
        setAttachmentValue('');
        setFileInfo(undefined);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachmentValue(file.name);
            setFileInfo({ name: file.name, type: file.type, size: file.size });
        } else {
            setAttachmentValue('');
            setFileInfo(undefined);
        }
    };

    const handlePreview = () => {
        if (!notes.trim()) {
            alert('Completion notes are required.');
            return;
        }
        const details: { completionNotes: string; completionAttachment?: { type: 'file' | 'link'; value: string, fileInfo?: FileInfo } } = {
            completionNotes: notes,
        };
        if (attachmentValue.trim()) {
            details.completionAttachment = { type: attachmentType, value: attachmentValue, fileInfo: fileInfo };
        }
        onPreview(details);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-lg border border-neutral-700">
                <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <CheckIcon className="h-7 w-7 text-green-400" />
                        <h2 className="text-xl font-bold text-white">Complete Task: {task.service}</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>
                <p className="text-neutral-300 mb-6">Provide final notes and any relevant attachments for this task.</p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="completionNotes" className="block text-sm font-medium text-neutral-300 mb-1.5">Completion Notes (Required)</label>
                        <textarea id="completionNotes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500" placeholder="Describe what was done, any issues, and the final outcome..." />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-neutral-300 mb-2">Attachment (Optional)</label>
                         <div className="flex bg-slate-800/60 rounded-md p-1 space-x-1 mb-2">
                            <button onClick={() => { setAttachmentType('link'); setAttachmentValue(''); setFileInfo(undefined); }} className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${attachmentType==='link' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600/50'}`}><LinkIcon className="w-5 h-5"/> Link</button>
                            <button onClick={() => { setAttachmentType('file'); setAttachmentValue(''); setFileInfo(undefined); }} className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${attachmentType==='file' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600/50'}`}><PaperClipIcon className="w-5 h-5"/> File</button>
                         </div>
                         {attachmentType === 'file' ? (
                            <input type="file" onChange={handleFileChange} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50 file:mr-4 file:py-2.5 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-purple-200 hover:file:bg-slate-600" />
                         ) : (
                            <input type="text" value={attachmentValue} onChange={(e) => setAttachmentValue(e.target.value)} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500" placeholder="https://example.com/proof.pdf" />
                         )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                    <button onClick={handlePreview} disabled={!notes.trim()} className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-black font-bold py-2 px-4 rounded-md transition-colors">Preview & Continue</button>
                </div>
            </div>
        </div>
    )
}

interface PreviewCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    task: EmployeeTask;
    details: { completionNotes: string; completionAttachment?: { type: 'file' | 'link'; value: string; fileInfo?: FileInfo } };
}

const PreviewCompletionModal: React.FC<PreviewCompletionModalProps> = ({ isOpen, onClose, onConfirm, task, details }) => {
    if (!isOpen) return null;
    return (
         <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[60] p-4">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-lg border border-neutral-700">
                <div className="flex justify-between items-start mb-4">
                     <h2 className="text-xl font-bold text-white">Confirm Completion</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <p className="text-sm font-medium text-slate-400">Task</p>
                        <p className="text-white">{task.service} for {task.customerName}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-slate-400">Notes</p>
                        <p className="text-white bg-slate-800/60 p-3 rounded-md whitespace-pre-wrap">{details.completionNotes}</p>
                    </div>
                    {details.completionAttachment?.value && (
                        <div>
                            <p className="text-sm font-medium text-slate-400">Attachment</p>
                            <div className="flex items-center gap-2 bg-slate-800/60 p-3 rounded-md">
                                {details.completionAttachment.type === 'link' ? <LinkIcon className="w-5 h-5 text-purple-300"/> : <PaperClipIcon className="w-5 h-5 text-purple-300"/>}
                                <span className="text-white truncate">{details.completionAttachment.value}</span>
                            </div>
                        </div>
                    )}
                </div>
                 <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Back to Edit</button>
                    <button onClick={onConfirm} className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded-md transition-colors">Confirm & Save</button>
                </div>
            </div>
        </div>
    )
}

// Admin-only modal for editing task status in preview
interface EditTaskStatusModalProps {
    task: EmployeeTask;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStatus: TaskStatus) => void;
}

const EditTaskStatusModal: React.FC<EditTaskStatusModalProps> = ({ task, isOpen, onClose, onSave }) => {
    const [status, setStatus] = useState<TaskStatus>(task.status);

    useEffect(() => {
        if(isOpen) {
            setStatus(task.status);
        }
    }, [isOpen, task.status]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(status);
    };
    
    // Admins can change status between these. 'Completed' has its own flow.
    const availableStatuses: TaskStatus[] = ['Assigned', 'In Progress', 'Blocked'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-md border border-neutral-700">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <EditIcon className="h-6 w-6 text-cyan-400" />
                        <h2 className="text-xl font-bold text-white">Edit Task Status</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>
                <p className="text-neutral-300 mb-6">Change the status for task: <span className="font-bold text-white">{task.service}</span></p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="taskStatus" className="block text-sm font-medium text-neutral-300 mb-1.5">Status</label>
                        <select 
                            id="taskStatus" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value as TaskStatus)} 
                            className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                        >
                            {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md transition-colors">Save Status</button>
                </div>
            </div>
        </div>
    )
}


interface EmployeeDashboardProps {
    user: User;
    allUsers: User[];
    allJobs: Job[];
    onUpdateTaskStatus: (
        jobId: string, 
        department: string, 
        serviceName: string, 
        status: TaskStatus,
        assignmentId: string,
        details?: { completionNotes: string; completionAttachment?: { type: 'file' | 'link', value: string, fileInfo?: FileInfo } }
    ) => void;
    onTogglePause: (action: 'pause' | 'resume', userForAction?: User) => void;
    activityLogs: ActivityLog[];
    employeeUIConfig: EmployeeUIConfig;
    onUnassignTask: (jobId: string, department: string, serviceName: string, assignmentId: string) => void;
    isPreviewMode?: boolean;
}

const ComparativeBarChart: React.FC<{ label: string, myValue: number, teamValue: number, unit: string }> = ({ label, myValue, teamValue, unit }) => {
    const max = Math.max(myValue, teamValue, 1);
    const myPercentage = (myValue / max) * 100;
    const teamPercentage = (teamValue / max) * 100;
    
    return (
        <div>
            <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>
            <div className="space-y-2.5">
                <div className="flex items-center gap-2 group">
                    <span className="text-xs font-bold text-cyan-400 w-12 text-right transition-colors">{myValue.toFixed(1)}{unit}</span>
                    <div className="flex-1 bg-slate-700/50 rounded-full h-4 overflow-hidden">
                        <div className="bg-cyan-500 h-4 rounded-full transition-all duration-500 ease-out" style={{ width: `${myPercentage}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-400 w-8">You</span>
                </div>
                <div className="flex items-center gap-2 group">
                    <span className="text-xs font-bold text-purple-400 w-12 text-right transition-colors">{teamValue.toFixed(1)}{unit}</span>
                    <div className="flex-1 bg-slate-700/50 rounded-full h-4 overflow-hidden">
                        <div className="bg-purple-500 h-4 rounded-full transition-all duration-500 ease-out" style={{ width: `${teamPercentage}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-400 w-8">Avg</span>
                </div>
            </div>
        </div>
    );
};

const TaskPieChart: React.FC<{ data: {[key: string]: number}, title: string }> = ({ data, title }) => {
    const colors: {[key:string]: string} = {
        'Completed': '#22c55e', // green-500
        'In Progress': '#eab308', // yellow-500
        'Blocked': '#ef4444', // red-500
        'Assigned': '#3b82f6', // blue-500
    };
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);

    if (total === 0) {
        return <div className="flex flex-col items-center justify-center h-full text-center">
            <ChartPieIcon className="w-12 h-12 text-slate-600 mb-2" />
            <p className="text-slate-400">No tasks assigned in the current billing cycle.</p>
        </div>
    }

    const segments = Object.entries(data).map(([key, value]) => ({
        label: key,
        value,
        percentage: (value / total) * 100,
        color: colors[key],
    }));

    const conicGradient = segments.map((s, i) => {
        const start = i === 0 ? 0 : segments.slice(0, i).reduce((acc, curr) => acc + curr.percentage, 0);
        const end = start + s.percentage;
        return `${s.color} ${start}% ${end}%`;
    }).join(', ');
    
    return (
        <div className="flex flex-col items-center justify-center gap-y-4 animate-fadeIn w-full h-full">
            <h3 className="text-xl font-bold text-white mb-4 self-start">{title}</h3>
            <div className="flex-grow flex items-center justify-center w-full flex-col sm:flex-row gap-x-8 gap-y-4">
                <div 
                    className="w-36 h-36 rounded-full transform transition-transform duration-500 hover:scale-105" 
                    style={{ background: `conic-gradient(${conicGradient})` }}
                    aria-label="Task status pie chart"
                ></div>
                <div className="space-y-2.5">
                    {segments.map(s => (
                        s.value > 0 &&
                        <div key={s.label} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }}></div>
                            <span className="text-sm text-slate-300 w-24">{s.label}:</span>
                            <span className="font-bold text-white tabular-nums">{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, allUsers, allJobs, onUpdateTaskStatus, onTogglePause, activityLogs, employeeUIConfig, onUnassignTask, isPreviewMode = false }) => {
    const [now, setNow] = useState(new Date());
    const [taskToComplete, setTaskToComplete] = useState<EmployeeTask | null>(null);
    const [taskToEdit, setTaskToEdit] = useState<EmployeeTask | null>(null);
    const [completionDetails, setCompletionDetails] = useState<any>(null);
    const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
    const [taskToUnassign, setTaskToUnassign] = useState<EmployeeTask | null>(null);

     useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const myTasks = useMemo((): EmployeeTask[] => {
        if (!user.fullName) return [];
        const tasks: EmployeeTask[] = [];
        allJobs.forEach(job => {
            if (job.assignedTo) {
                Object.entries(job.assignedTo).forEach(([department, services]) => {
                    Object.entries(services).forEach(([serviceName, assignments]) => {
                        assignments.forEach(assignment => {
                             if(assignment.employee === user.fullName && !tasks.some(t => t.assignmentId === assignment.assignmentId)) {
                                tasks.push({ ...assignment, jobId: job.id, customerName: job.customerName, department, service: serviceName });
                             }
                        });
                    });
                });
            }
        });
        
        const statusOrder: { [key in TaskStatus]: number } = { 'In Progress': 1, 'Assigned': 2, 'Blocked': 3, 'Completed': 4 };
        return tasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }, [allJobs, user.fullName]);

    const teamMetrics = useMemo(() => {
        const employeeUsers = allUsers.filter(u => u.role === 'Employee' && u.username !== user.username);
        if (employeeUsers.length === 0) return { avgDailyDuration: 0, avgBillingCycleDuration: 0, avgTaskCompletionRate: 0 };
        const teamAttendanceData = calculateAttendanceData(employeeUsers, activityLogs, getBillingCycle(now), true, now);
        const totalDaily = teamAttendanceData.reduce((acc, curr) => acc + curr.dailyDuration, 0);
        const totalBillingCycle = teamAttendanceData.reduce((acc, curr) => acc + curr.billingCycleDuration, 0);
        let totalTasks = 0, totalCompletedTasks = 0;
        employeeUsers.forEach(emp => allJobs.forEach(job => {
            if (job.assignedTo) Object.values(job.assignedTo).forEach(services => Object.values(services).forEach(assignments => {
                const lastAssignment = assignments[assignments.length - 1];
                if (lastAssignment?.employee === emp.fullName) { totalTasks++; if (lastAssignment.status === 'Completed') totalCompletedTasks++; }
            }));
        }));
        return { 
            avgDailyDuration: totalDaily / employeeUsers.length, 
            avgBillingCycleDuration: totalBillingCycle / employeeUsers.length, 
            avgTaskCompletionRate: totalTasks > 0 ? (totalCompletedTasks / totalTasks) * 100 : 0 
        };
    }, [allUsers, allJobs, activityLogs, now, user.username]);

    const myMetrics = useMemo(() => {
        const myTotalTasks = myTasks.filter(t => t.status !== 'Blocked').length;
        const myCompletedTasks = myTasks.filter(t => t.status === 'Completed').length;
        const myAttendance = calculateAttendanceData([user], activityLogs, getBillingCycle(now), true, now)[0];
        return {
            dailyDuration: myAttendance?.dailyDuration || 0,
            billingCycleDuration: myAttendance?.billingCycleDuration || 0,
            taskCompletionRate: myTotalTasks > 0 ? (myCompletedTasks / myTotalTasks) * 100 : 0,
            attendanceRecord: myAttendance,
        };
    }, [myTasks, user, activityLogs, now]);

    const effectivenessTip = useMemo(() => {
        const { billingCycleDuration, taskCompletionRate } = myMetrics;
        const { avgBillingCycleDuration, avgTaskCompletionRate } = teamMetrics;
        if (taskCompletionRate < avgTaskCompletionRate - 10) return "Your task completion rate is below the team average. Focus on moving tasks to 'Completed'.";
        if (billingCycleDuration < avgBillingCycleDuration * 0.85) return "Your total work time this cycle is lower than the team average. Ensure you're logging all your work hours.";
        if (taskCompletionRate > avgTaskCompletionRate + 10) return "Great work! Your task completion rate is well above average. Keep up the excellent productivity!";
        return "You're keeping pace with the team's performance metrics. Continue the great work and stay consistent!";
    }, [myMetrics, teamMetrics]);

    const monthlyTaskSummary = useMemo(() => {
        const summary: {[key in TaskStatus]: number} = { 'Completed': 0, 'In Progress': 0, 'Blocked': 0, 'Assigned': 0 };
        myTasks.forEach(task => {
            const job = allJobs.find(j => j.id === task.jobId);
            if (job && new Date(job.jobCreatedDate) >= getBillingCycle(now).start) summary[task.status]++;
        });
        return summary;
    }, [myTasks, allJobs, now]);
    
    const handlePreviewCompletion = (details: { completionNotes: string; completionAttachment?: { type: 'file' | 'link'; value: string; fileInfo?: FileInfo; } }) => {
        setCompletionDetails(details);
        setPreviewModalOpen(true);
    };

    const handleConfirmCompletion = () => {
        if (taskToComplete && completionDetails) {
            onUpdateTaskStatus(taskToComplete.jobId, taskToComplete.department, taskToComplete.service, 'Completed', taskToComplete.assignmentId, completionDetails);
            setTaskToComplete(null);
            setCompletionDetails(null);
            setPreviewModalOpen(false);
        }
    };
    
    const handleUnassignClick = (task: EmployeeTask) => {
        setTaskToUnassign(task);
    };

    const handleSaveTaskStatus = (newStatus: TaskStatus) => {
        if (taskToEdit) {
            onUpdateTaskStatus(taskToEdit.jobId, taskToEdit.department, taskToEdit.service, newStatus, taskToEdit.assignmentId);
            setTaskToEdit(null);
        }
    };
    
    const handlePauseToggleForCard = (action: 'pause' | 'resume') => {
        onTogglePause(action, user);
    };

    const handleStatusChange = (task: EmployeeTask, newStatus: TaskStatus) => onUpdateTaskStatus(task.jobId, task.department, task.service, newStatus, task.assignmentId);
    const getStatusChip = (status: TaskStatus) => ({
        'Assigned': <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/60 text-blue-300">Assigned</span>,
        'In Progress': <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900/60 text-yellow-300">In Progress</span>,
        'Blocked': <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/60 text-red-300">Blocked</span>,
        'Completed': <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/60 text-green-300">Completed</span>,
    })[status] || null;

    const getActionButton = (task: EmployeeTask) => {
        const commonButtonClass = "text-xs font-bold py-1 px-3 rounded-md transition-colors";
        switch (task.status) {
            case 'Assigned': return <button onClick={() => handleStatusChange(task, 'In Progress')} className={`bg-cyan-500 hover:bg-cyan-400 text-black ${commonButtonClass}`}>Start Work</button>;
            case 'In Progress': return <button onClick={() => setTaskToComplete(task)} className={`bg-green-500 hover:bg-green-400 text-black ${commonButtonClass}`}>Complete</button>;
            case 'Blocked': return <span className="text-red-400 font-semibold text-xs">Re-Assigned</span>;
            case 'Completed': return <span className="text-green-400 font-semibold flex items-center justify-end gap-1.5 text-xs"><CheckIcon className="w-4 h-4" />Done</span>;
            default: return null;
        }
    };
    
    const renderCard = (cardConfig: EmployeeUICard) => {
        const shapeClass = cardConfig.shape === 'sharp' ? 'rounded-none' : cardConfig.shape;
        const colorClass = {
            slate: 'bg-neutral-900/50 border-neutral-700/50',
            cyan: 'bg-cyan-900/20 border-cyan-700/50',
            purple: 'bg-purple-900/20 border-purple-700/50',
            green: 'bg-green-900/20 border-green-700/50',
        }[cardConfig.color];

        switch(cardConfig.component) {
            case 'PerformanceCard':
                return (
                    <div className={`${colorClass} border ${shapeClass} p-6`}>
                        <h3 className="text-xl font-bold text-white mb-4">{cardConfig.title}</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                            <div className="lg:col-span-2 space-y-6">
                                <ComparativeBarChart label="Today's Work Time" myValue={myMetrics.dailyDuration / 3600} teamValue={teamMetrics.avgDailyDuration / 3600} unit="h" />
                                <ComparativeBarChart label="Billing Cycle Time" myValue={myMetrics.billingCycleDuration / 3600} teamValue={teamMetrics.avgBillingCycleDuration / 3600} unit="h" />
                                <ComparativeBarChart label="Task Completion Rate" myValue={myMetrics.taskCompletionRate} teamValue={teamMetrics.avgTaskCompletionRate} unit="%" />
                            </div>
                            <div className="bg-slate-800/60 p-4 rounded-lg flex flex-col justify-center items-start">
                                 <div className="flex items-center gap-3 mb-3"><LightBulbIcon className="h-6 w-6 text-amber-300"/><h4 className="font-semibold text-white">Effectiveness Tip</h4></div>
                                 <p className="text-slate-300 text-sm">{effectivenessTip}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'AttendanceCard':
                return myMetrics.attendanceRecord ? 
                    <EmployeeAttendanceCard record={myMetrics.attendanceRecord} isArchivedView={false} showControls={true} onTogglePause={handlePauseToggleForCard} pendingTaskCount={myTasks.filter(t => t.status !== 'Completed' && t.status !== 'Blocked').length}/> 
                    : <div className="h-full bg-neutral-900/50 border border-neutral-700/50 rounded-xl p-5 flex flex-col justify-center items-center"><p className="text-neutral-500">Could not load attendance data.</p></div>;
            case 'TaskSummaryCard':
                return (
                    <div className={`${colorClass} border ${shapeClass} p-6 h-full flex flex-col justify-center items-center`}>
                        <TaskPieChart data={monthlyTaskSummary} title={cardConfig.title}/>
                    </div>
                );
            case 'TasksTable':
                const tasksTableConfig = employeeUIConfig.find(c => c.id === 'tasksTable');
                if (!tasksTableConfig) return null;
                return (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-white mb-4">{cardConfig.title}</h3>
                        <div className={`${colorClass} border ${shapeClass} shadow-lg`}>
                            <div className="overflow-y-auto max-h-[420px]">
                                <table className="min-w-full divide-y divide-neutral-700/50">
                                    <thead className="bg-neutral-800/60 sticky top-0">
                                        <tr>
                                            {tasksTableConfig.columns?.task?.visible && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">{tasksTableConfig.columns.task.label}</th>}
                                            {tasksTableConfig.columns?.status?.visible && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">{tasksTableConfig.columns.status.label}</th>}
                                            {tasksTableConfig.columns?.action?.visible && <th scope="col" className="relative px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">{tasksTableConfig.columns.action.label}</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800/80">
                                        {myTasks.length === 0 ? (
                                            <tr><td colSpan={Object.values(tasksTableConfig.columns || {}).filter(c => c.visible).length} className="text-center py-16 text-neutral-500">You have no tasks assigned.</td></tr>
                                        ) : (                                            
                                            myTasks.map((task) => (
                                                <tr key={task.assignmentId} className="hover:bg-neutral-800/70 transition-colors">
                                                    {tasksTableConfig.columns?.task?.visible && (
                                                        <td className="px-6 py-4 align-top">
                                                            <div className="text-sm font-medium text-white">{task.service}</div>
                                                            <div className="text-sm text-neutral-400 mb-2">{task.customerName}</div>
                                                            {task.taskDetails && <p className="text-sm text-neutral-200 bg-neutral-800/50 p-2 rounded-md my-2 whitespace-pre-wrap">{task.taskDetails}</p>}
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs mt-2">
                                                                {task.taskDeadline && (
                                                                    <div className="text-amber-400 font-semibold flex items-center gap-1">
                                                                        <ClockIcon className="w-4 h-4" />
                                                                        <span>Deadline: {new Date(task.taskDeadline).toLocaleString()}</span>
                                                                    </div>
                                                                )}
                                                                {task.taskAttachments && task.taskAttachments.length > 0 && (
                                                                    <div className="flex items-center gap-2">
                                                                        {task.taskAttachments.map((att, i) => {
                                                                            if (att.type === 'link') {
                                                                                return <a key={i} href={att.value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 hover:underline"><LinkIcon className="w-4 h-4" /> View Link</a>
                                                                            }
                                                                            if (att.type === 'file' && att.fileInfo) {
                                                                                const fileSize = att.fileInfo.size > 1024 * 1024 ? `${(att.fileInfo.size / (1024 * 1024)).toFixed(2)} MB` : `${(att.fileInfo.size / 1024).toFixed(1)} KB`;
                                                                                return <button key={i} onClick={() => alert(`File: ${att.fileInfo?.name}\nSize: ${fileSize}`)} className="flex items-center gap-1 text-purple-400 hover:text-purple-300 hover:underline"><PaperClipIcon className="w-4 h-4" /> View File</button>
                                                                            }
                                                                            return null;
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                    {tasksTableConfig.columns?.status?.visible && <td className="px-6 py-4 whitespace-nowrap align-top">{getStatusChip(task.status)}</td>}
                                                    {tasksTableConfig.columns?.action?.visible && <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                                                        <div className="flex flex-col items-end gap-2">
                                                            {getActionButton(task)}
                                                            {isPreviewMode && task.status !== 'Completed' && tasksTableConfig.actions?.taskEditing && <button onClick={() => setTaskToEdit(task)} className="p-1.5 rounded-md hover:bg-neutral-700 transition-colors" title="Edit Task"><EditIcon className="w-4 h-4 text-cyan-400"/></button>}
                                                            {isPreviewMode && task.status !== 'Completed' && tasksTableConfig.actions?.taskDeleting && <button onClick={() => handleUnassignClick(task)} className="p-1.5 rounded-md hover:bg-neutral-700 transition-colors" title="Delete Task"><DeleteIcon className="w-4 h-4 text-red-500"/></button>}
                                                        </div>
                                                    </td>}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <DashboardTemplate title="My Dashboard">
            {taskToComplete && <CompletionModal isOpen={!!taskToComplete} task={taskToComplete} onClose={() => setTaskToComplete(null)} onPreview={handlePreviewCompletion} />}
            {taskToComplete && isPreviewModalOpen && <PreviewCompletionModal isOpen={isPreviewModalOpen} task={taskToComplete} details={completionDetails} onClose={() => setPreviewModalOpen(false)} onConfirm={handleConfirmCompletion} />}
            {taskToEdit && <EditTaskStatusModal isOpen={!!taskToEdit} task={taskToEdit} onClose={() => setTaskToEdit(null)} onSave={handleSaveTaskStatus} />}
            
            {isPreviewMode && taskToUnassign && (
                <ConfirmationModal
                    isOpen={!!taskToUnassign}
                    onClose={() => setTaskToUnassign(null)}
                    onConfirm={() => {
                        if (taskToUnassign) {
                            onUnassignTask(taskToUnassign.jobId, taskToUnassign.department, taskToUnassign.service, taskToUnassign.assignmentId);
                            setTaskToUnassign(null);
                        }
                    }}
                    title="Permanently Remove Task"
                    message={
                        <p>
                            Are you sure you want to unassign and permanently remove the task
                            <span className="font-bold text-white"> "{taskToUnassign.service}"</span> from this employee?
                            This action is irreversible.
                        </p>
                    }
                    confirmText="Yes, Remove Task"
                    confirmButtonClass="bg-red-600 hover:bg-red-500"
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {employeeUIConfig.map(cardConfig => {
                    if (!cardConfig.visible) return null;
                    const widthClass = cardConfig.width === 'full' ? 'lg:col-span-2' : 'lg:col-span-1';
                    return (
                        <div key={cardConfig.id} className={widthClass}>
                            {renderCard(cardConfig)}
                        </div>
                    )
                })}
            </div>
        </DashboardTemplate>
    );
};