#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "Testing Social Media Backend API"
echo "------------------------------"

# Test User endpoints
echo -e "\nTesting User endpoints:"
curl -X POST -H "Content-Type: application/json" -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}' "$BASE_URL/users/"

# Test Post endpoints
echo -e "\nTesting Post endpoints:"
curl -X POST -H "Content-Type: application/json" -d '{
    "content": "This is a test post with #hashtag",
    "authorId": 1,
    "hashtags": ["hashtag", "test"]
}' "$BASE_URL/posts/"

# Test Like endpoints
echo -e "\nTesting Like endpoints:"
curl -X POST -H "Content-Type: application/json" -d '{
    "userId": 1,
    "postId": 1
}' "$BASE_URL/likes/"

# Test Follow endpoints
echo -e "\nTesting Follow endpoints:"
curl -X POST -H "Content-Type: application/json" -d '{
    "followerId": 1,
    "followingId": 2
}' "$BASE_URL/follows/"

# Test Hashtag endpoints
echo -e "\nTesting Hashtag endpoints:"
curl -X GET "$BASE_URL/hashtags/trending"

echo -e "\nTesting complete!"