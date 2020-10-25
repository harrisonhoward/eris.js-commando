const Eris = require("eris");
const CommandClient = require("../CommandClient");

/**
 * Use an SQLite-based database to store settings
*/
module.exports = class SQLiteProvider {
    /**
     * Create a new SQLite Provider 
     * @param {Object} db
    */
    constructor(db) {
        this.db = db;
        this.settings = new Map();
        this.preparedStatements = {
            insertOrReplace: null
        }
    }

    /**
     * Initialises the provider by connecting to the database and caching all data in memory
     * @param {CommandClient} bot 
    */
    async init(bot) {
        this.bot = bot;
        await this.db.run("CREATE TABLE IF NOT EXISTS settings (guild INTEGER PRIMARY KEY, settings TEXT");
        const rows = this.db.all("SELECT CAST(guild as TEXT) as guild, settings FROM settings");
        for (const row of rows) {
            let settings;
            try {
                settings = JSON.parse(row.settings);
            } catch (err) {
                continue;
            }
            const guild = row.guild !== "0" ? row.guild : "global";
            this.settings.set(guild, settings);
            this.setupGuild(guild, settings);
        }
        this.preparedStatements.insertOrReplace = await Promise.resolve(this.db.prepare("INSERT OR REPLACE INTO settings VALUES(?, ?)"));
    }

    /**
     * Return all settings
     * @returns {Map<String, *>}
    */
    all() {
        return this.settings;
    }

    /**
     * Get a single value from the database
     * @param {Eris.Guild | String} guild 
     * @param {String} key Key name of the setting
     * @param {*} [def] Default value
     * @returns {*}
    */
    get(guild, key, def) {
        const settings = this.settings.get(this.getGuildID(guild));
        return settings ? settings[key] != undefined ? settings[key] : def : def;
    }

    /**
     * Insert or replace a value in the database
     * @param {Eris.Guild | String} guild 
     * @param {String} key Key name of the setting
     * @param {*} value Value to insert
     * @returns {Promise<*>} New value
    */
    async set(guild, key, value) {
        guild = this.getGuildID(guild);
        let settings = this.settings.get(guild);
        if (!settings) {
            settings = {};
            this.settings.set(guild, settings);
        }
        settings[key] = value;
        await this.preparedStatements.insertOrReplace.run(guild !== "global" ? global : 0, JSON.stringify(settings));
        return value;
    }

    /**
     * Remove a setting from the database
     * @param {Eris.Guild | String} guild 
     * @param {String} key Key name of the setting
     * @returns {Promise<*>} Old value
    */
    async remove(guild, key) {
        guild = this.getGuildID(guild);
        let settings = this.settings.get(guild);
        if (!settings || settings[key] == undefined) {
            return undefined;
        }
        const value = settings[key];
        settings[key] = undefined;
        await this.preparedStatements.insertOrReplace.run(guild !== "global" ? guild : 0, JSON.stringify(settings));
        return value;
    }

    /**
     * Load guild-specific settings
     * @param {String} guild Guild inputted or "global"
     * @param {*} settings Settings to load
    */
    setupGuild(guild, settings) {
        if (typeof guild !== "string") {
            if (this.bot.Logger) {
                this.bot.Logger.error(new TypeError("The guild must be a Guild ID or \"global\""));
                return;
            } else {
                throw new TypeError("The guild must be a Guild ID or \"global\"");
            }
        }
        const erisGuild = this.bot.guilds.get(guild) || null;
        if (settings.prefix && typeof settings.prefix === "string") {
            if (erisGuild) {
                this.bot.guildPrefixes[erisGuild.id] = settings.prefix;
            }
        }
    }

    /**
     * Obtains the ID of the specified guild
     * @param {Eris.Guild | String | null} guild 
     * @returns {String} ID or "global"
    */
    getGuildID(guild) {
        if (guild instanceof Eris.Guild) {
            return guild.id;
        }
        if (guild === "global" || guild == null) {
            return "global";
        }
        // @ts-ignore
        if (typeof guild === "string" && !isNaN(guild)) {
            return guild;
        }
        if (this.bot.Logger) {
            this.bot.Logger.error(new TypeError("Invalid guild specified. Must be a Guild instance, guild ID. \"global\", or null"));
            return;
        } else {
            throw new TypeError("Invalid guild specified. Must be a Guild instance, guild ID. \"global\", or null");
        }
    }
}