

import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { User, Job, Products, CameraEquipment, TaskStatus, Service, ActivityLog, ActivityLogCategory, ArchivedAttendanceMonth, AttendanceRecord, JobAssignment, FileInfo, EmployeeUIConfig, AllEmployeeUIConfigs, JobAttachment } from './types';
// import ThreeDBackground from './components/common/ThreeDBackground';

// Mock Data updated with richer user details.
const mockUsers: User[] = [
    { username: 'Admin', password: 'admin', role: 'Admin', fullName: 'System Administrator', email: 'admin@imaginative369.com' },
    { username: 'director', password: 'p', role: 'Director', fullName: 'Diana Director', email: 'd.director@imaginative369.com' },
    { username: 'hr_admin', password: 'p', role: 'HR and Administrator', fullName: 'Henry Human', email: 'h.human@imaginative369.com' },
    { username: 'marketing', password: 'p', role: 'Marketing', fullName: 'Mark Etier', email: 'm.etier@imaginative369.com' },
    { username: 'finance', password: 'p', role: 'Finance', fullName: 'Finn Ance', email: 'f.ance@imaginative369.com' },
    { username: 'operation', password: 'p', role: 'Operation', fullName: 'Oprah Tion', email: 'o.tion@imaginative369.com' },
    { username: 'prod_res', password: 'p', role: 'Product and Resource Management', fullName: 'P.R. Manager', email: 'pr.manager@imaginative369.com' },
    { username: 'emily', password: 'p', role: 'Employee', fullName: 'Emily Ployee', email: 'e.ployee@imaginative369.com', designations: ['Graphic Design', 'Social Media Managing'] },
    { username: 'john', password: 'p', role: 'Employee', fullName: 'John Doe', email: 'j.doe@imaginative369.com', designations: ['Videography', 'Photography'] },
    { username: 'jane', password: 'p', role: 'Employee', fullName: 'Jane Smith', email: 'j.smith@imaginative369.com', designations: ['Video Editing'] },
    { username: 'sam', password: 'p', role: 'Employee', fullName: 'Sam Jones', email: 's.jones@imaginative369.com', designations: ['Graphic Design'] },
    { username: 'alex', password: 'p', role: 'Employee', fullName: 'Alex Ray', email: 'a.ray@imaginative369.com', designations: ['Photography'] },
];

const initialProducts: Products = {
    graphicDesign: [
        { name: 'Logo & Branding' }, { name: 'Menu Design' }, { name: 'Social Media Post' }, { name: 'Vector Artworks' },
        { name: 'Digital Arts' }, { name: 'Flyer / Brochure Design' }
    ],
    videoProduction: [
        { name: "Travel Content Production" }, { name: "Event Coverage" }, { name: "Music Video Coverage" },
        { name: "Tourism Promotion" }, { name: "Product Videography" }, { name: "YouTube Video Post Production" },
        { name: "Short Films" }
    ],
    photography: [
        { name: "Hotel & Real Estate" }, { name: "Event" }, { name: "Product" }, { name: "Lifestyle" },
        { name: "Fashion & Clothing" }, { name: "Drone Photography" }, { name: "Travel & Tourism" }
    ],
    digitalMarketing: [
        { name: "Social Media Management" }, { name: "Influencer Marketing" }, { name: "Paid Advertising" }, { name: "Direct Marketing" },
        { name: "Advertising & Promotion" }, { name: "Booking.com" }, { name: "Trip Advisor" }, { name: "Google my business" }, { name: "Web Development" }
    ]
};

const initialEquipment: CameraEquipment[] = [
    { id: '1', name: 'Canon EOS R5', category: 'Camera Body', serialNumber: 'SN-C-R5-001', status: 'In Stock', purchaseDate: '2023-01-15', notes: 'Primary video camera.' },
    { id: '2', name: 'Sony A7 IV', category: 'Camera Body', serialNumber: 'SN-S-A74-002', status: 'Checked Out', checkedOutBy: 'John Doe', lastActionDate: new Date(Date.now() - 86400000 * 2).toISOString(), purchaseDate: '2023-03-20', notes: 'Used for photography.', checkOutNotes: 'Checked out with kit lens, 2 batteries, and carrying case for riverside shoot.' },
    { id: '3', name: 'DJI Ronin-S', category: 'Gimbal', serialNumber: 'SN-DJI-RS-001', status: 'In Stock', purchaseDate: '2022-11-01' },
    { id: '4', name: 'Sigma 24-70mm f/2.8', category: 'Lens', serialNumber: 'SN-SIG-2470-001', status: 'In Stock', purchaseDate: '2023-01-15' },
    { id: '5', name: 'Rode VideoMic Pro+', category: 'Microphone', serialNumber: 'SN-RDE-VMP-001', status: 'Checked Out', checkedOutBy: 'Jane Smith', lastActionDate: new Date(Date.now() - 86400000 * 5).toISOString(), purchaseDate: '2022-09-10', checkOutNotes: 'For interview session.'},
];

