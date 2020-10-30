const Eris = require("eris");
const { MongoClient } = require("mongodb");
const CommandClient = require("../CommandClient");

/**
 * @typedef {Object} MongoDB
 * @property {String} host Host Address
 * @property {String} name Host Name
 * @property {Object} [auth] Auth (Not required)
 * @property {String} auth.username Auth Username
 * @property {String} auth.password Auth Password
*/
let MongoDB = {};
const MongoDBOptions = { useUnifiedTopology: true };

/**
 * Use an MongoDB-based database to store settings
*/
module.exports = class MongoDBProvider {
    /**
     * Create a new MongoDB Provider
     * @param {MongoDB} mongo Required options
     * @param {MongoClient} db 
    */
    constructor(mongo, db) {
        MongoDBProvider.validateMongoDB(mongo);
        this.mongo = mongo;
        if (this.mongo.auth != undefined) {
            this.url =
                `mongodb://${this.mongo.auth.username}:${this.mongo.auth.password}@${this.mongo.host}/`;
        } else {
            this.url =
                `mongodb://${this.mongo.host}/`;
        }
        this.db = db;
        this.settings = new Map();
    }

    /**
     * Initialises the provider by connecting to the database and caching all data in memory
     * @param {CommandClient} bot 
    */
    async init(bot) {
        this.bot = bot;
        this.db.connect(this.url + this.mongo.name, MongoDBOptions, (err, db) => {
            if (err) {
                if (this.bot.Logger) {
                    this.bot.Logger.error(err);
                    return;
                } else {
                    throw err;
                }
            }

            const dbo = db.db(this.mongo.name);
            dbo.collections((err, res) => {
                if (err) {
                    if (this.bot.Logger) {
                        this.bot.Logger.error(err);
                        return;
                    } else {
                        throw err;
                    }
                }

                if (!res.find(coll => coll.s.namespace.collection === "settings")) {
                    dbo.createCollection("settings", err => {
                        if (err) {
                            if (this.bot.Logger) {
                                this.bot.Logger.error(err);
                                return;
                            } else {
                                throw err;
                            }
                        }
                    });
                }
                if (this.bot.Logger) {
                    this.bot.Logger.info("MongoDB Database connected");
                } else {
                    console.log("MongoDB Database connected");
                }

                dbo.collection("settings").find({}).toArray((err, res) => {
                    if (err) {
                        if (this.bot.Logger) {
                            this.bot.Logger.error(err);
                            return;
                        } else {
                            throw err;
                        }
                    }

                    if (res && res.length > 0) {
                        for (const row of Array.from(Object.entries(res[0]))) {
                            if (row[0] === "_id") {
                                continue;
                            }
                            const guild = row[0] !== "0" ? row[0] : "global";
                            this.settings.set(guild, row[1]);
                            this.setupGuild(guild, row[1]);
                        }
                    }
                    db.close();
                });
            });
        });
    }

    /**
     * Updates the database with the cached settings
     * @returns {Promise<void>}
    */
    updateDB() {
        return new Promise((resolve, reject) => {
            this.db.connect(this.url + this.mongo.name, MongoDBOptions, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                }

                const dbo = db.db(this.mongo.name);
                const settings = dbo.collection("settings");
                settings.find({}).toArray(async (err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (res[0]) {
                        await settings.deleteOne({});
                    }

                    settings.insertOne(this.settings, err => {
                        if (err) {
                            reject(err);
                            return;
                        } else {
                            db.close();
                            resolve();
                        }
                    });
                });
            });
        }).catch(err => {
            if (this.bot.Logger) {
                this.bot.Logger.error(err);
                return;
            } else {
                throw err;
            }
        });
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
        await this.updateDB();
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
        await this.updateDB();
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
        if (settings.prefix && typeof settings.prefix[0] === "string") {
            if (erisGuild) {
                this.bot.guildPrefixes[erisGuild.id] = settings.prefix[0];
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

    /**
     * Validate MongoDB object
     * @param {MongoDB} mongo 
     * @private
    */
    static validateMongoDB(mongo) {
        if (mongo == undefined) {
            throw new Error("MongoDB mongo options are required");
        }

        if (mongo.host == undefined) {
            throw new Error("MongoDB mongo host is required");
        }
        if (mongo.name == undefined) {
            throw new Error("MongoDB mongo name is required");
        }
        if (typeof mongo.host !== "string") {
            throw new TypeError("MongoDB mongo host must be a string");
        }
        if (typeof mongo.name !== "string") {
            throw new TypeError("MongoDB mongo name must be a string");
        }

        if (mongo.auth != undefined) {
            if (mongo.auth.username == undefined) {
                throw new Error("MongoDBAuth mongo username is required");
            }
            if (mongo.auth.password == undefined) {
                throw new Error("MongoDBAuth mongo password is required");
            }
            if (typeof mongo.auth.username !== "string") {
                throw new TypeError("MongoDBAuth mongo username must be a string");
            }
            if (typeof mongo.auth.password !== "string") {
                throw new TypeError("MongoDBAuth mongo password must be a string");
            }
        }
    }
}