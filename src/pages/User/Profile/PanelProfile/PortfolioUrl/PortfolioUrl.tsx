import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { setPortfolioUser, setIsLoading } from '@/store/authSlice';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import FetchIntercept from '@/utils/api';
import { BACKEND_URL } from '@/config/config';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
} from '@mui/material';

const PortfolioUrl: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { userId, user } = useAppSelector((state) => state.auth);

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [portfolioUrls, setPortfolioUrls] = useState<string[] | []>([]);
  const [portfolioUrl, setPortfolioUrl] = useState<string>('');

  const asyncUserPortfolioUrl = async (userId: string, payload: string[]) => {
    dispatch(setIsLoading(true));
    const response = await FetchIntercept(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ portfolioUrl: payload }),
    });

    if (response.code === 200) {
      dispatch(setPortfolioUser(payload));
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
    const tempPortfolioUrl = [...portfolioUrls, portfolioUrl];
    await asyncUserPortfolioUrl(userId, tempPortfolioUrl);
    setOpenAdd(false);
  };

  const handleDeletePortfolioUrl = async (index: number) => {
    const tempPortfolioUrl = portfolioUrls.filter(
      (portfolioUrl, i) => i !== index
    );
    await asyncUserPortfolioUrl(userId, tempPortfolioUrl);
  };

  useEffect(() => {
    if (user?.portfolioUrl) {
      setPortfolioUrls(user.portfolioUrl);
    }
  }, [user?.portfolioUrl]);

  useEffect(() => {
    setPortfolioUrl('');
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
              Portfolio URL
            </Typography>
          </CardContent>

          <CardContent sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {portfolioUrls.map((portfolioUrl, index) => (
              <Button key={index}>
                {portfolioUrl}
                {userId === id && (
                  <DeleteForeverIcon
                    onClick={() => handleDeletePortfolioUrl(index)}
                    sx={{ marginLeft: '0.5rem', width: '20px' }}
                  />
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      </Box>

      <CustomizeModal
        id="addPortfolioUrl"
        title="add portfolio url"
        open={openAdd}
        handleClose={() => setOpenAdd(false)}
        onSave={handleSaveChanges}
      >
        <TextField
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          sx={{
            minWidth: { xs: 'auto', md: '300px', lg: '400px' },
          }}
          placeholder="Ex: www.github.com/user"
          multiline
          minRows={1}
          maxRows={1}
        />
      </CustomizeModal>
    </>
  );
};

export default PortfolioUrl;
