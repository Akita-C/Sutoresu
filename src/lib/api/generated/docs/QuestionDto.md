# QuestionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**questionType** | [**QuestionType**](QuestionType.md) |  | [optional] [default to undefined]
**timeLimitInSeconds** | **number** |  | [optional] [default to undefined]
**points** | **number** |  | [optional] [default to undefined]
**imageUrl** | **string** |  | [optional] [default to undefined]
**configuration** | **string** |  | [optional] [default to undefined]
**explanation** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**quizId** | **string** |  | [optional] [default to undefined]
**quizTitle** | **string** |  | [optional] [default to undefined]
**imageTransformations** | **{ [key: string]: string; }** |  | [optional] [default to undefined]

## Example

```typescript
import { QuestionDto } from './api';

const instance: QuestionDto = {
    id,
    content,
    questionType,
    timeLimitInSeconds,
    points,
    imageUrl,
    configuration,
    explanation,
    createdAt,
    updatedAt,
    quizId,
    quizTitle,
    imageTransformations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
