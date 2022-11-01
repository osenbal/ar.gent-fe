import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Edit } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Skills: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', marginTop: 2, width: '100%' }}>
      <Card>
        <CardContent>
          <IconButton
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
            <DeleteForeverIcon sx={{ marginLeft: '0.5rem', width: '20px' }} />
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
  );
};

export default Skills;
