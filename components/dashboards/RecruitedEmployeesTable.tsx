import React from 'react';
import { User } from '../../types';
import { UserIcon as ProfilePlaceholderIcon } from '../common/Icons';


export const RecruitedEmployeesTable: React.FC<{ employees: User[] }> = ({ employees }) => {
    return (
        <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-neutral-700/50">
                    <thead className="bg-neutral-800/60">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Employee</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Contact Information</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Designations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                        {employees.length === 0 ? (
                            <tr><td colSpan={3} className="text-center py-8 text-neutral-500">No employees have been recruited yet.</td></tr>
                        ) : (
                            employees.map((user) => (
                                <tr key={user.username} className="hover:bg-neutral-800/70 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {user.profilePicPreview ? (
                                                    <img className="h-10 w-10 rounded-full object-cover" src={user.profilePicPreview} alt={`${user.fullName} profile`} />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center">
                                                        <ProfilePlaceholderIcon className="h-6 w-6 text-neutral-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{user.fullName || 'N/A'}</div>
                                                <div className="text-sm text-neutral-400">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-200">{user.email || 'No email provided'}</div>
                                        <div className="text-sm text-neutral-400">{user.contactNo || 'No contact provided'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {user.designations && user.designations.length > 0 ? 
                                                user.designations.map(d => <span key={d} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-700 text-neutral-200">{d}</span>)
                                                : <span className="text-neutral-500 italic">No designations</span>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};