import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import {
  Avatar,
  Card,
  CardContent,
  Box,
  Typography,
  Link,
  IconButton,
  Modal,
  Fade,
  Backdrop,
  Input,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit, CameraAlt } from '@mui/icons-material';
import { parseDate } from '@/utils/utils';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditSummary from './EditSummary';

const Summary: React.FC<{ id: string | undefined }> = ({ id }) => {
  const { userId, user } = useAppSelector((state) => state.auth);

  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [banner, setBanner] = useState<string | undefined>(user?.banner);

  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  const handleOpenEditSummary = () => setOpen(true);
  const handleCloseEditSummary = () => setOpen(false);

  const Banner = styled('img')({
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  });

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Banner src={banner} alt="banner" />
        <IconButton sx={{ position: 'absolute', top: '0', right: '0' }}>
          <CameraAlt />
        </IconButton>

        <Box
          sx={{
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;',
            paddingBottom: 2,
          }}
        >
          <Box sx={{ marginLeft: 2 }}>
            <Box>
              {userId === id ? (
                <label
                  style={{
                    cursor: 'pointer',
                  }}
                  htmlFor="avatar_pic"
                >
                  <Box
                    sx={{
                      position: 'relative',
                    }}
                  >
                    <Avatar
                      src={avatar}
                      sx={{
                        width: 98,
                        height: 98,
                        marginTop: -8,
                        border: '1px solid #333333',
                      }}
                      // style={{ marginBottom: '1.25rem' }}
                    />

                    <Avatar
                      sx={{
                        position: 'absolute',
                        right: 5,
                        bottom: 2,
                        width: '24px',
                        height: '24px',
                      }}
                    >
                      <CameraAltIcon sx={{ width: '16px', height: '16px' }} />
                    </Avatar>
                  </Box>
                  <Input
                    // onChange={handleFileInput}
                    type="file"
                    id="avatar_pic"
                    placeholder="avatar"
                    name="avatar"
                    required
                    hidden
                  />
                </label>
              ) : (
                <Avatar
                  sx={{
                    width: 98,
                    height: 98,
                    marginTop: -8,
                    border: '1px solid #333333',
                  }}
                  src={avatar}
                  alt="avatar"
                />
              )}

              {/* Edit Summary */}
              {userId === id && (
                <>
                  <IconButton
                    onClick={handleOpenEditSummary}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 280,
                      background: 'inherit',
                    }}
                  >
                    <Edit color="action" />
                  </IconButton>

                  <EditSummary
                    open={open}
                    handleClose={() => handleCloseEditSummary()}
                  />
                </>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: '700', marginTop: 2 }}>
                {user?.fullName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: '500' }}>
                  {user?.address?.country}
                </Typography>
                <>
                  <Link
                    onClick={() => setOpenInfo(true)}
                    sx={{ cursor: 'pointer' }}
                  >
                    Contact Info
                  </Link>
                  <Modal
                    aria-labelledby="transition-modal-info"
                    aria-describedby="transition-modal-info"
                    open={openInfo}
                    onClose={() => setOpenInfo(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={openInfo}>
                      <Box sx={style}>
                        <Typography
                          id="transition-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          Contact Info
                        </Typography>
                        <Box>
                          <Typography sx={{ mt: 2 }}>Username :</Typography>
                          <Typography>{user?.username}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ mt: 2 }}>Full Name :</Typography>
                          <Typography>{user?.fullName}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ mt: 2 }}>Gender :</Typography>
                          <Typography>{user?.gender}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ mt: 2 }}>Phone number :</Typography>
                          <Typography>
                            {user?.phoneNumber || 'Not set'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ mt: 2 }}>Address :</Typography>
                          <Typography>
                            {user?.address.street}, {user?.address.city},{' '}
                            {user?.address.country}
                          </Typography>
                        </Box>

                        <Typography sx={{ mt: 2 }}>Birthday :</Typography>
                        <Typography>{parseDate(user?.birthday)}</Typography>
                      </Box>
                    </Fade>
                  </Modal>
                </>
              </Box>
              {user?.cv && (
                <Link
                  color="neutral"
                  underline="hover"
                  variant="h6"
                  sx={{ fontWeight: '500', cursor: 'pointer' }}
                >
                  Download CV
                </Link>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* About */}
      <Box sx={{ position: 'relative', marginTop: 2 }}>
        <Card>
          <IconButton
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
              {user?.about}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Summary;
