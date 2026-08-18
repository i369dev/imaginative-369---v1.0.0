import React, { useState, useMemo } from 'react';
import { ActivityLog, Job, User, CameraEquipment, Products, Service, JobServiceDetail, TaskStatus } from '../../types';
import { UsersIcon, BriefcaseIcon, CodeIcon, CameraIcon, ClipboardDocumentListIcon, InformationCircleIcon, SitemapIcon, FileIcon, ClockIcon, ShieldIcon } from '../common/Icons';

// --- PROPS ---
interface ProcessFlowDashboardProps {
    activityLogs: ActivityLog[];
    users: User[];
    jobs: Job[];
    equipment: CameraEquipment[];
    products: Products;
}

// Helper to format time since event
const timeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    if (seconds < 10) return "just now";
    return Math.floor(seconds) + " seconds ago";
};


// --- SELECT COMPONENT ---
const CustomSelect: React.FC<{id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[], placeholder: string}> = 
({ id, label, value, onChange, options, placeholder }) => (
    <div className="flex-1 min-w-[200px]">
        <label htmlFor={id} className="block text-sm font-medium text-neutral-300 mb-1.5">{label}</label>
        <select
            id={id}
            value={value}
            onChange={onChange}
            className="shadow-sm bg-neutral-900/60 border border-neutral-700 placeholder-neutral-500 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
        >
            <option value="" disabled>{placeholder}</option>
            {options.map(opt => <option key={opt.value} value={opt.value} className="bg-neutral-800 text-white">{opt.label}</option>)}
        </select>
    </div>
);

// --- FLOW CHART COMPONENTS ---

const FlowNode: React.FC<{ title?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string, borderColor?: string }> = 
({ title, icon, children, className = '', borderColor = 'border-neutral-700' }) => (
    <div className={`glass-card rounded-lg p-4 border ${borderColor} ${className}`}>
        {title && (
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h3 className="font-semibold text-white">{title}</h3>
            </div>
        )}
        <div className="text-sm">{children}</div>
    </div>
);

const DetailItem: React.FC<{label: string, value: string | React.ReactNode}> = ({label, value}) => (
    <div>
        <p className="text-xs text-neutral-400 font-medium">{label}</p>
        <p className="text-neutral-200">{value || 'N/A'}</p>
    </div>
);

const getStatusChip = (status: TaskStatus) => {
    switch (status) {
        case 'Assigned': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/60 text-blue-300">Assigned</span>;
        case 'In Progress': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900/60 text-yellow-300">In Progress</span>;
        case 'Blocked': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/60 text-red-300">Blocked</span>;
        case 'Completed': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/60 text-green-300">Completed</span>;
        default: return null;
    }
};

const FlowLayoutWrapper: React.FC<{startNode: React.ReactNode, children: React.ReactNode}> = ({ startNode, children }) => (
     <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 mt-4">
        <div className="flex-shrink-0 w-full lg:w-64">{startNode}</div>
        <div className="flex-grow space-y-6 lg:space-y-8 w-full relative">
            <div className="hidden lg:block absolute left-[-20px] top-0 h-full w-0.5 bg-neutral-700"></div>
            <div className="hidden lg:block absolute left-[-20px] top-1/2 h-px w-5 bg-neutral-700"></div>
            {children}
        </div>
    </div>
);

const FlowBranch: React.FC<{branchColor: string, summaryNode: React.ReactNode, detailNodes: React.ReactNode[]}> = ({ branchColor, summaryNode, detailNodes }) => (
     <div className="flow-branch" style={{'--branch-color': branchColor} as React.CSSProperties}>
        <div className="flex-shrink-0 w-full sm:w-56">{summaryNode}</div>
        <div className="flow-details-column space-y-3 flex-grow">
            {detailNodes.length > 0 ? detailNodes.map((node, index) => (
                <div key={index} className="flow-detail-node">{node}</div>
            )) : <div className="flow-detail-node"><FlowNode><p className="text-neutral-500 italic">No activities in this category.</p></FlowNode></div>}
        </div>
    </div>
);

