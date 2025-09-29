"use client";
import React, { useState } from "react";
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
  X
} from "lucide-react";

export default function FactoryDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", active: true, href: "/factory-dashboard" },
    { icon: Users, label: "Attendance , Staff and Payroll management", active: false, href: "/staff-vendor-management" },
    { icon: Factory, label: "Production", active: false, submenu: ["Work Order", "Machine"], href: "#" },
    { icon: Package, label: "Inventory", active: false, href: "#" },
    { icon: ShoppingCart, label: "Sales", active: false, href: "#" },
    { icon: DollarSign, label: "Finance", active: false, href: "#" },
    { icon: FileText, label: "Report", active: false, href: "#" },
  ];



  const recentAlerts = [
    { type: "warning", message: "Machine #7 requires maintenance", time: "5 min ago", priority: "high" },
    { type: "info", message: "Shift change completed successfully", time: "15 min ago", priority: "low" },
    { type: "error", message: "Quality check failed on Batch #A247", time: "32 min ago", priority: "critical" },
    { type: "success", message: "Production target achieved", time: "1 hour ago", priority: "medium" },
  ];



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
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Real-time production monitoring</p>
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
            {/* Workforce & HR Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 mb-1">245</p>
                    <p className="text-sm text-slate-500">Active</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mt-2">Workforce & HR</p>
                  <div className="space-y-2 mt-3">
                     <div className="flex justify-between text-xs text-slate-600">
                       <span>Present Today</span>
                       <span>245 Total Employees</span>
                     </div>
                     <div className="flex justify-between text-xs text-slate-600">
                       <span>Shift Allocation</span>
                       <span>180 Contract Employees</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Sales & Order Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 mb-1">₹2.4M</p>
                    <p className="text-sm text-slate-500">This Month</p>
                  </div>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent backdrop-blur-sm rounded-lg z-10 border border-white/30"></div>
                   <p className="text-xs text-slate-400 mt-2 relative z-20">Sales & Orders</p>
                   <div className="space-y-2 mt-3 relative z-20">
                     <div className="flex justify-between text-xs text-slate-600">
                       <span>Today's Orders</span>
                       <span>₹2.4M</span>
                     </div>
                     <div className="flex justify-between text-xs text-slate-600">
                       <span>Pending Orders</span>
                       <span>45</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Production & Operation Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-purple-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                    <Factory className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 mb-1">8,450</p>
                    <p className="text-sm text-slate-500">Tons/Day</p>
                  </div>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent backdrop-blur-sm rounded-lg z-10 border border-white/30"></div>
                   <p className="text-xs text-slate-400 mt-2 relative z-20">Production & Operation</p>
                   <div className="space-y-2 mt-3 relative z-20">
                     <div className="flex justify-between text-xs text-slate-600">
                       <span>Daily Output</span>
                       <span>850 tons</span>
                     </div>
                     <div className="flex justify-between text-xs text-slate-600">
                       <span>Efficiency</span>
                       <span>94.2%</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Financial Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-orange-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 mb-1">₹15.2M</p>
                    <p className="text-sm text-slate-500">Revenue</p>
                  </div>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent backdrop-blur-sm rounded-lg z-10 border border-white/30"></div>
                   <p className="text-xs text-slate-400 mt-2 relative z-20">Financial</p>
                   <div className="space-y-2 mt-3 relative z-20">
                     <div className="flex justify-between text-xs text-slate-600">
                       <span>Monthly Revenue</span>
                       <span>₹45.2M</span>
                     </div>
                     <div className="flex justify-between text-xs text-slate-600">
                       <span>Profit Margin</span>
                       <span>18.5%</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Paper Mill Specific Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Paper Quality Metrics */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300">
                <div className="relative">
                   <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-lg z-10"></div>
                   <div className="blur-sm">
                     <div className="flex items-center justify-between mb-4">
                       <div className="p-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 shadow-lg">
                         <FileText className="h-6 w-6 text-white" />
                       </div>
                       <div className="text-right">
                         <p className="text-2xl font-bold text-slate-900">98.5%</p>
                         <p className="text-sm text-slate-500">Quality Rate</p>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-600">GSM Consistency</span>
                         <span className="text-green-600 font-medium">±2%</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-600">Moisture Content</span>
                         <span className="text-blue-600 font-medium">7.2%</span>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Environmental Monitoring */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300">
                <div className="relative">
                   <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-lg z-10"></div>
                   <div className="blur-sm">
                     <div className="flex items-center justify-between mb-4">
                       <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                         <Activity className="h-6 w-6 text-white" />
                       </div>
                       <div className="text-right">
                         <p className="text-2xl font-bold text-slate-900">Normal</p>
                         <p className="text-sm text-slate-500">Environment</p>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-600">Water Usage</span>
                         <span className="text-blue-600 font-medium">2.1M L/day</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-600">Energy Efficiency</span>
                         <span className="text-green-600 font-medium">92%</span>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300">
                <div className="relative">
                   <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-lg z-10"></div>
                   <div className="blur-sm">
                     <div className="flex items-center justify-between mb-4">
                       <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 shadow-lg">
                         <Bell className="h-6 w-6 text-white" />
                       </div>
                       <div className="text-right">
                         <p className="text-2xl font-bold text-slate-900">3</p>
                         <p className="text-sm text-slate-500">Active Alerts</p>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-600">High Priority</span>
                         <span className="text-red-600 font-medium">1</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-slate-600">Medium Priority</span>
                         <span className="text-orange-600 font-medium">2</span>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Detailed Alerts Section */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-75" />
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Recent Alerts</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => {
                  const alertColors: Record<string, string> = {
                    error: 'text-red-600 bg-red-100',
                    warning: 'text-orange-600 bg-orange-100',
                    info: 'text-blue-600 bg-blue-100',
                    success: 'text-green-600 bg-green-100'
                  };
                  
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                      <div className={`p-2 rounded-lg ${alertColors[alert.type]}`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.priority === 'critical' ? 'bg-red-100 text-red-600' :
                        alert.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Production Line Status */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-2xl blur opacity-75" />
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Work Allocation for Machine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Paper Machine #1", status: "Running", efficiency: "94%", color: "green" },
                  { name: "Paper Machine #2", status: "Running", efficiency: "87%", color: "green" },
                  { name: "Paper Machine #3", status: "Maintenance", efficiency: "0%", color: "orange" },
                  { name: "Coating Line", status: "Running", efficiency: "91%", color: "green" },
                ].map((machine, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{machine.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${
                        machine.color === 'green' ? 'bg-green-500' : 
                        machine.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{machine.status}</p>
                    <p className="text-xs text-slate-500">Efficiency: {machine.efficiency}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur opacity-75" />
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { icon: Factory, label: "Start Production", color: "blue" },
                  { icon: Wrench, label: "Schedule Maintenance", color: "orange" },
                  { icon: FileText, label: "Generate Report", color: "green" },
                  { icon: Users, label: "Manage Shifts", color: "purple" },
                  { icon: Package, label: "Check Inventory", color: "indigo" },
                  { icon: Shield, label: "Quality Audit", color: "red" },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button key={index} className="flex flex-col items-center p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 hover:scale-105 transition-all duration-200 group">
                      <div className={`p-3 rounded-xl bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 shadow-lg shadow-${action.color}-500/25 group-hover:shadow-xl group-hover:shadow-${action.color}-500/40 transition-all duration-200`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 mt-2 text-center">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}