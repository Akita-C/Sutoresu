# QuestionDtoPagedResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**data** | [**Array&lt;QuestionDto&gt;**](QuestionDto.md) |  | [optional] [default to undefined]
**nextCursor** | **string** |  | [optional] [default to undefined]
**hasNextPage** | **boolean** |  | [optional] [default to undefined]
**count** | **number** |  | [optional] [readonly] [default to undefined]

## Example

```typescript
import { QuestionDtoPagedResponse } from './api';

const instance: QuestionDtoPagedResponse = {
    data,
    nextCursor,
    hasNextPage,
    count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
