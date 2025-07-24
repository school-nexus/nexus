-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'accountant', 'student');
CREATE TYPE status_type AS ENUM ('active', 'inactive', 'suspended', 'completed', 'pending');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE payment_status AS ENUM ('paid', 'partial', 'pending', 'overdue');
CREATE TYPE exam_status AS ENUM ('scheduled', 'ongoing', 'completed', 'cancelled');
CREATE TYPE term_status AS ENUM ('upcoming', 'active', 'completed', 'suspended');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic years table
CREATE TABLE public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Terms table
CREATE TABLE public.terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    exam_start DATE,
    exam_end DATE,
    result_date DATE,
    status term_status DEFAULT 'upcoming',
    total_weeks INTEGER,
    holiday_days INTEGER,
    fee_amount DECIMAL(12,2),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    credits INTEGER,
    total_marks INTEGER,
    passing_marks INTEGER,
    duration_hours INTEGER,
    objectives TEXT,
    syllabus TEXT,
    prerequisites TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes table
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    section TEXT NOT NULL,
    grade TEXT NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    class_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    room TEXT,
    capacity INTEGER,
    current_students INTEGER DEFAULT 0,
    schedule TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, section, academic_year_id)
);

-- Class subjects mapping
CREATE TABLE public.class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, subject_id)
);

-- Students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender gender_type,
    address TEXT,
    blood_group TEXT,
    photo_url TEXT,
    
    -- Parent/Guardian information
    parent_name TEXT,
    parent_phone TEXT,
    parent_email TEXT,
    
    -- Academic information
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    roll_number TEXT,
    admission_date DATE,
    admission_number TEXT UNIQUE,
    
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers table
CREATE TABLE public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender gender_type,
    address TEXT,
    photo_url TEXT,
    
    -- Professional information
    designation TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience INTEGER,
    joining_date DATE NOT NULL,
    salary DECIMAL(12,2),
    
    -- Emergency contact
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    
    status status_type DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teacher subjects mapping
CREATE TABLE public.teacher_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, subject_id)
);

-- Exams table
CREATE TABLE public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    term_id UUID REFERENCES terms(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INTEGER,
    total_marks INTEGER NOT NULL,
    passing_marks INTEGER,
    instructions TEXT,
    venue TEXT,
    status exam_status DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student exam results
CREATE TABLE public.student_exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained INTEGER,
    grade TEXT,
    remarks TEXT,
    is_absent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- Fee types table
CREATE TABLE public.fee_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student fees table
CREATE TABLE public.student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    term_id UUID REFERENCES terms(id) ON DELETE CASCADE,
    fee_type_id UUID REFERENCES fee_types(id) ON DELETE CASCADE,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    late_fee_penalty DECIMAL(12,2) DEFAULT 0,
    due_date DATE NOT NULL,
    payment_date DATE,
    payment_method TEXT,
    description TEXT,
    status payment_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL,
    is_present BOOLEAN NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, attendance_date, subject_id)
);

-- Create indexes for better performance
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_teachers_employee_id ON teachers(employee_id);
CREATE INDEX idx_exams_class_subject ON exams(class_id, subject_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_student_fees_status ON student_fees(status);
CREATE INDEX idx_users_role ON users(role);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Admin and teachers can view all students
CREATE POLICY "Admin and teachers can view students" ON public.students FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'teacher')
    )
);

-- Students can view their own data
CREATE POLICY "Students can view own data" ON public.students FOR SELECT 
USING (user_id = auth.uid());

-- Admin can manage all data
CREATE POLICY "Admin full access" ON public.students FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
    )
);

-- Similar policies for other tables (teachers, classes, etc.)
CREATE POLICY "Admin and teachers can view teachers" ON public.teachers FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('admin', 'teacher')
    )
);

CREATE POLICY "Admin can manage teachers" ON public.teachers FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
    )
);

-- Public read access for some tables (can be restricted as needed)
CREATE POLICY "Authenticated users can view classes" ON public.classes FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view subjects" ON public.subjects FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view terms" ON public.terms FOR SELECT 
USING (auth.role() = 'authenticated');

-- Admin can manage all core data
CREATE POLICY "Admin can manage classes" ON public.classes FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
    )
);

CREATE POLICY "Admin can manage subjects" ON public.subjects FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
    )
);

CREATE POLICY "Admin can manage terms" ON public.terms FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
    )
);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_terms_updated_at BEFORE UPDATE ON public.terms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_fees_updated_at BEFORE UPDATE ON public.student_fees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
-- Default academic year
INSERT INTO public.academic_years (name, start_date, end_date, is_current) VALUES
('2024-2025', '2024-02-01', '2024-12-15', true);

-- Default subjects
INSERT INTO public.subjects (code, name, category, total_marks, passing_marks) VALUES
('ENG', 'English', 'Core', 100, 40),
('MATH', 'Mathematics', 'Core', 100, 40),
('SCI', 'Science', 'Core', 100, 40),
('SST', 'Social Studies', 'Core', 100, 40),
('RE', 'Religious Education', 'Core', 100, 40),
('PE', 'Physical Education', 'Optional', 50, 20),
('ART', 'Art', 'Optional', 50, 20),
('MUS', 'Music', 'Optional', 50, 20);

-- Default fee types
INSERT INTO public.fee_types (name, description, amount, is_mandatory) VALUES
('Tuition Fee', 'Monthly tuition fee', 500000, true),
('Library Fee', 'Library usage fee', 50000, true),
('Laboratory Fee', 'Science laboratory fee', 75000, false),
('Sports Fee', 'Sports and games fee', 25000, false),
('Transport Fee', 'School transport fee', 100000, false),
('Exam Fee', 'Examination fee', 30000, true),
('Admission Fee', 'One-time admission fee', 200000, true),
('Miscellaneous Fee', 'Other fees', 0, false);