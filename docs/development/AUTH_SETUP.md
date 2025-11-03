# Mokkio Authentication Setup

This guide will help you set up the complete authentication system with Supabase for Mokkio.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

### 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings → API
3. Copy the following values:
   - Project URL
   - Project API Key (anon/public)
   - Project API Key (service_role) - **Keep this secret!**

### 3. Configure Environment Variables

Update your `.env.local` file with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Enable Row Level Security (Optional)

For production, you should enable RLS on your tables and create proper policies.

## Database Setup (Optional)

If you want to store additional user data, create a `profiles` table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  disabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## Admin Setup

### 1. Create an Admin User

After setting up authentication, you'll need to manually set a user as admin. You can do this by updating the user's metadata in Supabase:

1. Go to Authentication → Users in your Supabase dashboard
2. Find the user you want to make admin
3. Click on the user and add to "User Metadata":
   ```json
   {
     "role": "admin"
   }
   ```

### 2. Access Admin Panel

Once you have an admin user, you can access the admin panel at `/admin`.

## Features Included

### ✅ Authentication

- Sign up with email/password
- Sign in with email/password
- Password reset
- Session management
- Protected routes

### ✅ Admin Panel

- View all users
- Disable/enable user accounts
- User analytics (total users, recent signups)
- Real-time online users count

### ✅ Real-time Presence

- Track online users
- Real-time updates when users join/leave

### ✅ API Endpoints

- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/[userId]` - Update user status
- `GET /api/admin/analytics` - Get analytics data

## Usage

### For Users

1. Click the "Sign In / Sign Up" button in the side menu
2. Create an account or sign in
3. Your session will be maintained across browser sessions

### For Admins

1. Sign in with an admin account
2. Navigate to `/admin`
3. View user management and analytics

## Security Notes

- The service role key should never be exposed to the client-side
- Admin routes are protected by middleware (basic implementation)
- For production, implement proper JWT validation in middleware
- Consider implementing rate limiting for auth endpoints

## Next Steps

1. Set up your Supabase project
2. Configure the environment variables
3. Test the authentication flow
4. Create your first admin user
5. Customize the UI as needed