const renderJobLifecycleFlow = (job: Job, logs: ActivityLog[]) => {
    const creationLog = logs.find(l => l.action === 'JOB_CREATED');
    const assignedLog = logs.find(l => l.action === 'JOB_ASSIGNED_TO_OPS');
    const updateLogs = logs.filter(l => l.action === 'JOB_UPDATED' || l.action === 'TASK_STATUS_UPDATED' || l.action === 'EMPLOYEE_ASSIGNED_TO_JOB');

    const services = [
        { title: "Graphic Design", data: job.graphicDesign },
        { title: "Video Production", data: job.videoProduction },
        { title: "Photography", data: job.photography },
        { title: "Digital Marketing", data: job.digitalMarketing },
    ].filter(s => s.data.enabled);

    const departments = job.assignedTo ? Object.keys(job.assignedTo) : [];
    
    return (
        <FlowLayoutWrapper startNode={
            <FlowNode borderColor="border-cyan-500/80" icon={<BriefcaseIcon className="h-5 w-5 text-cyan-400" />} title="Job Start">
                <DetailItem label="Customer" value={job.customerName} />
                <hr className="border-neutral-700 my-2" />
                <DetailItem label="Company" value={job.companyName} />
                {creationLog && <><hr className="border-neutral-700 my-2" /><DetailItem label="Created" value={`${timeSince(creationLog.timestamp)} by ${creationLog.user}`} /></>}
            </FlowNode>
        }>
            {services.length > 0 && 
                <FlowBranch 
                    branchColor="#8b5cf6" 
                    summaryNode={<FlowNode borderColor="border-violet-500/80" icon={<CodeIcon className="h-5 w-5 text-violet-400" />} title="Services Required"><p className="text-neutral-300">{services.length} service categories enabled.</p></FlowNode>}
                    detailNodes={services.map(s => <FlowNode key={s.title} title={s.title}>
                            {s.data.services.length > 0 ? (
                                <ul className="list-disc list-inside text-neutral-300">{s.data.services.map(name => <li key={name}>{name}</li>)}</ul>
                            ) : <p className="text-neutral-500 italic">No specific sub-services listed.</p>}
                            {s.data.description && <p className="mt-2 pt-2 border-t border-neutral-700 text-neutral-400">{s.data.description}</p>}
                        </FlowNode>
                    )}
                />
            }
            {departments.length > 0 &&
                <FlowBranch
                    branchColor="#ec4899"
                    summaryNode={<FlowNode borderColor="border-pink-500/80" icon={<UsersIcon className="h-5 w-5 text-pink-400" />} title="Assignments & Progress">
                        <p className="text-neutral-300">{departments.length} departments assigned.</p>
                        {assignedLog && <p className="text-xs text-neutral-500 mt-1">Assigned {timeSince(assignedLog.timestamp)}</p>}
                    </FlowNode>}
                    detailNodes={departments.map(dept => <FlowNode key={dept} title={dept}>
                        <div className="space-y-2">
                            {job.assignedTo?.[dept] && Object.entries(job.assignedTo[dept]).map(([service, assignments]) => {
                                const lastAssignment = assignments.length > 0 ? assignments[assignments.length - 1] : null;
                                if (!lastAssignment) return null;
                                return (
                                    <div key={service} className="flex justify-between items-center bg-neutral-800/60 p-2 rounded-md">
                                        <div><p className="text-neutral-300">{service}</p><p className="text-xs text-neutral-400">{lastAssignment.employee}</p></div>
                                        {getStatusChip(lastAssignment.status)}
                                    </div>
                                );
                            })}
                        </div>
                    </FlowNode>)}
                />
            }
            <FlowBranch
                branchColor="#f59e0b"
                summaryNode={<FlowNode borderColor="border-amber-500/80" icon={<ClockIcon className="h-5 w-5 text-amber-400" />} title="Major Events"><DetailItem label="Documents" value={`${job.documents.length} file(s)`} /></FlowNode>}
                detailNodes={updateLogs.map(log => <FlowNode key={log.id}><p className="text-neutral-300">{log.details}</p><p className="text-xs text-neutral-500">{timeSince(log.timestamp)}</p></FlowNode>)}
            />
        </FlowLayoutWrapper>
    );
};

