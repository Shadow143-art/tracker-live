'use client';

import { Box, Typography, Tabs, Tab, Grid, CircularProgress, Alert, Button, Avatar, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ConnectionsPage() {
  const [value, setValue] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [myConnections, setMyConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const loadConnections = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch pending requests where I am the receiver
      const { data: pending, error: pendingError } = await supabase
        .from('connections')
        .select(`
          id,
          requester:profiles!connections_requester_id_fkey(id, full_name, photo_url, role, department)
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;
      setPendingRequests(pending || []);

      // Fetch accepted connections (I am sender OR receiver)
      const { data: accepted, error: acceptedError } = await supabase
        .from('connections')
        .select(`
          id,
          requester:profiles!connections_requester_id_fkey(id, full_name, photo_url, role, department),
          receiver:profiles!connections_receiver_id_fkey(id, full_name, photo_url, role, department)
        `)
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (acceptedError) throw acceptedError;

      // Map out the "other" person in the accepted connection
      const mappedConnections = (accepted as any[])?.map((conn: any) => {
        const req: any = Array.isArray(conn.requester) ? conn.requester[0] : conn.requester;
        const rec: any = Array.isArray(conn.receiver) ? conn.receiver[0] : conn.receiver;
        const otherPerson = req.id === user.id ? rec : req;
        return { connId: conn.id, ...otherPerson };
      });
      
      setMyConnections(mappedConnections || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleConnectionAction = async (connectionId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status })
        .eq('id', connectionId);
        
      if (error) throw error;
      loadConnections(); // Reload state
    } catch (err) {
      console.error('Error updating connection:', err);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
        Manage Connections
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="connection tabs">
          <Tab label={`Pending Requests (${pendingRequests.length})`} />
          <Tab label={`My Connections (${myConnections.length})`} />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ mt: 3, px: 3 }}>
          <Grid container spacing={2}>
            {[1, 2, 3].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <>
          <CustomTabPanel value={value} index={0}>
            {pendingRequests.length === 0 ? (
              <Typography color="text.secondary">No pending requests.</Typography>
            ) : (
              <Grid container spacing={2}>
                {pendingRequests.map(req => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={req.id}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={req.requester.photo_url} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {req.requester.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {req.requester.role} • {req.requester.department}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" color="primary" onClick={() => handleConnectionAction(req.id, 'accepted')}>
                            Accept
                          </Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleConnectionAction(req.id, 'rejected')}>
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            {myConnections.length === 0 ? (
              <Typography color="text.secondary">You don't have any connections yet.</Typography>
            ) : (
              <Grid container spacing={2}>
                {myConnections.map(person => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={person.id}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={person.photo_url} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {person.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {person.role} • {person.department}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </CustomTabPanel>
        </>
      )}
    </Box>
  );
}
