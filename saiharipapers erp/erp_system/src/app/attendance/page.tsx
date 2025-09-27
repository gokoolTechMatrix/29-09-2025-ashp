'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false });
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });

const AttendancePage = () => {
  // Mock data for Attendance Overview Graph
  const attendanceOverviewData = [
    { name: 'Mon', punches: 12 },
    { name: 'Tue', punches: 19 },
    { name: 'Wed', punches: 3 },
    { name: 'Thu', punches: 5 },
    { name: 'Fri', punches: 2 },
    { name: 'Sat', punches: 3 },
    { name: 'Sun', punches: 7 },
  ];

  // Mock data for Punch Type Distribution Graph
  const punchTypeData = [
    { name: 'IN', count: 70 },
    { name: 'OUT', count: 50 },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4">Attendance Dashboard</h1>

        {/* Visuals and Graphs Section */}
        <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 transform transition duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Attendance Overview (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceOverviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px' }} labelStyle={{ color: '#333' }} itemStyle={{ color: '#333' }} />
                <Legend />
                <Line type="monotone" dataKey="punches" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 transform transition duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Punch Type Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={punchTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px' }} labelStyle={{ color: '#333' }} itemStyle={{ color: '#333' }} />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Punch Records Section */}
        <div className="mb-10 bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">All Punch Records</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Employee ID</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Mock Data for All Punch Records */}
                {[...Array(10)].map((_, index) => {
                  const type = index % 2 === 0 ? 'IN' : 'OUT';
                  const typeColorClass = type === 'IN' ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">punch_1756372468583_{index + 221}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{Math.floor(Math.random() * 10) + 1}</td>
                      <td className={`py-3 px-4 whitespace-nowrap text-sm ${typeColorClass}`}>{type}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">8/28/2025, {Math.floor(Math.random() * 12) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')} {Math.random() > 0.5 ? 'AM' : 'PM'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Dashboard Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Record Attendance Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transform transition duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Record Attendance</h2>
            <div className="flex flex-col space-y-4">
              <label className="inline-flex items-center text-gray-700">
                <input type="radio" className="form-radio text-indigo-600 h-5 w-5" name="attendance" value="clock-in" />
                <span className="ml-3 text-lg">Clock In</span>
              </label>
              <label className="inline-flex items-center text-gray-700">
                <input type="radio" className="form-radio text-indigo-600 h-5 w-5" name="attendance" value="clock-out" />
                <span className="ml-3 text-lg">Clock Out</span>
              </label>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1">Submit Punch</button>
            </div>
          </div>

          {/* Hours Worked by Employee */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transform transition duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Hours Worked by Employee</h2>
            <ul className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <li key={index} className="flex justify-between items-center text-gray-700 border-b border-gray-100 pb-2 last:border-b-0">
                  <span className="font-medium">Employee {index + 1}</span>
                  <span className="text-indigo-600 font-semibold">{(Math.random() * 8 + 4).toFixed(2)} hours</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Punches */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transform transition duration-300 hover:scale-105 col-span-1 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Punches</h2>
            <ul className="space-y-2">
              {[...Array(5)].map((_, index) => {
                const type = index % 2 === 0 ? 'IN' : 'OUT';
                const typeBgClass = type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                return (
                  <li key={index} className="flex justify-between items-center text-gray-700 border-b border-gray-100 pb-2 last:border-b-0">
                    <span className="font-medium">Employee {index + 1}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeBgClass}`}>
                      {type}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;