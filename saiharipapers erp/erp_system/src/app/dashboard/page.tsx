import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users2, Wallet, CalendarDays, Package, HandCoins, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { differenceInDays } from "date-fns";

export default function DashboardPage() {
  const insuranceDueDate = new Date("2025-10-06");
  const today = new Date();
  const daysUntilInsuranceDue = differenceInDays(insuranceDueDate, today);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-[1400px] p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-slate-600 text-lg">Access key features of your ERP system</p>
        </div>

        {/* Tabs section */}
        <div className="mt-8 mb-12">
          <Tabs defaultValue="insurance-due">
            <TabsList className="bg-white/60 backdrop-blur-md border border-white/20 shadow-lg">
              <TabsTrigger value="attendance" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">Attendance Percentage</TabsTrigger>
              <TabsTrigger value="low-stock" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">Low Stock Alert</TabsTrigger>
              <TabsTrigger value="insurance-due" className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md">Insurance Due</TabsTrigger>
            </TabsList>
            <TabsContent value="attendance">
              <Card className="mt-4 p-6 bg-white/70 backdrop-blur-md border border-white/30 shadow-xl">
                <CardTitle className="text-slate-800">Attendance Percentage</CardTitle>
                <CardDescription className="mt-2 text-slate-600">Overall attendance for all employees: 92.5%</CardDescription>
              </Card>
            </TabsContent>
            <TabsContent value="low-stock">
              <Card className="mt-4 p-6 bg-white/70 backdrop-blur-md border border-white/30 shadow-xl">
                <CardTitle className="text-slate-800">Low Stock Alert</CardTitle>
                <CardDescription className="mt-2 text-slate-600">Paper Bundle: Only 10 units remaining. Please reorder soon!</CardDescription>
              </Card>
            </TabsContent>
            <TabsContent value="insurance-due">
              <Card className="mt-4 p-6 bg-white/70 backdrop-blur-md border border-white/30 shadow-xl">
                <CardTitle className="text-slate-800">Insurance Due</CardTitle>
                <CardDescription className="mt-2 text-slate-600">
                  LIC Insurance PLTD: ₹5,000 due on 25th October 2024
                  {daysUntilInsuranceDue > 0 && (
                    <span className="ml-2 text-orange-500">({daysUntilInsuranceDue} days remaining)</span>
                  )}
                  {daysUntilInsuranceDue <= 0 && (
                    <span className="ml-2 text-red-500">(Due today or overdue)</span>
                  )}
                </CardDescription>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions modules */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/attendance">
            <Card className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 shadow-lg">
                  <CalendarDays className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardTitle className="text-slate-800 text-xl font-semibold mb-2">Attendance & Leave</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">Track employee attendance and manage leaves efficiently</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/employee-details">
            <Card className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 shadow-lg">
                  <Users2 className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardTitle className="text-slate-800 text-xl font-semibold mb-2">Employee Management</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">Manage 40 employee profiles and details</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Card className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3 shadow-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardTitle className="text-slate-800 text-xl font-semibold mb-2">Payroll Processing</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">Process monthly payroll seamlessly</CardDescription>
            </CardContent>
          </Card>

          <Link href="/inventory">
            <Card className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3 shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardTitle className="text-slate-800 text-xl font-semibold mb-2">Inventory Management</CardTitle>
                <CardDescription className="text-slate-600 leading-relaxed">Oversee 500+ product SKUs</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Card className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mb-3 shadow-lg">
                <HandCoins className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10"> this 
              <CardTitle className="text-slate-800 text-xl font-semibold mb-2">Financial Accounting</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">Manage invoices, expenses, and ledgers</CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-3 shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardTitle className="text-slate-800 text-xl font-semibold mb-2">Reports & Analytics</CardTitle>
              <CardDescription className="text-slate-600 leading-relaxed">Generate detailed business reports</CardDescription>
            </CardContent>
          </Card>
        </div>
       </div>
     </div>
   );
 }