const renderUserActivityFlow = (user: User, logs: ActivityLog[]) => {
    const jobLogs = logs.filter(l => l.category === 'Job Details');
    const mgmtLogs = logs.filter(l => ['User Management', 'Our Products', 'Camera Equipment'].includes(l.category) && !['USER_LOGIN', 'USER_LOGOUT'].includes(l.action));
    const accountLogs = logs.filter(l => ['USER_LOGIN', 'USER_LOGOUT'].includes(l.action));

    return (
         <FlowLayoutWrapper startNode={
             <FlowNode borderColor="border-cyan-500/80" icon={<UsersIcon className="h-5 w-5 text-cyan-400" />} title="User Profile">
                <DetailItem label="Full Name" value={user.fullName} />
                <hr className="border-neutral-700 my-2" />
                <DetailItem label="Role" value={user.role} />
                <hr className="border-neutral-700 my-2" />
                <DetailItem label="Email" value={user.email} />
            </FlowNode>
        }>
            <FlowBranch 
                branchColor="#8b5cf6"
                summaryNode={<FlowNode borderColor="border-violet-500/80" icon={<BriefcaseIcon className="h-5 w-5 text-violet-400" />} title="Job Activities"><p className="text-neutral-300">{jobLogs.length} related actions.</p></FlowNode>}
                detailNodes={jobLogs.map(log => <FlowNode key={log.id}><p className="text-neutral-300">{log.details}</p><p className="text-xs text-neutral-500">{timeSince(log.timestamp)}</p></FlowNode>)}
            />
            <FlowBranch 
                branchColor="#ec4899"
                summaryNode={<FlowNode borderColor="border-pink-500/80" icon={<ShieldIcon className="h-5 w-5 text-pink-400" />} title="Management Actions"><p className="text-neutral-300">{mgmtLogs.length} actions taken.</p></FlowNode>}
                detailNodes={mgmtLogs.map(log => <FlowNode key={log.id}><p className="text-neutral-300">{log.details}</p><p className="text-xs text-neutral-500">{timeSince(log.timestamp)}</p></FlowNode>)}
            />
            <FlowBranch 
                branchColor="#f59e0b"
                summaryNode={<FlowNode borderColor="border-amber-500/80" icon={<ClockIcon className="h-5 w-5 text-amber-400" />} title="Account History"><p className="text-neutral-300">{accountLogs.length} account events.</p></FlowNode>}
                detailNodes={accountLogs.map(log => <FlowNode key={log.id}><p className="text-neutral-300">{log.details}</p><p className="text-xs text-neutral-500">{timeSince(log.timestamp)}</p></FlowNode>)}
            />
        </FlowLayoutWrapper>
    );
};

