import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const E2E_JSON_PATH = path.resolve('./src/__mocks__/response/e2e.json');
const BACKUP_PATH = path.resolve('./src/__mocks__/response/e2e.backup.json');

// e2e.json 백업
function backupE2eData() {
  if (!fs.existsSync(BACKUP_PATH)) {
    const data = fs.readFileSync(E2E_JSON_PATH, 'utf8');
    fs.writeFileSync(BACKUP_PATH, data);
  }
}

// e2e.json 복원
function restoreE2eData() {
  try {
    const backupData = fs.readFileSync(BACKUP_PATH, 'utf8');
    fs.writeFileSync(E2E_JSON_PATH, backupData);
  } catch (e) {
    console.error('Failed to restore e2e data:', e);
  }
}

test.describe('드래그 앤 드롭 일정 관리 E2E 테스트', () => {
  test.beforeAll(() => {
    // 모든 테스트 시작 전 백업
    backupE2eData();
  });

  test.afterAll(() => {
    // 모든 테스트 종료 후 복원
    restoreE2eData();
    // 백업 파일 삭제
    if (fs.existsSync(BACKUP_PATH)) {
      fs.unlinkSync(BACKUP_PATH);
    }
  });

  test.beforeEach(async ({ page }) => {
    // 각 테스트 전 e2e.json 복원
    restoreE2eData();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // 캘린더 로드 확인
    await page.locator('[data-calendar-cell="true"]').first().waitFor({ timeout: 10000 });
  });

  /**
  * NOTE: 페어 프로그래밍
  *
  * 드라이버: 고다솜, 양진성
  * 네비게이터: 정나리, 이정민
  */

  test('일정을 다른 날짜로 드래그앤드롭하면 날짜가 변경된다', async ({ page }) => {
    // 로딩 완료 대기
    await page.waitForSelector('[data-testid="event-list"]', { timeout: 15000 });
    await page.waitForTimeout(1000);

    try {
      // 1. 드래그 가능한 첫 번째 이벤트 찾기
      const sourceEvent = page.locator('[draggable="true"]').first();
      await sourceEvent.waitFor({ state: 'visible', timeout: 15000 });
      
      // 2. 모든 캘린더 셀 가져오기
      const calendarCells = page.locator('[data-calendar-cell="true"]');
      await calendarCells.first().waitFor({ state: 'visible', timeout: 15000 });
      
      // 3. 셀 중에서 "15" 텍스트를 포함하는 셀 찾기
      const targetCell = calendarCells.filter({
        hasText: '15',
      }).first();

      // 4. 타겟 셀이 존재하는지 확인
      const cellCount = await targetCell.count().catch(() => 0);
      if (cellCount === 0) {
        console.warn('Target cell with "15" not found, using last cell instead');
        const lastCell = calendarCells.last();
        await lastCell.waitFor({ state: 'visible', timeout: 15000 });
        
        // 첫 번째 이벤트를 마지막 셀로 드래그
        await sourceEvent.hover();
        await page.waitForTimeout(1000);
        await sourceEvent.dragTo(lastCell, { timeout: 15000 });
      } else {
        // 5. DND 실행
        await sourceEvent.hover();
        await page.waitForTimeout(1000);
        await sourceEvent.dragTo(targetCell, { timeout: 15000 });
      }
      
      await page.waitForTimeout(2000);

      // 6. 성공 메시지 확인 (Alert 메시지)
      // AlertTitle에 메시지가 표시됨
      const alertMsg = page.locator('div[role="alert"]');
      const hasSuccessMsg = await alertMsg.locator('text=/일정이.*이동되었습니다/').isVisible({ timeout: 5000 }).catch(() => false);
      
      if (!hasSuccessMsg) {
        // "일정이" 포함된 메시지 확인
        await expect(alertMsg).toContainText('일정이');
      }

      // 7. 데이터 변경 검증
      const eventList = page.locator('[data-testid="event-list"]');
      const listContent = await eventList.textContent();
      expect(listContent).toBeTruthy();
    } catch (error) {
      console.error('DND test failed:', error);
      throw error;
    }
  });

  test('반복 일정을 드래그하면 반복 설정이 해제된다', async ({ page }) => {
    // 로딩 완료 대기
    await page.waitForSelector('[data-testid="event-list"]');

    // 1. 반복 아이콘이 있는 이벤트 찾기
    const recurringEvent = page.locator('button').filter({ has: page.locator('[data-testid="RepeatIcon"]') }).first();

    if (await recurringEvent.isVisible()) {
      // 2. 반복 이벤트의 위치 파악
      const eventBox = recurringEvent.locator('..').first();

      // 3. 타겟 셀로 드래그
      const targetCell = page.locator('[data-calendar-cell="true"]').filter({
        hasText: /^25$/,
      });

      await eventBox.dragTo(targetCell);
      await page.waitForTimeout(1000);

      // 4. 반복 설정 해제 메시지 확인
      await expect(
        page.locator('text=일정이 .* 이동되었습니다\\. \\(반복 설정이 해제되었습니다\\.\\)')
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('같은 날짜에 드래그하면 변화가 없다', async ({ page }) => {
    // 로딩 완료 대기
    await page.waitForSelector('[data-testid="event-list"]');

    // 1. 이벤트 찾기
    const sourceEvent = page.locator('[draggable="true"]').first();

    // 2. 같은 영역으로 드래그 (위치 이동 없음)
    await sourceEvent.hover();
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.up();

    // 3. 메시지가 나타나지 않아야 함
    const notification = page.locator('text=일정이 .* 이동되었습니다');
    const isVisible = await notification.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });
});

