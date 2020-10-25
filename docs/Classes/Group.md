# Group
Represents a Group

## Properties
.name
> Name of the group\
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

.id
> ID of the group\
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

.commands
> An object mapping all group registered commands\
> Mapped by Name -> Command\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?

.parent
> The parent the group belongs to\
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?

.isParent
> If the group is a parent
> type [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

## Constructor
`new Commando.Group(name, id, parentGroup)`
> Parameter | Description | Type
> --------- | ----------- | ----
> name | Name of the group | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> id | Name of the group | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> parentGroup? | Optional, Name of the parent group if one | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)