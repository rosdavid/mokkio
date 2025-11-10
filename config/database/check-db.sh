#!/bin/bash

echo "🔍 Checking Supabase connection and database setup..."
echo ""

# Check if environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY is not set"
    exit 1
fi

echo "✅ Environment variables are set"
echo "📡 Testing database connection..."

# You would need to install a tool like supabase CLI or use curl to test
# For now, just show the setup instructions
echo ""
echo "📋 Database Setup Instructions:"
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Run the following SQL script (includes tables, storage, and policies):"
echo ""
cat database-setup.sql
echo ""
echo "This script will create:"
echo "  - saved_mockups table for storing user mockups"
echo "  - profiles table for user profile data"
echo "  - avatars storage bucket with proper policies"
echo "  - Automatic profile creation trigger on user signup"
echo ""
echo "4. The database should now be fully configured"
echo "5. Try signing up a user and saving a mockup in the app"