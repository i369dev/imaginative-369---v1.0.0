



import React from 'react';
import { User, UserRole, Job, Products, CameraEquipment, TaskStatus, Service, ActivityLog, ArchivedAttendanceMonth, AttendanceRecord, EmployeeUIConfig, AllEmployeeUIConfigs, FileInfo, JobAttachment } from '../types';
import { 
    AdminDashboard,
    DirectorDashboard,
    EmployeeDashboard,
    FinanceDashboard,
    HRAdminDashboard,
    MarketingDashboard,
    OperationDashboard,
    ProductResourceDashboard,
    SystemActivitiesDashboard
} from './dashboards/index.ts';
import { LogoutIcon } from './common/Icons';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  // User Management
  onAddNewUser: (user: User) => void;
  allUsers: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (username: string) => void;
  // Job Management
  allJobs: Job[];
  onCreateJob: (job: Omit<Job, 'id' | 'isAssigned'>) => void;
  onUpdateJob: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
  onAssignJobToOperation: (job: Job) => void;
  // Product/Service Management
  products: Products;
  onAddProduct: (category: keyof Products, serviceName: string) => void;
  onDeleteProduct: (category: keyof Products, serviceName: string) => void;
  // Camera Equipment Management
  allEquipment: CameraEquipment[];
  onAddEquipment: (item: Omit<CameraEquipment, 'id' | 'status'>) => void;
  onUpdateEquipment: (item: CameraEquipment) => void;
  onDeleteEquipment: (id: string) => void;
  onCheckOutEquipment: (id: string, employeeName: string, checkOutNotes: string) => void;
  onCheckInEquipment: (id: string, conditionNotes: string) => void;
  // Operational Jobs
  onAssignTaskToEmployee: (jobId: string, department: string, serviceName: string, taskData: { employee: string; taskDetails: string; taskDeadline?: string; taskAttachments?: JobAttachment[]; }) => void;
  onUpdateTaskStatus: (jobId: string, department: string, serviceName: string, status: TaskStatus, assignmentId: string, details?: { completionNotes: string; completionAttachment?: { type: 'file' | 'link', value: string, fileInfo?: FileInfo } }) => void;
  onUnassignTask: (jobId: string, department: string, serviceName: string, assignmentId: string) => void;
  // Product Archive Management
  archivedProducts: Products;
  archivedEquipment: CameraEquipment[];
  onRestoreProduct: (category: keyof Products, serviceName: string) => void;
  onPermanentDeleteProduct: (category: keyof Products, serviceName: string) => void;
  onRestoreEquipment: (id: string) => void;
  onPermanentDeleteEquipment: (id: string) => void;
  // Admin Archive Management
  archivedUsers: User[];
  archivedJobs: Job[];
  onRestoreUser: (username: string) => void;
  onPermanentDeleteUser: (username: string) => void;
  onRestoreJob: (jobId: string) => void;
  onPermanentDeleteJob: (jobId: string) => void;
  // System Activities
  activityLogs: ActivityLog[];
  // Attendance Archiving
  archivedAttendance: ArchivedAttendanceMonth[];
  onArchiveAttendance: (archive: ArchivedAttendanceMonth) => void;
  // Pause/Resume Session
  onTogglePause: (action: 'pause' | 'resume', userForAction?: User) => void;
  // Employee UI Config
  allEmployeeUIConfigs: AllEmployeeUIConfigs;
  onUpdateEmployeeUIConfig: (username: string, config: EmployeeUIConfig) => void;
}

const renderDashboardByRole = (role: UserRole, props: Omit<DashboardProps, 'user' | 'onLogout'>, user: User) => {
    switch (role) {
        case 'Admin':
            return <AdminDashboard 
                users={props.allUsers} 
                onUpdateUser={props.onUpdateUser} 
                onDeleteUser={props.onDeleteUser} 
                jobs={props.allJobs} 
                onUpdateJob={props.onUpdateJob}
                onDeleteJob={props.onDeleteJob}
                products={props.products} 
                equipment={props.allEquipment}
                // Admin Archive Props
                archivedUsers={props.archivedUsers}
                archivedJobs={props.archivedJobs}
                onRestoreUser={props.onRestoreUser}
                onPermanentDeleteUser={props.onPermanentDeleteUser}
                onRestoreJob={props.onRestoreJob}
                onPermanentDeleteJob={props.onPermanentDeleteJob}
                // System Activities
                activityLogs={props.activityLogs}
                // Employee UI Config
                allEmployeeUIConfigs={props.allEmployeeUIConfigs}
                onUpdateEmployeeUIConfig={props.onUpdateEmployeeUIConfig}
                onUnassignTask={props.onUnassignTask}
                allJobs={props.allJobs}
                onUpdateTaskStatus={props.onUpdateTaskStatus}
                onTogglePause={props.onTogglePause}
            />;
        case 'Director':
            return <DirectorDashboard />;
        case 'HR and Administrator':
            return <HRAdminDashboard
                onAddNewUser={props.onAddNewUser}
                allUsers={props.allUsers}
                activityLogs={props.activityLogs}
                archivedAttendance={props.archivedAttendance}
                onArchiveAttendance={props.onArchiveAttendance}
            />;
        case 'Marketing':
            return <MarketingDashboard onCreateJob={props.onCreateJob} allJobs={props.allJobs} products={props.products} onAssignJobToOperation={props.onAssignJobToOperation} />;
        case 'Finance':
            return <FinanceDashboard />;
        case 'Operation':
            return <OperationDashboard 
                allJobs={props.allJobs}
                users={props.allUsers}
                onAssignTaskToEmployee={props.onAssignTaskToEmployee}
            />;
        case 'Product and Resource Management':
            return <ProductResourceDashboard 
                products={props.products} 
                onAddProduct={props.onAddProduct} 
                onDeleteProduct={props.onDeleteProduct}
                equipment={props.allEquipment}
                users={props.allUsers}
                onAddEquipment={props.onAddEquipment}
                onUpdateEquipment={props.onUpdateEquipment}
                onDeleteEquipment={props.onDeleteEquipment}
                onCheckOutEquipment={props.onCheckOutEquipment}
                onCheckInEquipment={props.onCheckInEquipment}
                // Archive props
                archivedProducts={props.archivedProducts}
                archivedEquipment={props.archivedEquipment}
                onRestoreProduct={props.onRestoreProduct}
                onPermanentDeleteProduct={props.onPermanentDeleteProduct}
                onRestoreEquipment={props.onRestoreEquipment}
                onPermanentDeleteEquipment={props.onPermanentDeleteEquipment}
            />;
        case 'Employee':
            return <EmployeeDashboard 
                        user={user} 
                        allJobs={props.allJobs} 
                        allUsers={props.allUsers}
                        onUpdateTaskStatus={props.onUpdateTaskStatus}
                        onTogglePause={props.onTogglePause}
                        activityLogs={props.activityLogs}
                        employeeUIConfig={props.allEmployeeUIConfigs[user.username]}
                        onUnassignTask={props.onUnassignTask}
                   />;
        default:
            return <div>Unknown role. Please contact support.</div>;
    }
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, ...restOfProps }) => {
    
    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0 bg-neutral-900/50">
                <div className="flex items-baseline gap-3">
                    <h1 className="font-logo text-2xl text-white leading-tight">imaginative 369</h1>
                    <span className="text-neutral-400 text-sm font-medium leading-tight">{user.role} Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-neutral-300 text-sm">Welcome, <span className="font-semibold text-white capitalize">{user.username}</span></span>
                    <button 
                        onClick={onLogout}
                        className="bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-300 font-bold p-2 rounded-full transition-colors group"
                        aria-label="Logout"
                        title="Logout"
                    >
                        <LogoutIcon className="h-5 w-5 group-hover:text-white" />
                    </button>
                </div>
            </header>
            <main className="flex-grow p-6 overflow-y-auto">
                {renderDashboardByRole(user.role, restOfProps, user)}
            </main>
        </div>
    );
};

export default Dashboard;