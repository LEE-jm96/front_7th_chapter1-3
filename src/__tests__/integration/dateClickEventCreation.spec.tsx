import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { describe, it, expect } from 'vitest';

import { setupMockHandlerUpdating } from '../../__mocks__/handlersUtils';
import App from '../../App';

const theme = createTheme();

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

describe('날짜 클릭으로 일정 생성 통합 테스트', () => {
  it('캘린더의 빈 날짜 셀을 클릭하면 좌측 폼에 해당 날짜가 자동으로 바인딩된다', async () => {
    // 빈 이벤트 목록으로 모든 날짜가 비어있도록 설정
    setupMockHandlerUpdating([]);

    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    // 캘린더에서 특정 날짜 셀 클릭 (10월 15일)
    // data-calendar-cell 속성으로 TableCell을 찾음
    const calendarCells = document.querySelectorAll('[data-calendar-cell="true"]');

    // 15일을 찾기 (textContent로 검색)
    let targetCell: Element | undefined;
    for (const cell of calendarCells) {
      if (cell.textContent?.includes('15')) {
        targetCell = cell;
        break;
      }
    }

    expect(targetCell).toBeTruthy();

    await user.click(targetCell as HTMLElement);

    // 폼의 date input에 자동으로 날짜가 바인딩되었는지 확인
    const dateInput = document.querySelector('input[id="date"]') as HTMLInputElement;
    expect(dateInput?.value).toBe('2025-10-15');
  });
});
