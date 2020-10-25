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

## Getting Started

### [Documentation](https://github.com/Forbidden-Duck/eris.js-commando/tree/master/docs/)

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

## Test Scripts
In the project directory you can run the following scripts (Make sure you have the environment setup correctly):

### `npm run base`
Will run the Base Test of the handler\
Located at *test/BaseTest/bot.js*

### `npm run full`
Will run the Full Test of the handler\
Located at *test/FullTest/bot.js*