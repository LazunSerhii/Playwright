import { test, expect } from '@playwright/test';

class RegistrationPage {
  constructor(private readonly page) {}

  async navigate() {
    await this.page.goto('https://qauto.forstudy.space/');
    await this.page.getByRole('button', { name: 'Sign In' }).click();
    await this.page.getByRole('button', { name: 'Registration' }).click();
  }

  async fillName(name: string) {
    await this.page.getByLabel('Name').fill(name);
  }

  async fillLastName(lastName: string) {
    await this.page.getByLabel('Last Name').fill(lastName);
  }

  async fillEmail(email: string) {
    await this.page.getByLabel('Email').fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByLabel('Password', { exact: true }).fill(password);
  }

  async fillReEnterPassword(password: string) {
    await this.page.getByLabel('Re-enter password').fill(password);
  }

  async clickRegister() {
    await this.page.getByRole('button', { name: 'Register' }).click();
  }

  async getSuccessMessage() {
    return this.page.getByText('Registration completed successfully');
  }

  async getNameError() {
    return this.page.getByText('Name is required');
  }

  async getEmailError() {
    return this.page.getByText('Email is incorrect');
  }

  async getPasswordError() {
    return this.page.getByText(/Password has to be from 8 to 15 characters/);
  }

  async getPasswordMismatchError() {
    return this.page.getByText('Passwords do not match');
  }

  async isRegisterButtonDisabled() {
    return this.page.getByRole('button', { name: 'Register' }).isDisabled();
  }
}

function generateEmail() {
  const randomString = Math.random().toString(36).substring(2, 8);
  return `aqa-${randomString}@test.com`;
}

test.describe('User Registration Tests', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();
  });

  test('Successful registration with valid data', async ({ page }) => {
    const email = generateEmail();

    await registrationPage.fillName('ValidName');
    await registrationPage.fillLastName('ValidLastName');
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword('ValidPass1');
    await registrationPage.fillReEnterPassword('ValidPass1');
    await registrationPage.clickRegister();
    
    await expect(await registrationPage.getSuccessMessage()).toBeVisible();
  });

  test('Empty name field validation', async ({ page }) => {
    await registrationPage.fillName('');
    await registrationPage.fillLastName(''); 
    
    await expect(await registrationPage.getNameError()).toBeVisible();
    await expect(await registrationPage.isRegisterButtonDisabled()).toBeTruthy();
  });

  test('Invalid email format validation', async ({ page }) => {
    await registrationPage.fillEmail('invalid-email');
    await registrationPage.fillName('Test');
    
    await expect(await registrationPage.getEmailError()).toBeVisible();
  });

  test('Password complexity validation', async ({ page }) => {
    await registrationPage.fillPassword('simple');
    await registrationPage.fillName('Test');
    
    await expect(await registrationPage.getPasswordError()).toBeVisible();
  });

  test('Password mismatch validation', async ({ page }) => {
    await registrationPage.fillPassword('ValidPass1');
    await registrationPage.fillReEnterPassword('Different1');
    
    await expect(await registrationPage.getPasswordMismatchError()).toBeVisible();
  });
});
