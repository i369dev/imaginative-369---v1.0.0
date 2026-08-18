export const UserRoles = [
  'Admin',
  'Director',
  'HR and Administrator',
  'Marketing',
  'Finance',
  'Operation',
  'Product and Resource Management',
  'Employee',
] as const;

export type UserRole = typeof UserRoles[number];

export interface User {
  username: string;
  password?: string; // Keep optional as it's not always exposed
  role: UserRole;
  fullName?: string;
  idNo?: string;
  contactNo?: string;
  address?: string;
  email?: string;
  designations?: string[];
  profilePicPreview?: string | null;
  archivedDate?: string;
  archivedBy?: string;
}

export interface Service {
    name: string;
    archivedDate?: string;
    archivedBy?: string;
}

export interface Products {
  graphicDesign: Service[];
  videoProduction: Service[];
  photography: Service[];
  digitalMarketing: Service[];
}

// New types for Jobs
export type TaskStatus = 'Assigned' | 'In Progress' | 'Completed' | 'Blocked';

export interface FileInfo {
    name: string;
    type: string;
    size: number;
}

export interface JobAttachment {
    type: 'file' | 'link';
    value: string;
    fileInfo?: FileInfo;
}

export interface JobAssignment {
    assignmentId: string; // Unique ID for this specific assignment instance
    employee: string;
    status: TaskStatus;
    // New fields for assignment details
    taskDetails: string;
    taskDeadline?: string; // ISO string
    taskAttachments?: JobAttachment[];
    // New fields for completion details
    completionNotes?: string;
    completionAttachment?: {
        type: 'file' | 'link';
        value: string; // URL for link, filename for file
        fileInfo?: FileInfo; // Details for file uploads
    };
    liveStatusUpdate?: string;
}

export interface JobServiceDetail {
    enabled: boolean;
    services: string[];
    description: string;
}

export interface Job {
    id: string;
    customerName: string;
    companyName: string;
    contactNo: string;
    email: string;
    deadlineDate: string;
    documents: { name: string; }[];
    jobCreatedDate: string;
    isAssigned?: boolean;
    assignedTo?: { [department: string]: { [service: string]: JobAssignment[] } }; // Tracks assignment history per service
    graphicDesign: JobServiceDetail;
    videoProduction: JobServiceDetail;
    photography: JobServiceDetail;
    digitalMarketing: JobServiceDetail;
    archivedDate?: string;
    archivedBy?: string;
}

// New types for Camera Equipment
export type CameraEquipmentStatus = 'In Stock' | 'Checked Out';

export const EquipmentCategories = [
    'Camera Body',
    'Lens',
    'Tripod',
    'Gimbal',
    'Lighting',
    'Microphone',
    'Drone',
    'Storage',
    'Accessory'
] as const;

export type EquipmentCategory = typeof EquipmentCategories[number];

export interface CameraEquipment {
    id: string;
    name: string;
    category: EquipmentCategory;
    serialNumber: string;
    status: CameraEquipmentStatus;
    checkedOutBy?: string; // Employee's full name
    lastActionDate?: string; // ISO string for last check-in/out
    purchaseDate?: string;
    notes?: string;
    checkOutNotes?: string; // Notes made during checkout
    archivedDate?: string;
    archivedBy?: string;
}

// --- New type for System Activities ---
export type ActivityLogCategory = 'User Management' | 'Job Details' | 'Our Products' | 'Camera Equipment';

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: ActivityLogCategory;
  details: string;
  targetId: string;
}

// --- New Types for Attendance Dashboard ---
export interface AttendanceRecord {
    userId: string;
    fullName: string;
    username: string;
    profilePicPreview?: string | null;
    status: 'Logged In' | 'Logged Out' | 'Paused';
    lastSeen: string | null;
    dailyDuration: number;
    weeklyDuration: number;
    billingCycleDuration: number;
    totalDuration: number;
    loginCount: number;
    logoutCount: number;
    overtimeDuration: number; // in seconds
}

export interface ArchivedAttendanceMonth {
    year: number;
    // e.g., "June 25 - July 24"
    monthDisplay: string;
    // e.g., "2024-07"
    monthKey: string;
    records: AttendanceRecord[];
}

// --- New type for Admin UI Control ---
export type EmployeeUICardComponent = 'PerformanceCard' | 'AttendanceCard' | 'TaskSummaryCard' | 'TasksTable';

export type CardShape = 'rounded-lg' | 'rounded-2xl' | 'sharp';
export type CardColor = 'slate' | 'cyan' | 'purple' | 'green';
export type CardWidth = 'full' | 'half';

export interface EmployeeUICard {
  id: string; // e.g., 'performanceCard'
  component: EmployeeUICardComponent;
  visible: boolean;
  title: string;
  color: CardColor;
  shape: CardShape;
  width: CardWidth;
  columns?: {
    [key: string]: {
      visible: boolean;
      label: string;
    }
  };
  actions?: {
    taskEditing: boolean;
    taskDeleting: boolean;
  };
}

export type EmployeeUIConfig = EmployeeUICard[];

export type AllEmployeeUIConfigs = {
  [username: string]: EmployeeUIConfig;
};