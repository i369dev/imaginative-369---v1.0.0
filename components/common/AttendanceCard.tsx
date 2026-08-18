import React from 'react';
import { AttendanceRecord } from '../../types';
import { UserIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, PauseIcon, PlayIcon, BriefcaseIcon } from './Icons';
import { formatDuration, formatDurationWithSeconds } from '../../utils/attendance';

// --- UI COMPONENTS ---
export const CircularProgress: React.FC<{ percentage: number; size?: number; strokeWidth?: number; children: React.ReactNode }> = ({ percentage, size = 70, strokeWidth = 6, children }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(100, percentage) / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle stroke="rgba(255,255,255,0.1)" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
                <circle
                    stroke="url(#progressGradient)" fill="transparent" strokeWidth={strokeWidth} strokeLinecap="round" r={radius} cx={size / 2} cy={size / 2}
                    style={{ strokeDasharray: circumference, strokeDashoffset: offset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">{children}</div>
        </div>
    );
};

export const LinearProgressBar: React.FC<{ value: number; max: number; label: string }> = ({ value, max, label }) => {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-medium text-slate-300">{label}</span>
                <span className="text-sm font-bold text-rose-300">{formatDuration(value)}</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full" style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
        </div>
    );
};

interface EmployeeAttendanceCardProps {
    record: AttendanceRecord;
    isArchivedView: boolean;
    showControls?: boolean;
    onTogglePause?: (action: 'pause' | 'resume') => void;
    pendingTaskCount?: number;
}


export const EmployeeAttendanceCard: React.FC<EmployeeAttendanceCardProps> = ({ record, isArchivedView, showControls = false, onTogglePause, pendingTaskCount }) => {
    const WORKDAY_SECONDS = 8 * 60 * 60;
    const MONTHLY_OVERTIME_TARGET = 10 * 3600;

    const getBlinkClass = (status: 'Logged In' | 'Logged Out' | 'Paused') => {
        if (isArchivedView) return '';
        switch (status) {
            case 'Logged In': return 'animate-blink-green';
            case 'Logged Out': return 'animate-blink-red';
            case 'Paused': return 'animate-blink-yellow';
            default: return '';
        }
    };

    const renderSessionControls = () => {
        if (!showControls || !onTogglePause) return null;
        if (record.status === 'Logged In') {
            return (
                <button onClick={() => onTogglePause('pause')} className="flex w-full items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-4 rounded-md transition-colors text-base">
                    <PauseIcon className="w-5 h-5" />
                    Pause Session
                </button>
            );
        }
        if (record.status === 'Paused') {
            return (
                 <button onClick={() => onTogglePause('resume')} className="flex w-full items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-black font-bold py-2.5 px-4 rounded-md transition-colors text-base">
                    <PlayIcon className="w-5 h-5" />
                    Resume Session
                </button>
            );
        }
        return <p className="text-center text-sm text-slate-400 py-2">Session is logged out.</p>;
    };

    return (
        <div className={`bg-gradient-to-tr from-slate-900 to-slate-800/80 rounded-2xl shadow-2xl border border-slate-700/50 p-5 flex flex-col gap-4 transform hover:scale-[1.02] transition-transform duration-300 ${getBlinkClass(record.status)}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-slate-600">
                        {record.profilePicPreview ? <img src={record.profilePicPreview} alt={record.fullName} className="h-full w-full object-cover" /> : <UserIcon className="h-8 w-8 text-slate-500" />}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-400">{record.fullName}</h3>
                        <div className="flex items-center gap-2">
                             <span className={`h-2.5 w-2.5 rounded-full ${record.status === 'Logged In' ? 'bg-teal-400' : record.status === 'Paused' ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
                            <div className={`text-sm font-semibold flex items-center gap-1.5 ${record.status === 'Logged In' ? 'text-teal-300' : record.status === 'Paused' ? 'text-amber-300' : 'text-slate-400'}`}>
                                {record.status === 'Paused' && <PauseIcon className="w-3 h-3"/>}
                                {record.status}
                            </div>
                        </div>
                    </div>
                </div>
                 {pendingTaskCount !== undefined && (
                     <div className="flex items-center gap-2 bg-slate-800/50 text-sm px-3 py-1 rounded-full self-start">
                        <BriefcaseIcon className="w-4 h-4 text-purple-300" />
                        <span className="font-bold text-white">{pendingTaskCount}</span>
                        <span className="text-slate-300">pending tasks</span>
                     </div>
                )}
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
                 {!isArchivedView && (
                    <div className="bg-slate-900/50 p-2 rounded-lg">
                        <CircularProgress percentage={(record.dailyDuration / WORKDAY_SECONDS) * 100}>
                            <span className="text-amber-300 font-bold text-base tracking-tighter">{formatDurationWithSeconds(record.dailyDuration)}</span>
                        </CircularProgress>
                        <span className="text-xs text-slate-400 mt-1 block">Today</span>
                    </div>
                 )}
                <div className={`bg-slate-900/50 p-2 rounded-lg flex flex-col justify-center ${isArchivedView ? 'col-span-3' : 'col-span-2'}`}>
                    <div className="text-2xl font-bold text-cyan-300">{formatDuration(isArchivedView ? record.totalDuration : record.weeklyDuration)}</div>
                    <span className="text-xs text-slate-400">{isArchivedView ? 'Total in Archive' : 'This Week'}</span>
                    <div className="flex justify-center items-center gap-4 mt-2 text-xs text-slate-300">
                        <div className="flex items-center gap-1"><ArrowRightOnRectangleIcon className="w-4 h-4 text-green-400" /> {record.loginCount}</div>
                        <div className="flex items-center gap-1"><ArrowLeftOnRectangleIcon className="w-4 h-4 text-red-400" /> {record.logoutCount}</div>
                    </div>
                </div>
            </div>

             {!isArchivedView && (
                 <div className="bg-slate-900/50 p-3 rounded-lg">
                     <LinearProgressBar value={record.overtimeDuration} max={MONTHLY_OVERTIME_TARGET} label="Monthly Overtime" />
                 </div>
             )}
            
            {showControls && <div className="border-t border-slate-700/50 pt-3">{renderSessionControls()}</div>}
        </div>
    );
};
