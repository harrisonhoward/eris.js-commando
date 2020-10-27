// @ts-nocheck
const Eris = require("eris");
const { Long } = require("mongodb");
const MessageCollector = require("./collector/MessageCollector");

/**
 * @typedef {Object} pagifyReturn
 * @property {Number} currentPage
 * @property {Number} maxPages
 * @property {Array<*>} arrayResult
*/

module.exports = class Useful {
    /**
     * Returns the prefix of the guild
     * @param {Eris.Guild | String} guild
     * @returns {String}
    */
    static getPrefix(guild) {
        if (!guild) {
            return this.bot.clientOptions.prefix;
        }

        if (typeof guild === "string") {
            if (!(guild = this.bot.guilds.get(guild))) {
                return this.bot.clientOptions.prefix;
            }
        }

        if (guild instanceof Eris.Guild) {
            if ((this.bot.guildPrefixes && this.bot.guildPrefixes[guild.id])
                && this.bot.guildPrefixes[guild.id].length > 0) {
                return this.bot.guildPrefixes[guild.id];
            }
        }

        return this.bot.clientOptions.prefix;
    }

    /**
     * Pagify an array
     * @param {Array} array 
     * @param {Number} [pageNumber]
     * @param {Number} [amountPerPage]
     * @returns {pagifyReturn}
    */
    static arrayPagify(array, pageNumber = 1, amountPerPage = 10) {
        if (isNaN(pageNumber) || pageNumber < 1) {
            pageNumber = 1;
        }

        let arrayEnd = pageNumber * amountPerPage - 1;
        let arrayStart = arrayEnd - amountPerPage + 1;
        if (arrayEnd > array.length) {
            arrayEnd = array.length - 1;
            arrayStart = Math.floor(arrayEnd - (arrayEnd % amountPerPage));
        }

        return {
            currentPage: arrayStart / amountPerPage + 1,
            maxPages: Math.ceil(array.length / amountPerPage),
            arrayResult: array.filter((e, i) => i >= arrayStart && i <= arrayEnd)
        };
    }

    /**
     * Return the default channel of a guild
     * @param {Eris.Guild} guild 
     * @returns {Eris.Channel | undefined}
    */
    static getDefaultChannel(guild) {
        if (!guild) {
            return undefined;
        }

        let channel;
        if (guild.channels.has(guild.id)) {
            channel = guild.channels.get(guild.id);
        }
        if (!channel && guild.channels.some(chn => chn.name === "general")) {
            channel = guild.channels.find(chn => chn.name === "general");
        }
        if (channel && channel.permissionsOf(this.bot.user.id).has("sendMessages")) {
            return channel;
        }

        return guild.channels
            .filter(chn => chn != undefined
                && chn.type == 0
                && chn.permissionsOf(this.bot.user.id).has("sendMessages")
            )
            .sort((a, b) => a.position - b.position ||
                Long.fromString(a.id).subtract(b.id).toNumber()
            )[0];
    }

    /**
     * Return the tag of the user (User#0000)
     * @param {Eris.User | String} id ID of the user (Can be an instance)
     * @returns {String}
    */
    static getUserTag(id) {
        if (id instanceof Eris.User) {
            id = id.id;
        }

        /**
         * @type {Eris.User}
        */
        let user = this.bot.users.get(id);
        if (!user) {
            return;
        }
        return `${user.username}#${user.discriminator}`;
    }

    /**
     * Wait for a single message to be sent
     * @param {Eris.Channel} channel 
     * @param {Number} timeout 
     * @param {Function} filter Filter for the message (i.e. msg => msg.author.id === message.author.id)
     * @return {Promise<Eris.Message | String>} Reason if no message was obtained
    */
    static awaitMessage(channel, timeout, filter) {
        return new Promise((resolve, reject) => {
            const collector = new MessageCollector(this, channel, timeout, filter);
            collector.once("end", (message, reason) => {
                if (reason && reason !== "user") {
                    reject(new Error(reason));
                } else {
                    resolve(message);
                }
            });
        });
    }
}