const renderEquipmentLifecycleFlow = (equipment: CameraEquipment, logs: ActivityLog[]) => {
    const checkoutLogs = logs.filter(l => ['EQUIPMENT_CHECKED_OUT', 'EQUIPMENT_CHECKED_IN'].includes(l.action));
    const maintenanceLogs = logs.filter(l => ['EQUIPMENT_CREATED', 'EQUIPMENT_UPDATED'].includes(l.action));
    const archiveLogs = logs.filter(l => ['EQUIPMENT_ARCHIVED', 'EQUIPMENT_RESTORED'].includes(l.action));
    
    return (
        <FlowLayoutWrapper startNode={
             <FlowNode borderColor="border-cyan-500/80" icon={<CameraIcon className="h-5 w-5 text-cyan-400" />} title="Equipment Details">
                <DetailItem label="Name" value={equipment.name} />
                <hr className="border-neutral-700 my-2" />
                <DetailItem label="Category" value={equipment.category} />
                <hr className="border-neutral-700 my-2" />
                <DetailItem label="Serial No." value={equipment.serialNumber} />
            </FlowNode>
        }>
            <FlowBranch 
                branchColor="#8b5cf6"
                summaryNode={<FlowNode borderColor="border-violet-500/80" icon={<UsersIcon className="h-5 w-5 text-violet-400" />} title="Check Out History"><p className="text-neutral-300">{checkoutLogs.length} usage events.</p></FlowNode>}
                detailNodes={checkoutLogs.map(log => <FlowNode key={log.id}><p className="text-neutral-300">{log.details}</p><p className="text-xs text-neutral-500">{timeSince(log.timestamp)} by {log.user}</p></FlowNode>)}
            />
            <FlowBranch 
                branchColor="#ec4899"
                summaryNode={<FlowNode borderColor="border-pink-500/80" icon={<ShieldIcon className="h-5 w-5 text-pink-400" />} title="Maintenance & Updates"><p className="text-neutral-300">{maintenanceLogs.length} events.</p></FlowNode>}
                detailNodes={maintenanceLogs.map(log => <FlowNode key={log.id}><p className="text-neutral-300">{log.details}</p><p className="text-xs text-neutral-500">{timeSince(log.timestamp)} by {log.user}</p></FlowNode>)}
            />
             <FlowBranch 
                branchColor="#f59e0b"
                summaryNode={<FlowNode borderColor="border-amber-500/80" icon={<ClockIcon className="h-5 w-5 text-amber-400" />} title="Archive History"><p className="text-neutral-300">{archiveLogs.length} archive events.</p></FlowNode>}
                detailNodes={archiveLogs.map(log => <FlowNode key={log.id}><p className="text-neutral-300">{log.details}</p><p className="text-xs text-neutral-500">{timeSince(log.timestamp)} by {log.user}</p></FlowNode>)}
            />
        </FlowLayoutWrapper>
    );
};

const renderServiceLifecycleFlow = (service: Service & { category: keyof Products }, logs: ActivityLog[]) => {
    const lifecycleLogs = logs.filter(l => ['PRODUCT_CREATED', 'PRODUCT_ARCHIVED', 'PRODUCT_RESTORED', 'PRODUCT_DELETED_PERMANENTLY'].includes(l.action));
    
    return (
        <FlowLayoutWrapper startNode={
             <FlowNode borderColor="border-cyan-500/80" icon={<CodeIcon className="h-5 w-5 text-cyan-400" />} title="Service Details">
                <DetailItem label="Name" value={service.name} />
                <hr className="border-neutral-700 my-2" />
                <DetailItem label="Category" value={service.category.replace(/([A-Z])/g, ' $1').trim()} />
            </FlowNode>
        }>
            <FlowBranch 
                branchColor="#8b5cf6"
                summaryNode={<FlowNode borderColor="border-violet-500/80" icon={<ClockIcon className="h-5 w-5 text-violet-400" />} title="Lifecycle Events"><p className="text-neutral-300">{lifecycleLogs.length} events found.</p></FlowNode>}
                detailNodes={lifecycleLogs.map(log => <FlowNode key={log.id}><p className="text-neutral-300">{log.details}</p><p className="text-xs text-neutral-500">{timeSince(log.timestamp)} by {log.user}</p></FlowNode>)}
            />
        </FlowLayoutWrapper>
    );
};

