import { ChevronLeft, ChevronRight, Notifications, Repeat } from '@mui/icons-material';
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

import { Event, RepeatType } from '../types';
import {
  formatDate,
  formatMonth,
  formatWeek,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
} from '../utils/dateUtils';

interface CalendarViewProps {
  view: 'week' | 'month';
  setView: (_view: 'week' | 'month') => void;
  currentDate: Date;
  holidays: Record<string, string>;
  navigate: (_direction: 'prev' | 'next') => void;
  filteredEvents: Event[];
  notifiedEvents: string[];
  onEventDrop?: (_eventId: string, _newDate: string) => void;
  onDateClick?: (_date: string) => void;
}

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const eventBoxStyles = {
  notified: {
    backgroundColor: '#ffebee',
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  normal: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'normal',
    color: 'inherit',
  },
  common: {
    p: 0.5,
    my: 0.5,
    borderRadius: 1,
    minHeight: '18px',
    width: '100%',
    overflow: 'hidden',
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing',
    },
  },
};

const getRepeatTypeLabel = (type: RepeatType): string => {
  switch (type) {
    case 'daily':
      return '일';
    case 'weekly':
      return '주';
    case 'monthly':
      return '월';
    case 'yearly':
      return '년';
    default:
      return '';
  }
};

const EventCell = ({
  event,
  isNotified,
  isRepeating,
  isDragging,
  onDragStart,
}: {
  event: Event;
  isNotified: boolean;
  isRepeating: boolean;
  isDragging?: boolean;
  onDragStart?: (eventId: string) => void;
}) => (
  <Box
    draggable
    onDragStart={(e) => {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', event.id);
      onDragStart?.(event.id);
    }}
    onDragEnd={(e) => {
      e.stopPropagation();
    }}
    sx={{
      ...eventBoxStyles.common,
      ...(isNotified ? eventBoxStyles.notified : eventBoxStyles.normal),
      opacity: isDragging ? 0.5 : 1,
      transition: 'opacity 0.2s',
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center">
      {isNotified && <Notifications fontSize="small" />}
      {isRepeating && (
        <Tooltip
          title={`${event.repeat.interval}${getRepeatTypeLabel(event.repeat.type)}마다 반복${
            event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
          }`}
        >
          <Repeat fontSize="small" />
        </Tooltip>
      )}
      {/* PR: tooltip을 추가하여 클릭 시 툴팁이 나오도록 수정 */}
      <Tooltip title={event.title} placement="top">
        <Typography
          variant="caption"
          noWrap
          sx={{
            fontSize: '0.75rem',
            lineHeight: 1.2,
          }}
        >
          {event.title}
        </Typography>
      </Tooltip>
    </Stack>
  </Box>
);

export const CalendarView = ({
  view,
  setView,
  currentDate,
  holidays,
  navigate,
  filteredEvents,
  notifiedEvents,
  onEventDrop,
  onDateClick,
}: CalendarViewProps) => {
  const [draggedEventId, setDraggedEventId] = React.useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    // CalendarView 내에서만 드래그 허용
    const target = e.currentTarget as HTMLElement;
    const cellAttr = target.getAttribute('data-calendar-cell');

    // 유효한 셀 (data-calendar-cell="true")에서만 drop 허용
    if (cellAttr === 'true') {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedEventId(null);
  };

  const handleDrop = (e: React.DragEvent, newDate: string) => {
    e.preventDefault();
    e.stopPropagation();

    // 드롭 타겟이 유효한 셀인지 확인
    const target = e.currentTarget as HTMLElement;
    const cellAttr = target.getAttribute('data-calendar-cell');

    // 드래그 상태 항상 초기화
    setDraggedEventId(null);

    // 유효한 셀 (data-calendar-cell="true")에서만 drop 처리
    if (cellAttr !== 'true') {
      return;
    }

    const eventId = e.dataTransfer.getData('text/plain');
    if (eventId && onEventDrop) {
      onEventDrop(eventId, newDate);
    }
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    return (
      <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatWeek(currentDate)}</Typography>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                {weekDays.map((day) => (
                  <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {weekDates.map((date) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const eventsOnDate = filteredEvents.filter(
                    (event) => new Date(event.date).toDateString() === date.toDateString()
                  );
                  return (
                    <TableCell
                      key={date.toISOString()}
                      data-calendar-cell="true"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e as React.DragEvent, dateStr)}
                      onClick={() => {
                        if (eventsOnDate.length === 0) {
                          onDateClick?.(dateStr);
                        }
                      }}
                      sx={{
                        height: '120px',
                        verticalAlign: 'top',
                        width: '14.28%',
                        padding: 1,
                        border: '1px solid #e0e0e0',
                        overflow: 'hidden',
                        backgroundColor: draggedEventId
                          ? 'rgba(100, 100, 100, 0.05)'
                          : 'transparent',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {date.getDate()}
                      </Typography>
                      {filteredEvents
                        .filter(
                          (event) => new Date(event.date).toDateString() === date.toDateString()
                        )
                        .map((event) => {
                          const isNotified = notifiedEvents.includes(event.id);
                          const isRepeating = event.repeat.type !== 'none';

                          return (
                            <EventCell
                              key={event.id}
                              event={event}
                              isNotified={isNotified}
                              isRepeating={isRepeating}
                              isDragging={draggedEventId === event.id}
                              onDragStart={setDraggedEventId}
                            />
                          );
                        })}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    );
  };

  const renderMonthView = () => {
    const weeks = getWeeksAtMonth(currentDate);

    return (
      <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatMonth(currentDate)}</Typography>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                {weekDays.map((day) => (
                  <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeks.map((week, weekIndex) => (
                <TableRow key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    const dateString = day ? formatDate(currentDate, day) : '';
                    const holiday = holidays[dateString];
                    const eventsOnDate = day ? getEventsForDay(filteredEvents, day) : [];

                    return (
                      <TableCell
                        key={dayIndex}
                        data-calendar-cell={day ? 'true' : 'false'}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => day && handleDrop(e as React.DragEvent, dateString)}
                        onClick={() => {
                          if (day && eventsOnDate.length === 0) {
                            onDateClick?.(dateString);
                          }
                        }}
                        sx={{
                          height: '120px',
                          verticalAlign: 'top',
                          width: '14.28%',
                          padding: 1,
                          border: '1px solid #e0e0e0',
                          overflow: 'hidden',
                          position: 'relative',
                          backgroundColor: draggedEventId
                            ? 'rgba(100, 100, 100, 0.05)'
                            : 'transparent',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        {day && (
                          <>
                            <Typography variant="body2" fontWeight="bold">
                              {day}
                            </Typography>
                            {holiday && (
                              <Typography variant="body2" color="error">
                                {holiday}
                              </Typography>
                            )}
                            {getEventsForDay(filteredEvents, day).map((event) => {
                              const isNotified = notifiedEvents.includes(event.id);
                              const isRepeating = event.repeat.type !== 'none';

                              return (
                                <EventCell
                                  key={event.id}
                                  event={event}
                                  isNotified={isNotified}
                                  isRepeating={isRepeating}
                                  isDragging={draggedEventId === event.id}
                                  onDragStart={setDraggedEventId}
                                />
                              );
                            })}
                          </>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    );
  };

  return (
    <Stack data-testid="calendar-view" flex={1} spacing={5}>
      <Typography variant="h4">일정 보기</Typography>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
          <ChevronLeft />
        </IconButton>
        <Select
          size="small"
          aria-label="뷰 타입 선택"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <MenuItem value="week" aria-label="week-option">
            Week
          </MenuItem>
          <MenuItem value="month" aria-label="month-option">
            Month
          </MenuItem>
        </Select>
        <IconButton aria-label="Next" onClick={() => navigate('next')}>
          <ChevronRight />
        </IconButton>
      </Stack>

      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
    </Stack>
  );
};

export default CalendarView;
