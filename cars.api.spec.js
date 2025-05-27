const { test, expect } = require('@playwright/test');
const USER_EMAIL = process.env.QAUTO_EMAIL || "Lazunsm@gmail.com";
const USER_PASSWORD = process.env.QAUTO_PASSWORD || "Test123";

let apiRequestContext;

test.beforeAll(async ({ playwright }) => {
      const preliminaryContext = await playwright.request.newContext();
       const loginResponse = await preliminaryContext.post('https://qauto.forstudy.space/api/auth/signin', {
    data: {
      email: USER_EMAIL,
      password: USER_PASSWORD,
      remember: false, // або true, якщо потрібно
    },
  });
  expect(loginResponse.ok(), `Login failed with status ${loginResponse.status()}`).toBeTruthy();
  const loginJson = await loginResponse.json();
  expect(loginJson.status).toBe("ok");
 const storageState = await preliminaryContext.storageState();
  await preliminaryContext.dispose();
  apiRequestContext = await playwright.request.newContext({
    baseURL: 'https://qauto.forstudy.space',
    storageState: storageState, 
    extraHTTPHeaders: {
      'Content-Type': 'application/json', 
    },
  });
});

test.afterAll(async () => {
  if (apiRequestContext) {
    await apiRequestContext.dispose();
  }
});
test.describe('Create Car API Tests (Cookie Auth)', () => {
  test('Positive: should create a car with valid data', async () => {
    const carData = {
      carBrandId: 1,   
      carModelId: 1,  
      mileage: 10000,
    };

    const response = await apiRequestContext.post('/api/cars', {
      data: carData,
    });

    expect(response.ok(), `Response status was ${response.status()}`).toBeTruthy();
    const responseJson = await response.json();

    expect(responseJson.status).toBe('ok');
    expect(responseJson.data).toBeDefined();
    expect(responseJson.data.carBrandId).toBe(carData.carBrandId);
    expect(responseJson.data.carModelId).toBe(carData.carModelId);
    expect(responseJson.data.initialMileage).toBe(carData.mileage);
    expect(responseJson.data.id).toBeDefined();
  });

  test('Negative: should not create a car with missing mileage', async () => {
    const carData = {
      carBrandId: 2,
      carModelId: 3,
      // mileage відсутній
    };

    const response = await apiRequestContext.post('/api/cars', {
      data: carData,
    });

    expect(response.status()).toBe(400);
    const responseJson = await response.json();
    expect(responseJson.status).toBe('error');
    expect(responseJson.message.toLowerCase()).toContain('invalid mileage');
  });

  test('Negative: should not create a car with invalid mileage type', async () => {
    const carData = {
      carBrandId: 1,
      carModelId: 1,
      mileage: 'not_a_number',
    };

    const response = await apiRequestContext.post('/api/cars', {
      data: carData,
    });

    expect(response.status()).toBe(400);
    const responseJson = await response.json();
    expect(responseJson.status).toBe('error');
    expect(responseJson.message.toLowerCase()).toContain('invalid mileage');
  });

  test('Negative: should not create a car if not authenticated (e.g., simulated expired cookie)', async ({ playwright }) => {
    // Для цього тесту ми створимо новий контекст БЕЗ стану сховища (cookie)
    const unauthenticatedContext = await playwright.request.newContext({
        baseURL: 'https://qauto.forstudy.space',
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
    });

    const carData = {
      carBrandId: 1,
      carModelId: 1,
      mileage: 5000,
    };

    const response = await unauthenticatedContext.post('/api/cars', {
      data: carData,
    });

    expect(response.status()).toBe(401);
    const responseJson = await response.json();
    expect(responseJson.status).toBe('error');
    expect(responseJson.message.toLowerCase()).toContain("not authenticated");

    await unauthenticatedContext.dispose();
  });
});