const initialJobs: Job[] = [
    { 
        id: 'job-1', customerName: 'Sunset Cafe', companyName: 'Sunset Hospitality', contactNo: '555-0101', email: 'contact@sunsetcafe.com', deadlineDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0], documents: [{name: 'brief.pdf'}], jobCreatedDate: new Date(Date.now() - 86400000 * 4).toISOString(), isAssigned: true, 
        assignedTo: { 
            'Graphic Design': { 
                'Menu Design': [{ 
                    assignmentId: '1-1', 
                    employee: 'Emily Ployee', 
                    status: 'In Progress', 
                    liveStatusUpdate: "Started working on the task.",
                    taskDetails: "Initial design concepts for the summer menu. Focus on a vibrant, fresh feel. See attached moodboard.",
                    taskDeadline: new Date(Date.now() + 86400000 * 7).toISOString(),
                    taskAttachments: [{ type: 'link', value: 'https://www.pinterest.com/moodboard/summer-menu' }]
                }] 
            } 
        },
        graphicDesign: { enabled: true, services: ['Menu Design', 'Social Media Post'], description: 'New summer menu design and 3 social media posts.' }, videoProduction: { enabled: false, services: [], description: '' }, photography: { enabled: false, services: [], description: '' }, digitalMarketing: { enabled: false, services: [], description: '' },
    },
    { 
        id: 'job-2', customerName: 'Apex Real Estate', companyName: 'Apex Group', contactNo: '555-0102', email: 'info@apexre.com', deadlineDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], documents: [{name: 'floor-plans.zip'}, {name: 'locations.docx'}], jobCreatedDate: new Date(Date.now() - 86400000 * 10).toISOString(), isAssigned: true,
        assignedTo: { 
            'Photography': { 
                'Hotel & Real Estate': [{ 
                    assignmentId: '2-1', 
                    employee: 'John Doe', 
                    status: 'Completed', 
                    completionNotes: 'All interior and exterior shots completed as per the brief.', 
                    liveStatusUpdate: 'Completed: All interior and exterior shots completed...', 
                    taskDetails: "Full photoshoot of property interiors and exteriors.",
                    taskAttachments: [{type: 'file', value: 'completed_photos.zip', fileInfo: { name: 'completed_photos.zip', type: 'application/zip', size: 24000000 }}]
                }], 
                'Drone Photography': [{ 
                    assignmentId: '2-2', 
                    employee: 'John Doe', 
                    status: 'Assigned', 
                    liveStatusUpdate: "Assigned to John Doe", 
                    taskDetails: "Aerial shots of the property and surrounding area. Need this done by EOW.",
                    taskDeadline: new Date(Date.now() + 86400000 * 3).toISOString()
                }] 
            }, 
            'Video Editing': { 'YouTube Video Post Production': [{ 
                    assignmentId: '2-3', 
                    employee: 'Jane Smith', 
                    status: 'Blocked', 
                    liveStatusUpdate: "Task has been blocked.", 
                    taskDetails: "Shoot a 2-min promo video. Blocked pending drone footage." 
            }] } 
        },
        graphicDesign: { enabled: false, services: [], description: '' }, 
        videoProduction: { enabled: true, services: ['YouTube Video Post Production'], description: 'A 2-minute promotional video of the new property.'}, 
        photography: { enabled: true, services: ['Hotel & Real Estate', 'Drone Photography'], description: 'Photos of all rooms and exterior drone shots.'}, 
        digitalMarketing: { enabled: false, services: [], description: '' },
    },
];

const initialArchivedProducts: Products = {
    graphicDesign: [], videoProduction: [], photography: [], digitalMarketing: []
};

