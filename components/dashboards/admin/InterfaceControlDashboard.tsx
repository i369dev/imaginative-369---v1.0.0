import React, { useState, useMemo, useEffect } from 'react';
import { AllEmployeeUIConfigs, EmployeeUIConfig, EmployeeUICard, User, Job, ActivityLog, CardColor, CardShape, CardWidth, TaskStatus, FileInfo } from '../../../types';
import { DashboardTemplate } from '../../common/UI';
import { EditIcon, EyeIcon, EyeSlashIcon, ArrowUpIcon, ArrowDownIcon, CloseIcon, CheckIcon } from '../../common/Icons';
import { EmployeeDashboard } from '../EmployeeDashboard';

const colorOptions: { name: CardColor, class: string }[] = [
    { name: 'slate', class: 'bg-slate-500' },
    { name: 'cyan', class: 'bg-cyan-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'green', class: 'bg-green-500' },
];

const shapeOptions: { name: CardShape, label: string }[] = [
    { name: 'rounded-lg', label: 'Default' },
    { name: 'rounded-2xl', label: 'Softer' },
    { name: 'sharp', label: 'Sharp' },
];

const widthOptions: { name: CardWidth, label: string }[] = [
    { name: 'half', label: 'Half Width' },
    { name: 'full', label: 'Full Width' },
];

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void, label: string }> = ({ enabled, onChange, label }) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-300">{label}</span>
            <button
                type="button"
                className={`${enabled ? 'bg-cyan-500' : 'bg-neutral-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-neutral-900`}
                role="switch"
                aria-checked={enabled}
                onClick={() => onChange(!enabled)}
            >
                <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
            </button>
        </div>
    );
};

const EditCardModal: React.FC<{
    card: EmployeeUICard;
    onClose: () => void;
    onUpdate: (updatedCard: EmployeeUICard) => void;
}> = ({ card, onClose, onUpdate }) => {
    const [localCard, setLocalCard] = useState(card);

    const handleSave = () => {
        onUpdate(localCard);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-md border border-neutral-700">
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Edit: {card.title}</h2><button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6" /></button></div>
                <div className="space-y-6">
                    <div><label className="block text-sm font-medium text-neutral-300 mb-1.5">Title</label><input type="text" value={localCard.title} onChange={(e) => setLocalCard(p => ({ ...p, title: e.target.value }))} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" /></div>
                    <div><label className="block text-sm font-medium text-neutral-300 mb-2">Color</label><div className="flex gap-3">{colorOptions.map(c => <button key={c.name} onClick={() => setLocalCard(p => ({ ...p, color: c.name }))} className={`w-8 h-8 rounded-full ${c.class} ${localCard.color === c.name ? 'ring-2 ring-offset-2 ring-offset-neutral-800 ring-white' : ''}`}></button>)}</div></div>
                    <div><label className="block text-sm font-medium text-neutral-300 mb-2">Shape</label><div className="flex gap-2">{shapeOptions.map(s => <button key={s.name} onClick={() => setLocalCard(p => ({ ...p, shape: s.name }))} className={`px-4 py-1.5 rounded-md text-sm transition-colors ${localCard.shape === s.name ? 'bg-cyan-500 text-black' : 'bg-neutral-700 text-white hover:bg-neutral-600'}`}>{s.label}</button>)}</div></div>
                    <div><label className="block text-sm font-medium text-neutral-300 mb-2">Width</label><div className="flex gap-2">{widthOptions.map(w => <button key={w.name} onClick={() => setLocalCard(p => ({ ...p, width: w.name }))} className={`px-4 py-1.5 rounded-md text-sm transition-colors ${localCard.width === w.name ? 'bg-cyan-500 text-black' : 'bg-neutral-700 text-white hover:bg-neutral-600'}`}>{w.label}</button>)}</div></div>
                    
                    {localCard.component === 'TasksTable' && (<div className="border-t border-neutral-700 pt-4 space-y-3"><h4 className="font-semibold text-neutral-200">Task Actions</h4><ToggleSwitch label="Allow Task Editing" enabled={localCard.actions?.taskEditing || false} onChange={e => setLocalCard(p => ({ ...p, actions: { ...p.actions!, taskEditing: e } }))} /><ToggleSwitch label="Allow Task Deleting" enabled={localCard.actions?.taskDeleting || false} onChange={e => setLocalCard(p => ({ ...p, actions: { ...p.actions!, taskDeleting: e } }))} /></div>)}
                </div>
                <div className="mt-8 flex justify-end gap-3 border-t border-neutral-700/60 pt-5"><button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button><button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md">Save</button></div>
            </div>
        </div>
    );
};


interface InterfaceControlDashboardProps {
    allConfigs: AllEmployeeUIConfigs;
    onUpdate: (username: string, newConfig: EmployeeUIConfig) => void;
    allUsers: User[];
    allJobs: Job[];
    activityLogs: ActivityLog[];
    onUnassignTask: (jobId: string, department: string, serviceName: string, assignmentId: string) => void;
    onUpdateTaskStatus: (jobId: string, department: string, serviceName: string, status: TaskStatus, assignmentId: string, details?: { completionNotes: string; completionAttachment?: { type: 'file' | 'link'; value: string; fileInfo?: FileInfo; }; }) => void;
    onTogglePause: (action: 'pause' | 'resume', userForAction?: User) => void;
}

