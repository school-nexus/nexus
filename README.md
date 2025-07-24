# School Nexus - PWA School Management System

A comprehensive Progressive Web Application (PWA) for school management with offline capabilities, built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Core Management Modules
- **Dashboard** - Overview with statistics, charts, and recent activities
- **Students Management** - Registration, profiles, and tracking
- **Teachers Management** - Staff management and subject assignments
- **Fee Collection** - Payment tracking and financial management
- **Subjects Management** - Academic subjects and curriculum
- **Exams Management** - Scheduling and assessment tracking
- **Terms Management** - Academic periods and sessions

### PWA Features
- 📱 **Offline Support** - Works without internet connection
- 🔄 **Background Sync** - Data syncs when connection returns
- 📲 **Installable** - Can be installed on mobile and desktop
- 🔔 **Push Notifications** - Real-time updates and alerts
- ⚡ **Fast Loading** - Cached resources for quick access
- 📊 **Responsive Design** - Works on all device sizes

### Authentication & Security
- 🔐 **Role-based Access Control** (Admin, Teacher, Accountant, Student)
- 🌐 **Supabase Authentication** - Secure login with email/password
- 🛡️ **Protected Routes** - Middleware-based route protection
- 👤 **User Profiles** - Personalized experience by role

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: Supabase (Auth, Database, Real-time)
- **Charts**: Recharts
- **PWA**: Service Worker, Web App Manifest
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
school-nexus/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard page
│   ├── students/            # Students management
│   ├── teachers/            # Teachers management
│   ├── fees/                # Fee collection
│   ├── subjects/            # Subjects management
│   ├── exams/               # Exams management
│   ├── terms/               # Terms management
│   ├── login/               # Authentication
│   ├── offline/             # Offline fallback
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # Reusable components
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard components
│   └── layout/              # Layout components
├── utils/                   # Utility functions
│   └── supabase/            # Supabase configuration
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service worker
└── middleware.ts            # Route protection
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Demo Credentials

For testing purposes, use these demo credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@schoolnexus.com | admin123 |
| **Teacher** | teacher@schoolnexus.com | teacher123 |
| **Student** | student@schoolnexus.com | student123 |
| **Accountant** | accountant@schoolnexus.com | accountant123 |

## 🎯 User Roles & Permissions

### Admin (Full Access)
- All dashboard statistics
- Complete student and teacher management
- Fee collection oversight
- System settings and configuration
- Academic management (subjects, exams, terms)

### Teacher
- Student profiles and class information
- Subject assignments
- Exam scheduling and management
- Limited dashboard access

### Accountant
- Fee collection and payment tracking
- Student financial records
- Payment reports and analytics

### Student
- Personal dashboard
- Subject information
- Exam schedules and results
- Payment status

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the application in your browser
2. Look for the install prompt in the address bar
3. Click "Install" to add to your desktop

### Mobile (Android/iOS)
1. Open in Chrome (Android) or Safari (iOS)
2. Tap the share button
3. Select "Add to Home Screen"
4. Follow the prompts

## 🔧 Configuration

### Supabase Setup

1. **Create Tables** (Basic structure):
   ```sql
   -- Students table
   CREATE TABLE students (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT UNIQUE,
     phone TEXT,
     class TEXT,
     status TEXT DEFAULT 'active',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Teachers table
   CREATE TABLE teachers (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT UNIQUE,
     phone TEXT,
     subject TEXT,
     status TEXT DEFAULT 'active',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Fees table
   CREATE TABLE fees (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     student_id UUID REFERENCES students(id),
     amount DECIMAL(10,2),
     paid_amount DECIMAL(10,2) DEFAULT 0,
     due_date DATE,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **Enable Row Level Security (RLS)**
3. **Set up Authentication Policies**

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |

## 🔄 Offline Functionality

The application provides robust offline support:

- **Cached Pages**: All visited pages are cached
- **Offline Data**: Previously loaded data remains accessible
- **Background Sync**: Changes sync when connection returns
- **Offline Indicator**: Visual feedback for connection status
- **Fallback Pages**: Custom offline experience

## 📈 Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Components load on demand
- **Caching Strategy**: Efficient service worker caching
- **Bundle Analysis**: Optimized bundle sizes

## 🎨 Customization

### Theming
- Modify `tailwind.config.js` for custom colors
- Update CSS variables in `globals.css`
- Customize component styles in respective files

### Adding New Features
1. Create new page in `app/` directory
2. Add route to `middleware.ts` if protected
3. Update navigation in `components/layout/Sidebar.tsx`
4. Add role-based permissions as needed

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review demo credentials for testing

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced reporting dashboard
- [ ] Mobile app (React Native)
- [ ] Parent portal
- [ ] Attendance tracking
- [ ] Grade management
- [ ] Library management
- [ ] Transport management
- [ ] Hostel management
- [ ] Inventory management

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Supabase.