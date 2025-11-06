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

test.describe('반복 일정 관리 워크플로우', () => {
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

  test('반복 일정 추가', async () => {
    // 일정 추가
    await page.getByRole('textbox', { name: '제목' }).fill('새로운 반복일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-29');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '설명' }).fill('주간회의');
    await page.getByRole('textbox', { name: '위치' }).fill('회의실 B');
    await page.getByRole('checkbox', { name: '반복 일정' }).check();
    await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-11-30');
    await page.getByText('매일').click();
    await page.getByRole('option', { name: 'daily-option' }).click();

    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // 생성 확인
    const eventListPanel = page.locator('[data-testid="event-list"]');
    await expect(eventListPanel).toContainText('새로운 반복일정');

    // 반복 일정 개수 확인 (2일 동안 매일 = 2개)
    const createCount = await eventListPanel.locator('text=새로운 반복일정').count();
    expect(createCount).toBe(2);
  });

  test('반복 일정 수정 기능 - 해당 일정만 수정', async () => {
    await page.getByRole('button', { name: 'Edit event' }).nth(1).click();
    await page.getByRole('button', { name: '예' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('반복일정 단건 수정');

    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    const eventListPanel = page.locator('[data-testid="event-list"]');
    await expect(eventListPanel).toContainText('반복일정 단건 수정');
  });

  test('반복 일정 수정 기능 - 모든 반복 일정 수정', async () => {
    await page.getByRole('button', { name: 'Edit event' }).nth(1).click();
    await page.getByRole('button', { name: '아니오' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('반복일정 전체 수정');

    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    const eventListPanel = page.locator('[data-testid="event-list"]');

    // 모든 반복 일정 수정 확인 (4개 모두 수정됨)
    const updateCount = await eventListPanel.locator('text=반복일정 전체 수정').count();
    expect(updateCount).toBe(4);
  });

  test('반복 일정 삭제 기능 - 해당 일정만 삭제', async () => {
    await page.getByRole('button', { name: 'Delete event' }).nth(4).click();
    await page.getByRole('button', { name: '예' }).click();
    await page.waitForTimeout(1000);

    const eventListPanel = page.locator('[data-testid="event-list"]');
    await expect(eventListPanel).toContainText('반복일정');

    // 반복 일정 4개에서 단건 삭제 -> 총 3개
    const createCount = await eventListPanel.locator('text=반복일정').count();
    expect(createCount).toBe(3);
  });

  test('반복 일정 삭제 기능 - 모든 반복 일정 삭제', async () => {
    await page.getByRole('button', { name: 'Delete event' }).nth(4).click();
    await page.getByRole('button', { name: '아니오' }).click();
    await page.waitForTimeout(1000);

    const eventListPanel = page.locator('[data-testid="event-list"]');

    // 반복 일정 4개에서 전체 삭제 -> 총 0개
    const createCount = await eventListPanel.locator('text=반복일정').count();
    expect(createCount).toBe(0);
  });
});
