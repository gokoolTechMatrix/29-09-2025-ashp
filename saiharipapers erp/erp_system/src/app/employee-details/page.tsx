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
import { getEmployeeById, updateEmployeeDetails, updateUserInfo, getDepartments } from "@/lib/supabase";

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
  
  // Form state for editable fields
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    department_id: '',
    employee_type: '',
    date_of_joining: '',
    basic_salary: 0,
    hourly_rate: 0,
    salary_type: '',
    bonus: 0,
    bank_name: '',
    account_number: '',
    ifsc: '',
    emergency_contact: '',
    aadhaar: '',
    pan: ''
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
  }>({ show: false, message: '', type: 'success' });
  
  // Handle form data changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save employee data
  const handleSaveEmployee = async () => {
    if (!employeeData) return;
    
    try {
      setSaving(true);
      
      // Update user info
      await updateUserInfo(employeeData.id, {
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email
      });
      
      // Update employee details
      if (employeeData.employee_details?.[0]) {
        await updateEmployeeDetails(employeeData.id, {
          address: formData.address,
          department_id: formData.department_id,
          employee_type: formData.employee_type,
          date_of_joining: formData.date_of_joining,
          basic_salary: formData.basic_salary,
          hourly_rate: formData.hourly_rate,
          salary_type: formData.salary_type,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          ifsc: formData.ifsc,
          emergency_contact: formData.emergency_contact,
          aadhaar: formData.aadhaar,
          pan: formData.pan
        });
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
          getEmployeeById(employeeId),
          getDepartments()
        ]);
        
        if (employeeResult) {
          setError(null); // Clear any previous errors
          setEmployeeData(employeeResult);
          // Set initial form values from database
          if (employeeResult.employee_details?.[0]) {
            const details = employeeResult.employee_details[0];
            setHourlyRate(details.hourly_rate || 300);
            setContractType(details.contract_type || "hourly");
            setSalaryType(details.salary_type || "esi");
            
            // Set form data
            setFormData({
              full_name: employeeResult.full_name || '',
              phone: employeeResult.phone || '',
              email: employeeResult.email || '',
              address: employeeResult.address || '',
              department_id: details.department_id || '',
              employee_type: details.employee_type || '',
              date_of_joining: details.date_of_joining || '',
              basic_salary: details.basic_salary || 0,
              hourly_rate: details.hourly_rate || 0,
              salary_type: details.salary_type || '',
              bonus: details.bonus || 0,
              bank_name: details.bank_name || '',
              account_number: details.account_number || '',
              ifsc: details.ifsc || '',
              emergency_contact: details.emergency_contact || '',
              aadhaar: details.aadhaar || '',
              pan: details.pan || ''
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
                  {loading ? "Loading..." : employeeData ? `${employeeData.full_name} • ${employeeData.employee_details?.[0]?.position?.name || 'N/A'}` : "Employee not found"}
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
                      {loading ? "..." : employeeData?.full_name?.split(" ").map((n: string)=>n[0]).join("") || "N/A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {loading ? "Loading..." : employeeData?.full_name || "N/A"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {loading ? "Loading..." : employeeData?.employee_details?.[0]?.position?.name || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {loading ? "Loading..." : employeeData?.id || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Department</span>
                    <span className="text-slate-900 font-medium">
                      {loading ? "Loading..." : employeeData?.employee_details?.[0]?.department?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Type</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {loading ? "Loading..." : employeeData?.employee_details?.[0]?.employee_type || "N/A"}
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
                      {loading ? "Loading..." : employeeData?.employee_details?.[0]?.basic_salary ? `₹${employeeData.employee_details[0].basic_salary}` : "N/A"}
                    </p>
                    <p className="text-sm text-slate-500">Monthly</p>
                  </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Salary Type</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {loading ? "Loading..." : employeeData?.employee_details?.[0]?.salary_type || "N/A"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Rate/Hour</span>
                      <span className="text-purple-600 font-medium">
                        {loading ? "Loading..." : employeeData?.employee_details?.[0]?.hourly_rate ? `₹${employeeData.employee_details[0].hourly_rate}` : "N/A"}
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
                      {employeeData?.employee_details?.[0]?.date_of_joining 
                        ? calculateDaysWorked(employeeData.employee_details[0].date_of_joining).toLocaleString()
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
                      {employeeData?.status || "Active"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Since Joining</span>
                    <span className="text-slate-900 font-medium">
                      {employeeData?.employee_details?.[0]?.date_of_joining || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
          }

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
                                {loading ? "..." : employeeData?.full_name?.split(" ").map((n: string)=>n[0]).join("") || "N/A"}
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
                                  value={employeeData?.first_name && employeeData?.last_name ? `${employeeData.first_name} ${employeeData.last_name}` : formData.full_name}
                                  onChange={(e) => handleFormChange('full_name', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="empId" className="text-sm font-medium text-slate-700">Employee ID</Label>
                                <Input
                                  id="empId"
                                  value={employeeData?.employee_id || ''}
                                  disabled
                                  className="bg-slate-100/80 backdrop-blur-sm border-slate-200/50"
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
                                  value={employeeData?.employee_details?.[0]?.date_of_birth || ''}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange('date_of_birth', e.target.value)}
                                  className="bg-white/80 backdrop-blur-sm border-slate-200/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="gender" className="text-sm font-medium text-slate-700">Gender</Label>
                                <select
                                  id="gender"
                                  value={employeeData?.employee_details?.[0]?.gender || ''}
                                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFormChange('gender', e.target.value)}
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
                                <Label htmlFor="address" className="text-sm font-medium text-slate-700">Address</Label>
                                <Input
                                  id="address"
                                  value={formData.address}
                                  onChange={(e) => handleFormChange('address', e.target.value)}
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
                                  value={formData.employee_type}
                                  onChange={(e) => handleFormChange('employee_type', e.target.value)}
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
                                  value={formData.date_of_joining}
                                  onChange={(e) => handleFormChange('date_of_joining', e.target.value)}
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

                {/* Salary Tab - Comprehensive Salary Sheet */}
                <TabsContent value="salary" className="p-6">
                  <div className="space-y-8">
                    {/* Salary Sheet Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Employee Salary Sheet
                      </h2>
                      <p className="text-slate-600 mt-2">Comprehensive salary calculation and breakdown</p>
                    </div>

                    {/* Basic Salary Information */}
                    <Section title="Basic Salary Information" icon={Calculator}>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Rate per hour */}
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-slate-700">Rate per Hour (₹)</label>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  value={hourlyRate}
                                  onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
                                  className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                                />
                                <span className="absolute right-3 top-3 text-slate-500">₹/hr</span>
                              </div>
                            </div>

                            {/* Total Hours */}
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-slate-700">Total Hours</label>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  value={attendanceStats.totalHours}
                                  readOnly
                                  className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg bg-green-50"
                                />
                                <span className="absolute right-3 top-3 text-slate-500">hrs</span>
                              </div>
                              <p className="text-xs text-slate-500">Auto-calculated from attendance</p>
                            </div>

                            {/* Basic Salary */}
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-slate-700">Basic Salary</label>
                              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg">
                                <div className="text-xl font-bold">₹{(hourlyRate * attendanceStats.totalHours).toLocaleString()}</div>
                                <div className="text-sm opacity-90">{hourlyRate} × {attendanceStats.totalHours}</div>
                              </div>
                            </div>

                            {/* Contract Type */}
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-slate-700">Contract Type</label>
                              <select 
                                value={contractType}
                                onChange={(e) => setContractType(e.target.value)}
                                className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
                              >
                                <option value="hourly">Hourly</option>
                                <option value="monthly">Monthly</option>
                                <option value="contract">Contract</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Section>

                    {/* Gross Salary & ESI/TDS */}
                    <Section title="Gross Salary & Deductions" icon={Receipt}>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                              {/* Gross Salary */}
                              <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Gross Salary (₹)</label>
                                <div className="relative">
                                  <input 
                                    type="number" 
                                    value={grossSalary || (hourlyRate * attendanceStats.totalHours)}
                                    onChange={(e) => setGrossSalary(Number(e.target.value) || 0)}
                                    className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-50"
                                  />
                                  <span className="absolute right-3 top-3 text-slate-500">₹</span>
                                </div>
                              </div>

                              {/* Salary Type Selection */}
                              <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Salary Type</label>
                                <div className="flex space-x-4">
                                  <label className="flex items-center space-x-2">
                                    <input 
                                      type="radio" 
                                      value="esi" 
                                      checked={salaryType === "esi"}
                                      onChange={(e) => setSalaryType(e.target.value as "esi" | "cash")}
                                      className="text-blue-600"
                                    />
                                    <span>ESI</span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input 
                                      type="radio" 
                                      value="cash" 
                                      checked={salaryType === "cash"}
                                      onChange={(e) => setSalaryType(e.target.value as "esi" | "cash")}
                                      className="text-blue-600"
                                    />
                                    <span>Cash</span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                              {/* ESI/TDS Amount */}
                              <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">ESI/TDS Amount (₹)</label>
                                <div className="relative">
                                  <input 
                                    type="number" 
                                    value={esiTdsAmount}
                                    onChange={(e) => setEsiTdsAmount(Number(e.target.value) || 0)}
                                    className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50"
                                  />
                                  <span className="absolute right-3 top-3 text-slate-500">₹</span>
                                </div>
                              </div>

                              {/* ESI Cash Amount (conditional) */}
                              {salaryType === "esi" && (
                                <div className="space-y-3">
                                  <label className="block text-sm font-medium text-slate-700">ESI Cash Amount (₹)</label>
                                  <div className="relative">
                                    <input 
                                      type="number" 
                                      value={esiCashAmount}
                                      onChange={(e) => setEsiCashAmount(Number(e.target.value) || 0)}
                                      className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-purple-50"
                                    />
                                    <span className="absolute right-3 top-3 text-slate-500">₹</span>
                                  </div>
                                  <div className="p-3 bg-purple-100 rounded-lg">
                                    <p className="text-sm text-purple-700">
                                      Remaining Salary: ₹{((grossSalary || (hourlyRate * attendanceStats.totalHours)) - esiTdsAmount - esiCashAmount).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Section>

                    {/* Additional Deductions */}
                    <Section title="Additional Deductions" icon={Wallet}>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Canteen */}
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-slate-700 flex items-center">
                                <Coffee className="h-4 w-4 mr-2" />
                                Canteen Amount (₹)
                              </label>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  value={canteenAmount}
                                  onChange={(e) => setCanteenAmount(Number(e.target.value) || 0)}
                                  className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50"
                                />
                                <span className="absolute right-3 top-3 text-slate-500">₹</span>
                              </div>
                            </div>

                            {/* Advance Amount */}
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-slate-700 flex items-center">
                                <PiggyBank className="h-4 w-4 mr-2" />
                                Advance Amount (₹)
                              </label>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  value={advanceAmount}
                                  onChange={(e) => setAdvanceAmount(Number(e.target.value) || 0)}
                                  className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                                />
                                <span className="absolute right-3 top-3 text-slate-500">₹</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Section>

                    {/* Multiple Fines Section */}
                    <Section title="Fines & Penalties" icon={XCircle}>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
                          {/* Add Fine Button */}
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-slate-700">Fine Details</h3>
                            <Button 
                              onClick={() => {
                                const newFine = {
                                  id: Date.now().toString(),
                                  amount: 0,
                                  reason: "",
                                  description: ""
                                };
                                setFines([...fines, newFine]);
                              }}
                              size="sm" 
                              className="bg-gradient-to-r from-red-500 to-pink-500"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Fine
                            </Button>
                          </div>

                          {/* Fines List */}
                          <div className="space-y-4">
                            {fines.map((fine, index) => (
                              <div key={fine.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₹)</label>
                                    <input 
                                      type="number" 
                                      value={fine.amount}
                                      onChange={(e) => {
                                        const updatedFines = [...fines];
                                        updatedFines[index].amount = Number(e.target.value) || 0;
                                        setFines(updatedFines);
                                      }}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                                    <select 
                                      value={fine.reason}
                                      onChange={(e) => {
                                        const updatedFines = [...fines];
                                        updatedFines[index].reason = e.target.value;
                                        setFines(updatedFines);
                                      }}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                    >
                                      <option value="">Select reason</option>
                                      <option value="late-arrival">Late Arrival</option>
                                      <option value="early-departure">Early Departure</option>
                                      <option value="absence">Unexcused Absence</option>
                                      <option value="misconduct">Misconduct</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                    <input 
                                      type="text" 
                                      value={fine.description}
                                      onChange={(e) => {
                                        const updatedFines = [...fines];
                                        updatedFines[index].description = e.target.value;
                                        setFines(updatedFines);
                                      }}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                      placeholder="Optional description"
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <Button 
                                      onClick={() => {
                                        const updatedFines = fines.filter((_, i) => i !== index);
                                        setFines(updatedFines);
                                      }}
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {fines.length === 0 && (
                              <div className="text-center py-8 text-slate-500">
                                <XCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No fines added yet. Click "Add Fine" to add penalties.</p>
                              </div>
                            )}
                          </div>

                          {/* Total Fines */}
                          {fines.length > 0 && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg border border-red-200">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-700 font-medium">Total Fines:</span>
                                <span className="text-red-700 font-bold text-lg">
                                  ₹{fines.reduce((sum, fine) => sum + fine.amount, 0).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Section>

                    {/* Net Salary Summary */}
                    <Section title="Net Salary Summary" icon={DollarSign}>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Calculation Breakdown */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-slate-700 mb-4">Calculation Breakdown</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                  <span className="text-slate-600">Gross Salary:</span>
                                  <span className="font-semibold text-emerald-600">
                                    ₹{(grossSalary || (hourlyRate * attendanceStats.totalHours)).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                  <span className="text-slate-600">ESI/TDS:</span>
                                  <span className="font-semibold text-red-600">-₹{esiTdsAmount.toLocaleString()}</span>
                                </div>
                                {salaryType === "esi" && (
                                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span className="text-slate-600">ESI Cash:</span>
                                    <span className="font-semibold text-red-600">-₹{esiCashAmount.toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                  <span className="text-slate-600">Canteen:</span>
                                  <span className="font-semibold text-red-600">-₹{canteenAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                  <span className="text-slate-600">Advance:</span>
                                  <span className="font-semibold text-red-600">-₹{advanceAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                  <span className="text-slate-600">Total Fines:</span>
                                  <span className="font-semibold text-red-600">
                                    -₹{fines.reduce((sum, fine) => sum + fine.amount, 0).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Net Salary Display */}
                            <div className="flex flex-col justify-center items-center">
                              <div className="text-center">
                                <h3 className="text-2xl font-bold text-slate-700 mb-4">Net Salary</h3>
                                <div className="p-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl shadow-2xl">
                                  <div className="text-4xl font-bold mb-2">
                                    ₹{(
                                      (grossSalary || (hourlyRate * attendanceStats.totalHours)) - 
                                      esiTdsAmount - 
                                      (salaryType === "esi" ? esiCashAmount : 0) - 
                                      canteenAmount - 
                                      advanceAmount - 
                                      fines.reduce((sum, fine) => sum + fine.amount, 0)
                                    ).toLocaleString()}
                                  </div>
                                  <div className="text-sm opacity-90">Final Amount Payable</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-8 flex justify-end space-x-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setNotification({
                                  show: true,
                                  message: 'Salary sheet recalculated successfully!',
                                  type: 'success'
                                });
                                setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
                              }}
                            >
                              <Calculator className="h-4 w-4 mr-2" />
                              Recalculate
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-green-600">
                              <Save className="h-4 w-4 mr-2" />
                              Save Salary Sheet
                            </Button>
                            <Button size="sm" variant="outline" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Section>
                  </div>
                </TabsContent>

                {/* Contract & Contact Tab */}
                <TabsContent value="contract" className="p-6">
                  <div className="space-y-6">
                    {/* Contract Management Section */}
                    <Section title="Contract Management" icon={Briefcase}>
                      <div className="space-y-6">
                        {/* Add New Contract */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200/50">
                          <h4 className="text-lg font-semibold text-slate-900 mb-4">Add New Contract</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Contract Title</label>
                              <input 
                                type="text" 
                                placeholder="Enter contract title"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Contract Type</label>
                              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Select type</option>
                                <option value="hourly">Hourly Rate</option>
                                <option value="fixed">Fixed Price</option>
                                <option value="milestone">Milestone Based</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Rate/Amount (₹)</label>
                              <input 
                                type="number" 
                                placeholder="Enter rate or amount"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                              <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                              <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                Add Contract
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea 
                              placeholder="Enter contract description and terms"
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Active Contracts */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-slate-900">Active Contracts</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h5 className="font-semibold text-slate-900">Quality Control Audit</h5>
                                  <p className="text-sm text-slate-600">Hourly Rate Contract</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Rate:</span>
                                  <span className="font-medium">₹500/hour</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Duration:</span>
                                  <span className="font-medium">Jan 1 - Mar 31, 2024</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Hours This Month:</span>
                                  <span className="font-medium text-green-700">30 hrs</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Earnings:</span>
                                  <span className="font-semibold text-green-700">₹15,000</span>
                                </div>
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                                <Button size="sm" variant="outline" className="flex-1">View Details</Button>
                              </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h5 className="font-semibold text-slate-900">Process Optimization</h5>
                                  <p className="text-sm text-slate-600">Fixed Price Contract</p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Amount:</span>
                                  <span className="font-medium">₹25,000</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Duration:</span>
                                  <span className="font-medium">Jan 15 - Feb 15, 2024</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Progress:</span>
                                  <span className="font-medium text-blue-700">75%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Paid:</span>
                                  <span className="font-semibold text-blue-700">₹18,750</span>
                                </div>
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                                <Button size="sm" variant="outline" className="flex-1">View Details</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Section>


                    
                    {/* Work History & Project Tracking */}
                    <Section title="Work History & Project Tracking" icon={CalendarIcon}>
                      <div className="space-y-6">
                        {/* Add New Work Entry */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/50">
                          <h4 className="text-md font-semibold text-slate-900 mb-4">Add New Work Entry</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Work Date</label>
                              <input 
                                type="date" 
                                defaultValue="2024-01-15"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Project/Task</label>
                              <input 
                                type="text" 
                                placeholder="Enter project or task name"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                <User className="h-4 w-4 mr-2" />
                                Add Entry
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Monthly Work Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl text-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-green-100 text-sm">This Month</p>
                                <p className="text-2xl font-bold">24</p>
                                <p className="text-green-100 text-sm">Projects Completed</p>
                              </div>
                              <CheckCircle className="h-8 w-8 text-green-200" />
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-xl text-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-blue-100 text-sm">Total Hours</p>
                                <p className="text-2xl font-bold">186</p>
                                <p className="text-blue-100 text-sm">Working Hours</p>
                              </div>
                              <Clock className="h-8 w-8 text-blue-200" />
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl text-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-purple-100 text-sm">Efficiency</p>
                                <p className="text-2xl font-bold">94%</p>
                                <p className="text-purple-100 text-sm">Performance Rate</p>
                              </div>
                              <TrendingUp className="h-8 w-8 text-purple-200" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Work History Timeline */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50">
                          <h4 className="text-lg font-semibold text-slate-900 mb-6">Recent Work History</h4>
                          <div className="space-y-4">
                            {[
                              {
                                date: '2024-01-15',
                                project: 'Quality Control - Paper Grade A Testing',
                                duration: '6 hours',
                                status: 'Completed',
                                priority: 'High',
                                description: 'Conducted comprehensive quality testing for Grade A paper production batch #2401'
                              },
                              {
                                date: '2024-01-14',
                                project: 'Machine Maintenance - Pulp Processing Unit',
                                duration: '4 hours',
                                status: 'Completed',
                                priority: 'Medium',
                                description: 'Routine maintenance and calibration of pulp processing machinery'
                              },
                              {
                                date: '2024-01-13',
                                project: 'Process Optimization - Waste Reduction',
                                duration: '8 hours',
                                status: 'Completed',
                                priority: 'High',
                                description: 'Implemented new waste reduction protocols resulting in 15% efficiency improvement'
                              },
                              {
                                date: '2024-01-12',
                                project: 'Training Session - New Safety Protocols',
                                duration: '3 hours',
                                status: 'Completed',
                                priority: 'Medium',
                                description: 'Conducted safety training for junior staff on updated workplace protocols'
                              },
                              {
                                date: '2024-01-11',
                                project: 'Inventory Management - Raw Materials',
                                duration: '5 hours',
                                status: 'Completed',
                                priority: 'Low',
                                description: 'Updated inventory records and coordinated with suppliers for raw material procurement'
                              },
                              {
                                date: '2024-01-10',
                                project: 'Client Meeting - Product Specifications',
                                duration: '2 hours',
                                status: 'Completed',
                                priority: 'High',
                                description: 'Discussed custom paper specifications with major client for upcoming order'
                              }
                            ].map((work, index) => (
                              <div key={index} className="relative pl-8 pb-4">
                                {/* Timeline line */}
                                {index !== 5 && (
                                  <div className="absolute left-3 top-8 w-0.5 h-full bg-slate-200" />
                                )}
                                
                                {/* Timeline dot */}
                                <div className={`absolute left-1 top-2 w-4 h-4 rounded-full border-2 ${
                                  work.priority === 'High' ? 'bg-red-500 border-red-300' :
                                  work.priority === 'Medium' ? 'bg-yellow-500 border-yellow-300' :
                                  'bg-green-500 border-green-300'
                                }`} />
                                
                                {/* Work entry content */}
                                <div className="bg-slate-50/80 rounded-lg p-4 hover:bg-slate-100/80 transition-colors">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-slate-900">{work.project}</h5>
                                      <p className="text-sm text-slate-600 mt-1">{work.description}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                      <div className="text-sm font-medium text-slate-700">{work.date}</div>
                                      <div className="text-xs text-slate-500">{work.duration}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs ${
                                          work.priority === 'High' ? 'bg-red-100 text-red-800' :
                                          work.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-green-100 text-green-800'
                                        }`}
                                      >
                                        {work.priority} Priority
                                      </Badge>
                                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                        {work.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center text-slate-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span className="text-xs">{work.duration}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Load More Button */}
                          <div className="text-center mt-6">
                            <Button variant="outline" className="text-slate-600 hover:text-slate-900">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              Load More History
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Section>
                    
                    {/* Contract Work Section */}
                    <Section title="Contract Work" desc="Packet/Bundle • Reem Cutting • Folding" icon={Briefcase}>
                      <Tabs defaultValue="packet" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-100/80">
                          <TabsTrigger value="packet" className="flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <span>Packet/Bundle</span>
                          </TabsTrigger>
                          <TabsTrigger value="reem" className="flex items-center space-x-2">
                            <Scissors className="h-4 w-4" />
                            <span>Reem Cutting</span>
                          </TabsTrigger>
                          <TabsTrigger value="fold" className="flex items-center space-x-2">
                            <FoldHorizontal className="h-4 w-4" />
                            <span>Folding</span>
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="packet" className="mt-6">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <Field id="regular_packet" label="Regular Packet Rate" value="₹0.80" />
                             <Field id="deluxe_packet" label="Deluxe Packet Rate" value="₹1.00" />
                             <Field id="bundle_stitch" label="Bundle Stitching Rate" value="₹6.00" />
                           </div>
                         </TabsContent>
                        
                        <TabsContent value="reem" className="mt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field id="rc_date" label="Date" type="date" />
                            <Field id="rc_product" label="Product Name" />
                            <Field id="rc_reem_weight" label="Reem Weight" />
                            <Field id="rc_rate_ton" label="Rate per TON" />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="fold" className="mt-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field id="fd_date" label="Date" type="date" />
                            <Field id="fd_price" label="Price" />
                            <Field id="fd_maths_80c" label="Maths 80C" />
                            <Field id="fd_drawing_c" label="Drawing C" />
                            <Field id="fd_graph_c" label="Graph C" />
                            <Field id="fd_geometry_c" label="Geometry C" />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </Section>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="p-6">
                  <div className="space-y-6">
                    {/* Document Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Identity Documents */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200/50">
                        <div className="flex items-center mb-4">
                          <div className="bg-blue-500 p-2 rounded-lg mr-3">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">Identity Documents</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-slate-700">PAN Card</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                              onClick={() => {
                                // Simulate PDF download
                                const link = document.createElement('a');
                                link.href = '/documents/pan-card-roger-smith.pdf';
                                link.download = 'PAN_Card_Roger_Smith.pdf';
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-slate-700">AADHAR Card</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/documents/aadhar-card-roger-smith.pdf';
                                link.download = 'AADHAR_Card_Roger_Smith.pdf';
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-slate-700">Passport</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/documents/passport-roger-smith.pdf';
                                link.download = 'Passport_Roger_Smith.pdf';
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Banking Documents */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200/50">
                        <div className="flex items-center mb-4">
                          <div className="bg-green-500 p-2 rounded-lg mr-3">
                            <CreditCard className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">Banking Documents</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-slate-700">Bank PassBook</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/documents/bank-passbook-roger-smith.pdf';
                                link.download = 'Bank_PassBook_Roger_Smith.pdf';
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-slate-700">Cancelled Cheque</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/documents/cancelled-cheque-roger-smith.pdf';
                                link.download = 'Cancelled_Cheque_Roger_Smith.pdf';
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-slate-700">Bank Statement</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/documents/bank-statement-roger-smith.pdf';
                                link.download = 'Bank_Statement_Roger_Smith.pdf';
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Employment Documents */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200/50">
                        <div className="flex items-center mb-4">
                          <div className="bg-purple-500 p-2 rounded-lg mr-3">
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">Employment Docs</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-slate-700">Offer Letter</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/documents/offer-letter-roger-smith.pdf';
                                link.download = 'Offer_Letter_Roger_Smith.pdf';
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-slate-700">Experience Letter</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/documents/experience-letter-roger-smith.pdf';
                                link.download = 'Experience_Letter_Roger_Smith.pdf';
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-slate-700">Salary Certificate</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/documents/salary-certificate-roger-smith.pdf';
                                link.download = 'Salary_Certificate_Roger_Smith.pdf';
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Document Management Actions */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">Document Management</h3>
                          <p className="text-sm text-slate-600 mt-1">Upload, manage and organize employee documents</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Upload New
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            onClick={() => {
                              // Download all documents as ZIP
                              const link = document.createElement('a');
                              link.href = '/documents/all-documents-roger-smith.zip';
                              link.download = 'All_Documents_Roger_Smith.zip';
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download All
                          </Button>
                        </div>
                      </div>
                      
                      {/* Document Statistics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-lg text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-blue-100 text-sm">Total Documents</p>
                              <p className="text-2xl font-bold">9</p>
                            </div>
                            <FileText className="h-6 w-6 text-blue-200" />
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-lg text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-green-100 text-sm">Verified</p>
                              <p className="text-2xl font-bold">9</p>
                            </div>
                            <CheckCircle className="h-6 w-6 text-green-200" />
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-lg text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-yellow-100 text-sm">Pending</p>
                              <p className="text-2xl font-bold">0</p>
                            </div>
                            <Clock className="h-6 w-6 text-yellow-200" />
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-purple-100 text-sm">Last Updated</p>
                              <p className="text-sm font-semibold">Jan 15, 2024</p>
                            </div>
                            <CalendarIcon className="h-6 w-6 text-purple-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          )
          }
        </main>
      </div>
      
      {/* Modern Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Mark Attendance</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAttendanceModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Selection with modern cards */}
              <div>
                <Label className="text-sm font-semibold text-slate-800 mb-3 block">
                  Attendance Status
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setModalAttendanceStatus('present')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      modalAttendanceStatus === 'present' 
                        ? 'border-green-500 bg-green-50 shadow-lg scale-105' 
                        : 'border-slate-200 bg-slate-50 hover:border-green-300 hover:bg-green-50/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        modalAttendanceStatus === 'present' ? 'bg-green-500' : 'bg-slate-400'
                      }`}>
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <span className={`font-medium text-sm ${
                        modalAttendanceStatus === 'present' ? 'text-green-700' : 'text-slate-600'
                      }`}>
                        Present
                      </span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setModalAttendanceStatus('absent')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      modalAttendanceStatus === 'absent' 
                        ? 'border-red-500 bg-red-50 shadow-lg scale-105' 
                        : 'border-slate-200 bg-slate-50 hover:border-red-300 hover:bg-red-50/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-full ${
                        modalAttendanceStatus === 'absent' ? 'bg-red-500' : 'bg-slate-400'
                      }`}>
                        <XCircle className="h-5 w-5 text-white" />
                      </div>
                      <span className={`font-medium text-sm ${
                        modalAttendanceStatus === 'absent' ? 'text-red-700' : 'text-slate-600'
                      }`}>
                        Absent
                      </span>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Working Hours Input with modern styling */}
              {modalAttendanceStatus === 'present' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="working-hours" className="text-sm font-semibold text-slate-800 mb-3 block">
                    Working Hours
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="working-hours"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={modalWorkingHours}
                      onChange={(e) => setModalWorkingHours(parseFloat(e.target.value) || 0)}
                      placeholder="8.0"
                      className="pl-10 h-12 text-lg font-medium border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                      hours
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Standard working hours: 8.0 hours per day
                  </p>
                </div>
              )}
              
              {/* Action Buttons with modern styling */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAttendanceModal(false)}
                  className="flex-1 h-12 rounded-xl border-2 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Save attendance data and update hours tracking with localStorage
                    if (selectedDate) {
                      const dateKey = selectedDate.toISOString().split('T')[0];
                      const newAttendanceHours = { ...attendanceHours };
                      
                      if (modalAttendanceStatus === 'present') {
                        newAttendanceHours[dateKey] = modalWorkingHours;
                      } else {
                        delete newAttendanceHours[dateKey];
                      }
                      
                      setAttendanceHours(newAttendanceHours);
                      
                      // Update attendance status
                      const newAttendance = { ...attendance };
                      newAttendance[dateKey] = modalAttendanceStatus === 'present' ? 'P' : 'A';
                      setAttendance(newAttendance);
                      
                      // Save to localStorage for persistence
                      localStorage.setItem('attendanceHours', JSON.stringify(newAttendanceHours));
                      localStorage.setItem('attendance', JSON.stringify(newAttendance));
                      
                      // Show success notification
                      setNotification({
                        show: true,
                        message: `Attendance ${modalAttendanceStatus === 'present' ? 'marked as Present' : 'marked as Absent'} for ${selectedDate.toLocaleDateString()}`,
                        type: 'success'
                      });
                      
                      // Auto-hide notification after 3 seconds
                      setTimeout(() => {
                        setNotification(prev => ({ ...prev, show: false }));
                      }, 3000);
                    }
                    setShowAttendanceModal(false);
                  }}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Attendance
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Success/Error Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`p-4 rounded-xl shadow-lg border-l-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex items-center space-x-3">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className="font-medium text-sm">{notification.message}</p>
              <button
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className="ml-auto text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}