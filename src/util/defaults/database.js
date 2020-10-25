// @ts-nocheck
const Eris = require("eris");

module.exports = class Database {
    /**
     * Convert a Map into a JSON
     * @param {Map<*, *>} map 
     * @returns {String} Stringified JSON
    */
    static mapToJson(map) {
        return JSON.stringify([...map]);
    }

    /**
     * Convert a JSON into a Map
     * @param {String} jsonString Stringified JSON
     * @returns {Map<*, *>}
    */
    static jsonToMap(jsonString) {
        return new Map(JSON.parse(jsonString));
    }

    /**
     * Returns an empty map string
     * @returns {String}
    */
    static get emptyMap() {
        if (this.mapToJson != undefined) {
            return this.mapToJson(new Map());
        } else {
            return this.database.mapToJson(new Map());
        }
    }

    /**
     * Add a value to the provider database
     * @param {String} group Group of the setting (i.e. prefix)
     * @param {String} key Key name of the setting (i.e. GuildID)
     * @param {*} value
     * @param {String} [guild]
     * @returns {Promise<*>} 
    */
    static addToStorage(group, key, value, guild = "global") {
        return this.bot.provider
            .set(guild, group, this.database
                .mapToJson(this.database
                    .jsonToMap(this.bot.provider.get(guild, group, this.database.emptyMap)).set(key, value)));
    }

    /**
     * Get a value from the provider database
     * @param {String} group Group of the setting (i.e. prefix)
     * @param {String} key Key name of the setting (i.e. GuildID)
     * @param {*} [defaultValue]
     * @param {String} [guild]
     * @returns {*}
    */
    static getFromStorage(group, key, defaultValue, guild = "global") {
        const tempMap = this.database.jsonToMap(this.bot.provider.get(guild, group, this.database.emptyMap));
        return tempMap.has(key) ? tempMap.get(key) : defaultValue;
    }

    /**
     * Get the entire group as a map from the provider database
     * @param {String} group Group of the setting (i.e. prefix)
     * @param {String} [guild]
     * @returns {Map<*, *>}
    */
    static getMapFromStorage(group, guild = "global") {
        return this.database.jsonToMap(this.bot.provider.get(guild, group, this.database.emptyMap));
    }

    /**
     * Remove a value from the provider database
     * @param {String} group Group of the setting (i.e. prefix)
     * @param {String} key Key name of the setting (i.e. GuildID)
     * @param {String} [guild]
     * @returns {Promise<void>}
    */
    static removeFromStorage(group, key, guild = "global") {
        const tempMap = this.database.jsonToMap(this.bot.provider.get(guild, group, this.database.emptyMap));
        tempMap.delete(key);
        this.bot.provider.set(guild, group, this.database.mapToJson(tempMap));
    }

    /**
     * Clear the entire group
     * @param {String} group Group of the setting (i.e. prefix)
     * @param {String} [guild]
     * @returns {Promise<void>}
    */
    static clearFromStorage(group, guild = "global") {
        this.bot.provider.remove(guild, group);
    }

    /**
     * Save a prefix to the database
     * Utilises CommandClient.addGuildPrefix(guild, prefix)
     * @param {Eris.Guild} guild 
     * @param {String} prefix 
     * @returns {Promise<void>}
    */
    static async addPrefix(guild, prefix) {
        await this.bot.provider.set(guild.id, "prefix", [prefix]);
        this.bot.addGuildPrefix(guild, prefix);
    }

    /**
     * Remove a prefix from the database
     * Utilises CommandClient.removeGuildPrefix(guild)
     * @param {Eris.Guild} guild 
     * @returns {Promise<void>}
    */
    static async removePrefix(guild) {
        await this.bot.provider.remove(guild.id, "prefix");
        this.bot.removeGuildPrefix(guild);
    }
}