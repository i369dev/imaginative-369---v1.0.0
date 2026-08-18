import { User, ActivityLog, AttendanceRecord } from './types';

// --- HELPER FUNCTIONS ---

export const getWeekRange = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(d.setDate(diffToMonday));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { start: startOfWeek, end: endOfWeek };
};

export const getBillingCycle = (date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    let start, end;
    if (d.getDate() >= 25) {
        start = new Date(year, month, 25);
        end = new Date(year, month + 1, 24);
    } else {
        start = new Date(year, month - 1, 25);
        end = new Date(year, month, 24);
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

export const formatDuration = (totalSeconds: number): string => {
    if (totalSeconds < 1) return "0h 0m";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

export const formatDurationWithSeconds = (totalSeconds: number): string => {
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const countWorkdays = (start: Date, end: Date): number => {
    let count = 0;
    const curDate = new Date(start.getTime());
    const finalDate = new Date(end.getTime());
    while (curDate <= finalDate) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
            count++;
        }
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
};

// --- DATA CALCULATION LOGIC ---

export const calculateAttendanceData = (
    users: User[],
    activityLogs: ActivityLog[],
    period: { start: Date; end: Date },
    isRealtime: boolean,
    now: Date
): AttendanceRecord[] => {
    const userStats: { [key: string]: any } = {};
    users.forEach(user => {
        if (user.role !== 'Admin') {
            userStats[user.username] = { sessions: [], lastSeen: null, loginCount: 0, logoutCount: 0 };
        }
    });

    const sortedLogs = [...activityLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    sortedLogs.forEach(log => {
        if (userStats[log.user] && ['USER_LOGIN', 'USER_LOGOUT', 'USER_PAUSE', 'USER_RESUME'].includes(log.action)) {
            const logTime = new Date(log.timestamp);
            if (log.action === 'USER_LOGIN' || log.action === 'USER_RESUME') {
                const lastSession = userStats[log.user].sessions[userStats[log.user].sessions.length - 1];
                if (!lastSession || lastSession.end) {
                    userStats[log.user].sessions.push({ start: logTime, end: null });
                    if (log.action === 'USER_LOGIN') userStats[log.user].loginCount++;
                }
            } else if (log.action === 'USER_LOGOUT' || log.action === 'USER_PAUSE') {
                const lastOpenSession = userStats[log.user].sessions.find((s: any) => s.end === null);
                if (lastOpenSession) {
                    lastOpenSession.end = logTime;
                    if (log.action === 'USER_LOGOUT') userStats[log.user].logoutCount++;
                }
            }
        }
    });
    
    const effectiveEndDate = isRealtime ? now : period.end;

    const todayStart = new Date(effectiveEndDate); todayStart.setHours(0, 0, 0, 0);
    const { start: weekStart } = getWeekRange(effectiveEndDate);
    const { start: billingCycleStart } = getBillingCycle(effectiveEndDate);

    const workdaysSoFar = countWorkdays(billingCycleStart, effectiveEndDate);
    const standardWorkSecondsSoFar = workdaysSoFar * 8 * 3600;
    
    const calculateOverlap = (pStart: Date, pEnd: Date, sStart: Date, sEnd: Date) => Math.max(0, (Math.min(pEnd.getTime(), sEnd.getTime()) - Math.max(pStart.getTime(), sStart.getTime())) / 1000);

    return users.filter(u => u.role !== 'Admin').map(user => {
        const stat = userStats[user.username];
        let daily = 0, weekly = 0, billingCycle = 0, total = 0, lastActivity: Date | null = null;
        
        stat.sessions.forEach((session: any) => {
            const end = session.end || effectiveEndDate;
            const start = session.start;
            daily += calculateOverlap(todayStart, effectiveEndDate, start, end);
            weekly += calculateOverlap(weekStart, effectiveEndDate, start, end);
            billingCycle += calculateOverlap(billingCycleStart, effectiveEndDate, start, end);
            total += calculateOverlap(period.start, period.end, start, end);
            if (!lastActivity || end > lastActivity) lastActivity = end;
        });
        
        const userLogs = sortedLogs.filter(log => log.user === user.username && ['USER_LOGIN', 'USER_LOGOUT', 'USER_PAUSE', 'USER_RESUME'].includes(log.action));
        const lastLog = userLogs[userLogs.length - 1];
        
        let status: 'Logged In' | 'Logged Out' | 'Paused' = 'Logged Out';
        if (lastLog) {
             if (lastLog.action === 'USER_LOGIN' || lastLog.action === 'USER_RESUME') {
                status = 'Logged In';
            } else if (lastLog.action === 'USER_PAUSE') {
                status = 'Paused';
            }
        }
       
        const overtime = Math.max(0, billingCycle - standardWorkSecondsSoFar);

        return {
            userId: user.username,
            fullName: user.fullName || user.username,
            username: user.username,
            profilePicPreview: user.profilePicPreview,
            status,
            lastSeen: lastActivity ? lastActivity.toISOString() : null,
            dailyDuration: daily,
            weeklyDuration: weekly,
            billingCycleDuration: billingCycle,
            totalDuration: total,
            loginCount: stat.loginCount,
            logoutCount: stat.logoutCount,
            overtimeDuration: overtime,
        };
    });
};
