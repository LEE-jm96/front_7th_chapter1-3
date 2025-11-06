import type { Meta, StoryObj } from '@storybook/react';

import { OverlapDialog } from '../components/OverlapDialog';
import { Event } from '../types';

const meta: Meta<typeof OverlapDialog> = {
  title: 'Components/Dialogs/OverlapDialog',
  component: OverlapDialog,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockOverlapEvents: Event[] = [
  {
    id: '1',
    title: '팀 미팅',
    date: '2025-10-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: 'work',
    notificationTime: 15,
    repeat: { type: 'none', interval: 0, endDate: '' },
  },
  {
    id: '2',
    title: '클라이언트 미팅',
    date: '2025-10-01',
    startTime: '10:30',
    endTime: '11:30',
    description: '중요 클라이언트 미팅',
    location: '카페',
    category: 'work',
    notificationTime: 30,
    repeat: { type: 'none', interval: 0, endDate: '' },
  },
];

export const SingleEvent: Story = {
  args: {
    open: true,
    onClose: () => alert('닫혔습니다'),
    overlappingEvents: [mockOverlapEvents[0]],
    onContinue: () => alert('계속 진행'),
  },
};

export const MultipleEvents: Story = {
  args: {
    open: true,
    onClose: () => alert('닫혔습니다'),
    overlappingEvents: mockOverlapEvents,
    onContinue: () => alert('계속 진행'),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => alert('닫혔습니다'),
    overlappingEvents: mockOverlapEvents,
    onContinue: () => alert('계속 진행'),
  },
};
