

import React, { useState } from 'react';
import { User, ActivityLog, ArchivedAttendanceMonth } from '../../types';
import { DashboardTemplate, PlaceholderContent, InputField, CustomCheckbox } from '../common/UI';
import { UploadIcon, FileIcon, CloseIcon, UserIcon as ProfilePlaceholderIcon } from '../common/Icons';
import { RecruitedEmployeesTable } from './RecruitedEmployeesTable';
import { AttendanceDashboard } from './finance/payroll';

// --- HR SUB-COMPONENTS ---

interface RecruitmentVerificationModalProps {
    userData: any; // The form data state
    profilePicPreview: string | null;
    documents: File[];
    onConfirm: () => void;
    onClose: () => void;
}

const RecruitmentVerificationModal: React.FC<RecruitmentVerificationModalProps> = ({ userData, profilePicPreview, documents, onConfirm, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-3xl border border-neutral-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Review Candidate Information</h2>
                     <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {profilePicPreview ? (
                            <img src={profilePicPreview} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2 border-neutral-700 flex-shrink-0" />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-neutral-700 flex-shrink-0">
                                <ProfilePlaceholderIcon className="h-12 w-12 text-neutral-600"/>
                            </div>
                        )}
                        <div className="flex-grow">
                             <h3 className="text-xl font-semibold text-white mb-3">Candidate Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-neutral-900/50 p-4 rounded-lg">
                                <div><p className="text-sm text-neutral-400">Full Name</p><p className="text-md text-white">{userData.fullName || 'N/A'}</p></div>
                                <div><p className="text-sm text-neutral-400">Username</p><p className="text-md text-white">{userData.username}</p></div>
                                <div><p className="text-sm text-neutral-400">ID No</p><p className="text-md text-white">{userData.idNo || 'N/A'}</p></div>
                                <div><p className="text-sm text-neutral-400">Contact No</p><p className="text-md text-white">{userData.contactNo || 'N/A'}</p></div>
                                <div className="md:col-span-2"><p className="text-sm text-neutral-400">E-mail Address</p><p className="text-md text-white">{userData.email || 'N/A'}</p></div>
                                <div className="md:col-span-2"><p className="text-sm text-neutral-400">Address</p><p className="text-md text-white">{userData.address || 'N/A'}</p></div>
                            </div>
                        </div>
                    </div>

                    {userData.designations.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">Job Description (Designations)</h3>
                             <div className="flex flex-wrap gap-2 p-4 bg-neutral-900/50 rounded-lg">
                                {userData.designations.map((d: string) => <span key={d} className="bg-neutral-700 text-neutral-200 text-sm font-medium px-3 py-1 rounded-full">{d}</span>)}
                            </div>
                        </div>
                    )}

                    {documents.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">Documents</h3>
                            <ul className="border border-neutral-700 rounded-md divide-y divide-neutral-700">
                                {documents.map(doc => (
                                    <li key={doc.name} className="px-3 py-2 flex items-center gap-2 text-sm">
                                        <FileIcon className="h-5 w-5 text-neutral-400"/>
                                        <span className="text-neutral-200">{doc.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                     <p className="text-sm text-neutral-500 italic text-center pt-4">The password will not be displayed for security.</p>
                </div>
                <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Back to Edit</button>
                    <button onClick={onConfirm} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md">Confirm & Save</button>
                </div>
            </div>
        </div>
    );
};


interface RecruitmentFormProps {
    onAddNewUser: (user: User) => void;
}

const RecruitmentForm: React.FC<RecruitmentFormProps> = ({ onAddNewUser }) => {
    const designationOptions = [
        'Graphic Design', 'Video Editing', 'Photography', 'Videography',
        'Social Media Managing', 'Marketing', 'Finance', 'HR and Administration'
    ];

    const initialFormState = {
        fullName: '',
        idNo: '',
        contactNo: '',
        address: '',
        email: '',
        designations: [] as string[],
        username: '',
        password: '',
    };
    const [formData, setFormData] = useState(initialFormState);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    }
    
    const handleDesignationChange = (designation: string) => {
        setFormData(prev => {
            const newDesignations = prev.designations.includes(designation)
                ? prev.designations.filter(d => d !== designation)
                : [...prev.designations, designation];
            return { ...prev, designations: newDesignations };
        });
    };

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePic(file);
            setProfilePicPreview(URL.createObjectURL(file));
        }
    };

    const handleFileAction = (files: FileList | null) => {
        if (files && files.length > 0) {
            setDocuments(prev => {
                const newFiles = Array.from(files);
                const uniqueNewFiles = newFiles.filter(nf => !prev.some(ef => ef.name === nf.name && ef.size === nf.size));
                return [...prev, ...uniqueNewFiles];
            });
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileAction(e.dataTransfer.files);
        e.dataTransfer.clearData();
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => handleFileAction(e.target.files);

    const removeDocument = (fileName: string) => {
        setDocuments(prev => prev.filter(file => file.name !== fileName));
    };

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragging(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            alert('Username and password are required.');
            return;
        }
        setIsVerifying(true);
    };
    
    const handleConfirmSave = () => {
        const newUser: User = {
            username: formData.username,
            password: formData.password,
            role: 'Employee',
            fullName: formData.fullName,
            idNo: formData.idNo,
            contactNo: formData.contactNo,
            address: formData.address,
            email: formData.email,
            designations: formData.designations,
            profilePicPreview: profilePicPreview
        };

        onAddNewUser(newUser);

        // Reset form and close modal
        setFormData(initialFormState);
        setProfilePic(null);
        setProfilePicPreview(null);
        setDocuments([]);
        setIsVerifying(false);
    };

    return (
        <>
        {isVerifying && (
            <RecruitmentVerificationModal
                userData={formData}
                profilePicPreview={profilePicPreview}
                documents={documents}
                onConfirm={handleConfirmSave}
                onClose={() => setIsVerifying(false)}
            />
        )}
        <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-6 p-4 bg-neutral-900/40 rounded-lg">
                    <InputField id="fullName" label="Full Name" placeholder="Jane Doe" value={formData.fullName} onChange={handleInputChange} />
                    <InputField id="idNo" label="ID No" placeholder="123456789" value={formData.idNo} onChange={handleInputChange}/>
                    <InputField id="contactNo" label="Contact No" type="tel" placeholder="+1 (555) 123-4567" value={formData.contactNo} onChange={handleInputChange}/>
                    <div>
                         <label htmlFor="address" className="block text-sm font-medium text-neutral-300 mb-1.5">Residential Address</label>
                         <textarea id="address" name="address" rows={3} value={formData.address} onChange={handleInputChange} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition" placeholder="123 Main St, Anytown, USA"></textarea>
                    </div>
                    <InputField id="email" label="E-mail Address" type="email" placeholder="jane.doe@example.com" value={formData.email} onChange={handleInputChange}/>
                </div>

                <div className="space-y-6 p-4 bg-neutral-900/40 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300">Profile Picture</label>
                        <div className="mt-2 flex items-center gap-x-4">
                            <div className="h-20 w-20 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center overflow-hidden">
                            { profilePicPreview ? 
                                <img src={profilePicPreview} alt="Profile preview" className="h-full w-full object-cover"/> :
                                <ProfilePlaceholderIcon className="h-10 w-10 text-neutral-600" />
                            }
                            </div>
                            <label htmlFor="profile-pic-upload" className="cursor-pointer bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-2 px-4 rounded-md text-sm transition">
                                <span>Upload Photo</span>
                                <input id="profile-pic-upload" name="profile-pic-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleProfilePicChange}/>
                            </label>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">JPG, PNG up to 5MB.</p>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-300">Documents</label>
                        <div 
                          onDrop={handleFileDrop} 
                          onDragOver={handleDragEvents} 
                          onDragEnter={handleDragEnter} 
                          onDragLeave={handleDragLeave} 
                          className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-cyan-500' : 'border-neutral-700'} border-dashed rounded-md transition-colors`}
                        >
                            <div className="space-y-1 text-center"><UploadIcon className="mx-auto h-10 w-10 text-neutral-500" /><div className="flex text-sm text-neutral-400"><label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-cyan-400 hover:text-cyan-300"><span>Upload files</span><input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileSelect}/></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-neutral-500">Any file type up to 25MB</p></div>
                        </div>
                     </div>
                     {documents.length > 0 && (
                        <div className="space-y-2">
                             <h4 className="text-sm font-medium text-neutral-300">Uploaded Documents:</h4>
                             <ul className="border border-neutral-700 rounded-md divide-y divide-neutral-700 max-h-32 overflow-auto">
                                {documents.map(doc => (
                                    <li key={doc.name} className="px-3 py-2 flex items-center justify-between text-sm bg-neutral-800/50">
                                        <div className="flex items-center gap-2"><FileIcon className="h-5 w-5 text-neutral-400"/><span className="text-neutral-200 truncate">{doc.name}</span></div>
                                        <button onClick={() => removeDocument(doc.name)} className="text-neutral-500 hover:text-red-500 transition"><CloseIcon className="h-4 w-4"/></button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                     )}
                </div>
            </div>
            
            <div className="space-y-8 p-4 bg-neutral-900/40 rounded-lg mt-6">
                <div>
                    <label className="block text-sm font-medium text-neutral-300">Job Description</label>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                        {designationOptions.map(option => (
                            <CustomCheckbox key={option} id={`designation-${option.replace(/\s+/g, '-')}`} label={option} checked={formData.designations.includes(option)} onChange={() => handleDesignationChange(option)} />
                        ))}
                    </div>
                </div>
                
                <hr className="border-neutral-700/60" />
                
                <div>
                    <h3 className="text-lg font-medium text-white mb-4">Login Credentials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField id="username" label="Username" placeholder="jane.doe" value={formData.username} onChange={handleInputChange} />
                        <InputField id="password" label="Password" type="password" placeholder="••••••••••" value={formData.password} onChange={handleInputChange} />
                    </div>
                </div>
            </div>

            <div className="pt-5 mt-6 border-t border-neutral-800">
                <div className="flex justify-end">
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
                        Review & Save Candidate
                    </button>
                </div>
            </div>
        </form>
    </>
    );
}

// --- HR DASHBOARD ---

interface HRAdminDashboardProps {
  onAddNewUser: (user: User) => void;
  allUsers: User[];
  activityLogs: ActivityLog[];
  archivedAttendance: ArchivedAttendanceMonth[];
  onArchiveAttendance: (archive: ArchivedAttendanceMonth) => void;
}

export const HRAdminDashboard: React.FC<HRAdminDashboardProps> = ({ onAddNewUser, allUsers, activityLogs, archivedAttendance, onArchiveAttendance }) => {
    const [activeTab, setActiveTab] = useState('Employee Recruitments');
    const tabs = [
        'Employee Recruitments',
        'Recruited Employees',
        'Leave and Attendance',
        'Employee Relations',
        'Legal Documentations',
    ];

    const recruitedEmployees = allUsers.filter(user => user.role === 'Employee');

    const renderContent = () => {
        switch(activeTab) {
            case 'Employee Recruitments':
                return <RecruitmentForm onAddNewUser={onAddNewUser} />;
            case 'Recruited Employees':
                return <RecruitedEmployeesTable employees={recruitedEmployees} />;
            case 'Leave and Attendance':
                return <AttendanceDashboard 
                    users={allUsers}
                    activityLogs={activityLogs}
                    archivedAttendance={archivedAttendance}
                    onArchiveAttendance={onArchiveAttendance}
                />;
            case 'Employee Relations':
                return <PlaceholderContent title="Case Management & Disciplinary Actions" height="h-96" />;
            case 'Legal Documentations':
                return <PlaceholderContent title="Employee Contracts & Compliance Documents" height="h-96" />;
            default:
                return null;
        }
    };

    return (
        <DashboardTemplate title="HR & Administration">
            <div className="border-b border-neutral-800">
                <nav className="flex space-x-2 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm transition-colors focus:outline-none ${activeTab === tab ? 'bg-neutral-700/80 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">
                {renderContent()}
            </div>
        </DashboardTemplate>
    );
};