import '../styles/table.css';

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const AttendanceTable = ({ attendanceRecords, isLoading, onDelete, isDeletingId, title = 'Attendance Records' }) => {
  if (isLoading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (attendanceRecords.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <div className="table-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3>No attendance records found</h3>
          <p>Mark attendance to see records here.</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await onDelete(id);
      } catch (error) {
        // Error handled by parent
      }
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>
          {title}
          <span className="record-count"> ({attendanceRecords.length} {attendanceRecords.length === 1 ? 'record' : 'records'})</span>
        </h3>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id} className={`status-${record.status.toLowerCase()}`}>
                <td>
                  <div className="employee-info">
                    <div className="employee-avatar">
                      {getInitials(record.full_name)}
                    </div>
                    <span className="employee-name">{record.full_name}</span>
                  </div>
                </td>
                <td>
                  <span className="emp-id">{record.emp_id}</span>
                </td>
                <td>
                  <span className="date-cell">{formatDate(record.date)}</span>
                </td>
                <td>
                  <span className={`badge badge-${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(record.id)}
                      disabled={isDeletingId === record.id}
                    >
                      {isDeletingId === record.id ? 'Deleting...' : 'Delete'}
                    </button>
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
