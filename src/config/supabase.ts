import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load local developer secrets before this module validates its environment.
config({ path: '.env.local' });
config({ path: '.env' });
const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !secretKey) throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY are required');
export const supabase = createClient(url, secretKey, { auth: { autoRefreshToken: false, persistSession: false } });
export const MEDIA_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'media';
