import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import { IJobDetails } from '@/interfaces/job.interface';
import DialpadIcon from '@mui/icons-material/Dialpad';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import LaunchIcon from '@mui/icons-material/Launch';
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone';
import {
  Typography,
  Box,
  Card,
  Avatar,
  Button,
  IconButton,
} from '@mui/material';
import { BACKEND_URL } from '@/config/config';
import CustomizeModal from '@/components/Reusable/CustomizeModal';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type props = {
  data: IJobDetails;
};

const JobDetails: React.FC<props> = ({ data }) => {
  const { userId } = useAppSelector((state) => state.auth);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [openUploadCv, setOpenUploadCv] = useState<boolean>(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleInputCv = async () => {
    if (!cvFile) return;
    if (cvFile) {
      console.log(cvFile);
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
      setIsApplied(resData.data);
    } else if (response.status === 400) {
      if (resData?.data?.isExist === false) {
        setOpenUploadCv(true);
      }
    } else {
      console.log(resData.message);
    }
  };

  const checkIsApply = async () => {
    const response = await fetch(`${BACKEND_URL}/job/check-apply/${data._id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await response.json();
    if (response.ok) {
      setIsApplied(resData.data);
    } else {
      console.log(resData.message);
      setIsApplied(false);
    }
  };

  useEffect(() => {
    checkIsApply();
  }, []);

  console.log(openUploadCv);
  return (
    <>
      <Card sx={{ padding: 3 }}>
        <Typography variant="h5" fontWeight={'500'}>
          {data.title}
        </Typography>
        <Typography variant="body2" fontWeight={'400'}>
          {data.username} | {data.location} - 10 applicants
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
              endIcon={isApplied ? '' : <LaunchIcon />}
            >
              {isApplied ? 'Applied' : 'Apply'}
            </Button>
          </Box>
        )}

        <Typography variant="body2" fontWeight={'500'} mt={3}>
          Post by{' '}
        </Typography>
        <Link to={`/user/${data.userId}/profile`}>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Avatar src={data.avatarUser} alt="avatar" />
            <Typography variant="body2" fontWeight={'500'} ml={2}>
              {data.username}
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
