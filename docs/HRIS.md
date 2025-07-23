# HRIS (Human Resource Information System)

## Overview

The HRIS module provides comprehensive human resource management capabilities for the clinic system. It includes department management and can be extended with additional HR features.

## Features

### Department Management
- **List View**: Display all departments with pagination, search, and sorting
- **Create**: Add new departments with validation
- **View Details**: Display detailed department information
- **Edit**: Update existing department information
- **Delete**: Remove departments with confirmation

## API Integration

### Base URL
```
http://localhost:3001/hris
```

### Authentication
All HRIS endpoints require Bearer token authentication:
```
Authorization: Bearer <token>
```

### Endpoints

#### Departments

**List Departments (Paginated)**
```
POST /hris/departments/paginated
```

Request Body:
```json
{
  "page": 1,
  "per_page": 10,
  "sort_by": "created_at",
  "sort_order": "desc",
  "search": "optional search term"
}
```

Response:
```json
{
  "response_code": 200,
  "response_message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Department Name",
      "description": "Department Description",
      "code": "DEPT001",
      "created_at": "2025-07-17 11:26:59",
      "updated_at": "2025-07-17 11:27:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 1,
    "from": 1,
    "to": 1
  }
}
```

**Get Department Details**
```
GET /hris/departments/{id}
```

**Create Department**
```
POST /hris/departments
```

Request Body:
```json
{
  "name": "Department Name",
  "code": "DEPT001",
  "description": "Department Description"
}
```

**Update Department**
```
PUT /hris/departments/{id}
```

**Delete Department**
```
DELETE /hris/departments/{id}
```

## Navigation Structure

### Vertical Navigation
```
HRIS
├── Departments
```

### Horizontal Navigation
```
HRIS
├── Departments
```

## Pages

### 1. Departments Index (`/hris/departments`)
- **Purpose**: List all departments with search and filtering
- **Features**:
  - Pagination (10 items per page)
  - Search by name, code, or description
  - Sort by name, code, created_at, updated_at
  - Sort order (ascending/descending)
  - Action buttons (view, edit, delete)
  - Empty state handling
  - Loading states

### 2. Create Department (`/hris/departments/create`)
- **Purpose**: Add new departments
- **Features**:
  - Form validation
  - Required fields (name, code)
  - Optional description field
  - Reset form functionality
  - Error handling
  - Success redirect to list

### 3. Department Details (`/hris/departments/:id`)
- **Purpose**: View department information
- **Features**:
  - Display all department fields
  - Formatted timestamps
  - Edit button navigation
  - Error state handling
  - Loading states

### 4. Edit Department (`/hris/departments/edit/:id`)
- **Purpose**: Update department information
- **Features**:
  - Pre-populated form with existing data
  - Form validation
  - Update API integration
  - Success redirect to details
  - Error handling
  - Reset functionality

## Data Model

### Department
```typescript
interface Department {
  id: number
  name: string
  code: string
  description?: string
  created_at: string
  updated_at: string
}
```

## Error Handling

### API Errors
- Network connectivity issues
- Authentication failures
- Validation errors
- Server errors

### User Feedback
- Loading indicators
- Error messages
- Success notifications
- Confirmation dialogs

## Future Enhancements

### Potential HRIS Features
1. **Employee Management**
   - Employee profiles
   - Employment history
   - Contact information
   - Emergency contacts

2. **Position Management**
   - Job titles
   - Position descriptions
   - Reporting structure

3. **Leave Management**
   - Leave types
   - Leave requests
   - Leave balances
   - Approval workflow

4. **Payroll Integration**
   - Salary information
   - Benefits
   - Deductions
   - Tax information

5. **Performance Management**
   - Performance reviews
   - Goals and objectives
   - Competency assessments

6. **Training & Development**
   - Training programs
   - Certifications
   - Skill assessments
   - Development plans

## Technical Implementation

### File Structure
```
src/
├── pages/
│   └── hris/
│       └── departments/
│           ├── index.vue
│           ├── create.vue
│           ├── [id].vue
│           └── edit/
│               └── [id].vue
├── navigation/
│   ├── vertical/
│   │   └── hris.js
│   └── horizontal/
│       └── hris.js
└── plugins/
    └── 1.router/
        └── additional-routes.js
```

### Key Components
- **VCard**: Main container for all pages
- **VTable**: Data display for list view
- **VForm**: Form handling for create/edit
- **VPagination**: Page navigation
- **VTextField/VTextarea**: Form inputs
- **VBtn**: Action buttons
- **VProgressLinear**: Loading indicators

### State Management
- Reactive data with Vue 3 Composition API
- Form validation
- Error state management
- Loading state management

### API Integration
- Centralized API service
- Error handling
- Response processing
- Authentication integration

## Usage Examples

### Creating a Department
1. Navigate to HRIS > Departments
2. Click "Add Department"
3. Fill in required fields (name, code)
4. Add optional description
5. Click "Create Department"
6. Redirected to departments list

### Editing a Department
1. Navigate to HRIS > Departments
2. Click edit icon on desired department
3. Modify fields as needed
4. Click "Update Department"
5. Redirected to department details

### Searching Departments
1. Navigate to HRIS > Departments
2. Use search field to filter by name, code, or description
3. Results update automatically

### Sorting Departments
1. Navigate to HRIS > Departments
2. Select sort field from dropdown
3. Choose sort order (ascending/descending)
4. Results update automatically

## Security Considerations

### Authentication
- All HRIS endpoints require valid JWT token
- Token expiration handling
- Automatic logout on authentication failure

### Authorization
- Role-based access control (future implementation)
- Permission-based feature access
- Audit logging (future implementation)

### Data Protection
- Input validation
- XSS prevention
- CSRF protection
- Secure API communication

## Performance Considerations

### Optimization
- Lazy loading of components
- Efficient API calls
- Pagination for large datasets
- Debounced search functionality

### Caching
- API response caching (future implementation)
- Component state caching
- Navigation state preservation

## Testing Strategy

### Unit Tests
- Component functionality
- Form validation
- API integration
- Error handling

### Integration Tests
- End-to-end workflows
- API communication
- Navigation flows

### User Acceptance Tests
- Feature completeness
- User experience
- Performance validation

## Deployment

### Environment Configuration
- API base URL configuration
- Authentication token management
- Error reporting setup

### Build Process
- Vue.js compilation
- Asset optimization
- Environment-specific builds

### Monitoring
- Error tracking
- Performance monitoring
- Usage analytics 
