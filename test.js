const axios = require('axios');
const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('Testing Social Media Backend API');
  console.log('------------------------------');

  try {
    // Test User endpoints
    console.log('\nTesting User endpoints:');
    const userRes = await axios.post(`${BASE_URL}/users/`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log(userRes.data);

    // Test Post endpoints
    console.log('\nTesting Post endpoints:');
    const postRes = await axios.post(`${BASE_URL}/posts/`, {
      content: 'This is a test post with #hashtag',
      authorId: 1,
      hashtags: ['hashtag', 'test']
    });
    console.log(postRes.data);

    // Test Like endpoints
    console.log('\nTesting Like endpoints:');
    const likeRes = await axios.post(`${BASE_URL}/likes/`, {
      userId: 1,
      postId: 1
    });
    console.log(likeRes.data);

    // Test Follow endpoints
    console.log('\nTesting Follow endpoints:');
    const followRes = await axios.post(`${BASE_URL}/follows/`, {
      followerId: 1,
      followingId: 2
    });
    console.log(followRes.data);

    // Test Hashtag endpoints
    console.log('\nTesting Hashtag endpoints:');
    const hashtagRes = await axios.get(`${BASE_URL}/hashtags/trending`);
    console.log(hashtagRes.data);

    console.log('\nTesting complete!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTests();