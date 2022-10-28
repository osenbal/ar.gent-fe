import React from 'react';
import { Card, CardContent, Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Edit } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Experience: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', marginTop: 2 }}>
      <Card>
        <CardContent>
          <IconButton
            sx={{
              backgroundColor: '#eeeeee',
              position: 'absolute',
              top: 4,
              right: 8,
            }}
          >
            <AddIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: '700' }}>
            Experience
          </Typography>

          <Card sx={{ marginTop: 2, position: 'relative' }}>
            <Box>
              <IconButton sx={{ position: 'absolute', top: 4, right: 48 }}>
                <Edit />
              </IconButton>
              <IconButton sx={{ position: 'absolute', top: 4, right: 8 }}>
                <DeleteForeverIcon />
              </IconButton>
            </Box>
            <CardContent>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Position
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Company Name - Location
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: '200' }}>
                (12-01-2020 - present)
              </Typography>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Experience;
