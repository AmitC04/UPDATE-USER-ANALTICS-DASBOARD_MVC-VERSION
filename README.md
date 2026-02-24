# 🎯 **USER ANALYTICS DASHBOARD - MVC VERSION**

## 📋 **EXECUTIVE SUMMARY**

**Project**: User Analytics & Activity Tracking Dashboard  
**Architecture**: Full-Stack MVC (Model-View-Controller)  
**Frontend**: Next.js 16 (App Router) + TypeScript + React 19  
**Backend**: Node.js + Express.js + Prisma ORM  
**Database**: MySQL 8 (Shared with EMS_DEMO_PROJECT_MAIN)  
**Status**: ✅ **Production Ready**

---

## ✅ **PROJECT OVERVIEW**

> **"A standalone, enterprise-grade analytics dashboard for comprehensive user activity tracking, conversion funnel analysis, and UX insights with real-time data visualization."**

This project provides a complete analytics solution that integrates seamlessly with existing EMS systems while maintaining complete isolation at the codebase level. It tracks user sessions, events, conversion funnels, and provides actionable insights through interactive dashboards.

---

## 🚀 **KEY FEATURES**

### 📊 **Analytics Capabilities**
- ✅ **Real-Time User Activity Tracking** - Session management and event logging
- ✅ **Conversion Funnel Analysis** - Multi-step funnel visualization and drop-off tracking
- ✅ **Revenue & Order Analytics** - Financial metrics and trending analysis
- ✅ **User Behavior Insights** - Page views, interactions, and engagement metrics
- ✅ **Audit Trail Management** - Comprehensive user action logging
- ✅ **Microsoft Clarity Integration** - Session replay and heatmap analysis

### 🎯 **Dashboard Components**
- **Overview Dashboard** - Today's key metrics (visitors, revenue, orders, users)
- **Conversion Funnel** - Visual funnel with step-by-step analysis
- **User Analytics** - Detailed user activity and engagement metrics
- **UX Insights** - Integration with Microsoft Clarity for session replays

### 🔒 **Security & Performance**
- ✅ JWT-based authentication
- ✅ Secure API endpoints with middleware protection
- ✅ Optimized database queries with Prisma ORM
- ✅ CORS configuration for cross-origin security
- ✅ Environment-based configuration management

---

## 📁 **PROJECT STRUCTURE**

