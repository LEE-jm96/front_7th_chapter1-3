import type { Meta, StoryObj } from '@storybook/react';

import { NotificationAlert } from '../components/NotificationAlert';

const meta: Meta<typeof NotificationAlert> = {
  title: 'Components/Dialogs/NotificationAlert',
  component: NotificationAlert,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    notifications: [],
    onRemove: (index) => alert(`알림 ${index}번 제거됨`),
  },
};

export const Single: Story = {
  args: {
    notifications: [{ message: '일정이 저장되었습니다.' }],
    onRemove: (index) => alert(`알림 ${index}번 제거됨`),
  },
};

export const Multiple: Story = {
  args: {
    notifications: [
      { message: '팀 미팅이 10분 뒤에 시작됩니다.' },
      { message: '일정이 성공적으로 저장되었습니다.' },
      { message: '반복 일정이 생성되었습니다.' },
    ],
    onRemove: (index) => alert(`알림 ${index}번 제거됨`),
  },
};

export const LongMessage: Story = {
  args: {
    notifications: [
      {
        message: '새로운 일정이 추가되었습니다. 내일 오전 10시 팀 회의 회의실 A에서 진행됩니다.',
      },
      { message: '중복된 일정이 감지되었습니다. 확인해주세요.' },
    ],
    onRemove: (index) => alert(`알림 ${index}번 제거됨`),
  },
};

export const Stacked: Story = {
  args: {
    notifications: [
      { message: '첫 번째 알림입니다.' },
      { message: '두 번째 알림입니다.' },
      { message: '세 번째 알림입니다.' },
      { message: '네 번째 알림입니다.' },
      { message: '다섯 번째 알림입니다.' },
    ],
    onRemove: (index) => alert(`알림 ${index}번 제거됨`),
  },
};
