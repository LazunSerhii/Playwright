import { test, expect } from '@playwright/test';


function generateEmail() {
  const randomString = Math.random().toString(36).substring(2, 8);
  return `aqa-${randomString}@test.com`;
}

test.describe('User Registration Tests', () => {
  test.beforeEach(async ({ page }) => {
    
    await page.goto('https://qauto.forstudy.space/');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('button', { name: 'Registration' }).click();
  });

  
  test('Successful registration with valid data', async ({ page }) => {
    const email = generateEmail();

    await page.getByLabel('Name').fill('ValidName');
    await page.getByLabel('Last Name').fill('ValidLastName');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill('ValidPass1');
    await page.getByLabel('Re-enter password').fill('ValidPass1');
    
    await page.getByRole('button', { name: 'Register' }).click();
    
    
    await expect(page.getByText('Registration completed successfully')).toBeVisible();
  });


  test('Empty name field validation', async ({ page }) => {
    await page.getByLabel('Name').fill('');
    await page.getByLabel('Last Name').click(); 
    
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
  });

  test('Invalid email format validation', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Name').click(); 
    
    await expect(page.getByText('Email is incorrect')).toBeVisible();
  });

  test('Password complexity validation', async ({ page }) => {
    await page.getByLabel('Password', { exact: true }).fill('simple');
    await page.getByLabel('Name').click();
    
    await expect(page.getByText(/Password has to be from 8 to 15 characters/)).toBeVisible();
  });

  test('Password mismatch validation', async ({ page }) => {
    await page.getByLabel('Password', { exact: true }).fill('ValidPass1');
    await page.getByLabel('Re-enter password').fill('Different1');
    
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });
});
