import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CustomizeModal from '@/components/Reusable/CustomizeModal';

const Skills: React.FC = () => {
  const [openAdd, setOpenAdd] = useState<boolean>(false);

  const handleSaveChanges = async (e: React.MouseEvent) => {
    e.preventDefault();
  };
  return (
    <>
      <Box sx={{ position: 'relative', marginTop: 2, width: '100%' }}>
        <Card>
          <CardContent>
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
            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              Skills
            </Typography>
          </CardContent>

          <CardContent sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Button>
              HTML{' '}
              <DeleteForeverIcon
                onClick={() => console.log('delete skill')}
                sx={{ marginLeft: '0.5rem', width: '20px' }}
              />
            </Button>
            <Button>
              Javascript{' '}
              <DeleteForeverIcon sx={{ marginLeft: '0.5rem', width: '20px' }} />
            </Button>
            <Button>
              CSS{' '}
              <DeleteForeverIcon sx={{ marginLeft: '0.5rem', width: '20px' }} />
            </Button>
            <Button>
              CSS{' '}
              <DeleteForeverIcon sx={{ marginLeft: '0.5rem', width: '20px' }} />
            </Button>
            <Button>
              CSS{' '}
              <DeleteForeverIcon sx={{ marginLeft: '0.5rem', width: '20px' }} />
            </Button>
            <Button>
              CSS{' '}
              <DeleteForeverIcon sx={{ marginLeft: '0.5rem', width: '20px' }} />
            </Button>
            <Button>
              CSS{' '}
              <DeleteForeverIcon sx={{ marginLeft: '0.5rem', width: '20px' }} />
            </Button>{' '}
            <Button>
              CSS{' '}
              <DeleteForeverIcon sx={{ marginLeft: '0.5rem', width: '20px' }} />
            </Button>
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
