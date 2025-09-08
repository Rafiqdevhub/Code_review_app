# Rate Limiting Implementation

## Understanding Your Backend Rate Limits

### Rate Limit Structure:

- **General Requests**: 20 per day per IP (code analysis, file uploads, etc.)
- **AI Requests**: 5 per day per IP (chat/AI assistant interactions)
- **IP-based Tracking**: Each IP address gets separate counters
- **Daily Reset**: Limits reset at midnight UTC
- **Independent Tracking**: IP 1.1.1.1 and IP 2.2.2.2 have completely separate limits

## Frontend Implementation

### 1. Error Detection

The frontend now detects HTTP 429 (Too Many Requests) responses from your backend and automatically shows user-friendly messages.

### 2. User Messages

When rate limits are exceeded, users see:

**Toast Notification:**

- Title: "Daily Limit Reached"
- Message: "You have reached the daily limit. If you want more requests, contact us at: rafkhan9323@gmail.com"
- Duration: 8 seconds (longer than normal errors)

**Chat Assistant Response:**

- Shows a helpful message in the chat explaining the limit and providing contact information

### 3. Error Handling Locations

**AI Chat (`/chat` page):**

- Detects when AI request limit (5/day) is reached
- Shows rate limit message in both toast and chat

**Code Review (`/review` page):**

- Detects when general request limit (20/day) is reached
- Shows rate limit message for code analysis attempts

### 4. Technical Implementation

```typescript
// New error type for rate limits
export function isRateLimitError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.code === "RATE_LIMIT_EXCEEDED";
}

// Rate limit detection in API client
if (response.status === 429) {
  throw new ApiError({
    message:
      "You have reached the daily limit. If you want more requests, contact us at: rafkhan9323@gmail.com",
    status: response.status,
    code: "RATE_LIMIT_EXCEEDED",
  });
}
```

## Backend Requirements

For this to work properly, your backend should:

1. **Return HTTP 429** when rate limits are exceeded
2. **Include appropriate headers** (optional but recommended):
   ```
   X-RateLimit-Limit: 20
   X-RateLimit-Remaining: 0
   X-RateLimit-Reset: 1625097600
   ```

## User Experience

### Smooth Degradation:

- Users get clear explanation of why their request failed
- Contact information provided for users who need more requests
- No confusing technical error messages
- Longer toast duration ensures users see the message

### Professional Communication:

- Explains the limitation clearly
- Provides a solution (contact email)
- Maintains professional tone throughout

This implementation ensures users understand the rate limiting system and know how to contact you for additional requests if needed.
