'use client';

import { Box, Typography, Grid, Alert, Skeleton, Card, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import UserCard from '@/components/cards/UserCard';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';

export default function StudentDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadFeed() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .eq('is_profile_completed', true)
          .limit(20);

        if (profilesError) throw profilesError;

        const { data: connections, error: connectionsError } = await supabase
          .from('connections')
          .select('*')
          .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (connectionsError) throw connectionsError;

        const usersWithStatus = (profiles as any[]).map((profile: any) => {
          const connection = (connections as any[]).find((c: any) =>
            (c.requester_id === profile.id && c.receiver_id === user.id) ||
            (c.receiver_id === profile.id && c.requester_id === user.id)
          );
          return { ...profile, connectionStatus: connection ? connection.status : 'none' };
        });

        setUsers(usersWithStatus);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, [supabase]);

  const handleConnect = async (receiverId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('connections').insert([
        { requester_id: user.id, receiver_id: receiverId, status: 'pending' }
      ]);
      if (error) throw error;
      setUsers(users.map(u => u.id === receiverId ? { ...u, connectionStatus: 'pending' } : u));
    } catch (err: any) {
      console.error('Error sending request:', err);
    }
  };

  const handleMessage = (userId: string) => router.push(`/messages?user=${userId}`);

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
        Discover &amp; Connect
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find peers, mentors, and staff in your campus community.
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid size={{ xs: 12, md: 6 }} key={item}>
              <Card sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Skeleton variant="circular" width={64} height={64} sx={{ mr: 2, flexShrink: 0 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="50%" height={28} />
                    <Skeleton variant="text" width="35%" />
                    <Skeleton variant="text" width="80%" />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 20 }} />
                  <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 20 }} />
                </Box>
                <Skeleton variant="rounded" width={90} height={32} sx={{ borderRadius: 20, mt: 1 }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={3}>
            {users.map(user => (
              <Grid size={{ xs: 12, md: 6 }} key={user.id}>
                <UserCard
                  user={user}
                  connectionStatus={user.connectionStatus}
                  onConnect={handleConnect}
                  onMessage={handleMessage}
                />
              </Grid>
            ))}
          </Grid>

          {users.length === 0 && (
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No profiles on the feed yet.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Be the first to explore! Use Search to find specific people.
              </Typography>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={() => router.push('/search')}
              >
                Browse All Users
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
