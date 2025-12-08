import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Todo App Frontend
 * Minimum 5 tests required for G, 10+ for VG
 */

const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:8080'; // Adjust based on your server

test.describe('Todo App E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto(FRONTEND_URL);
  });

  test('Test 1: Page loads correctly with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Todo App/);
    await expect(page.locator('h1')).toContainText('Todo App');
  });

  test('Test 2: Form is visible and has required fields', async ({ page }) => {
    await expect(page.locator('#task-form')).toBeVisible();
    await expect(page.locator('#title')).toBeVisible();
    await expect(page.locator('#status')).toBeVisible();
    await expect(page.locator('#priority')).toBeVisible();
  });

  test('Test 3: Can create a new task', async ({ page }) => {
    // Fill in the form
    await page.fill('#title', 'E2E Test Task');
    await page.fill('#description', 'This is a test task created by Playwright');
    await page.selectOption('#status', 'pågående');
    await page.selectOption('#priority', 'hög');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success message with longer timeout
    await expect(page.locator('#success-message')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#success-message')).toContainText('Uppgift skapad');
    
    // Wait a bit for task list to update
    await page.waitForTimeout(2000);
    
    // Verify task appears in list by checking page content
    const pageContent = await page.content();
    expect(pageContent).toContain('E2E Test Task');
  });

  test('Test 4: Shows error when submitting empty title', async ({ page }) => {
    // Try to submit with empty title
    await page.click('button[type="submit"]');
    
    // HTML5 validation should prevent submission
    const titleInput = page.locator('#title');
    const validationMessage = await titleInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('Test 5: Can edit an existing task', async ({ page }) => {
    // Wait for tasks to load with longer timeout
    await page.waitForSelector('.task-card', { timeout: 10000 });
    
    // Click edit on first task
    await page.click('.btn-edit');
    
    // Verify form is populated
    await expect(page.locator('#form-title')).toContainText('Redigera uppgift');
    const titleValue = await page.inputValue('#title');
    expect(titleValue).toBeTruthy();
    
    // Update the title
    await page.fill('#title', 'Updated Task Title');
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('#success-message')).toContainText('uppdaterad', { timeout: 10000 });
  });

  test('Test 6: Can delete a task with confirmation', async ({ page }) => {
    // Wait for tasks to load with longer timeout
    await page.waitForSelector('.task-card', { timeout: 10000 });
    
    // Count initial tasks
    const initialCount = await page.locator('.task-card').count();
    
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete on first task
    await page.click('.btn-delete');
    
    // Wait for success message
    await expect(page.locator('#success-message')).toBeVisible({ timeout: 10000 });
    
    // Wait a bit for list to update
    await page.waitForTimeout(1000);
    
    // Verify task count decreased or list is empty
    const newCount = await page.locator('.task-card').count();
    expect(newCount).toBeLessThanOrEqual(initialCount);
  });

  test('Test 7: Tasks display correct status badges', async ({ page }) => {
    await page.waitForSelector('.task-card', { timeout: 10000 });
    
    // Check that badges exist
    const statusBadge = page.locator('.badge-status').first();
    await expect(statusBadge).toBeVisible();
    
    const priorityBadge = page.locator('.badge-priority').first();
    await expect(priorityBadge).toBeVisible();
  });

  test('Test 8: Cancel button resets form when editing', async ({ page }) => {
    await page.waitForSelector('.task-card', { timeout: 10000 });
    
    // Click edit
    await page.click('.btn-edit');
    await expect(page.locator('#cancel-btn')).toBeVisible();
    
    // Click cancel
    await page.click('#cancel-btn');
    
    // Verify form is reset
    await expect(page.locator('#form-title')).toContainText('Skapa ny uppgift');
    await expect(page.locator('#cancel-btn')).toBeHidden();
    const titleValue = await page.inputValue('#title');
    expect(titleValue).toBe('');
  });

  test('Test 9: Error message is displayed for API failures', async ({ page }) => {
    // Intercept API call and return error
    await page.route('**/api/tasks', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    // Try to load tasks
    await page.reload();
    
    // Should show error
    await expect(page.locator('#error-message')).toBeVisible();
  });

  test('Test 10: Tasks list shows empty state when no tasks', async ({ page }) => {
    // Intercept API to return empty array
    await page.route('**/api/tasks', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.reload();
    
    // Should show empty state message
    await expect(page.locator('.tasks-list')).toContainText('Inga uppgifter');
  });

  test('Test 11: Form validates required fields', async ({ page }) => {
    const titleInput = page.locator('#title');
    
    // Check that title is required
    const isRequired = await titleInput.getAttribute('required');
    expect(isRequired).not.toBeNull();
  });

});
