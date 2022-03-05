Error handling in HTTP calls
============================

**SimpleSplit** uses the following flow for error handling:
- **Interceptor**
  - extracts message from error object, message to be displayed (log error as well)
- **Store service**
  - BehaviourSubject for data, empty or with data received
  - BehaviourSubject with error message
- **Component**
  - Wrap data observable from store service to provide loading indicator (pipe, finalize)
  - Subscribe to error observable to have access to HTTP errors (optional)

---
TODO: the following could help and we should try to depict it for Store services

Loading state:
- waiting for data
- no data found - loaded data
- finished with errors
