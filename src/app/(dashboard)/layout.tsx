'use client';

import { Box, Toolbar } from '@mui/material';
import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<'student' | 'staff' | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    async function fetchUserRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check user role from profile
      const { data: profile } = await supabase.from('profiles').select('role, is_profile_completed').eq('id', user.id).single();
      
      if (profile) {
        setRole(profile.role);
        
        // If profile isn't complete, force them to setup page unless they are already there
        if (!profile.is_profile_completed && !window.location.pathname.includes('/profile/setup')) {
          router.push('/profile/setup');
        }
      } else {
        // If no profile exists, create one from auth metadata
        const defaultRole = user.user_metadata?.role || 'student';
        const { data: newProfile, error } = await supabase.from('profiles').insert([
          { id: user.id, role: defaultRole, is_profile_completed: false }
        ]).select().single();
        
        if (!error && newProfile) {
          setRole(newProfile.role);
          if (!window.location.pathname.includes('/profile/setup')) {
            router.push('/profile/setup');
          }
        }
      }
      setLoading(false);
    }
    fetchUserRole();
  }, [router]);

  if (loading) return null;

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onDrawerToggle={handleDrawerToggle} />
      <Sidebar 
        mobileOpen={mobileOpen} 
        onDrawerToggle={handleDrawerToggle} 
        role={role} 
      />
      
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` }, bgcolor: 'background.default', minHeight: '100vh' }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </Box>
    </Box>
  );
}
