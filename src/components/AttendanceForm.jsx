import React, { useState } from 'react';
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
      <h2>Mark Attendance</h2>

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
              {emp.employee_id} - {emp.full_name}
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
        <label htmlFor="status">Status *</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? 'Marking...' : 'Mark Attendance'}
      </button>
    </form>
  );
};
