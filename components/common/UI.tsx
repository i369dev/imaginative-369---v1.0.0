import React from 'react';
import { CheckIcon, CloseIcon, ShieldIcon, InformationCircleIcon, FileIcon } from './Icons';
import { User, Job, JobServiceDetail, CameraEquipment, Service, Products } from '../../types';

// A generic card component for dashboards
export const Card: React.FC<{ title: string; value: string; icon: JSX.Element; }> = ({ title, value, icon }) => (
    <div className="bg-neutral-800/50 p-5 rounded-xl border border-neutral-700/80">
        <div className="flex items-center">
            <div className="bg-neutral-900/70 p-3 rounded-lg">
                {React.cloneElement(icon, { className: "h-6 w-6 text-cyan-400" })}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-neutral-400">{title}</p>
                <p className="text-xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

// Generic placeholder for charts or lists
export const PlaceholderContent: React.FC<{ title: string, height?: string }> = ({ title, height = 'h-64' }) => (
    <div className={`mt-8 border border-dashed border-neutral-700 rounded-lg ${height} flex items-center justify-center`}>
        <p className="text-neutral-500">{title}</p>
    </div>
);

export const DashboardTemplate: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        <div className="mt-6">
            {children}
        </div>
    </div>
);

export const InputField: React.FC<{id: string, label: string, type?: string, placeholder?: string, required?: boolean, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}> = 
    ({ id, label, type = 'text', placeholder, required = true, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-neutral-300 mb-1.5">{label}</label>
        <input
            type={type}
            name={id}
            id={id}
            className="shadow-sm bg-neutral-900/60 border border-neutral-700 placeholder-neutral-500 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
        />
    </div>
);

export const CustomCheckbox: React.FC<{ id: string, label: string, checked: boolean, onChange: () => void }> = ({ id, label, checked, onChange }) => (
    <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer group">
        <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 ease-in-out flex items-center justify-center ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-neutral-600 group-hover:border-neutral-400'}`}>
            {checked && <CheckIcon className="w-3 h-3 text-black" />}
        </div>
        <span className={`text-sm font-medium ${checked ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>{label}</span>
    </label>
);

export const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    icon?: React.ReactNode;
    confirmButtonClass?: string;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', icon, confirmButtonClass = 'bg-red-600 hover:bg-red-500' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-md border border-neutral-700">
                <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        {icon || <ShieldIcon className="h-7 w-7 text-red-500" />}
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>
                <div className="text-neutral-300 mb-6">
                    {message}
                </div>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className={`${confirmButtonClass} text-white font-bold py-2 px-4 rounded-md transition-colors`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- New Archived Item Details Modal ---

const DetailItem: React.FC<{ label: string; value?: React.ReactNode; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
        <p className="text-sm font-medium text-neutral-400">{label}</p>
        <div className="text-md text-white mt-0.5 break-words">
            {value || <span className="text-neutral-500 italic">Not specified</span>}
        </div>
    </div>
);

const DetailSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="border-t border-neutral-700/60 pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
        <h4 className="text-lg font-semibold text-cyan-400 mb-3">{title}</h4>
        {children}
    </div>
);

const renderUserDetails = (user: User) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <DetailItem label="Full Name" value={user.fullName} />
        <DetailItem label="Username" value={`@${user.username}`} />
        <DetailItem label="Email" value={user.email} />
        <DetailItem label="Contact No." value={user.contactNo} />
        <DetailItem label="ID No." value={user.idNo} />
        <DetailItem label="Role" value={<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-900/50 text-cyan-300">{user.role}</span>} />
        <DetailItem label="Address" value={user.address} fullWidth />
        {user.designations && user.designations.length > 0 && (
            <DetailItem label="Designations" fullWidth value={
                <div className="flex flex-wrap gap-2 mt-1">
                    {user.designations.map(d => <span key={d} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-neutral-700 text-neutral-200">{d}</span>)}
                </div>
            } />
        )}
    </div>
);

const renderJobDetails = (job: Job) => {
    const renderServiceSubDetails = (service: JobServiceDetail, title: string) => {
        if (!service.enabled) return null;
        return (
            <div className="mt-3 first:mt-0 bg-neutral-900/50 p-3 rounded-md">
                <h5 className="font-semibold text-neutral-200">{title}</h5>
                {service.services.length > 0 ? (
                    <ul className="list-disc list-inside pl-2 text-neutral-300 mt-1 text-sm">
                        {service.services.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                ) : <p className="text-neutral-500 italic mt-1 text-sm">No specific services selected.</p>}
                {service.description && (
                     <p className="text-sm text-neutral-200 whitespace-pre-wrap bg-neutral-800/60 p-2 rounded-md mt-2">{service.description}</p>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
             <DetailSection title="Client & Dates">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <DetailItem label="Customer Name" value={job.customerName} />
                    <DetailItem label="Company Name" value={job.companyName} />
                    <DetailItem label="Contact No" value={job.contactNo} />
                    <DetailItem label="Email" value={job.email} />
                    <DetailItem label="Date Created" value={new Date(job.jobCreatedDate).toLocaleString()} />
                    <DetailItem label="Deadline" value={job.deadlineDate ? new Date(job.deadlineDate).toLocaleDateString() : 'N/A'} />
                </div>
             </DetailSection>
             <DetailSection title="Services">
                {renderServiceSubDetails(job.graphicDesign, 'Graphic Design')}
                {renderServiceSubDetails(job.videoProduction, 'Video Production')}
                {renderServiceSubDetails(job.photography, 'Photography')}
                {renderServiceSubDetails(job.digitalMarketing, 'Digital Media Marketing')}
            </DetailSection>
            {job.assignedTo && Object.keys(job.assignedTo).length > 0 && (
                <DetailSection title="Assignment History">
                    {Object.entries(job.assignedTo).map(([dept, services]) =>(
                        <div key={dept} className="mt-2 first:mt-0">
                            <h5 className="font-semibold text-neutral-300">{dept}</h5>
                            <ul className="text-sm pl-4">{Object.entries(services).map(([service, assignments]) => {
                                const lastAssignment = assignments.length > 0 ? assignments[assignments.length - 1] : null;
                                return (
                                    <li key={service} className="text-neutral-400">
                                        <span className="text-neutral-200">{service}:</span>
                                        {' '}
                                        {lastAssignment ? `${lastAssignment.employee} (${lastAssignment.status})` : <span className="italic text-neutral-500">Not assigned</span>}
                                    </li>
                                );
                            })}</ul>
                        </div>
                    ))}
                </DetailSection>
            )}
            {job.documents && job.documents.length > 0 && (
                 <DetailSection title="Documents">
                    <ul className="border border-neutral-700 rounded-md divide-y divide-neutral-700">{job.documents.map(doc => (<li key={doc.name} className="px-3 py-2 flex items-center gap-2 text-sm"><FileIcon className="h-5 w-5 text-neutral-400"/><span className="text-neutral-200">{doc.name}</span></li>))}</ul>
                 </DetailSection>
            )}
        </div>
    )
};

const renderEquipmentDetails = (equipment: CameraEquipment) => (
    <div className="space-y-4">
        <DetailSection title="Specifications">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem label="Name" value={equipment.name} />
                <DetailItem label="Category" value={equipment.category} />
                <DetailItem label="Serial Number" value={equipment.serialNumber} />
                <DetailItem label="Purchase Date" value={equipment.purchaseDate ? new Date(equipment.purchaseDate).toLocaleDateString() : 'N/A'} />
            </div>
        </DetailSection>
        <DetailSection title="Last Status">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem label="Status at Archival" value={<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${equipment.status === 'In Stock' ? 'bg-green-900/60 text-green-300' : 'bg-yellow-900/60 text-yellow-300'}`}>{equipment.status}</span>} />
                <DetailItem label="Last Checked Out By" value={equipment.checkedOutBy} />
                <DetailItem label="Check-out Notes" fullWidth value={equipment.checkOutNotes ? <p className="text-sm text-neutral-200 whitespace-pre-wrap bg-neutral-800/60 p-2 rounded-md mt-1">{equipment.checkOutNotes}</p> : 'N/A'} />
             </div>
        </DetailSection>
        <DetailSection title="History & Notes Log">
            <p className="text-sm text-neutral-200 whitespace-pre-wrap bg-neutral-800/60 p-3 rounded-md mt-1 h-40 overflow-y-auto">{equipment.notes || 'No notes recorded.'}</p>
        </DetailSection>
    </div>
);

