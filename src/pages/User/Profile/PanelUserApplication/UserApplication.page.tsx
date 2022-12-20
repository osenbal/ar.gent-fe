import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Loader from '@/components/Reusable/Loader';
import NoData from '@/components/Reusable/NoData';
import { BACKEND_URL } from '@/config/config';
import { DateToDMY } from '@/utils/utils';
import FetchIntercept from '@/utils/api';
import CheckIcon from '@mui/icons-material/Check';
import {
  Card,
  CardContent,
  Typography,
  styled,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const StyledContainer = styled(Grid)(({ theme }) => ({
  justifyContent: 'start',
  marginTop: 5,
}));

const StyledLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
}));

const CardLink = ({ link, data }: { link: string; data: any }) => {
  return (
    <>
      <Grid item xs={12} md={6} lg={4}>
        <Card>
          <CardContent>
            <StyledLink to={link}>
              <Typography>{data?.job[0].title}</Typography>
            </StyledLink>
            <Typography sx={{ mt: 1 }}>
              {data?.job[0].location.state.name},{' '}
              {data?.job[0].location.country.name}
            </Typography>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '4rem',
              }}
            >
              <Typography sx={{ fontWeight: 300, fontSize: '14px' }}>
                Appply : {DateToDMY(data.createdAt)}
              </Typography>
              {data?.isApprove === 'approved' ? (
                <Typography sx={{ color: '#26a69a', fontWeight: 700 }}>
                  Approved
                  <CheckIcon />
                </Typography>
              ) : data?.isApprove === 'rejected' ? (
                <>Rejected</>
              ) : (
                <>Pending</>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

const UserApplication: React.FC = () => {
  const params = useParams();
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const [applications, setApplications] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserApplications = async () => {
    setIsLoading(true);
    const response = await FetchIntercept(
      `${BACKEND_URL}/job/applications/${params.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    if (response.code === 200) {
      setApplications(response.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : applications?.length > 0 ? (
        <StyledContainer container spacing={2}>
          {applications.map((item: any, index: number) => (
            <CardLink
              key={index}
              link={`/job/detail/${item.jobId}`}
              data={item}
            />
          ))}
        </StyledContainer>
      ) : (
        <NoData message="Not found" upTabScreen={upTabScreen} />
      )}
    </>
  );
};

export default UserApplication;
