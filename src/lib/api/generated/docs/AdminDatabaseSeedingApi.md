# AdminDatabaseSeedingApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**seedDatabase**](#seeddatabase) | **POST** /api/admin/seed/all | Seed database with sample data|

# **seedDatabase**
> seedDatabase()

Run all database seeders to populate with sample data. Requires X-Admin-Key header.

### Example

```typescript
import {
    AdminDatabaseSeedingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDatabaseSeedingApi(configuration);

const { status, data } = await apiInstance.seedDatabase();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

