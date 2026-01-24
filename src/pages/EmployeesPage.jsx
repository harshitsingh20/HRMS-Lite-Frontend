import { useState, useEffect } from 'react';
import { EmployeeForm } from '../components/EmployeeForm';
import { EmployeeTable } from '../components/EmployeeTable';
import { employeeService } from '../services/api';
import { useToast } from '../context/ToastContext';
import '../styles/page.css';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const toast = useToast();

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setSubmitError(null);
      const response = await employeeService.getAll();
      if (response.success) {
        const data = response.data || [];
        setEmployees(data);
        applyFilters(data, searchQuery, departmentFilter);
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

  const applyFilters = (data, search, department) => {
    let filtered = data;

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.full_name.toLowerCase().includes(query) ||
        emp.employee_id.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
      );
    }

    // Department filter
    if (department !== 'all') {
      filtered = filtered.filter(emp => emp.department === department);
    }

    setFilteredEmployees(filtered);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(employees, query, departmentFilter);
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setDepartmentFilter(dept);
    applyFilters(employees, searchQuery, dept);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('all');
    setFilteredEmployees(employees);
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
          const updatedEmployees = employees.map((emp) =>
            emp.id === editingEmployee.id ? response.data : emp
          );
          setEmployees(updatedEmployees);
          applyFilters(updatedEmployees, searchQuery, departmentFilter);
          setEditingEmployee(null);
          toast.success(`Employee "${data.full_name}" updated successfully!`);
        } else {
          const errorMsg = response.message || 'Failed to update employee';
          setSubmitError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        const response = await employeeService.create(data);
        if (response.success) {
          const updatedEmployees = [response.data, ...employees];
          setEmployees(updatedEmployees);
          applyFilters(updatedEmployees, searchQuery, departmentFilter);
          toast.success(`Employee "${data.full_name}" added successfully!`);
        } else {
          const errorMsg = response.message || 'Failed to create employee';
          setSubmitError(errorMsg);
          toast.error(errorMsg);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeletingId(id);
    const employeeToDelete = employees.find(emp => emp.id === id);

    try {
      const response = await employeeService.delete(id);
      if (response.success) {
        const updatedEmployees = employees.filter((emp) => emp.id !== id);
        setEmployees(updatedEmployees);
        applyFilters(updatedEmployees, searchQuery, departmentFilter);
        toast.success(`Employee "${employeeToDelete?.full_name || 'Employee'}" deleted successfully!`);
      } else {
        const errorMsg = response.message || 'Failed to delete employee';
        setSubmitError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete employee';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeletingId(null);
    }
  };

  // Get unique departments for filter
  const departments = [...new Set(employees.map(emp => emp.department))].filter(Boolean).sort();

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
          <div className="filter-section">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, ID, email..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="dept-filter">Department:</label>
              <select
                id="dept-filter"
                value={departmentFilter}
                onChange={handleDepartmentChange}
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {(searchQuery || departmentFilter !== 'all') && (
              <button className="btn-outline btn-small" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>

          <EmployeeTable
            employees={filteredEmployees}
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
