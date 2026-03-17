// One-time script to create a staff user in Supabase
// Run with: npx tsx scripts/create-staff.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hoqwvrofbvuzqahhuazl.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcXd2cm9mYnZ1enFhaGh1YXpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzczNTI5NSwiZXhwIjoyMDg5MzExMjk1fQ.SaY3T7aUMhZ2X_4IWbZk1McS8wksf9w_xT6qZjWO42w';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createStaffUser() {
  console.log('Creating staff user...');

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'staff0081@gmail.com',
    password: 'staff@123',
    email_confirm: true,
    user_metadata: { role: 'staff' },
  });

  if (authError) {
    console.error('❌ Error creating auth user:', authError.message);
    return;
  }

  console.log('✅ Auth user created:', authData.user.id);

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: authData.user.id,
    role: 'staff',
    full_name: 'Staff Admin',
    is_profile_completed: false,
  });

  if (profileError) {
    console.error('❌ Error creating profile:', profileError.message);
    return;
  }

  console.log('✅ Profile row created');
  console.log('\n🎉 Staff account ready:');
  console.log('   Email:    staff0081@gmail.com');
  console.log('   Password: staff@123');
}

createStaffUser();
