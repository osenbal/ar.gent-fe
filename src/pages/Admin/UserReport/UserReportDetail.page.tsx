import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import FetchAdminIntercept from '@/utils/api.admin';
import { BACKEND_URL } from '@/config/config';
import IUser, { IReturn_Reported_User } from '@/interfaces/user.interface';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button,
} from '@mui/material';

const CardUserReport = ({
  data,
  handleBanned,
  handleDelete,
  type,
  isLoadingButton,
}: {
  data: any;
  handleBanned: any;
  handleDelete: any;
  type: string;
  isLoadingButton: boolean;
}) => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              mb: 3,
            }}
            alt="avatar user reported"
            src={data.avatar}
          />
          {type === 'userReported' ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'center',
              }}
            >
              <Button
                onClick={handleBanned}
                disabled={isLoadingButton}
                color="success"
              >
                {data.status ? 'Banned' : 'Unbanned'}
              </Button>
              <Button
                disabled={isLoadingButton}
                onClick={handleDelete}
                color="error"
              >
                Delete
              </Button>
            </Box>
          ) : (
            ''
          )}
        </Box>
        <Typography>Username : {data.username}</Typography>
        <Typography>Full Name : {data.fullName}</Typography>
        <Typography>
          Email :{' '}
          <a target="_blank" href={`mailto:${data.email}`} rel="noreferrer">
            {data.email}
          </a>
        </Typography>
        <Typography>Phone Number : {data.phoneNumber}</Typography>
      </CardContent>
    </Card>
  );
};

const UserReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [detailReport, setDetailReport] =
    useState<IReturn_Reported_User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [userReported, setUserReported] = useState<IUser | null>(null);
  const [userReport, setUserReport] = useState<IUser | null>(null);

  const getReportDetail = async () => {
    setIsLoading(true);
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/user/report/${reportId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.code === 200) {
      setDetailReport(response.data);
      setUserReport(response.data.userReport);
      setUserReported(response.data.userReported);
      setIsLoading(false);
    } else {
      console.log('error');
      setIsLoading(false);
    }
  };

  const handleBannedUser = async (userId: string) => {
    setIsLoadingButton(true);
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/user/banned/${userId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response);
    if (response.code === 200) {
      setUserReported(response.data);
      toast.success(response.message);
      setIsLoadingButton(false);
    } else {
      console.log('error');
      toast.warn(response.message);
      setIsLoadingButton(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsLoadingButton(true);
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/user/${userId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response);
    if (response.code === 200) {
      setIsLoadingButton(false);
      toast.success('success delete user');
      navigate('/admin/reports');
    } else {
      console.log('error');
      toast.success(response.message);
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    getReportDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ToastContainer />
      <Box>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <h1>Report Detail</h1>

            {!detailReport && userReport && userReported ? (
              <>Not Found</>
            ) : (
              <>
                <Typography sx={{ mt: 5, mb: 3 }}>User Reported</Typography>

                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid xs={12} md={6} item>
                    {userReported ? (
                      <CardUserReport
                        isLoadingButton={isLoadingButton}
                        type="userReported"
                        handleBanned={() =>
                          handleBannedUser(userReported?._id.toString())
                        }
                        handleDelete={() =>
                          handleDeleteUser(userReported?._id.toString())
                        }
                        data={userReported}
                      />
                    ) : (
                      ''
                    )}
                  </Grid>
                  <Grid xs={12} md={6} item>
                    <Card>
                      <CardContent sx={{ alignSelf: 'center' }}>
                        <Typography>Description Report</Typography>
                        <Card>
                          <CardContent>
                            <Typography>{detailReport?.description}</Typography>
                          </CardContent>
                        </Card>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Typography sx={{ mt: 5, mb: 3 }}>Report By : </Typography>

                {userReport ? (
                  <CardUserReport
                    isLoadingButton={isLoadingButton}
                    type="userReport"
                    handleBanned={() => 0}
                    handleDelete={() => 0}
                    data={userReport}
                  />
                ) : (
                  ''
                )}
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default UserReportDetail;
