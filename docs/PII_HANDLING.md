# PII Handling and Data Security

## Overview

The Purchase Advisor feature is designed with privacy and security as core principles. This document outlines how Personally Identifiable Information (PII) is handled throughout the system.

## Data Flow

1. **Client Request**: User's financial data is sent to the server via secure HTTPS
2. **Server Processing**: Data is anonymized before being sent to OpenAI
3. **AI Processing**: Only anonymized data is sent to the OpenAI API
4. **Response Handling**: AI recommendations are cached and returned to the client

## Anonymization Strategy

### Merchant Names

Merchant names are anonymized using the following approach:

- **Known Merchants**: Mapped to generic categories
  - Example: "Amazon" → "online_retailer_1"
  - Example: "Whole Foods" → "grocery_store_1"
  - Example: "Starbucks" → "coffee_shop"

- **Unknown Merchants**: Generic anonymization
  - Example: "Joe's Pizza" → "merchant_J"
  - This preserves merchant category info while hiding specific names

### Data Included in AI Payload

**Included (safe to share):**
- Transaction amounts
- Category (groceries, dining, entertainment, etc.)
- Anonymized merchant names
- Transaction dates (day of month, not specific timestamp)
- Budget limits per category
- Goal titles and target amounts

**Excluded (not sent to AI):**
- User IDs
- User names
- Email addresses
- Phone numbers
- Full transaction descriptions
- Exact timestamps
- Location data
- Account credentials
- API keys or secrets

## Security Measures

### 1. Server-Side Processing

- All anonymization happens on the server before external API calls
- User ID is never exposed to external services
- Authentication is required via Bearer token

### 2. Caching

- Cached responses are stored in memory (per-session)
- Cache is cleared after 1 hour (configurable)
- Users can manually clear cache at any time
- In production: Use Redis with encryption

### 3. API Communication

- All communication uses HTTPS/TLS
- Environment variables store sensitive API keys
- Keys are never logged or exposed in responses

### 4. Error Handling

- Error messages don't leak sensitive data
- API errors are sanitized before returning to client
- Failed requests are logged securely server-side

## Compliance Considerations

### GDPR (General Data Protection Regulation)

- Users can request a deletion of cached data via the DELETE endpoint
- Data processing is transparent and documented
- No third-party sharing without consent (only OpenAI for AI processing)

### CCPA (California Consumer Privacy Act)

- Clear data handling practices documented here
- Users have control over cache refresh/clear
- No unnecessary data retention

### Data Retention

- Advisor responses cached for 1 hour maximum
- Cache cleared on user request
- No permanent storage of advisory responses
- Original financial data stays in Supabase

## Testing and Validation

### Unit Tests

- `__tests__/lib/advisor.test.ts` - Validates anonymization
- Ensure no PII leakage in payloads

### Integration Tests

- `__tests__/api/advisor.test.ts` - Validates API security
- Ensures authentication is enforced
- Verifies no sensitive data in responses

### Example Test Data

See `__mocks__/advisor-responses.ts` for mock responses that demonstrate:
- Proper anonymization
- Safe data structures
- Expected response format

## Recommendations for Production

1. **Use a Privacy-Compliant Cache**
   - Replace in-memory cache with Redis
   - Add encryption at rest
   - Implement automatic expiration policies

2. **Audit Logging**
   - Log all advisor requests (without PII)
   - Monitor for unusual access patterns
   - Retain logs for compliance

3. **Rate Limiting**
   - Implement per-user rate limits
   - Prevent abuse and data exfiltration
   - Cost control for OpenAI API

4. **Data Minimization**
   - Only collect necessary data
   - Periodically purge old financial data
   - Consider data anonymization in Supabase

5. **Third-Party Agreements**
   - Ensure OpenAI API terms permit financial data processing
   - Review data processing agreements
   - Verify GDPR/CCPA compliance

## Questions and Concerns

For questions about data handling, privacy, or security:
1. Review this documentation
2. Check the implementation in `lib/advisor.ts`
3. Examine the API route in `app/api/advisor/route.ts`
4. Review test files for validation approaches
