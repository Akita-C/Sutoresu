# BulkCreateQuestionsResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**successfulQuestions** | [**Array&lt;QuestionDto&gt;**](QuestionDto.md) |  | [optional] [default to undefined]
**failedQuestions** | [**Array&lt;QuestionCreationError&gt;**](QuestionCreationError.md) |  | [optional] [default to undefined]
**totalProcessed** | **number** |  | [optional] [default to undefined]
**successCount** | **number** |  | [optional] [default to undefined]
**failureCount** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { BulkCreateQuestionsResponse } from './api';

const instance: BulkCreateQuestionsResponse = {
    successfulQuestions,
    failedQuestions,
    totalProcessed,
    successCount,
    failureCount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
