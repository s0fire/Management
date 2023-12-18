<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/teamsfx-api](./teamsfx-api.md) &gt; [RunnableTask](./teamsfx-api.runnabletask.md)

## RunnableTask interface

Definition of a runnable task

<b>Signature:</b>

```typescript
export interface RunnableTask<T> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [current?](./teamsfx-api.runnabletask.current.md) | number | <i>(Optional)</i> current progress |
|  [isCanceled?](./teamsfx-api.runnabletask.iscanceled.md) | boolean | <i>(Optional)</i> a state that indicate whether the task is cancelled or not |
|  [message?](./teamsfx-api.runnabletask.message.md) | string | <i>(Optional)</i> status message |
|  [name?](./teamsfx-api.runnabletask.name.md) | string | <i>(Optional)</i> task name |
|  [total?](./teamsfx-api.runnabletask.total.md) | number | <i>(Optional)</i> total progress |

## Methods

|  Method | Description |
|  --- | --- |
|  [cancel()?](./teamsfx-api.runnabletask.cancel.md) | <i>(Optional)</i> a function that implements the cancelling of the task |
|  [run(args)](./teamsfx-api.runnabletask.run.md) | a function that realy implements the running of the task |
