# DrawGameApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1DrawGameCreatePost**](#apiv1drawgamecreatepost) | **POST** /api/v1/DrawGame/create | |
|[**apiV1DrawGameRoomRoomIdGet**](#apiv1drawgameroomroomidget) | **GET** /api/v1/DrawGame/room/{roomId} | |
|[**apiV1DrawGameRoomRoomIdPlayersGet**](#apiv1drawgameroomroomidplayersget) | **GET** /api/v1/DrawGame/room/{roomId}/players | |

# **apiV1DrawGameCreatePost**
> GuidApiResponse apiV1DrawGameCreatePost()


### Example

```typescript
import {
    DrawGameApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DrawGameApi(configuration);

let roomName: string; // (optional) (default to undefined)
let configMaxPlayers: number; // (optional) (default to undefined)
let configMaxRoundPerPlayers: number; // (optional) (default to undefined)
let configDrawingDurationSeconds: number; // (optional) (default to undefined)
let configGuessingDurationSeconds: number; // (optional) (default to undefined)
let configRevealDurationSeconds: number; // (optional) (default to undefined)
let configWordRevealIntervalSeconds: number; // (optional) (default to undefined)
let configMaxWordRevealPercentage: number; // (optional) (default to undefined)
let configEnableWordReveal: boolean; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1DrawGameCreatePost(
    roomName,
    configMaxPlayers,
    configMaxRoundPerPlayers,
    configDrawingDurationSeconds,
    configGuessingDurationSeconds,
    configRevealDurationSeconds,
    configWordRevealIntervalSeconds,
    configMaxWordRevealPercentage,
    configEnableWordReveal
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomName** | [**string**] |  | (optional) defaults to undefined|
| **configMaxPlayers** | [**number**] |  | (optional) defaults to undefined|
| **configMaxRoundPerPlayers** | [**number**] |  | (optional) defaults to undefined|
| **configDrawingDurationSeconds** | [**number**] |  | (optional) defaults to undefined|
| **configGuessingDurationSeconds** | [**number**] |  | (optional) defaults to undefined|
| **configRevealDurationSeconds** | [**number**] |  | (optional) defaults to undefined|
| **configWordRevealIntervalSeconds** | [**number**] |  | (optional) defaults to undefined|
| **configMaxWordRevealPercentage** | [**number**] |  | (optional) defaults to undefined|
| **configEnableWordReveal** | [**boolean**] |  | (optional) defaults to undefined|


### Return type

**GuidApiResponse**

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
|**409** | Conflict |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1DrawGameRoomRoomIdGet**
> DrawRoomApiResponse apiV1DrawGameRoomRoomIdGet()


### Example

```typescript
import {
    DrawGameApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DrawGameApi(configuration);

let roomId: string; // (default to undefined)

const { status, data } = await apiInstance.apiV1DrawGameRoomRoomIdGet(
    roomId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomId** | [**string**] |  | defaults to undefined|


### Return type

**DrawRoomApiResponse**

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
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1DrawGameRoomRoomIdPlayersGet**
> DrawPlayerListApiResponse apiV1DrawGameRoomRoomIdPlayersGet()


### Example

```typescript
import {
    DrawGameApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DrawGameApi(configuration);

let roomId: string; // (default to undefined)
let playerId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1DrawGameRoomRoomIdPlayersGet(
    roomId,
    playerId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomId** | [**string**] |  | defaults to undefined|
| **playerId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**DrawPlayerListApiResponse**

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
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

