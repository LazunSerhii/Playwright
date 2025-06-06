import { test } from './fixtures'; 
import { expect } from '@playwright/test';

test.describe('Garage Page Tests', () => {
  test('User should see the garage page with cars', async ({ userGaragePage }) => {
   

    
    const title = await userGaragePage.getTitle();
    await expect(title).toHaveText('Garage');

   
    const addCarButton = userGaragePage.addCarButton;
    await expect(addCarButton).toBeVisible();
  });
});
