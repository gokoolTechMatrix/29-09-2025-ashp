import React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Download, Package, Scissors, FoldHorizontal } from "lucide-react";

/**
 * EMPLOYEE PROFILE – FULL SUITE (Light Theme)
 * Tailwind + shadcn/ui. Drop-in runnable page.
 */

export const metadata = { title: "Employee Profile – Full Suite" };

const EMP = {
  id: "EMP-1042",
  name: "Roger Curtis",
  type: "Permanent",
  dept: "Operations",
  role: "Senior Technician",
  avatar: "/avatars/roger.jpg",
};

function Field({ id, label, placeholder = "", type = "text" as React.HTMLInputTypeAttribute, className = "" }) {
  return (
    <div className={"space-y-1 " + className}>
      <Label htmlFor={id} className="text-slate-700">{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} className="bg-white" />
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {desc && <CardDescription>{desc}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function DetailsForm() {
  return (
    <Section title="Employee Details" desc="Comprehensive form (photo + 40+ fields)">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="flex flex-col items-center gap-3 rounded-2xl border bg-white p-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={EMP.avatar} />
              <AvatarFallback>{EMP.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Upload Photo</Button>
          </div>
        </div>
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field id="name" label="Name" placeholder="Full name" />
            <Field id="dob" label="Date of Birth" type="date" />
            <Field id="age" label="Age" type="number" />
            <Field id="sex" label="Sex" placeholder="Male/Female/Other" />
            <Field id="phone" label="Phone Number" placeholder="+91…" />
            <Field id="address" label="Address" placeholder="Address" />
            <Field id="aadhaar" label="Aadhaar Number" />
            <Field id="pan" label="PAN Number" />
            <Field id="bankName" label="Bank Name" />
            <Field id="acct" label="Account Number" />
            <Field id="ifsc" label="IFSC Code" />
            <Field id="doj" label="Date of Joining" type="date" />
            <Field id="startSal" label="Starting Salary" />
            <Field id="inc1" label="Increment – Year 1" />
            <Field id="inc2" label="Increment – Year 2" />
            <Field id="daysWorked" label="No. of Days Worked in SHP" type="number" />
            <Field id="wageHour" label="Wages / hour" />
            <Field id="remarks" label="Remarks" />
          </div>
        </div>
      </div>
      <CardFooter className="justify-end pt-4">
        <Button variant="outline">Cancel</Button>
        <Button className="ml-2">Save Details</Button>
      </CardFooter>
    </Section>
  );
}

/**
 * Advanced Attendance Calendar UX
 * - Quick status picker (Present/Absent/Leave/Clear)
 * - Click a day to set status; drag across days to paint
 * - Month summary with counts and progress bar
 */
function AttendanceCalendar() {
  const [selectedStatus, setSelectedStatus] = React.useState<"P" | "A" | "L" | "">("P");
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date>(new Date());
  const [isDragging, setIsDragging] = React.useState(false);
  const [attendance, setAttendance] = React.useState<Record<string, "P" | "A" | "L">>({});

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const dayKeys: string[] = Array.from({ length: lastDay.getDate() }, (_, i) => fmt(new Date(month.getFullYear(), month.getMonth(), i + 1)));

  function setStatusForDate(d: Date) {
    if (!selectedStatus) return; // "Clear" mode handled separately
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
      P: "bg-green-100 text-green-800",
      A: "bg-red-100 text-red-800",
      L: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span className={`absolute bottom-1 right-1 rounded-full px-1 text-[10px] leading-4 ${classes[status]}`}>{status}</span>
    );
  }

  // Summary counts
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

  // Bulk actions
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
    <Section title="Attendance" desc="Calendar with quick marking & summaries">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Input
          aria-label="Choose month"
          type="month"
          value={`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`}
          onChange={(e) => {
            const [y, m] = e.target.value.split("-").map(Number);
            setMonth(new Date(y, (m || 1) - 1, 1));
          }}
          className="w-48"
        />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="rounded-xl border bg-white p-1 text-xs md:text-sm">
            <div className="flex overflow-hidden rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedStatus("P")}
                className={`px-3 py-1 ${selectedStatus === "P" ? "bg-green-100" : ""}`}
              >Present</button>
              <button
                type="button"
                onClick={() => setSelectedStatus("A")}
                className={`px-3 py-1 border-l ${selectedStatus === "A" ? "bg-red-100" : ""}`}
              >Absent</button>
              <button
                type="button"
                onClick={() => setSelectedStatus("L")}
                className={`px-3 py-1 border-l ${selectedStatus === "L" ? "bg-yellow-100" : ""}`}
              >Leave</button>
              <button
                type="button"
                onClick={() => setSelectedStatus("")}
                className={`px-3 py-1 border-l ${selectedStatus === "" ? "bg-slate-100" : ""}`}
              >Clear</button>
            </div>
          </div>
          <Button variant="outline" onClick={() => markAll((d) => d.getDay() !== 0 && d.getDay() !== 6)}>Fill Weekdays</Button>
          <Button variant="outline" onClick={() => markAll((d) => d.getDay() === 0 || d.getDay() === 6)}>Fill Weekends</Button>
          <Button variant="outline" onClick={() => markAll(() => true)}>Fill All</Button>
          <Button variant="outline" onClick={() => setAttendance({})}>Reset</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export CSV</Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => setSelected(d)}
          month={month}
          onMonthChange={setMonth}
          className="mx-auto"
          components={{
            DayContent: ({ date }) => (
              <div
                onMouseDown={() => { setIsDragging(true); handlePaint(date); }}
                onMouseEnter={() => { if (isDragging) handlePaint(date); }}
                onMouseUp={() => setIsDragging(false)}
                className="relative flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-md text-sm hover:bg-slate-100 md:h-10 md:w-10"
              >
                {date.getDate()}
                {marker(date)}
              </div>
            ),
          }}
        />
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs md:text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800">Present {counts.P}</Badge>
              <Badge className="bg-red-100 text-red-800">Absent {counts.A}</Badge>
              <Badge className="bg-yellow-100 text-yellow-800">Leave {counts.L}</Badge>
            </div>
            <div className="text-slate-600">Marked: {totalMarked}/{dayKeys.length}</div>
          </div>
          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-2 bg-green-500" style={{ width: `${(counts.P / dayKeys.length) * 100}%` }} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function SalarySheet() {
  const rows = [
    { label: "Per hour", value: "₹250" },
    { label: "Total working hours (month)", value: "176" },
    { label: "Amount (type-based)", value: "₹44,000" },
    { label: "Gross Salary", value: "₹44,000" },
    { label: "TDS (1%)", value: "-₹440" },
    { label: "Canteen", value: "-₹300" },
    { label: "Fine", value: "-₹0" },
    { label: "ESI (bank/cash split)", value: "₹20,000 bank / ₹24,000 cash" },
    { label: "Advance", value: "-₹2,000" },
    { label: "EMI", value: "-₹1,000" },
    { label: "Net Salary", value: "₹40,260" },
  ];
  return (
    <Section title="Salary Sheet" desc="Auto-calculated from attendance & rules">
      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b last:border-b-0">
                <td className="w-1/2 bg-slate-50 px-4 py-2 font-medium">{r.label}</td>
                <td className="px-4 py-2">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CardFooter className="justify-end pt-4">
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Download</Button>
        <Button className="ml-2">Generate Slip</Button>
      </CardFooter>
    </Section>
  );
}

function AdvanceCopy() {
  return (
    <Section title="Advance Copy" desc="For employee advances & EMI">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id="adv_emp" label="Employee Name" placeholder={EMP.name} />
        <Field id="adv_acct" label="Account Number" />
        <Field id="adv_ifsc" label="IFSC Code" />
        <Field id="adv_amt" label="Advance Amount" />
        <Field id="adv_emi" label="EMI" />
        <Field id="adv_net" label="Net Salary" />
      </div>
      <CardFooter className="justify-end pt-4">
        <Button variant="outline">Preview</Button>
        <Button className="ml-2">Save Advance</Button>
      </CardFooter>
    </Section>
  );
}

function BankCopy() {
  return (
    <Section title="Bank Copy" desc="Printable bank statement for salary disbursal">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id="bank_company" label="Name (Company)" placeholder="Sai Hari Papers" />
        <Field id="bank_emp" label="Employee Name" placeholder={EMP.name} />
        <Field id="bank_ifsc" label="IFSC Code" />
        <Field id="bank_net" label="Net Salary (after deductions)" />
      </div>
      <CardFooter className="justify-end pt-4">
        <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Download PDF</Button>
        <Button className="ml-2">Save Bank Copy</Button>
      </CardFooter>
    </Section>
  );
}

function ContractWork() {
  return (
    <Section title="Contract Work" desc="Packet/Bundle • Reem Cutting • Folding">
      <Tabs defaultValue="packet" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packet" className="gap-2"> <Package className="h-4 w-4"/>Packet / Bundle</TabsTrigger>
          <TabsTrigger value="reem" className="gap-2"> <Scissors className="h-4 w-4"/>Reem Cutting</TabsTrigger>
          <TabsTrigger value="fold" className="gap-2"> <FoldHorizontal className="h-4 w-4"/>Folding</TabsTrigger>
        </TabsList>
        <TabsContent value="packet" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field id="regular_packet" label="Regular Packet (₹)" placeholder="0.80" />
            <Field id="deluxe_packet" label="Deluxe Packet (₹)" placeholder="1.00" />
            <Field id="bundle_stitch" label="Bundle Stitching (₹)" placeholder="6.00" />
          </div>
          <div className="mt-3 rounded-2xl border p-3 text-sm text-slate-600">Add rows per day/quantity in implementation.</div>
        </TabsContent>
        <TabsContent value="reem" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field id="rc_person" label="Person Name" />
            <Field id="rc_date" label="Date" type="date" />
            <Field id="rc_product" label="Product Name" />
            <Field id="rc_reem_weight" label="Reem weight" />
            <Field id="rc_reem" label="Reem" />
            <Field id="rc_kg" label="KG" />
            <Field id="rc_ton" label="TON" />
            <Field id="rc_rate_ton" label="Rate / TON" />
          </div>
        </TabsContent>
        <TabsContent value="fold" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field id="fd_name" label="Name" />
            <Field id="fd_date" label="Date" type="date" />
            <Field id="fd_price" label="Price" />
            <Field id="fd_maths_80c" label="Maths 80C" />
            <Field id="fd_maths_80g" label="Maths 80G" />
            <Field id="fd_drawing_c" label="Drawing C" />
            <Field id="fd_drawing_g" label="Drawing G" />
            <Field id="fd_graph_c" label="Graph C" />
            <Field id="fd_graph_g" label="Graph G" />
            <Field id="fd_geometry_c" label="Geometry C" />
            <Field id="fd_geometry_g" label="Geometry G" />
            <Field id="fd_fold1" label="Folding 1 off" />
            <Field id="fd_fold2" label="Folding 2 off" />
            <Field id="fd_fold3" label="Folding 3 off" />
          </div>
        </TabsContent>
      </Tabs>
    </Section>
  );
}

export default function EmployeeFullSuitePage() {
  return (
    <div className="mx-auto min-h-screen max-w-[1400px] bg-slate-50 p-0">
      {/* Light theme app bar */}
      <div className="sticky top-0 z-10 mb-6 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div>
            <div className="text-xs text-slate-600">Employees / {EMP.name}</div>
            <h1 className="text-2xl font-semibold text-slate-900">Profile & Operations</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Preview</Button>
            <Button>Save</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] p-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Section title="Snapshot" desc="Quick info">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={EMP.avatar} />
                  <AvatarFallback>RC</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{EMP.name}</div>
                  <div className="text-sm text-slate-600">{EMP.role} • {EMP.dept} • {EMP.type}</div>
                  <div className="text-xs text-slate-500">{EMP.id}</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-white p-3 shadow-sm">Leave Balance<br/><span className="text-lg font-semibold">12 days</span></div>
                <div className="rounded-xl bg-white p-3 shadow-sm">On-Time %<br/><span className="text-lg font-semibold">92%</span></div>
              </div>
            </Section>
          </div>
          <div className="lg:col-span-8">
            <DetailsForm />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AttendanceCalendar />
          </div>
          <div className="lg:col-span-4 space-y-5">
            <AdvanceCopy />
            <BankCopy />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SalarySheet />
          </div>
          <div className="lg:col-span-6">
            <ContractWork />
          </div>
        </div>
      </div>
    </div>
  );
}