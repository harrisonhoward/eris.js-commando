// @ts-nocheck
"use strict";

const Eris = require("eris");
const Commando = require("../../../../../src");
const { CommandClient } = require("../../../../../src");

module.exports = class Eval extends Commando.Command {
    constructor(bot) {
        super(bot, "eval", "owner", { aliases: ["ev"], usage: "Only me the Owner can use it >:)" });
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
        const prefix = this.bot.util.useful.getPrefix(message.guildID);
        const evaluate = args.join(" ");

        if (message.author.id !== this.bot.clientOptions.owner) {
            message.channel.createMessage(`${message.author.mention}, You don't appear to be the Owner`);
            return;
        }

        if (!evaluate || evaluate.length < 1) {
            message.channel.createMessage(`${message.author.mention}, At least give me something to evaluate`);
            return;
        }

        const baseEmbed = {
            color: 0x2095AB,
            timestamp: new Date(),
            fields: []
        };

        const loadingCommand = await message.channel.createMessage("Evaluating...");
        try {
            Promise.resolve(eval(evaluate)).then(async (output) => {
                if (evaluate.length < 1000 && (output ? output.toString().length : 0) < 1000) {
                    baseEmbed.fields.push({ name: "Input", value: `\`\`\`js\n${evaluate}\n\`\`\``, inline: false });
                    baseEmbed.fields.push({ name: "Output", value: `\`\`\`\n${output}\n\`\`\``, inline: false });
                    loadingCommand.delete();
                    message.channel.createMessage({ embed: baseEmbed });
                } else if ((evaluate.length < 1970 && (output ? output.toString().length : 0)) < 1970) {
                    loadingCommand.delete();
                    await message.channel.createMessage(
                        `**INPUT**\n` +
                        `\`\`\`js\n` +
                        `${evaluate}\n` +
                        `\`\`\`\n` +
                        `**INPUT**`
                    );
                    message.channel.createMessage(
                        `**OUTPUT**\n` +
                        `\`\`\`\n` +
                        `${output}\n` +
                        `\`\`\`\n` +
                        `**OUTPUT**`
                    );
                } else {
                    message.channel.createMessage(`${message.author.mention}, Message too big could not send`);
                }
            });
        } catch (err) {
            loadingCommand.delete();
            if (this.bot.Logger) {
                this.bot.Logger.log("none", err.stack);
            }
            message.channel.createMessage(
                `**ERROR**\n` +
                `\`\`\`\n` +
                `${err}\n` +
                `\`\`\`\n` +
                `**ERROR**`
            );
        }
    }
}