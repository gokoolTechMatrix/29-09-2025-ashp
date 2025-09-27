# Sai Hari Papers — ERP UX & Module Logic Blueprint (v1)

A pragmatic, UI-first blueprint for designing modules, dashboards, and workflows for a paper & paper-products manufacturing ERP. It blends best practices seen across leading systems (e.g., SAP-style approvals, Odoo-style quick creates, Dynamics-style workspaces) with mill-specific logic (reels, GSM/BF, moisture, machine hours).

---

## 0) Guiding Principles
- **One-click to action**: Every KPI/widget should have a primary action (e.g., "Create PO", "Start WO").
- **Role-based workspaces**: Admin, HR, Production, Maintenance, QC, Warehouse, Procurement, Sales, Finance.
- **State machines** for critical entities (SO, WO, PO, GRN, QC Lot, Maintenance WO) with auditable transitions.
- **Scan-first on shopfloor**: QR/Barcode on reels/lots; all WIP moves are scan-driven.
- **Explainability**: Show how a number was calculated (tooltips, drilldowns).
- **Defaults + templates**: Rate contracts, BOM templates, inspection plans, PM templates.

---

## 1) Admin Landing Dashboard (After Login)
**Layout**: 4 KPI tiles + 2 wide tables + 2 charts + Alerts panel.

### Key KPIs (clickable)
1) **Attendance Today** = Present / Scheduled.  
   - Drilldown: late check-ins, no-shows by shift.
2) **Employees on Leave** (Today/This Week).  
   - Drilldown: type (CL/SL/EL), department.
3) **Low Stock Items** (Below Reorder Point).  
   - ROP = (Avg Daily Consumption × Supplier Lead Time days) + Safety Stock.  
   - Safety Stock (simple) = (Max daily usage × Max lead time) − (Avg usage × Avg lead time).  
   - Primary action: **Create Purchase Requisition** or **Trigger MRP**.
4) **Machines Due for Service** (PM due in ≤7 days or ≤50 machine-hours).  
   - Trigger: hours_since_last_pm ≥ threshold **OR** calendar_days ≥ threshold.  
   - Primary action: **Create Maintenance WO**.

### Priority Tables
- **At-Risk Customer Orders**: promised < today+3, ATP shortfall, credit block.  
  Actions: reschedule, substitute, split shipment, request credit override.
- **Quality Holds**: lots on hold (incoming, in-process, FG); actions: re-test, rework, scrap, vendor claim.

### Charts
- **Plan vs Actual (Today)** by machine/shift.  
- **OEE last 7 days** (Availability × Performance × Quality).

### Alerts Panel (event-driven)
- Low chemical stock (< FEFO threshold days).  
- Boiler feedwater quality out-of-spec (if integrated).  
- Overdue PO deliveries; Overdue AR (> credit terms).  
- Safety incident logged.

---

## 2) Roles & Workspaces

### Admin
- Sees all KPIs, cross-module alerts, audit exceptions.
- Can impersonate roles for troubleshooting.

### HR/Time Office
- **Shift Rosters**, **Attendance Exceptions**, **Leave Calendar**, **Overtime approvals**.
- Device sync health (biometric/turnstile).

### Production Planner
- **MPS/MRP board**, **Capacity view** (machine Gantt), **Changeover matrix**, **Material pegging**.

### Shopfloor Supervisor
- **Work Orders (cards)**: Planned → Released → In-Progress → Paused → QC Hold → Completed.  
- Fast actions: start/pause/complete, log scrap/broke, label print, downtime reason.

### Maintenance
- **PM Calendar**, **Meter Readings**, **Breakdown queue**, **Spares availability**.

### QC/Lab
- **Sampling queue**, **Test entry** (GSM, BF, COBB, moisture, brightness, caliper), **COA issuance**.

### Warehouse
- **Inbound (GRN → Putaway)**, **Pick/Pack/Ship**, **Cycle counts**, **Reel staging**.

### Procurement
- **RFQ/Quotation compare**, **PO tracking**, **Vendor scorecards**, **Rate contracts**.

### Sales/Dispatch
- **Quotations**, **Pricing by grade/GSM/size**, **Credit status**, **ATP/CTP**, **Dispatch planning**.

### Finance/Costing
- **AR/AP aging**, **Cost center P&L**, **Std vs Actual variances**, **Tax returns**.

---

## 3) HR, Attendance & Leave Logic
**Entities**: Employee, Shift, Roster, Swipe, Attendance Day, Leave Request, Overtime, Holiday.

**Attendance calc** (per person/day):
- Present if (IN and OUT exist within shift window ± grace). Late if IN > start+grace. Absent if no IN by mid-shift.  
- Auto-split night shifts over two dates; consolidate to the roster date.

**Exceptions workflow**: Auto-ticket when missing swipe/late/early exit → Supervisor approve/reject → HR finalize.

**Leave**: Request → Manager approve → HR post → Payroll accruals auto-updated.  
**Overtime**: Supervisor propose → Manager approve → HR post to payroll.

**UI**: Shift heatmap, team calendar, per-employee timeline (swipes, breaks, exceptions).

---

