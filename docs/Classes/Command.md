# Command
Represents a Command

## Properties
.client
> Client that is attached to the command\
> type [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)

.name
> Name of the command\
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

.group
> Group the command belongs to\
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | [Group](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Group.md)

.optionsUsed
> Options used on the command\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

.description
> Description of the command\
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

.usage
> Usage of the command\
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

.aliases
> An array of command aliases\
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]

.guildOnly
> If the command is guild only\
> type [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

.ignoreBots
> If the command should ignore bots\
> type [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

.queues
> An object mapping all queues\
> preCommand? [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)\
> postCommand? [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

.requires
> An object mapping all command requirements\
> userIDs? [User](https://abal.moe/Eris/docs/User)[]\
> roleIDs? [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]\
> permissions? [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

.invalidRequireMSG
> Message to send when a requirements fails\
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

## Constructor
`new Commando.Command(client, name, group, options, execute)`
> Parameter | Default | Description | Type
> --------- | ------- | ----------- | ----
> client |  | Client that is attached to the command | [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)
> name |  | Name of the command | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> group |  | Group the command belongs to | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> options? | {} | All optional, Object mapping command options | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
> options.description? | "No description" | Description of the command | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> options.usage? | "No usage" | Usage of the command | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> options.aliases? | [] | An array of command aliases | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]
> options.guildOnly? | false | If the command is guild only | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
> options.ignoreBots? | true | If the command should ignore bots | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
> options.queues? | {} | An object mapping command queues | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
> options.queues.preCommand? |  | Executed before the command | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
> options.queues.postCommand? |  | Executed after the command | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
> options.requires? | {} | Object mapping all command requirements | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
> options.requires.users? | [] | An array of Users | [User](https://abal.moe/Eris/docs/User)[]
> options.requires.roleIDs? | [] | An array of Role IDs | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]
> options.requires.permissions? [] | An array of permissions | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]
> options.invalidRequireMSG? |  | Message to send if the requirements check fails | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> execute? | undefined | Function to be executed | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)> \| [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

## Functions
execute(message, args)
> Executes when the command is finished processing
> Parameter | Description | Type
> --------- | ----------- | ----
> message | Message the command originated from | [Message](https://abal.moe/Eris/docs/Message)
> args | An array of arguments | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[]