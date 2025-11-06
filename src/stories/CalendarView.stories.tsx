import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from '../components/CalendarView';
import { Event } from '../types';
import { Box } from '@mui/material';

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 테스트용 이벤트 데이터
const mockEvents: Event[] = [
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
    repeat: {
      type: 'none',
      interval: 0,
      endDate: '',
    },
  },
  {
    id: '2',
    title: '반복 회의',
    date: '2025-10-02',
    startTime: '14:00',
    endTime: '15:00',
    description: '매주 반복되는 회의',
    location: '온라인',
    category: 'work',
    notificationTime: 10,
    repeat: {
      type: 'weekly',
      interval: 1,
      endDate: '2025-12-31',
    },
  },
  {
    id: '3',
    title: '알림 있는 일정',
    date: '2025-10-03',
    startTime: '09:00',
    endTime: '09:30',
    description: '알림이 설정된 일정',
    location: '사무실',
    category: 'personal',
    notificationTime: 30,
    repeat: {
      type: 'none',
      interval: 0,
      endDate: '',
    },
  },
];

const mockHolidays = {
  '2025-10-03': '개천절',
  '2025-10-09': '한글날',
};

// 주간 뷰 - 이벤트 없음
export const WeekViewEmpty: Story = {
  args: {
    view: 'week',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: {},
    navigate: () => {},
    filteredEvents: [],
    notifiedEvents: [],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 주간 뷰 - 이벤트 있음
export const WeekViewWithEvents: Story = {
  args: {
    view: 'week',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: mockHolidays,
    navigate: () => {},
    filteredEvents: mockEvents,
    notifiedEvents: ['3'], // 알림 설정된 이벤트 ID
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 월간 뷰 - 이벤트 없음
export const MonthViewEmpty: Story = {
  args: {
    view: 'month',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: {},
    navigate: () => {},
    filteredEvents: [],
    notifiedEvents: [],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 월간 뷰 - 이벤트 있음
export const MonthViewWithEvents: Story = {
  args: {
    view: 'month',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: mockHolidays,
    navigate: () => {},
    filteredEvents: mockEvents,
    notifiedEvents: ['3'],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 월간 뷰 - 휴일과 함께
export const MonthViewWithHolidays: Story = {
  args: {
    view: 'month',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: {
      '2025-10-03': '개천절',
      '2025-10-05': '추석',
      '2025-10-06': '추석',
      '2025-10-07': '추석',
      '2025-10-09': '한글날',
    },
    navigate: () => {},
    filteredEvents: mockEvents,
    notifiedEvents: ['3'],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 월간 뷰 - 많은 이벤트
export const MonthViewManyEvents: Story = {
  args: {
    view: 'month',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: mockHolidays,
    navigate: () => {},
    filteredEvents: [
      ...mockEvents,
      {
        id: '4',
        title: '생일',
        date: '2025-10-10',
        startTime: '00:00',
        endTime: '23:59',
        description: '생일',
        location: '',
        category: 'personal',
        notificationTime: 60,
        repeat: {
          type: 'yearly',
          interval: 1,
          endDate: '',
        },
      },
      {
        id: '5',
        title: '프로젝트 마감',
        date: '2025-10-15',
        startTime: '18:00',
        endTime: '19:00',
        description: '중요한 프로젝트 마감일',
        location: '',
        category: 'work',
        notificationTime: 120,
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '',
        },
      },
    ],
    notifiedEvents: ['3', '4'],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 이벤트 겹침 테스트
export const MonthViewWithOverlappingEvents: Story = {
  args: {
    view: 'month',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: mockHolidays,
    navigate: () => {},
    filteredEvents: [
      ...mockEvents,
      {
        id: '6',
        title: '긴급 회의',
        date: '2025-10-01',
        startTime: '10:00',
        endTime: '11:00',
        description: '같은 시간 겹치는 이벤트',
        location: '회의실 B',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
    ],
    notifiedEvents: ['1', '3', '6'],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 카테고리별 색상 차이
export const MonthViewMultipleCategories: Story = {
  args: {
    view: 'month',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: mockHolidays,
    navigate: () => {},
    filteredEvents: [
      ...mockEvents,
      {
        id: '7',
        title: '병원 예약',
        date: '2025-10-08',
        startTime: '14:00',
        endTime: '15:00',
        description: 'health 카테고리',
        location: '서울병원',
        category: 'personal', // 다른 색상으로 표시
        notificationTime: 60,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
    ],
    notifiedEvents: ['3', '7'],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 일정 상태별 시각적 표현 - 반복 패턴
export const EventsWithRepeatPatterns: Story = {
  args: {
    view: 'month',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: mockHolidays,
    navigate: () => {},
    filteredEvents: [
      // 매일 반복: 10월 1-4일
      {
        id: '15-1',
        title: '매일: 아침 회의',
        date: '2025-10-01',
        startTime: '09:00',
        endTime: '09:30',
        description: '매일 반복',
        location: '회의실',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'daily', interval: 1, endDate: '2025-10-31' },
      },
      {
        id: '15-2',
        title: '매일: 아침 회의',
        date: '2025-10-02',
        startTime: '09:00',
        endTime: '09:30',
        description: '매일 반복',
        location: '회의실',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'daily', interval: 1, endDate: '2025-10-31' },
      },
      {
        id: '15-3',
        title: '매일: 아침 회의',
        date: '2025-10-03',
        startTime: '09:00',
        endTime: '09:30',
        description: '매일 반복',
        location: '회의실',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'daily', interval: 1, endDate: '2025-10-31' },
      },
      {
        id: '15-4',
        title: '매일: 아침 회의',
        date: '2025-10-04',
        startTime: '09:00',
        endTime: '09:30',
        description: '매일 반복',
        location: '회의실',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'daily', interval: 1, endDate: '2025-10-31' },
      },
      // 매주 반복: 10월 2, 9, 16, 23, 30일 (목요일)
      {
        id: '16-1',
        title: '매주: 팀 회의',
        date: '2025-10-02',
        startTime: '14:00',
        endTime: '15:00',
        description: '매주 반복',
        location: '온라인',
        category: 'work',
        notificationTime: 30,
        repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
      },
      {
        id: '16-2',
        title: '매주: 팀 회의',
        date: '2025-10-09',
        startTime: '14:00',
        endTime: '15:00',
        description: '매주 반복',
        location: '온라인',
        category: 'work',
        notificationTime: 30,
        repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
      },
      {
        id: '16-3',
        title: '매주: 팀 회의',
        date: '2025-10-16',
        startTime: '14:00',
        endTime: '15:00',
        description: '매주 반복',
        location: '온라인',
        category: 'work',
        notificationTime: 30,
        repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
      },
      {
        id: '16-4',
        title: '매주: 팀 회의',
        date: '2025-10-23',
        startTime: '14:00',
        endTime: '15:00',
        description: '매주 반복',
        location: '온라인',
        category: 'work',
        notificationTime: 30,
        repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
      },
      {
        id: '16-5',
        title: '매주: 팀 회의',
        date: '2025-10-30',
        startTime: '14:00',
        endTime: '15:00',
        description: '매주 반복',
        location: '온라인',
        category: 'work',
        notificationTime: 30,
        repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
      },
      // 매월 반복
      {
        id: '17',
        title: '매월: 급여 지급',
        date: '2025-10-01',
        startTime: '18:00',
        endTime: '18:30',
        description: '매월 반복',
        location: '',
        category: 'personal',
        notificationTime: 120,
        repeat: { type: 'monthly', interval: 1, endDate: '' },
      },
      // 매년 반복
      {
        id: '18',
        title: '매년: 생일',
        date: '2025-10-15',
        startTime: '00:00',
        endTime: '23:59',
        description: '매년 반복',
        location: '',
        category: 'personal',
        notificationTime: 1440,
        repeat: { type: 'yearly', interval: 1, endDate: '' },
      },
    ],
    notifiedEvents: ['15-1', '15-2', '15-3', '15-4', '16-1', '16-2', '16-3', '16-4', '16-5', '17', '18'],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 일정 상태별 시각적 표현 - 곧 시작할 일정 (종 모양 알림)
export const EventsStartingSoon: Story = {
  args: {
    view: 'month',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: mockHolidays,
    navigate: () => {},
    filteredEvents: [
      // 오늘(10월 1일) - 곧 시작하는 일정들
      {
        id: '20',
        title: '지금 시작: 팀 스탠드업',
        date: '2025-10-01',
        startTime: '10:00',
        endTime: '10:30',
        description: '바로 시작',
        location: '회의실 A',
        category: 'work',
        notificationTime: 1, // 1분 전 알림
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
      {
        id: '21',
        title: '5분 후: 클라이언트 미팅',
        date: '2025-10-01',
        startTime: '10:45',
        endTime: '11:45',
        description: '5분 뒤 시작',
        location: '화상 회의',
        category: 'work',
        notificationTime: 5,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
      {
        id: '22',
        title: '15분 후: 프로젝트 체크인',
        date: '2025-10-01',
        startTime: '11:00',
        endTime: '11:30',
        description: '15분 뒤 시작',
        location: '회의실 B',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
      // 내일(10월 2일) - 내일의 첫 일정
      {
        id: '23',
        title: '내일 첫 일정: 아침 회의',
        date: '2025-10-02',
        startTime: '09:00',
        endTime: '10:00',
        description: '내일 아침',
        location: '회의실',
        category: 'work',
        notificationTime: 60,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
      // 중요한 일정들
      {
        id: '24',
        title: '중요: 보고서 제출 마감',
        date: '2025-10-03',
        startTime: '17:00',
        endTime: '18:00',
        description: '긴급 제출',
        location: '',
        category: 'work',
        notificationTime: 30,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
      {
        id: '25',
        title: '중요: 회의 준비 완료',
        date: '2025-10-04',
        startTime: '14:00',
        endTime: '15:30',
        description: '2시간 전 알림',
        location: '',
        category: 'work',
        notificationTime: 120,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
    ],
    notifiedEvents: ['20', '21', '22', '23', '24', '25'],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
};

// 각 셀 텍스트 길이에 따른 처리 - 툴팁 테스트
export const TextLengthWithTooltip: Story = {
  args: {
    view: 'month',
    setView: () => {},
    currentDate: new Date('2025-10-01'),
    holidays: mockHolidays,
    navigate: () => {},
    filteredEvents: [
      {
        id: '26',
        title: '회의',
        date: '2025-10-01',
        startTime: '10:00',
        endTime: '11:00',
        description: '짧은 제목',
        location: '',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
      {
        id: '27',
        title: '팀 미팅',
        date: '2025-10-02',
        startTime: '10:00',
        endTime: '11:00',
        description: '중간 길이 제목',
        location: '',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
      {
        id: '28',
        title: '분기별 비즈니스 리뷰 미팅',
        date: '2025-10-03',
        startTime: '10:00',
        endTime: '11:00',
        description: '긴 제목 - 호버하면 전체 텍스트 표시',
        location: '',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
      {
        id: '29',
        title: '2025년 4분기 전략 수립 및 팀 성과 검토 회의',
        date: '2025-10-04',
        startTime: '10:00',
        endTime: '11:00',
        description: '매우 긴 제목 - 호버 시 완전한 텍스트 표시 (Tooltip)',
        location: '',
        category: 'work',
        notificationTime: 15,
        repeat: { type: 'none', interval: 0, endDate: '' },
      },
      {
        id: '30',
        title: '긴 제목 + 알림 + 반복: 클라이언트 정기 미팅',
        date: '2025-10-05',
        startTime: '10:00',
        endTime: '11:00',
        description: '길이 + 알림 아이콘 + 반복 아이콘',
        location: '',
        category: 'work',
        notificationTime: 30,
        repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
      },
      {
        id: '31',
        title: '초장문 제목: 매월 첫주 월요일 전사 임원진 정기 전략 회의 및 분기 OKR 최종 확정 회의',
        date: '2025-10-06',
        startTime: '10:00',
        endTime: '11:00',
        description: '초장문 제목 테스트',
        location: '',
        category: 'personal',
        notificationTime: 60,
        repeat: { type: 'monthly', interval: 1, endDate: '' },
      },
    ],
    notifiedEvents: ['30', '31'],
    onEventDrop: () => {},
    onDateClick: () => {},
  },
  parameters: {
    // Chromatic에서 Tooltip을 항상 보이도록 설정
    chromatic: {
      delay: 100, // Tooltip 렌더링 시간 확보
    },
  },
  decorators: [
    (Story) => (
      <Box data-chromatic-tooltip sx={{ position: 'relative' }}>
        <style>
          {`
            /* Chromatic에서 Tooltip 항상 표시 */
            [role="tooltip"] {
              visibility: visible !important;
              opacity: 1 !important;
              pointer-events: auto !important;
            }
          `}
        </style>
        <Story />
      </Box>
    ),
  ],
};