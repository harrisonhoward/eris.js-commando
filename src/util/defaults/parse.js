// @ts-nocheck
const Command = require("../../structures/Command");
const Eris = require("eris");

/**
 * @typedef {Object} content
 * @property {String} arg Argument to check
 * @property {Array<String | Eris.User>} [mentions] An array of mentions to check
*/

/**
 * @typedef {Object} types
 * @property {Boolean} [id] ID of the user, guild, channel, role
 * @property {Boolean} [name] Name/username of the user, guild, channel, role
 * @property {Boolean} [tag] Tag of the user
 * @property {Boolean} [mention] Mention of the user, channel, role
*/

module.exports = class Parse {
    /**
     * Parse an argument into a User
     * @param {content} content 
     * @param {types} [types] Types to search for (if applicable)
     * @returns {Eris.User | void}
    */
    static userParse(content, types) {
        if (content.arg && content.arg.length > 0) {
            if (types != undefined) {
                if (types.id == true) {
                    if (this.bot.users.has(content.arg)) {
                        return this.bot.users.get(content.arg);
                    }
                }
                if (types.name == true) {
                    if (this.bot.users.find(usr => usr.username.toLowerCase().startsWith(content.arg.toLowerCase()))) {
                        return this.bot.users.find(usr => usr.username.toLowerCase().startsWith(content.arg.toLowerCase()));
                    }
                }
                if (types.tag == true) {
                    if (this.bot.users.find(usr => this.useful.getUserTag(usr) === content.arg)) {
                        return this.bot.users.find(usr => this.useful.getUserTag(usr) === content.arg);
                    }
                }
                if (types.mention == true) {
                    if (content.mentions[0] != undefined
                        && content.mentions[0] instanceof Eris.User) {
                        if (this.bot.users.has(content.mentions[0].id)) {
                            return this.bot.users.get(content.mentions[0].id);
                        }
                    }
                }
            }
        }
        return;
    }

    /**
     * Parse an argument into a Command
     * @param {content} content
     * @return {Command | void}
    */
    static cmdParse(content) {
        if (content.arg && content.arg.length > 0) {
            /**
             * @type {Array<Command>}
            */
            const commands = Object.values(this.bot.commands);
            if (commands.find(cmd => cmd.name.startsWith(content.arg.toLowerCase()))) {
                return commands.find(cmd => cmd.name.startsWith(content.arg.toLowerCase()));
            }
            if (commands.find(cmd => cmd.aliases.includes(content.arg.toLowerCase()))) {
                return commands.find(cmd => cmd.aliases.includes(content.arg.toLowerCase()));
            }
        }
        return;
    }

    /**
     * Parse an argument into a Guild
     * @param {content} content 
     * @param {types} types Types to search for (if applicable)
     * @returns {Eris.Guild | void}
    */
    static guildParse(content, types) {
        if (content.arg && content.arg.length > 0) {
            if (types != undefined) {
                if (types.id == true) {
                    if (this.bot.guilds.has(content.arg)) {
                        return this.bot.guilds.get(content.arg);
                    }
                }
                if (types.name == true) {
                    if (this.bot.guilds.find(gld => gld.name.toLowerCase().startsWith(content.arg.toLowerCase()))) {
                        return this.bot.guilds.find(gld => gld.name.toLowerCase().startsWith(content.arg.toLowerCase()));
                    }
                }
            }
        }
        return;
    }

    /**
     * Parse an argument into a Channel
     * @param {Eris.Guild} guild Guild to check
     * @param {content} content 
     * @param {types} types Types to search for (if applicable)
     * @returns {Eris.Channel | void}
    */
    static channelParse(guild, content, types) {
        if (content.arg && content.arg.length > 0) {
            if (types != undefined) {
                if (types.id == true) {
                    if (guild.channels.has(content.arg)) {
                        return guild.channels.get(content.arg);
                    }
                }
                if (types.name == true) {
                    if (guild.channels.find(chn => chn.name.toLowerCase().startsWith(content.arg.toLowerCase()))) {
                        return guild.channels.find(chn => chn.name.toLowerCase().startsWith(content.arg.toLowerCase()));
                    }
                }
                if (types.mention == true) {
                    if (content.mentions[0] != undefined
                        && typeof content.mentions[0] === "string") {
                        if (guild.channels.has(content.mentions[0])) {
                            return guild.channels.get(content.mentions[0]);
                        }
                    }
                }
            }
        }
        return;
    }

    /**
     * Parse an argument into a Role
     * @param {Eris.Guild} guild Guild to check
     * @param {content} content 
     * @param {types} types Types to search for (if applicable)
     * @returns {Eris.Role | void}
    */
    static roleParse(guild, content, types) {
        if (content.arg && content.arg.length > 0) {
            if (types != undefined) {
                if (types.id == true) {
                    if (guild.roles.has(content.arg)) {
                        return guild.roles.get(content.arg);
                    }
                }
                if (types.name == true) {
                    if (guild.roles.find(rle => rle.name.toLowerCase().startsWith(content.arg.toLowerCase()))) {
                        return guild.roles.find(rle => rle.name.toLowerCase().startsWith(content.arg.toLowerCase()));
                    }
                }
                if (types.mention == true) {
                    if (content.mentions[0] != undefined
                        && typeof content.mentions[0] === "string") {
                        if (guild.roles.has(content.mentions[0])) {
                            return guild.roles.get(content.mentions[0]);
                        }
                    }
                }
            }
        }
        return;
    }
}