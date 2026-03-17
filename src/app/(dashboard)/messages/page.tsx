'use client';

import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, TextField, Button, Paper, CircularProgress, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';
import io, { Socket } from 'socket.io-client';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('user');
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]); // List of people I can chat with
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const activeChatIdRef = useRef<string | null>(null);

  const supabase = createClient();

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function initChat() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user);

      // Initialize Socket
      socketRef.current = io(window.location.origin);
      socketRef.current.emit('join_user_room', user.id);

      socketRef.current.on('receive_message', (messageData) => {
        // Only append to the current message list if the message is from our active chat counterpart
        if (messageData.sender_id === activeChatIdRef.current) {
          setMessages((prev) => [...prev, messageData]);
        }
      });

      // Load Contacts (Accepted connections OR All if Staff for simplicity)
      // For this spec, we load accepted connections for chat. Staff can message anyone they've viewed.
      const { data: currentProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      
      let contactsData: any[] = [];
      
      if (currentProfile?.role === 'staff') {
         // Staff can see all completed students
         const { data: allStudents } = await supabase.from('profiles').select('*').eq('role', 'student').eq('is_profile_completed', true);
         contactsData = allStudents || [];
      } else {
         // Students see accepted connections
         const { data: accepted } = await supabase
          .from('connections')
          .select(`
            requester:profiles!connections_requester_id_fkey(*),
            receiver:profiles!connections_receiver_id_fkey(*)
          `)
          .eq('status', 'accepted')
          .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

          if (accepted) {
           contactsData = (accepted as any[]).map((conn: any) => {
             const req = Array.isArray(conn.requester) ? conn.requester[0] : conn.requester;
             const rec = Array.isArray(conn.receiver) ? conn.receiver[0] : conn.receiver;
             return req.id === user.id ? rec : req;
           });
         }
      }

      setConversations(contactsData);

      // If URL has user ID, set as active chat
      if (initialUserId) {
        let chatUser = contactsData.find(c => c.id === initialUserId);
        
        // If not found in contacts (e.g. staff viewing a specific student direct from search)
        if (!chatUser) {
           const { data: directUser } = await supabase.from('profiles').select('*').eq('id', initialUserId).single();
           if (directUser) {
             chatUser = directUser;
             setConversations(prev => [chatUser, ...prev]);
           }
        }
        
        if (chatUser) {
          handleSelectChat(chatUser, user.id);
        }
      }

      setLoading(false);
    }
    initChat();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [initialUserId, supabase]);

  const handleSelectChat = async (userToChat: any, currentUid: string = currentUser?.id) => {
    setActiveChat(userToChat);
    activeChatIdRef.current = userToChat.id;
    setLoadingMessages(true);
    
    // Fetch message history
    if (!currentUid) return;

    const { data: history } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUid},receiver_id.eq.${userToChat.id}),and(sender_id.eq.${userToChat.id},receiver_id.eq.${currentUid})`)
      .order('created_at', { ascending: true });

    // Mark unread messages as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', currentUid)
      .eq('sender_id', userToChat.id)
      .eq('is_read', false);

    setMessages(history || []);
    setLoadingMessages(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUser) return;

    const msgData = {
      sender_id: currentUser.id,
      receiver_id: activeChat.id,
      content: newMessage,
      is_read: false,
    };

    // 1. Optimistic UI update
    const tempMsg = { ...msgData, created_at: new Date().toISOString(), id: Math.random().toString() };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage('');

    // 2. Transmit via Socket.io
    socketRef.current?.emit('send_message', tempMsg);

    // 3. Persist to Supabase
    await supabase.from('messages').insert([msgData]);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      
      {/* Sidebar: Conversations List */}
      <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider', fontWeight: 'bold' }}>
          Messaging
        </Typography>
        <List disablePadding>
          {conversations.map((contact) => (
            <ListItem 
              key={contact.id} 
              disablePadding
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                bgcolor: activeChat?.id === contact.id ? 'action.selected' : 'inherit'
              }}
            >
              <Button 
                fullWidth 
                sx={{ justifyContent: 'flex-start', p: 2, textAlign: 'left', textTransform: 'none', color: 'text.primary' }}
                onClick={() => {
                  router.push(`/messages?user=${contact.id}`, { scroll: false });
                  handleSelectChat(contact);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={contact.photo_url} />
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle2" fontWeight={activeChat?.id === contact.id ? 'bold' : 'normal'}>
                      {contact.full_name}
                    </Typography>
                  } 
                  secondary={
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {contact.role}
                    </Typography>
                  } 
                />
              </Button>
            </ListItem>
          ))}
          {conversations.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No contacts available.</Typography>
            </Box>
          )}
        </List>
      </Box>

      {/* Main Chat Area */}
      {activeChat ? (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f9f9f9' }}>
          
          {/* Chat Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center' }}>
            <Avatar src={activeChat.photo_url} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold">{activeChat.full_name}</Typography>
              <Typography variant="body2" color="text.secondary">{activeChat.role} • {activeChat.department}</Typography>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loadingMessages ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 'auto' }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isMine = msg.sender_id === currentUser.id;
                  return (
                    <Box key={msg.id || index} sx={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          maxWidth: '70%', 
                          borderRadius: 2,
                          bgcolor: isMine ? 'primary.main' : 'background.paper',
                          color: isMine ? 'primary.contrastText' : 'text.primary',
                          border: isMine ? 'none' : '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="body1">{msg.content}</Typography>
                      </Paper>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Chat Input */}
          <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write a message..."
              size="small"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 20 } }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={!newMessage.trim()}
              sx={{ borderRadius: 20, minWidth: 'auto', px: 3 }}
            >
              <SendIcon />
            </Button>
          </Box>

        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" color="text.secondary">Select a conversation to start messaging</Typography>
        </Box>
      )}

    </Box>
  );
}
