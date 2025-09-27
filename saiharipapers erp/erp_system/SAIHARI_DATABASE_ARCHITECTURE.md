# Saihari Papers ERP System - Database Architecture Documentation

## Project Overview
- **Project Name**: Saihari Papers ERP System
- **Database**: Supabase (PostgreSQL)
- **Project ID**: jaxsclksrywuxgvcyanl
- **Region**: ap-south-1 (Asia Pacific - Mumbai)
- **Database Version**: PostgreSQL 17.6.1.005
- **Status**: ACTIVE_HEALTHY

## Database Schema Overview

The Saihari Papers ERP system uses a comprehensive database schema designed to manage employee information, departments, positions, attendance, and various HR-related functionalities. The database follows a relational model with proper foreign key relationships and data integrity constraints.

## Core Tables

### 1. Users Table
**Purpose**: Central user management table storing basic user information and authentication details.

**Schema Structure**:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    full_name VARCHAR GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    role VARCHAR CHECK (role IN ('admin', 'manager', 'supervisor', 'employee', 'hr')) NOT NULL,
    phone VARCHAR,
    employee_id VARCHAR UNIQUE,
    status VARCHAR CHECK (status IN ('active', 'inactive', 'terminated')) DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Fields**:
- `id`: Primary key (UUID)
- `email`: Unique email address for authentication
- `first_name`, `last_name`: User's name components
- `full_name`: Computed field combining first and last name
- `role`: User role in the system (admin, manager, supervisor, employee, hr)
- `phone`: Contact number
- `employee_id`: Unique employee identifier
- `status`: Account status (active, inactive, terminated)
- `avatar_url`: Profile picture URL
- `created_at`, `updated_at`: Audit timestamps

### 2. Departments Table
**Purpose**: Organizational structure management for different departments.

**Schema Structure**:
```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Fields**:
- `id`: Primary key (UUID)
- `name`: Department name (unique)
- `description`: Optional department description
- `created_at`, `updated_at`: Audit timestamps

**Common Departments**:
- Production
- Quality Control
- Operations
- Human Resources
- Maintenance
- Sales
- Finance

### 3. Positions Table
**Purpose**: Job position/role definitions within departments.

**Schema Structure**:
```sql
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Fields**:
- `id`: Primary key (UUID)
- `title`: Position title
- `department_id`: Foreign key to departments table
- `description`: Optional position description
- `created_at`, `updated_at`: Audit timestamps

### 4. Employee Details Table
**Purpose**: Extended employee information including employment details, salary, and personal information.

**Schema Structure**:
```sql
CREATE TABLE employee_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id),
    position_id UUID REFERENCES positions(id),
    join_date DATE,
    date_of_birth DATE,
    gender VARCHAR CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    emergency_contact VARCHAR,
    aadhaar VARCHAR(12),
    pan VARCHAR(10),
    
    -- Employment Details
    contract_type VARCHAR CHECK (contract_type IN ('hourly', 'monthly', 'contract')) DEFAULT 'hourly',
    employee_type VARCHAR,
    salary_type VARCHAR CHECK (salary_type IN ('esi', 'cash', 'bank')) DEFAULT 'esi',
    basic_salary DECIMAL(10,2),
    hourly_rate DECIMAL(8,2) DEFAULT 300.00,
    bonus DECIMAL(10,2) DEFAULT 0,
    performance_rating INTEGER CHECK (performance_rating >= 0 AND performance_rating <= 100) DEFAULT 85,
    
    -- Banking Details
    bank_name VARCHAR,
    account_number VARCHAR,
    ifsc VARCHAR(11),
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id)
);
```

**Key Fields**:
- `user_id`: Foreign key to users table (one-to-one relationship)
- `department_id`: Foreign key to departments table
- `position_id`: Foreign key to positions table
- `join_date`: Employee joining date
- `date_of_birth`: Employee's date of birth
- `gender`: Gender information
- `address`: Residential address
- `emergency_contact`: Emergency contact information
- `aadhaar`: Aadhaar number (12 digits)
- `pan`: PAN card number (10 characters)
- `contract_type`: Employment contract type (hourly, monthly, contract)
- `employee_type`: Type of employee
- `salary_type`: Salary payment method (ESI, cash, bank)
- `basic_salary`: Monthly basic salary
- `hourly_rate`: Hourly rate for hourly employees
- `bonus`: Bonus amount
- `performance_rating`: Performance rating (0-100)
- Banking details for salary processing

## Relationships and Foreign Keys

### Primary Relationships:
1. **Users ↔ Employee Details**: One-to-One relationship
   - `employee_details.user_id` → `users.id`

2. **Departments ↔ Employee Details**: One-to-Many relationship
   - `employee_details.department_id` → `departments.id`

3. **Positions ↔ Employee Details**: One-to-Many relationship
   - `employee_details.position_id` → `positions.id`

4. **Departments ↔ Positions**: One-to-Many relationship
   - `positions.department_id` → `departments.id`

### Relationship Diagram:
```
users (1) ←→ (1) employee_details
                     ↓ (many)
departments (1) ←→ (many) positions
     ↓ (1)              ↓ (1)
     └→ employee_details ←┘
```

## Data Access Patterns

### Common Query Patterns:

