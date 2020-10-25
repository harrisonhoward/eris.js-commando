# SQLiteProvider
SQLiteProvider can used with [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md).setProvider()

## Properties
.db
> Object containing the SQLite Client\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

.settings
> Map mapping all settings\
> type [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

.preparedStatements
> Object mapping all prepared statements\
> insertOrReplace -> null | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<any>\
> type [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

.bot
> Client that the provider is attached to\
> type [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)?

## Constructor
`new Commando.SQLiteProvider(db)`
> Parameter | Description | Type
> --------- | ----------- | ----
> db | Object containing the SQLite Client | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

## Functions
init(bot)
> Initialises the provider and connects to the database and caches all data in memory
> Parameter | Description | Type
> --------- | ----------- | ----
> bot | Client that the provider is attached to | [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)

all()
> Returns all settings\
> returns [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

get(guild, key, def)
> Get a single value from the database
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild Instance, GuildID or "global" | [Guild](https://abal.moe/Eris/docs/Guild) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> key | Key name of the setting | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> def? | Optional, default value is returned if nothing was found | any
> 
> returns any

set(guild, key, value)
> Insert or replace a value in the database
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild Instance, GuildID or "global" | [Guild](https://abal.moe/Eris/docs/Guild) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> key | Key name of the setting | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> value | Value to insert | any
>
> returns [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<any>

remove(guild, key)
> Remove a setting from the database
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild Instance, GuildID or "global" | [Guild](https://abal.moe/Eris/docs/Guild) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> key | Key name of the setting | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
>
> returns [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<any>

setupGuild(guild, settings)
> Load guild-specific settings
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild ID or Global | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> settings | Settings to load | any


getGuildID(guild)
> Get a guilds ID
> Parameter | Description | Type
> --------- | ----------- | ----
> guild | Guild Instance, GuildID, "global" or null | [Guild](https://abal.moe/Eris/docs/Guild) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| null
>
> returns [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)