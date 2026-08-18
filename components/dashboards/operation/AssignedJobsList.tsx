

import React, { useState, useMemo, useEffect } from 'react';
import { Job, JobServiceDetail, User, JobAssignment, JobAttachment, FileInfo, TaskStatus } from '../../../types';
import { CloseIcon, FileIcon, PlusIcon, LinkIcon, PaperClipIcon, ClockIcon } from '../../common/Icons';
import { DashboardTemplate } from '../../common/UI';

const getStatusChip = (status: TaskStatus) => {
    switch (status) {
        case 'Assigned': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/60 text-blue-300">Assigned</span>;
        case 'In Progress': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900/60 text-yellow-300">In Progress</span>;
        case 'Blocked': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/60 text-red-300">Blocked</span>;
        case 'Completed': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/60 text-green-300">Completed</span>;
        default: return null;
    }
};

// --- NEW MODAL FOR ASSIGNING A TASK ---
interface AssignTaskModalProps {
    onClose: () => void;
    onAssign: (taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[] }) => void;
    assignableEmployees: User[];
    serviceName: string;
}

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({ onClose, onAssign, assignableEmployees, serviceName }) => {
    const [employee, setEmployee] = useState('');
    const [taskDetails, setTaskDetails] = useState('');
    const [taskDeadline, setTaskDeadline] = useState('');
    const [attachmentType, setAttachmentType] = useState<'link' | 'file'>('link');
    const [attachmentValue, setAttachmentValue] = useState('');
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachmentValue(file.name); // Using Data URL to simulate upload
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setFileInfo({ name: file.name, type: file.type, size: file.size });
            };
            reader.readAsDataURL(file);
        } else {
            setAttachmentValue('');
            setFileInfo(null);
        }
    };

    const handleSubmit = () => {
        if (!employee) {
            alert('You must select an employee.');
            return;
        }
        if (!taskDetails.trim()) {
            alert('Task details cannot be empty.');
            return;
        }

        let attachments: JobAttachment[] = [];
        if (attachmentValue.trim()) {
            attachments.push({
                type: attachmentType,
                value: attachmentValue,
                fileInfo: fileInfo || undefined
            });
        }

        onAssign({
            employee,
            taskDetails,
            taskDeadline: taskDeadline || undefined,
            taskAttachments: attachments.length > 0 ? attachments : undefined
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[60] p-4">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-2xl border border-neutral-700">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">Assign Task: <span className="text-cyan-400">{serviceName}</span></h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Employee Select */}
                    <div>
                        <label htmlFor="employee" className="block text-sm font-medium text-neutral-300 mb-1.5">Assign To</label>
                        <select id="employee" value={employee} onChange={e => setEmployee(e.target.value)} required className="w-full shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                            <option value="" disabled>Select an employee...</option>
                            {assignableEmployees.map(u => <option key={u.username} value={u.fullName!}>{u.fullName}</option>)}
                        </select>
                    </div>
                    {/* Task Details */}
                    <div>
                        <label htmlFor="taskDetails" className="block text-sm font-medium text-neutral-300 mb-1.5">Task Details (Required)</label>
                        <textarea id="taskDetails" value={taskDetails} onChange={e => setTaskDetails(e.target.value)} required rows={4} className="w-full shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" placeholder="Provide a clear description of the task..."/>
                    </div>
                    {/* Deadline */}
                    <div>
                        <label htmlFor="taskDeadline" className="block text-sm font-medium text-neutral-300 mb-1.5">Deadline (Optional)</label>
                        <input type="datetime-local" id="taskDeadline" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} className="w-full shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"/>
                    </div>
                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Attachment (Optional)</label>
                        <div className="flex bg-slate-800/60 rounded-md p-1 space-x-1 mb-2">
                            <button onClick={() => { setAttachmentType('link'); setAttachmentValue(''); setFileInfo(null); }} className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${attachmentType==='link' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600/50'}`}><LinkIcon className="w-5 h-5"/> Link</button>
                            <button onClick={() => { setAttachmentType('file'); setAttachmentValue(''); setFileInfo(null); }} className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${attachmentType==='file' ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600/50'}`}><PaperClipIcon className="w-5 h-5"/> File</button>
                        </div>
                        {attachmentType === 'file' ? (
                            <input type="file" onChange={handleFileChange} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50 file:mr-4 file:py-2.5 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-purple-200 hover:file:bg-slate-600" />
                        ) : (
                            <input type="text" value={attachmentValue} onChange={e => setAttachmentValue(e.target.value)} className="w-full shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" placeholder="https://example.com/brief.pdf" />
                        )}
                    </div>
                </div>
                 <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button type="button" onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md">Assign Task</button>
                </div>
            </div>
        </div>
    );
};

// --- JOB DETAILS MODAL (REFACTORED) ---
interface JobDetailsModalProps {
    job: Job | null;
    departmentName: string;
    onClose: () => void;
    users: User[];
    onAssignTaskToEmployee: (jobId: string, department: string, serviceName: string, taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[] }) => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, departmentName, onClose, users, onAssignTaskToEmployee }) => {
    const [assigningToService, setAssigningToService] = useState<string | null>(null);

    if (!job) return null;

    const getRelevantService = (): JobServiceDetail | null => {
        if (departmentName === 'Graphic Design' && job.graphicDesign) return job.graphicDesign;
        if (departmentName === 'Video Editing' && job.videoProduction) return job.videoProduction;
        if (departmentName === 'Videography' && job.videoProduction) return job.videoProduction;
        if (departmentName === 'Photography' && job.photography) return job.photography;
        if (departmentName === 'Social Media Managing' && job.digitalMarketing) return job.digitalMarketing;
        return null;
    };
    const serviceDetails = getRelevantService();

    const assignableEmployees = useMemo(() => {
        return users.filter(u => u.designations?.includes(departmentName) && u.fullName);
    }, [users, departmentName]);

    return (
        <>
            {assigningToService && (
                <AssignTaskModal
                    serviceName={assigningToService}
                    assignableEmployees={assignableEmployees}
                    onClose={() => setAssigningToService(null)}
                    onAssign={(taskData) => onAssignTaskToEmployee(job.id, departmentName, assigningToService, taskData)}
                />
            )}
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
                <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-4xl border border-neutral-700">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-white">Job Details for <span className="text-cyan-400">{departmentName}</span></h2>
                        <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="w-6 w-6"/></button>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-3">Client Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-neutral-900/50 p-4 rounded-lg">
                                <div><p className="text-sm text-neutral-400">Customer</p><p className="text-lg text-white">{job.customerName}</p></div>
                                <div><p className="text-sm text-neutral-400">Company</p><p className="text-lg text-white">{job.companyName}</p></div>
                                <div><p className="text-sm text-neutral-400">Deadline</p><p className="text-lg text-white">{job.deadlineDate ? new Date(job.deadlineDate).toLocaleDateString() : 'N/A'}</p></div>
                            </div>
                        </div>
                        {job.documents.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Attached Documents</h3>
                                <ul className="border border-neutral-700 rounded-md divide-y divide-neutral-700">
                                    {job.documents.map(doc => (
                                        <li key={doc.name} className="px-3 py-2 flex items-center gap-2 text-sm bg-neutral-800/50">
                                            <FileIcon className="h-5 w-5 text-neutral-400" />
                                            <span className="text-neutral-200">{doc.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {serviceDetails && serviceDetails.enabled && (
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-3">Service Requirements &amp; Tasks</h3>
                                <div className="space-y-4">
                                    {serviceDetails.services.length > 0 ? (
                                        serviceDetails.services.map((serviceName) => (
                                            <div key={serviceName} className="bg-neutral-900/50 p-4 rounded-lg">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="text-lg font-semibold text-neutral-200">{serviceName}</h4>
                                                    <button 
                                                        onClick={() => setAssigningToService(serviceName)}
                                                        className="flex items-center gap-1.5 bg-cyan-600/50 hover:bg-cyan-600 text-white font-bold py-1.5 px-3 rounded-md text-sm transition-colors"
                                                    >
                                                        <PlusIcon className="w-4 h-4"/> Assign Task
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    {job.assignedTo?.[departmentName]?.[serviceName]?.length > 0 ? (
                                                        job.assignedTo[departmentName][serviceName].map((assignment: JobAssignment) => (
                                                            <div key={assignment.assignmentId} className="bg-neutral-800/60 p-3 rounded-md border-l-4 border-neutral-700">
                                                                <div className="flex justify-between items-center">
                                                                    <p className="font-semibold text-neutral-100">{assignment.employee}</p>
                                                                    {getStatusChip(assignment.status)}
                                                                </div>
                                                                <p className="text-sm text-neutral-300 mt-2 whitespace-pre-wrap">{assignment.taskDetails}</p>
                                                                {assignment.taskDeadline && (
                                                                    <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 mt-2">
                                                                        <ClockIcon className="w-4 h-4" />
                                                                        <span>Deadline: {new Date(assignment.taskDeadline).toLocaleString()}</span>
                                                                    </div>
                                                                )}
                                                                {assignment.taskAttachments && assignment.taskAttachments.length > 0 && (
                                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                                                        {assignment.taskAttachments.map((att, i) => (
                                                                            <a key={i} href={att.value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-xs">
                                                                                {att.type === 'link' ? <LinkIcon className="w-4 h-4"/> : <PaperClipIcon className="w-4 h-4"/>}
                                                                                <span className="truncate max-w-[200px]">{att.value}</span>
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-neutral-500 italic text-center py-2">No employees assigned to this task yet.</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-neutral-500 italic">No specific services for this department on this job.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md">Close</button>
                    </div>
                </div>
            </div>
        </>
    );
};


// --- MAIN DEPARTMENT COMPONENT ---

interface AssignedJobsListProps {
    jobs: Job[];
    departmentName: string;
    users: User[];
    onAssignTaskToEmployee: (jobId: string, department: string, serviceName: string, taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[]; }) => void;
}

export const AssignedJobsList: React.FC<AssignedJobsListProps> = ({ jobs, departmentName, users, onAssignTaskToEmployee }) => {
    const [viewingJob, setViewingJob] = useState<Job | null>(null);

    // This useEffect hook is the key to the real-time update.
    // When a task is assigned, the `jobs` prop changes. This effect will find
    // the updated job data for the currently open modal (`viewingJob`) and refresh its state.
    useEffect(() => {
        if (viewingJob) {
            const updatedJob = jobs.find(j => j.id === viewingJob.id);
            if (updatedJob) {
                // By setting the state to the new job object from props,
                // we ensure the modal re-renders with the latest data.
                setViewingJob(updatedJob);
            } else {
                // If the job is no longer in the list (e.g., archived), close the modal.
                setViewingJob(null);
            }
        }
    }, [jobs, viewingJob?.id]); // Depend on the jobs array and the ID of the job being viewed.

    return (
        <DashboardTemplate title={`${departmentName} Dashboard`}>
            {viewingJob && (
                <JobDetailsModal
                    job={viewingJob}
                    departmentName={departmentName}
                    onClose={() => setViewingJob(null)}
                    users={users}
                    onAssignTaskToEmployee={onAssignTaskToEmployee}
                />
            )}
            <p className="text-neutral-400 mb-6 max-w-3xl">
                Jobs that require {departmentName} services are listed below. Click on a job to view details and assign tasks to employees.
            </p>
            <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
                <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full divide-y divide-neutral-700/50">
                        <thead className="bg-neutral-800/60">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Services Required</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Deadline</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/80">
                            {jobs.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-16 text-neutral-500">No jobs assigned to this department yet.</td></tr>
                            )}
                            {jobs.map((job) => {
                                const relevantServiceKey = departmentName === 'Graphic Design' ? 'graphicDesign' :
                                                          departmentName === 'Video Editing' ? 'videoProduction' :
                                                          departmentName === 'Videography' ? 'videoProduction' :
                                                          departmentName === 'Photography' ? 'photography' :
                                                          'digitalMarketing';

                                const serviceDetail = job[relevantServiceKey as keyof Job] as JobServiceDetail;
                                
                                const assignedServicesCount = serviceDetail.services.reduce((acc, serviceName) => {
                                    const hasAssignment = (job.assignedTo?.[departmentName]?.[serviceName]?.length || 0) > 0;
                                    return acc + (hasAssignment ? 1 : 0);
                                }, 0);
                                const totalTasks = serviceDetail.services.length;
                                
                                let overallStatus = 'Pending';
                                if (totalTasks > 0) {
                                    if (assignedServicesCount === 0) {
                                        overallStatus = 'Pending Assignment';
                                    } else if (assignedServicesCount < totalTasks) {
                                        overallStatus = 'Partially Assigned';
                                    } else {
                                        overallStatus = 'All Tasks Assigned';
                                    }
                                }

                                return (
                                <tr key={job.id} className="hover:bg-neutral-800/70 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{job.customerName}</div>
                                        <div className="text-sm text-neutral-400">{job.companyName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 max-w-sm">
                                            {serviceDetail.services.map(s => <span key={s} className="px-2 text-xs font-semibold rounded-full bg-neutral-700 text-neutral-200">{s}</span>)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{job.deadlineDate ? new Date(job.deadlineDate).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            overallStatus === 'Pending Assignment' ? 'bg-red-900/60 text-red-300' :
                                            overallStatus === 'Partially Assigned' ? 'bg-yellow-900/60 text-yellow-300' :
                                            overallStatus === 'All Tasks Assigned' ? 'bg-green-900/60 text-green-300' :
                                            'bg-neutral-700 text-neutral-300'
                                        }`}>
                                            {overallStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setViewingJob(job)} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">View Details</button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardTemplate>
    );
};
