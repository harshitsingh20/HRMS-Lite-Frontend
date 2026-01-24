import { useState, useEffect } from 'react';
import '../styles/form.css';

export const EmployeeForm = ({ onSubmit, initialData, isLoading, error }) => {
  const [formData, setFormData] = useState({
    employee_id: initialData?.employee_id || '',
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    department: initialData?.department || '',
  });

  const [validationErrors, setValidationErrors] = useState([]);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id || '',
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        department: initialData.department || '',
      });
    } else {
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    const errors = [];
    if (!formData.employee_id?.trim()) errors.push('Employee ID is required');
    if (!formData.full_name?.trim()) errors.push('Full Name is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push('Valid email required');
    if (!formData.department?.trim()) errors.push('Department is required');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {initialData?.id ? (
            <>
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </>
          ) : (
            <>
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </>
          )}
        </svg>
        {initialData?.id ? 'Edit Employee' : 'Add New Employee'}
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
        <label htmlFor="employee_id">Employee ID *</label>
        <input
          type="text"
          id="employee_id"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          disabled={initialData && initialData.id}
          placeholder="e.g., EMP001"
        />
      </div>

      <div className="form-group">
        <label htmlFor="full_name">Full Name *</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="John Doe"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="department">Department *</label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? 'Saving...' : initialData?.id ? 'Update Employee' : 'Add Employee'}
      </button>
    </form>
  );
};
