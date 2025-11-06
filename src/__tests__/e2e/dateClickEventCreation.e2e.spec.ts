import fs from 'fs';
import path from 'path';

import { test, expect, Page } from '@playwright/test';

const E2E_JSON_PATH = path.resolve('./src/__mocks__/response/e2e.json');
const BACKUP_PATH = path.resolve('./src/__mocks__/response/e2e.backup.json');

// e2e.json 백업
function backupE2eData() {
  const data = fs.readFileSync(E2E_JSON_PATH, 'utf8');
  fs.writeFileSync(BACKUP_PATH, data);
}

// e2e.json 복원
function restoreE2eData() {
  const backupData = fs.readFileSync(BACKUP_PATH, 'utf8');
  fs.writeFileSync(E2E_JSON_PATH, backupData);
}

test.describe('날짜 클릭으로 일정 생성 E2E 테스트', () => {
  let page: Page;

  test.beforeAll(() => {
    // 모든 테스트 시작 전 백업
    backupE2eData();
  });

  test.afterAll(() => {
    // 모든 테스트 종료 후 복원
    restoreE2eData();
  });

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    // 각 테스트 후 e2e.json 복원
    restoreE2eData();
    await page.close();
  });

  test('캘린더의 비어있는 날짜 셀을 클릭하면, 해당 날짜가 자동으로 폼에 채워진다.', async () => {
    // 로딩 완료 대기
    await page.waitForSelector('[data-testid="event-list"]');

    // 1. 캘린더에서 20일 셀 클릭
    const calendarCell = page.locator('[data-calendar-cell="true"]').filter({
      hasText: /^20$/,
    });
    await calendarCell.first().click();
    await page.waitForTimeout(500);

    // 2. 날짜가 폼에 바인딩되었는지 확인
    const dateInput = page.locator('input[id="date"]');
    await expect(dateInput).toHaveValue('2025-11-20');
  });

  test('캘린더 날짜 클릭 후 일정 정보를 입력하고 저장할 수 있다', async () => {
    // 로딩 완료 대기
    await page.waitForSelector('[data-testid="event-list"]');

    // 1. 캘린더에서 20일 셀 클릭
    const calendarCell = page.locator('[data-calendar-cell="true"]').filter({
      hasText: /^20$/,
    });
    await calendarCell.first().click();
    await page.waitForTimeout(500);

    // 2. 날짜가 폼에 바인딩되었는지 확인
    const dateInput = page.locator('input[id="date"]');
    await expect(dateInput).toHaveValue('2025-11-20');

    // 3. 제목 입력
    const titleInput = page.getByRole('textbox', { name: '제목' });
    await titleInput.fill('날짜 클릭으로 생성한 회의');

    // 4. 시작 시간 입력
    const startTimeInput = page.locator('input[id="start-time"]');
    await startTimeInput.fill('14:00');

    // 5. 종료 시간 입력
    const endTimeInput = page.locator('input[id="end-time"]');
    await endTimeInput.fill('15:00');

    // 6. 일정 저장
    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // 7. 저장 완료 메시지 확인
    await expect(page.locator('text=일정이 추가되었습니다')).toBeVisible({ timeout: 5000 });

    // 8. 일정 리스트에 추가된 일정 확인
    const eventList = page.locator('[data-testid="event-list"]');
    await expect(eventList).toContainText('날짜 클릭으로 생성한 회의');
    await expect(eventList).toContainText('2025-11-20');
    await expect(eventList).toContainText('14:00');
  });
});
