import { defineConfig } from '@playwright/test';

export default defineConfig({
  
  projects: [
    {
      name: 'chromium-setup',
      testMatch: /global\.setup\.ts/, 
    },
    {
      name: 'chromium',
      use: {
       
        storageState: 'storageState.json',
      },
      dependencies: ['chromium-setup'], 
    },
  ],

});
