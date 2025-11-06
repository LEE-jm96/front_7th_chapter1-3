import { act, renderHook } from '@testing-library/react';
import React from 'react';

import { useEventForm } from '../../hooks/useEventForm';
import { Event } from '../../types';

describe('useEventForm 초기 상태', () => {
  it('초기값이 올바르게 설정되어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    expect(result.current.title).toBe('');
    expect(result.current.date).toBe('');
    expect(result.current.startTime).toBe('');
    expect(result.current.endTime).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.location).toBe('');
    expect(result.current.category).toBe('업무');
    expect(result.current.isRepeating).toBe(false);
    expect(result.current.repeatType).toBe('none');
    expect(result.current.repeatInterval).toBe(1);
    expect(result.current.repeatEndDate).toBe('');
    expect(result.current.notificationTime).toBe(10);
    expect(result.current.startTimeError).toBe(null);
    expect(result.current.endTimeError).toBe(null);
    expect(result.current.editingEvent).toBe(null);
  });

  it('초기 이벤트가 전달되면 해당 값으로 설정되어야 한다', () => {
    const initialEvent: Event = {
      id: '1',
      title: '팀 미팅',
      date: '2025-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'daily', interval: 1, endDate: '2025-10-31' },
      notificationTime: 15,
    };

    const { result } = renderHook(() => useEventForm(initialEvent));

    expect(result.current.title).toBe('팀 미팅');
    expect(result.current.date).toBe('2025-10-01');
    expect(result.current.startTime).toBe('10:00');
    expect(result.current.endTime).toBe('11:00');
    expect(result.current.description).toBe('주간 팀 미팅');
    expect(result.current.location).toBe('회의실 A');
    expect(result.current.category).toBe('업무');
    expect(result.current.isRepeating).toBe(true);
    expect(result.current.repeatType).toBe('daily');
    expect(result.current.repeatInterval).toBe(1);
    expect(result.current.repeatEndDate).toBe('2025-10-31');
    expect(result.current.notificationTime).toBe(15);
  });

  it('반복 일정이 없는 초기 이벤트는 isRepeating이 false여야 한다', () => {
    const initialEvent: Event = {
      id: '1',
      title: '회의',
      date: '2025-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '',
      location: '',
      category: '업무',
      repeat: { type: 'none', interval: 0, endDate: '' },
      notificationTime: 10,
    };

    const { result } = renderHook(() => useEventForm(initialEvent));

    expect(result.current.isRepeating).toBe(false);
    expect(result.current.repeatType).toBe('none');
  });
});

describe('useEventForm 상태 업데이트', () => {
  it('제목을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setTitle('새로운 회의');
    });

    expect(result.current.title).toBe('새로운 회의');
  });

  it('날짜를 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setDate('2025-10-15');
    });

    expect(result.current.date).toBe('2025-10-15');
  });

  it('카테고리를 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setCategory('개인');
    });

    expect(result.current.category).toBe('개인');
  });

  it('반복 여부를 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setIsRepeating(true);
    });

    expect(result.current.isRepeating).toBe(true);
  });

  it('반복 타입을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setRepeatType('weekly');
    });

    expect(result.current.repeatType).toBe('weekly');
  });

  it('반복 간격을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setRepeatInterval(2);
    });

    expect(result.current.repeatInterval).toBe(2);
  });

  it('알림 시간을 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setNotificationTime(30);
    });

    expect(result.current.notificationTime).toBe(30);
  });
});

