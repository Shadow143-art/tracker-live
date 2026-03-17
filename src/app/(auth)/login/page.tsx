'use client';
import { Box, Card, Typography, TextField, Button, Alert, Link as MuiLink, CircularProgress } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const fadeInUp = {
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_profile_completed')
        .eq('id', data.user.id)
        .single();

      if (!profile?.is_profile_completed) {
        router.push('/profile/setup');
      } else if (profile?.role === 'staff') {
        router.push('/staff');
      } else {
        router.push('/student');
      }
      router.refresh();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #e8f0fe 0%, #f3f2ef 60%, #ffffff 100%)',
        px: 2,
        ...fadeInUp,
      }}
    >
      <Card
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 440,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(10,102,194,0.10)',
          animation: 'fadeInUp 0.5s ease both',
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LockOpenIcon sx={{ color: 'white', fontSize: 26 }} />
            </Box>
          </Box>
          <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome back to Tracker
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth label="Email address" type="email" required margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <TextField
            fullWidth label="Password" type="password" required margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button
            fullWidth type="submit" variant="contained" color="primary" size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 700, boxShadow: '0 4px 14px rgba(10,102,194,0.3)' }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <MuiLink component={Link} href="/" underline="hover" color="text.secondary" variant="body2">
            ← Back to home
          </MuiLink>
        </Box>
      </Card>
    </Box>
  );
}
