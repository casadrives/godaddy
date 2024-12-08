-- Create admin_permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    permissions JSONB DEFAULT '{}' NOT NULL,
    is_super_admin BOOLEAN DEFAULT false NOT NULL,
    UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to read all permissions
CREATE POLICY "Admins can read all permissions"
    ON public.admin_permissions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Policy to allow super admins to modify permissions
CREATE POLICY "Super admins can modify permissions"
    ON public.admin_permissions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_permissions
            WHERE admin_permissions.user_id = auth.uid()
            AND admin_permissions.is_super_admin = true
        )
    );

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at
CREATE TRIGGER update_admin_permissions_updated_at
    BEFORE UPDATE ON public.admin_permissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