```
UPDATE-USER-ANALTICS-DASBOARD_MVC-VERSION/
├── client/                          # Next.js Frontend (Port 3001)
│   ├── app/                         # Next.js App Router
│   │   ├── analytics/               # Analytics routes
│   │   │   ├── page.tsx            # Overview dashboard
│   │   │   ├── funnel/             # Conversion funnel
│   │   │   ├── users/              # User analytics
│   │   │   └── ux/                 # UX insights (Clarity)
│   │   ├── layout.tsx              # Root layout with Clarity
│   │   └── globals.css             # Global styles
│   ├── components/                  # React components
│   │   ├── ui/                     # Radix UI components
│   │   └── charts/                 # Recharts visualizations
│   ├── lib/                         # Utilities
│   │   └── api.ts                  # API client
│   ├── public/                      # Static assets
│   ├── package.json                 # Dependencies
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   └── tsconfig.json                # TypeScript config
│
└── server/                          # Express Backend (Port 4001)
    ├── src/
    │   ├── controllers/             # API Controllers
    │   │   └── analyticsController.js  # Analytics logic
    │   ├── routes/                  # API Routes
    │   │   └── analytics.js         # Analytics endpoints
    │   ├── middleware/              # Express middleware
    │   │   └── auth.js             # Authentication
    │   └── utils/                   # Utilities
    │       └── analyticsLogger.js   # Event logging utility
    ├── prisma/                      # Database ORM
    │   └── schema.prisma            # Database schema
    ├── package.json                 # Dependencies
    ├── .env.example                 # Environment template
    └── server.js                    # Express app entry

Root Files:
├── analytics_migration.sql          # Database migration script
├── emsdb_backup.sql                # Database backup
├── docker-compose.yml              # Docker configuration
├── .env                            # Root environment variables
├── .env.local                      # Local environment overrides
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

---

## 🗄️ **DATABASE ARCHITECTURE**

### ⚠️ **CRITICAL: Shared Database Setup**

**IMPORTANT**: This project uses the **SAME MySQL database** as `EMS_DEMO_PROJECT_MAIN`.

- **Database Name**: `cms_dev` (or as configured in your EMS project)
- **Connection**: Uses existing MySQL instance (Docker or local)
- **Migration**: Additive only - no modifications to existing tables
- **⚠️ DO NOT** create a new database

### 📊 **Analytics Tables Created**

The migration adds the following tables to your existing database:

#### 1. **user_sessions** - Session Tracking
```sql
- session_id (PK)
- session_token (Unique)
- user_id (FK to users)
- is_guest (Boolean)
- ip_address
- user_agent
- started_at
- last_activity_at
- ended_at
- duration_seconds
```

#### 2. **user_activity** - Event Logging
```sql
- activity_id (PK)
- user_id (FK to users)
- session_id (FK to user_sessions)
- is_guest (Boolean)
- event_type (ENUM: page_view, button_click, form_submit, etc.)
- page_url
- page_title
- referrer_url
- metadata (JSON)
- created_at
```

#### 3. **user_audit_log** - Audit Trail
```sql
- audit_id (PK)
- user_id (FK to users)
- action_type (ENUM: login, logout, profile_update, etc.)
- entity_type
- entity_id
- old_value (JSON)
- new_value (JSON)
- ip_address
- user_agent
- created_at
```

#### 4. **users Table Modifications**
Adds the following columns to existing `users` table:
- `registration_method` VARCHAR(50)
- `last_password_changed_at` DATETIME

### 🔗 **Table Relationships**
```
users (existing)
  ├── 1:many → user_sessions
  ├── 1:many → user_activity
  ├── 1:many → user_audit_log
  ├── 1:many → orders (existing)
  └── 1:many → notifications (existing)

user_sessions
  └── 1:many → user_activity
```

---

## 🛠️ **INSTALLATION & SETUP**

### **Prerequisites**

- ✅ Node.js 18+ and npm/yarn
- ✅ MySQL 8.0 (running via Docker or locally)
- ✅ Existing EMS_DEMO_PROJECT_MAIN setup
- ✅ Git

### **Step 1: Clone Repository**

```bash
git clone https://github.com/AmitC04/UPDATE-USER-ANALTICS-DASBOARD_MVC-VERSION.git
cd UPDATE-USER-ANALTICS-DASBOARD_MVC-VERSION
```

### **Step 2: Database Migration**

**CRITICAL**: Run this migration on your **existing EMS database**.

```bash
# Method 1: Using MySQL CLI
mysql -u root -p cms_dev < analytics_migration.sql

# Method 2: Using Docker (if MySQL is in Docker)
docker exec -i cms-mysql mysql -u root -p cms_dev < analytics_migration.sql

# Method 3: Import via MySQL Workbench
# File > Run SQL Script > Select analytics_migration.sql
```

**Verify Migration:**
```sql
-- Connect to database and verify tables
SHOW TABLES LIKE 'user_%';
-- Should show: user_sessions, user_activity, user_audit_log

-- Check users table modifications
DESCRIBE users;
-- Should include: registration_method, last_password_changed_at
```

### **Step 3: Backend Server Setup**

```bash
cd server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Configure `.env`:**
```env
# Database Configuration (MUST match EMS database)
DATABASE_URL="mysql://root:password@localhost:3306/cms_dev"

# Server Configuration
PORT=4001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3001

# JWT Configuration (use same as EMS if applicable)
JWT_SECRET=your-jwt-secret-key
```

