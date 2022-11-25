import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { asyncUserAbout } from '@/store/authSlice';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import { Edit } from '@mui/icons-material';
import {
  Box,
  Card,
  IconButton,
  Typography,
  CardContent,
  TextField,
} from '@mui/material';

const About: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
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

    dispatch(asyncUserAbout({ userId, payload: editAbout }));
    setOpen(false);
  };

  const handleAboutChange = useCallback(() => {
    setEditAbout(about);
  }, [about]);

  useEffect(() => {
    if (user?.about) {
      setAbout(user.about);
    }
  }, [user?.about]);

  useEffect(() => {
    handleAboutChange();
  }, [handleAboutChange, open]);

  return (
    <>
      <Box sx={{ position: 'relative', marginTop: 2 }}>
        <Card>
          {userId === id && (
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
          )}

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
