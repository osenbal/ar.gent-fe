import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import { ToastContainer, toast } from 'react-toastify';
import { IReturn_JobDetails } from '@/interfaces/job.interface';
import DialpadIcon from '@mui/icons-material/Dialpad';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone';
import { Typography, Box, Card, Avatar, Button } from '@mui/material';
import { BACKEND_URL } from '@/config/config';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type props = {
  data: IReturn_JobDetails;
};

const JobDetails: React.FC<props> = ({ data }) => {
  const { userId } = useAppSelector((state) => state.auth);
  const [statusApplied, setStatusApplied] = useState<string | boolean>('');
  const [openUploadCv, setOpenUploadCv] = useState<boolean>(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleInputCv = async () => {
    if (!cvFile) return;
    if (cvFile) {
      const formData = new FormData();
      formData.append('cv', cvFile);

      const res = await fetch(
        `${BACKEND_URL}/user/uploadfile/${userId}?type=cv`,
        {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        }
      );

      if (res.ok) {
        setCvFile(null);
        setOpenUploadCv(false);
        toast.success('Upload CV successfully, please apply again!');
      } else {
        console.log('error');
        setOpenUploadCv(false);
      }
    }
  };

  const handleApplyJob = async () => {
    const response = await fetch(`${BACKEND_URL}/job/apply/${data._id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const resData = await response.json();
    if (response.ok) {
      setStatusApplied(resData.data);
      if (resData.data === false) {
        toast.warn('unapply job successfully');
      } else {
        toast.success('apply job successfully!');
      }
    } else if (response.status === 400) {
      if (resData?.data?.isExist === false) {
        setOpenUploadCv(true);
      }
    } else {
      console.log(resData.message);
    }
  };

  const checkIsApply = async () => {
    setIsLoading(true);
    const response = await fetch(`${BACKEND_URL}/job/check-apply/${data._id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await response.json();
    if (response.ok) {
      setStatusApplied(resData.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIsApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ToastContainer />

      <Card sx={{ padding: 3 }}>
        <Typography variant="h5" fontWeight={'500'}>
          {data.title}
        </Typography>
        <Typography variant="body2" fontWeight={'400'}>
          {data.user?.username} | {data.location?.state?.name},{' '}
          {data.location?.country?.name} - {data.totalAppliciants} applicants
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <WorkTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={'400'}>
            {data.type}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <ApartmentTwoToneIcon sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={'400'}>
            {data.workPlace}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <DialpadIcon sx={{ mr: 1 }} />
          <Typography variant="body2" fontWeight={'400'}>
            {data.level}
          </Typography>
        </Box>

        {userId !== data.userId && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Button
              onClick={handleApplyJob}
              variant="contained"
              sx={{ mr: 1 }}
              disabled={
                isLoading ||
                statusApplied === 'approved' ||
                statusApplied === 'rejected'
              }
              // endIcon={statusApplied === "" ? '' : <LaunchIcon />}
            >
              {isLoading
                ? 'Loading...'
                : statusApplied === false
                ? 'Apply'
                : statusApplied === 'pending'
                ? 'Applied'
                : statusApplied === 'approved'
                ? 'Approved'
                : statusApplied === 'rejected'
                ? 'Rejected'
                : ''}
            </Button>
          </Box>
        )}

        <Typography variant="body2" fontWeight={'500'} mt={3}>
          Post by{' '}
        </Typography>
        <Link to={`/user/${data.userId}/profile`}>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Avatar src={data.user?.avatar} alt="avatar" />
            <Typography variant="body2" fontWeight={'500'} ml={2}>
              {data.user?.username}
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
              __html: DOMPurify.sanitize(data.description),
            }}
          />
        </div>
        {/* {parse(data.description)} */}
      </Card>

      <CustomizeModal
        id="addCv"
        title="Upload Your CV"
        open={openUploadCv}
        handleClose={() => setOpenUploadCv(false)}
        onSave={handleInputCv}
      >
        <Box sx={{ minWidth: '250px', minHeight: '100px' }}>
          <label
            htmlFor="input_cv"
            style={{
              cursor: 'pointer',
              width: '250px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {cvFile !== null ? (
              <>
                <Typography variant="body2" fontWeight={'500'}>
                  {cvFile.name}
                </Typography>
                <input
                  onChange={(e) =>
                    e.target.files && setCvFile(e.target.files?.[0])
                  }
                  accept="application/pdf"
                  id="input_cv"
                  type="file"
                  hidden
                  name="input_cv"
                  style={{ display: 'none' }}
                />
              </>
            ) : (
              <>
                <CloudUploadIcon />
                <input
                  onChange={(e) =>
                    e.target.files && setCvFile(e.target.files[0])
                  }
                  name="input_cv"
                  accept="application/pdf"
                  id="input_cv"
                  type="file"
                  hidden
                  style={{ display: 'none' }}
                />
              </>
            )}
          </label>
        </Box>
      </CustomizeModal>
    </>
  );
};

export default JobDetails;
