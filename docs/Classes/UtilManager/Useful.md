# Useful
Contains all useful functions

## Functions
getPrefix(guild)
> Get a guild-specific prefix (returns bot prefix if non found)
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild Instance or GuildID | [Guild](https://abal.moe/Eris/docs/Guild) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)


arrayPagify(array, pageNumber, amountPerPage)
> Pagify an array
> Returns an object containing currentPage, maxPages and arrayResult
> Parameter | Default | Description | Type
> --------- | ------- | ----------- | ----
> array |  | The array to pagify | any[]
> pageNumber? | 1 | Page number to view on | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
> amountPerPage? | 10 | Amount of of items to return per page | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
>
> returns [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

getDefaultChannel(guild)
> Get the default channel of a guild
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild to check | [Guild](https://abal.moe/Eris/docs/Guild)
>
> returns [Channel](https://abal.moe/Eris/docs/Channel)?


getUserTag(id)
> Get the tag string of a user
> Parameter | Description | Type
> --------- | ----------- | ----
> id | User Instance or UserID | [User](https://abal.moe/Eris/docs/User) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?

awaitMessage(channel, timeout, filter)
> Wait for a single message
> Parameter | Description | Type
> --------- | ----------- | ----
> channel | Channel to wait in | [Channel](https://abal.moe/Eris/docs/Channel)
> timeout | How long to wait | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
> filter | Filter for the message (i.e. msg => msg.​author.​id === message.​author.​id) | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)