'use client';
import { Box, Button, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import Link from 'next/link';

const fadeInUp = {
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(24px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
};

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #dce8ff 0%, #f3f2ef 55%, #ffffff 100%)',
        ...fadeInUp,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        {/* Hero */}
        <Box sx={{ textAlign: 'center', mb: 8, animation: 'fadeInUp 0.6s ease both' }}>
          <Typography
            variant="h1"
            component="h1"
            color="primary"
            sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '3rem', md: '5rem' }, letterSpacing: '-2px' }}
          >
            Tracker
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ lineHeight: 1.6, opacity: 0.8, maxWidth: 520, mx: 'auto' }}>
            The campus networking platform connecting students and staff.
          </Typography>
        </Box>

        {/* Role Choice Cards */}
        <Grid container spacing={3} sx={{ animation: 'fadeInUp 0.6s ease 0.2s both', mb: 5 }}>
          {/* Student Card */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                border: '2px solid transparent',
                boxShadow: '0 4px 24px rgba(10,102,194,0.10)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  border: '2px solid',
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(10,102,194,0.18)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{
                    bgcolor: 'primary.main', borderRadius: '50%', width: 72, height: 72,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <SchoolIcon sx={{ color: 'white', fontSize: 36 }} />
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
                  I'm a Student
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Build your profile, connect with peers and discover opportunities.
                </Typography>
                <Button
                  variant="contained" color="primary" fullWidth size="large"
                  component={Link} href="/signup"
                  sx={{ py: 1.4, fontWeight: 700, boxShadow: '0 4px 14px rgba(10,102,194,0.3)' }}
                >
                  Join as Student
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Staff Card */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                border: '2px solid transparent',
                boxShadow: '0 4px 24px rgba(5,118,66,0.10)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  border: '2px solid',
                  borderColor: 'secondary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(5,118,66,0.18)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{
                    bgcolor: 'secondary.main', borderRadius: '50%', width: 72, height: 72,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <BadgeIcon sx={{ color: 'white', fontSize: 36 }} />
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'secondary.main' }} gutterBottom>
                  I'm Staff
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Access your staff dashboard to discover and connect with students.
                </Typography>
                <Button
                  variant="contained" color="secondary" fullWidth size="large"
                  component={Link} href="/login"
                  sx={{ py: 1.4, fontWeight: 700, boxShadow: '0 4px 14px rgba(5,118,66,0.3)' }}
                >
                  Staff Sign In
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer login link */}
        <Box sx={{ textAlign: 'center', animation: 'fadeInUp 0.6s ease 0.35s both' }}>
          <Typography variant="body2" color="text.secondary">
            Already have a student account?{' '}
            <Link href="/login" style={{ color: '#0a66c2', fontWeight: 700, textDecoration: 'none' }}>
              Log in here
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
