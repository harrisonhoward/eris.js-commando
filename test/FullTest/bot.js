const Commando = require("../../src");
const token = require("../token");
const tokens = require("../token");

const bot = new Commando.CommandClient(tokens.token, {}, {
    name: "TestBot",
    description: "Super Test Bot!",
    owner: "190775609532612608",
    prefix: "$",
    defaultCommandOptions: {
        ignoreBots: true,
        queues: {
            preCommand: (client, msg) => {
                if (msg.author.id !== "190775609532612608") {
                    return false;
                }
            }
        }
    }
}, { dirPath: __dirname + "/logs" });

bot.Logger.on("error", () => { });
bot.on("warn", bot.Logger.warn);
bot.on("error", bot.Logger.error);
bot.on("ready", () => {
    bot.Logger.log("none", `Client ready! Logged in as &-6${bot.user.username}&r (&-c${bot.user.id}&r)`);

    const hook = bot.webhookmngr;
    hook.listenOn(4000);
    hook.waitFor(4000, "/request", (client, data) => {
        try {
            data = JSON.parse(data);
        } catch (err) {
            bot.Logger.error(err);
            return;
        }
        if (data.user_id && client.users.has(data.user_id)) {
            client.users.get(data.user_id).getDMChannel()
                .then(chn => chn.createMessage(`New Request:\n${data.value}`))
                .catch(bot.Logger.warn);
        } else if (client.users.has(client.clientOptions.owner)) {
            client.users.get(client.clientOptions.owner).getDMChannel()
                .then(chn => chn.createMessage(`New Request:\n${data.value}`))
                .catch(bot.Logger.warn);
        }
    });
});
bot.on("guildPrefixUpdate", (guild, oldP, newP) => {
    bot.Logger.info(`${guild.name} Prefix Update: ${oldP} -> ${newP}`);
});
bot.on("guildPrefixRemove", (guild, oldP) => {
    bot.Logger.info(`${guild.name} Prefix Remove: ${oldP}`);
});
bot.on("commandExecute", command => {
    bot.Logger.info(`Command Executed: ${command.name}`);
});
bot.on("commandError", (err, command) => {
    bot.Logger.info(`Command Error: ${command.name} -> ${err.message}`);
});

bot.registerGroups([
    new Commando.ParentGroup("Cool", "cool"),
    new Commando.Group("Basic", "basic", "cool"),

    new Commando.ParentGroup("Staff", "staff"),
    new Commando.Group("Owner", "owner", "staff")
]);
bot.registerCommandsIn(__dirname + "/commands");

const Mongo = require("mongodb").MongoClient;
const MongoDBProvider = Commando.MongoDBProvider;
bot.setProvider(new MongoDBProvider({
    host: tokens.database.host,
    name: tokens.database.name,
    auth: {
        username: token.database.auth.user,
        password: token.database.auth.password
    }
}, Mongo));

bot.connect();