**Generate Prisma Client:**
```bash
# Generate Prisma client from schema
npm run prisma:generate

# Verify database connection
npm run prisma:studio
# Opens Prisma Studio at http://localhost:5555
```

**Start Backend Server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Verify Backend:**
- Server running: `http://localhost:4001`
- Health check: `http://localhost:4001/health` (if implemented)
- API available: `http://localhost:4001/api/analytics/overview`

### **Step 4: Frontend Client Setup**

```bash
cd ../client

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env.local

# Edit .env.local if needed
nano .env.local
```

**Configure `.env.local`:**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4001

# Microsoft Clarity (optional)
NEXT_PUBLIC_CLARITY_ID=YOUR_CLARITY_PROJECT_ID
```

**Start Frontend:**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

**Verify Frontend:**
- Client running: `http://localhost:3001`
- Access dashboard: `http://localhost:3001/analytics`

---

## 📡 **API ENDPOINTS**

### **Analytics Overview**

#### **GET** `/api/analytics/overview`
Get today's key metrics.

**Response:**
```json
{
  "visitors": 1234,
  "users": 567,
  "revenue": 45678.90,
  "orders": 123,
  "trends": {
    "visitors": "+12%",
    "users": "+8%",
    "revenue": "+15%",
    "orders": "+10%"
  }
}
```

#### **GET** `/api/analytics/revenue-trend?months=5`
Get revenue trend over time.

**Query Parameters:**
- `months` (optional): Number of months (default: 6)

**Response:**
```json
{
  "data": [
    { "month": "Jan", "revenue": 12345.67 },
    { "month": "Feb", "revenue": 23456.78 }
  ]
}
```

### **Funnel Analytics**

#### **GET** `/api/analytics/funnel?startDate=2024-01-01&endDate=2024-12-31`
Get conversion funnel data.

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)

**Response:**
```json
{
  "funnel": [
    { "stage": "Visits", "users": 10000, "conversion": 100 },
    { "stage": "Cart", "users": 5000, "conversion": 50 },
    { "stage": "Checkout", "users": 2500, "conversion": 25 },
    { "stage": "Purchase", "users": 1000, "conversion": 10 }
  ]
}
```

### **User Analytics**

#### **GET** `/api/analytics/users?startDate=2024-01-01&endDate=2024-12-31`
Get user activity metrics.

**Query Parameters:**
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Response:**
```json
{
  "totalUsers": 5000,
  "activeUsers": 3000,
  "newUsers": 500,
  "engagement": {
    "avgSessionDuration": 420,
    "avgPagesPerSession": 5.2,
    "bounceRate": 35.5
  }
}
```

---

## 🔌 **INTEGRATION WITH EMS**

### **Analytics Logger Usage**

Integrate analytics tracking into your existing EMS application:

```javascript
// Import the analytics logger
const { logEvent, createOrUpdateSession } = require('./ANALYTICS_DASHBOARD/server/src/utils/analyticsLogger');

// 1. Create or update session (on user login/page load)
const session = await createOrUpdateSession({
  session_token: 'unique-session-token-from-cookie',
  user_id: req.user.id,  // or null for guests
  is_guest: !req.user,
  ip_address: req.ip,
  user_agent: req.headers['user-agent']
});

// 2. Log page view event
await logEvent({
  user_id: req.user?.id || null,
  session_id: session.session_id,
  is_guest: !req.user,
  event_type: 'page_view',
  page_url: req.originalUrl,
  page_title: 'Dashboard',
  referrer_url: req.headers.referer,
  metadata: { custom: 'data' }
});

// 3. Log user actions
await logEvent({
  user_id: req.user.id,
  session_id: session.session_id,
  is_guest: false,
  event_type: 'button_click',
  page_url: req.originalUrl,
  metadata: {
    button_id: 'checkout-btn',
    action: 'proceed_to_checkout'
  }
});

// 4. Log form submissions
await logEvent({
  user_id: req.user.id,
  session_id: session.session_id,
  is_guest: false,
  event_type: 'form_submit',
  page_url: '/registration',
  metadata: {
    form_name: 'registration_form',
    success: true
  }
});
```

