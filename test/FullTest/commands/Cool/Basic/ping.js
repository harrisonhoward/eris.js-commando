// @ts-nocheck
const Eris = require("eris");
const Commando = require("../../../../../src");
const { CommandClient } = require("../../../../../src");

module.exports = class Ping extends Commando.Command {
    constructor(bot) {
        super(bot, "ping", "basic", {});
        /**
         * @type {CommandClient}
        */
        this.bot = bot;
    }

    /**
     * 
     * @param {Eris.Message} message 
     * @param {Array<String>} args 
    */
    async execute(message, args) {
        let apiPing = 0;
        if (message.guildID) {
            apiPing = Math.trunc(message.channel.guild.shard.latency);
        } else {
            apiPing = Math.trunc(this.bot.shards.get(0).latency);
        }
        message.channel.createMessage("Pinging...")
            .then((sentMessage) => {
                sentMessage.edit({
                    content: "",
                    embed: {
                        color: 0x2095AB,
                        title: "Pong! :ping_pong:",
                        description: `**Discord API**: ${apiPing}ms\n`
                            + `**Response Time**: ${sentMessage.timestamp - message.timestamp}ms`
                    }
                });
            });
    }
}