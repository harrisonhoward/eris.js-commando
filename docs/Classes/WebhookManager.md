# Webhook Manager
Command Client webhook manager

## Properties
.bot
> Client that the webhook manager is attached to\
> type [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)

.ports
> Map mapping all ports, their server and what they are waiting for\
> Mapped by Port -> { server: [Server](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server), waitFor: [] }\
> type [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

## Constructor
`new Commando.WebhookManager(bot)`
> Parameter | Description | Type
> --------- | ----------- | ----
> bot | Client that the utility manager is attached to | [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)

## Functions
listenOn(port)
> Listen on a new port
> Parameter | Description | Type
> --------- | ----------- | ----
> port | Port to listen on | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)

waitFor(port, waitFor, fn, auth)
> Wait for a request on the provided sub-directory url (i.e. "/request")
> Parameter | Description | Type
> --------- | ----------- | ----
> port | Port to listen on | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
> waitFor | Sub-directory url to wait for (i.e. "/request") | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
> fn | Function that gets executed | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
> auth? | Optional, auth is compared to "authorization" header | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

## Example Request
fn(bot, data)
> Parameter | Description | Type
> --------- | ----------- | ----
> bot | same as bot property | [CommandClient](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/Classes/CommandoClient.md)
> data | Object mapping all received data | [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)