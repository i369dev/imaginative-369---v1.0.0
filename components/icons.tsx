import React from 'react';
import { User } from '../types';
import DashboardPlaceholder from '../services/geminiService';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    
    return (
        <div className="w-full max-w-6xl h-[90vh] flex flex-col bg-gray-900/50 border border-gray-800 rounded-lg shadow-2xl">
            <header className="flex justify-between items-center p-4 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-baseline gap-3">
                    <h1 className="font-logo text-2xl text-white">imaginative 369</h1>
                    <span className="text-gray-400 font-medium">{user.role} Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300">Welcome, <span className="font-semibold text-white capitalize">{user.username}</span></span>
                    <button 
                        onClick={onLogout}
                        className="border border-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="flex-grow p-6 overflow-y-auto">
                <DashboardPlaceholder title={`${user.role} Dashboard`} />
            </main>
        </div>
    );
};

export default Dashboard;