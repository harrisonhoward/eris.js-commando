# UtilManager
Command Client utility manager

## Properties
.bot
> Client that the utility manager is attached to\
> type [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)

.useful
> Contains the useful functions\
> type [Useful](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/UtilManager/Useful.md)

.parse
> Contains the parse functions\
> type [Parse](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/UtilManager/Parse.md)

.database
> Contains the database functions\
> type [Database](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/UtilManager/Database.md)

.conversion
> Contains the conversion functions\
> type [Conversion](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/UtilManager/Conversion.md)

## Constructors
`new Commando.UtilManager(bot)`
> Parameter | Description | Type
> --------- | ----------- | ----
> bot | Client that the utility manager is attached to | [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)

## Functions
bind(obj)
> Bind all functions in an object
> Parameter | Description | Type
> --------- | ----------- | ----
> obj | Object that contains the functions | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

bindAll()
> Binds all functions using \<this>

checkProps()
> Checks if the provided property name exists
> Parameter | Description | Type
> --------- | ----------- | ----
> prop | Property name | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)