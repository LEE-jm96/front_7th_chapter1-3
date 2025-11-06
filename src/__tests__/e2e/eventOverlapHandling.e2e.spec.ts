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

test.describe('일정 겹침 처리 워크플로우', () => {
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

  test('겹치는 일정 추가 및 다이얼로그 호출 -> 계속 진행', async () => {
    // 겹치는 일정 추가
    await page.getByRole('textbox', { name: '제목' }).fill('겹치는 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-21');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');

    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // 계속 진행 클릭
    await page.getByRole('button', { name: '계속 진행' }).click();

    const eventListPanel = page.locator('[data-testid="event-list"]');
    await expect(eventListPanel).toContainText('겹치는 일정');
  });

  test('겹치는 일정 추가 및 다이얼로그 호출 -> 취소', async () => {
    // 겹치는 일정 추가
    await page.getByRole('textbox', { name: '제목' }).fill('겹치는 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-21');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');

    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // 취소 클릭
    await page.getByRole('button', { name: '취소' }).click();

    const eventListPanel = page.locator('[data-testid="event-list"]');
    await expect(eventListPanel).not.toContainText('겹치는 일정');
  });
});
