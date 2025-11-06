import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

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

test.describe('기본 일정 관리 워크플로우', () => {
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

  test('일정 조회 기능', async() => {
    const eventListPanel = page.locator('[data-testid="event-list"]');
    
    await expect(eventListPanel).toContainText('팀 회의');
    await expect(eventListPanel).toContainText('반복일정');
    await expect(eventListPanel).toContainText('알림 테스트');
  });

  test('일정 추가 기능', async () => {
    // 일정 추가
    await page.getByRole('textbox', { name: '제목' }).fill('새로운 회의');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-29');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '설명' }).fill('새로운 회의 설명');
    await page.getByRole('textbox', { name: '위치' }).fill('회의실 B');

    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // 추가 확인
    const eventListPanel = page.locator('[data-testid="event-list"]');
    await expect(eventListPanel).toContainText('새로운 회의');
    await expect(eventListPanel).toContainText('2025-11-29');
    await expect(eventListPanel).toContainText('09:00');
    await expect(eventListPanel).toContainText('10:00');
    await expect(eventListPanel).toContainText('새로운 회의 설명');
    await expect(eventListPanel).toContainText('회의실 B');
  });

  test('일정 수정 기능', async () => {
    // 수정 아이콘 클릭
    await page.getByRole('button', { name: 'Edit event' }).first().click();
    await page.waitForTimeout(1000);

    // 내용 수정
    await page.getByRole('textbox', { name: '제목' }).fill('팀');
    await page.getByRole('textbox', { name: '설명' }).fill('주간 팀');

    const submitButton = page.locator('button[data-testid="event-submit-button"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    const eventListPanel = page.locator('[data-testid="event-list"]');
    // 수정 확인
    await expect(eventListPanel).toContainText('팀');
    await expect(eventListPanel).toContainText('주간 팀');
  });

  test('일정 삭제 기능', async () => {
    await page.getByRole('button', { name: 'Delete event' }).nth(0).click();

    const eventListPanel = page.locator('[data-testid="event-list"]');
    await expect(eventListPanel).not.toContainText('팀 회의');
    await expect(eventListPanel).not.toContainText('2025-11-21');
    await expect(eventListPanel).not.toContainText('주간 팀 미팅');
  });
});
