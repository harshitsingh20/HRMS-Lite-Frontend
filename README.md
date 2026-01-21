# HRMS Lite - JavaScript React Frontend

A modern, responsive web application for Human Resource Management built with React 18, Vite, and Axios.

## Features

- ✅ **Employee Management** - Add, view, edit, and delete employee records
- ✅ **Attendance Tracking** - Mark and view employee attendance
- ✅ **Form Validation** - Client-side validation with meaningful error messages
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Real-time Updates** - Instant UI updates without page refresh
- ✅ **Error Handling** - User-friendly error notifications
- ✅ **Loading States** - Visual feedback during API calls
- ✅ **Modern UI** - Professional design with CSS custom properties

## Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **HTTP Client**: Axios 1.6.2
- **Styling**: Plain CSS with CSS Variables
- **JavaScript**: ES6+ (no TypeScript)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── EmployeeForm.jsx       # Employee form component
│   │   ├── EmployeeTable.jsx      # Employee table component
│   │   ├── AttendanceForm.jsx     # Attendance form component
│   │   └── AttendanceTable.jsx    # Attendance table component
│   ├── pages/
│   │   ├── EmployeesPage.jsx      # Employees management page
│   │   └── AttendancePage.jsx     # Attendance management page
│   ├── services/
│   │   └── api.js                 # API client and service functions
│   ├── styles/
│   │   ├── global.css             # Global styles and theme
│   │   ├── form.css               # Form component styles
│   │   ├── table.css              # Table component styles
│   │   └── page.css               # Page layout styles
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # React entry point
│   └── vite.svg
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── .gitignore
└── README.md
```

## Installation

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

## Running the Application

### Development Server
```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

Output files will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Configuration

### API Base URL

The frontend is configured to proxy API requests to `http://localhost:3001` (backend server).

Update the proxy configuration in `vite.config.js` if your backend is running on a different port:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:YOUR_PORT',
    changeOrigin: true,
  },
},
```

## Component Documentation

### EmployeeForm Component
Form for creating and editing employees.

**Props:**
- `onSubmit(data)`: Function called when form is submitted
- `initialData`: Optional object with employee data for editing
- `isLoading`: Boolean indicating if submission is in progress
- `error`: Optional error message to display

**Features:**
- Real-time form validation
- Email format validation
- Disabled employee_id when editing
- Department dropdown with predefined options

### EmployeeTable Component
Displays list of employees in a table with edit/delete actions.

**Props:**
- `employees`: Array of employee objects
- `isLoading`: Boolean indicating if data is loading
- `onEdit(employee)`: Function called when edit button clicked
- `onDelete(id)`: Function called when delete button clicked
- `isDeletingId`: ID of employee being deleted

**Features:**
- Responsive table layout
- Confirmation before delete
- Loading skeleton on data fetch

### AttendanceForm Component
Form for marking employee attendance.

**Props:**
- `employees`: Array of employee objects
- `onSubmit(data)`: Function called when form is submitted
- `isLoading`: Boolean indicating if submission is in progress
- `error`: Optional error message to display

**Features:**
- Employee selection dropdown
- Date picker (defaults to today)
- Status selection (Present/Absent)

### AttendanceTable Component
Displays attendance records in a table.

**Props:**
- `attendanceRecords`: Array of attendance records
- `isLoading`: Boolean indicating if data is loading
- `onDelete(id)`: Function called when delete button clicked
- `isDeletingId`: ID of record being deleted
- `title`: Optional custom title

**Features:**
- Status badges with color coding
- Color-coded row borders
- Formatted date display

## Services

### API Service (`services/api.js`)

Axios-based API client with pre-configured endpoints.

#### Employee Service

```javascript
import { employeeService } from './services/api';

// Create employee
await employeeService.create(data);

// Get all employees
await employeeService.getAll();

// Get employee by ID
await employeeService.getById(id);

// Update employee
await employeeService.update(id, data);

// Delete employee
await employeeService.delete(id);
```

#### Attendance Service

```javascript
import { attendanceService } from './services/api';

// Mark attendance
await attendanceService.mark(data);

// Get all attendance records
await attendanceService.getAll(date);

// Get attendance by employee
await attendanceService.getByEmployee(employeeId, month);

// Delete attendance record
await attendanceService.delete(id);
```

## Styling

The application uses CSS with CSS custom properties (variables) for theming.

### Available CSS Variables

```css
--primary-color: #2563eb
--primary-dark: #1d4ed8
--secondary-color: #6b7280
--success-color: #10b981
--danger-color: #ef4444
--warning-color: #f59e0b
--background-color: #f9fafb
--surface-color: #ffffff
--border-color: #e5e7eb
--text-primary: #1f2937
--text-secondary: #6b7280
```

### Customizing Theme

Edit `src/styles/global.css` to modify colors and spacing.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

The application uses:
- Code splitting with Vite
- Lazy loading of pages (can be enhanced with React.lazy)
- Efficient re-renders with React hooks
- Optimized CSS with custom properties

## Responsive Design

The application is fully responsive with breakpoints at:
- Desktop: 1024px and above
- Tablet: 768px - 1023px
- Mobile: Below 768px

## Error Handling

The application handles errors gracefully:
- Network errors display user-friendly messages
- Form validation errors show inline feedback
- API errors are caught and displayed

## Build Optimization

The production build includes:
- Tree-shaking to remove unused code
- CSS minification
- JavaScript minification
- Asset compression

## Development Tips

### Adding New Pages
1. Create component in `src/pages/`
2. Add import to `App.jsx`
3. Add navigation link in the nav element

### Adding New Components
1. Create component file in `src/components/`
2. Use destructuring for props
3. Add corresponding styles in `src/styles/`

### Adding New API Endpoints
1. Add method in `src/services/api.js`
2. Use existing error handling pattern
3. Return standardized response format

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist/` folder to your web server
3. Configure server to serve `index.html` for all routes

### Environment Variables for Deployment

Create a `.env.production` file:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- --port 3001
```

### CORS errors
- Ensure backend has CORS middleware enabled
- Check API base URL in `vite.config.js`
- Verify backend is running and accessible

### Module not found errors
- Run `npm install` to ensure all dependencies are installed
- Clear `node_modules` and `npm install` again

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
