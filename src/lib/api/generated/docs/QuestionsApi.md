# QuestionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1QuestionsBatchByQuizzesPost**](#apiv1questionsbatchbyquizzespost) | **POST** /api/v1/Questions/batch/by-quizzes | |
|[**apiV1QuestionsBatchCountsPost**](#apiv1questionsbatchcountspost) | **POST** /api/v1/Questions/batch/counts | |
|[**apiV1QuestionsBatchDelete**](#apiv1questionsbatchdelete) | **DELETE** /api/v1/Questions/batch | |
|[**apiV1QuestionsBatchPut**](#apiv1questionsbatchput) | **PUT** /api/v1/Questions/batch | |
|[**apiV1QuestionsBulkPost**](#apiv1questionsbulkpost) | **POST** /api/v1/Questions/bulk | |
|[**apiV1QuestionsGet**](#apiv1questionsget) | **GET** /api/v1/Questions | |
|[**apiV1QuestionsIdDelete**](#apiv1questionsiddelete) | **DELETE** /api/v1/Questions/{id} | |
|[**apiV1QuestionsIdGet**](#apiv1questionsidget) | **GET** /api/v1/Questions/{id} | |
|[**apiV1QuestionsIdPut**](#apiv1questionsidput) | **PUT** /api/v1/Questions/{id} | |
|[**apiV1QuestionsPost**](#apiv1questionspost) | **POST** /api/v1/Questions | |
|[**apiV1QuestionsQuizQuizIdGet**](#apiv1questionsquizquizidget) | **GET** /api/v1/Questions/quiz/{quizId} | |

# **apiV1QuestionsBatchByQuizzesPost**
> QuestionDtoIEnumerableApiResponse apiV1QuestionsBatchByQuizzesPost(requestBody)


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let requestBody: Array<string>; //

const { status, data } = await apiInstance.apiV1QuestionsBatchByQuizzesPost(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<string>**|  | |


### Return type

**QuestionDtoIEnumerableApiResponse**

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

# **apiV1QuestionsBatchCountsPost**
> GuidInt32DictionaryApiResponse apiV1QuestionsBatchCountsPost(requestBody)


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let requestBody: Array<string>; //

const { status, data } = await apiInstance.apiV1QuestionsBatchCountsPost(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<string>**|  | |


### Return type

**GuidInt32DictionaryApiResponse**

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

# **apiV1QuestionsBatchDelete**
> BooleanApiResponse apiV1QuestionsBatchDelete(requestBody)


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let requestBody: Array<string>; //

const { status, data } = await apiInstance.apiV1QuestionsBatchDelete(
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

# **apiV1QuestionsBatchPut**
> QuestionDtoIEnumerableApiResponse apiV1QuestionsBatchPut(updateQuestionBulkItem)


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let updateQuestionBulkItem: Array<UpdateQuestionBulkItem>; //

const { status, data } = await apiInstance.apiV1QuestionsBatchPut(
    updateQuestionBulkItem
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateQuestionBulkItem** | **Array<UpdateQuestionBulkItem>**|  | |


### Return type

**QuestionDtoIEnumerableApiResponse**

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

# **apiV1QuestionsBulkPost**
> BulkCreateQuestionsResponseApiResponse apiV1QuestionsBulkPost()


### Example

```typescript
import {
    QuestionsApi,
    Configuration,
    BulkCreateQuestionsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let bulkCreateQuestionsRequest: BulkCreateQuestionsRequest; // (optional)

const { status, data } = await apiInstance.apiV1QuestionsBulkPost(
    bulkCreateQuestionsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bulkCreateQuestionsRequest** | **BulkCreateQuestionsRequest**|  | |


### Return type

**BulkCreateQuestionsResponseApiResponse**

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
|**409** | Conflict |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1QuestionsGet**
> QuestionDtoPagedResponseApiResponse apiV1QuestionsGet()


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let quizId: string; // (optional) (default to undefined)
let search: string; // (optional) (default to undefined)
let questionType: QuestionType; // (optional) (default to undefined)
let sortBy: string; // (optional) (default to undefined)
let isDescending: boolean; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)
let cursor: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1QuestionsGet(
    quizId,
    search,
    questionType,
    sortBy,
    isDescending,
    pageSize,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizId** | [**string**] |  | (optional) defaults to undefined|
| **search** | [**string**] |  | (optional) defaults to undefined|
| **questionType** | **QuestionType** |  | (optional) defaults to undefined|
| **sortBy** | [**string**] |  | (optional) defaults to undefined|
| **isDescending** | [**boolean**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|
| **cursor** | [**string**] |  | (optional) defaults to undefined|


### Return type

**QuestionDtoPagedResponseApiResponse**

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

# **apiV1QuestionsIdDelete**
> BooleanApiResponse apiV1QuestionsIdDelete()


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1QuestionsIdDelete(
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

# **apiV1QuestionsIdGet**
> QuestionDtoApiResponse apiV1QuestionsIdGet()


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1QuestionsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**QuestionDtoApiResponse**

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

# **apiV1QuestionsIdPut**
> QuestionDtoApiResponse apiV1QuestionsIdPut()


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let id: string; // (default to undefined)
let content: string; // (optional) (default to undefined)
let questionType: QuestionType; // (optional) (default to undefined)
let timeLimitInSeconds: number; // (optional) (default to undefined)
let points: number; // (optional) (default to undefined)
let image: File; // (optional) (default to undefined)
let configuration: string; // (optional) (default to undefined)
let explanation: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1QuestionsIdPut(
    id,
    content,
    questionType,
    timeLimitInSeconds,
    points,
    image,
    configuration,
    explanation
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **content** | [**string**] |  | (optional) defaults to undefined|
| **questionType** | **QuestionType** |  | (optional) defaults to undefined|
| **timeLimitInSeconds** | [**number**] |  | (optional) defaults to undefined|
| **points** | [**number**] |  | (optional) defaults to undefined|
| **image** | [**File**] |  | (optional) defaults to undefined|
| **configuration** | [**string**] |  | (optional) defaults to undefined|
| **explanation** | [**string**] |  | (optional) defaults to undefined|


### Return type

**QuestionDtoApiResponse**

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

# **apiV1QuestionsPost**
> QuestionDtoApiResponse apiV1QuestionsPost()


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let content: string; // (optional) (default to undefined)
let questionType: QuestionType; // (optional) (default to undefined)
let timeLimitInSeconds: number; // (optional) (default to undefined)
let points: number; // (optional) (default to undefined)
let image: File; // (optional) (default to undefined)
let configuration: string; // (optional) (default to undefined)
let explanation: string; // (optional) (default to undefined)
let quizId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1QuestionsPost(
    content,
    questionType,
    timeLimitInSeconds,
    points,
    image,
    configuration,
    explanation,
    quizId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **content** | [**string**] |  | (optional) defaults to undefined|
| **questionType** | **QuestionType** |  | (optional) defaults to undefined|
| **timeLimitInSeconds** | [**number**] |  | (optional) defaults to undefined|
| **points** | [**number**] |  | (optional) defaults to undefined|
| **image** | [**File**] |  | (optional) defaults to undefined|
| **configuration** | [**string**] |  | (optional) defaults to undefined|
| **explanation** | [**string**] |  | (optional) defaults to undefined|
| **quizId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**QuestionDtoApiResponse**

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

# **apiV1QuestionsQuizQuizIdGet**
> QuestionDtoIEnumerableApiResponse apiV1QuestionsQuizQuizIdGet()


### Example

```typescript
import {
    QuestionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QuestionsApi(configuration);

let quizId: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1QuestionsQuizQuizIdGet(
    quizId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quizId** | [**string**] |  | defaults to undefined|


### Return type

**QuestionDtoIEnumerableApiResponse**

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

