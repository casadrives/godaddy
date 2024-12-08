-- Create system_logs table
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON public.system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON public.system_logs(action);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at);

-- Add RLS policies
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to read all logs
CREATE POLICY "Admins can read all logs"
    ON public.system_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Policy to allow users to create their own logs
CREATE POLICY "Users can create their own logs"
    ON public.system_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
    action text,
    entity_type text,
    entity_id uuid,
    details jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_log_id uuid;
BEGIN
    -- Get current user ID
    v_user_id := auth.uid();
    
    -- Insert log entry
    INSERT INTO public.system_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        ip_address
    )
    VALUES (
        v_user_id,
        action,
        entity_type,
        entity_id,
        details,
        current_setting('request.headers')::json->>'x-forwarded-for'
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$;