export const InterfaceControlDashboard: React.FC<InterfaceControlDashboardProps> = ({ allConfigs, onUpdate, allUsers, allJobs, activityLogs, onUnassignTask, onUpdateTaskStatus, onTogglePause }) => {
    const employeeUsers = useMemo(() => allUsers.filter(u => u.role === 'Employee'), [allUsers]);
    
    const [localConfig, setLocalConfig] = useState<EmployeeUIConfig>([]);
    const [selectedUsername, setSelectedUsername] = useState<string>(employeeUsers[0]?.username || '');
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);

    const selectedUser = useMemo(() => allUsers.find(u => u.username === selectedUsername), [allUsers, selectedUsername]);

    useEffect(() => {
        if (selectedUsername && !employeeUsers.some(u => u.username === selectedUsername)) {
            setSelectedUsername(employeeUsers[0]?.username || '');
        } else if (!selectedUsername && employeeUsers.length > 0) {
            setSelectedUsername(employeeUsers[0].username);
        }
    }, [employeeUsers, selectedUsername]);

    useEffect(() => {
        if (selectedUsername && allConfigs[selectedUsername]) {
            setLocalConfig(JSON.parse(JSON.stringify(allConfigs[selectedUsername])));
        } else {
            setLocalConfig([]);
        }
    }, [selectedUsername, allConfigs]);
    
    useEffect(() => {
        if (showSaveConfirm) {
            const timer = setTimeout(() => {
                setShowSaveConfirm(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSaveConfirm]);

    const handleUpdateCard = (updatedCard: EmployeeUICard) => {
        setLocalConfig(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    };

    const handleReorder = (index: number, direction: 'up' | 'down') => {
        const newConfig = [...localConfig];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newConfig.length) return;
        [newConfig[index], newConfig[targetIndex]] = [newConfig[targetIndex], newConfig[index]];
        setLocalConfig(newConfig);
    };

    const handleVisibilityChange = (id: string, isVisible: boolean) => {
        setLocalConfig(prev => prev.map(c => c.id === id ? { ...c, visible: isVisible } : c));
    };

    const handleSaveChanges = () => {
        if (selectedUsername) {
            onUpdate(selectedUsername, localConfig);
            setShowSaveConfirm(true);
        }
    };

    const editingCard = useMemo(() => localConfig.find(c => c.id === editingCardId), [localConfig, editingCardId]);

    return (
        <DashboardTemplate title="Employee Interface Control">
            {editingCard && <EditCardModal card={editingCard} onClose={() => setEditingCardId(null)} onUpdate={handleUpdateCard} />}
            {showSaveConfirm && (
                <div className="fixed top-20 right-6 z-50 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg animate-fade-in-out flex items-center gap-3">
                    <CheckIcon className="w-6 h-6" />
                    <span className="font-semibold">Changes saved successfully!</span>
                </div>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 space-y-6">
                    <div>
                        <label htmlFor="user-select" className="block text-sm font-medium text-neutral-300 mb-1.5">Select Employee for Preview</label>
                        <select id="user-select" value={selectedUsername} onChange={e => setSelectedUsername(e.target.value)} className="shadow-sm bg-neutral-900/60 border border-neutral-700 placeholder-neutral-500 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                             {employeeUsers.length === 0 && <option disabled>No employees found</option>}
                            {employeeUsers.map(u => <option key={u.username} value={u.username}>{u.fullName || u.username}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Dashboard Components</h3>
                        {localConfig.map((card, index) => (
                            <div key={card.id} className="glass-card p-3 rounded-lg flex items-center justify-between gap-2">
                                <span className="font-medium text-neutral-200 text-sm truncate">{card.title}</span>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button onClick={() => handleReorder(index, 'up')} disabled={index === 0} className="p-1.5 rounded-md hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUpIcon className="w-4 h-4 text-neutral-400" /></button>
                                    <button onClick={() => handleReorder(index, 'down')} disabled={index === localConfig.length - 1} className="p-1.5 rounded-md hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDownIcon className="w-4 h-4 text-neutral-400" /></button>
                                    <button onClick={() => handleVisibilityChange(card.id, !card.visible)} className="p-1.5 rounded-md hover:bg-neutral-700">{card.visible ? <EyeIcon className="w-5 h-5 text-green-400" /> : <EyeSlashIcon className="w-5 h-5 text-red-400" />}</button>
                                    <button onClick={() => setEditingCardId(card.id)} className="p-1.5 rounded-md hover:bg-neutral-700"><EditIcon className="w-4 h-4 text-cyan-400" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="pt-5 mt-3 border-t border-neutral-800"><button onClick={handleSaveChanges} disabled={!selectedUsername} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-6 rounded-md disabled:bg-neutral-600 disabled:cursor-not-allowed">Save Interface Changes</button></div>
                </div>
                
                <div className="xl:col-span-2">
                     <h3 className="text-lg font-semibold text-white mb-3">Live Preview: <span className="text-cyan-400">{selectedUser?.fullName || 'No employee selected'}</span></h3>
                     <div className="border-2 border-dashed border-neutral-700/80 rounded-xl p-1 bg-black/20 h-[85vh] overflow-y-auto">
                        {selectedUser ? (
                            <EmployeeDashboard 
                                user={selectedUser}
                                employeeUIConfig={localConfig}
                                allUsers={allUsers}
                                allJobs={allJobs}
                                activityLogs={activityLogs}
                                onUpdateTaskStatus={onUpdateTaskStatus}
                                onTogglePause={(action) => onTogglePause(action, selectedUser)}
                                onUnassignTask={onUnassignTask}
                                isPreviewMode={true}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-neutral-500">Select an employee to see a preview.</div>
                        )}
                     </div>
                </div>
            </div>
        </DashboardTemplate>
    );
};