## 4) Inventory & Warehousing Logic
**Paper specifics**:
- **UoM conversions**: MT ↔ kg, reels ↔ sheets (size-dependent), m²; store GSM, width, diameter, core size.
- **Identifiers**: Reel ID/Lot No./Batch; **Bin/Zone with humidity control** for paper.
- **Stock valuation**: FIFO for paper reels; **FEFO** for chemicals/starch.
- **Trim/Waste** capture: broke and reusable trim stock type.

**Replenishment**:
- Reorder point per item/site/bin; Days of Cover = On-hand / Avg Daily Consumption.  
- **Min/Max** for spares; **Kanban cards** for high-usage consumables.

**Inbound (GRN)**: PO → GRN → **QC-Hold** virtual bin → Accept/Reject → Putaway (bin suggestion by slotting rules).

**Outbound**: Pick by wave (priority: due SO/WO), **reel cutting plan** (width optimization), weighbridge check.

**Cycle counting**: ABC classes; daily tasks by class; blind count UI.

**UI**: Mobile-first scans, bulk actions, substitute suggestions, on-hand with quality status badges.

---

## 5) Procurement Logic
**Process**: Requisition (auto from MRP or manual) → RFQ → Compare (price, lead time, quality score) → PO → ASN/Delivery → GRN → QC → Invoice → 3-way match.

**Controls**:
- **Approval matrix** by amount/category; auto-split to framework POs when rate contracts exist.
- **Vendor scorecard**: on-time %, quality reject %, responsiveness, price variance.
- **Price locks**: effective date ranges; currency; tax (GST) handling.

**UI**: RFQ compare table, PO tracker with ETA confidence, exception badges (late, partials, price variance).

---

## 6) Sales, Pricing & Dispatch Logic
**Quotations**: Customer + product (grade/GSM/size/color) + price (tier/contract) + tax + freight terms.

**Sales Order (SO)**:
- Credit check: **Block** if (AR outstanding > credit limit) OR overdue > X days; override with approval.
- ATP (Available-to-Promise): ATP(date) = On-hand + Scheduled Receipts − Allocations up to date.

**Dispatch**: Wave plan → Pick/Pack → Weighbridge → Ship (LR/consignment) → Invoice → E-invoice/E-way (if applicable).

**UI**: Margin preview, delivery promise heatmap, split/merge shipment, substitute items, packing list builder.

---

## 7) Production Planning (MPS/MRP/Capacity)
**MRP Inputs**: SO/Forecast, On-hand, Open POs, open WOs, BOMs, lead times, yields, minimum batch/reel widths.

**MRP Logic (simplified)**:
- Net Requirement = Demand − (On-hand + Scheduled Receipts) + Safety Stock.  
- Create planned orders honoring **lot size** (e.g., min reel length), **campaigning** similar grades to minimize changeovers.

**Capacity Planning**:
- Routing with **setup time** (grade/GSM change), **run rate** (m/min, t/hr), **queue time**.  
- Machine Gantt: finite capacity; **sequence by changeover matrix** to reduce wash/steam loss.

**UI**: Drag-and-drop Gantt, pegging tree (SO → WO → components), what-if simulation (pull a job; show ripple effect).

---

## 8) Shopfloor Execution (MES-lite)
**WO states**: Planned → Released → In-Progress → Paused (reason) → QC Hold → Completed.

**Data capture**: start/stop times, shift, operator, meters (speed, temp), material consumed (scanned), FG produced (reels/sheets), **broke/waste**.

**Labels**: auto-generate reel labels with QR (Item, Grade, GSM, width, length, Lot, Date, Shift, Operator).

**Downtime**: reason codes (electrical, mechanical, grade change, no material).  
**Changeover**: pre-checklist; auto-start timer when last WO completes.

**UI**: Large touch targets, offline cache, quick scrap logging, live progress bars.

---

## 9) Quality Management
**Inspection Plans** per item/category (Incoming, In-Process, FG).

**Common tests**: GSM, Burst Factor (BF), Cobb, Moisture, Brightness, Caliper, Tensile/TEA, Glue strength (for products).

**Sampling**: AQL-based or fixed frequency (e.g., each reel, every X minutes).  
**Disposition**: Accept / Rework / Reject / Use-as-is (with approval).  
**COA**: generated from test results; auto-attach to dispatch.

**UI**: Queue by priority, device hooks (balances, moisture meters), trend charts, spec bands (red/amber/green).

---

## 10) Maintenance (EAM)
**Assets**: Machine → Sub-assemblies → Components; criticality score; spare part BOM.

**PM Policies**: Calendar-based (every N days), Usage-based (every N hours/starts), Condition-based (vibration/temp).  
**Trigger**: if (meter ≥ threshold) OR (days since last PM ≥ threshold).  
**Breakdown**: Request → Approve → Assign → In-progress → Pending spares → Completed → Verified.

**Spares**: Min/Max; auto-reserve when WO approved; alternative parts; vendor links.

**UI**: PM calendar, parts reservation panel, tech mobile app with checklists, photo uploads, MTTR/MTBF.

---

