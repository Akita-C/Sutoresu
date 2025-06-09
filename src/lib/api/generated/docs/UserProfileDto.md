# UserProfileDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**role** | **string** |  | [optional] [default to undefined]
**isEmailVerified** | **boolean** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**lastLoginAt** | **string** |  | [optional] [default to undefined]
**avatarUrl** | **string** |  | [optional] [default to undefined]
**avatarTransformations** | **{ [key: string]: string; }** |  | [optional] [default to undefined]

## Example

```typescript
import { UserProfileDto } from './api';

const instance: UserProfileDto = {
    id,
    name,
    email,
    role,
    isEmailVerified,
    createdAt,
    lastLoginAt,
    avatarUrl,
    avatarTransformations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
