import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';
import FetchAdminIntercept from '@/utils/api.admin';
import { BACKEND_URL } from '@/config/config';
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone';
import DialpadIcon from '@mui/icons-material/Dialpad';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import {
  Typography,
  Box,
  Card,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { IReturn_JobDetails } from '@/interfaces/job.interface';
import NoData from '@/components/Reusable/NoData';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams();
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const [job, setJob] = useState<IReturn_JobDetails | null>(null);
  const [isJobClosed, setIsJobClosed] = useState<boolean>(false);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getDetailJob = async () => {
    setIsLoading(true);
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/job/${jobId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    if (response.code === 200) {
      setJob(response.data);
      setIsJobClosed(response?.data?.isClosed);
      setIsLoading(false);
    } else {
      setJob(null);
      setIsLoading(false);
    }
  };

  const handleCloseJob = async () => {
    setIsLoadingButton(true);
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/job/close/${jobId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    if (response.code === 200) {
      if (response.data?.length >= 1) {
        setIsJobClosed(response.data[0].isClosed);
      }
      toast.success('success');
      setIsLoadingButton(false);
    } else {
      toast.warn('failed');
      setIsLoadingButton(false);
    }
  };

  const handleDeleteJob = async () => {
    setIsLoadingButton(true);
    const response = await FetchAdminIntercept(
      `${BACKEND_URL}/admin/job/${jobId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.code === 200) {
      navigate('/admin/jobs', { replace: true });
      toast.success('success delete job');
      setIsLoadingButton(false);
    } else {
      toast.warn('failed to delete');
      setIsLoadingButton(false);
    }
  };

  useEffect(() => {
    getDetailJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <>Loading...</>
      ) : job === null && !job ? (
        <NoData upTabScreen={upTabScreen} message="data not found" />
      ) : (
        <Card sx={{ padding: 3 }}>
          <Typography variant="h5" fontWeight={'500'}>
            {job?.title}
          </Typography>
          <Typography variant="body2" fontWeight={'400'}>
            {job?.user?.username} | {job.location?.state?.name},{' '}
            {job?.location?.country?.name} - {job.totalAppliciants} applicants
          </Typography>

          <Typography variant="body2" fontWeight={'400'} sx={{ mt: 2 }}>
            Salary :{' '}
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(job?.salary)}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <WorkTwoToneIcon sx={{ mr: 1 }} />
            <Typography variant="body2" fontWeight={'400'}>
              {job?.type}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <ApartmentTwoToneIcon sx={{ mr: 1 }} />
            <Typography variant="body2" fontWeight={'400'}>
              {job?.workPlace}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <DialpadIcon sx={{ mr: 1 }} />
            <Typography variant="body2" fontWeight={'400'}>
              {job?.level}
            </Typography>
          </Box>

          <Typography variant="body2" fontWeight={'500'} mt={3}>
            Post by{' '}
          </Typography>
          <Link to={`/user/${job.userId}/profile`}>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Avatar src={job.user?.avatar} alt="avatar" />
              <Typography variant="body2" fontWeight={'500'} ml={2}>
                {job.user?.username}
              </Typography>
            </Box>
          </Link>

          <Typography variant="body2" fontWeight={'500'} mt={3}>
            Description
          </Typography>
          <div>
            <span
              style={{
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                hyphens: 'auto',
                maxWidth: '100%',
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job?.description),
              }}
            />
          </div>

          <Box sx={{ display: 'flex', flexDir: 'row' }}>
            <Button
              disabled={isLoadingButton}
              color="success"
              onClick={handleCloseJob}
            >
              {isJobClosed ? 'Open' : 'Close'}
            </Button>
            <Button
              disabled={isLoadingButton}
              color="error"
              onClick={handleDeleteJob}
            >
              Delete
            </Button>
          </Box>
        </Card>
      )}
    </>
  );
};

export default JobDetailPage;