// --- Mock Activity Logs for Demo ---
const mockActivityLogs: ActivityLog[] = [
    { id: 'log-22', timestamp: new Date(Date.now() - 3600000 * 0.2).toISOString(), user: 'operation', action: 'TASK_REASSIGNED', category: 'Job Details', details: "Task 'Menu Design' reassigned from 'Sam Jones' to 'Emily Ployee' for job ID 'job-1'.", targetId: 'job-1' },
    { id: 'log-21', timestamp: new Date(Date.now() - 60000 * 5).toISOString(), user: 'emily', action: 'USER_PAUSE', category: 'User Management', details: "User 'emily' paused their session.", targetId: 'emily' },
    { id: 'log-20', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), user: 'Admin', action: 'USER_LOGIN', category: 'User Management', details: "User 'Admin' logged in successfully.", targetId: 'Admin' },
    { id: 'log-19', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), user: 'prod_res', action: 'PRODUCT_RESTORED', category: 'Our Products', details: "Service 'Vector Artworks' from category 'graphicDesign' was restored.", targetId: 'Vector Artworks' },
    { id: 'log-18', timestamp: new Date(Date.now() - 60000 * 15).toISOString(), user: 'emily', action: 'USER_LOGIN', category: 'User Management', details: "User 'emily' logged in.", targetId: 'emily' },
    { id: 'log-17', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), user: 'prod_res', action: 'EQUIPMENT_CHECKED_IN', category: 'Camera Equipment', details: "Equipment 'Sony A7 IV' (ID: 2) was checked in.", targetId: '2' },
    { id: 'log-16', timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), user: 'operation', action: 'TASK_STATUS_UPDATED', category: 'Job Details', details: "Task 'Product Videography' for job ID 'job-2' updated to 'Blocked'.", targetId: 'job-2' },
    { id: 'log-15', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), user: 'prod_res', action: 'PRODUCT_ARCHIVED', category: 'Our Products', details: "Service 'Vector Artworks' from category 'graphicDesign' was archived.", targetId: 'Vector Artworks' },
    { id: 'log-14', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), user: 'john', action: 'TASK_STATUS_UPDATED', category: 'Job Details', details: "Task 'Hotel & Real Estate' for job ID 'job-2' updated to 'Completed'.", targetId: 'job-2' },
    { id: 'log-13', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), user: 'prod_res', action: 'EQUIPMENT_CHECKED_OUT', category: 'Camera Equipment', details: "Equipment 'Sony A7 IV' (ID: 2) checked out by 'John Doe'.", targetId: '2' },
    { id: 'log-12', timestamp: new Date(Date.now() - 86400000 * 2.5).toISOString(), user: 'prod_res', action: 'EQUIPMENT_UPDATED', category: 'Camera Equipment', details: "Equipment 'Sony A7 IV' (ID: 2) details were updated.", targetId: '2' },
    { id: 'log-11', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), user: 'Admin', action: 'USER_UPDATED', category: 'User Management', details: "User details for 'emily' were updated.", targetId: 'emily' },
    { id: 'log-10', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), user: 'marketing', action: 'JOB_CREATED', category: 'Job Details', details: "New job for customer 'Sunset Cafe' was created.", targetId: 'job-1' },
    { id: 'log-9', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), user: 'prod_res', action: 'EQUIPMENT_CHECKED_OUT', category: 'Camera Equipment', details: "Equipment 'Rode VideoMic Pro+' (ID: 5) checked out by 'Jane Smith'.", targetId: '5' },
    { id: 'log-8', timestamp: new Date(Date.now() - 86400000 * 6).toISOString(), user: 'hr_admin', action: 'USER_CREATED', category: 'User Management', details: "New user 'alex' was created with role 'Employee'.", targetId: 'alex' },
    { id: 'log-7', timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), user: 'operation', action: 'TASK_ASSIGNED', category: 'Job Details', details: "Task 'Product Videography' assigned to 'Jane Smith' for job ID 'job-2'.", targetId: 'job-2' },
    { id: 'log-6', timestamp: new Date(Date.now() - 86400000 * 7.5).toISOString(), user: 'operation', action: 'TASK_ASSIGNED', category: 'Job Details', details: "Task 'Drone Photography' assigned to 'John Doe' for job ID 'job-2'.", targetId: 'job-2' },
    { id: 'log-5', timestamp: new Date(Date.now() - 86400000 * 8).toISOString(), user: 'operation', action: 'TASK_ASSIGNED', category: 'Job Details', details: "Task 'Hotel & Real Estate' assigned to 'John Doe' for job ID 'job-2'.", targetId: 'job-2' },
    { id: 'log-4', timestamp: new Date(Date.now() - 86400000 * 8.5).toISOString(), user: 'marketing', action: 'JOB_ASSIGNED_TO_OPS', category: 'Job Details', details: "Job ID 'job-2' assigned to Operations: Photography, Video Editing.", targetId: 'job-2' },
    { id: 'log-3', timestamp: new Date(Date.now() - 86400000 * 9).toISOString(), user: 'prod_res', action: 'PRODUCT_CREATED', category: 'Our Products', details: "New service 'Vector Artworks' added to category 'graphicDesign'.", targetId: 'Vector Artworks' },
    { id: 'log-2', timestamp: new Date(Date.now() - 86400000 * 10).toISOString(), user: 'marketing', action: 'JOB_CREATED', category: 'Job Details', details: "New job for customer 'Apex Real Estate' was created.", targetId: 'job-2' },
    { id: 'log-1', timestamp: new Date(Date.now() - 86400000 * 12).toISOString(), user: 'prod_res', action: 'EQUIPMENT_CREATED', category: 'Camera Equipment', details: "New equipment 'Sony A7 IV' (SN: SN-S-A74-002) was added.", targetId: '2' },
];

