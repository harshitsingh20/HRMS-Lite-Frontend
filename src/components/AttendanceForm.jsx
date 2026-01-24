import { useState } from 'react';
import '../styles/form.css';

export const AttendanceForm = ({ employees, onSubmit, isLoading, error }) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    employee_id: '',
    date: today,
    status: 'Present',
  });

  const [validationErrors, setValidationErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    const errors = [];
    if (!formData.employee_id?.trim()) errors.push('Employee is required');
    if (!formData.date) errors.push('Date is required');
    if (!formData.status) errors.push('Status is required');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ employee_id: '', date: today, status: 'Present' });
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M9 16l2 2 4-4" />
        </svg>
        Mark Attendance
      </h2>

      {error && <div className="error-message">{error}</div>}

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          {validationErrors.map((err, i) => (
            <p key={i}>• {err}</p>
          ))}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="employee_id">Employee *</label>
        <select
          id="employee_id"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name} ({emp.employee_id})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date *</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Status *</label>
        <div className="status-toggle">
          <button
            type="button"
            className={`status-btn ${formData.status === 'Present' ? 'present' : ''}`}
            onClick={() => handleStatusChange('Present')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Present
          </button>
          <button
            type="button"
            className={`status-btn ${formData.status === 'Absent' ? 'absent' : ''}`}
            onClick={() => handleStatusChange('Absent')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Absent
          </button>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? 'Marking...' : 'Mark Attendance'}
      </button>
    </form>
  );
};
