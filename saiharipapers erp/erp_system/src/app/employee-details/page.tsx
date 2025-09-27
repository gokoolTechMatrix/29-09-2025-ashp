"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Download, 
  Package, 
  Scissors, 
  FoldHorizontal,
  BarChart3, 
  Users, 
  Factory,
  DollarSign,
  ShoppingCart,
  FileText,
  Menu,
  X,
  Bell,
  ArrowLeft,
  Edit,
  Save,
  User,
  Calendar as CalendarIcon,
  CreditCard,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Plus,
  Minus,
  Calculator,
  Receipt,
  Wallet,
  PiggyBank,
  Coffee
} from "lucide-react";
import { getEmployeeById, getEmployeeWithComputedFields, updateEmployeeDetails, updateUserInfo, getDepartments, calculateSalaryBreakdown, calculateAdvancedSalaryBreakdown, createSalaryStructure, getSalaryStructure, validateEmployeeCode } from "@/lib/supabase";

export default function EmployeeDetailsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"P" | "A" | "L" | "">("P");
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, "P" | "A" | "L">>({});
  
  // Employee data state
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salaryBreakdown, setSalaryBreakdown] = useState<any>(null);
  const [salaryStructure, setSalaryStructure] = useState<any>(null);
  const [calculationMethod, setCalculationMethod] = useState<'monthly' | 'hourly'>('monthly');
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    // Basic Info
    full_name: '',
    phone: '',
    email: '',
    employee_code: '',
    
    // Personal Details
    gender: '',
    date_of_birth: '',
    nationality: 'Indian',
    marital_status: '',
    blood_group: '',
    alternate_phone: '',
    
    // Address
    current_address: '',
    permanent_address: '',
    
    // Employment Details
    department_id: '',
    position_id: '',
    employment_type: '',
    contract_type: '',
    join_date: '',
    
    // Education & Experience
    education_qualification: '',
    experience_years: 0,
    skills: [] as string[],
    certifications: [] as string[],
    
    // Banking & Documents
    bank_name: '',
    bank_account_number: '',
    ifsc_code: '',
    pan_number: '',
    aadhar_number: '',
    
    // Emergency Contact
    emergency_contact_name: '',
    emergency_contact_phone: '',
    
    // Legacy fields for backward compatibility
    basic_salary: 0,
    hourly_rate: 0,
    salary_type: '',
    bonus: 0
  });
  
  // Comprehensive salary calculation state
  const [hourlyRate, setHourlyRate] = useState<number>(300);
  const [contractType, setContractType] = useState<string>("hourly");
  const [grossSalary, setGrossSalary] = useState<number>(0);
  const [esiTdsAmount, setEsiTdsAmount] = useState<number>(0);
  const [esiCashAmount, setEsiCashAmount] = useState<number>(0);
  const [canteenAmount, setCanteenAmount] = useState<number>(0);
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  
  // Multiple fines state
  const [fines, setFines] = useState<Array<{
    id: string;
    amount: number;
    reason: string;
    description: string;
  }>>([]);
  
  // Salary calculation type
  const [salaryType, setSalaryType] = useState<"esi" | "cash">("esi");
  
  // Attendance modal state
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalAttendanceStatus, setModalAttendanceStatus] = useState<"present" | "absent">("present");
  const [modalWorkingHours, setModalWorkingHours] = useState<number>(8.0);
  
  // Attendance tracking for salary calculation with localStorage persistence
  const [attendanceHours, setAttendanceHours] = useState<Record<string, number>>({});
  
  // Notification state for visual feedback
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Handle form data changes
  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Recalculate salary breakdown when salary-related fields change
    if (['basic_salary', 'hourly_rate', 'salary_type'].includes(field)) {
      const updatedFormData = { ...formData, [field]: value };
      const breakdown = calculateSalaryBreakdown(
        Number(updatedFormData.basic_salary) || 0,
        Number(updatedFormData.hourly_rate) || hourlyRate,
        8 * 26, // Default 8 hours * 26 days
        (updatedFormData.salary_type as 'esi' | 'cash' | 'bank') || 'esi'
      );
      setSalaryBreakdown(breakdown);
    }
  };

  // Helper function to sanitize data for database
  const sanitizeForDatabase = (data: any) => {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value === '' || value === null || value === undefined) {
        // For enum fields and dates, use null instead of empty string
        if (['gender', 'marital_status', 'blood_group', 'employment_type', 'contract_type', 'date_of_birth', 'join_date'].includes(key)) {
          sanitized[key] = null;
        } else if (key === 'skills' || key === 'certifications') {
          // For array fields, use empty array instead of null
          sanitized[key] = [];
        } else {
          sanitized[key] = value === '' ? null : value;
        }
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  };

  // Save employee data
  const handleSaveEmployee = async () => {
    if (!employeeData) return;
    
    try {
      setSaving(true);
      
      // Update user info - split full_name into first_name and last_name
      const nameParts = formData.full_name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await updateUserInfo(employeeData.id, {
        first_name: firstName,
        last_name: lastName,
        phone: formData.phone,
        email: formData.email
      });
      
      // Update employee details with sanitized data
      if (employeeData.employee_details?.[0]) {
        const employeeDetailsData = {
          current_address: formData.current_address,
          permanent_address: formData.permanent_address,
          department_id: formData.department_id,
          position_id: formData.position_id,
          employment_type: formData.employment_type,
          contract_type: formData.contract_type,
          join_date: formData.join_date,
          employee_code: formData.employee_code,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          nationality: formData.nationality,
          marital_status: formData.marital_status,
          blood_group: formData.blood_group,
          alternate_phone: formData.alternate_phone,
          education_qualification: formData.education_qualification,
          experience_years: formData.experience_years,
          skills: formData.skills,
          certifications: formData.certifications,
          bank_name: formData.bank_name,
          bank_account_number: formData.bank_account_number,
          ifsc_code: formData.ifsc_code,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          aadhar_number: formData.aadhar_number,
          pan_number: formData.pan_number
        };
        
        const sanitizedData = sanitizeForDatabase(employeeDetailsData);
        await updateEmployeeDetails(employeeData.id, sanitizedData);
      }
      
      // Reload data to reflect changes
      const employeeId = employeeData.id;
      const updatedEmployee = await getEmployeeById(employeeId);
      if (updatedEmployee) {
        setEmployeeData(updatedEmployee);
      }
      
      alert('Employee data updated successfully!');
    } catch (error) {
      console.error('Error saving employee data:', error);
      alert('Error saving employee data. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  // Get employee ID from URL parameters
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true);
        
        // Check if employee ID is provided
        if (!employeeId) {
          setError('No employee ID provided in URL parameters');
          setLoading(false);
          return;
        }
        
        const [employeeResult, departmentsData] = await Promise.all([
          getEmployeeWithComputedFields(employeeId),
          getDepartments()
        ]);
        
        if (employeeResult) {
          setError(null); // Clear any previous errors
          setEmployeeData(employeeResult);
          // Set initial form values from database
          if (employeeResult.employee_details?.[0]) {
            const details = employeeResult.employee_details[0];
            const hourlyRateValue = details.hourly_rate || 300;
            const contractTypeValue = details.contract_type || "hourly";
            const salaryTypeValue = details.salary_type || "esi";
            const basicSalaryValue = details.basic_salary || 0;
            
            setHourlyRate(hourlyRateValue);
            setContractType(contractTypeValue);
            setSalaryType(salaryTypeValue);
            
            // Calculate salary breakdown
            const breakdown = calculateSalaryBreakdown(
              basicSalaryValue,
              hourlyRateValue,
              8 * 26, // Default 8 hours * 26 days
              salaryTypeValue as 'esi' | 'cash' | 'bank'
            );
            setSalaryBreakdown(breakdown);
            
            // Set form data with proper fallbacks
            setFormData({
              // Basic Info
              full_name: employeeResult.computed?.fullName || `${employeeResult.first_name || ''} ${employeeResult.last_name || ''}`.trim(),
              phone: employeeResult.phone || '',
              email: employeeResult.email || '',
              employee_code: details.employee_code || '',
              
              // Personal Details
              gender: details.gender || '',
              date_of_birth: details.date_of_birth || '',
              nationality: details.nationality || 'Indian',
              marital_status: details.marital_status || '',
              blood_group: details.blood_group || '',
              alternate_phone: details.alternate_phone || '',
              
              // Address
              current_address: details.current_address || details.address || '',
              permanent_address: details.permanent_address || '',
              
              // Employment Details
              department_id: details.department_id || '',
              position_id: details.position_id || '',
              employment_type: details.employment_type || '',
              contract_type: details.contract_type || '',
              join_date: details.join_date || '',
              
              // Education & Experience
              education_qualification: details.education_qualification || '',
              experience_years: details.experience_years || 0,
              skills: details.skills || [],
              certifications: details.certifications || [],
              
              // Banking & Documents
              bank_name: details.bank_name || '',
              bank_account_number: details.bank_account_number || '',
              ifsc_code: details.ifsc_code || '',
              pan_number: details.pan_number || '',
              aadhar_number: details.aadhar_number || '',
              
              // Emergency Contact
              emergency_contact_name: details.emergency_contact_name || '',
              emergency_contact_phone: details.emergency_contact_phone || '',
              
              // Legacy fields for backward compatibility
              basic_salary: basicSalaryValue,
              hourly_rate: hourlyRateValue,
              salary_type: salaryTypeValue,
              bonus: details.bonus || 0
            });
          }
        }
        
        setDepartments(departmentsData || [
          { id: 1, name: "Office Staff" },
          { id: 2, name: "Operators" },
          { id: 3, name: "Labours" },
          { id: 4, name: "Contractors" },
          { id: 5, name: "Stake Holders" }
        ]);
        
        if (!employeeResult) {
          setError('Employee not found or failed to load employee data');
        }
      } catch (error) {
        console.error('Error loading employee data:', error);
        setError(`Failed to load employee data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Set fallback departments
        setDepartments([
          { id: 1, name: "Office Staff" },
          { id: 2, name: "Operators" },
          { id: 3, name: "Labours" },
          { id: 4, name: "Contractors" },
          { id: 5, name: "Stake Holders" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      loadEmployeeData();
    } else {
      setError('No employee ID provided');
      setLoading(false);
    }

    const savedAttendanceHours = localStorage.getItem('attendanceHours');
    const savedAttendance = localStorage.getItem('attendance');
    
    if (savedAttendanceHours) {
      try {
        setAttendanceHours(JSON.parse(savedAttendanceHours));
      } catch (error) {
        console.error('Error loading attendance hours from localStorage:', error);
        // Set default data if parsing fails
        setAttendanceHours({
          '2024-01-01': 8, '2024-01-02': 8, '2024-01-03': 8, '2024-01-04': 8, '2024-01-05': 8,
          '2024-01-08': 8, '2024-01-09': 8, '2024-01-10': 8, '2024-01-11': 8, '2024-01-12': 8,
          '2024-01-15': 8, '2024-01-16': 8, '2024-01-17': 8, '2024-01-18': 8, '2024-01-19': 8,
          '2024-01-22': 8, '2024-01-23': 8, '2024-01-24': 8, '2024-01-25': 8, '2024-01-26': 8,
          '2024-01-29': 8, '2024-01-30': 8, '2024-01-31': 8
        });
      }
    } else {
      // Set default data for first time users
      const defaultHours = {
        '2024-01-01': 8, '2024-01-02': 8, '2024-01-03': 8, '2024-01-04': 8, '2024-01-05': 8,
        '2024-01-08': 8, '2024-01-09': 8, '2024-01-10': 8, '2024-01-11': 8, '2024-01-12': 8,
        '2024-01-15': 8, '2024-01-16': 8, '2024-01-17': 8, '2024-01-18': 8, '2024-01-19': 8,
        '2024-01-22': 8, '2024-01-23': 8, '2024-01-24': 8, '2024-01-25': 8, '2024-01-26': 8,
        '2024-01-29': 8, '2024-01-30': 8, '2024-01-31': 8
      };
      setAttendanceHours(defaultHours);
      localStorage.setItem('attendanceHours', JSON.stringify(defaultHours));
    }
    
    if (savedAttendance) {
      try {
        setAttendance(JSON.parse(savedAttendance));
      } catch (error) {
        console.error('Error loading attendance from localStorage:', error);
      }
    }
  }, []);
  
  // Calculate total hours from attendance
  const calculateTotalHours = () => {
    return Object.values(attendanceHours).reduce((total, hours) => total + hours, 0);
  };

  // Calculate attendance statistics based on actual data
  const calculateAttendanceStats = () => {
    try {
      const presentDays = Object.values(attendance).filter(status => status === 'P').length;
      const absentDays = Object.values(attendance).filter(status => status === 'A').length;
      const leaveDays = Object.values(attendance).filter(status => status === 'L').length;
      
      // Calculate total hours with validation - only count hours for present days
      const totalHours = Object.entries(attendanceHours)
        .filter(([date]) => attendance[date] === 'P')
        .reduce((sum, [_, hours]) => {
          const validHours = typeof hours === 'number' && hours >= 0 && hours <= 24 ? hours : 0;
          return sum + validHours;
        }, 0);
      
      const totalDays = presentDays + absentDays + leaveDays;
      const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
      const absencePercentage = totalDays > 0 ? ((absentDays / totalDays) * 100).toFixed(1) : 0;
      
      return {
        presentDays: Math.max(0, presentDays),
        absentDays: Math.max(0, absentDays),
        leaveDays: Math.max(0, leaveDays),
        totalHours: Math.max(0, Math.round(totalHours * 10) / 10), // Round to 1 decimal place
        attendancePercentage: Math.min(100, Math.max(0, parseFloat(attendancePercentage.toString()))),
        absencePercentage: Math.min(100, Math.max(0, parseFloat(absencePercentage.toString())))
      };
    } catch (error) {
      console.error('Error calculating attendance stats:', error);
      // Return safe default values
      return {
        presentDays: 0,
        absentDays: 0,
        leaveDays: 0,
        totalHours: 0,
        attendancePercentage: 0,
        absencePercentage: 0
      };
    }
  };

  const attendanceStats = calculateAttendanceStats();

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", active: false, href: "/factory-dashboard" },
    { icon: Users, label: "Staff Management", active: true, href: "/staff-management" },
    { icon: Factory, label: "Production", active: false, href: "#" },
    { icon: Package, label: "Inventory", active: false, href: "#" },
    { icon: ShoppingCart, label: "Sales", active: false, href: "#" },
    { icon: DollarSign, label: "Finance", active: false, href: "#" },
    { icon: FileText, label: "Report", active: false, href: "#" },
  ];

  // Helper function to calculate days worked
  const calculateDaysWorked = (joinDate: string) => {
    if (!joinDate) return 0;
    const join = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - join.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Field component with factory dashboard styling
  function Field({ id, label, placeholder = "", type = "text" as React.HTMLInputTypeAttribute, className = "", value = "" }: {
    id: string;
    label: string;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    className?: string;
    value?: string;
  }) {
    return (
      <div className={"space-y-2 " + className}>
        <Label htmlFor={id} className="text-slate-700 font-medium">{label}</Label>
        <Input 
          id={id} 
          type={type}
          placeholder={placeholder}
          value={formData[id as keyof typeof formData] || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange(id, e.target.value)}
          className="bg-white/80 backdrop-blur-sm border-slate-200/50 focus:border-blue-400 transition-colors" 
        />
      </div>
    );
  }

  // Section component with glass morphism styling
  function Section({ title, desc, children, icon: Icon }: { title: string; desc?: string; children: React.ReactNode; icon?: any }) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
        <Card className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 border border-white/20">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                  <Icon className="h-5 w-5 text-white" />
                </div>
              )}
              <div>
                <CardTitle className="text-slate-900">{title}</CardTitle>
                {desc && <CardDescription className="text-slate-600">{desc}</CardDescription>}
              </div>
            </div>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    );
  }

  // Attendance calendar functions
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const dayKeys: string[] = Array.from({ length: lastDay.getDate() }, (_, i) => fmt(new Date(month.getFullYear(), month.getMonth(), i + 1)));

  function setStatusForDate(d: Date) {
    if (!selectedStatus) return;
    const key = fmt(d);
    setAttendance((prev) => ({ ...prev, [key]: selectedStatus as "P" | "A" | "L" }));
  }

  function clearStatusForDate(d: Date) {
    const key = fmt(d);
    setAttendance((prev) => {
      const copy = { ...prev } as Record<string, "P" | "A" | "L">;
      delete copy[key];
      return copy;
    });
  }

  function handlePaint(d: Date) {
    if (selectedStatus === "") return clearStatusForDate(d);
    setStatusForDate(d);
  }

  function marker(day: Date) {
    const key = fmt(day);
    const status = attendance[key];
    if (!status) return null;

    const classes: Record<string, string> = {
      P: "bg-green-200 text-green-900",
      A: "bg-red-200 text-red-900",
      L: "bg-yellow-200 text-yellow-900",
    };

    return (
      <span className={`absolute bottom-1 right-1 rounded-full px-1 text-[10px] leading-4 ${classes[status]}`}>{status}</span>
    );
  }

  const counts = dayKeys.reduce(
    (acc, k) => {
      const s = attendance[k];
      if (s === "P") acc.P += 1;
      if (s === "A") acc.A += 1;
      if (s === "L") acc.L += 1;
      return acc;
    },
    { P: 0, A: 0, L: 0 }
  );

  const totalMarked = counts.P + counts.A + counts.L;

  function markAll(predicate: (date: Date) => boolean) {
    setAttendance((prev) => {
      const next = { ...prev } as Record<string, "P" | "A" | "L">;
      dayKeys.forEach((k, i) => {
        const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
        if (predicate(d)) {
          if (!selectedStatus) delete next[k];
          else next[k] = selectedStatus as "P" | "A" | "L";
        }
      });
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="h-full bg-white/80 backdrop-blur-2xl shadow-2xl shadow-slate-900/10 border-r border-white/20">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 h-20">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Saihari Papers" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-black drop-shadow-lg shadow-black/50">SaihariPapers</h1>
                <p className="text-xs text-slate-500">Factory Management</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group ${
                    item.active 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${item.active ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-2xl shadow-lg shadow-slate-900/5 border-b border-white/20 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Employee Details</h1>
                <p className="text-sm text-slate-500">
                  {loading ? "Loading..." : employeeData ? `${employeeData.first_name || ''} ${employeeData.last_name || ''} • ${employeeData.employee_details?.[0]?.position?.name || 'N/A'}`.trim() : "Employee not found"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              </button>
              
              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">Hari Chandran</p>
                  <p className="text-xs text-slate-500">Director</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">HC</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Employee Details Content */}
        <main className="p-6 space-y-6">
          {/* Error State */}
          {error && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400/20 to-red-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-red-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-red-200/50 border border-red-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-red-500 shadow-lg">
                    <XCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Error Loading Employee Data</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-blue-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-blue-200/50 border border-blue-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-blue-500 shadow-lg animate-pulse">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Loading Employee Data</h3>
                    <p className="text-blue-700">Please wait while we fetch the employee information...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employee Overview Cards */}
          {!loading && !error && employeeData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                    <AvatarImage src={employeeData?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                      {loading ? "..." : `${employeeData?.first_name?.[0] || ''}${employeeData?.last_name?.[0] || ''}` || "N/A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {loading ? "Loading..." : employeeData?.computed?.fullName || `${employeeData?.first_name || ''} ${employeeData?.last_name || ''}`.trim() || "N/A"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {loading ? "Loading..." : employeeData?.computed?.positionTitle || employeeData?.employee_details?.[0]?.positions?.title || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {loading ? "Loading..." : `ID: ${employeeData?.employee_id || employeeData?.id || 'N/A'}`}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Department</span>
                    <span className="text-slate-900 font-medium">
                      {loading ? "Loading..." : employeeData?.computed?.departmentName || employeeData?.employee_details?.[0]?.departments?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Type</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {loading ? "Loading..." : employeeData?.employee_details?.[0]?.employee_type || employeeData?.employee_details?.[0]?.contract_type || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-purple-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {loading ? "Loading..." : salaryBreakdown?.grossSalary ? `₹${salaryBreakdown.grossSalary.toLocaleString()}` : employeeData?.employee_details?.[0]?.basic_salary ? `₹${employeeData.employee_details[0].basic_salary.toLocaleString()}` : "N/A"}
                    </p>
                    <p className="text-sm text-slate-500">Monthly</p>
                  </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Salary Type</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {loading ? "Loading..." : (employeeData?.employee_details?.[0]?.salary_type || 'N/A').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Rate/Hour</span>
                      <span className="text-purple-600 font-medium">
                        {loading ? "Loading..." : employeeData?.employee_details?.[0]?.hourly_rate ? `₹${employeeData.employee_details[0].hourly_rate.toLocaleString()}` : "N/A"}
                      </span>
                    </div>
                  </div>
              </div>
            </div>

            {/* Total Days Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {employeeData?.computed?.daysWorked 
                        ? employeeData.computed.daysWorked.toLocaleString()
                        : employeeData?.employee_details?.[0]?.join_date 
                        ? calculateDaysWorked(employeeData.employee_details[0].join_date).toLocaleString()
                        : "N/A"
                      }
                    </p>
                    <p className="text-sm text-slate-500">Total Days</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {(employeeData?.status || "active").charAt(0).toUpperCase() + (employeeData?.status || "active").slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Since Joining</span>
                    <span className="text-slate-900 font-medium">
                      {employeeData?.employee_details?.[0]?.join_date || employeeData?.employee_details?.[0]?.date_of_joining || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Detailed Information Tabs */}
          {!loading && !error && employeeData && (
            <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-white/20">
              <Tabs defaultValue="details" className="w-full">
                <div className="border-b border-slate-200/50 px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-5 bg-slate-100/80 backdrop-blur-sm">
                    <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <User className="h-4 w-4 mr-2" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="attendance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Attendance
                    </TabsTrigger>
                    <TabsTrigger value="contract" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Contract
                    </TabsTrigger>
                    <TabsTrigger value="salary" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Salary
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Employee Details Tab */}
                <TabsContent value="details" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400/20 to-slate-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                          <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                              <AvatarImage src={employeeData?.avatar_url} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                                {loading ? "..." : `${employeeData?.first_name?.[0] || ''}${employeeData?.last_name?.[0] || ''}` || "N/A"}
                              </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                              <Edit className="h-4 w-4 mr-2" />
                              Upload Photo
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                              <User className="h-5 w-5 mr-2 text-blue-600" />
                              Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                                <Input
                                  id="name"
                                  value={formData.full_name}
                                  onChange={(e) => handleFormChange('full_name', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                  placeholder="Enter full name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="employee_code" className="text-sm font-medium text-slate-700">Employee Code</Label>
                                <Input
                                  id="employee_code"
                                  value={formData.employee_code}
                                  onChange={(e) => handleFormChange('employee_code', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                  placeholder="Enter employee code"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
                                <Input
                                  id="phone"
                                  value={formData.phone}
                                  onChange={(e) => handleFormChange('phone', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleFormChange('email', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700">Date of Birth</Label>
                                <Input
                                  id="dateOfBirth"
                                  type="date"
                                  value={formData.date_of_birth}
                                  onChange={(e) => handleFormChange('date_of_birth', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="gender" className="text-sm font-medium text-slate-700">Gender</Label>
                                <select
                                  id="gender"
                                  value={formData.gender}
                                  onChange={(e) => handleFormChange('gender', e.target.value)}
                                  className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="maritalStatus" className="text-sm font-medium text-slate-700">Marital Status</Label>
                                <select
                                  id="maritalStatus"
                                  value={employeeData?.employee_details?.[0]?.marital_status || ''}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFormChange('marital_status', e.target.value)}
                                  className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select Status</option>
                                  <option value="single">Single</option>
                                  <option value="married">Married</option>
                                  <option value="divorced">Divorced</option>
                                  <option value="widowed">Widowed</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="bloodGroup" className="text-sm font-medium text-slate-700">Blood Group</Label>
                                <select
                                  id="bloodGroup"
                                  value={employeeData?.employee_details?.[0]?.blood_group || ''}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFormChange('blood_group', e.target.value)}
                                  className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select Blood Group</option>
                                  <option value="A+">A+</option>
                                  <option value="A-">A-</option>
                                  <option value="B+">B+</option>
                                  <option value="B-">B-</option>
                                  <option value="AB+">AB+</option>
                                  <option value="AB-">AB-</option>
                                  <option value="O+">O+</option>
                                  <option value="O-">O-</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="nationality" className="text-sm font-medium text-slate-700">Nationality</Label>
                                <Input
                                  id="nationality"
                                  value={employeeData?.employee_details?.[0]?.nationality || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('nationality', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="employeeCode" className="text-sm font-medium text-slate-700">Employee Code</Label>
                                <Input
                                  id="employeeCode"
                                  value={employeeData?.employee_details?.[0]?.employee_code || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('employee_code', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="current_address" className="text-sm font-medium text-slate-700">Current Address</Label>
                                <Input
                                  id="current_address"
                                  value={formData.current_address}
                                  onChange={(e) => handleFormChange('current_address', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Employment Details Section */}
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                              <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                              Employment Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="dept" className="text-sm font-medium text-slate-700">Department</Label>
                                <select 
                                  id="dept" 
                                  className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                  value={formData.department_id}
                                  onChange={(e) => handleFormChange('department_id', e.target.value)}
                                >
                                  <option value="">Select Department</option>
                                  {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                      {dept.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="position" className="text-sm font-medium text-slate-700">Position</Label>
                                <Input
                                  id="position"
                                  value={employeeData?.employee_details?.[0]?.positions?.title || ''}
                                  disabled
                                  className="bg-slate-100/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="type" className="text-sm font-medium text-slate-700">Employment Type</Label>
                                <select
                                  id="type"
                                  className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                  value={formData.employment_type}
                                  onChange={(e) => handleFormChange('employment_type', e.target.value)}
                                >
                                  <option value="">Select Type</option>
                                  <option value="full_time">Full Time</option>
                                  <option value="part_time">Part Time</option>
                                  <option value="contract">Contract</option>
                                  <option value="temporary">Temporary</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="contractType" className="text-sm font-medium text-slate-700">Contract Type</Label>
                                <select
                                  id="contractType"
                                  className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                  value={employeeData?.employee_details?.[0]?.contract_type || ''}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFormChange('contract_type', e.target.value)}
                                >
                                  <option value="">Select Contract Type</option>
                                  <option value="permanent">Permanent</option>
                                  <option value="temporary">Temporary</option>
                                  <option value="contract">Contract</option>
                                  <option value="probation">Probation</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="doj" className="text-sm font-medium text-slate-700">Date of Joining</Label>
                                <Input
                                  id="doj"
                                  type="date"
                                  value={formData.join_date}
                                  onChange={(e) => handleFormChange('join_date', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="workLocation" className="text-sm font-medium text-slate-700">Work Location</Label>
                                <Input
                                  id="workLocation"
                                  value={employeeData?.employee_details?.[0]?.work_location || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('work_location', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="shiftTiming" className="text-sm font-medium text-slate-700">Shift Timing</Label>
                                <Input
                                  id="shiftTiming"
                                  value={employeeData?.employee_details?.[0]?.shift_timing || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('shift_timing', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="probationPeriod" className="text-sm font-medium text-slate-700">Probation Period (Months)</Label>
                                <Input
                                  id="probationPeriod"
                                  type="number"
                                  value={employeeData?.employee_details?.[0]?.probation_period_months || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('probation_period_months', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmationDate" className="text-sm font-medium text-slate-700">Confirmation Date</Label>
                                <Input
                                  id="confirmationDate"
                                  type="date"
                                  value={employeeData?.employee_details?.[0]?.confirmation_date || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('confirmation_date', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Salary Information Section */}
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/10 to-purple-400/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                              <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                              Salary Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="basic_salary">Basic Salary</Label>
                                <Input
                                  id="basic_salary"
                                  name="basic_salary"
                                  type="number"
                                  value={formData.basic_salary || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('basic_salary', e.target.value)}
                                  placeholder="Basic Salary"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="hourly_rate">Hourly Rate</Label>
                                <Input
                                  id="hourly_rate"
                                  name="hourly_rate"
                                  type="number"
                                  value={formData.hourly_rate || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('hourly_rate', e.target.value)}
                                  placeholder="Hourly Rate"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="salary_type">Salary Type</Label>
                                <select
                                  id="salary_type"
                                  name="salary_type"
                                  value={formData.salary_type || ''}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFormChange('salary_type', e.target.value)}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <option value="">Select Salary Type</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="hourly">Hourly</option>
                                  <option value="daily">Daily</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="bonus">Annual Bonus</Label>
                                <Input
                                  id="bonus"
                                  name="bonus"
                                  type="number"
                                  value={formData.bonus || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('bonus', e.target.value)}
                                  placeholder="Annual Bonus"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Banking & Legal Information Section */}
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/10 to-orange-400/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-orange-600" />
                              Banking & Legal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Field id="bank_name" label="Bank Name" placeholder="Bank Name" />
                              <Field id="account_number" label="Account Number" placeholder="Account Number" />
                              <Field id="ifsc" label="IFSC Code" placeholder="IFSC Code" />
                              <Field id="emergency_contact" label="Emergency Contact" placeholder="Emergency Contact" />
                              <Field id="aadhaar" label="Aadhaar Number" placeholder="XXXX XXXX XXXX" />
                              <Field id="pan" label="PAN Number" placeholder="ABCDE1234F" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSaveEmployee}
                          disabled={saving}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance" className="p-6">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <Input
                        type="month"
                        value={`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`}
                        onChange={(e) => {
                          const [y, m] = e.target.value.split("-").map(Number);
                          setMonth(new Date(y, (m || 1) - 1, 1));
                        }}
                        className="w-48 bg-white/80 backdrop-blur-sm border-slate-200/50"
                      />
                      <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-slate-200/50">
                        <button
                          type="button"
                          onClick={() => setSelectedStatus("P")}
                          className={`px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedStatus === "P" ? "bg-green-200 text-green-900" : "hover:bg-slate-100"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedStatus("A")}
                          className={`px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedStatus === "A" ? "bg-red-200 text-red-900" : "hover:bg-slate-100"
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedStatus("")}
                          className={`px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedStatus === "" ? "bg-slate-200 text-slate-900" : "hover:bg-slate-100"
                          }`}
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => markAll((d) => d.getDay() !== 0 && d.getDay() !== 6)}>
                          Fill Weekdays
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setAttendance({})}>
                          Reset
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>

                    {/* Modern Attendance Calendar */}
                    <div className="space-y-6">
                      {/* Calendar Header with Navigation */}
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-slate-900">Attendance Calendar</h3>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <span className="text-lg font-medium text-slate-700 min-w-[140px] text-center">
                                {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                              <button 
                                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Custom Calendar Grid */}
                          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-slate-200/50">
                            {/* Days of Week Header */}
                            <div className="grid grid-cols-7 gap-2 mb-4">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
                                  {day}
                                </div>
                              ))}
                            </div>
                            
                            {/* Calendar Days Grid */}
                            <div className="grid grid-cols-7 gap-2">
                              {Array.from({ length: 35 }, (_, i) => {
                                const date = new Date(month.getFullYear(), month.getMonth(), i - 6);
                                const isCurrentMonth = date.getMonth() === month.getMonth();
                                const isToday = date.toDateString() === new Date().toDateString();
                                const dayNum = date.getDate();
                                const dateKey = date.toISOString().split('T')[0];
                                
                                // Get real-time attendance data from state
                                const attendanceStatus = attendance[dateKey];
                                const hoursWorked = attendanceHours[dateKey] || 0;
                                
                                const getStatusColor = (status: string) => {
                                  switch(status) {
                                    case 'P': return 'bg-green-100 text-green-800 border-green-200';
                                    case 'A': return 'bg-red-100 text-red-800 border-red-200';
                                    case 'L': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                                    default: return 'bg-slate-50 text-slate-600 border-slate-200';
                                  }
                                };
                                
                                return (
                                  <div
                                    key={i}
                                    className={`
                                      relative h-16 w-16 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 cursor-pointer
                                      ${isCurrentMonth ? 'opacity-100' : 'opacity-30'}
                                      ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                                      ${attendanceStatus ? getStatusColor(attendanceStatus) : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}
                                      hover:scale-105 hover:shadow-md
                                    `}
                                    onClick={() => {
                                      setSelectedDate(date);
                                      setModalAttendanceStatus(attendanceStatus === 'P' ? 'present' : 'absent');
                                      setModalWorkingHours(hoursWorked || 8.0);
                                      setShowAttendanceModal(true);
                                    }}
                                  >
                                    <span className="text-sm font-medium">{dayNum}</span>
                                    {attendanceStatus === 'P' && hoursWorked > 0 && (
                                      <span className="text-xs text-slate-600 mt-1">{hoursWorked}h</span>
                                    )}
                                    {attendanceStatus && (
                                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                                        attendanceStatus === 'P' ? 'bg-green-500' : 
                                        attendanceStatus === 'A' ? 'bg-red-500' : 'bg-yellow-500'
                                      }`} />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Attendance Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                          <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm border border-green-200/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-green-700 mb-1">{attendanceStats.presentDays}</div>
                            <div className="text-sm text-green-600 font-medium">Present Days</div>
                            <div className="text-xs text-green-500 mt-1">{attendanceStats.attendancePercentage}% attendance</div>
                          </div>
                        </div>
                        
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400/20 to-rose-400/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                          <div className="relative bg-gradient-to-br from-red-50 to-rose-50 backdrop-blur-sm border border-red-200/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <XCircle className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-red-700 mb-1">{attendanceStats.absentDays}</div>
                            <div className="text-sm text-red-600 font-medium">Absent Days</div>
                            <div className="text-xs text-red-500 mt-1">{attendanceStats.absencePercentage}% absence</div>
                          </div>
                        </div>
                        
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                          <div className="relative bg-gradient-to-br from-yellow-50 to-amber-50 backdrop-blur-sm border border-yellow-200/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-yellow-700 mb-1">{attendanceStats.leaveDays}</div>
                            <div className="text-sm text-yellow-600 font-medium">Leave Days</div>
                            <div className="text-xs text-yellow-500 mt-1">Approved leaves</div>
                          </div>
                        </div>
                        
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm border border-blue-200/50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-blue-700 mb-1">{attendanceStats.totalHours}</div>
                            <div className="text-sm text-blue-600 font-medium">Total Hours</div>
                            <div className="text-xs text-blue-500 mt-1">This month</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Simplified Salary Tab - Monthly & Hourly Only */}
                <TabsContent value="salary" className="p-6">
                  <div className="space-y-8">
                    {/* Salary Configuration Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Salary Configuration
                      </h2>
                      <p className="text-slate-600 mt-2">Configure employee salary structure and calculations</p>
                    </div>

                    {/* Calculation Method Selection */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                      <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-slate-700 mb-6 flex items-center">
                          <Calculator className="h-6 w-6 mr-3 text-purple-600" />
                          Salary Calculation Method
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div
                            onClick={() => setCalculationMethod('monthly')}
                            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                              calculationMethod === 'monthly'
                                ? 'border-purple-500 bg-purple-50 shadow-lg'
                                : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-3">📅</div>
                              <div className="font-semibold text-slate-700 text-lg">Monthly Salary</div>
                              <div className="text-sm text-slate-500 mt-2">Fixed monthly amount with allowances</div>
                            </div>
                          </div>
                          
                          <div
                            onClick={() => setCalculationMethod('hourly')}
                            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                              calculationMethod === 'hourly'
                                ? 'border-purple-500 bg-purple-50 shadow-lg'
                                : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-3">⏰</div>
                              <div className="font-semibold text-slate-700 text-lg">Hourly Rate</div>
                              <div className="text-sm text-slate-500 mt-2">Pay per hour with overtime support</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Salary Fields */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                      <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-slate-700 mb-6 flex items-center">
                          <DollarSign className="h-6 w-6 mr-3 text-emerald-600" />
                          Salary Components
                        </h3>

                        {/* Monthly Salary Fields */}
                        {calculationMethod === 'monthly' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="basic_salary">Basic Salary (₹)</Label>
                              <Input
                                id="basic_salary"
                                type="number"
                                value={formData.basic_salary}
                                onChange={(e) => handleFormChange('basic_salary', Number(e.target.value))}
                                className="text-lg font-semibold"
                                placeholder="Enter basic salary"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="working_days">Working Days per Month</Label>
                              <Input
                                id="working_days"
                                type="number"
                                value={26}
                                readOnly
                                className="bg-slate-100"
                                placeholder="26"
                              />
                            </div>
                          </div>
                        )}

                        {/* Hourly Rate Fields */}
                        {calculationMethod === 'hourly' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
                              <Input
                                id="hourly_rate"
                                type="number"
                                value={formData.hourly_rate}
                                onChange={(e) => handleFormChange('hourly_rate', Number(e.target.value))}
                                className="text-lg font-semibold"
                                placeholder="Enter hourly rate"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="standard_hours">Standard Hours/Day</Label>
                              <Input
                                id="standard_hours"
                                type="number"
                                step="0.5"
                                value={8}
                                readOnly
                                className="bg-slate-100"
                                placeholder="8.0"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="total_hours">Total Hours This Month</Label>
                              <Input
                                id="total_hours"
                                type="number"
                                value={attendanceStats.totalHours}
                                readOnly
                                className="bg-green-50 font-semibold"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Salary Preview */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                      <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-slate-700 mb-6 flex items-center">
                          <Receipt className="h-6 w-6 mr-3 text-blue-600" />
                          Salary Preview
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Earnings */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-emerald-700 text-lg">Earnings</h4>
                            <div className="space-y-3">
                              {calculationMethod === 'monthly' && (
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                  <span>Basic Salary:</span>
                                  <span className="font-semibold text-emerald-600">₹{(formData.basic_salary || 0).toLocaleString()}</span>
                                </div>
                              )}
                              {calculationMethod === 'hourly' && (
                                <>
                                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span>Hourly Rate:</span>
                                    <span className="font-semibold">₹{formData.hourly_rate}/hr</span>
                                  </div>
                                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span>Total Hours:</span>
                                    <span className="font-semibold">{attendanceStats.totalHours} hrs</span>
                                  </div>
                                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span>Gross Earnings:</span>
                                    <span className="font-semibold text-emerald-600">₹{((formData.hourly_rate || 0) * attendanceStats.totalHours).toLocaleString()}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Summary */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-blue-700 text-lg">Summary</h4>
                            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl">
                              <div className="text-sm opacity-90 mb-2">
                                {calculationMethod === 'monthly' ? 'Monthly Salary' : 'Total Earnings'}
                              </div>
                              <div className="text-3xl font-bold">
                                ₹{calculationMethod === 'monthly' 
                                  ? (formData.basic_salary || 0).toLocaleString()
                                  : ((formData.hourly_rate || 0) * attendanceStats.totalHours).toLocaleString()
                                }
                              </div>
                              <div className="text-sm opacity-90 mt-2">
                                {calculationMethod === 'monthly' 
                                  ? 'Fixed monthly amount'
                                  : `${formData.hourly_rate || 0} × ${attendanceStats.totalHours} hours`
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveEmployee}
                        disabled={saving}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-lg"
                      >
                        {saving ? 'Saving...' : 'Save Salary Configuration'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
}
