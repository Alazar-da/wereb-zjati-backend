import bcrypt from 'bcryptjs'; import { MEDIA_BUCKET, supabase } from './supabase';
export default async function bootstrapSuperAdmin() {
  const { data: bucket } = await supabase.storage.getBucket(MEDIA_BUCKET);
  if (!bucket) await supabase.storage.createBucket(MEDIA_BUCKET, { public: true });
  else if (!bucket.public) await supabase.storage.updateBucket(MEDIA_BUCKET, { public: true });
  const username = process.env.SUPER_ADMIN_USERNAME;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (!username || !password || password === 'replace-before-starting') return;
  const passwordHash = await bcrypt.hash(password, 12);
  const { data: existing, error: lookupError } = await supabase.from('app_users').select('id').eq('username', username).maybeSingle();
  if (lookupError) throw lookupError;
  if (!existing) {
    const { error } = await supabase.from('app_users').insert({ username, password_hash: passwordHash, role: 'super_admin' });
    if (error) throw error;
    console.log(`Super admin created: ${username}`);
  } else {
    const { error } = await supabase.from('app_users').update({ password_hash: passwordHash, role: 'super_admin' }).eq('id', existing.id);
    if (error) throw error;
    console.log(`Super admin synchronized: ${username}`);
  }
}
