import { NextFunction, Request, Response } from 'express';
import { supabase } from '@/lib/supabase';

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get the user's role from our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, status')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if the user is an admin and their status is approved
    if (userData.role !== 'admin' || userData.status !== 'approved') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Add user data to request for use in route handlers
    req.user = {
      id: user.id,
      email: user.email!,
      role: userData.role,
      status: userData.status
    };

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