const getCategoryTitle = (key: string) => {
    const titles: {[key: string]: string} = {
        graphicDesign: 'Graphic Design',
        videoProduction: 'Video Production',
        photography: 'Photography',
        digitalMarketing: 'Digital Marketing'
    };
    return titles[key] || key;
}

const renderServiceDetails = (service: Service & { category: keyof Products }) => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <DetailItem label="Service Name" value={service.name} />
        <DetailItem label="Category" value={getCategoryTitle(service.category)} />
    </div>
);


export const ArchivedItemDetailsModal: React.FC<{
    item: any;
    onClose: () => void;
}> = ({ item, onClose }) => {
    if (!item) return null;

    let title = 'Archived Item Details';
    let content: React.ReactNode = null;
    
    // Using duck-typing to determine the item type
    if (item.username && item.role) { // Is User
        title = `History for User: ${item.fullName || item.username}`;
        content = renderUserDetails(item);
    } else if (item.customerName) { // Is Job
        title = `History for Job: ${item.customerName}`;
        content = renderJobDetails(item);
    } else if (item.serialNumber) { // Is Equipment
        title = `History for Equipment: ${item.name}`;
        content = renderEquipmentDetails(item);
    } else if (item.category && item.name) { // Is Service
        title = `History for Service: ${item.name}`;
        content = renderServiceDetails(item);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="glass-card rounded-lg shadow-xl p-6 w-full max-w-3xl border border-neutral-700">
                <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <InformationCircleIcon className="h-7 w-7 text-cyan-400" />
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-4">
                    <DetailSection title="Archival Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <DetailItem label="Date Archived" value={item.archivedDate ? new Date(item.archivedDate).toLocaleString() : 'N/A'} />
                            <DetailItem label="Archived By" value={<span className="capitalize">{item.archivedBy || 'N/A'}</span>} />
                        </div>
                    </DetailSection>
                    
                    <DetailSection title="Item Snapshot at Time of Archival">
                        {content}
                    </DetailSection>
                </div>
                
                <div className="flex justify-end mt-6 pt-5 border-t border-neutral-700/60">
                    <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};