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
          name
        ),
        positions:position_id (
          id,
          title
        )
      )
    `)
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching employee:', error)
    return null
  }
  
  return data
}

// Update employee details
export const updateEmployeeDetails = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('employee_details')
    .update(updates)
    .eq('user_id', userId)
    .select()
  
  if (error) {
    console.error('Error updating employee details:', error)
    throw error
  }
  
  return data
}

// Update user basic info
export const updateUserInfo = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
  
  if (error) {
    console.error('Error updating user info:', error)
    throw error
  }
  
  return data
}