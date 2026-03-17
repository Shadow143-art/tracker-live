'use client';

import { Box, Card, Typography, TextField, Button, Alert, Link as MuiLink, CircularProgress, Divider } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const fadeInUp = {
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { role: 'student' },
        },
      });

      if (signupError) throw signupError;

      if (authData.session) {
        // Email confirmation is OFF — redirect immediately
        router.push('/profile/setup');
        router.refresh();
      } else if (authData.user) {
        // Email confirmation is ON — show verification screen
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card sx={{ p: 4, width: '100%', maxWidth: 440, borderRadius: 3, textAlign: 'center', boxShadow: '0 8px 32px rgba(10,102,194,0.10)', animation: 'fadeInUp 0.5s ease both', ...fadeInUp }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Verify your email
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          We've sent a verification link to:
        </Typography>
        <Typography variant="body1" fontWeight="bold" sx={{ mb: 3 }}>
          {email}
        </Typography>
        <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
          Click the link in your email to activate your account, then come back to sign in.
        </Alert>
        <Button variant="contained" component={Link} href="/login" fullWidth size="large" sx={{ py: 1.4 }}>
          Go to Sign In
        </Button>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 4, width: '100%', maxWidth: 440, borderRadius: 3, boxShadow: '0 8px 32px rgba(10,102,194,0.10)', animation: 'fadeInUp 0.5s ease both', ...fadeInUp }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
          <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SchoolIcon sx={{ color: 'white', fontSize: 26 }} />
          </Box>
        </Box>
        <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
          Join as Student
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Create your free account
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSignup}>
        <TextField
          fullWidth label="Email address" type="email" required margin="normal"
          value={email} onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          fullWidth label="Password (min 6 characters)" type="password" required margin="normal"
          value={password} onChange={(e) => setPassword(e.target.value)}
          inputProps={{ minLength: 6 }}
        />
        <TextField
          fullWidth label="Confirm Password" type="password" required margin="normal"
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          fullWidth type="submit" variant="contained" color="primary" size="large"
          disabled={loading}
          sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 700, boxShadow: '0 4px 14px rgba(10,102,194,0.3)' }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
        </Button>
      </form>

      <Divider sx={{ my: 2 }}><Typography variant="caption" color="text.secondary">OR</Typography></Divider>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <MuiLink component={Link} href="/login" underline="hover" color="primary" sx={{ fontWeight: 700 }}>
            Sign In
          </MuiLink>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <MuiLink component={Link} href="/" underline="hover" color="text.secondary">
            ← Back to home
          </MuiLink>
        </Typography>
      </Box>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #e8f0fe 0%, #f3f2ef 60%, #ffffff 100%)',
        px: 2,
      }}
    >
      <Suspense fallback={<CircularProgress />}>
        <SignupForm />
      </Suspense>
    </Box>
  );
}
