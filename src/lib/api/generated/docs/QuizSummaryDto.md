# QuizSummaryDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**thumbnailUrl** | **string** |  | [optional] [default to undefined]
**isPublic** | **boolean** |  | [optional] [default to undefined]
**category** | **string** |  | [optional] [default to undefined]
**estimatedDurationMinutes** | **number** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**creatorId** | **string** |  | [optional] [default to undefined]
**creatorName** | **string** |  | [optional] [default to undefined]
**questionCount** | **number** |  | [optional] [default to undefined]
**thumbnailTransformations** | **{ [key: string]: string; }** |  | [optional] [default to undefined]

## Example

```typescript
import { QuizSummaryDto } from './api';

const instance: QuizSummaryDto = {
    id,
    title,
    description,
    thumbnailUrl,
    isPublic,
    category,
    estimatedDurationMinutes,
    createdAt,
    creatorId,
    creatorName,
    questionCount,
    thumbnailTransformations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
