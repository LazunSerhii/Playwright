
const axios = require('axios');

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

const logTestResult = (testName, success, details = '') => {
  console.log(`[${success ? 'PASS' : 'FAIL'}] ${testName}${details ? ` - ${details}` : ''}`);
  if (!success) console.error(`    Details: ${details}`);
};
async function testGetAllPosts() {
  const testName = 'GET /posts - Отримати всі пости';
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);

   
    if (response.status !== 200) {
      logTestResult(testName, false, `Неправильний статус відповіді: ${response.status}, очікувався 200`);
      return;
    }

    
    const data = response.data;
    if (!Array.isArray(data)) {
      logTestResult(testName, false, 'Дані відповіді не є масивом');
      return;
    }
    if (data.length === 0) {
      logTestResult(testName, false, 'Масив постів порожній');
      return;
    }
   
    const firstPost = data[0];
    if (!(firstPost && typeof firstPost.userId === 'number' && typeof firstPost.id === 'number' && typeof firstPost.title === 'string' && typeof firstPost.body === 'string')) {
      logTestResult(testName, false, 'Неправильна структура об\'єкта поста');
      return;
    }

    logTestResult(testName, true, `Отримано ${data.length} постів. Статус: ${response.status}`);
  } catch (error) {
    logTestResult(testName, false, `Помилка запиту: ${error.message}`);
  }
}

async function testGetSinglePost() {
  const postId = 1;
  const testName = `GET /posts/${postId} - Отримати пост з ID ${postId}`;
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);

 
    if (response.status !== 200) {
      logTestResult(testName, false, `Неправильний статус відповіді: ${response.status}, очікувався 200`);
      return;
    }

    const post = response.data;
    if (!(post && typeof post.userId === 'number' && post.id === postId && typeof post.title === 'string' && typeof post.body === 'string')) {
      logTestResult(testName, false, `Неправильна структура або ID (${post.id}) поста. Очікувався ID ${postId}.`);
      return;
    }

    logTestResult(testName, true, `Пост "${post.title}" отримано. Статус: ${response.status}`);
  } catch (error) {
    logTestResult(testName, false, `Помилка запиту: ${error.message}`);
  }
}

async function testGetCommentsForPost() {
  const postId = 1;
  const testName = `GET /posts/${postId}/comments - Отримати коментарі для поста з ID ${postId}`;
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}/comments`);
    

    if (response.status !== 200) {
      logTestResult(testName, false, `Неправильний статус відповіді: ${response.status}, очікувався 200`);
      return;
    }


    const comments = response.data;
    if (!Array.isArray(comments)) {
      logTestResult(testName, false, 'Дані відповіді не є масивом');
      return;
    }
    if (comments.length === 0) {
      logTestResult(testName, false, 'Масив коментарів порожній (що може бути несподівано для тестового поста 1)');
     
      return;
    }
    const firstComment = comments[0];
    if (!(firstComment && firstComment.postId === postId && typeof firstComment.id === 'number' && typeof firstComment.name === 'string' && typeof firstComment.email === 'string' && typeof firstComment.body === 'string')) {
      logTestResult(testName, false, `Неправильна структура коментаря або postId (${firstComment.postId}) не відповідає очікуваному (${postId})`);
      return;
    }

    logTestResult(testName, true, `Отримано ${comments.length} коментарів. Статус: ${response.status}`);
  } catch (error) {
    logTestResult(testName, false, `Помилка запиту: ${error.message}`);
  }
}


async function testCreatePost() {
  const testName = 'POST /posts - Створити новий пост';
  const newPostData = {
    title: 'Тестовий заголовок',
    body: 'Це тіло тестового поста, створеного за допомогою axios.',
    userId: 1,
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/posts`, newPostData);

    
    if (response.status !== 201) {
      logTestResult(testName, false, `Неправильний статус відповіді: ${response.status}, очікувався 201`);
      return;
    }

    
    const createdPost = response.data;
    if (!(createdPost && typeof createdPost.id === 'number' && 
          createdPost.title === newPostData.title &&
          createdPost.body === newPostData.body &&
          createdPost.userId === newPostData.userId)) {
      logTestResult(testName, false, 'Дані створеного поста не відповідають відправленим або відсутній ID');
      console.log('    Отримано:', createdPost);
      console.log('    Очікувалось (частково):', newPostData);
      return;
    }

    logTestResult(testName, true, `Пост створено з ID ${createdPost.id}. Статус: ${response.status}`);
  } catch (error) {
    logTestResult(testName, false, `Помилка запиту: ${error.message}`);
  }
}


async function testCreateComment() {
  const testName = 'POST /comments - Створити новий коментар';
  const newCommentData = {
    postId: 1,
    name: 'Тестовий коментатор',
    email: 'test@example.com',
    body: 'Це тестовий коментар.',
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/comments`, newCommentData);

    
    if (response.status !== 201) {
      logTestResult(testName, false, `Неправильний статус відповіді: ${response.status}, очікувався 201`);
      return;
    }

    
    const createdComment = response.data;
    if (!(createdComment && typeof createdComment.id === 'number' && 
          createdComment.postId === newCommentData.postId &&
          createdComment.name === newCommentData.name &&
          createdComment.email === newCommentData.email &&
          createdComment.body === newCommentData.body)) {
      logTestResult(testName, false, 'Дані створеного коментаря не відповідають відправленим або відсутній ID');
      console.log('    Отримано:', createdComment);
      console.log('    Очікувалось (частково):', newCommentData);
      return;
    }

    logTestResult(testName, true, `Коментар створено з ID ${createdComment.id} для поста ${createdComment.postId}. Статус: ${response.status}`);
  } catch (error) {
    logTestResult(testName, false, `Помилка запиту: ${error.message}`);
  }
}


// Запуск всіх тестів
async function runAllTests() {
  console.log('--- Запуск API тестів для JSONPlaceholder ---');
  await testGetAllPosts();
  console.log('---------------------------------------------');
  await testGetSinglePost();
  console.log('---------------------------------------------');
  await testGetCommentsForPost();
  console.log('---------------------------------------------');
  await testCreatePost();
  console.log('---------------------------------------------');
  await testCreateComment();
  console.log('--- Всі тести завершено ---');
}

runAllTests();
