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

test.describe('검색 및 필터링 워크플로우', () => {
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

  test('검색한 결과가 올바르게 필터링 되어야 한다.', async () => {
    await page.getByRole('textbox', { name: '일정 검색' }).click();
    await page.getByRole('textbox', { name: '일정 검색' }).fill('알림 테스트');

    const eventListPanel = page.locator('[data-testid="event-list"]');
    
    // 검색 결과 올바르게 필터링됐는지 확인
    await expect(eventListPanel).toContainText('알림 테스트');
    await expect(eventListPanel).not.toContainText('반복 일정');
  });

  test('검색 결과가 없을 때 전체 이벤트가 표시되어야 한다.', async () => {
    await page.getByRole('textbox', { name: '일정 검색' }).click();
    await page.getByRole('textbox', { name: '일정 검색' }).fill('');

    const eventListPanel = page.locator('[data-testid="event-list"]');
    
    // 전체 일정 표시
    await expect(eventListPanel).toContainText('팀 회의');
    await expect(eventListPanel).toContainText('반복일정');
    await expect(eventListPanel).toContainText('알림 테스트');
  });
});
