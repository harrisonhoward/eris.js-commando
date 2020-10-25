// @ts-nocheck
const Eris = require("eris");
const Commando = require("../../../../../src");
const { CommandClient } = require("../../../../../src");

module.exports = class Help extends Commando.Command {
    constructor(bot) {
        super(bot, "help", "basic", {});
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

        // Parent Group, Normal Group or Command
        const parGrpCmd = args[0];
        // Child Group or Command
        const childGrp = args[1];

        const parentGroups = Object.values(this.bot.groups).filter(grp => grp.isParent);
        const childGroups = Object.values(this.bot.groups).filter(grp => !grp.isParent && grp.parent != undefined);
        const normalGroups = Object.values(this.bot.groups).filter(grp => !grp.isParent && grp.parent == undefined);
        const commands = Object.values(this.bot.commands);

        const baseEmbed = {
            color: 0x2095AB,
            timestamp: new Date(),
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            }
        };

        const loadingCommand = await message.channel.createMessage("Loading Help Menu...");
        if (!parGrpCmd || parGrpCmd.length < 1) {
            baseEmbed.fields = [
                { name: "Information", value: `Remember to do **${prefix}${this.name} [Group / Command]**` },
                { name: "Parent Groups", value: parentGroups.map(grp => grp.name).join("\n") || "None", inline: true },
                { name: "Groups", value: normalGroups.map(grp => grp.name).join("\n") || "None", inline: true }
            ];
            loadingCommand.delete();
            message.channel.createMessage({ embed: baseEmbed });
        } else if (parentGroups.map(grp => grp.name.toLowerCase()).includes(parGrpCmd.toLowerCase())) {
            const chosenParent = parentGroups.find(grp => grp.name.toLowerCase() === parGrpCmd.toLowerCase());
            const groups = Object.values(chosenParent.groups);
            if (childGrp && childGrp.length > 0) {
                if (groups.map(grp => grp.name.toLowerCase()).includes(childGrp.toLowerCase())) {
                    const chosenGroup = groups.find(grp => grp.name.toLowerCase() === childGrp.toLowerCase());
                    const commands = Object.values(chosenGroup.commands);
                    baseEmbed.fields = [
                        { name: "Information", value: `Remember to do **${prefix}${this.name} [Command]**` },
                        {
                            name: "Commands",
                            value: commands.map(cmd => `**${cmd.name}** - \`${cmd.usage || "No Usage"}\``)
                                .join("\n") || "None",
                            inline: true
                        }
                    ];
                    loadingCommand.delete();
                    message.channel.createMessage({ embed: baseEmbed });
                } else {
                    loadingCommand.delete();
                    message.channel.createMessage(`${message.author.mention}, ${childGrp} isn't a child group of ${chosenParent.name}`);
                }
            } else {
                baseEmbed.fields = [
                    { name: "Information", value: `Remember to do **${prefix}${this.name} ${parGrpCmd} [Group]**` },
                    { name: "Groups", value: groups.map(grp => grp.name).join("\n") || "None", inline: true }
                ];
                loadingCommand.delete();
                message.channel.createMessage({ embed: baseEmbed });
            }
        } else if (normalGroups.map(grp => grp.name.toLowerCase()).includes(parGrpCmd.toLowerCase())) {
            const chosenGroup = normalGroups.find(grp => grp.name.toLowerCase() === parGrpCmd.toLowerCase());
            const commands = Object.values(chosenGroup.commands);
            baseEmbed.fields = [
                { name: "Information", value: `Remember to do **${prefix}${this.name} [Command]**` },
                {
                    name: "Commands",
                    value: commands.map(cmd => `**${cmd.name}** - \`${cmd.usage || "No Usage"}\``)
                        .join("\n") || "None",
                    inline: true
                }
            ];
            loadingCommand.delete();
            message.channel.createMessage({ embed: baseEmbed });
        } else if (commands.map(cmd => cmd.name).includes(parGrpCmd.toLowerCase())) {
            const chosenCommand = commands.find(cmd => cmd.name === parGrpCmd.toLowerCase());
            baseEmbed.fields = [
                { name: "Name", value: chosenCommand.name, inline: true },
                { name: "Group", value: chosenCommand.group.name, inline: true },
                { name: "Aliases", value: chosenCommand.aliases.join(", ") || "No aliases", inline: true },
                { name: "Usage", value: chosenCommand.usage || "No usage" }
            ];
            loadingCommand.delete();
            message.channel.createMessage({ embed: baseEmbed });
        } else {
            loadingCommand.delete();
            message.channel.createMessage(`${message.author.mention}, **${parGrpCmd}** isn't a registed Group or Command`);
        }
    }
}