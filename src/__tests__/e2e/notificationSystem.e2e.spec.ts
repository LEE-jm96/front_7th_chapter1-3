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

test.describe('알림 시스템 워크플로우 (실제 알림 Alert)', () => {
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

    // 시간을 고정 (2025-11-29 10:00:00)
    await page.clock.install();
    await page.clock.setFixedTime(new Date('2025-11-29T10:00:00'));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    // 각 테스트 후 e2e.json 복원
    restoreE2eData();
    await page.close();
  });

  test('10분 전 알림 - Alert 표시 테스트', async () => {
    // 시간: 10:00 고정
    // 일정: 10:10 ~ 15:10
    // 알림: 10분 전 (10:00에 표시되어야 함)

    // 1. 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('10분 전 알림 테스트');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-29');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:10');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('15:10');

    // 알림 선택
    await page.getByRole('combobox', { name: '분 전' }).click();
    await page.getByRole('option', { name: '10분 전' }).click();

    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // 2. 일정 생성 확인
    const eventListPanel = page.locator('[data-testid="event-list"]');
    await expect(eventListPanel).toContainText('10분 전 알림 테스트');
    await expect(eventListPanel).toContainText('알림: 10분 전');

    // 3. 시간을 1초 진행해서 알림 check (interval이 1000ms이므로)
    await page.clock.runFor(1100);

    // Alert 메시지가 나타나는지 확인 - 정확한 메시지 텍스트로 검색
    await expect(
      page.locator('text=/10분 후.*10분 전 알림 테스트.*일정이 시작됩니다/')
    ).toBeVisible({ timeout: 5000 });
  });

  test('10분 전 알림 - 알람 아이콘 테스트', async () => {
    // 시간: 10:00 고정
    // 일정: 10:10 ~ 15:10
    // 알림: 10분 전 (10:00에 표시되어야 함)

    // 1. 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('10분 전 알림 테스트');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-29');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:10');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('15:10');

    // 알림 선택
    await page.getByRole('combobox', { name: '분 전' }).click();
    await page.getByRole('option', { name: '10분 전' }).click();

    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // 2. 일정 생성 확인
    const eventListPanel = page.locator('[data-testid="event-list"]');
    await expect(eventListPanel).toContainText('10분 전 알림 테스트');
    await expect(eventListPanel).toContainText('알림: 10분 전');

    // 3. 시간을 1초 진행해서 알림 check (interval이 1000ms이므로)
    await page.clock.runFor(1100);

    // Alert 아이콘 나타나는지 확인
    await expect(
      page.getByTestId('event-list').locator('[data-testid="NotificationsIcon"]')
    ).toBeVisible();
  });
});
