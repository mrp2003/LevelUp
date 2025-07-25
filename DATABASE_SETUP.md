# LevelUp Fitness Tracker - Database Setup Guide

## Overview
This guide will help you set up a Supabase PostgreSQL database for the LevelUp Fitness Tracker application. Supabase is free, easy to use, and perfect for multi-user applications.

## 1. Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project:
   - Project name: `levelup-fitness`
   - Database password: (choose a secure password)
   - Region: (select closest to your users)

## 2. Database Schema

Execute the following SQL commands in your Supabase SQL Editor:

### Users Table
```sql
-- Enable Row Level Security
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);
```

### Machines Table
```sql
CREATE TABLE IF NOT EXISTS public.machines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own machines" ON public.machines
    FOR ALL USING (auth.uid() = user_id);
```

### Exercises Table
```sql
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('bodyweight', 'machine')) NOT NULL,
    machine_id UUID REFERENCES public.machines(id) ON DELETE SET NULL,
    muscle_groups TEXT[] NOT NULL DEFAULT '{}',
    time_per_rep INTEGER NOT NULL DEFAULT 2,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own exercises" ON public.exercises
    FOR ALL USING (auth.uid() = user_id);
```

### Workout Plans Table
```sql
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_time INTEGER NOT NULL DEFAULT 0, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workout plans" ON public.workout_plans
    FOR ALL USING (auth.uid() = user_id);
```

### Workout Plan Exercises Table (Junction Table)
```sql
CREATE TABLE IF NOT EXISTS public.workout_plan_exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    rest_time INTEGER NOT NULL DEFAULT 30, -- seconds
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.workout_plan_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage workout plan exercises" ON public.workout_plan_exercises
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans wp 
            WHERE wp.id = workout_plan_id AND wp.user_id = auth.uid()
        )
    );
```

### Goals Table
```sql
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    target_date DATE NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals" ON public.goals
    FOR ALL USING (auth.uid() = user_id);
```

### Workout Sessions Table
```sql
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    calories_burned INTEGER,
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workout sessions" ON public.workout_sessions
    FOR ALL USING (auth.uid() = user_id);
```

### User Profiles Table (Extended user data)
```sql
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    theme VARCHAR(20) DEFAULT 'dawn',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = user_id);
```

## 3. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## 5. Supabase Client Configuration

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 6. Authentication Setup

Update your AuthContext to use Supabase:

```typescript
// In src/contexts/AuthContext.tsx
import { supabase } from '@/lib/supabase'

const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username, // or implement custom username login
      password: password
    })
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}
```

## 7. Database Functions (Optional)

### Auto-update timestamps
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON public.machines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON public.exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at BEFORE UPDATE ON public.workout_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 8. Sample Data (Optional)

```sql
-- Insert sample user (for testing)
INSERT INTO public.users (name, username, password_hash) VALUES 
('Demo User', 'demo', '$2b$10$example_hash_here');

-- Get the user ID for sample data
-- Replace 'user_id_here' with actual UUID from users table
```

## 9. Deployment Notes

### Free Tier Limits:
- **Database**: 500MB storage
- **Bandwidth**: 5GB per month
- **Requests**: 50,000 per month
- **Users**: Unlimited

### Scaling:
- Pro plan: $25/month for more resources
- Team plan: $599/month for collaboration features

## 10. Security Best Practices

1. **Row Level Security (RLS)**: Already enabled on all tables
2. **Environment Variables**: Never commit `.env.local` to version control
3. **API Keys**: Use anon key for client-side, service role key for server-side only
4. **Password Hashing**: Use bcrypt or similar for password hashing
5. **Input Validation**: Always validate and sanitize user inputs

## 11. Backup Strategy

Supabase automatically backs up your database, but for production:
1. Enable Point-in-Time Recovery (PITR) in Supabase dashboard
2. Set up regular database dumps
3. Monitor database performance and usage

This setup provides a robust, scalable foundation for your multi-user fitness tracking application with proper data isolation and security.