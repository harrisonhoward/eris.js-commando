Read [Github](https://github.com/Forbidden-Duck/eris.js-commando) README, in case of unpublished changes
# Eris.js-Commando
A custom [Eris](https://github.com/abalabahaha/eris) command handler designed for [Forbidden Statistics](https://github.com/Forbidden-Duck/ForbiddenStatistics)

```
npm install eris.js-commando
```

Install [forbidden-node-logger](https://github.com/Forbidden-Duck/forbidden-node-logger) for a colour node console logger
```
npm install forbidden-node-logger
```
[![NPM Version](https://badgen.net/npm/v/eris.js-commando)](https://www.npmjs.com/package/eris.js-commando)
[![NPM Downloads](https://badgen.net/npm/dm/eris.js-commando)](https://www.npmjs.com/package/eris.js-commando)

## **Features**

### Commands, Groups and Parent Groups
Give your bot project structure with Parent Groups and Groups. With these structures you can make having hundreds of commands a breeze to navigate through.\
Example:
```
    - Basic
        * ping.js
        * help.js
        * invite.js
    - Config
        - Join and Leave
            * join.js
            * leave.js
        - Logging
            * mod-log.js
            * action-log.js
```

### Database Providers
In-built SQLiteProvider and MongoDBProvider to allow you quickly and efficiently start using a database without the hassle of having to build functions yourself.\
**MongoDB**
```js
const MongoDBProvider = Commando.MongoDBProvider;
const { MongoClient } = require("mongodb");
bot.setProvider(
    new MongoDBProvider({ host: settings.host, name: settings.name, auth: settings.auth }),
    MongoClient
);
```
**SQLite**
```js
const SQLite = require("sqlite");
const SQLiteProvider = Commando.SQLiteProvider;
const Path = require("path");
bot.setProvider(
    SQLite.open(Path.join(__dirname + "settings.sqlite")).then(db => new sqlite(db))
);
```

### Custom Logging with File Support
Support for [forbidden-node-logger](https://github.com/Forbidden-Duck/forbidden-node-logger) allows you to save logs file and keep your previous 1000 logs in cache without having to manually open your bot terminal.\
`npm install forbidden-node-logger`
```js
bot.Logger.log("Super cool log command!");
bot.Logger.history.first();
bot.Logger.fileHistory.getLatestLog();
```

### Utility Manager
In-built utility manager allows you to use useful functions. The default functions include getting a users tag (username + discriminator) and others allows you to add, get different settings from storage using a map over having to manage your database yourself.\
Along with these features you can add your own utils onto the manager itself.\
*to keep typings you would have to modify the typings file, I'm looking into better options*
```js
bot.util.useful.getUserTag(message.author);
```
```js
function loadUtils(bot) {
    if (!bot.util.checkProps("myfunctions")) {
        bot.util.myfunctions = myfunctions;
    }
    bot.util.bindAll();
}
```

### Webhook Manager
In-built webhook manager allows you to quickly have your bot listen on a port and wait on a sub-directory url (i.e. "/request").\
This is useful for bots waiting for votes from popular listing sites like Bots for Discord and Discord Bot List.
```js
bot.webhookmngr.listenOn(5000);
bot.webhookmngr.waitFor(5000, "/bfdwebhook", (bot data) => {}, "MyBFDAuth");
bot.webhookmngr.waitFor(5000, "/dblwebhook", (bot, data) => {}, "MyDBLAuth");
```

## **Getting Started**

### [Documentation](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/)

### [Frequently Asked Questions](https://github.com/Forbidden-Duck/eris.js-commando/blob/master/FAQ.md)

### Basic Bot
```js
const Commando = require("eris.js-commando");
const bot = Commando.CommandClient(token, {}, {
    name: "CoolErisBot",
    description: "My super cool bot that can do everything!",
    prefix: "!"
}, { dirPath: __dirname + "/logs" }); 
// replace { dirPath: __dirname + "/logs" } with false if you don't have "forbidden-node-logger"
// Along with that remove all bot.Logger references

bot.Logger.on("error", () => {});
bot.on("ready", () => {
    bot.Logger.log("none", `Client ready! Logged in as &-6${bot.user.username}&r (&-c${bot.user.id}&r)`);
});

bot.registerGroup("Basic", "basic");
bot.registerCommandsIn(__dirname + "/commands");

bot.connect();
```

## **Test Scripts**
In the project directory you can run the following scripts (Make sure you have the environment setup correctly):

### `npm run base`
Will run the Base Test of the handler\
Located at *test/BaseTest/bot.js*

### `npm run full`
Will run the Full Test of the handler\
Located at *test/FullTest/bot.js*