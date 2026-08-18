import React, { useState, useEffect } from 'react';
import { User, UserRoles, Job, Products, ActivityLog, CameraEquipment, EmployeeUIConfig, AllEmployeeUIConfigs, TaskStatus, FileInfo } from '../../types';
import { Card, DashboardTemplate, InputField, CustomCheckbox, ConfirmationModal, ArchivedItemDetailsModal } from '../common/UI';
import { ChartIcon, UsersIcon, BriefcaseIcon, ShieldIcon, UploadIcon, FileIcon, CloseIcon, EditIcon, DeleteIcon, UserIcon, ArchiveBoxIcon, ArrowUturnLeftIcon, InformationCircleIcon, ClipboardDocumentListIcon } from '../common/Icons';
import { JobDetailsTable } from './JobDetailsTable';
import { SystemActivitiesDashboard } from './SystemActivitiesDashboard';
import { InterfaceControlDashboard } from './admin';


// --- SERVICE CONSTANTS --
const designationOptions = [
    'Graphic Design', 'Video Editing', 'Photography', 'Videography',
    'Social Media Managing', 'Marketing', 'Finance', 'HR and Administration'
];

// --- USER MANAGEMENT MODAL ---

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onSave: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<User>({ ...user, password: '' });

    useEffect(() => {
        setFormData({ ...user, password: '' });
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleDesignationChange = (designation: string) => {
        setFormData(prev => {
            const currentDesignations = prev.designations || [];
            const newDesignations = currentDesignations.includes(designation)
                ? currentDesignations.filter(d => d !== designation)
                : [...currentDesignations, designation];
            return { ...prev, designations: newDesignations };
        });
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-3xl border border-neutral-700">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white">Edit User: <span className="text-cyan-400">{user.username}</span></h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <InputField id="fullName" label="Full Name" value={formData.fullName || ''} onChange={handleInputChange} />
                         <InputField id="email" label="E-mail Address" type="email" value={formData.email || ''} onChange={handleInputChange} />
                         <InputField id="contactNo" label="Contact No" type="tel" value={formData.contactNo || ''} onChange={handleInputChange} />
                         <InputField id="idNo" label="ID No" value={formData.idNo || ''} onChange={handleInputChange} />
                         <div className="md:col-span-2">
                             <label htmlFor="address" className="block text-sm font-medium text-neutral-300 mb-1.5">Address</label>
                             <textarea id="address" name="address" rows={3} value={formData.address || ''} onChange={handleInputChange} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500" />
                         </div>
                    </div>
                    <div className="border-t border-neutral-700/60 pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-neutral-300 mb-1.5">User Role</label>
                                <select id="role" value={formData.role} onChange={handleInputChange} className="mt-1 shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500">
                                    {UserRoles.map(role => <option key={role} value={role} className="bg-neutral-800 text-white">{role}</option>)}
                                </select>
                            </div>
                            <InputField id="password" label="New Password" type="password" placeholder="Leave blank to keep current" value={formData.password || ''} onChange={handleInputChange} />
                        </div>
                         {formData.role === 'Employee' && (
                            <div>
                                <label className="block text-sm font-medium text-neutral-300">Job Description (Designations)</label>
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                                    {designationOptions.map(option => (
                                        <CustomCheckbox
                                            key={option}
                                            id={`designation-${option.replace(/\s+/g, '-')}`}
                                            label={option}
                                            checked={formData.designations?.includes(option) || false}
                                            onChange={() => handleDesignationChange(option)}
                                        />
                                    ))}
                                </div>
                            </div>
                         )}
                    </div>
                </div>
                 <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


// --- USER MANAGEMENT TABLE ---

interface UserManagementTableProps {
    users: User[];
    onEditUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onEditUser, onDeleteUser }) => {
    return (
        <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-neutral-700/50">
                    <thead className="bg-neutral-800/60">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Details</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Designations</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                        {users.map((user) => (
                            <tr key={user.username} className="hover:bg-neutral-800/70 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {user.profilePicPreview ? (
                                                <img className="h-10 w-10 rounded-full object-cover" src={user.profilePicPreview} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center">
                                                    <UserIcon className="h-6 w-6 text-neutral-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">{user.fullName || 'N/A'}</div>
                                            <div className="text-sm text-neutral-400">@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="text-neutral-200">{user.email || 'N/A'}</div>
                                    <div className="text-neutral-400">{user.contactNo || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-900/50 text-cyan-300">{user.role}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                    <div>ID: {user.idNo || 'N/A'}</div>
                                    <div className="text-neutral-400">Addr: {user.address || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="flex flex-wrap gap-1">
                                        {user.designations && user.designations.length > 0 ? 
                                            user.designations.map(d => <span key={d} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-700 text-neutral-200">{d}</span>)
                                            : <span className="text-neutral-500 italic text-xs">Not Applicable</span>
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button onClick={() => onEditUser(user)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors" title="Edit user"><EditIcon className="w-5 h-5 text-neutral-400 hover:text-cyan-400"/></button>
                                        <button onClick={() => onDeleteUser(user)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors" title="Delete user"><DeleteIcon className="w-5 h-5 text-neutral-400 hover:text-red-500"/></button>
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

// --- JOB EDIT MODAL ---
interface EditJobModalProps {
    job: Job;
    onClose: () => void;
    onSave: (job: Job) => void;
    products: Products;
}

const EditJobModal: React.FC<EditJobModalProps> = ({ job, onClose, onSave, products }) => {
    const [formData, setFormData] = useState<Job>({...job});
    const [documents, setDocuments] = useState<{name: string}[]>(job.documents || []);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setFormData({...job});
        setDocuments(job.documents || []);
    }, [job]);

    if (!formData) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value} as Job));
    };
    
    const handleServiceToggle = (service: 'graphicDesign' | 'videoProduction' | 'photography' | 'digitalMarketing') => {
        setFormData(prev => ({ ...prev, [service]: { ...prev[service], enabled: !prev[service].enabled }}));
    };

    const handleServiceSelectionChange = (service: 'graphicDesign' | 'videoProduction' | 'photography' | 'digitalMarketing', option: string) => {
        setFormData(prev => {
            const currentServices = prev[service].services;
            const newServices = currentServices.includes(option) ? currentServices.filter(s => s !== option) : [...currentServices, option];
            return { ...prev, [service]: { ...prev[service], services: newServices } };
        });
    };
    
    const handleServiceDescriptionChange = (service: 'graphicDesign' | 'videoProduction' | 'photography' | 'digitalMarketing', value: string) => {
        setFormData(prev => ({ ...prev, [service]: { ...prev[service], description: value } }));
    };
    
    const handleFileAction = (files: FileList | null) => {
        if (files && files.length > 0) {
            const newDocs = Array.from(files).map(f => ({ name: f.name }));
            setDocuments(prev => {
                const uniqueNewDocs = newDocs.filter(nd => !prev.some(ed => ed.name === nd.name));
                return [...prev, ...uniqueNewDocs];
            });
        }
    };
    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileAction(e.dataTransfer.files); e.dataTransfer.clearData(); };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => handleFileAction(e.target.files);
    const removeDocument = (fileName: string) => setDocuments(prev => prev.filter(doc => doc.name !== fileName));
    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { handleDragEvents(e); if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { handleDragEvents(e); setIsDragging(false); };
    
    const handleSave = () => { onSave({ ...formData, documents }); onClose(); };

    const renderServiceBlock = ( serviceKey: 'graphicDesign' | 'videoProduction' | 'photography' | 'digitalMarketing', title: string) => {
        const options = products[serviceKey].map(s => s.name);
        return (
            <><CustomCheckbox id={`edit-${serviceKey}-toggle`} label={title} checked={formData[serviceKey].enabled} onChange={() => handleServiceToggle(serviceKey)} />
                {formData[serviceKey].enabled && (
                    <div className="pl-8 py-4 border-l-2 border-neutral-700 space-y-4 ml-2.5">
                        <div><label className="block text-sm font-medium text-neutral-300">Select Services</label><div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">{options.map(option => (<CustomCheckbox key={`edit-${option}`} id={`edit-${serviceKey}-service-${option.replace(/\s+/g, '-')}`} label={option} checked={formData[serviceKey].services.includes(option)} onChange={() => handleServiceSelectionChange(serviceKey, option)} />))}</div></div>
                        <div><label htmlFor={`edit-${serviceKey}-description`} className="block text-sm font-medium text-neutral-300">Description</label><textarea id={`edit-${serviceKey}-description`} rows={4} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500" placeholder={`Details...`} value={formData[serviceKey].description} onChange={(e) => handleServiceDescriptionChange(serviceKey, e.target.value)} /></div>
                    </div>
                )}
            </>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-4xl border border-neutral-700">
                 <div className="flex justify-between items-start mb-6"><h2 className="text-2xl font-bold text-white">Edit Job Details</h2><button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="w-6 h-6"/></button></div>
                <div className="max-h-[75vh] overflow-y-auto pr-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <InputField id="customerName" label="Customer Name" value={formData.customerName} onChange={handleInputChange} />
                            <InputField id="companyName" label="Company Name" value={formData.companyName} onChange={handleInputChange} />
                            <InputField id="contactNo" label="Contact No" type="tel" value={formData.contactNo} onChange={handleInputChange} />
                            <InputField id="email" label="E-mail Address" type="email" value={formData.email} onChange={handleInputChange} />
                            <InputField id="deadlineDate" label="Deadline Date" type="date" value={formData.deadlineDate} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-6">
                            <div><label className="block text-sm font-medium text-neutral-300">Documents</label><div onDrop={handleFileDrop} onDragOver={handleDragEvents} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-cyan-500' : 'border-neutral-700'} border-dashed rounded-md`}><div className="space-y-1 text-center"><UploadIcon className="mx-auto h-10 w-10 text-neutral-500" /><div className="flex text-sm text-neutral-400"><label htmlFor="edit-job-file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-cyan-400 hover:text-cyan-300"><span>Upload new files</span><input id="edit-job-file-upload" name="edit-job-file-upload" type="file" className="sr-only" multiple onChange={handleFileSelect}/></label><p className="pl-1">or drag and drop</p></div></div></div></div>
                            {documents.length > 0 && (<div className="space-y-2"><h4 className="text-sm font-medium text-neutral-300">Uploaded Documents:</h4><ul className="border border-neutral-700 rounded-md divide-y divide-neutral-700 max-h-40 overflow-y-auto">{documents.map(doc => (<li key={doc.name} className="px-3 py-2 flex items-center justify-between text-sm"><div className="flex items-center gap-2"><FileIcon className="h-5 w-5 text-neutral-400"/><span className="text-neutral-200">{doc.name}</span></div><button onClick={() => removeDocument(doc.name)} className="text-neutral-500 hover:text-red-500"><CloseIcon className="h-4 w-4"/></button></li>))}</ul></div>)}
                        </div>
                    </div>
                    <div className="border-t border-neutral-700/60 pt-6"><h3 className="text-lg font-medium text-white">Job Services</h3><div className="mt-4 space-y-4">{renderServiceBlock('graphicDesign', 'Graphic Design')}{renderServiceBlock('videoProduction', 'Video Production')}{renderServiceBlock('photography', 'Photography')}{renderServiceBlock('digitalMarketing', 'Digital Media Marketing')}</div></div>
                </div>
                <div className="mt-6 flex justify-end space-x-4 border-t border-neutral-700/60 pt-6">
                    <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

// --- ADMIN DASHBOARD ---
interface AdminDashboardProps {
    users: User[];
    jobs: Job[];
    onUpdateUser: (user: User) => void;
    onDeleteUser: (username: string) => void;
    onUpdateJob: (job: Job) => void;
    onDeleteJob: (jobId: string) => void;
    onUnassignTask: (jobId: string, department: string, serviceName: string, assignmentId: string) => void;
    onUpdateTaskStatus: (jobId: string, department: string, serviceName: string, status: TaskStatus, assignmentId: string, details?: { completionNotes: string; completionAttachment?: { type: 'file' | 'link'; value: string; fileInfo?: FileInfo; }; }) => void;
    allJobs: Job[];
    products: Products;
    equipment: CameraEquipment[];
    // Archive props
    archivedUsers: User[];
    archivedJobs: Job[];
    onRestoreUser: (username: string) => void;
    onPermanentDeleteUser: (username: string) => void;
    onRestoreJob: (jobId: string) => void;
    onPermanentDeleteJob: (jobId: string) => void;
    // System Activities
    activityLogs: ActivityLog[];
    // Employee UI Config
    allEmployeeUIConfigs: AllEmployeeUIConfigs;
    onUpdateEmployeeUIConfig: (username: string, config: EmployeeUIConfig) => void;
    onTogglePause: (action: 'pause' | 'resume', userForAction?: User) => void;
}
export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const { 
        users, 
        jobs, 
        onUpdateUser, 
        onDeleteUser, 
        onUpdateJob, 
        onDeleteJob,
        products,
        equipment,
        archivedUsers,
        archivedJobs,
        onRestoreUser,
        onPermanentDeleteUser,
        onRestoreJob,
        onPermanentDeleteJob,
        activityLogs,
        allEmployeeUIConfigs,
        onUpdateEmployeeUIConfig,
        onUnassignTask,
        onUpdateTaskStatus,
        allJobs,
        onTogglePause,
    } = props;
    const [activeTab, setActiveTab] = useState('User Management');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    
    // State for modals
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<User | Job | null>(null);
    const [isPermanentDeleteModalOpen, setPermanentDeleteModalOpen] = useState(false);
    const [permanentDeleteAction, setPermanentDeleteAction] = useState<{ fn: () => void; message: React.ReactNode } | null>(null);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [itemToView, setItemToView] = useState<User | Job | null>(null);


    const tabs = ['User Management', 'Job Details', 'Interface Control', 'Archive', 'System Activities'];

    const handleSaveUser = (updatedUser: User) => {
        onUpdateUser(updatedUser);
        setEditingUser(null);
        alert(`User '${updatedUser.username}' has been updated.`);
    };
    
    const handleSaveJob = (updatedJob: Job) => {
        onUpdateJob(updatedJob);
        setEditingJob(null);
        alert(`Job ID ${updatedJob.id} has been updated.`);
    };
    
    // --- Delete Handlers ---
    const openDeleteConfirmation = (item: User | Job) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const confirmDeleteItem = () => {
        if (!itemToDelete) return;

        if ('username' in itemToDelete) { // It's a User
            onDeleteUser(itemToDelete.username);
        } else { // It's a Job
            onDeleteJob(itemToDelete.id);
        }
        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    // --- Permanent Delete Handlers ---
     const openPermanentDeleteConfirmation = (fn: () => void, message: React.ReactNode) => {
        setPermanentDeleteAction({ fn, message });
        setPermanentDeleteModalOpen(true);
    };

    const confirmPermanentDelete = () => {
        if (permanentDeleteAction) {
            permanentDeleteAction.fn();
        }
        setPermanentDeleteModalOpen(false);
        setPermanentDeleteAction(null);
    };
    
    // --- View Details Handlers ---
    const handleViewDetails = (item: User | Job) => {
        setItemToView(item);
        setDetailsModalOpen(true);
    }

    const renderArchiveContent = () => (
         <div className="space-y-8">
            {/* Archived Users Table */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Archived Users</h3>
                <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
                    <div className="overflow-x-auto rounded-lg">
                        <table className="min-w-full divide-y divide-neutral-700/50">
                             <thead className="bg-neutral-800/60">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date Archived</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Archived By</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/80">
                                {archivedUsers.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-neutral-500">No users have been archived.</td></tr>
                                ) : (
                                    archivedUsers.map(user => (
                                        <tr key={user.username} className="hover:bg-neutral-800/70 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{user.fullName || 'N/A'}</div>
                                                <div className="text-sm text-neutral-400">@{user.username}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{user.archivedDate ? new Date(user.archivedDate).toLocaleString() : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 capitalize">{user.archivedBy || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button onClick={() => handleViewDetails(user)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="View Details"><InformationCircleIcon className="w-5 h-5 text-neutral-400 group-hover:text-cyan-400"/></button>
                                                    <button onClick={() => onRestoreUser(user.username)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Restore User"><ArrowUturnLeftIcon className="w-5 h-5 text-neutral-400 group-hover:text-green-400"/></button>
                                                    <button onClick={() => openPermanentDeleteConfirmation(() => onPermanentDeleteUser(user.username), <p>Permanently delete user <span className="font-bold text-white">{user.username}</span>? This action is irreversible.</p>)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Delete Permanently"><DeleteIcon className="w-5 h-5 text-neutral-400 group-hover:text-red-500"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Archived Jobs Table */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Archived Jobs</h3>
                <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
                    <div className="overflow-x-auto rounded-lg">
                         <table className="min-w-full divide-y divide-neutral-700/50">
                             <thead className="bg-neutral-800/60">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Company</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date Archived</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Archived By</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/80">
                                {archivedJobs.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-neutral-500">No jobs have been archived.</td></tr>
                                ) : (
                                    archivedJobs.map(job => (
                                        <tr key={job.id} className="hover:bg-neutral-800/70 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{job.customerName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{job.companyName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{job.archivedDate ? new Date(job.archivedDate).toLocaleString() : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 capitalize">{job.archivedBy || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button onClick={() => handleViewDetails(job)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="View Details"><InformationCircleIcon className="w-5 h-5 text-neutral-400 group-hover:text-cyan-400"/></button>
                                                    <button onClick={() => onRestoreJob(job.id)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Restore Job"><ArrowUturnLeftIcon className="w-5 h-5 text-neutral-400 group-hover:text-green-400"/></button>
                                                    <button onClick={() => openPermanentDeleteConfirmation(() => onPermanentDeleteJob(job.id), <p>Permanently delete job for <span className="font-bold text-white">{job.customerName}</span>?</p>)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Delete Permanently"><DeleteIcon className="w-5 h-5 text-neutral-400 group-hover:text-red-500"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    const deleteModalMessage = itemToDelete ? `Are you sure you want to move this item to the archive? It can be restored later.` : '';
    const deleteModalTitle = itemToDelete ? `Archive ${'username' in itemToDelete ? `user '${itemToDelete.fullName}'` : `job for '${itemToDelete.customerName}'`}` : 'Archive Item';
    
    return (
        <DashboardTemplate title="System Administration">
            {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />}
            {editingJob && <EditJobModal job={editingJob} onClose={() => setEditingJob(null)} onSave={handleSaveJob} products={products} />}
            {isDetailsModalOpen && <ArchivedItemDetailsModal item={itemToView} onClose={() => setDetailsModalOpen(false)} />}
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteItem}
                title={deleteModalTitle}
                message={<p>{deleteModalMessage}</p>}
                confirmText="Yes, Archive It"
                confirmButtonClass="bg-orange-600 hover:bg-orange-500"
            />
            
            <ConfirmationModal
                isOpen={isPermanentDeleteModalOpen}
                onClose={() => setPermanentDeleteModalOpen(false)}
                onConfirm={confirmPermanentDelete}
                title="Permanent Deletion"
                message={permanentDeleteAction?.message}
                confirmText="Yes, Delete Permanently"
            />
            
            <div className="border-b border-neutral-800">
                <nav className="flex space-x-2 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm transition-colors focus:outline-none flex items-center gap-2 ${activeTab === tab ? 'bg-neutral-700/80 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
                           {tab === 'Archive' && <ArchiveBoxIcon className="w-5 h-5" />}
                           {tab === 'System Activities' && <ClipboardDocumentListIcon className="w-5 h-5" />}
                           {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'User Management' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card title="Total Users" value={users.length.toString()} icon={<UsersIcon />} />
                            <Card title="System Status" value="Operational" icon={<ChartIcon />} />
                            <Card title="Security Logs" value="All Clear" icon={<ShieldIcon />} />
                        </div>
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
                            <UserManagementTable users={users} onEditUser={setEditingUser} onDeleteUser={openDeleteConfirmation} />
                        </div>
                    </>
                )}
                 {activeTab === 'Job Details' && (
                    <>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card title="Total Jobs" value={jobs.length.toString()} icon={<BriefcaseIcon />} />
                             <Card title="Pending Review" value={jobs.filter(j => !j.deadlineDate).length.toString()} icon={<ChartIcon />} />
                            <Card title="System Status" value="Operational" icon={<ShieldIcon />} />
                        </div>
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-white mb-4">Job Details</h3>
                            <JobDetailsTable jobs={jobs} onActionClick={setEditingJob} onDeleteClick={openDeleteConfirmation} actionText="Edit Details" />
                        </div>
                    </>
                )}
                 {activeTab === 'Interface Control' && <InterfaceControlDashboard 
                     allConfigs={allEmployeeUIConfigs} 
                     onUpdate={onUpdateEmployeeUIConfig}
                     allUsers={users}
                     allJobs={allJobs}
                     activityLogs={activityLogs}
                     onUnassignTask={onUnassignTask}
                     onUpdateTaskStatus={onUpdateTaskStatus}
                     onTogglePause={onTogglePause}
                  />}
                {activeTab === 'Archive' && renderArchiveContent()}
                {activeTab === 'System Activities' && <SystemActivitiesDashboard 
                    activityLogs={activityLogs} 
                    users={users} 
                    jobs={jobs} 
                    equipment={equipment}
                    products={products}
                />}
            </div>
        </DashboardTemplate>
    );
};