### **Event Types**

Supported event types:
- `page_view` - Page navigation
- `button_click` - Button interactions
- `form_submit` - Form submissions
- `link_click` - Link clicks
- `search` - Search queries
- `download` - File downloads
- `video_play` - Video interactions
- `add_to_cart` - E-commerce actions
- `purchase` - Completed purchases
- `custom` - Custom events

---

## 🎨 **DASHBOARD ROUTES**

### **Available Routes**

| Route | Description |
|-------|-------------|
| `/analytics` | Overview dashboard with key metrics |
| `/analytics/funnel` | Conversion funnel visualization |
| `/analytics/users` | User activity and engagement |
| `/analytics/ux` | UX insights (Microsoft Clarity integration) |

### **Access Dashboard**

```bash
# Local Development
http://localhost:3001/analytics

# Production (configure your domain)
https://yourdomain.com/analytics
```

---

## 🔧 **MICROSOFT CLARITY INTEGRATION**

### **Setup Instructions**

1. **Sign Up for Microsoft Clarity**
   - Visit: https://clarity.microsoft.com/
   - Create a free account
   - Create a new project

2. **Get Project ID**
   - Navigate to your project settings
   - Copy the Project ID (format: `xxxxxxxxxx`)

3. **Configure in Application**
   
   Edit `client/app/layout.tsx`:
   ```typescript
   // Replace this line
   (window as any).clarity('init', 'YOUR_CLARITY_PROJECT_ID');
   
   // With your actual Project ID
   (window as any).clarity('init', 'abc123def456');
   ```

4. **Verify Integration**
   - Visit your dashboard
   - Check Clarity dashboard for incoming data
   - View session recordings and heatmaps

### **Features Available**

- ✅ **Session Recordings** - Watch user interactions
- ✅ **Heatmaps** - Visualize click patterns
- ✅ **Scroll Maps** - Analyze scroll behavior
- ✅ **Rage Clicks** - Identify frustration points
- ✅ **Dead Clicks** - Find non-functional elements

**Note**: Clarity data is stored externally by Microsoft and not in your database.

---

## 🧪 **TESTING & VALIDATION**

### **Backend Testing**

```bash
cd server

# Run API tests (if implemented)
npm test

# Test database connection
npm run prisma:studio

# Check API endpoints
curl http://localhost:4001/api/analytics/overview
```

### **Frontend Testing**

```bash
cd client

# Run component tests (if implemented)
npm test

# Build test
npm run build

# Lint code
npm run lint
```

### **Manual Testing Checklist**

- [ ] Database migration completed successfully
- [ ] Backend server starts without errors
- [ ] Frontend client starts without errors
- [ ] API endpoints return valid data
- [ ] Dashboard displays metrics correctly
- [ ] Charts render properly
- [ ] Funnel visualization works
- [ ] User analytics page loads
- [ ] MS Clarity tracking active (if configured)

---

## 🚀 **DEPLOYMENT**

### **Production Checklist**

#### **Backend Deployment**

- [ ] Update `DATABASE_URL` with production database
- [ ] Set `NODE_ENV=production`
- [ ] Configure production `JWT_SECRET`
- [ ] Update `CORS_ORIGIN` with production domain
- [ ] Enable SSL/TLS for database connection
- [ ] Set up process manager (PM2, systemd)
- [ ] Configure reverse proxy (nginx, Apache)
- [ ] Set up monitoring and logging

#### **Frontend Deployment**

- [ ] Update `NEXT_PUBLIC_API_URL` with production API
- [ ] Add production Microsoft Clarity ID
- [ ] Build production bundle: `npm run build`
- [ ] Deploy to hosting platform (Vercel, Netlify, custom server)
- [ ] Configure domain and SSL certificate
- [ ] Set up CDN (optional)
- [ ] Enable caching strategies

