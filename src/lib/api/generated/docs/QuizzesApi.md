# QuizzesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1QuizzesBatchDelete**](#apiv1quizzesbatchdelete) | **DELETE** /api/v1/Quizzes/batch | |
|[**apiV1QuizzesBatchPost**](#apiv1quizzesbatchpost) | **POST** /api/v1/Quizzes/batch | |
|[**apiV1QuizzesCategoriesCountsGet**](#apiv1quizzescategoriescountsget) | **GET** /api/v1/Quizzes/categories/counts | |
|[**apiV1QuizzesCategoryCategoryGet**](#apiv1quizzescategorycategoryget) | **GET** /api/v1/Quizzes/category/{category} | |
|[**apiV1QuizzesGet**](#apiv1quizzesget) | **GET** /api/v1/Quizzes | |
|[**apiV1QuizzesIdDelete**](#apiv1quizzesiddelete) | **DELETE** /api/v1/Quizzes/{id} | |
|[**apiV1QuizzesIdGet**](#apiv1quizzesidget) | **GET** /api/v1/Quizzes/{id} | |
|[**apiV1QuizzesIdPut**](#apiv1quizzesidput) | **PUT** /api/v1/Quizzes/{id} | |
|[**apiV1QuizzesMyGet**](#apiv1quizzesmyget) | **GET** /api/v1/Quizzes/my | |
|[**apiV1QuizzesPost**](#apiv1quizzespost) | **POST** /api/v1/Quizzes | |
|[**apiV1QuizzesPublicGet**](#apiv1quizzespublicget) | **GET** /api/v1/Quizzes/public | |
|[**apiV1QuizzesSearchGet**](#apiv1quizzessearchget) | **GET** /api/v1/Quizzes/search | |

# **apiV1QuizzesBatchDelete**
> BooleanApiResponse apiV1QuizzesBatchDelete(requestBody)


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let requestBody: Array<string>; //

const { status, data } = await apiInstance.apiV1QuizzesBatchDelete(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<string>**|  | |


### Return type

**BooleanApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesBatchPost**
> QuizDtoIEnumerableApiResponse apiV1QuizzesBatchPost(requestBody)


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let requestBody: Array<string>; //

const { status, data } = await apiInstance.apiV1QuizzesBatchPost(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<string>**|  | |


### Return type

**QuizDtoIEnumerableApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesCategoriesCountsGet**
> StringInt32DictionaryApiResponse apiV1QuizzesCategoriesCountsGet()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

const { status, data } = await apiInstance.apiV1QuizzesCategoriesCountsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**StringInt32DictionaryApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesCategoryCategoryGet**
> QuizSummaryDtoIEnumerableApiResponse apiV1QuizzesCategoryCategoryGet()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let category: string; // (default to undefined)
let limit: number; // (optional) (default to 20)

const { status, data } = await apiInstance.apiV1QuizzesCategoryCategoryGet(
    category,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **category** | [**string**] |  | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 20|


### Return type

**QuizSummaryDtoIEnumerableApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesGet**
> QuizSummaryDtoPagedResponseApiResponse apiV1QuizzesGet()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let search: string; // (optional) (default to undefined)
let category: string; // (optional) (default to undefined)
let isPublic: boolean; // (optional) (default to undefined)
let creatorId: string; // (optional) (default to undefined)
let sortBy: string; // (optional) (default to undefined)
let isDescending: boolean; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)
let cursor: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1QuizzesGet(
    search,
    category,
    isPublic,
    creatorId,
    sortBy,
    isDescending,
    pageSize,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] |  | (optional) defaults to undefined|
| **category** | [**string**] |  | (optional) defaults to undefined|
| **isPublic** | [**boolean**] |  | (optional) defaults to undefined|
| **creatorId** | [**string**] |  | (optional) defaults to undefined|
| **sortBy** | [**string**] |  | (optional) defaults to undefined|
| **isDescending** | [**boolean**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|
| **cursor** | [**string**] |  | (optional) defaults to undefined|


### Return type

**QuizSummaryDtoPagedResponseApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesIdDelete**
> BooleanApiResponse apiV1QuizzesIdDelete()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1QuizzesIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**BooleanApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesIdGet**
> QuizDtoApiResponse apiV1QuizzesIdGet()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1QuizzesIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**QuizDtoApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesIdPut**
> QuizDtoApiResponse apiV1QuizzesIdPut()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let id: string; // (default to undefined)
let title: string; // (optional) (default to undefined)
let description: string; // (optional) (default to undefined)
let thumbnail: File; // (optional) (default to undefined)
let isPublic: boolean; // (optional) (default to undefined)
let category: string; // (optional) (default to undefined)
let tags: string; // (optional) (default to undefined)
let estimatedDurationMinutes: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1QuizzesIdPut(
    id,
    title,
    description,
    thumbnail,
    isPublic,
    category,
    tags,
    estimatedDurationMinutes
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **title** | [**string**] |  | (optional) defaults to undefined|
| **description** | [**string**] |  | (optional) defaults to undefined|
| **thumbnail** | [**File**] |  | (optional) defaults to undefined|
| **isPublic** | [**boolean**] |  | (optional) defaults to undefined|
| **category** | [**string**] |  | (optional) defaults to undefined|
| **tags** | [**string**] |  | (optional) defaults to undefined|
| **estimatedDurationMinutes** | [**number**] |  | (optional) defaults to undefined|


### Return type

**QuizDtoApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**409** | Conflict |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesMyGet**
> QuizSummaryDtoIEnumerableApiResponse apiV1QuizzesMyGet()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

const { status, data } = await apiInstance.apiV1QuizzesMyGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**QuizSummaryDtoIEnumerableApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesPost**
> QuizDtoApiResponse apiV1QuizzesPost()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let title: string; // (optional) (default to undefined)
let description: string; // (optional) (default to undefined)
let thumbnail: File; // (optional) (default to undefined)
let isPublic: boolean; // (optional) (default to undefined)
let category: string; // (optional) (default to undefined)
let tags: string; // (optional) (default to undefined)
let estimatedDurationMinutes: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1QuizzesPost(
    title,
    description,
    thumbnail,
    isPublic,
    category,
    tags,
    estimatedDurationMinutes
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **title** | [**string**] |  | (optional) defaults to undefined|
| **description** | [**string**] |  | (optional) defaults to undefined|
| **thumbnail** | [**File**] |  | (optional) defaults to undefined|
| **isPublic** | [**boolean**] |  | (optional) defaults to undefined|
| **category** | [**string**] |  | (optional) defaults to undefined|
| **tags** | [**string**] |  | (optional) defaults to undefined|
| **estimatedDurationMinutes** | [**number**] |  | (optional) defaults to undefined|


### Return type

**QuizDtoApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**409** | Conflict |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesPublicGet**
> QuizSummaryDtoIEnumerableApiResponse apiV1QuizzesPublicGet()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.apiV1QuizzesPublicGet(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**QuizSummaryDtoIEnumerableApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuizzesSearchGet**
> QuizSummaryDtoIEnumerableApiResponse apiV1QuizzesSearchGet()


### Example

```typescript
import {
    QuizzesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuizzesApi(configuration);

let q: string; // (default to undefined)
let limit: number; // (optional) (default to 20)

const { status, data } = await apiInstance.apiV1QuizzesSearchGet(
    q,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **q** | [**string**] |  | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 20|


### Return type

**QuizSummaryDtoIEnumerableApiResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

