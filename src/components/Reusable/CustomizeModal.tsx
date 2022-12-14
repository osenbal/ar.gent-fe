import * as React from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

type props = {
  children?: React.ReactChild | React.ReactChild[];
  title: string;
  open: boolean;
  id: string;
  handleClose: () => void;
  onSave: (e: React.MouseEvent) => Promise<void> | void;
};

const CustomizeModal: React.FC<props> = ({
  children,
  title,
  open,
  handleClose,
  id,
  onSave,
}) => {
  const { isLoading } = useAppSelector((state) => state.auth);

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby={id} open={open}>
        <BootstrapDialogTitle id={id} onClose={handleClose}>
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <Button disabled={isLoading} autoFocus onClick={onSave}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default CustomizeModal;