const generateDefaultUIConfig = (): EmployeeUIConfig => ([
    {
        id: 'performanceCard',
        component: 'PerformanceCard',
        visible: true,
        title: 'My Performance vs. Team Average',
        color: 'slate',
        shape: 'rounded-2xl',
        width: 'full',
    },
    {
        id: 'attendanceCard',
        component: 'AttendanceCard',
        visible: true,
        title: 'My Attendance', // this title is not used in the card, but good to have
        color: 'slate',
        shape: 'rounded-2xl',
        width: 'half',
    },
    {
        id: 'taskSummaryCard',
        component: 'TaskSummaryCard',
        visible: true,
        title: 'Monthly Task Summary',
        color: 'purple',
        shape: 'rounded-2xl',
        width: 'half',
    },
    {
        id: 'tasksTable',
        component: 'TasksTable',
        visible: true,
        title: 'My Tasks',
        color: 'slate',
        shape: 'rounded-lg',
        width: 'full',
        columns: {
            task: { visible: true, label: 'Task' },
            status: { visible: true, label: 'Status' },
            action: { visible: true, label: 'Action' },
        },
        actions: {
          taskEditing: false, 
          taskDeleting: false,
        }
    },
]);

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [products, setProducts] = useState<Products>(initialProducts);
  const [allEquipment, setAllEquipment] = useState<CameraEquipment[]>(initialEquipment);
  // --- New state for archived items ---
  const [archivedProducts, setArchivedProducts] = useState<Products>(initialArchivedProducts);
  const [archivedEquipment, setArchivedEquipment] = useState<CameraEquipment[]>([]);
  const [archivedUsers, setArchivedUsers] = useState<User[]>([]);
  const [archivedJobs, setArchivedJobs] = useState<Job[]>([]);
  
  // --- New state for Activity Logs ---
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  
  // --- New state for Attendance Archive ---
  const [archivedAttendance, setArchivedAttendance] = useState<ArchivedAttendanceMonth[]>([]);

  // --- New state for Admin UI Control ---
  const [allEmployeeUIConfigs, setAllEmployeeUIConfigs] = useState<AllEmployeeUIConfigs>(() => {
    const initialConfigs: AllEmployeeUIConfigs = {};
    mockUsers.forEach(user => {
      initialConfigs[user.username] = generateDefaultUIConfig();
    });
    return initialConfigs;
  });
  
  // --- Logger function ---
  const logActivity = (actingUser: User | null, category: ActivityLogCategory, action: string, details: string, targetId: string) => {
    if (!actingUser) return;
    const newLog: ActivityLog = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        user: actingUser.username,
        category,
        action,
        details,
        targetId,
    };
    setActivityLogs(prev => [newLog, ...prev]); // Prepend for chronological order
  };


  const handleLogin = (username: string, password: string): void => {
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (user) {
      const { password, ...userToStore } = user;
      setCurrentUser(userToStore as User);
      setError(null);
      logActivity(user, 'User Management', 'USER_LOGIN', `User '${user.username}' logged in successfully.`, user.username);
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleLogout = (): void => {
    if(currentUser) {
        logActivity(currentUser, 'User Management', 'USER_LOGOUT', `User '${currentUser.username}' logged out.`, currentUser.username);
    }
    setCurrentUser(null);
  };
  
  const handleTogglePause = (action: 'pause' | 'resume', userForAction?: User) => {
    const actingAdmin = currentUser;
    const targetUser = userForAction || currentUser;

    if (!targetUser) return;
    
    // If userForAction is provided, it means an admin is acting on behalf of someone.
    if (userForAction && actingAdmin?.username !== targetUser.username) {
        if (!actingAdmin || (actingAdmin.role !== 'Admin' && actingAdmin.role !== 'Director')) {
            // Silently fail, not an expected case for this UI
            return;
        }

        const actionType = action === 'pause' ? 'ADMIN_USER_PAUSE' : 'ADMIN_USER_RESUME';
        const logDetails = `Admin '${actingAdmin.username}' ${action}d session for user '${targetUser.username}'.`;
        
        logActivity(actingAdmin, 'User Management', actionType, logDetails, targetUser.username);
        alert(`Session for ${targetUser.fullName} has been ${action}d.`);

    } else { // The current user is acting for themselves.
        const selfActionType = action === 'pause' ? 'USER_PAUSE' : 'USER_RESUME';
        const logDetails = `User '${targetUser.username}' ${action}d their session.`;

        logActivity(targetUser, 'User Management', selfActionType, logDetails, targetUser.username);
        
        if (action === 'pause') {
            alert('Session Paused. Your time is no longer being tracked.');
        } else {
            alert('Session Resumed. Welcome back!');
        }
    }
  };

  const handleAddNewUser = (newUser: User) => {
      setUsers(prevUsers => {
          if (prevUsers.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
              alert(`Error: Username '${newUser.username}' already exists.`);
              return prevUsers;
          }
          alert(`User '${newUser.username}' created successfully. They can now log in.`);
          logActivity(currentUser, 'User Management', 'USER_CREATED', `New user '${newUser.username}' was created with role '${newUser.role}'.`, newUser.username);
          return [...prevUsers, newUser];
      });
      setAllEmployeeUIConfigs(prev => ({
        ...prev,
        [newUser.username]: generateDefaultUIConfig()
      }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prevUsers => {
        const userIndex = prevUsers.findIndex(u => u.username === updatedUser.username);
        if (userIndex === -1) {
            alert("Error: could not find user to update.");
            return prevUsers;
        }

        const newUsers = [...prevUsers];
        const existingUser = newUsers[userIndex];
        
        newUsers[userIndex] = { ...existingUser, ...updatedUser };
        
        if (updatedUser.password === '') {
            newUsers[userIndex].password = existingUser.password;
        }

        if (currentUser?.username === updatedUser.username) {
            const { password, ...userToStore } = newUsers[userIndex];
            setCurrentUser(userToStore);
        }
        logActivity(currentUser, 'User Management', 'USER_UPDATED', `User details for '${updatedUser.username}' were updated.`, updatedUser.username);
        return newUsers;
    });
  };

  const handleDeleteUser = (usernameToDelete: string) => {
    if (!currentUser) return;
    if (usernameToDelete === currentUser?.username) {
        alert("Action not allowed: You cannot delete your own account while logged in.");
        return;
    }
     if (usernameToDelete === 'Admin') {
        alert("Action not allowed: The primary Admin account cannot be deleted.");
        return;
    }
    
    let userToArchive: User | undefined;
    setUsers(prevUsers => {
        userToArchive = prevUsers.find(u => u.username === usernameToDelete);
        return prevUsers.filter(u => u.username !== usernameToDelete);
    });

    if (userToArchive) {
        userToArchive.archivedDate = new Date().toISOString();
        userToArchive.archivedBy = currentUser.username;
        setArchivedUsers(prev => [...prev, userToArchive!]);
        logActivity(currentUser, 'User Management', 'USER_ARCHIVED', `User '${usernameToDelete}' was archived.`, usernameToDelete);
    }
  };

  const handleRestoreUser = (usernameToRestore: string) => {
      let userToRestore: User | undefined;
      setArchivedUsers(prev => {
          userToRestore = prev.find(u => u.username === usernameToRestore);
          return prev.filter(u => u.username !== usernameToRestore);
      });
      if (userToRestore) {
          delete userToRestore.archivedDate;
          delete userToRestore.archivedBy;
          setUsers(prev => [...prev, userToRestore!]);
          logActivity(currentUser, 'User Management', 'USER_RESTORED', `User '${usernameToRestore}' was restored from archive.`, usernameToRestore);
      }
  };

  const handlePermanentDeleteUser = (usernameToDelete: string) => {
      setArchivedUsers(prev => prev.filter(u => u.username !== usernameToDelete));
      setAllEmployeeUIConfigs(prev => {
          const newConfigs = { ...prev };
          delete newConfigs[usernameToDelete];
          return newConfigs;
      });
      logActivity(currentUser, 'User Management', 'USER_DELETED_PERMANENTLY', `User '${usernameToDelete}' was permanently deleted.`, usernameToDelete);
      alert(`User '${usernameToDelete}' has been permanently deleted.`);
  };
  
  const handleCreateJob = (newJobData: Omit<Job, 'id' | 'isAssigned'>) => {
    const newJobWithId: Job = { ...newJobData, id: Date.now().toString(), isAssigned: false, assignedTo: {} };
    setJobs(prevJobs => [...prevJobs, newJobWithId]);
    logActivity(currentUser, 'Job Details', 'JOB_CREATED', `New job for customer '${newJobWithId.customerName}' was created.`, newJobWithId.id);
  };

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs(prevJobs => {
        const jobIndex = prevJobs.findIndex(j => j.id === updatedJob.id);
        if (jobIndex === -1) {
            alert("Error: could not find job to update.");
            return prevJobs;
        }
        const newJobs = [...prevJobs];
        newJobs[jobIndex] = updatedJob;
        logActivity(currentUser, 'Job Details', 'JOB_UPDATED', `Job details for '${updatedJob.customerName}' (ID: ${updatedJob.id}) were updated.`, updatedJob.id);
        return newJobs;
    });
  };
  
  const handleDeleteJob = (jobIdToDelete: string) => {
      if (!currentUser) return;
      let jobToArchive: Job | undefined;
      setJobs(prev => {
          jobToArchive = prev.find(j => j.id === jobIdToDelete);
          return prev.filter(j => j.id !== jobIdToDelete);
      });

      if (jobToArchive) {
          jobToArchive.archivedDate = new Date().toISOString();
          jobToArchive.archivedBy = currentUser.username;
          setArchivedJobs(prev => [...prev, jobToArchive!]);
          logActivity(currentUser, 'Job Details', 'JOB_ARCHIVED', `Job for '${jobToArchive.customerName}' (ID: ${jobIdToDelete}) was archived.`, jobIdToDelete);
      }
  };

  const handleRestoreJob = (jobIdToRestore: string) => {
      let jobToRestore: Job | undefined;
      setArchivedJobs(prev => {
          jobToRestore = prev.find(j => j.id === jobIdToRestore);
          return prev.filter(j => j.id !== jobIdToRestore);
      });
      if (jobToRestore) {
          delete jobToRestore.archivedDate;
          delete jobToRestore.archivedBy;
          setJobs(prev => [...prev, jobToRestore!]);
          logActivity(currentUser, 'Job Details', 'JOB_RESTORED', `Job for '${jobToRestore.customerName}' (ID: ${jobIdToRestore}) was restored.`, jobIdToRestore);
      }
  };

  const handlePermanentDeleteJob = (jobIdToDelete: string) => {
      setArchivedJobs(prev => prev.filter(j => j.id !== jobIdToDelete));
      logActivity(currentUser, 'Job Details', 'JOB_DELETED_PERMANENTLY', `Job ID '${jobIdToDelete}' was permanently deleted.`, jobIdToDelete);
      alert(`Job ID '${jobIdToDelete}' has been permanently deleted.`);
  };

  const handleAssignJobToOperation = (jobToAssign: Job) => {
    setJobs(prevJobs => prevJobs.map(job => job.id === jobToAssign.id ? { ...job, isAssigned: true } : job));
    
    const assignedToDepts = [
        jobToAssign.graphicDesign.enabled && 'Graphic Design',
        jobToAssign.videoProduction.enabled && 'Video Editing', // Combined for ops
        jobToAssign.videoProduction.enabled && 'Videography',
        jobToAssign.photography.enabled && 'Photography',
        jobToAssign.digitalMarketing.enabled && 'Social Media Managing',
    ].filter(Boolean);

    if (assignedToDepts.length > 0) {
        logActivity(currentUser, 'Job Details', 'JOB_ASSIGNED_TO_OPS', `Job ID '${jobToAssign.id}' assigned to Operations: ${assignedToDepts.join(', ')}.`, jobToAssign.id);
        alert(`Job for ${jobToAssign.customerName} has been assigned.`);
    } else {
        alert(`No enabled services for job "${jobToAssign.customerName}" could be assigned.`);
    }
  };

  const handleAssignTaskToEmployee = (
      jobId: string, 
      department: string, 
      serviceName: string, 
      taskData: {
          employee: string,
          taskDetails: string,
          taskDeadline?: string,
          taskAttachments?: JobAttachment[]
      }
  ) => {
      setJobs(prevJobs => {
          return prevJobs.map(job => {
              if (job.id === jobId) {
                  const newJob = JSON.parse(JSON.stringify(job)); // Deep copy
                  const newAssignedTo = newJob.assignedTo || {};

                  if (!newAssignedTo[department]) newAssignedTo[department] = {};
                  if (!newAssignedTo[department][serviceName]) newAssignedTo[department][serviceName] = [];
                  
                  const newAssignment: JobAssignment = {
                      assignmentId: `${jobId}-${serviceName.replace(/\s+/g, '')}-${Date.now()}`,
                      status: 'Assigned',
                      liveStatusUpdate: `New task assigned to ${taskData.employee}.`,
                      ...taskData
                  };

                  newAssignedTo[department][serviceName].push(newAssignment);

                  logActivity(
                      currentUser, 
                      'Job Details', 
                      'TASK_ASSIGNED', 
                      `New task '${serviceName}' assigned to '${taskData.employee}' for job ID '${jobId}'.`, 
                      jobId
                  );

                  return { ...newJob, assignedTo: newAssignedTo };
              }
              return job;
          });
      });
      alert(`Task assigned to ${taskData.employee}.`);
  };
  
    const handleUnassignTask = (jobId: string, department: string, serviceName: string, assignmentId: string) => {
        setJobs(prevJobs => prevJobs.map(job => {
            if (job.id === jobId) {
                const newJob = JSON.parse(JSON.stringify(job));
                if (newJob.assignedTo?.[department]?.[serviceName]) {
                    const originalAssignments: JobAssignment[] = newJob.assignedTo[department][serviceName];
                    const employeeName = originalAssignments.find(a => a.assignmentId === assignmentId)?.employee;

                    newJob.assignedTo[department][serviceName] = originalAssignments.filter(
                        (assignment: JobAssignment) => assignment.assignmentId !== assignmentId
                    );

                    logActivity(currentUser, 'Job Details', 'TASK_UNASSIGNED', `Task '${serviceName}' was unassigned from employee '${employeeName}' on job '${job.customerName}'.`, jobId);
                }
                return newJob;
            }
            return job;
        }));
    };

  const handleUpdateTaskStatus = (
    jobId: string,
    department: string,
    serviceName: string,
    status: TaskStatus,
    assignmentId: string,
    details?: {
        completionNotes: string;
        completionAttachment?: { type: 'file' | 'link', value: string, fileInfo?: FileInfo };
    }
) => {
    setJobs(prevJobs =>
        prevJobs.map(job => {
            if (job.id === jobId && job.assignedTo?.[department]?.[serviceName]) {
                const newJob = JSON.parse(JSON.stringify(job));
                const assignments: JobAssignment[] = newJob.assignedTo[department][serviceName];
                const assignmentIndex = assignments.findIndex(a => a.assignmentId === assignmentId);

                if (assignmentIndex > -1) {
                    const assignmentToUpdate = assignments[assignmentIndex];
                    assignmentToUpdate.status = status;

                    let liveStatusUpdate = `Status updated to '${status}'.`;
                    
                    if (status === 'Completed' && details) {
                        assignmentToUpdate.completionNotes = details.completionNotes;
                        liveStatusUpdate = `Completed: ${details.completionNotes.substring(0, 50)}${details.completionNotes.length > 50 ? '...' : ''}`;
                        if (details.completionAttachment?.value) {
                            assignmentToUpdate.completionAttachment = details.completionAttachment;
                        }
                    } else if (status === 'In Progress') {
                        liveStatusUpdate = 'Started working on the task.';
                    } else if (status === 'Blocked') {
                        liveStatusUpdate = 'Task has been blocked.';
                    }
                    
                    assignmentToUpdate.liveStatusUpdate = liveStatusUpdate;

                    const actingUserIsAdminOnBehalfOfEmployee =
                        currentUser?.role === 'Admin' && assignmentToUpdate.employee !== currentUser?.fullName;

                    if (actingUserIsAdminOnBehalfOfEmployee) {
                        logActivity(
                            currentUser,
                            'Job Details',
                            'ADMIN_TASK_STATUS_UPDATE',
                            `Admin '${currentUser?.username}' updated task '${serviceName}' to '${status}' for employee '${assignmentToUpdate.employee}'.`,
                            jobId
                        );
                    } else {
                        logActivity(
                            currentUser,
                            'Job Details',
                            'TASK_STATUS_UPDATED',
                            `Task '${serviceName}' for job ID '${jobId}' updated to '${status}'.`,
                            jobId
                        );
                    }

                    if (status !== 'Completed') {
                         setTimeout(() => alert(`Task "${serviceName}" for job ${job.customerName} has been updated to "${status}".`), 0);
                    }
                    
                    return { ...job, assignedTo: newJob.assignedTo };
                }
            }
            return job;
        })
    );
};
  
  const handleAddProduct = (category: keyof Products, serviceName: string) => {
      if (!serviceName.trim()) { alert('Service name cannot be empty.'); return; }
      setProducts(prev => {
          const trimmedName = serviceName.trim();
          if (prev[category].some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
              alert(`Service '${trimmedName}' already exists in this category.`);
              return prev;
          }
          logActivity(currentUser, 'Our Products', 'PRODUCT_CREATED', `New service '${trimmedName}' added to category '${category}'.`, trimmedName);
          return { ...prev, [category]: [...prev[category], { name: trimmedName }] };
      });
  };

  const handleDeleteProduct = (category: keyof Products, serviceName: string) => {
      if (!currentUser) return;
      let serviceToArchive: Service | undefined;
      setProducts(prev => {
          serviceToArchive = prev[category].find(s => s.name === serviceName);
          return { ...prev, [category]: prev[category].filter(s => s.name !== serviceName) };
      });
      if (serviceToArchive) {
          serviceToArchive.archivedDate = new Date().toISOString();
          serviceToArchive.archivedBy = currentUser.username;
          setArchivedProducts(prev => ({ ...prev, [category]: [...prev[category], serviceToArchive!] }));
          logActivity(currentUser, 'Our Products', 'PRODUCT_ARCHIVED', `Service '${serviceName}' from category '${category}' was archived.`, serviceName);
      }
  };
  
  const handleRestoreProduct = (category: keyof Products, serviceName: string) => {
      let serviceToRestore: Service | undefined;
      setArchivedProducts(prev => {
          serviceToRestore = prev[category].find(s => s.name === serviceName);
          return { ...prev, [category]: prev[category].filter(s => s.name !== serviceName) };
      });
      if (serviceToRestore) {
          delete serviceToRestore.archivedDate;
          delete serviceToRestore.archivedBy;
          setProducts(prev => ({ ...prev, [category]: [...prev[category], serviceToRestore!] }));
          logActivity(currentUser, 'Our Products', 'PRODUCT_RESTORED', `Service '${serviceName}' from category '${category}' was restored.`, serviceName);
      }
  };
  
  const handlePermanentDeleteProduct = (category: keyof Products, serviceName: string) => {
      setArchivedProducts(prev => ({ ...prev, [category]: prev[category].filter(s => s.name !== serviceName) }));
      logActivity(currentUser, 'Our Products', 'PRODUCT_DELETED_PERMANENTLY', `Service '${serviceName}' from category '${category}' was permanently deleted.`, serviceName);
  };

  const handleAddEquipment = (item: Omit<CameraEquipment, 'id' | 'status'>) => {
    const newItem: CameraEquipment = { ...item, id: Date.now().toString(), status: 'In Stock' };
    setAllEquipment(prev => [...prev, newItem]);
    logActivity(currentUser, 'Camera Equipment', 'EQUIPMENT_CREATED', `New equipment '${newItem.name}' (SN: ${newItem.serialNumber}) was added.`, newItem.id);
  };

  const handleUpdateEquipment = (updatedItem: CameraEquipment) => {
    setAllEquipment(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    logActivity(currentUser, 'Camera Equipment', 'EQUIPMENT_UPDATED', `Equipment '${updatedItem.name}' (ID: ${updatedItem.id}) details were updated.`, updatedItem.id);
  };
  
  const handleDeleteEquipment = (id: string) => {
    if (!currentUser) return;
    let itemToArchive: CameraEquipment | undefined;
    setAllEquipment(prev => {
        itemToArchive = prev.find(item => item.id === id);
        return prev.filter(item => item.id !== id);
    });
    if (itemToArchive) {
        itemToArchive.archivedDate = new Date().toISOString();
        itemToArchive.archivedBy = currentUser.username;
        setArchivedEquipment(prev => [...prev, itemToArchive!]);
        logActivity(currentUser, 'Camera Equipment', 'EQUIPMENT_ARCHIVED', `Equipment '${itemToArchive.name}' (ID: ${id}) was archived.`, id);
    }
  };
  
  const handleRestoreEquipment = (id: string) => {
    let itemToRestore: CameraEquipment | undefined;
    setArchivedEquipment(prev => {
        itemToRestore = prev.find(item => item.id === id);
        return prev.filter(item => item.id !== id);
    });
    if (itemToRestore) {
        delete itemToRestore.archivedDate;
        delete itemToRestore.archivedBy;
        setAllEquipment(prev => [...prev, itemToRestore!]);
        logActivity(currentUser, 'Camera Equipment', 'EQUIPMENT_RESTORED', `Equipment '${itemToRestore.name}' (ID: ${id}) was restored.`, id);
    }
  };

  const handlePermanentDeleteEquipment = (id: string) => {
    const itemToDelete = archivedEquipment.find(item => item.id === id);
    setArchivedEquipment(prev => prev.filter(item => item.id !== id));
    if (itemToDelete) {
        logActivity(currentUser, 'Camera Equipment', 'EQUIPMENT_DELETED_PERMANENTLY', `Equipment '${itemToDelete.name}' (ID: ${id}) was permanently deleted.`, id);
    }
  };

  const handleCheckOutEquipment = (id: string, employeeName: string, checkOutNotes: string) => {
    setAllEquipment(prev => prev.map(item => {
        if (item.id === id) {
             logActivity(currentUser, 'Camera Equipment', 'EQUIPMENT_CHECKED_OUT', `Equipment '${item.name}' (ID: ${id}) checked out by '${employeeName}'.`, id);
            return { ...item, status: 'Checked Out', checkedOutBy: employeeName, lastActionDate: new Date().toISOString(), checkOutNotes: checkOutNotes };
        }
        return item;
    }));
  };

  const handleCheckInEquipment = (id: string, conditionNotes: string) => {
    setAllEquipment(prev => prev.map(item => {
      if (item.id === id) {
        const newNote = `[${new Date().toLocaleString()}] Checked In. Condition: ${conditionNotes || 'Not specified.'}`;
        const updatedNotes = `${newNote}\n${item.notes || ''}`.trim();
        logActivity(currentUser, 'Camera Equipment', 'EQUIPMENT_CHECKED_IN', `Equipment '${item.name}' (ID: ${id}) was checked in.`, id);
        return { ...item, status: 'In Stock', checkedOutBy: undefined, checkOutNotes: undefined, lastActionDate: new Date().toISOString(), notes: updatedNotes };
      }
      return item;
    }));
  };

  const handleArchiveAttendance = (newArchive: ArchivedAttendanceMonth) => {
    setArchivedAttendance(prev => {
        // Prevent duplicate archives for the same monthKey
        if (prev.some(a => a.monthKey === newArchive.monthKey)) {
            alert(`Attendance for ${newArchive.monthDisplay} has already been archived.`);
            return prev;
        }
        logActivity(currentUser, 'User Management', 'ATTENDANCE_ARCHIVED', `Archived attendance for period: ${newArchive.monthDisplay}`, 'SYSTEM');
        return [...prev, newArchive];
    });
  };

  const handleUpdateEmployeeUIConfig = (username: string, newConfig: EmployeeUIConfig) => {
      setAllEmployeeUIConfigs(prev => ({
          ...prev,
          [username]: newConfig
      }));
      logActivity(currentUser, 'User Management', 'EMPLOYEE_UI_UPDATED', `Admin updated the dashboard interface for user '${username}'.`, 'SYSTEM');
  };

  return (
    <>
      {/* <ThreeDBackground /> */}
      <div className={`w-screen h-screen font-sans text-neutral-200 ${!currentUser ? 'flex items-center justify-center p-4 perspective-container' : ''}`}>
        {currentUser ? (
          <Dashboard 
            user={currentUser} 
            onLogout={handleLogout} 
            onAddNewUser={handleAddNewUser}
            allUsers={users}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            allJobs={jobs}
            onCreateJob={handleCreateJob}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
            onAssignJobToOperation={handleAssignJobToOperation}
            onAssignTaskToEmployee={handleAssignTaskToEmployee}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onUnassignTask={handleUnassignTask}
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            allEquipment={allEquipment}
            onAddEquipment={handleAddEquipment}
            onUpdateEquipment={handleUpdateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            onCheckOutEquipment={handleCheckOutEquipment}
            onCheckInEquipment={handleCheckInEquipment}
            // Product Archive props
            archivedProducts={archivedProducts}
            archivedEquipment={archivedEquipment}
            onRestoreProduct={handleRestoreProduct}
            onPermanentDeleteProduct={handlePermanentDeleteProduct}
            onRestoreEquipment={handleRestoreEquipment}
            onPermanentDeleteEquipment={handlePermanentDeleteEquipment}
            // Admin Archive props
            archivedUsers={archivedUsers}
            archivedJobs={archivedJobs}
            onRestoreUser={handleRestoreUser}
            onPermanentDeleteUser={handlePermanentDeleteUser}
            onRestoreJob={handleRestoreJob}
            onPermanentDeleteJob={handlePermanentDeleteJob}
            // System Activities
            activityLogs={activityLogs}
            // Attendance
            archivedAttendance={archivedAttendance}
            onArchiveAttendance={handleArchiveAttendance}
            // Pause/Resume
            onTogglePause={handleTogglePause}
            // Employee UI Config
            allEmployeeUIConfigs={allEmployeeUIConfigs}
            onUpdateEmployeeUIConfig={handleUpdateEmployeeUIConfig}
          />
        ) : (
          <LoginPage onLogin={handleLogin} error={error} clearError={() => setError(null)} />
        )}
      </div>
    </>
  );
}