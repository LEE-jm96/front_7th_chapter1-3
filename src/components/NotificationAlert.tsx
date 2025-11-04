import { Close } from '@mui/icons-material';
import { Alert, AlertTitle, IconButton, Stack } from '@mui/material';

interface Notification {
  message: string;
}

interface NotificationAlertProps {
  notifications: Notification[];
  onRemove: (index: number) => void;
}

export const NotificationAlert = ({ notifications, onRemove }: NotificationAlertProps) => {
  if (notifications.length === 0) return null;

  return (
    <Stack position="fixed" top={16} right={16} spacing={2} alignItems="flex-end">
      {notifications.map((notification, index: number) => (
        <Alert
          key={index}
          severity="info"
          sx={{ width: 'auto' }}
          action={
            <IconButton size="small" onClick={() => onRemove(index)}>
              <Close />
            </IconButton>
          }
        >
          <AlertTitle>{notification.message}</AlertTitle>
        </Alert>
      ))}
    </Stack>
  );
};
