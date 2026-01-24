import { useState, useEffect } from 'react';
import { EmployeeForm } from '../components/EmployeeForm';
import { EmployeeTable } from '../components/EmployeeTable';
import { employeeService } from '../services/api';
import '../styles/page.css';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setSubmitError(null);
      const response = await employeeService.getAll();
      if (response.success) {
        setEmployees(response.data || []);
      } else {
        setSubmitError(response.message || 'Failed to fetch employees');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch employees';
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (data) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (editingEmployee) {
        const response = await employeeService.update(editingEmployee.id, data);
        if (response.success) {
          setEmployees((prev) =>
            prev.map((emp) => (emp.id === editingEmployee.id ? response.data : emp))
          );
          setEditingEmployee(null);
        } else {
          setSubmitError(response.message || 'Failed to update employee');
        }
      } else {
        const response = await employeeService.create(data);
        if (response.success) {
          setEmployees((prev) => [response.data, ...prev]);
        } else {
          setSubmitError(response.message || 'Failed to create employee');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeletingId(id);

    try {
      const response = await employeeService.delete(id);
      if (response.success) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      } else {
        setSubmitError(response.message || 'Failed to delete employee');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete employee';
      setSubmitError(errorMessage);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Employee Management</h1>
          <p>Add, edit, and manage your organization's employees</p>
        </div>
      </div>

      <div className="page-content">
        <div className="form-section">
          <EmployeeForm
            onSubmit={handleSubmit}
            initialData={editingEmployee || undefined}
            isLoading={isSubmitting}
            error={submitError || undefined}
          />
          {editingEmployee && (
            <div style={{ padding: '0 24px 24px' }}>
              <button
                className="btn-secondary"
                onClick={() => setEditingEmployee(null)}
                style={{ width: '100%' }}
              >
                Cancel Edit
              </button>
            </div>
          )}
        </div>

        <div className="table-section">
          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            onEdit={setEditingEmployee}
            onDelete={handleDelete}
            isDeletingId={isDeletingId || undefined}
          />
        </div>
      </div>
    </div>
  );
};
