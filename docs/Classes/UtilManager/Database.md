# Database
Contains all the database functions

## Properties
.emptyMap
> Returns an empty map string
> type [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

## Functions
mapToJson(map)
> Convert a Map into a JSONs
> Parameter | Type
> ---------  | ----
> map | [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
>
> returns [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

jsonToMap(jsonString)
> Convert a JSON into a Map
> Parameter | Description | Type
> --------- | ----------- | ----
> jsonString | Stringified JSON | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

addToStorage(group, key, value, guild)
> Add a value to the provider database
> Parameter | Default | Description | Type
> --------- | ------- | ----------- | ----
> group |  | Group name of the setting (i.e. "prefix") | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> key |  | Key name of the setting | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> value |  | Value to insert | any
> guild? | "global" | Optional, guild to use | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<any>

getFromStorage(group, key, defaultValue, guild)
> Get a value from the provider database
> Parameter | Default | Description | Type
> --------- | ------- | ----------- | ----
> group |  | Group name of the setting (i.e. "prefix") | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> key |  | Key name of the setting | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> defaultValue |  | Default value to return if nothing is found | any
> guild? | "global" | Optional, guild to use | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns any

getMapFromStorage(group, guild)
> Get the entire group as a map from the provider database
> Parameter | Default | Description | Type
> --------- | ------- | ----------- | ----
> group |  | Group name of the setting (i.e. "prefix") | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> guild? | "global" | Optional, guild to use | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

removeFromStorage(guild, key, guild)
> Remove a value from the provider database
> Parameter | Default | Description | Type
> --------- | ------- | ----------- | ----
> group |  | Group name of the setting (i.e. "prefix") | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> key |  | Key name of the setting | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> guild? | "global" | Optional, guild to use | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

clearFromStorage()
> Remove an entire group from the provider database
> Parameter | Default | Description | Type
> --------- | ------- | ----------- | ----
> group |  | Group name of the setting (i.e. "prefix") | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> guild? | "global" | Optional, guild to use | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

addPrefix(guild, prefix)
> Save a prefix to the provider database\
> Utilises [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md).addGuildPrefix(guild, prefix)
> Parameter | Type
> --------- | ----
> guild | [Guild](https://abal.moe/Eris/docs/Guild)
> prefix | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

removePrefix(guild)
> Remove a prefix from the provider database\
> Utilises [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md).removeGuildPrefix(guild)
> Parameter | Type
> --------- | ----
> guild | [Guild](https://abal.moe/Eris/docs/Guild)
>
> returns [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)