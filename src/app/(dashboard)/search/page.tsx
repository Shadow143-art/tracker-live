'use client';

import { Box, Typography, TextField, Grid, InputAdornment, Button, CircularProgress, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import UserCard from '@/components/cards/UserCard';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [skill, setSkill] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const searchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let queryBuilder = supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id) // Don't search yourself
        .eq('is_profile_completed', true);

      if (query) {
        queryBuilder = queryBuilder.ilike('full_name', `%${query}%`);
      }
      if (department) {
        queryBuilder = queryBuilder.ilike('department', `%${department}%`);
      }
      if (skill) {
        queryBuilder = queryBuilder.contains('skills', [skill]);
      }
      if (roleFilter !== 'all') {
        queryBuilder = queryBuilder.eq('role', roleFilter);
      }

      const { data, error: searchError } = await queryBuilder.limit(30);

      if (searchError) throw searchError;
      
      // Fetch connections to map status
      const { data: connections, error: connectionsError } = await supabase
        .from('connections')
        .select('*')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (connectionsError) throw connectionsError;

      // Current user's role to determine messaging permissions
      const { data: currentProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

      // Map connection status to users
      const usersWithStatus = (data as any[]).map((profile: any) => {
        let status = 'none';

        if (currentProfile?.role === 'staff') {
           // Staff can message anyone they search (as per existing logic)
           status = 'accepted';
        } else {
           const connection = (connections as any[]).find((c: any) => 
             (c.requester_id === profile.id && c.receiver_id === user.id) ||
             (c.receiver_id === profile.id && c.requester_id === user.id)
           );
           
           if (connection) {
             status = connection.status;
           }
        }
        
        return { ...profile, connectionStatus: status };
      });
      
      setUsers(usersWithStatus || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (receiverId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('connections').insert([
        { requester_id: user.id, receiver_id: receiverId, status: 'pending' }
      ]);

      if (error) throw error;
      
      // Optimistically update UI
      setUsers(users.map(u => u.id === receiverId ? { ...u, connectionStatus: 'pending' } : u));
    } catch (err: any) {
      console.error('Error sending request:', err);
    }
  };

  const handleMessage = (userId: string) => {
    router.push(`/messages?user=${userId}`);
  };

  const handleSearchClick = () => {
    searchUsers();
  };

  // Perform initial search
  useEffect(() => {
    searchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        Global Search
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find peers, mentors, and staff across the campus network.
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchClick();
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="staff">Staff</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Department"
          variant="outlined"
          size="small"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          sx={{ minWidth: 150 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchClick();
          }}
        />
        <TextField
          label="Filter by Skill"
          variant="outlined"
          size="small"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          sx={{ minWidth: 150 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearchClick();
          }}
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
                onConnect={handleConnect}
                onMessage={handleMessage}
              />
            </Grid>
          ))}
          {!loading && users.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 4 }}>
                No users match your specific search criteria.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
