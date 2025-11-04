import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Event } from '../types';

interface OverlapDialogProps {
  open: boolean;
  onClose: () => void;
  overlappingEvents: Event[];
  onContinue: () => void;
}

export const OverlapDialog = ({
  open,
  onClose,
  overlappingEvents,
  onContinue,
}: OverlapDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>일정 겹침 경고</DialogTitle>
      <DialogContent>
        <DialogContentText>다음 일정과 겹칩니다:</DialogContentText>
        {overlappingEvents.map((event) => (
          <Typography key={event.id} sx={{ ml: 1, mb: 1 }}>
            {event.title} ({event.date} {event.startTime}-{event.endTime})
          </Typography>
        ))}
        <DialogContentText>계속 진행하시겠습니까?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button color="error" onClick={onContinue}>
          계속 진행
        </Button>
      </DialogActions>
    </Dialog>
  );
};
