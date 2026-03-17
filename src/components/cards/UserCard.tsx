import { Card, Box, Avatar, Typography, Button, Chip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';

interface UserCardProps {
  user: {
    id: string;
    full_name: string;
    photo_url: string;
    bio: string;
    role: string;
    department: string;
    skills: string[];
  };
  onConnect?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  connectionStatus?: 'none' | 'pending' | 'accepted';
}

export default function UserCard({ user, onConnect, onMessage, connectionStatus = 'none' }: UserCardProps) {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', p: 3, mb: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Avatar src={user.photo_url} sx={{ width: 64, height: 64, mr: 2 }} alt={user.full_name} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {user.full_name || 'Anonymous User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role === 'student' ? 'Student' : 'Staff'} • {user.department || 'No department'}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mt: 1, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
            {user.bio || 'No bio provided.'}
          </Typography>
        </Box>
      </Box>

      {user.skills && user.skills.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {user.skills.map(skill => (
            <Chip key={skill} label={skill} size="small" variant="outlined" />
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
        {connectionStatus === 'none' && onConnect && (
          <Button 
            variant="outlined" 
            startIcon={<PersonAddIcon />} 
            onClick={() => onConnect(user.id)}
            size="small"
            sx={{ borderRadius: 20 }}
          >
            Connect
          </Button>
        )}
        
        {connectionStatus === 'pending' && (
          <Chip label="Request Pending" size="small" variant="outlined" sx={{ borderRadius: 20, mt: 0.5 }} />
        )}

        {connectionStatus === 'accepted' && onMessage && (
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<ChatIcon />} 
            onClick={() => onMessage(user.id)}
            size="small"
            sx={{ borderRadius: 20 }}
          >
            Message
          </Button>
        )}
      </Box>
    </Card>
  );
}
