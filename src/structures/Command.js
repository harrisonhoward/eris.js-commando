"use strict";

const Eris = require("eris");
const CommandClient = require("../CommandClient");

/**
 * Represents the Command Client Command
*/
module.exports = class Command {
    /**
     * Create a new Bot Command
     * @param {CommandClient} client Client to attach to command
     * @param {String} name Name of the command
     * @param {String} group Group the command is within
     * @param {Object} [options={}] Options to be set on the command
     * @param {String} [options.description="No description"] Description of the command
     * @param {String} [options.usage="No usage"] Usage of the command
     * @param {Array<String>} [options.aliases=[]] An array of command aliases
     * @param {Boolean} [options.guildOnly=false] Whether the command is guildOnly
     * @param {Boolean} [options.ignoreBots=true] Whether the command should ignore bots
     * @param {Object} [options.queues={}] Queues which host Pre Command and Post Command
     * @param {Function} [options.queues.preCommand] Executes before the command
     * @param {Function} [options.queues.postCommand] Executes after the command
     * @param {Object} [options.requires={}] Requirements of the command
     * @param {Array<String>} [options.requires.users=[]] Allowed users of the command
     * @param {Array<String>} [options.requires.roleIDs=[]] Allows roles of the command
     * @param {Array<String>} [options.requires.permissions=[]] Allows permissions of the command
     * @param {String} [options.invalidRequireMSG] Message to send if the requirements check didn't pass
     * @param {Promise<Function> | Function} [execute] Execute function (not required)
    */
    constructor(client, name, group, options, execute) {
        Command.validateCommand(name, group, options);

        this.client = client;
        this.name = name.toLowerCase();
        this.group = group;
        this.optionsUsed = options;
        this.description = options.description || "No description";
        this.usage = options.usage || "No usage";
        this.aliases = options.aliases || [];
        this.guildOnly = !!options.guildOnly;
        this.ignoreBots = !!options.ignoreBots;
        this.queues = options.queues || {};
        this.requires = options.requires || {};
        if (!this.requires.users) {
            this.requires.users = [];
        }
        if (!this.requires.roleIDs) {
            this.requires.roleIDs = [];
        }
        if (!this.requires.permissions) {
            this.requires.permissions = [];
        }
        this.invalidRequireMSG = options.invalidRequireMSG || false;

        if (typeof execute === "function") {
            // Converted into a asynchronous function to comply with execute Promise rules
            this.execute = async (msg, args) => { return execute(msg, args) };
        }
    }

    /**
     * Executes the command
     * @param {Eris.Message} message Message the command originated from
     * @param {Array<String>} args An array of arguments
     * @returns {Promise<*>}
    */
    async execute(message, args) {
        throw new Error(`${this.name} doesn't have an execute() method`);
    }

    /**
     * Checks the requirements on the provided message
     * @param {Eris.Message} msg 
    */
    async requiresCheck(msg) {
        if (this.requires.users) {
            const userIDs = this.requires.users;
            if (userIDs.length > 0 && !userIDs.includes(msg.author.id)) {
                return false;
            }
        }
        if (msg.channel.guild) {
            const memberRoleIDs = msg.member.roles || [];
            if (this.requires.roleIDs) {
                const roleIDs = this.requires.roleIDs;
                for (const roleID of roleIDs) {
                    if (!memberRoleIDs.includes(roleID)) {
                        return false;
                    }
                }
            }
            if (this.requires.permissions) {
                const permissions = this.requires.permissions;
                if (permissions.length > 0) {
                    const channelPermissions = msg.channel.permissionsOf(msg.author.id);
                    for (const permission of permissions) {
                        if (!channelPermissions.has(permission)) {
                            return false;
                        }
                    }
                }
            }
        } else if (this.guildOnly) {
            return false;
        }
        return true;
    }

    /**
     * Processes the args and message
     * @param {Array<String>} args 
     * @param {Eris.Message} msg 
    */
    async process(args, msg) {
        if (this.queues.preCommand) {
            const response = await Promise.resolve(this.queues.preCommand(this, msg, args));
            if (response) {
                msg = response.msg || msg;
                args = response.args || args;
            }
            if (response == false) {
                return;
            }
        }

        if (!await this.requiresCheck(msg)) {
            if (this.invalidRequireMSG) {
                msg.channel.createMessage(this.invalidRequireMSG);
            }
            return;
        }
        try {
            await this.execute(msg, args);
            this.client.emit("commandExecute", this);
        } catch (err) {
            this.client.emit("commandError", err, this)
        }
    }

    /**
     * Default Output
     * @returns {String}
    */
    toString() {
        return `[Command ${this.name}]`;
    }

    /**
     * @param {Array<String>} props 
     * @returns {Eris.JSONCache}
    */
    toJSON(props = []) {
        return Eris.Base.prototype.toJSON.call(this, [
            "client",
            "name",
            "group",
            "description",
            "usage",
            "aliases",
            "guildOnly",
            "ignoreBots",
            "queues",
            "requires",
            "invalidRequireMSG",
            "execute",
            ...props
        ]);
    }

    /**
     * Validates the Command
     * @param {String} name 
     * @param {String} group 
     * @param {Object} options 
     * @private
    */
    static validateCommand(name, group, options) {
        if (!name) {
            throw new Error("No command name was specified");
        }
        if (!group) {
            throw new Error("No command group was specified");
        }
        if (typeof name !== "string") {
            throw new TypeError("Command name must be a string");
        }
        if (typeof group !== "string") {
            throw new TypeError("Command group must be a string");
        }
        if (typeof options !== "object") {
            throw new TypeError("Command options must be an object");
        }

        if (name.includes(" ")) {
            throw new TypeError("Command name can not contain spaces");
        }

        if (!["string", "undefined"].includes(typeof options.description)) {
            throw new TypeError("Command description must be a string");
        }
        if (!["string", "undefined"].includes(typeof options.usage)) {
            throw new TypeError("Command usage must be a string");
        }
        if (!Array.isArray(options.aliases) && typeof options.aliases !== "undefined") {
            throw new TypeError("Command aliases must be an array");
        }
        if (!["object", "undefined"].includes(typeof options.queues)) {
            throw new TypeError("Command queues must be an object");
        }
        if (!["object", "undefined"].includes(typeof options.queues)) {
            throw new TypeError("Command requires must be an object");
        }
        if (!["string", "boolean", "undefined"].includes(typeof options.invalidRequireMSG)) {
            throw new TypeError("Command invalidRequireMSG must be a string");
        }

        if (options.requires != undefined) {
            if (!Array.isArray(options.requires.users) && typeof options.requires.users !== "undefined") {
                throw new TypeError("Command required userIDs must be an array");
            }
            if (!Array.isArray(options.requires.roleIDs) && typeof options.requires.roleIDs !== "undefined") {
                throw new TypeError("Command required roleIDs must be an array");
            }
            if (!Array.isArray(options.requires.permissions) && typeof options.requires.permissions !== "undefined") {
                throw new TypeError("Command required permissions must be an array");
            }
        }
    }
}