import type { Meta, StoryObj } from '@storybook/react';

import RecurringEventDialog from '../components/RecurringEventDialog';
import { Event } from '../types';

const meta: Meta<typeof RecurringEventDialog> = {
  title: 'Components/Dialogs/RecurringEventDialog',
  component: RecurringEventDialog,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockEvent: Event = {
  id: '1',
  title: '팀 미팅',
  date: '2025-10-01',
  startTime: '10:00',
  endTime: '11:00',
  description: '주간 팀 미팅',
  location: '회의실 A',
  category: 'work',
  notificationTime: 15,
  repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
};

export const EditMode: Story = {
  args: {
    open: true,
    onClose: () => alert('닫혔습니다'),
    onConfirm: (editSingleOnly) => alert(editSingleOnly ? '이 일정만 수정' : '전체 반복 일정 수정'),
    event: mockEvent,
    mode: 'edit',
  },
};

export const DeleteMode: Story = {
  args: {
    open: true,
    onClose: () => alert('닫혔습니다'),
    onConfirm: (editSingleOnly) => alert(editSingleOnly ? '이 일정만 삭제' : '전체 반복 일정 삭제'),
    event: mockEvent,
    mode: 'delete',
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => alert('닫혔습니다'),
    onConfirm: (editSingleOnly) => alert(editSingleOnly ? '이 일정만 수정' : '전체 반복 일정 수정'),
    event: mockEvent,
    mode: 'edit',
  },
};