## 11) Finance & Costing
**Integration points**:
- GRN → accruals; Invoice → AP; Shipment/Invoice → AR; Payroll → GL.  
- **Standard Cost** (material + labor + overhead) vs **Actual**; variance breakdown (mix, yield, rate, efficiency).

**Tax**: GST/VAT configured per item/customer/state; reverse charge rules; HSN/SAC.

**Controls**: 3-way/2-way matches, tolerance bands, credit blocks, write-off approvals.

**UI**: Aging buckets, variance waterfall, costed BOM rollups, period close checklist.

---

## 12) Utilities & EHS (Optional but useful)
- Boiler/Steam, Power, Water meters; energy/steam per ton tracking.  
- Effluent logs, chemical handling, MSDS links, permit-to-work.

---

## 13) Analytics (Core KPIs)
- **OEE** by machine/shift; **Plan vs Actual**; **OTIF**; **Yield**; **Scrap %**; **Energy/ton**; **DIO/DIT**; **On-time vendor delivery**; **Quality PPM**; **Attendance %**; **Overtime hours**; **Credit blocked value**.

**Drilldowns**: Each KPI → trend → by segment (machine/grade/customer) → transaction list.

---

## 14) Permissions & Security
- **RBAC** per module + action; row-level for site/plant; field-level (e.g., rates hidden for operators).  
- **Approval workflows** mapped to roles; delegation with expiry; full audit log.

---

## 15) Data Model Highlights (for UI binding)
Core entities and relationships your screens will bind to:
- **Item** (type: RM/PM/Spares/Consumable), attributes: grade, GSM, color, width, UoM, tax, QA specs.  
- **BOM** (FG ↔ components) with scrap %, yield.  
- **Routing** (operations, machine, setup/run times).  
- **Inventory** (Item, Lot/Reel, Bin, Qty, Status).  
- **SO/PO/WO/GRN/Invoice/Delivery** (+ states, dates).  
- **QC Lot** (plan, results, disposition).  
- **Asset** (meters, PM plans).  
- **Employee** (dept, shift, attendance, leave).  
- **Meter Reading/Downtime**.  

---

## 16) Event-Driven Alerts & Automations
- **Stock**: when On-hand < ROP → create PR draft + notify buyer.  
- **Service due**: meter tick crosses threshold → PM WO draft to planner.  
- **Credit**: SO creation triggers credit check → place on hold if breached.  
- **Quality**: QC failure → block lot; notify planner and buyer/vendor.  
- **Production**: WO behind plan > X% → escalate to supervisor.  
- **Attendance**: shift start + Y mins with < Z% present → alert HR.

---

## 17) UI Components & Patterns
- **Workspace header**: search, filters, date/plant pickers, bulk actions.
- **Cards/tables** with status pills; sticky action bar on selection.  
- **Wizards** for PR→PO, SO→Shipment, WO→Report.  
- **Gantt & Kanban** (planning, maintenance).  
- **Mobile scan screens** (Receive, Putaway, Pick, Issue to WO).  
- **Inline explainers** (hover to see formula and data lineage).

---

## 18) Edge Cases & Controls
- Night shifts spanning two dates; split pays codes accordingly.  
- Negative inventory prevention with override.  
- Substitute items when exact GSM/width unavailable; auto-recalc yield/margins.  
- Reel partial consumption → auto-create child reel with updated length/weight.  
- QC partial acceptance: split lot; hold remainder.  
- Backdated postings windows; period close locks.

---

## 19) Implementation Phases (suggested)
1) **Phase 1**: HR/Attendance, Inventory basics, Procurement, Sales, Invoicing, Admin dashboard.  
2) **Phase 2**: Production (WO + shopfloor), QC, Maintenance, Advanced planning.  
3) **Phase 3**: Costing deep-dive, Utilities/EHS, Advanced analytics, Mobile apps.

---

## 20) Sample Calculations & Pseudo-Queries
**Low Stock List**  
`SELECT item, on_hand, reorder_point, on_order, (on_hand + on_order) AS projected, (on_hand / NULLIF(avg_daily_use,0)) AS days_cover FROM inventory_view WHERE on_hand < reorder_point ORDER BY days_cover ASC;`

**Attendance Rate (Today)**  
`present_count / scheduled_count` (exclude leave-approved employees from denominator if policy demands).

**PM Due Soon**  
`WHERE (days_since_last_pm >= pm_days_threshold) OR (meter_since_last_pm >= pm_meter_threshold)`

**ATP**  
`ATP(date) = OnHand(t0) + ΣReceipts(to date) − ΣAllocations(to date)`

---

### What you can design next (UI)
- Admin dashboard with the exact widgets above.  
- HR workspace: roster heatmap, exception inbox.  
- Inventory: receive→QC→putaway flow + low-stock board.  
- Planning: finite-capacity Gantt + changeover-aware sequencer.  
- Shopfloor: scan-first WO screen with progress + scrap logging.  
- QC: sampling queue + spec-band entry UI.  
- Maintenance: PM calendar + parts reservation panel.

> This blueprint is intentionally opinionated but modular—adjust thresholds, policies, and nomenclature to match Sai Hari Papers’ operations.