1. **Get Users with Department Information**:
```sql
SELECT u.*, 
       ed.join_date, ed.contract_type, ed.salary_type, ed.basic_salary, ed.performance_rating,
       d.name as department_name,
       p.title as position_title
FROM users u
LEFT JOIN employee_details ed ON u.id = ed.user_id
LEFT JOIN departments d ON ed.department_id = d.id
LEFT JOIN positions p ON ed.position_id = p.id
WHERE u.status = 'active';
```

2. **Get Employee by ID with Full Details**:
```sql
SELECT u.*, ed.*, d.name as department_name, p.title as position_title
FROM users u
LEFT JOIN employee_details ed ON u.id = ed.user_id
LEFT JOIN departments d ON ed.department_id = d.id
LEFT JOIN positions p ON ed.position_id = p.id
WHERE u.id = $1;
```

## Application Integration

### Supabase Client Configuration:
- **URL**: Environment variable `NEXT_PUBLIC_SUPABASE_URL`
- **Anonymous Key**: Environment variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Client Library**: @supabase/supabase-js

### Key Functions in Application:

1. **getUsersWithDepartments()**: Fetches all active users with their department and position information
2. **getEmployeeById(userId)**: Retrieves complete employee details by user ID
3. **updateEmployeeDetails(userId, updates)**: Updates employee details table
4. **updateUserInfo(userId, updates)**: Updates basic user information
5. **getDepartments()**: Fetches all departments
6. **getDepartmentCount()**: Gets total department count
7. **getUsersByDepartment()**: Groups users by their departments

## Security and Access Control

### Row Level Security (RLS):
- Tables are protected with Supabase RLS policies
- Access control based on user roles and authentication status
- Sensitive data like salary information requires appropriate permissions

### Data Validation:
- Email uniqueness constraints
- Role-based enum constraints
- Status validation (active, inactive, terminated)
- Performance rating range validation (0-100)
- Salary type validation (esi, cash, bank)
- Contract type validation (hourly, monthly, contract)

## Attendance System (Future Enhancement)

### Proposed Attendance Table:
```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR CHECK (status IN ('PRESENT', 'ABSENT', 'LEAVE')) NOT NULL,
    hours_worked DECIMAL(4,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(employee_id, date)
);
```

**Note**: Currently, the attendance system uses localStorage for client-side persistence. The above schema is prepared for future database integration.

## Performance Considerations

### Indexing Strategy:
1. **Primary Keys**: Automatic UUID indexes
2. **Foreign Keys**: Automatic indexes on relationship columns
3. **Email Lookup**: Index on users.email for authentication
4. **Employee ID**: Index on users.employee_id for quick lookups
5. **Status Filtering**: Index on users.status for active employee queries
6. **Department Queries**: Index on employee_details.department_id

### Query Optimization:
- Use of LEFT JOINs for optional relationships
- Selective field retrieval to minimize data transfer
- Proper use of WHERE clauses for filtering
- Batch operations for bulk updates

## Data Migration and Backup

### Migration Strategy:
- Supabase handles automatic migrations
- Version-controlled schema changes
- Rollback capabilities for failed migrations

### Backup Strategy:
- Supabase automatic daily backups
- Point-in-time recovery available
- Export capabilities for data portability

## Monitoring and Analytics

### Key Metrics to Track:
1. **Employee Count**: Total active employees
2. **Department Distribution**: Employee count per department
3. **Performance Metrics**: Average performance ratings
4. **Attendance Rates**: When attendance system is implemented
5. **Salary Analytics**: Salary distribution and trends

### Reporting Capabilities:
- Employee reports by department
- Performance analytics
- Salary and compensation reports
- Attendance reports (future)

## API Endpoints

### Current Implementation:
The application uses direct Supabase client calls rather than custom API endpoints. Key operations include:

1. **GET Operations**: Fetch users, departments, employee details
2. **POST Operations**: Create new employees and departments
3. **PUT Operations**: Update employee information
4. **DELETE Operations**: Soft delete (status change) or hard delete

### Future API Structure:
```
GET    /api/employees          - List all employees
GET    /api/employees/:id      - Get employee details
POST   /api/employees          - Create new employee
PUT    /api/employees/:id      - Update employee
DELETE /api/employees/:id      - Delete employee

GET    /api/departments        - List departments
POST   /api/departments        - Create department
PUT    /api/departments/:id    - Update department

GET    /api/attendance/:id     - Get attendance records
POST   /api/attendance         - Record attendance
```

## Environment Configuration

### Required Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://jaxsclksrywuxgvcyanl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anonymous_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

## Conclusion

The Saihari Papers ERP system database architecture provides a robust foundation for employee management, departmental organization, and HR operations. The schema is designed with scalability, data integrity, and performance in mind, using modern PostgreSQL features through Supabase's managed platform.

The current implementation successfully handles:
- Employee lifecycle management
- Departmental organization
- Role-based access control
- Salary and compensation tracking
- Performance management

Future enhancements can include:
- Attendance tracking integration
- Payroll processing
- Leave management
- Performance review workflows
- Advanced reporting and analytics

---

**Document Version**: 1.0  
**Last Updated**: September 27, 2025  
**Database Version**: PostgreSQL 17.6.1.005  
**Project Status**: Active Development
