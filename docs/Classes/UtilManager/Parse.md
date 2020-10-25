# Parse
Contains all the parse functions

## Types
content [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)\
content.arg [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) Argument to check\
content.mentions? [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)[] | [User](https://abal.moe/Eris/docs/User)[] An array of mentions to check

types [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)\
types.​id [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) ID of the user, guild, channel, role\
types.​name [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Name/username of the user, guild, channel, role\
types.tag [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Tag of the user\
types.mention [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Mention of the user, channel, role\


## Functions
userParse(content, types)
> Parse an argument into a User
> Parameter | Description | Type
> --------- | ----------- | ----
> content |  | content
> types? | Types to search for (if applicable) | types
>
> returns [User](https://abal.moe/Eris/docs/User)?

cmdParse(content)
> Parse an argument into a Command
> Parameter | Description | Type
> --------- | ----------- | ----
> content |  | content
>
> returns [Command](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/Command.md)?

guildParse(content, types)
> Parse an argument into a Guild
> Parameter | Description | Type
> --------- | ----------- | ----
> content |  | content
> types? | Types to search for (if applicable) | types
>
> returns [Guild](https://abal.moe/Eris/docs/Guild)?

channelParse(guild, content, types)
> Parse an argument into a Channel
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild to search through | [Guild](https://abal.moe/Eris/docs/Guild)
> content |  | content
> types? | Types to search for (if applicable) | types
>
> returns [Channel](https://abal.moe/Eris/docs/Channel)?

roleParse(guild, content, types)
> Parse an argument into a Role
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild to search through | [Guild](https://abal.moe/Eris/docs/Guild)
> content |  | content
> types? | Types to search for (if applicable) | types
>
> returns [Role](https://abal.moe/Eris/docs/Role)?