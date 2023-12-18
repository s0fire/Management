<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/teamsfx](./teamsfx.md) &gt; [BotSsoExecutionActivityHandler](./teamsfx.botssoexecutionactivityhandler.md) &gt; [handleTeamsSigninTokenExchange](./teamsfx.botssoexecutionactivityhandler.handleteamssignintokenexchange.md)

## BotSsoExecutionActivityHandler.handleTeamsSigninTokenExchange() method

Receives invoke activities with Activity name of 'signin/tokenExchange'

<b>Signature:</b>

```typescript
handleTeamsSigninTokenExchange(context: TurnContext, query: SigninStateVerificationQuery): Promise<void>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  context | TurnContext | A context object for this turn. |
|  query | SigninStateVerificationQuery | Signin state (part of signin action auth flow) verification invoke query |

<b>Returns:</b>

Promise&lt;void&gt;

A promise that represents the work queued.

## Remarks

It should trigger [BotSsoExecutionDialog](./teamsfx.botssoexecutiondialog.md) instance to handle signin process
