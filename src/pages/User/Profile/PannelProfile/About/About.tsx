import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import { Edit } from '@mui/icons-material';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import {
  Box,
  Card,
  IconButton,
  Typography,
  CardContent,
  TextField,
} from '@mui/material';
import { BACKEND_URL } from '@/config/config';

const About: React.FC = () => {
  const { user, userId } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [about, setAbout] = useState<string>('');

  const [editAbout, setEditAbout] = useState<string>('');

  const handleSaveChanges = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (editAbout === about) {
      setOpen(false);
      return;
    }

    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        about: editAbout,
      }),
    });

    if (response.status === 200) {
      setAbout(editAbout);
      setOpen(false);
    }
  };

  const handleAboutChange = useCallback(() => {
    setEditAbout(about);
  }, [about]);

  useEffect(() => {
    if (user) {
      setAbout(user.about);
    }
  }, [user]);

  useEffect(() => {
    handleAboutChange();
  }, [handleAboutChange, open]);

  return (
    <>
      <Box sx={{ position: 'relative', marginTop: 2 }}>
        <Card>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              background: 'inherit',
              position: 'absolute',
              top: 4,
              right: 8,
            }}
          >
            <Edit />
          </IconButton>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              About
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: '500' }}>
              {about}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <CustomizeModal
        id="editAboutModal"
        title="edit about"
        open={open}
        handleClose={() => setOpen(false)}
        onSave={handleSaveChanges}
      >
        <TextField
          sx={{
            minWidth: { xs: 'auto', md: '300px', lg: '400px' },
            minHeight: '100px',
          }}
          placeholder="Ex: Hi there, I'm a software engineer..."
          multiline
          minRows={4}
          value={editAbout}
          onChange={(e) => setEditAbout(e.target.value)}
          maxRows={4}
        />
      </CustomizeModal>
    </>
  );
};

export default About;
