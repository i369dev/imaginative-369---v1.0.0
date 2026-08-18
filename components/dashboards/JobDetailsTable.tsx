import React from 'react';
import { Job } from '../../types';
import { CheckIcon, DeleteIcon } from '../common/Icons';

interface JobDetailsTableProps {
    jobs: Job[];
    onViewClick?: (job: Job) => void;
    onAssignClick?: (job: Job) => void;
    onActionClick?: (job: Job) => void;
    onDeleteClick?: (job: Job) => void;
    actionText?: string;
}
export const JobDetailsTable: React.FC<JobDetailsTableProps> = ({ jobs, onViewClick, onAssignClick, onActionClick, onDeleteClick, actionText }) => {
    return (
        <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-neutral-700/50">
                     <thead className="bg-neutral-800/60">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Company</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date Created</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Deadline</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                        {jobs.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-neutral-500">No jobs have been created yet.</td></tr>
                        )}
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-neutral-800/70 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{job.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{job.companyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{new Date(job.jobCreatedDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{job.deadlineDate ? new Date(job.deadlineDate).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex items-center justify-center space-x-2">
                                        {onViewClick && <button onClick={() => onViewClick(job)} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">View Details</button>}
                                        {onActionClick && actionText && <button onClick={() => onActionClick(job)} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors px-2">{actionText}</button>}
                                        {onAssignClick && (job.isAssigned ? (
                                            <span className="text-green-400 font-semibold flex items-center gap-1.5 px-3 py-1 bg-green-900/50 rounded-full">
                                                <CheckIcon className="w-4 h-4" />
                                                Assigned
                                            </span>
                                        ) : (
                                            <button onClick={() => onAssignClick(job)} className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors px-2">Assign to Ops</button>
                                        ))}
                                        {onDeleteClick && (
                                            <button onClick={() => onDeleteClick(job)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors" title="Delete job">
                                                <DeleteIcon className="w-5 h-5 text-neutral-400 hover:text-red-500"/>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};