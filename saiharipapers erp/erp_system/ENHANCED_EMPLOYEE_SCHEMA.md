# Enhanced Employee Management Schema Plan

## Current Issues & Solutions

### 1. Field Editing Limitations
**Problem**: Many fields are read-only when they should be editable
**Solution**: Make all employee fields editable with proper validation

### 2. Employment vs Contract Type Confusion
**Problem**: Unclear distinction between employment_type and contract_type
**Solution**: 
- **Employment Type**: Permanent, Temporary, Intern, Consultant
- **Contract Type**: Full-time, Part-time, Hourly, Project-based

### 3. Salary Calculation System
**Problem**: Basic salary system without dynamic hourly/monthly support
**Solution**: Comprehensive salary structure with multiple calculation methods

## Enhanced Database Schema

### 1. Employee Details Table Enhancements
```sql
-- Add missing fields to employee_details table
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS employee_code VARCHAR(50) UNIQUE;
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS nationality VARCHAR(100) DEFAULT 'Indian';
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS marital_status VARCHAR(20) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed'));
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10);
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(20);
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS permanent_address TEXT;
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS current_address TEXT;
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS education_qualification VARCHAR(200);
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS experience_years DECIMAL(4,2) DEFAULT 0;
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS certifications TEXT[];

-- Update employment and contract type constraints
ALTER TABLE employee_details DROP CONSTRAINT IF EXISTS employee_details_employment_type_check;
ALTER TABLE employee_details ADD CONSTRAINT employment_type_check 
  CHECK (employment_type IN ('permanent', 'temporary', 'intern', 'consultant', 'contractor'));

ALTER TABLE employee_details DROP CONSTRAINT IF EXISTS employee_details_contract_type_check;
ALTER TABLE employee_details ADD CONSTRAINT contract_type_check 
  CHECK (contract_type IN ('full_time', 'part_time', 'hourly', 'project_based', 'freelance'));
```

### 2. Salary Structure Table (New)
```sql
CREATE TABLE IF NOT EXISTS salary_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Salary Calculation Method
    calculation_method VARCHAR(20) NOT NULL CHECK (calculation_method IN ('monthly', 'hourly', 'daily', 'project')),
    
    -- Basic Salary Components
    basic_salary DECIMAL(12,2) DEFAULT 0,
    hourly_rate DECIMAL(8,2) DEFAULT 0,
    daily_rate DECIMAL(8,2) DEFAULT 0,
    
    -- Allowances
    house_rent_allowance DECIMAL(12,2) DEFAULT 0,
    transport_allowance DECIMAL(12,2) DEFAULT 0,
    medical_allowance DECIMAL(12,2) DEFAULT 0,
    food_allowance DECIMAL(12,2) DEFAULT 0,
    special_allowance DECIMAL(12,2) DEFAULT 0,
    
    -- Overtime Configuration
    overtime_eligible BOOLEAN DEFAULT false,
    overtime_rate_multiplier DECIMAL(3,2) DEFAULT 1.5,
    
    -- Working Hours Configuration
    standard_working_hours_per_day DECIMAL(4,2) DEFAULT 8.0,
    standard_working_days_per_month INTEGER DEFAULT 26,
    
    -- Deduction Configuration
    pf_applicable BOOLEAN DEFAULT true,
    pf_rate DECIMAL(5,4) DEFAULT 0.12, -- 12%
    esi_applicable BOOLEAN DEFAULT true,
    esi_rate DECIMAL(5,4) DEFAULT 0.0325, -- 3.25%
    professional_tax DECIMAL(8,2) DEFAULT 0,
    
    -- Salary Type for Payment
    salary_type VARCHAR(20) DEFAULT 'bank' CHECK (salary_type IN ('bank', 'cash', 'esi')),
    
    -- Effective Dates
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_salary_structures_user_id ON salary_structures(user_id);
CREATE INDEX IF NOT EXISTS idx_salary_structures_active ON salary_structures(user_id, is_active) WHERE is_active = true;
```