describe('useEventForm 시간 검증', () => {
  it('시작 시간이 종료 시간보다 크면 에러가 표시되어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setEndTime('11:00');
    });

    act(() => {
      result.current.handleStartTimeChange({
        target: { value: '12:00' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.startTimeError).not.toBeNull();
    expect(result.current.startTimeError).toContain('시작 시간은 종료 시간보다 빨라야 합니다');
  });

  it('종료 시간이 시작 시간보다 작으면 에러가 표시되어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setStartTime('12:00');
    });

    act(() => {
      result.current.handleEndTimeChange({
        target: { value: '11:00' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.endTimeError).not.toBeNull();
    expect(result.current.endTimeError).toContain('종료 시간은 시작 시간보다 늦어야 합니다');
  });

  it('올바른 시간 범위일 때 에러가 없어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setStartTime('10:00');
    });

    act(() => {
      result.current.handleEndTimeChange({
        target: { value: '11:00' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.endTimeError).toBeNull();
  });

  it('시작 시간 변경 시 자동으로 종료 시간과 비교한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setEndTime('11:00');
    });

    act(() => {
      result.current.handleStartTimeChange({
        target: { value: '10:00' },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.startTimeError).toBeNull();
  });
});

describe('useEventForm 폼 초기화', () => {
  it('resetForm이 모든 필드를 초기값으로 복원해야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    // 모든 필드 변경
    act(() => {
      result.current.setTitle('회의');
      result.current.setDate('2025-10-15');
      result.current.setStartTime('10:00');
      result.current.setEndTime('11:00');
      result.current.setDescription('설명');
      result.current.setLocation('장소');
      result.current.setCategory('개인');
      result.current.setIsRepeating(true);
      result.current.setRepeatType('daily');
      result.current.setRepeatInterval(2);
      result.current.setRepeatEndDate('2025-11-15');
      result.current.setNotificationTime(30);
    });

    // resetForm 호출
    act(() => {
      result.current.resetForm();
    });

    // 모든 필드가 초기값으로 복원되었는지 확인
    expect(result.current.title).toBe('');
    expect(result.current.date).toBe('');
    expect(result.current.startTime).toBe('');
    expect(result.current.endTime).toBe('');
    expect(result.current.description).toBe('');
    expect(result.current.location).toBe('');
    expect(result.current.category).toBe('업무');
    expect(result.current.isRepeating).toBe(false);
    expect(result.current.repeatType).toBe('none');
    expect(result.current.repeatInterval).toBe(1);
    expect(result.current.repeatEndDate).toBe('');
    expect(result.current.notificationTime).toBe(10);
  });
});

describe('useEventForm 이벤트 수정', () => {
  it('editEvent가 이벤트 데이터로 폼을 채워야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    const eventToEdit: Event = {
      id: '1',
      title: '수정할 회의',
      date: '2025-10-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '수정 대상 설명',
      location: '회의실 B',
      category: '개인',
      repeat: { type: 'weekly', interval: 1, endDate: '2025-12-31' },
      notificationTime: 60,
    };

    act(() => {
      result.current.editEvent(eventToEdit);
    });

    expect(result.current.title).toBe('수정할 회의');
    expect(result.current.date).toBe('2025-10-20');
    expect(result.current.startTime).toBe('14:00');
    expect(result.current.endTime).toBe('15:00');
    expect(result.current.description).toBe('수정 대상 설명');
    expect(result.current.location).toBe('회의실 B');
    expect(result.current.category).toBe('개인');
    expect(result.current.isRepeating).toBe(true);
    expect(result.current.repeatType).toBe('weekly');
    expect(result.current.repeatInterval).toBe(1);
    expect(result.current.repeatEndDate).toBe('2025-12-31');
    expect(result.current.notificationTime).toBe(60);
    expect(result.current.editingEvent).toEqual(eventToEdit);
  });

  it('반복이 없는 이벤트 수정 시 isRepeating이 false여야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    const eventToEdit: Event = {
      id: '1',
      title: '단일 이벤트',
      date: '2025-10-20',
      startTime: '14:00',
      endTime: '15:00',
      description: '',
      location: '',
      category: '업무',
      repeat: { type: 'none', interval: 0, endDate: '' },
      notificationTime: 10,
    };

    act(() => {
      result.current.editEvent(eventToEdit);
    });

    expect(result.current.isRepeating).toBe(false);
    expect(result.current.repeatType).toBe('none');
  });
});

describe('useEventForm 여러 필드 동시 업데이트', () => {
  it('여러 필드를 순차적으로 업데이트할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setTitle('팀 미팅');
      result.current.setDate('2025-10-25');
      result.current.setStartTime('09:00');
      result.current.setEndTime('10:00');
      result.current.setDescription('주간 회의');
      result.current.setLocation('회의실 A');
      result.current.setCategory('업무');
    });

    expect(result.current.title).toBe('팀 미팅');
    expect(result.current.date).toBe('2025-10-25');
    expect(result.current.startTime).toBe('09:00');
    expect(result.current.endTime).toBe('10:00');
    expect(result.current.description).toBe('주간 회의');
    expect(result.current.location).toBe('회의실 A');
    expect(result.current.category).toBe('업무');
  });

  it('반복 일정의 모든 필드를 설정할 수 있어야 한다', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.setIsRepeating(true);
      result.current.setRepeatType('weekly');
      result.current.setRepeatInterval(2);
      result.current.setRepeatEndDate('2025-12-31');
    });

    expect(result.current.isRepeating).toBe(true);
    expect(result.current.repeatType).toBe('weekly');
    expect(result.current.repeatInterval).toBe(2);
    expect(result.current.repeatEndDate).toBe('2025-12-31');
  });
});
