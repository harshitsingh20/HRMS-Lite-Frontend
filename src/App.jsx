import React, { useState } from 'react';
import { EmployeesPage } from './pages/EmployeesPage';
import { AttendancePage } from './pages/AttendancePage';
import './styles/global.css';

function App() {
  const [currentPage, setCurrentPage] = useState('employees');

  return (
    <div>
      <nav>
        <ul>
          <li>
            <a
              href="#"
              className={currentPage === 'employees' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('employees');
              }}
            >
              👥 Employees
            </a>
          </li>
          <li>
            <a
              href="#"
              className={currentPage === 'attendance' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('attendance');
              }}
            >
              📋 Attendance
            </a>
          </li>
        </ul>
      </nav>

      {currentPage === 'employees' && <EmployeesPage />}
      {currentPage === 'attendance' && <AttendancePage />}
    </div>
  );
}

export default App;