### 3. Attendance Configuration Table (New)
```sql
CREATE TABLE IF NOT EXISTS attendance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Shift Configuration
    shift_start_time TIME DEFAULT '09:00:00',
    shift_end_time TIME DEFAULT '18:00:00',
    break_duration_minutes INTEGER DEFAULT 60,
    
    -- Grace Period
    late_grace_period_minutes INTEGER DEFAULT 15,
    early_leave_grace_period_minutes INTEGER DEFAULT 15,
    
    -- Half Day Configuration
    half_day_threshold_hours DECIMAL(4,2) DEFAULT 4.0,
    
    -- Weekly Off Configuration
    weekly_off_days INTEGER[] DEFAULT ARRAY[0, 6], -- Sunday = 0, Saturday = 6
    
    -- Leave Configuration
    casual_leave_per_year INTEGER DEFAULT 12,
    sick_leave_per_year INTEGER DEFAULT 12,
    earned_leave_per_year INTEGER DEFAULT 21,
    
    -- Effective Dates
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Enhanced Payroll Calculation Logic

#### Monthly Salary Calculation:
```
Gross Salary = Basic Salary + All Allowances
Working Days Calculation = Standard Working Days - (Absent Days + Half Days/2)
Daily Rate = Basic Salary / Standard Working Days
Earned Basic = Daily Rate × Working Days
```

#### Hourly Salary Calculation:
```
Gross Salary = (Hourly Rate × Regular Hours) + (Hourly Rate × Overtime Multiplier × Overtime Hours)
Regular Hours = Min(Total Hours, Standard Hours)
Overtime Hours = Max(0, Total Hours - Standard Hours)
```

#### Deductions Calculation:
```
PF Deduction = Basic Salary × PF Rate (if PF applicable)
ESI Deduction = Gross Salary × ESI Rate (if ESI applicable and Gross < 25000)
Professional Tax = Fixed amount based on salary slab
TDS = As per income tax slab (if applicable)
```

## Frontend Implementation Plan

### 1. Dynamic Form Fields
- **Monthly Employees**: Show basic salary, allowances, working days
- **Hourly Employees**: Show hourly rate, overtime configuration, hours tracking
- **Daily Employees**: Show daily rate, working days configuration

### 2. Real-time Calculations
- Auto-calculate gross salary when components change
- Show estimated monthly earnings for hourly employees
- Display deduction breakdowns in real-time

### 3. Validation Rules
- Employee code must be unique and follow company format
- Salary components must be non-negative
- Effective dates must be logical (from < to)
- Working hours must be within reasonable limits

### 4. UX Improvements
- Clear labels and help text for all fields
- Progressive disclosure (show relevant fields based on calculation method)
- Visual salary calculator with breakdown
- Confirmation dialogs for critical changes

## API Endpoints Required

### Employee Management
- `PUT /api/employees/:id/basic-info` - Update basic employee information
- `PUT /api/employees/:id/employment-details` - Update employment details
- `POST /api/employees/:id/salary-structure` - Create new salary structure
- `PUT /api/employees/:id/salary-structure/:structureId` - Update salary structure
- `GET /api/employees/:id/salary-history` - Get salary change history

### Salary Calculations
- `POST /api/salary/calculate` - Calculate salary for given parameters
- `GET /api/salary/breakdown/:userId/:month/:year` - Get detailed salary breakdown
- `POST /api/payroll/generate` - Generate payroll for period

### Validation
- `POST /api/employees/validate-employee-code` - Check employee code uniqueness
- `POST /api/salary/validate-structure` - Validate salary structure data

This enhanced schema provides:
1. Complete field editability with proper validation
2. Clear separation of employment and contract types
3. Flexible salary calculation methods
4. Comprehensive audit trail
5. Production-ready payroll system
