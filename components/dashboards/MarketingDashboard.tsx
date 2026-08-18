import React, { useState } from 'react';
import { Job, JobServiceDetail, Products } from '../../types';
import { DashboardTemplate, PlaceholderContent, InputField, CustomCheckbox } from '../common/UI';
import { UploadIcon, FileIcon, CloseIcon } from '../common/Icons';
import { JobDetailsTable } from './JobDetailsTable';

// --- MARKETING SUB-COMPONENTS & CONSTANTS ---

interface NewJobFormData {
    customerName: string;
    companyName: string;
    contactNo: string;
    email: string;
    deadlineDate: string;
    graphicDesign: JobServiceDetail;
    videoProduction: JobServiceDetail;
    photography: JobServiceDetail;
    digitalMarketing: JobServiceDetail;
}

interface JobVerificationModalProps {
    jobData: NewJobFormData;
    documents: File[];
    onConfirm: () => void;
    onClose: () => void;
}

const JobVerificationModal: React.FC<JobVerificationModalProps> = ({ jobData, documents, onConfirm, onClose }) => {
    const renderServiceDetails = (serviceKey: keyof typeof jobData, title: string) => {
        if (typeof jobData[serviceKey] !== 'object' || jobData[serviceKey] === null) return null;

        const service = jobData[serviceKey] as JobServiceDetail;
        if (!service.enabled) return null;

        return (
            <div className="mt-4 first:mt-0">
                <h4 className="text-md font-semibold text-cyan-400">{title}</h4>
                {service.services.length > 0 ? (
                    <ul className="list-disc list-inside pl-2 text-neutral-300 mt-1">
                        {service.services.map((s: string) => <li key={s}>{s}</li>)}
                    </ul>
                ) : <p className="text-neutral-500 italic mt-1">No specific services selected.</p>}
                {service.description && (
                    <div className="mt-2">
                        <p className="text-sm font-semibold text-neutral-400">Description:</p>
                        <p className="text-sm text-neutral-200 whitespace-pre-wrap bg-neutral-900/50 p-2 rounded-md mt-1">{service.description}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-3xl border border-neutral-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Review Job Details</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Client Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-neutral-900/50 p-4 rounded-lg">
                            <div><p className="text-sm text-neutral-400">Customer Name</p><p className="text-lg text-white">{jobData.customerName}</p></div>
                            <div><p className="text-sm text-neutral-400">Company Name</p><p className="text-lg text-white">{jobData.companyName}</p></div>
                            <div><p className="text-sm text-neutral-400">Contact No</p><p className="text-lg text-white">{jobData.contactNo}</p></div>
                            <div><p className="text-sm text-neutral-400">E-mail Address</p><p className="text-lg text-white">{jobData.email}</p></div>
                            <div><p className="text-sm text-neutral-400">Deadline</p><p className="text-lg text-white">{jobData.deadlineDate || 'Not set'}</p></div>
                        </div>
                    </div>
                    {documents.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">Documents</h3>
                            <ul className="border border-neutral-700 rounded-md divide-y divide-neutral-700">
                                {documents.map(doc => (
                                    <li key={doc.name} className="px-3 py-2 flex items-center gap-2 text-sm bg-neutral-800/50">
                                        <FileIcon className="h-5 w-5 text-neutral-400" />
                                        <span className="text-neutral-200">{doc.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {(jobData.graphicDesign.enabled || jobData.videoProduction.enabled || jobData.photography.enabled || jobData.digitalMarketing.enabled) &&
                        <div>
                             <h3 className="text-xl font-semibold text-white mb-2">Selected Services</h3>
                             <div className="space-y-4">
                                {renderServiceDetails('graphicDesign', 'Graphic Design')}
                                {renderServiceDetails('videoProduction', 'Video Production')}
                                {renderServiceDetails('photography', 'Photography')}
                                {renderServiceDetails('digitalMarketing', 'Digital Media Marketing')}
                             </div>
                        </div>
                    }
                </div>
                <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Back to Edit</button>
                    <button onClick={onConfirm} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md">Confirm & Create Job</button>
                </div>
            </div>
        </div>
    );
};

interface NewJobFormProps {
    onCreateJob: (job: Omit<Job, 'id' | 'isAssigned'>) => void;
    products: Products;
}

const NewJobForm: React.FC<NewJobFormProps> = ({ onCreateJob, products }) => {
    const initialFormState: NewJobFormData = {
        customerName: '',
        companyName: '',
        contactNo: '',
        email: '',
        deadlineDate: '',
        graphicDesign: { enabled: false, services: [], description: '' },
        videoProduction: { enabled: false, services: [], description: '' },
        photography: { enabled: false, services: [], description: '' },
        digitalMarketing: { enabled: false, services: [], description: '' },
    };
    const [formData, setFormData] = useState<NewJobFormData>(initialFormState);
    const [documents, setDocuments] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
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

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileAction(e.dataTransfer.files); e.dataTransfer.clearData(); };
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => handleFileAction(e.target.files);
    const removeDocument = (fileName: string) => setDocuments(prev => prev.filter(file => file.name !== fileName));
    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { handleDragEvents(e); if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { handleDragEvents(e); setIsDragging(false); };
    
    const handleServiceToggle = (service: keyof Pick<NewJobFormData, 'graphicDesign' | 'videoProduction' | 'photography' | 'digitalMarketing'>) => {
        setFormData(prev => ({ ...prev, [service]: { ...prev[service], enabled: !prev[service].enabled } }));
    };

    const handleServiceSelectionChange = (service: keyof Pick<NewJobFormData, 'graphicDesign' | 'videoProduction' | 'photography' | 'digitalMarketing'>, option: string) => {
        setFormData(prev => {
            const currentServices = prev[service].services;
            const newServices = currentServices.includes(option) ? currentServices.filter(s => s !== option) : [...currentServices, option];
            return { ...prev, [service]: { ...prev[service], services: newServices } };
        });
    };
    
    const handleServiceDescriptionChange = (service: keyof Pick<NewJobFormData, 'graphicDesign' | 'videoProduction' | 'photography' | 'digitalMarketing'>, value: string) => {
        setFormData(prev => ({ ...prev, [service]: { ...prev[service], description: value } }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
    };

    const handleConfirmCreateJob = () => {
         const jobData = { ...formData, documents: documents.map(d => ({ name: d.name })), jobCreatedDate: new Date().toISOString() };
        onCreateJob(jobData);
        alert(`Job for customer '${formData.customerName}' created successfully!`);
        setFormData(initialFormState);
        setDocuments([]);
        setIsVerifying(false);
    };
    
    const renderServiceBlock = ( serviceKey: keyof Pick<NewJobFormData, 'graphicDesign' | 'videoProduction' | 'photography' | 'digitalMarketing'>, title: string) => {
        const options = products[serviceKey].map(s => s.name);
        return (
            <>
                <CustomCheckbox id={`${serviceKey}-toggle`} label={title} checked={formData[serviceKey].enabled} onChange={() => handleServiceToggle(serviceKey)} />
                {formData[serviceKey].enabled && (
                    <div className="pl-8 py-4 border-l-2 border-neutral-700 space-y-4 ml-2.5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300">Select Services</label>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                {options.map(option => (
                                    <CustomCheckbox key={option} id={`${serviceKey}-service-${option.replace(/\s+/g, '-')}`} label={option} checked={formData[serviceKey].services.includes(option)} onChange={() => handleServiceSelectionChange(serviceKey, option)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor={`${serviceKey}-description`} className="block text-sm font-medium text-neutral-300">Description</label>
                            <textarea id={`${serviceKey}-description`} rows={4} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition mt-1" placeholder={`Provide details...`} value={formData[serviceKey].description} onChange={(e) => handleServiceDescriptionChange(serviceKey, e.target.value)} />
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            {isVerifying && <JobVerificationModal jobData={formData} documents={documents} onConfirm={handleConfirmCreateJob} onClose={() => setIsVerifying(false)} />}
            <form className="space-y-6 max-w-4xl mx-auto" onSubmit={handleSubmit}>
                <div className="space-y-6 bg-neutral-900/40 p-6 rounded-lg">
                    <InputField id="customerName" label="Customer Name" placeholder="John Doe" value={formData.customerName} onChange={handleInputChange} />
                    <InputField id="companyName" label="Company Name" placeholder="Doe Industries" value={formData.companyName} onChange={handleInputChange} />
                    <InputField id="contactNo" label="Contact No" type="tel" placeholder="+1 (555) 555-5555" value={formData.contactNo} onChange={handleInputChange} />
                    <InputField id="email" label="E-mail Address" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleInputChange} />
                    <InputField id="deadlineDate" label="Deadline Date" type="date" value={formData.deadlineDate} onChange={handleInputChange} />
                     <div>
                        <label className="block text-sm font-medium text-neutral-300">Documents</label>
                        <div onDrop={handleFileDrop} onDragOver={handleDragEvents} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-cyan-500' : 'border-neutral-700'} border-dashed rounded-md transition-colors`}>
                            <div className="space-y-1 text-center"><UploadIcon className="mx-auto h-10 w-10 text-neutral-500" /><div className="flex text-sm text-neutral-400"><label htmlFor="job-file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-cyan-400 hover:text-cyan-300"><span>Upload files</span><input id="job-file-upload" name="job-file-upload" type="file" className="sr-only" multiple onChange={handleFileSelect}/></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-neutral-500">Any file type up to 25MB</p></div>
                        </div>
                     </div>
                     {documents.length > 0 && (
                        <div className="space-y-2">
                             <h4 className="text-sm font-medium text-neutral-300">Uploaded Documents:</h4>
                             <ul className="border border-neutral-700 rounded-md divide-y divide-neutral-700">
                                {documents.map(doc => (<li key={doc.name} className="px-3 py-2 flex items-center justify-between text-sm bg-neutral-800/50"><div className="flex items-center gap-2"><FileIcon className="h-5 w-5 text-neutral-400" /><span className="text-neutral-200">{doc.name}</span></div><button onClick={() => removeDocument(doc.name)} className="text-neutral-500 hover:text-red-500 transition"><CloseIcon className="h-4 w-4"/></button></li>))}
                            </ul>
                        </div>
                     )}
                </div>
                <div className="border-t border-neutral-800 pt-6 bg-neutral-900/40 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-white">Job Services</h3>
                    <div className="mt-4 space-y-4">
                        {renderServiceBlock('graphicDesign', 'Graphic Design')}
                        {renderServiceBlock('videoProduction', 'Video Production')}
                        {renderServiceBlock('photography', 'Photography')}
                        {renderServiceBlock('digitalMarketing', 'Digital Media Marketing')}
                    </div>
                </div>
                <div className="pt-5 border-t border-neutral-800">
                    <div className="flex justify-end">
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-md">Create Job</button>
                    </div>
                </div>
            </form>
        </>
    );
};

interface ViewJobDetailsModalProps {
    job: Job | null;
    onClose: () => void;
}
const ViewJobDetailsModal: React.FC<ViewJobDetailsModalProps> = ({ job, onClose }) => {
    if (!job) return null;
    const renderServiceDetails = (service: JobServiceDetail, title: string) => {
        if (!service.enabled) return null;
        return (<div className="mt-4 first:mt-0"><h4 className="text-md font-semibold text-cyan-400">{title}</h4>{service.services.length > 0 ? <ul className="list-disc list-inside pl-2 text-neutral-300 mt-1">{service.services.map((s: string) => <li key={s}>{s}</li>)}</ul> : <p className="text-neutral-500 italic mt-1">No specific services.</p>}{service.description && <div className="mt-2"><p className="text-sm font-semibold text-neutral-400">Desc:</p><p className="text-sm text-neutral-200 whitespace-pre-wrap bg-neutral-900/50 p-2 rounded-md mt-1">{service.description}</p></div>}</div>);
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"><div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-3xl border border-neutral-700"><div className="flex justify-between items-start mb-6"><h2 className="text-2xl font-bold text-white">Job Details</h2><button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="w-6 w-6"/></button></div><div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6"><div><h3 className="text-xl font-semibold text-white mb-3">Client Info</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-neutral-900/50 p-4 rounded-lg"><div><p className="text-sm text-neutral-400">Customer</p><p className="text-lg text-white">{job.customerName}</p></div><div><p className="text-sm text-neutral-400">Company</p><p className="text-lg text-white">{job.companyName}</p></div><div><p className="text-sm text-neutral-400">Contact</p><p className="text-lg text-white">{job.contactNo}</p></div><div><p className="text-sm text-neutral-400">Email</p><p className="text-lg text-white">{job.email}</p></div><div><p className="text-sm text-neutral-400">Created On</p><p className="text-lg text-white">{new Date(job.jobCreatedDate).toLocaleString()}</p></div><div><p className="text-sm text-neutral-400">Deadline</p><p className="text-lg text-white">{job.deadlineDate || 'N/A'}</p></div></div></div>{job.documents.length > 0 && <div><h3 className="text-xl font-semibold text-white mb-2">Docs</h3><ul className="border border-neutral-700 rounded-md divide-y divide-neutral-700">{job.documents.map(doc => (<li key={doc.name} className="px-3 py-2 flex items-center gap-2 text-sm bg-neutral-800/50"><FileIcon className="h-5 w-5 text-neutral-400" /><span className="text-neutral-200">{doc.name}</span></li>))}</ul></div>}{(job.graphicDesign.enabled || job.videoProduction.enabled || job.photography.enabled || job.digitalMarketing.enabled) && <div><h3 className="text-xl font-semibold text-white mb-2">Services</h3><div className="space-y-4">{renderServiceDetails(job.graphicDesign, 'Graphic Design')}{renderServiceDetails(job.videoProduction, 'Video Production')}{renderServiceDetails(job.photography, 'Photography')}{renderServiceDetails(job.digitalMarketing, 'Digital Media Marketing')}</div></div>}</div><div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5"><button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Close</button></div></div></div>);
};

// --- MARKETING DASHBOARD ---

interface MarketingDashboardProps {
    onCreateJob: (job: Omit<Job, 'id' | 'isAssigned'>) => void;
    allJobs: Job[];
    products: Products;
    onAssignJobToOperation: (job: Job) => void;
}
export const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ onCreateJob, allJobs, products, onAssignJobToOperation }) => {
    const [activeTab, setActiveTab] = useState('Create a New Job');
    const [viewingJob, setViewingJob] = useState<Job | null>(null);
    const tabs = ['Create a New Job', 'Job Overview', 'Quotation', 'Invoice', 'Job Assign'];

    const renderContent = () => {
        switch(activeTab) {
            case 'Create a New Job':
                return <NewJobForm onCreateJob={onCreateJob} products={products} />;
            case 'Job Overview':
                return <JobDetailsTable jobs={allJobs} onViewClick={setViewingJob} onAssignClick={onAssignJobToOperation} />;
            case 'Quotation':
                return <PlaceholderContent title="Quotation Generation Tool" height="h-96" />;
            case 'Invoice':
                return <PlaceholderContent title="Invoice Creation and Management" height="h-96" />;
            case 'Job Assign':
                return <PlaceholderContent title="Assign Jobs to Employees" height="h-96" />;
            default:
                return null;
        }
    };

    return (
        <DashboardTemplate title="Marketing Dashboard">
            {viewingJob && <ViewJobDetailsModal job={viewingJob} onClose={() => setViewingJob(null)} />}
            <div className="border-b border-neutral-800">
                <nav className="flex space-x-2" aria-label="Tabs">
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