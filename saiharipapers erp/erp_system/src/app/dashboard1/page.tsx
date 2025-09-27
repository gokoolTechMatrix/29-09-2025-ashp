"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Settings,
  LogOut,
  Home,
  FileText,
  UserCheck
} from "lucide-react";
import Link from "next/link";

export default function Dashboard1() {
  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard1", active: true },
    { icon: Users, label: "Employees", href: "/employee-details" },
    { icon: UserCheck, label: "Attendance", href: "/attendance" },
    { icon: Package, label: "Inventory", href: "/inventory" },
    { icon: DollarSign, label: "Finance", href: "/finance" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const stats = [
    {
      title: "Total Employees",
      value: "142",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "blue"
    },
    {
      title: "Monthly Revenue",
      value: "₹8,45,230",
      change: "+18%",
      changeType: "positive",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Active Projects",
      value: "24",
      change: "+3",
      changeType: "positive",
      icon: Activity,
      color: "blue"
    },
    {
      title: "Pending Orders",
      value: "18",
      change: "-5%",
      changeType: "negative",
      icon: Clock,
      color: "red"
    }
  ];

  const recentActivities = [
    { id: 1, action: "New employee onboarded", user: "HR Team", time: "2 hours ago", type: "success" },
    { id: 2, action: "Inventory updated", user: "Warehouse Manager", time: "4 hours ago", type: "info" },
    { id: 3, action: "Payment received", user: "Finance Team", time: "6 hours ago", type: "success" },
    { id: 4, action: "Low stock alert", user: "System", time: "8 hours ago", type: "warning" },
    { id: 5, action: "Report generated", user: "Admin", time: "1 day ago", type: "info" }
  ];

  const departmentStats = [
    { name: "Production", employees: 45, efficiency: 92, color: "bg-blue-500" },
    { name: "Sales", employees: 28, efficiency: 88, color: "bg-green-500" },
    { name: "HR", employees: 12, efficiency: 95, color: "bg-purple-500" },
    { name: "Finance", employees: 15, efficiency: 90, color: "bg-orange-500" },
    { name: "IT", employees: 8, efficiency: 96, color: "bg-cyan-500" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">ERP System</h1>
          <p className="text-sm text-gray-500 mt-1">Management Portal</p>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} href={item.href}>
                <div className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  item.active 
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@company.com</p>
            </div>
          </div>
          <button className="flex items-center mt-4 text-sm text-gray-600 hover:text-gray-900">
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Today</p>
                <p className="text-xs text-gray-500">January 9, 2025</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className={`text-sm mt-2 flex items-center ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          <TrendingUp className={`w-4 h-4 mr-1 ${
                            stat.changeType === 'negative' ? 'rotate-180' : ''
                          }`} />
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        stat.color === 'blue' ? 'bg-blue-100' :
                        stat.color === 'green' ? 'bg-green-100' :
                        stat.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'red' ? 'text-red-600' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department Performance */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Department Performance</CardTitle>
                  <CardDescription className="text-gray-600">Employee count and efficiency by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentStats.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${dept.color} mr-3`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{dept.name}</p>
                            <p className="text-sm text-gray-600">{dept.employees} employees</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{dept.efficiency}%</p>
                          <p className="text-sm text-gray-600">Efficiency</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div>
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Activities</CardTitle>
                  <CardDescription className="text-gray-600">Latest system activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.user}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">Frequently used actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                    <Users className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-blue-900">Add Employee</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                    <Package className="w-8 h-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-green-900">Update Inventory</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                    <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-purple-900">Generate Report</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
                    <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-orange-900">Schedule Meeting</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}