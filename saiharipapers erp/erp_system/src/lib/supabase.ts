import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better TypeScript support
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'manager' | 'supervisor' | 'employee' | 'hr'
  phone?: string
  employee_id?: string
  status: 'active' | 'inactive' | 'terminated'
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Position {
  id: string
  title: string
  department_id: string
  description?: string
  created_at: string
  updated_at: string
}

// Helper functions for common database operations
export const getUsersWithDepartments = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      employee_details!employee_details_user_id_fkey (
        join_date,
        contract_type,
        salary_type,
        base_salary,
        performance_rating,
        department_id,
        position_id,
        departments:department_id (
          name
        ),
        positions:position_id (
          title
        )
      )
    `)
    .eq('status', 'active')
  
  if (error) {
    console.error('Error fetching users:', error)
    return []
  }
  
  return data || []
}

export const getDepartments = async () => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching departments:', error)
    return []
  }
  
  return data || []
}

export const getDepartmentCount = async () => {
  const { count, error } = await supabase
    .from('departments')
    .select('*', { count: 'exact', head: true })
  
  if (error) {
    console.error('Error counting departments:', error)
    return 0
  }
  
  return count || 0
}

export const getUsersByDepartment = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      first_name,
      last_name,
      role,
      employee_details (
        join_date,
        contract_type,
        salary_type,
        base_salary,
        performance_rating,
        department_id,
        position_id,
        departments:department_id (
          name
        ),
        positions:position_id (
          title
        )
      )
    `)
    .eq('status', 'active')
  
  if (error) {
    console.error('Error fetching users by department:', error)
    return []
  }
  
  return data || []
}

