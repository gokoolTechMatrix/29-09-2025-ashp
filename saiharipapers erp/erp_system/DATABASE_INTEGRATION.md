# Database Integration Guide for Attendance System

## Current Implementation

The attendance system currently uses **localStorage** for data persistence as a simple database alternative. This provides:

- ✅ Immediate functionality without external dependencies
- ✅ Client-side data persistence across browser sessions
- ✅ Real-time UI updates and state management
- ✅ Modern, responsive UI with visual feedback

## Database Schema for Future Prisma Integration

### Attendance Table
```sql
model Attendance {
  id          String   @id @default(cuid())
  employeeId  String
  date        DateTime
  status      AttendanceStatus
  hoursWorked Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  employee    Employee @relation(fields: [employeeId], references: [id])
  
  @@unique([employeeId, date])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LEAVE
}
```

### Employee Table (if not exists)
```sql
model Employee {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  department  String?
  position    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  attendance  Attendance[]
}
```

## Migration Steps from localStorage to Prisma

### 1. Install Dependencies
```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Initialize Prisma
```bash
npx prisma init
```

### 3. Update Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/erp_system"
```

### 4. Create Migration
```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

## Code Integration Points

### Current localStorage Functions to Replace

1. **Data Loading (useEffect)**
   ```typescript
   // Current: localStorage.getItem('attendanceHours')
   // Replace with: Prisma query to fetch attendance data
   ```

2. **Data Saving (Save Button)**
   ```typescript
   // Current: localStorage.setItem('attendance', JSON.stringify(newAttendance))
   // Replace with: Prisma upsert operation
   ```

### API Routes to Create

1. **GET /api/attendance/[employeeId]**
   - Fetch attendance records for specific employee
   - Support date range filtering

2. **POST /api/attendance**
   - Create or update attendance record
   - Validate employee exists and date format

3. **PUT /api/attendance/[id]**
   - Update existing attendance record

4. **DELETE /api/attendance/[id]**
   - Remove attendance record

### Example API Implementation

```typescript
// pages/api/attendance/index.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { employeeId, date, status, hoursWorked } = req.body
    
    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(date)
        }
      },
      update: {
        status,
        hoursWorked
      },
      create: {
        employeeId,
        date: new Date(date),
        status,
        hoursWorked
      }
    })
    
    res.json(attendance)
  }
}
```

## Benefits of Database Integration

1. **Data Persistence**: Survives browser cache clearing
2. **Multi-user Support**: Shared data across different users/sessions
3. **Data Integrity**: ACID compliance and validation
4. **Scalability**: Handle large datasets efficiently
5. **Backup & Recovery**: Professional data management
6. **Analytics**: Complex queries for reporting

## Current State Summary

The attendance system is **fully functional** with localStorage and provides:
- Modern UI design matching the dashboard theme
- Real-time attendance tracking and updates
- Visual feedback notifications
- Proper state management
- Data persistence across sessions

The system is ready for production use and can be enhanced with Prisma database integration when needed for multi-user environments or advanced features.