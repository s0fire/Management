<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/teamsfx](./teamsfx.md) &gt; [CommandOptions](./teamsfx.commandoptions.md)

## CommandOptions interface

Options to initialize [CommandBot](./teamsfx.commandbot.md)<!-- -->.

<b>Signature:</b>

```typescript
export interface CommandOptions 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [commands?](./teamsfx.commandoptions.commands.md) | [TeamsFxBotCommandHandler](./teamsfx.teamsfxbotcommandhandler.md)<!-- -->\[\] | <i>(Optional)</i> The commands to registered with the command bot. Each command should implement the interface [TeamsFxBotCommandHandler](./teamsfx.teamsfxbotcommandhandler.md) so that it can be correctly handled by this command bot. |
|  [ssoCommands?](./teamsfx.commandoptions.ssocommands.md) | [TeamsFxBotSsoCommandHandler](./teamsfx.teamsfxbotssocommandhandler.md)<!-- -->\[\] | <i>(Optional)</i> The commands to registered with the sso command bot. Each sso command should implement the interface [TeamsFxBotSsoCommandHandler](./teamsfx.teamsfxbotssocommandhandler.md) so that it can be correctly handled by this command bot. |