// --- MAIN COMPONENT ---
export const ProcessFlowDashboard: React.FC<ProcessFlowDashboardProps> = ({ activityLogs, users, jobs, equipment, products }) => {
    const [flowType, setFlowType] = useState('Job Lifecycle');
    const [selectedTargetId, setSelectedTargetId] = useState('');

    const allServices: (Service & {id: string, category: keyof Products})[] = Object.entries(products).flatMap(([category, services]) => 
        services.map(service => ({ ...service, id: `${category}-${service.name}`, category: category as keyof Products }))
    );

    const targetOptions = useMemo(() => {
        switch (flowType) {
            case 'Job Lifecycle':
                return jobs.map(j => ({ value: j.id, label: `Job: ${j.customerName} (ID: ${j.id.slice(-6)})` }));
            case 'User Activity':
                return users.map(u => ({ value: u.username, label: `User: ${u.fullName || u.username}` }));
            case 'Equipment Lifecycle':
                return equipment.map(e => ({ value: e.id, label: `Equip: ${e.name} (SN: ${e.serialNumber})` }));
            case 'Service Lifecycle':
                 return allServices.map(s => ({ value: s.name, label: `Service: ${s.name}`}));
            default:
                return [];
        }
    }, [flowType, jobs, users, equipment, allServices]);

    const timelineLogs = useMemo(() => {
        if (!selectedTargetId) return [];
        
        let filtered;
        if (flowType === 'User Activity') {
            filtered = activityLogs.filter(log => log.user.toLowerCase() === selectedTargetId.toLowerCase());
        } else {
             filtered = activityLogs.filter(log => log.targetId.toLowerCase() === selectedTargetId.toLowerCase());
        }

        return filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [selectedTargetId, flowType, activityLogs]);

    const handleFlowTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFlowType(e.target.value);
        setSelectedTargetId('');
    }
    
    const renderFlow = () => {
        if (!selectedTargetId) {
            return (
                <div className="text-center py-16 text-neutral-500 flex flex-col items-center gap-3">
                     <SitemapIcon className="w-12 h-12" />
                    <p className="text-lg">Select a Process and an Item</p>
                    <p className="text-sm max-w-md">Choose a process type and a specific item from the dropdowns above to see its activity visualized as a flow chart.</p>
                </div>
            );
        }
        
        const job = jobs.find(j => j.id === selectedTargetId);
        if (flowType === 'Job Lifecycle' && job) {
            return renderJobLifecycleFlow(job, timelineLogs);
        }

        const user = users.find(u => u.username === selectedTargetId);
        if (flowType === 'User Activity' && user) {
            return renderUserActivityFlow(user, timelineLogs);
        }

        const equip = equipment.find(e => e.id === selectedTargetId);
        if (flowType === 'Equipment Lifecycle' && equip) {
            return renderEquipmentLifecycleFlow(equip, timelineLogs);
        }
        
        const service = allServices.find(s => s.name === selectedTargetId);
        if (flowType === 'Service Lifecycle' && service) {
            return renderServiceLifecycleFlow(service, timelineLogs);
        }
        
        return (
            <div className="text-center py-16 text-neutral-500 flex flex-col items-center gap-3">
                 <ClipboardDocumentListIcon className="w-12 h-12" />
                <p className="text-lg">No data found for this item.</p>
                <p className="text-sm max-w-md">Could not find the selected item or it has no activity history.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-neutral-900/40 rounded-lg border border-neutral-700/50">
                <CustomSelect 
                    id="flowType"
                    label="Select a Process to Visualize"
                    value={flowType}
                    onChange={handleFlowTypeChange}
                    placeholder="Select flow type..."
                    options={[
                        { value: 'Job Lifecycle', label: 'Job Lifecycle' },
                        { value: 'User Activity', label: 'User Activity' },
                        { value: 'Equipment Lifecycle', label: 'Equipment Lifecycle' },
                        { value: 'Service Lifecycle', label: 'Service Lifecycle' },
                    ]}
                />
                 <CustomSelect 
                    id="targetItem"
                    label="Select an Item"
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    placeholder="Select an item to begin..."
                    options={targetOptions}
                />
            </div>

            {renderFlow()}
        </div>
    );
};