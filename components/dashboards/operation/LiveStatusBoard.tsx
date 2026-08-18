import React from 'react';
import { Job, TaskStatus, JobAssignment } from '../../../types';
import { LinkIcon, PaperClipIcon } from '../../common/Icons';

interface LiveStatusBoardProps {
    allJobs: Job[];
}

const getStatusChip = (status: TaskStatus) => {
    switch (status) {
        case 'Assigned': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-900/60 text-blue-300">Assigned</span>;
        case 'In Progress': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900/60 text-yellow-300">In Progress</span>;
        case 'Blocked': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-900/60 text-red-300">Blocked</span>;
        case 'Completed': return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900/60 text-green-300">Completed</span>;
        default: return null;
    }
};

const AttachmentDisplay: React.FC<{ assignment: JobAssignment }> = ({ assignment }) => {
    if (!assignment.completionAttachment) return null;

    const attachment = assignment.completionAttachment;

    if (attachment.type === 'link') {
        return (
            <a href={attachment.value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors mt-1" title={attachment.value}>
                <LinkIcon className="w-4 h-4" />
                <span>View Link</span>
            </a>
        );
    }

    if (attachment.type === 'file' && attachment.fileInfo) {
        const file = attachment.fileInfo;
        const fileSize = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`;
        const fileDetails = `File: ${file.name}\nType: ${file.type}\nSize: ${fileSize}`;
        return (
             <button onClick={() => alert(fileDetails)} className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors mt-1" title={file.name}>
                <PaperClipIcon className="w-4 h-4" />
                <span>View File</span>
            </button>
        );
    }
    
    return null;
}


export const LiveStatusBoard: React.FC<LiveStatusBoardProps> = ({ allJobs }) => {
    
    const activeJobs = allJobs.filter(job => job.isAssigned);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Live Job Status Board</h2>
            <p className="text-neutral-400 max-w-3xl">An overview of all active jobs and the real-time status of each assigned task.</p>
            
            {activeJobs.length === 0 && (
                <div className="text-center py-16 text-neutral-500">
                    <p>No jobs have been assigned to Operations yet.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeJobs.map(job => (
                    <div key={job.id} className="glass-card rounded-lg border border-neutral-700/50 shadow-lg flex flex-col">
                        <div className="p-4 border-b border-neutral-700/50">
                            <h3 className="font-bold text-white truncate">{job.customerName}</h3>
                            <p className="text-sm text-neutral-400">{job.companyName}</p>
                            <p className="text-xs text-neutral-500 mt-1">Due: {job.deadlineDate ? new Date(job.deadlineDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="p-4 flex-grow space-y-3">
                            {job.assignedTo && Object.keys(job.assignedTo).length > 0 ? (
                                Object.entries(job.assignedTo).map(([dept, services]) => (
                                    Object.entries(services).map(([serviceName, assignments]) => {
                                        if (!assignments || assignments.length === 0) return null;
                                        const lastAssignment = assignments[assignments.length - 1];

                                        return (
                                             <div key={`${dept}-${serviceName}`} className="bg-neutral-900/50 p-3 rounded-md">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-neutral-200">{serviceName}</p>
                                                        <p className="text-xs text-neutral-400">{lastAssignment.employee} <span className="text-neutral-500">({dept})</span></p>
                                                    </div>
                                                    {getStatusChip(lastAssignment.status)}
                                                </div>
                                                {lastAssignment.status === 'Completed' && lastAssignment.completionNotes && (
                                                    <div className="mt-2 pt-2 border-t border-neutral-700/60 text-xs text-neutral-300">
                                                        <p className="whitespace-pre-wrap">{lastAssignment.completionNotes}</p>
                                                        <AttachmentDisplay assignment={lastAssignment} />
                                                    </div>
                                                )}
                                                {lastAssignment.status !== 'Completed' && lastAssignment.liveStatusUpdate && (
                                                    <div className="mt-2 pt-2 border-t border-neutral-700/60 text-xs text-neutral-300">
                                                        <p className="truncate" title={lastAssignment.liveStatusUpdate}>{lastAssignment.liveStatusUpdate}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })
                                ))
                            ) : (
                                <p className="text-sm text-center text-neutral-500 italic py-4">No tasks assigned for this job yet.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
