import React from 'react';
import { ActivityLog } from '../../types';
import { ClipboardDocumentListIcon } from '../common/Icons';

interface ActivityLogTableProps {
    logs: ActivityLog[];
}

export const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ logs }) => {
    return (
        <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-neutral-700/50">
                    <thead className="bg-neutral-800/60">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Timestamp</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Performed By</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Action</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Target</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-16 text-neutral-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <ClipboardDocumentListIcon className="w-12 h-12" />
                                        <span>No activity logs found for the selected criteria.</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-neutral-800/70 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium capitalize">
                                        {log.user}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-900/60 text-cyan-300">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 font-mono">
                                        {log.targetId}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-300 max-w-md">
                                        {log.details}
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