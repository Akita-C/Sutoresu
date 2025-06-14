# UpdateQuestionRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**content** | **string** |  | [optional] [default to undefined]
**questionType** | [**QuestionType**](QuestionType.md) |  | [optional] [default to undefined]
**timeLimitInSeconds** | **number** |  | [optional] [default to undefined]
**points** | **number** |  | [optional] [default to undefined]
**image** | **File** |  | [optional] [default to undefined]
**configuration** | **string** |  | [optional] [default to undefined]
**explanation** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { UpdateQuestionRequest } from './api';

const instance: UpdateQuestionRequest = {
    content,
    questionType,
    timeLimitInSeconds,
    points,
    image,
    configuration,
    explanation,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
