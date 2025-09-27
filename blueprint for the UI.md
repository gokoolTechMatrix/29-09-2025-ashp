# Sai Hari Papers — Admin Dashboard Logic & UI Blueprint (Finalized)

This blueprint distills the **PRD (Aug 20, 2025)** requirements of Sai Hari Papers into a **unique, performance-oriented Admin Dashboard design**. It emphasizes usability, adaptive insights, and rapid decision-making for the core modules.

---

## 1) Dashboard Philosophy
- **Admin as Command Center**: Single screen that consolidates staff, machine, inventory, finance, and delivery KPIs.
- **Adaptive Panels**: Widgets rearrange based on real-time data priority (e.g., payroll cutoff week → salary KPIs pushed top).
- **Action-Oriented**: Every widget links directly to its respective workflow (e.g., “Low Stock” → auto-PO draft).
- **Performance-first**: Cached summary queries + drill-down fetch on demand.

---

## 2) Admin Dashboard Layout

### Header Controls
- Global search (employee, item, order, challan).
- Date range switcher (Today / This Week / Month / Custom).
- Quick actions: **+Employee, +Work Order, +Invoice, +PO**.

### KPI Tiles (Top Row)
1. **Attendance Status**: Present / Total Scheduled; color-coded (green ≥95%, amber 80–94%, red <80%).
   - Drilldown: absentee list, late logins, contract staff attendance.
2. **Employees on Leave**: Today vs Week; hover shows leave types (CL/SL/EL).
3. **Payroll Alerts**: Pending approvals, EMI cycles due, increment entries.
4. **Cash Flow Snapshot**: Income vs Expenses today; ledger anomalies flagged.

### Middle Panels (Operational)
- **Inventory Alerts** (Left): Items below reorder threshold.  
  Logic: Alert if `On-hand < ROP = (Avg Daily Use × Lead Time) + Safety Stock`.  
  CTA: **Create PO / Adjust Stock**.
- **Machine Health & Service** (Center): Machines due for PM or in downtime.  
  Logic: Alert if `(hours_since_last_pm ≥ threshold)` OR `(days_since_pm ≥ threshold)`.  
  CTA: **Create Service Log / Assign Technician**.
- **Work Orders At-Risk** (Right): WOs behind schedule, or defective output >5%.  
  CTA: **Reassign / Adjust routing / Issue fine**.

### Lower Panels (Finance & Delivery)
- **Delivery Challans**: Pending dispatch or collection; DC aging buckets.  
  CTA: **Generate DC / Mark Collected**.
- **Invoices & Payments**: Unpaid invoices by aging (0–30, 30–60, >60).  
  CTA: **Send Reminder / Record Payment**.
- **Ledger Balance**: Last 7 days trend, category filters (expenses vs income).

### Side/Alert Panel (Real-Time)
- Biometric sync health (face/fingerprint devices online/offline).
- Overdue POs or GRNs.
- QC rejection % > tolerance.
- Payroll processing errors (deduction mismatch, duplicate EMI).
- Safety or compliance flags (audit log anomalies).

---

## 3) Dashboard Data Logic

- **Attendance %** = Present ÷ Scheduled (exclude approved leave if HR policy demands).
- **Payroll Alert** = if pending approvals > 0 OR EMI due within 3 days.
- **Inventory Low Stock** = if On-hand + On-order < ROP.
- **Machine Due** = if `days_since_last_pm ≥ cycle` OR `meter_since_last_pm ≥ cycle`.
- **WO Delay** = if (Planned completion < today) AND (Actual status ≠ completed).
- **Cash Flow** = ΣIncome − ΣExpenses (daily ledger).
- **Invoice Aging** = Current date − Invoice due date.

---

## 4) UI Design Patterns
- **Modular Grid**: 3–4 resizable widget rows; drag-and-drop rearrangement.
- **Card-based KPIs** with hover drilldowns + quick actions.
- **Color-coded alerts** for thresholds (attendance, machine, inventory).
- **Interactive charts** (trend lines for cash flow, aging bars for invoices, donut for leave types).
- **Collapsible side alerts**: keep focus while surfacing exceptions.

---

## 5) Performance & Adaptivity
- Use **pre-aggregated views** for KPIs, refreshed every 5 minutes.
- Async load for drilldowns; prevent blocking UI.
- Device-aware responsiveness: tablet-first design for shopfloor/Admin mobility.
- **Adaptive priority**: If payroll cut-off week, salary KPIs pinned top; if inventory shortage, stock alerts pinned top.

---

## 6) Uniqueness Factors
- **Smart Attention Engine**: reorders widgets dynamically by severity (e.g., machine breakdown supersedes payroll reminder).
- **Direct-to-Action Workflow**: Every alert leads to action forms (PO, WO, Service Log, Invoice) in one click.
- **Contextual Tooltips**: Each KPI shows formula + source dataset for transparency.
- **Audit-Friendly**: Quick download of current state as PDF (attendance sheet, low stock list, ledger balance).

---

## 7) Suggested Wireframe Blocks
- **Row 1**: 4 KPI tiles (Attendance, Leave, Payroll, Cash Flow).
- **Row 2**: 3 panels (Inventory, Machines, Work Orders).
- **Row 3**: 3 panels (Delivery Challans, Invoices, Ledger).
- **Side Bar**: Alerts feed.

---

## 8) Implementation Notes (Phase 1 Admin-Only)
- Single Admin role with full visibility.
- Drilldowns limited to read-only where module is not fully rolled out (e.g., EMI history placeholder if payroll not implemented).
- Export-ready panels for PDF/Excel compliance.

---

### Deliverable for UI Designer
Use this blueprint to:
- Create **grid-based, adaptive dashboard mockups**.
- Highlight unique design patterns (smart reordering, contextual tooltips).
- Incorporate drilldowns into modals rather than full-page redirects.
- Ensure every KPI/alert drives a workflow action.

