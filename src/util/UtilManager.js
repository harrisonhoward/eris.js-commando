const CommandClient = require("../CommandClient");
const useful = require("./defaults/useful");
const parse = require("./defaults/parse");
const database = require("./defaults/database");
const conversion = require("./defaults/conversion");

/**
 * Manages the Utility Functions
*/
module.exports = class UtilManager {
    /**
     * Create a new Util Manager
     * @param {CommandClient} bot 
    */
    constructor(bot) {
        /**
         * Client that instantiated Util Manager
        */
        this.bot = bot;
        this.useful = useful;
        this.parse = parse;
        this.database = database;
        this.conversion = conversion;
        this.bindAll();
    }

    /**
     * Binds all functions in an object
     * @param {Object} obj 
    */
    bind(obj) {
        const functions = Object.getOwnPropertyNames(obj)
            .filter(name => typeof obj[name] === "function");
        for (const func of functions) {
            obj[func] = obj[func].bind(this);
        }
    }

    /**
     * Binds all functions
    */
    bindAll() {
        const functions = Object.getOwnPropertyNames(this)
            .filter(name => typeof this[name] === "function");
        for (const func of functions) {
            this.bind(this[func]);
        }
    }

    /**
     * Checks if a property name exists already
     * @param {String} prop
     * @returns {Boolean}
    */
    checkProps(prop) {
        const props = Object.getOwnPropertyNames(this);
        return props.includes(prop);
    }
}