### **Deployment Platforms**

**Backend Options:**
- AWS EC2 / ECS
- Google Cloud Platform
- DigitalOcean Droplets
- Heroku
- Railway

**Frontend Options:**
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Cloudflare Pages
- Self-hosted with nginx

### **Environment Variables**

**Backend `.env` (Production):**
```env
DATABASE_URL=mysql://user:pass@production-host:3306/cms_prod
PORT=4001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=strong-production-secret
```

**Frontend `.env.local` (Production):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_CLARITY_ID=your-clarity-id
```

---

## 📊 **PERFORMANCE METRICS**

### **Expected Performance**

- **Database Queries**: < 50ms average
- **API Response Time**: < 200ms average
- **Page Load Time**: < 2s (First Contentful Paint)
- **Dashboard Rendering**: Real-time updates
- **Chart Animations**: 60 FPS

### **Optimization Tips**

1. **Database Indexing**
   ```sql
   -- Already included in migration
   CREATE INDEX idx_user_activity_user ON user_activity(user_id);
   CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
   ```

2. **API Caching**
   - Implement Redis caching for frequently accessed data
   - Set appropriate cache TTL values

3. **Frontend Optimization**
   - Enable Next.js image optimization
   - Implement code splitting
   - Use React.memo for expensive components

---

## 🛡️ **SECURITY CONSIDERATIONS**

### **Implemented Security**

- ✅ **JWT Authentication** - Secure API access
- ✅ **CORS Protection** - Configured allowed origins
- ✅ **SQL Injection Prevention** - Prisma ORM parameterized queries
- ✅ **Input Validation** - Server-side validation
- ✅ **Environment Variables** - Sensitive data protection
- ✅ **HTTPS Ready** - SSL/TLS support

### **Security Best Practices**

1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Protect Environment Files**
   - Never commit `.env` files
   - Use secure secret management (AWS Secrets Manager, etc.)

3. **Rate Limiting** (Recommended to add)
   ```javascript
   // Add to server
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

4. **API Key Protection**
   - Rotate JWT secrets regularly
   - Use strong, unique secrets

---

## 🐛 **TROUBLESHOOTING**

### **Common Issues**

#### **1. Database Connection Failed**

**Problem:** Cannot connect to MySQL database

**Solution:**
```bash
# Check if MySQL is running
docker ps  # For Docker
systemctl status mysql  # For systemd

# Verify DATABASE_URL in .env
# Ensure credentials and database name are correct

# Test connection
npx prisma db pull
```

#### **2. Prisma Client Not Found**

**Problem:** `@prisma/client` module not found

**Solution:**
```bash
cd server
npm run prisma:generate
npm install @prisma/client
```

#### **3. CORS Errors**

**Problem:** API requests blocked by CORS policy

**Solution:**
```javascript
// In server, update CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
```

#### **4. Port Already in Use**

**Problem:** Port 3001 or 4001 already in use

**Solution:**
```bash
# Find process using port
lsof -i :3001
lsof -i :4001

# Kill process
kill -9 <PID>

# Or change port in configuration
```

#### **5. Migration Errors**

**Problem:** Migration fails to run

**Solution:**
```bash
# Check if tables already exist
mysql -u root -p cms_dev -e "SHOW TABLES;"

# Drop conflicting tables (CAUTION!)
mysql -u root -p cms_dev -e "DROP TABLE IF EXISTS user_sessions, user_activity, user_audit_log;"

# Re-run migration
mysql -u root -p cms_dev < analytics_migration.sql
```

---

## 📚 **TECH STACK DETAILS**

### **Frontend Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 3.x | Utility-first CSS |
| Recharts | 2.x | Chart visualization library |
| Radix UI | Latest | Headless UI components |
| Lucide React | Latest | Icon library |

### **Backend Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.x | Web framework |
| Prisma | 5.x | ORM and database toolkit |
| MySQL | 8.0 | Relational database |
| JWT | Latest | Authentication tok