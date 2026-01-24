import { useState } from 'react';
import { EmployeesPage } from './pages/EmployeesPage';
import { AttendancePage } from './pages/AttendancePage';
import './styles/global.css';

function App() {
  const [currentPage, setCurrentPage] = useState('employees');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="app-logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="logo-text">
              HRMS<span>Lite</span>
            </div>
          </div>

          <nav>
            <ul>
              <li>
                <a
                  href="#employees"
                  className={currentPage === 'employees' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('employees');
                  }}
                >
                  <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Employees
                </a>
              </li>
              <li>
                <a
                  href="#attendance"
                  className={currentPage === 'attendance' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('attendance');
                  }}
                >
                  <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M9 16l2 2 4-4" />
                  </svg>
                  Attendance
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {currentPage === 'employees' && <EmployeesPage />}
        {currentPage === 'attendance' && <AttendancePage />}
      </main>
    </div>
  );
}

export default App;
