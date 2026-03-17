'use client';

import { Box, Card, Typography, TextField, Button, Alert, Chip, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  education: z.string().min(2, 'Education is required'),
  department: z.string().min(2, 'Department is required'),
  year: z.string().optional(),
  photo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSetupPage() {
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'staff' | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      bio: '',
      education: '',
      department: '',
      year: '',
      photo_url: '',
    },
  });

  useEffect(() => {
    async function loadExistingProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setUserRole(data.role);
        setValue('full_name', data.full_name || '');
        setValue('bio', data.bio || '');
        setValue('education', data.education || '');
        setValue('department', data.department || '');
        setValue('year', data.year || '');
        setValue('photo_url', data.photo_url || '');
        setSkills(data.skills || []);
      }
    }
    loadExistingProfile();
  }, [setValue, supabase]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error: updateError } = await supabase.from('profiles').update({
        full_name: data.full_name,
        bio: data.bio,
        education: data.education,
        department: data.department,
        year: data.year,
        photo_url: data.photo_url,
        skills,
        is_profile_completed: true,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      if (updateError) throw updateError;
      
      // Redirect based on role
      if (userRole === 'staff') {
        router.push('/staff');
      } else {
        router.push('/student');
      }
      router.refresh();

    } catch (err: any) {
      setError(err.message || 'An error occurred while saving your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 8 }}>
      <Card sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          Complete Your Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Let people know who you are and what you do.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Controller
              name="full_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                />
              )}
            />

            <Controller
              name="photo_url"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Photo URL"
                  fullWidth
                  placeholder="https://example.com/photo.jpg"
                  error={!!errors.photo_url}
                  helperText={errors.photo_url?.message}
                />
              )}
            />

            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bio / Headline"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.bio}
                  helperText={errors.bio?.message || "Brief description about yourself"}
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="School / University"
                    fullWidth
                    error={!!errors.education}
                    helperText={errors.education?.message}
                  />
                )}
              />
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department / Course"
                    fullWidth
                    error={!!errors.department}
                    helperText={errors.department?.message}
                  />
                )}
              />
            </Box>

            {userRole === 'student' && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Year of Study"
                      sx={{ width: { xs: '100%', sm: '50%' } }}
                      placeholder="e.g. 1st Year, Senior, Class of 2026"
                    />
                  )}
                />
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>Skills</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  label="Add a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                />
                <Button variant="outlined" onClick={handleAddSkill}>Add</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}
