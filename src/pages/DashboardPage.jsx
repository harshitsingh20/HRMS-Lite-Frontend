import { useState, useEffect } from 'react';
import { employeeService, attendanceService } from '../services/api';
import '../styles/page.css';
import '../styles/dashboard.css';

export const DashboardPage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [empResponse, attResponse] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getAll(),
      ]);

      if (empResponse.success) {
        setEmployees(empResponse.data || []);
      }
      if (attResponse.success) {
        setAttendance(attResponse.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const totalEmployees = employees.length;
  const totalPresent = attendance.filter(a => a.status === 'Present').length;
  const totalAbsent = attendance.filter(a => a.status === 'Absent').length;
  const attendanceRate = attendance.length > 0
    ? Math.round((totalPresent / attendance.length) * 100)
    : 0;

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const todayPresent = todayAttendance.filter(a => a.status === 'Present').length;
  const todayAbsent = todayAttendance.filter(a => a.status === 'Absent').length;

  // Calculate attendance per employee
  const employeeAttendance = employees.map(emp => {
    const empRecords = attendance.filter(a => a.emp_id === emp.employee_id);
    const presentDays = empRecords.filter(a => a.status === 'Present').length;
    const absentDays = empRecords.filter(a => a.status === 'Absent').length;
    const totalDays = empRecords.length;
    const rate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    return {
      ...emp,
      presentDays,
      absentDays,
      totalDays,
      attendanceRate: rate,
    };
  }).sort((a, b) => b.presentDays - a.presentDays);

  // Department breakdown
  const departmentStats = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { count: 0, present: 0, absent: 0 };
    }
    acc[emp.department].count++;

    const empRecords = attendance.filter(a => a.emp_id === emp.employee_id);
    acc[emp.department].present += empRecords.filter(a => a.status === 'Present').length;
    acc[emp.department].absent += empRecords.filter(a => a.status === 'Absent').length;

    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-header-content">
            <h1>Dashboard</h1>
            <p>Overview of your HR metrics</p>
          </div>
        </div>
        <div className="page-content dashboard-content">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Dashboard</h1>
          <p>Overview of your HR metrics and attendance summary</p>
        </div>
      </div>

      <div className="page-content dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {/* Summary Cards */}
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon employees">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="card-content">
              <span className="card-value">{totalEmployees}</span>
              <span className="card-label">Total Employees</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon present">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="card-content">
              <span className="card-value">{totalPresent}</span>
              <span className="card-label">Total Present Records</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon absent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <div className="card-content">
              <span className="card-value">{totalAbsent}</span>
              <span className="card-label">Total Absent Records</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon rate">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="card-content">
              <span className="card-value">{attendanceRate}%</span>
              <span className="card-label">Overall Attendance Rate</span>
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="dashboard-section">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Today's Attendance ({new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })})
          </h3>
          <div className="today-stats">
            <div className="today-stat">
              <span className="stat-number present">{todayPresent}</span>
              <span className="stat-text">Present</span>
            </div>
            <div className="today-stat">
              <span className="stat-number absent">{todayAbsent}</span>
              <span className="stat-text">Absent</span>
            </div>
            <div className="today-stat">
              <span className="stat-number">{totalEmployees - todayPresent - todayAbsent}</span>
              <span className="stat-text">Not Marked</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Employee Attendance Summary */}
          <div className="dashboard-section">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Employee Attendance Summary
            </h3>
            <div className="employee-summary-table">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeAttendance.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-row">No employee data available</td>
                    </tr>
                  ) : (
                    employeeAttendance.map(emp => (
                      <tr key={emp.id}>
                        <td>
                          <div className="emp-cell">
                            <span className="emp-name">{emp.full_name}</span>
                            <span className="emp-id">{emp.employee_id}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge-mini present">{emp.presentDays}</span>
                        </td>
                        <td>
                          <span className="badge-mini absent">{emp.absentDays}</span>
                        </td>
                        <td>
                          <div className="rate-bar">
                            <div
                              className="rate-fill"
                              style={{ width: `${emp.attendanceRate}%` }}
                            ></div>
                            <span className="rate-text">{emp.attendanceRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="dashboard-section">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Department Breakdown
            </h3>
            <div className="department-list">
              {Object.keys(departmentStats).length === 0 ? (
                <div className="empty-state-small">No department data</div>
              ) : (
                Object.entries(departmentStats).map(([dept, stats]) => (
                  <div key={dept} className="department-item">
                    <div className="dept-info">
                      <span className="dept-name">{dept}</span>
                      <span className="dept-count">{stats.count} employees</span>
                    </div>
                    <div className="dept-stats">
                      <span className="dept-stat present">{stats.present} P</span>
                      <span className="dept-stat absent">{stats.absent} A</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
