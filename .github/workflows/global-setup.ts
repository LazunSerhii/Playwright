import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage'; 
import { USER_EMAIL, USER_PASSWORD } from './test-data/credentials'; 

async function globalSetup(config: FullConfig)
{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(USER_EMAIL, USER_PASSWORD);

 
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;
