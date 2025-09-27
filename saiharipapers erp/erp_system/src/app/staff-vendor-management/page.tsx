"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  PieChart,
  Target,
  Wrench,
  Shield,
  ChevronRight,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  UserPlus,
  Building2,
  CheckCircle,
  Star,
  MoreHorizontal,
  Briefcase,
  Mail,
  Phone
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getUsersWithDepartments, getDepartmentCount, User } from "@/lib/supabase";

interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  joinDate: string;
  status: string;
  performance: number;
}

export default function StaffVendorManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("staff");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch staff data from Supabase
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        
        // Fetch users with departments
        const users = await getUsersWithDepartments();
        
        // Fetch department count
        const deptCount = await getDepartmentCount();
        setDepartmentCount(deptCount);
        
        // Transform data to match component interface
        const transformedStaff: StaffMember[] = users.map((user: any) => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          position: user.employee_details?.[0]?.positions?.title || 'Not Assigned',
          department: user.employee_details?.[0]?.departments?.name || 'Unassigned',
          email: user.email,
          phone: user.phone || '',
          joinDate: user.employee_details?.[0]?.join_date ? 
            new Date(user.employee_details[0].join_date).toLocaleDateString('en-GB') : 
            new Date(user.created_at).toLocaleDateString('en-GB'),
          status: user.status === 'active' ? 'Active' : 'Inactive',
          performance: user.employee_details?.[0]?.performance_rating || Math.floor(Math.random() * 20) + 80
        }));
        
        setStaffMembers(transformedStaff);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        // Fallback to empty array if error
        setStaffMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const handleEmployeeClick = (employeeId: string) => {
    router.push(`/employee-details?id=${employeeId}`);
  };

  const handleVendorClick = (vendorId: string) => {
    router.push(`/vendor-details/${vendorId}`);
  };

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", active: false, href: "/factory-dashboard" },
    { icon: Users, label: "Staff & Vendor Management", active: true, href: "/staff-vendor-management" },
    { icon: Factory, label: "Production", active: false, submenu: ["Work Order", "Machine"], href: "#" },
    { icon: Package, label: "Inventory", active: false, href: "#" },
    { icon: ShoppingCart, label: "Sales", active: false, href: "#" },
    { icon: DollarSign, label: "Finance", active: false, href: "#" },
    { icon: FileText, label: "Report", active: false, href: "#" },
  ];

  const vendors = [
    {
      id: 1,
      name: "Paper Supply Co.",
      category: "Raw Materials",
      contact: "Ramesh Gupta",
      email: "ramesh@papersupply.com",
      phone: "+91 98765 12345",
      address: "Mumbai, Maharashtra",
      status: "Active",
      rating: 4.8,
      totalOrders: 156,
      lastOrder: "2024-01-15"
    },
    {
      id: 2,
      name: "Chemical Industries Ltd.",
      category: "Chemicals",
      contact: "Suresh Patel",
      email: "suresh@chemind.com",
      phone: "+91 87654 23456",
      address: "Ahmedabad, Gujarat",
      status: "Active",
      rating: 4.5,
      totalOrders: 89,
      lastOrder: "2024-01-12"
    },
    {
      id: 3,
      name: "Machinery Solutions",
      category: "Equipment",
      contact: "Vikram Singh",
      email: "vikram@machsol.com",
      phone: "+91 76543 34567",
      address: "Delhi, NCR",
      status: "Active",
      rating: 4.7,
      totalOrders: 23,
      lastOrder: "2024-01-10"
    },
    {
      id: 4,
      name: "Transport Services",
      category: "Logistics",
      contact: "Anil Kumar",
      email: "anil@transport.com",
      phone: "+91 65432 45678",
      address: "Bangalore, Karnataka",
      status: "Inactive",
      rating: 4.2,
      totalOrders: 67,
      lastOrder: "2023-12-28"
    }
  ];

  // Get unique departments from staffMembers data
  const departments = ["All", ...Array.from(new Set(staffMembers.map(member => member.department)))];
  const vendorCategories = ["All", "Raw Materials", "Chemicals", "Equipment", "Logistics", "Services"];

  const filteredEmployees = staffMembers.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === "All" || employee.department === selectedFilter)
  );

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === "All" || vendor.category === selectedFilter)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SaihariPapers</h1>
                <p className="text-xs text-slate-400">Factory Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${item.active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {item.label}
                {item.active && <ChevronRight className="ml-auto h-4 w-4" />}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border-b border-white/20 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Staff & Vendor Management</h1>
                  <p className="text-slate-600">Manage your workforce and vendor relationships</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    HC
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-900">Hari Chandran</p>
                    <p className="text-xs text-slate-600">Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-1 shadow-lg">
              <TabsTrigger 
                value="staff" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 rounded-lg transition-all duration-200"
              >
                <Users className="h-4 w-4 mr-2" />
                Staff Management
              </TabsTrigger>
              <TabsTrigger 
                value="vendor"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 rounded-lg transition-all duration-200"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Vendor Management
              </TabsTrigger>
            </TabsList>

            {/* Staff Management Tab */}
            <TabsContent value="staff" className="space-y-6">
              {/* Staff Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Staff Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                  <div className="relative bg-gradient-to-br from-blue-50/80 to-indigo-100/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{loading ? '...' : staffMembers.length}</p>
                        <p className="text-sm text-slate-600">Total Staff</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">+12% from last month</span>
                    </div>
                  </div>
                </div>

                {/* Department Count Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                  <div className="relative bg-gradient-to-br from-green-50/80 to-emerald-100/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        <Building2 className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{loading ? '...' : departmentCount}</p>
                        <p className="text-sm text-slate-600">Departments</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Active departments</span>
                    </div>
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

                  {/* Loading State */}
                  {loading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-slate-600">Loading staff data...</span>
                    </div>
                  )}

                  {/* Employee Grid */}
                  {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEmployees.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600">No staff members found</p>
                          <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
                        </div>
                      ) : (
                        filteredEmployees.map((employee) => (
                          <div key={employee.id} className="group relative cursor-pointer" onClick={() => handleEmployeeClick(employee.id)}>
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                            <div className="relative bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                    {employee.name.split(' ').map(n => n[0]).join('')}
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
                                {employee.phone && (
                                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span>{employee.phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                  <Calendar className="h-4 w-4 text-slate-400" />
                                  <span>Joined {employee.joinDate}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  employee.status === 'Active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
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
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Vendor Management Tab */}
            <TabsContent value="vendor" className="space-y-6">
              {/* Vendor Stats Card - Only Total Vendors */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Vendors Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-violet-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                  <div className="relative bg-gradient-to-br from-purple-50/80 to-violet-100/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Building2 className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{vendors.length}</p>
                        <p className="text-sm text-slate-600">Total Vendors</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">+8% from last month</span>
                    </div>
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
                           placeholder="Search vendors..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-10 pr-4 py-3 w-80 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                         />
                       </div>
                       <div className="relative">
                         <select
                           value={selectedFilter}
                           onChange={(e) => setSelectedFilter(e.target.value)}
                           className="appearance-none bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                         >
                           {vendorCategories.map(category => (
                             <option key={category} value={category}>{category}</option>
                           ))}
                         </select>
                        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transform hover:-translate-y-0.5">
                      <Plus className="h-4 w-4" />
                      <span>Add Vendor</span>
                    </button>
                  </div>

                  {/* Vendor Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVendors.map((vendor) => (
                      <div key={vendor.id} className="group relative cursor-pointer" onClick={() => handleVendorClick(vendor.id.toString())}>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-violet-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                        <div className="relative bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                {vendor.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900">{vendor.name}</h4>
                                <p className="text-sm text-slate-600">{vendor.category}</p>
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
                              <Package className="h-4 w-4 text-slate-400" />
                              <span>{vendor.category}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <Mail className="h-4 w-4 text-slate-400" />
                              <span className="truncate">{vendor.contact}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <ShoppingCart className="h-4 w-4 text-slate-400" />
                              <span>{vendor.totalOrders} orders</span>
                            </div>
                            
                            {/* Rating Display */}
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-slate-700">{vendor.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 
                              vendor.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {vendor.status}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 transform hover:scale-110">
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
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}