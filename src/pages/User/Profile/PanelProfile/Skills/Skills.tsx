import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setSkillUser, setIsLoading } from '@/store/authSlice';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import FetchIntercept from '@/utils/api';
import { BACKEND_URL } from '@/config/config';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
} from '@mui/material';

const Skills: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { userId, user } = useAppSelector((state) => state.auth);

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [skills, setSkills] = useState<string[] | []>([]);
  const [skill, setSkill] = useState<string>('');

  const asyncUserSkill = async (userId: string, payload: string[]) => {
    dispatch(setIsLoading(true));
    const response = await FetchIntercept(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skill: payload }),
    });

    if (response.code === 200) {
      dispatch(setSkillUser(payload));
      dispatch(setIsLoading(false));
      toast.success(`${response.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
    } else {
      dispatch(setIsLoading(false));
      toast.warn(`${response.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
    }
  };

  const handleSaveChanges = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (skill === '') {
      toast.warn('please fill the field required');
      return;
    }

    setSkill(skill.trim());

    const tempSkill = [...skills, skill];
    // dispatch(asyncUserSkill({ userId, payload: tempSkill }));

    await asyncUserSkill(userId, tempSkill);
    setOpenAdd(false);
  };

  const handleDeleteSkill = async (index: number) => {
    const tempSkill = skills.filter((skill, i) => i !== index);
    // dispatch(asyncUserSkill({ userId, payload: tempSkill }));
    await asyncUserSkill(userId, tempSkill);
  };

  useEffect(() => {
    if (user?.skill) {
      setSkills(user.skill);
    }
  }, [user?.skill]);

  useEffect(() => {
    setSkill('');
  }, [openAdd]);

  return (
    <>
      <Box sx={{ position: 'relative', marginTop: 2, width: '100%' }}>
        <Card>
          <CardContent>
            {userId === id && (
              <IconButton
                onClick={() => setOpenAdd(true)}
                sx={{
                  backgroundColor: 'inherit',
                  position: 'absolute',
                  top: 4,
                  right: 8,
                }}
              >
                <AddIcon />
              </IconButton>
            )}

            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              Skills
            </Typography>
          </CardContent>

          <CardContent sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {skills?.map((skill, index) => (
              <Button key={index}>
                {skill}
                {userId === id && (
                  <DeleteForeverIcon
                    onClick={() => handleDeleteSkill(index)}
                    sx={{ marginLeft: '0.5rem', width: '20px' }}
                  />
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      </Box>

      <CustomizeModal
        id="addSkill"
        title="add skill"
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        onSave={handleSaveChanges}
      >
        <TextField
          sx={{
            minWidth: { xs: 'auto', md: '300px', lg: '400px' },
          }}
          value={skill}
          label="skill"
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Ex: Finace, Marketing, React JS, etc."
          multiline
          minRows={1}
          maxRows={1}
        />
      </CustomizeModal>
    </>
  );
};

export default Skills;
