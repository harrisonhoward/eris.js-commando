# Command Client extends [Eris.Client](https://abal.moe/Eris/docs/Client)
Represents the Command Client along side the Eris Client

## Properties
.clientOptions
> Command Client Options\
> name? description? owner? prefix? defaultCommandOptions?\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

.commands
> Object mapping all registered commands\
> Mapped by Name -> Command\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

.groups
> Object mapping all registered groups and parent groups\
> Mapped by ID -> Group | ParentGroup\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

.guildPrefixes
> Object getter mapping all registered guild prefixes\
> Mapped by GuildID -> Prefix\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

.Logger
> Contains the Logger of [forbidden-node-logger](https://github.com/Forbidden-Duck/forbidden-node-logger) is installed\
> type [Logger](https://github.com/Forbidden-Duck/forbidden-node-logger/blob/master/src/index.js)?

.util
> Contains the UtilManager\
> type [UtilManager](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/UtilManager.md)?

.webhookmngr
> Contains the WebhookManager\
> type [WebhookManager](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/WebhookManager.md)?

## Constructor
`new Commando.CommandClient(token, options, clientOptions, loggerOptions)`
> Parameter | Default | Description | Type
> --------- | ------- | ----------- | ----
> token |  | Required, Discord Bot Token | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> options? |  | Optional, Eris Client Options | [Client](https://abal.moe/Eris/docs/Client)
> clientOptions? | {} | Optional, CommandCient Options | [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)
> clientOptions.name? | "BotUsername" | Optional, Name of the bot | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> clientOptions.description? | "Eris-based Discord Bot, created with eris.js-commando" | Optional, Description of the bot | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> clientOptions.owner? | null | Optional, ID of the owner | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> clientOptions.prefix? | ! | Optional, Default prefix of the bot | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> clientOptions.defaultCommandOptions? | { ignoreBots: true } | Optional, Default Command options | [Command](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Command.md)
> loggerOptions? | {} | Optional, Logger options assigned to the Logger | [Logger](https://github.com/Forbidden-Duck/forbidden-node-logger/blob/master/src/index.js)

## Functions
addGuildPrefix(guild, prefix)
> Add a Guild Prefix
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild to add the prefix to | [Guild](https://abal.moe/Eris/docs/Guild)
> prefix | Prefix being assigned to the Guild | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

removeGuildPrefix(guild)
> Remove a Guild Prefix
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild to add the prefix to | [Guild](https://abal.moe/Eris/docs/Guild)

registerCommand(name, group, options, execute)
> Register a new command
> Parameter | Default | Description | Type
> --------- | ------- | ----------- | ----
> name |  | Command Name or Command Instance | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | [Command](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Command.md)
> group? |  | Group to add the command to | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> options? | {} | Command Options | [Command](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Command.md)
> execute? | undefined | Function to be executed | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)> \| [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
>
> returns [Command](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Command.md)

registerCommandsIn(dir)
> Register all commands in the directory
> Structure allows for dir/command.js | dir/group/command.js | dir/parent/group/command.js
> "group" and "parent" are not limited to actual groups
> Parameter | Description | Type
> --------- | ----------- | ----
> dir | Source Directory for commands (i.e. __dirname + "/commands") | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

registerGroup(name, id, parentGroup)
> Register a new group
> Parameter | Description | Type
> --------- | ----------- | ----
> name | Group Name or Group Instance | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | [Group](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Group.md)
> id? | ID of the group | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> parentGroup? | Optional, Parent group if one | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [Group](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Group.md)

registerGroups(groups)
> Register an array of Normal or Parent Groups
> Parameter | Description | Type
> --------- | ----------- | ----
> groups | Array of Normal Groups or Parent Groups | ([Group](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Group.md) \| [ParentGroup](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/ParentGroup.md))[]

registerParentGroup(name, id)
> Register a new parent group
> Parameter | Description | Type
> --------- | ----------- | ----
> name | ParentGroup Name or ParentGroup Instance | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | [ParentGroup](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/ParentGroup.md)
> id? | ID of the group | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [ParentGroup](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/ParentGroup.md)

unregisterCommand(name)
> Unregister a command
> Parameter | Description | Type
> --------- | ----------- | ----
> name | Name of the command | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

unregisterGroup(id, parentGroup)
> Unregister a group
> Parameter | Description | Type
> --------- | ----------- | ----
> id | Id of the group | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> parentGroup? | Optional, Name of the parent group | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

unregisterGroups(groups)
> Unregister an array of Normal or Parent Groups
> Parameter | Description | Type
> --------- | ----------- | ----
> groups | Array of Normal Groups or Parent Groups | ([Group](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Group.md) \| [ParentGroup](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/ParentGroup.md))[]

unregisterParentGroup(id)
> Unregister a parent group
> Parameter | Description | Type
> --------- | ----------- | ----
> id | Id of the group | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

setProvider(provider)
> Set the database provider
> Parameter | Description | Type
> --------- | ----------- | ----
> provider | Database provider (Requires an INIT FUNCTION) | any
>
> returns [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## Events
guildPrefixUpdate
> Emitted when a prefix is updated
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild prefix update from | [Guild](https://abal.moe/Eris/docs/Guild)
> oldPrefix | Original prefix | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> newPrefix | New prefix | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

guildPrefixRemove
> Emitted when a prefix is removed
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild prefix was removed from | [Guild](https://abal.moe/Eris/docs/Guild)
> oldPrefix | Original prefix | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

commandExecute
> Emitted when a command is executed
> Parameter | Description | Type
> --------- | ----------- | ----
> command | Command executed | [Command](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Command.md)

commandError
> Emitted when a command experiences an error
> Parameter | Description | Type
> --------- | ----------- | ----
> command | Command the error originated from | [Command](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Command.md)
> error | Error that caused the event | [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)