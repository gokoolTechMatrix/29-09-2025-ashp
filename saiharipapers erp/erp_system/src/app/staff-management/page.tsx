"use client";
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { getUsersWithDepartments } from "@/lib/supabase";
import { 
  BarChart3,
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Bell, 
  Search,
  Factory,
  Zap,
  Clock,
  DollarSign,
  ShoppingCart,
  Truck,
  Activity,
  Calendar,
  FileText,
  Target,
  Wrench,
  Shield,
  ChevronRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Plus,
  Filter
} from "lucide-react";

// Dynamic imports for charts
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const RechartsBarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
// const RechartsLegend = dynamic(() => import('recharts').then((mod) => ({ default: mod.Legend })), { ssr: false });
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const RechartsPieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });

export default function StaffManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEmployeeClick = (employeeId: string) => {
    router.push(`/employee-details?id=${employeeId}`);
  };

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", active: false, href: "/factory-dashboard" },
    { icon: Users, label: "Staff Management", active: true, href: "/staff-management" },
    { icon: Factory, label: "Production", active: false, submenu: ["Work Order", "Machine"], href: "#" },
    { icon: Package, label: "Inventory", active: false, href: "#" },
    { icon: ShoppingCart, label: "Sales", active: false, href: "#" },
    { icon: DollarSign, label: "Finance", active: false, href: "#" },
    { icon: FileText, label: "Report", active: false, href: "#" },
  ];

  // Load employees from database
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const employeeData = await getUsersWithDepartments();
        
        // Transform the data to match the expected format
        const transformedEmployees = employeeData.map((user: any) => ({
          id: user.id,
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          position: user.employee_details?.[0]?.positions?.title || 'N/A',
          department: user.employee_details?.[0]?.departments?.name || 'N/A',
          email: user.email,
          phone: user.phone || 'N/A',
          joinDate: user.employee_details?.[0]?.join_date || 'N/A',
          avatar: user.avatar_url || "/api/placeholder/40/40",
          status: user.status || 'Active',
          performance: user.employee_details?.[0]?.performance_rating || 85
        }));
        
        setEmployees(transformedEmployees);
      } catch (error) {
        console.error('Error loading employees:', error);
        // Fallback to empty array on error
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const departments = ["All", "Production", "Quality", "Operations", "Human Resources", "Maintenance", "Sales"];

  // Chart data
  const departmentData = [
    { name: 'Production', count: 15, fill: '#3B82F6' },
    { name: 'Quality', count: 8, fill: '#10B981' },
    { name: 'Operations', count: 12, fill: '#F59E0B' },
    { name: 'HR', count: 5, fill: '#EF4444' },
    { name: 'Maintenance', count: 7, fill: '#8B5CF6' },
    { name: 'Sales', count: 10, fill: '#06B6D4' }
  ];

  const attendanceData = [
    { name: 'Mon', present: 52, absent: 5 },
    { name: 'Tue', present: 48, absent: 9 },
    { name: 'Wed', present: 55, absent: 2 },
    { name: 'Thu', present: 51, absent: 6 },
    { name: 'Fri', present: 49, absent: 8 },
    { name: 'Sat', present: 45, absent: 12 },
    { name: 'Sun', present: 30, absent: 27 }
  ];

  const performanceData = [
    { name: 'Jan', performance: 85 },
    { name: 'Feb', performance: 88 },
    { name: 'Mar', performance: 92 },
    { name: 'Apr', performance: 89 },
    { name: 'May', performance: 94 },
    { name: 'Jun', performance: 91 }
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "All" || employee.department === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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
                <p className="text-xs text-slate-500">Staff Management</p>
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
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
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
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
                <p className="text-sm text-slate-500">Manage your workforce efficiently</p>
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

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Employees Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-br from-blue-50/80 to-indigo-100/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
                    <p className="text-sm text-slate-600">Total Staff</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+12% from last month</span>
                </div>
              </div>
            </div>

            {/* Active Today Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-br from-green-50/80 to-emerald-100/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{employees.filter(e => e.status === 'Active').length}</p>
                    <p className="text-sm text-slate-600">Active Today</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">98% attendance rate</span>
                </div>
              </div>
            </div>

            {/* Departments Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-br from-orange-50/80 to-amber-100/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Briefcase className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{departments.length - 1}</p>
                    <p className="text-sm text-slate-600">Departments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600 font-medium">All operational</span>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-violet-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-br from-purple-50/80 to-violet-100/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">91%</p>
                    <p className="text-sm text-slate-600">Avg Performance</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-purple-600 font-medium">Excellent rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department Distribution Chart */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/80 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Department Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                   <RechartsPieChart>
                     <Pie
                       data={departmentData}
                       cx="50%"
                       cy="50%"
                       innerRadius={40}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="count"
                     >
                       {departmentData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                     </Pie>
                     <Tooltip />
                   </RechartsPieChart>
                 </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Attendance Chart */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/80 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Attendance</h3>
                <ResponsiveContainer width="100%" height={250}>
                   <RechartsBarChart data={attendanceData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                     <XAxis dataKey="name" stroke="#555" />
                     <YAxis stroke="#555" />
                     <Tooltip 
                       cursor={{ strokeDasharray: '3 3' }} 
                       contentStyle={{ 
                         backgroundColor: '#fff', 
                         border: '1px solid #ccc', 
                         borderRadius: '8px',
                         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                       }} 
                     />
                     <Bar dataKey="present" fill="#10B981" name="Present" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="absent" fill="#EF4444" name="Absent" radius={[4, 4, 0, 0]} />
                   </RechartsBarChart>
                 </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Trend Chart */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/10 to-violet-400/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/80 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#555" />
                    <YAxis stroke="#555" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ccc', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400/10 to-gray-400/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-white/80 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 w-80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="appearance-none bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
                  </div>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5">
                  <Plus className="h-4 w-4" />
                  <span>Add Employee</span>
                </button>
              </div>

              {/* Employee Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg animate-pulse">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                          <div>
                            <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-32"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="group relative cursor-pointer" onClick={() => handleEmployeeClick(employee.id)}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                    <div className="relative bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                            {employee.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{employee.name}</h4>
                            <p className="text-sm text-slate-600">{employee.position}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Briefcase className="h-4 w-4 text-slate-400" />
                          <span>{employee.department}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{employee.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>Joined {employee.joinDate}</span>
                        </div>
                        
                        {/* Performance Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">Performance</span>
                            <span className="text-xs font-medium text-slate-900">{employee.performance}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${employee.performance}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {employee.status}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button 
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEmployeeClick(employee.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}