// Enhanced Salary Tab Component for Employee Details
// This replaces the existing salary tab with dynamic fields based on calculation method

{/* Enhanced Salary Tab - Production Ready */}
<TabsContent value="salary" className="p-6">
  <div className="space-y-8">
    {/* Salary Configuration Header */}
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Salary Structure Configuration
      </h2>
      <p className="text-slate-600 mt-2">Configure comprehensive salary calculation method and components</p>
    </div>

    {/* Calculation Method Selection */}
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
      <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-6 flex items-center">
          <Calculator className="h-6 w-6 mr-3 text-purple-600" />
          Salary Calculation Method
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { value: 'monthly', label: 'Monthly Salary', icon: '📅', desc: 'Fixed monthly amount with allowances' },
            { value: 'hourly', label: 'Hourly Rate', icon: '⏰', desc: 'Pay per hour with overtime support' },
            { value: 'daily', label: 'Daily Rate', icon: '📊', desc: 'Pay per working day' },
            { value: 'project', label: 'Project Based', icon: '🎯', desc: 'Fixed amount per project' }
          ].map((method) => (
            <div
              key={method.value}
              onClick={() => setCalculationMethod(method.value as any)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                calculationMethod === method.value
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="font-semibold text-slate-700">{method.label}</div>
                <div className="text-xs text-slate-500 mt-1">{method.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Dynamic Salary Fields Based on Calculation Method */}
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
                value={salaryStructure?.basic_salary || 0}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, basic_salary: Number(e.target.value) }))}
                className="text-lg font-semibold"
                placeholder="Enter basic salary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standard_working_days">Working Days per Month</Label>
              <Input
                id="standard_working_days"
                type="number"
                value={salaryStructure?.standard_working_days_per_month || 26}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, standard_working_days_per_month: Number(e.target.value) }))}
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
                value={salaryStructure?.hourly_rate || 0}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, hourly_rate: Number(e.target.value) }))}
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
                value={salaryStructure?.standard_working_hours_per_day || 8}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, standard_working_hours_per_day: Number(e.target.value) }))}
                placeholder="8.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overtime_multiplier">Overtime Rate Multiplier</Label>
              <Input
                id="overtime_multiplier"
                type="number"
                step="0.1"
                value={salaryStructure?.overtime_rate_multiplier || 1.5}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, overtime_rate_multiplier: Number(e.target.value) }))}
                placeholder="1.5"
              />
            </div>
            <div className="md:col-span-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={salaryStructure?.overtime_eligible || false}
                  onChange={(e) => setSalaryStructure(prev => ({ ...prev, overtime_eligible: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <span className="text-sm font-medium text-slate-700">Eligible for Overtime Pay</span>
              </label>
            </div>
          </div>
        )}

        {/* Daily Rate Fields */}
        {calculationMethod === 'daily' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="daily_rate">Daily Rate (₹)</Label>
              <Input
                id="daily_rate"
                type="number"
                value={salaryStructure?.daily_rate || 0}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, daily_rate: Number(e.target.value) }))}
                className="text-lg font-semibold"
                placeholder="Enter daily rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="working_days">Expected Working Days/Month</Label>
              <Input
                id="working_days"
                type="number"
                value={salaryStructure?.standard_working_days_per_month || 26}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, standard_working_days_per_month: Number(e.target.value) }))}
                placeholder="26"
              />
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Allowances Section */}
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
      <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-6 flex items-center">
          <PiggyBank className="h-6 w-6 mr-3 text-blue-600" />
          Allowances & Benefits
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'house_rent_allowance', label: 'House Rent Allowance (HRA)', icon: '🏠' },
            { key: 'transport_allowance', label: 'Transport Allowance', icon: '🚗' },
            { key: 'medical_allowance', label: 'Medical Allowance', icon: '🏥' },
            { key: 'food_allowance', label: 'Food Allowance', icon: '🍽️' },
            { key: 'special_allowance', label: 'Special Allowance', icon: '⭐' }
          ].map((allowance) => (
            <div key={allowance.key} className="space-y-2">
              <Label htmlFor={allowance.key} className="flex items-center">
                <span className="mr-2">{allowance.icon}</span>
                {allowance.label}
              </Label>
              <Input
                id={allowance.key}
                type="number"
                value={salaryStructure?.[allowance.key] || 0}
                onChange={(e) => setSalaryStructure(prev => ({ 
                  ...prev, 
                  [allowance.key]: Number(e.target.value) 
                }))}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Deductions Configuration */}
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
      <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-6 flex items-center">
          <Minus className="h-6 w-6 mr-3 text-red-600" />
          Deductions & Taxes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={salaryStructure?.pf_applicable || false}
                  onChange={(e) => setSalaryStructure(prev => ({ ...prev, pf_applicable: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <span className="font-medium">Provident Fund (PF)</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={salaryStructure?.pf_rate || 0.12}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, pf_rate: Number(e.target.value) }))}
                className="w-20 text-center"
                disabled={!salaryStructure?.pf_applicable}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={salaryStructure?.esi_applicable || false}
                  onChange={(e) => setSalaryStructure(prev => ({ ...prev, esi_applicable: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <span className="font-medium">ESI (Employee State Insurance)</span>
              </label>
              <Input
                type="number"
                step="0.001"
                value={salaryStructure?.esi_rate || 0.0325}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, esi_rate: Number(e.target.value) }))}
                className="w-20 text-center"
                disabled={!salaryStructure?.esi_applicable}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="professional_tax">Professional Tax (₹)</Label>
              <Input
                id="professional_tax"
                type="number"
                value={salaryStructure?.professional_tax || 0}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, professional_tax: Number(e.target.value) }))}
                placeholder="200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_type">Payment Method</Label>
              <select
                id="payment_type"
                value={salaryStructure?.payment_type || 'bank'}
                onChange={(e) => setSalaryStructure(prev => ({ ...prev, payment_type: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash Payment</option>
                <option value="esi">ESI Payment</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Real-time Salary Preview */}
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
      <div className="relative bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-900/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-6 flex items-center">
          <Receipt className="h-6 w-6 mr-3 text-emerald-600" />
          Salary Preview
        </h3>

        {salaryStructure && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Earnings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-emerald-700 text-lg">Earnings</h4>
              <div className="space-y-2">
                {calculationMethod === 'monthly' && (
                  <div className="flex justify-between">
                    <span>Basic Salary:</span>
                    <span className="font-semibold">₹{(salaryStructure.basic_salary || 0).toLocaleString()}</span>
                  </div>
                )}
                {calculationMethod === 'hourly' && (
                  <div className="flex justify-between">
                    <span>Hourly Rate × Hours:</span>
                    <span className="font-semibold">₹{((salaryStructure.hourly_rate || 0) * 8 * 26).toLocaleString()}</span>
                  </div>
                )}
                {calculationMethod === 'daily' && (
                  <div className="flex justify-between">
                    <span>Daily Rate × Days:</span>
                    <span className="font-semibold">₹{((salaryStructure.daily_rate || 0) * 26).toLocaleString()}</span>
                  </div>
                )}
                
                {/* Allowances */}
                {(salaryStructure.house_rent_allowance || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>HRA:</span>
                    <span className="font-semibold">₹{(salaryStructure.house_rent_allowance || 0).toLocaleString()}</span>
                  </div>
                )}
                {(salaryStructure.transport_allowance || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Transport:</span>
                    <span className="font-semibold">₹{(salaryStructure.transport_allowance || 0).toLocaleString()}</span>
                  </div>
                )}
                {/* Add other allowances similarly */}
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-red-700 text-lg">Deductions</h4>
              <div className="space-y-2">
                {salaryStructure.pf_applicable && (
                  <div className="flex justify-between">
                    <span>PF ({((salaryStructure.pf_rate || 0.12) * 100).toFixed(1)}%):</span>
                    <span className="font-semibold text-red-600">-₹{((salaryStructure.basic_salary || 0) * (salaryStructure.pf_rate || 0.12)).toLocaleString()}</span>
                  </div>
                )}
                {salaryStructure.esi_applicable && (
                  <div className="flex justify-between">
                    <span>ESI ({((salaryStructure.esi_rate || 0.0325) * 100).toFixed(2)}%):</span>
                    <span className="font-semibold text-red-600">-₹{((salaryStructure.basic_salary || 0) * (salaryStructure.esi_rate || 0.0325)).toLocaleString()}</span>
                  </div>
                )}
                {(salaryStructure.professional_tax || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Professional Tax:</span>
                    <span className="font-semibold text-red-600">-₹{(salaryStructure.professional_tax || 0).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end space-x-4">
      <Button 
        variant="outline" 
        onClick={() => {
          // Reset to default values
          setSalaryStructure(null);
          setCalculationMethod('monthly');
        }}
      >
        Reset Configuration
      </Button>
      <Button 
        onClick={async () => {
          if (!employeeData?.id || !salaryStructure) return;
          
          try {
            setSaving(true);
            await createSalaryStructure(employeeData.id, {
              ...salaryStructure,
              calculation_method: calculationMethod
            });
            
            setNotification({
              show: true,
              message: 'Salary structure saved successfully!',
              type: 'success'
            });
            setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
          } catch (error) {
            setNotification({
              show: true,
              message: 'Failed to save salary structure. Please try again.',
              type: 'error'
            });
            setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
          } finally {
            setSaving(false);
          }
        }}
        disabled={saving || !salaryStructure}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {saving ? 'Saving...' : 'Save Salary Structure'}
      </Button>
    </div>
  </div>
</TabsContent>
