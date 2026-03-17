'use client';

import { Box, Typography, TextField, Grid, InputAdornment, Button, CircularProgress, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import UserCard from '@/components/cards/UserCard';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [skill, setSkill] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  // Load students by default
  const searchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let queryBuilder = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .eq('is_profile_completed', true);

      if (query) {
        queryBuilder = queryBuilder.ilike('full_name', `%${query}%`);
      }
      if (department) {
        queryBuilder = queryBuilder.ilike('department', `%${department}%`);
      }
      if (skill) {
        // Contains operator for arrays
        queryBuilder = queryBuilder.contains('skills', [skill]);
      }

      const { data, error: searchError } = await queryBuilder.limit(20);

      if (searchError) throw searchError;
      
      // Staff generally don't "Connect", they can straight up message students or view them
      // Assuming for this app Staff can just message them directly if they want
      const formattedData = (data as any[]).map((u: any) => ({ ...u, connectionStatus: 'accepted' }));
      
      setUsers(formattedData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchUsers();
  }, []);

  const handleMessage = (userId: string) => {
    router.push(`/messages?user=${userId}`);
  };

  const handleSearchClick = () => {
    searchUsers();
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        Staff Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Search and discover student profiles.
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Department"
          variant="outlined"
          size="small"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Filter by Skill"
          variant="outlined"
          size="small"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearchClick}>
          Search
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {users.map(user => (
            <Grid size={{ xs: 12, md: 6 }} key={user.id}>
              <UserCard 
                user={user} 
                connectionStatus={user.connectionStatus}
                onMessage={handleMessage}
              />
            </Grid>
          ))}
          {users.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 4 }}>
                No students match your search criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
