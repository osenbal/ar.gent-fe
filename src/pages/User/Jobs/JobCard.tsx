import React from 'react';
import { Typography, Card, CardContent, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Link } from 'react-router-dom';
import IJob from '@/interfaces/job.interface';
import { DateToDMY } from '@/utils/utils';
import { NumericFormat } from 'react-number-format';
import { useAppSelector } from '@/hooks/redux.hook';

type props = {
  job: IJob;
  handleDelete: (id: string) => void;
  path: string;
};

const JobCard: React.FC<props> = ({ job, handleDelete, path }) => {
  const { userId } = useAppSelector((state) => state.auth);

  return (
    <>
      <Card
        sx={{
          marginTop: 2,
          position: 'relative',
          padding: 1,
          transition: 'all 0.4s ease-in-out',
          border: `1px solid ${
            localStorage.getItem('theme') === 'dark' ? '#fff' : '#e0e0e0'
          }`,
          ':hover': {
            backgroundColor: 'inherit',
          },
        }}
      >
        <Link
          style={{
            textDecoration: 'none',
            cursor: 'pointer',
            color: 'inherit',
          }}
          to={
            path === 'profile'
              ? `?jobId=${job?._id}`
              : `/jobs?search&jobId=${job?._id}`
          }
          id="jobDetailLink"
        >
          <CardContent>
            <Typography
              sx={{
                fontSize: {
                  xs: '16px',
                  sm: '18px',
                  md: '24px',
                  lg: '28px',
                },
                fontWeight: '700',
              }}
            >
              {job.title}
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: '14px',
                  sm: '16px',
                },
                fontWeight: '400',
              }}
            >
              {job.username}
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: '14px',
                  sm: '16px',
                },
                fontWeight: '300',
              }}
            >
              <NumericFormat
                value={job.salary}
                displayType={'text'}
                decimalSeparator=","
                thousandSeparator="."
                prefix={'Rp. '}
              />
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: '12px',
                  md: '14px',
                },
                fontWeight: '300',
              }}
            >
              <>posted : {DateToDMY(job.createdAt)}</>
            </Typography>
          </CardContent>
        </Link>

        {userId === job.userId && path === 'profile' && (
          <>
            <IconButton
              onClick={() => handleDelete(job._id)}
              sx={{ position: 'absolute', top: 2, right: 2 }}
            >
              <DeleteForeverIcon />
            </IconButton>
            <Link to={`/job/edit/${job._id}`}>
              <IconButton sx={{ position: 'absolute', bottom: 2, right: 2 }}>
                <SettingsIcon />
              </IconButton>
            </Link>
          </>
        )}
      </Card>
    </>
  );
};

export default JobCard;
