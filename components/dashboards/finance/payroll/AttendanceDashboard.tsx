import React, { useState, useMemo, useEffect } from 'react';
import { User, ActivityLog, AttendanceRecord, ArchivedAttendanceMonth } from '../../../types';
import { UserIcon, Squares2X2Icon, ChartBarIcon, TableCellsIcon, DocumentArrowDownIcon } from '../../../common/Icons';
import { getBillingCycle, formatDuration, formatDurationWithSeconds, calculateAttendanceData } from '../../../../utils/attendance';
import { EmployeeAttendanceCard } from '../../../common/AttendanceCard';


// --- UI COMPONENTS ---
const AttendanceGraph: React.FC<{ data: AttendanceRecord[] }> = ({ data }) => {
    const [graphPeriod, setGraphPeriod] = useState<'daily' | 'weekly' | 'billing'>('billing');
    
    const { chartData, maxHours } = useMemo(() => {
        const periodKey = `${graphPeriod}Duration` as const;
        // Ensure data exists and has the key before mapping
        if (!data || data.length === 0 || !data[0].hasOwnProperty(periodKey)) {
             return { chartData: [], maxHours: 1 };
        }
        const maxDuration = Math.max(...data.map(d => d[periodKey]), 1); // Avoid division by zero
        const maxHours = Math.ceil(maxDuration / 3600) + 1;

        const chartData = data.map(d => ({
            name: d.fullName,
            hours: d[periodKey] / 3600,
        }));
        return { chartData, maxHours };
    }, [data, graphPeriod]);

    return (
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Work Hours Comparison</h3>
                <div className="flex bg-slate-800/60 rounded-md p-1 space-x-1">
                    {([['daily', 'Today'], ['weekly', 'This Week'], ['billing', 'Billing Cycle']] as const).map(([period, label]) => (
                         <button key={period} onClick={() => setGraphPeriod(period)} className={`px-3 py-1 text-sm font-medium rounded transition-colors ${graphPeriod === period ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600/50'}`}>{label}</button>
                    ))}
                </div>
            </div>
            <div className="w-full h-[500px] flex gap-4 pr-4">
                <div className="h-full flex flex-col justify-between text-right text-xs text-slate-400 py-6">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>{Math.round(maxHours * (1 - i/4))}h</span>)}
                </div>
                <div className="flex-grow grid grid-cols-12 gap-x-4 border-l border-slate-700/50 pl-4 h-full">
                    {chartData.map(d => (
                        <div key={d.name} className="flex flex-col justify-end items-center gap-2 h-full col-span-2 sm:col-span-1">
                            <div className="text-xs text-slate-400 font-bold">{d.hours.toFixed(1)}h</div>
                            <div className="w-full h-full bg-slate-800/50 rounded-t-lg flex flex-col justify-end" style={{ animation: `growUp 0.5s ease-out`}}>
                                <div className="bg-gradient-to-t from-purple-500 to-fuchsia-500 w-full rounded-t-md" style={{height: `${(d.hours / maxHours) * 100}%`, transition: 'height 0.5s ease-out'}}></div>
                            </div>
                            <div className="text-xs text-slate-300 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center" title={d.name}>{d.name.split(' ')[0]}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AttendanceTable: React.FC<{ data: AttendanceRecord[]; isArchived: boolean; now: Date }> = ({ data, isArchived, now }) => {
    return (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg shadow-lg">
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-slate-700/50">
                    <thead className="bg-slate-800/60">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                            {!isArchived && <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Today</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{isArchived ? 'Total in Archive' : 'This Week'}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Billing Cycle</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Logins / Logouts</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                        {data.map(d => (
                            <tr key={d.userId} className="hover:bg-slate-800/70">
                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-white">{d.fullName}</div><div className="text-xs text-slate-400">@{d.username}</div></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${d.status === 'Logged In' ? 'bg-teal-900/60 text-teal-300' : d.status === 'Paused' ? 'bg-amber-900/60 text-amber-300' : 'bg-slate-700 text-slate-300'}`}>{d.status}</span></td>
                                {!isArchived && <td className="px-6 py-4 whitespace-nowrap text-sm font-mono"><span className={`${d.status === 'Logged In' ? 'text-amber-300' : 'text-slate-400'}`}>{formatDurationWithSeconds(d.dailyDuration)}</span></td>}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDuration(isArchived ? d.totalDuration : d.weeklyDuration)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDuration(d.billingCycleDuration)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 text-center">{d.loginCount} / {d.logoutCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD ---
interface AttendanceDashboardProps {
    users: User[];
    activityLogs: ActivityLog[];
    archivedAttendance: ArchivedAttendanceMonth[];
    onArchiveAttendance: (archive: ArchivedAttendanceMonth) => void;
}

export const AttendanceDashboard: React.FC<AttendanceDashboardProps> = ({ users, activityLogs, archivedAttendance, onArchiveAttendance }) => {
    const [currentView, setCurrentView] = useState<'realtime' | 'custom' | 'archived'>('realtime');
    const [displayMode, setDisplayMode] = useState<'card' | 'graph' | 'raw'>('card');
    const [customStart, setCustomStart] = useState(new Date().toISOString().split('T')[0]);
    const [customEnd, setCustomEnd] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArchiveKey, setSelectedArchiveKey] = useState('');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    
    const period = useMemo(() => {
        if (currentView === 'custom') {
            const start = new Date(customStart); start.setHours(0,0,0,0);
            const end = new Date(customEnd); end.setHours(23,59,59,999);
            return { start, end };
        }
        const { start } = getBillingCycle(now);
        return { start, end: now }; // Realtime default up to now
    }, [currentView, customStart, customEnd, now]);

    const liveData = useMemo(() => calculateAttendanceData(users, activityLogs, period, true, now), [users, activityLogs, period, now]);

    const displayData = useMemo(() => {
        let data: AttendanceRecord[];
        if (currentView === 'archived' && selectedArchiveKey) {
            data = archivedAttendance.find(a => a.monthKey === selectedArchiveKey)?.records || [];
        } else {
            data = liveData;
        }
        if (searchTerm) {
            return data.filter(u => u.fullName === searchTerm);
        }
        return data.sort((a,b) => (b.status.length - a.status.length)); // Keep Logged In users on top
    }, [currentView, selectedArchiveKey, liveData, searchTerm, archivedAttendance]);

    const onlineCount = useMemo(() => liveData.filter(u => u.status === 'Logged In').length, [liveData]);

    const handleArchive = () => {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const { start, end } = getBillingCycle(fiveDaysAgo);
        
        const year = start.getFullYear();
        const monthKey = `${year}-${(start.getMonth() + 1).toString().padStart(2, '0')}`;
        const monthDisplay = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        
        const dataToArchive = calculateAttendanceData(users, activityLogs, {start, end}, false, new Date());
        const newArchive: ArchivedAttendanceMonth = { year, monthDisplay, monthKey, records: dataToArchive };
        onArchiveAttendance(newArchive);
    };
    
    const handleExport = () => {
        const isArchived = currentView === 'archived';
        
        const headers = isArchived
            ? ['Employee', 'Username', 'Total Logged Time', 'Login Count', 'Logout Count']
            : ['Employee', 'Username', 'Status', 'Today (HH:MM:SS)', 'This Week', 'Billing Cycle', 'Monthly Overtime', 'Login Count', 'Logout Count'];

        const rows = displayData.map(record => {
            const rowData = isArchived
                ? [
                    `"${record.fullName}"`,
                    record.username,
                    formatDuration(record.totalDuration),
                    record.loginCount,
                    record.logoutCount
                  ]
                : [
                    `"${record.fullName}"`,
                    record.username,
                    record.status,
                    formatDurationWithSeconds(record.dailyDuration),
                    formatDuration(record.weeklyDuration),
                    formatDuration(record.billingCycleDuration),
                    formatDuration(record.overtimeDuration),
                    record.loginCount,
                    record.logoutCount
                  ];
            return rowData.join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        
        const fileName = isArchived && selectedArchiveKey ? `attendance_archive_${selectedArchiveKey}.csv` : 'attendance_summary.csv';
        link.setAttribute("download", fileName);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const renderContent = () => {
        switch(displayMode) {
            case 'card':
                return <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">{displayData.map(record => <EmployeeAttendanceCard key={record.userId} record={record} isArchivedView={currentView === 'archived'} />)}</div>;
            case 'graph':
                return <AttendanceGraph data={displayData} />;
            case 'raw':
                return <AttendanceTable data={displayData} isArchived={currentView === 'archived'} now={now}/>;
            default:
                return null;
        }
    };
    
    return (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900 p-6 rounded-lg">
            <h2 className="text-3xl font-bold text-purple-300 tracking-tight mb-2">Employee Attendance</h2>
            <p className="text-slate-400 mb-6">Monitor real-time status, analyze historical data, and manage monthly payroll records.</p>
            
            <div className="space-y-4 mb-6 p-4 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                     <div>
                        <label className="text-sm font-semibold text-purple-200 mb-2 block">Data Source</label>
                        <div className="flex bg-slate-800/60 rounded-md p-1 space-x-1">
                            <button onClick={() => setCurrentView('realtime')} className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${currentView==='realtime' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-200 hover:bg-purple-600/50'}`}>
                                Real-time
                                {currentView === 'realtime' && (
                                    <>
                                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span></span>
                                        <span className="text-white/80">({onlineCount} Online)</span>
                                    </>
                                )}
                            </button>
                            <button onClick={() => setCurrentView('custom')} className={`px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${currentView==='custom' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-200 hover:bg-purple-600/50'}`}>Custom</button>
                            <button onClick={() => setCurrentView('archived')} className={`px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${currentView==='archived' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-200 hover:bg-purple-600/50'}`}>Archived</button>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-purple-200 mb-2 block">Display Mode</label>
                         <div className="flex bg-slate-800/60 rounded-md p-1 space-x-1">
                            <button onClick={() => setDisplayMode('card')} className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${displayMode==='card' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-200 hover:bg-purple-600/50'}`}><Squares2X2Icon className="w-5 h-5"/> Card</button>
                            <button onClick={() => setDisplayMode('graph')} className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${displayMode==='graph' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-200 hover:bg-purple-600/50'}`}><ChartBarIcon className="w-5 h-5"/> Graph</button>
                            <button onClick={() => setDisplayMode('raw')} className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded w-full transition-colors ${displayMode==='raw' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-200 hover:bg-purple-600/50'}`}><TableCellsIcon className="w-5 h-5"/> Raw</button>
                        </div>
                    </div>
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {currentView === 'custom' && (<>
                        <div><label className="text-sm font-semibold text-purple-200 mb-2 block">Start Date</label><input type="date" value={customStart} onChange={e=>setCustomStart(e.target.value)} className="w-full bg-slate-800/80 border-slate-700 text-white rounded p-2 focus:ring-purple-500 focus:border-purple-500" /></div>
                        <div><label className="text-sm font-semibold text-purple-200 mb-2 block">End Date</label><input type="date" value={customEnd} onChange={e=>setCustomEnd(e.target.value)} className="w-full bg-slate-800/80 border-slate-700 text-white rounded p-2 focus:ring-purple-500 focus:border-purple-500" /></div>
                    </>)}
                     {currentView === 'archived' && (<div>
                         <label className="text-sm font-semibold text-purple-200 mb-2 block">Select Archive</label>
                         <select value={selectedArchiveKey} onChange={e=>setSelectedArchiveKey(e.target.value)} className="w-full bg-slate-800/80 border-slate-700 text-white rounded p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="">Select a month...</option>
                            {archivedAttendance.map(a => <option key={a.monthKey} value={a.monthKey}>{a.year} - {a.monthDisplay}</option>)}
                         </select>
                    </div>)}
                    <div className="lg:col-span-1">
                        <label className="text-sm font-semibold text-purple-200 mb-2 block">Filter by Employee</label>
                         <select value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-800/80 border-slate-700 text-white rounded p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="">All Employees</option>
                            {users.filter(u => u.role !== 'Admin' && u.fullName).map(u => <option key={u.username} value={u.fullName!}>{u.fullName}</option>)}
                         </select>
                    </div>
                     <div className="flex items-end">
                        <button onClick={handleArchive} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-lg shadow-fuchsia-600/30">
                            Finalize & Archive Previous Month
                        </button>
                    </div>
                </div>
                {displayMode === 'raw' && displayData.length > 0 && (
                     <div className="flex justify-end pt-4 mt-4 border-t border-slate-700/50">
                        <button onClick={handleExport} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                            <DocumentArrowDownIcon className="w-5 h-5"/>
                            Export as CSV
                        </button>
                    </div>
                )}
            </div>

            {renderContent()}

            {displayData.length === 0 && <div className="text-center py-16 text-slate-500">No attendance data for selected criteria.</div>}
        </div>
    );
};