// Get single employee with full details
export const getEmployeeById = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      employee_details!employee_details_user_id_fkey (
        *,
        departments:department_id (
          id,
          name,
          description
        ),
        positions:position_id (
          id,
          title,
          description
        )
      )
    `)
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching employee:', error)
    throw new Error(`Failed to fetch employee: ${error.message}`)
  }
  
  return data
}

// Enhanced function to get employee with computed fields
export const getEmployeeWithComputedFields = async (userId: string) => {
  const employee = await getEmployeeById(userId)
  
  if (!employee) return null
  
  // Compute additional fields
  const employeeDetails = employee.employee_details?.[0]
  const joinDate = employeeDetails?.join_date
  const daysWorked = joinDate ? Math.floor((new Date().getTime() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
  
  return {
    ...employee,
    computed: {
      daysWorked,
      fullName: employee.full_name || `${employee.first_name} ${employee.last_name}`,
      departmentName: employeeDetails?.departments?.name || 'Unassigned',
      positionTitle: employeeDetails?.positions?.title || 'Unassigned',
      monthsWorked: Math.floor(daysWorked / 30),
      yearsWorked: Math.floor(daysWorked / 365)
    }
  }
}

// Update employee details with validation
export const updateEmployeeDetails = async (userId: string, updates: any) => {
  // Validate required fields
  const validatedUpdates = {
    ...updates,
    updated_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('employee_details')
    .update(validatedUpdates)
    .eq('user_id', userId)
    .select(`
      *,
      departments:department_id (
        id,
        name
      ),
      positions:position_id (
        id,
        title
      )
    `)
  
  if (error) {
    console.error('Error updating employee details:', error)
    throw new Error(`Failed to update employee details: ${error.message}`)
  }
  
  return data
}

// Update user basic info with validation
export const updateUserInfo = async (userId: string, updates: any) => {
  // Validate and sanitize updates
  const validatedUpdates = {
    ...updates,
    updated_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('users')
    .update(validatedUpdates)
    .eq('id', userId)
    .select()
  
  if (error) {
    console.error('Error updating user info:', error)
    throw new Error(`Failed to update user info: ${error.message}`)
  }
  
  return data
}

// Salary calculation utilities
export const calculateSalaryBreakdown = (basicSalary: number, hourlyRate: number, hoursWorked: number, salaryType: 'esi' | 'cash' | 'bank') => {
  const grossSalary = basicSalary || (hourlyRate * hoursWorked)
  const esiRate = 0.0325 // 3.25% ESI rate
  const pfRate = 0.12 // 12% PF rate
  const tdsRate = 0.10 // 10% TDS rate (if applicable)
  
  let deductions = 0
  let esiAmount = 0
  let pfAmount = 0
  let tdsAmount = 0
  
  if (salaryType === 'esi') {
    esiAmount = grossSalary * esiRate
    pfAmount = grossSalary * pfRate
    deductions = esiAmount + pfAmount
  } else if (salaryType === 'cash') {
    tdsAmount = grossSalary * tdsRate
    deductions = tdsAmount
  }
  
  const netSalary = grossSalary - deductions
  
  return {
    grossSalary,
    basicSalary,
    hourlyRate,
    hoursWorked,
    esiAmount,
    pfAmount,
    tdsAmount,
    totalDeductions: deductions,
    netSalary,
    salaryType
  }
}

// Enhanced salary calculation utilities
export const calculateAdvancedSalaryBreakdown = (salaryStructure: any, workingDays?: number, hoursWorked?: number, overtimeHours?: number) => {
  if (!salaryStructure) return null
  
  const {
    calculation_method,
    basic_salary,
    hourly_rate,
    daily_rate,
    house_rent_allowance = 0,
    transport_allowance = 0,
    medical_allowance = 0,
    food_allowance = 0,
    special_allowance = 0,
    overtime_eligible = false,
    overtime_rate_multiplier = 1.5,
    standard_working_hours_per_day = 8,
    standard_working_days_per_month = 26,
    pf_applicable = true,
    pf_rate = 0.12,
    esi_applicable = true,
    esi_rate = 0.0325,
    professional_tax = 0
  } = salaryStructure
  
  let grossSalary = 0
  let overtimeAmount = 0
  
  // Calculate gross salary based on method
  switch (calculation_method) {
    case 'monthly':
      const effectiveWorkingDays = workingDays || standard_working_days_per_month
      const dailyBasic = basic_salary / standard_working_days_per_month
      grossSalary = (dailyBasic * effectiveWorkingDays) + house_rent_allowance + transport_allowance + medical_allowance + food_allowance + special_allowance
      break
      
    case 'hourly':
      const regularHours = Math.min(hoursWorked || 0, standard_working_hours_per_day * (workingDays || standard_working_days_per_month))
      const overtime = overtimeHours || Math.max(0, (hoursWorked || 0) - regularHours)
      
      grossSalary = (hourly_rate * regularHours) + house_rent_allowance + transport_allowance + medical_allowance + food_allowance + special_allowance
      
      if (overtime_eligible && overtime > 0) {
        overtimeAmount = hourly_rate * overtime_rate_multiplier * overtime
        grossSalary += overtimeAmount
      }
      break
      
    case 'daily':
      const effectiveDays = workingDays || standard_working_days_per_month
      grossSalary = (daily_rate * effectiveDays) + house_rent_allowance + transport_allowance + medical_allowance + food_allowance + special_allowance
      break
      
    default:
      grossSalary = basic_salary + house_rent_allowance + transport_allowance + medical_allowance + food_allowance + special_allowance
  }
  
  // Calculate deductions
  let pfAmount = 0
  let esiAmount = 0
  let tdsAmount = 0
  
  if (pf_applicable) {
    pfAmount = basic_salary * pf_rate
  }
  
  if (esi_applicable && grossSalary <= 25000) { // ESI applicable only if gross <= 25000
    esiAmount = grossSalary * esi_rate
  }
  
  // TDS calculation (simplified - in reality this would be based on tax slabs)
  if (grossSalary > 50000) {
    tdsAmount = grossSalary * 0.10 // 10% TDS for high earners
  }
  
  const totalDeductions = pfAmount + esiAmount + tdsAmount + professional_tax
  const netSalary = grossSalary - totalDeductions
  
  return {
    calculation_method,
    basic_salary,
    hourly_rate,
    daily_rate,
    grossSalary,
    overtimeAmount,
    allowances: {
      house_rent_allowance,
      transport_allowance,
      medical_allowance,
      food_allowance,
      special_allowance,
      total: house_rent_allowance + transport_allowance + medical_allowance + food_allowance + special_allowance
    },
    deductions: {
      pfAmount,
      esiAmount,
      tdsAmount,
      professional_tax,
      total: totalDeductions
    },
    netSalary,
    workingDays: workingDays || standard_working_days_per_month,
    hoursWorked: hoursWorked || 0,
    overtimeHours: overtimeHours || 0
  }
}

// Salary Structure Management
export const createSalaryStructure = async (userId: string, salaryData: any) => {
  // Deactivate existing salary structures
  await supabase
    .from('salary_structures')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_active', true)
  
  // Create new salary structure
  const { data, error } = await supabase
    .from('salary_structures')
    .insert({
      user_id: userId,
      ...salaryData,
      is_active: true
    })
    .select()
  
  if (error) {
    console.error('Error creating salary structure:', error)
    throw new Error(`Failed to create salary structure: ${error.message}`)
  }
  
  return data
}

export const getSalaryStructure = async (userId: string) => {
  const { data, error } = await supabase
    .from('salary_structures')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error fetching salary structure:', error)
    throw new Error(`Failed to fetch salary structure: ${error.message}`)
  }
  
  return data
}

// Validation functions
export const validateEmployeeCode = async (employeeCode: string, excludeUserId?: string) => {
  let query = supabase
    .from('employee_details')
    .select('user_id')
    .eq('employee_code', employeeCode)
  
  if (excludeUserId) {
    query = query.neq('user_id', excludeUserId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error validating employee code:', error)
    return { isValid: false, error: error.message }
  }
  
  return { isValid: data.length === 0, exists: data.length > 0 }
}