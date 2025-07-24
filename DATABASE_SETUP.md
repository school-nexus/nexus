# 🗄️ School Nexus Database Setup Guide

This guide will help you set up the complete database for the School Nexus application with full CRUD functionality.

## 📋 Prerequisites

- [Supabase](https://supabase.com) account and project
- Environment variables configured in `.env.local`

## 🚀 Quick Setup

### 1. Environment Configuration

Ensure your `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for setup script)
```

### 2. Database Schema Setup

**Option A: Manual Setup (Recommended)**

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the entire content from `database/schema.sql`
4. Paste and execute the SQL

**Option B: Automated Setup (If service role key is available)**

```bash
npm run setup-db
```

## 📊 Database Schema Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | User profiles (extends auth.users) | Role-based access control |
| `academic_years` | Academic year management | Current year tracking |
| `terms` | Academic terms/sessions | Date ranges, fees, status |
| `subjects` | Subject/course catalog | Categories, credits, curriculum |
| `classes` | Class/classroom management | Capacity, teacher assignment |
| `students` | Student profiles | Personal, academic, parent info |
| `teachers` | Teacher profiles | Professional, contact details |
| `exams` | Examination management | Scheduling, subjects, classes |
| `student_fees` | Fee management | Payments, status tracking |
| `attendance` | Attendance tracking | Daily records per subject |

### Relationship Tables

| Table | Purpose |
|-------|---------|
| `class_subjects` | Links classes to subjects |
| `teacher_subjects` | Links teachers to subjects they teach |
| `student_exam_results` | Stores exam results |

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies:

- **Admin**: Full access to all data
- **Teachers**: Can view students and manage their assigned classes
- **Students**: Can only view their own data
- **Authenticated Users**: Basic read access to public data

### Automatic Features

- **Updated Timestamps**: Automatic `updated_at` field updates
- **UUID Primary Keys**: All tables use UUID for security
- **Data Validation**: Enum types for status fields
- **Foreign Key Constraints**: Data integrity enforcement

## 🛠️ CRUD Operations

### Available Services

All CRUD operations are handled through TypeScript services in `lib/database.ts`:

```typescript
import { 
  studentsService, 
  teachersService, 
  subjectsService, 
  classesService, 
  termsService, 
  examsService, 
  studentFeesService 
} from '@/lib/database'
```

### Usage Examples

**Create a Student:**
```typescript
const newStudent = await studentsService.create({
  student_id: 'STU-001',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  // ... other fields
})
```

**Fetch All Teachers:**
```typescript
const teachers = await teachersService.getAll()
// Returns teachers with their assigned subjects
```

**Update a Subject:**
```typescript
const updated = await subjectsService.update(subjectId, {
  name: 'Updated Subject Name',
  total_marks: 100
})
```

**Delete a Class:**
```typescript
await classesService.delete(classId)
```

## 📈 Data Flow

### Client-Side State Management

Each page follows this pattern:

1. **Server Component** fetches initial data
2. **Client Component** manages local state
3. **Form Submissions** call database services
4. **Real-time Updates** reflect changes immediately
5. **Error Handling** with toast notifications

### Example Flow (Students Page):

```
app/students/page.tsx (Server)
    ↓ Fetches initial data
components/students/StudentsClient.tsx (Client)
    ↓ Manages state & interactions
components/forms/StudentRegistrationForm.tsx
    ↓ Form submission
lib/database.ts → studentsService.create()
    ↓ Database operation
Supabase Database
```

## 🔄 Real-time Features

The application supports real-time updates through:

- **Optimistic Updates**: UI updates immediately
- **Error Rollback**: Reverts on failure
- **Toast Notifications**: Success/error feedback
- **Auto-refresh**: Data synchronization

## 🧪 Testing Database Operations

### 1. Test Student Management
- Add a new student through the registration form
- View student details in the modal
- Edit student information
- Delete a student record

### 2. Test Teacher Management
- Register a new teacher with subjects
- Assign subjects to existing teachers
- Update teacher professional details
- Remove teacher records

### 3. Test Academic Data
- Create new subjects with curriculum details
- Set up classes with teacher assignments
- Manage academic terms with dates and fees
- Schedule exams for specific classes/subjects

## 🔧 Troubleshooting

### Common Issues

**1. Permission Denied Errors**
- Check RLS policies are correctly set
- Verify user role in user metadata
- Ensure proper authentication

**2. Foreign Key Violations**
- Verify referenced records exist
- Check cascade delete settings
- Validate data relationships

**3. Connection Issues**
- Verify environment variables
- Check Supabase project status
- Validate network connectivity

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

Database operations will log detailed information to console.

## 📊 Database Monitoring

### Supabase Dashboard Features

1. **Table Editor**: View and edit data directly
2. **SQL Editor**: Run custom queries
3. **API Logs**: Monitor API calls
4. **Performance**: Query performance metrics
5. **Auth**: User management and roles

### Key Metrics to Monitor

- Table row counts
- Query performance
- Error rates
- User session activity
- Storage usage

## 🔄 Backup & Migration

### Automatic Backups

Supabase provides automatic daily backups. Access through:
1. Dashboard → Settings → Database
2. Download backup files
3. Restore from backup points

### Manual Export

```sql
-- Export all school data
SELECT * FROM students;
SELECT * FROM teachers;
SELECT * FROM classes;
-- ... etc
```

### Data Migration

For moving between environments:
1. Export schema: `pg_dump --schema-only`
2. Export data: `pg_dump --data-only`
3. Import to new instance

## 🎯 Best Practices

### Performance
- Use appropriate indexes (already configured)
- Limit large queries with pagination
- Use select specific columns when possible
- Monitor slow query logs

### Security
- Never expose service role key in client
- Validate all input data
- Use RLS for data access control
- Regular security audits

### Maintenance
- Monitor database size growth
- Regular backup verification
- Update dependencies
- Performance monitoring

## 🆘 Support

For issues:
1. Check this documentation
2. Review Supabase logs
3. Test with simplified queries
4. Contact support with specific error messages

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [TypeScript with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

---

🎉 **Your School Nexus database is now fully configured and ready for production use!**