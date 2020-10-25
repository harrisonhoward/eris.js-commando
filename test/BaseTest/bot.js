const Commando = require("../../src");
const token = require("../token").token;

const bot = new Commando.CommandClient(token, {}, {
    name: "TestBot",
    description: "Super Test Bot!",
    owner: "190775609532612608",
    prefix: "$",
    defaultCommandOptions: {
        ignoreBots: true,
        queues: {
            preCommand: () => console.log("Pre Command")
        }
    }
}, { dirPath: __dirname + "/logs" });

bot.on("warn", bot.Logger.log);
bot.on("error", bot.Logger.log);
bot.on("ready", () => {
    bot.Logger.log("none", `Client ready! Logged in as ${bot.user.username} (${bot.user.id})`);

    const web = bot.webhookmngr;
    web.listenOn(4000);
    web.waitFor(4000, "/hey", (client, data) => {
        data = JSON.parse(data);
        client.guilds.get("250486125431488512")
            .channels.get("387406433211121664").createMessage(`New data!: ${data.value}`);
    });
});

bot.registerParentGroup("Big Foo", "foo");
bot.registerGroup("Small Foo", "bar");
bot.registerCommand("foo", "bar", {}, (msg) => {
    msg.channel.createMessage("Bar!");
});

bot.registerGroup("Basic", "basic");
bot.registerCommandsIn(__dirname + "/commands");

bot.connect();