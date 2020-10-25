"use strict";

const fs = require("fs");
const Eris = require("eris");
const UtilManager = require("./util/UtilManager");
const WebhookManager = require("./webhook/WebhookManager");
const Command = require("./structures/Command");
const Group = require("./structures/Group");
const ParentGroup = require("./structures/ParentGroup");

/**
 * Represents the Command Client along side the Eris Client
 * @extends Eris.Client
 * @property {Object} clientOptions Object mapping Command Client options
 * @property {Object} guildPrefixes Object mapping guild IDs to guld-specific prefixes
 * @property {Object} commands Object mapping command names and objects
 * @property {Object} groups Object mapping group ids and objects
 * @property {UtilManager} util Object mapping all util functions
 * @property {WebhookManager}
*/
module.exports = class CommandClient extends Eris.Client {
    /**
     * CommandClient extends Eris.Client
     * @param {String} token Represents the bots authorisation token
     * @param {Object} [options] Eris Client options (Will be applied to Eris.Client)
     * @param {Object} [clientOptions={}] Command Client options
     * @param {String} [clientOptions.name="<BotUsername>"] Name of the bot
     * @param {String} [clientOptions.description="Eris-based Discord Bot, created with eris.js-commando"] Description of the bot
     * @param {String} [clientOptions.owner=null] ID of the owner
     * @param {String} [clientOptions.prefix="!"] Default prefix of the bot
     * @param {Object} [clientOptions.defaultCommandOptions={ ignoreBots: true }] Default command options (Same as Command)
     * @param {Object | Boolean} [loggerOptions] Node Logger options 
     * (Will be applied to NodeLogger) (Requires forbidden-node-logger) (false for no Logger)
    */
    constructor(token, options, clientOptions = {}, loggerOptions = {}) {
        super(token, options);
        CommandClient.validateCommandClient(clientOptions);
        this.clientOptions = Object.assign({
            name: null,
            description: "Eris-based Discord Bot, created with eris.js-commando",
            owner: null,
            prefix: "!",
            defaultCommandOptions: {}
        }, clientOptions);
        this.clientOptions.defaultCommandOptions = Object.assign({
            ignoreBots: true
        }, this.clientOptions.defaultCommandOptions);
        this._guildPrefixes = {};
        this.commands = {};
        this.groups = {};
        if (loggerOptions != false) {
            const NodeLogger = require("forbidden-node-logger");
            this.Logger = new NodeLogger.Logger(loggerOptions);
        }

        this.once("ready", () => {
            this.util = new UtilManager(this);
            this.webhookmngr = new WebhookManager(this);
        });
        this.once("shardPreReady", () => {
            this.preReady = true;
            if (!this.clientOptions.name) {
                this.clientOptions.name = this.user.username;
            }
            this.clientOptions.prefix = this.clientOptions.prefix.replace(/@mention/g, this.user.mention);
            for (const key of Object.keys(this.guildPrefixes)) {
                this.guildPrefixes[key] = this.guildPrefixes[key].replace(/@mention/g, this.user.mention);
            }
        });

        this.on("messageCreate", this.onMessageCreate);
        this.on("messageUpdate", this.onMessageEdit);
    }

    /**
     * Do not use to set
     * @returns {Object<String, String>}
    */
    get guildPrefixes() {
        return this._guildPrefixes;
    }

    /**
     * Add a new guild-specific prefix
     * @param {Eris.Guild} guild
     * @param {String} prefix
    */
    addGuildPrefix(guild, prefix) {
        const old = this.guildPrefixes[guild.id];
        this.registerGuildPrefix(guild.id, prefix);
        this.emit("guildPrefixUpdate", guild, old, this.guildPrefixes[guild.id]);
    }

    /**
     * Remove a guild-specific prefix
     * @param {Eris.Guild} guild 
    */
    removeGuildPrefix(guild) {
        const old = this.guildPrefixes[guild.id];
        delete this.guildPrefixes[guild.id];
        this.emit("guildPrefixRemove", guild, old);
    }

    /**
     * Finds a command based on the provided Eris Message
     * @param {Eris.Message} msg Eris.Message object to search
    */
    async onMessageCreate(msg) {
        // @ts-ignore
        if (!this.ready) {
            return;
        }
        if (!msg.author) {
            if (this.Logger) {
                this.Logger.warn(`[Message ${msg.id}].author=${msg.author} | [Channel ${msg.channel.id}] | Timestamp ${new Date()}`)
            } else {
                this.emit("warn", `[Message ${msg.id}].author=${msg.author} | [Channel ${msg.channel.id}] | Timestamp ${new Date()}`);
            }
            return;
        }

        msg.command = undefined;
        if ((msg.author.id !== this.user.id)
            && (msg.prefix = this.checkPrefix(msg))) {
            const args = msg.content.replace(/<@!/g, "<@").substring(msg.prefix.length).trim().split(/\s+/g);
            const name = args.shift();
            const command = this.resolveCommand(name);
            if (command != undefined) {
                msg.command = command;
                // @ts-ignore
                if (msg.command.ignoreBots && msg.author.bot) {
                    return;
                }
                try {
                    // @ts-ignore
                    let resp = await msg.command.process(args, msg);
                    if (resp != null) {
                        if (!(resp instanceof Eris.Message)) {
                            resp = await this.createMessage(msg.channel.id, resp);
                        }
                    }
                    // @ts-ignore
                    if (msg.command.queues.postCommand) {
                        // @ts-ignore
                        msg.command.queues.postCommand(msg, args, resp);
                    }
                } catch (err) {
                    if (this.Logger) {
                        this.Logger.error(err);
                        return;
                    } else {
                        this.emit("error", err);
                    }
                    // @ts-ignore
                    if (msg.command.queues.postCommand) {
                        // @ts-ignore
                        msg.command.queues.postCommand(msg, args);
                    }
                }
            }
        }
    }

    /**
     * Finds a command based on the provided Eris Message
     * @param {Eris.Message} msg Eris.Message object to search
     * @param {Eris.OldMessage} oldMsg 
    */
    async onMessageEdit(msg, oldMsg) {
        if (oldMsg == null) {
            return;
        }
        this.onMessageCreate(msg);
        return;
    }

    /**
     * Return command based on provided name
     * @param {String} name 
     * @returns {Command | void}
    */
    resolveCommand(name) {
        let command;
        if (this.commands[name] != undefined) {
            command = this.commands[name];
        }
        Object.values(this.commands).forEach(cmd => {
            if (cmd.aliases.includes(name)) {
                command = cmd;
            }
        });
        if (command != undefined) {
            return command;
        }
    }

    /**
     * Register/Override a guild-specific prefix
     * @param {String} guildID ID of the guild to register/override
     * @param {String} prefix Prefix to register/override
    */
    registerGuildPrefix(guildID, prefix) {
        if (!this.preReady) {
            this.guildPrefixes[guildID] = prefix;
        } else {
            this.guildPrefixes[guildID] = prefix.replace(/@mention/g, this.user.mention);
        }
    }

    /**
     * Checks prefix on provided message
     * @param {Eris.Message} msg 
     * @returns {String | void}
    */
    checkPrefix(msg) {
        let prefix = this.clientOptions.prefix;
        if (msg.channel.guild != undefined
            && this.guildPrefixes[msg.channel.guild.id] != undefined) {
            prefix = this.guildPrefixes[msg.channel.guild.id];
        }
        if (typeof prefix === "string") {
            return msg.content.replace(/<@!/g, "<@").startsWith(prefix) && prefix;
        }
        if (this.Logger) {
            this.Logger.error(new TypeError(`Unsupported Prefix Format | ${prefix}`));
            return;
        } else {
            throw new TypeError(`Unsupported Prefix Format | ${prefix}`);
        }
    }

    /**
     * Register a new command
     * @param {String | Command} name Name of the command
     * @param {String} [group] Group the command is within
     * @param {Object} [options={}] Options to be set on the command
     * @param {String} [options.description="No description"] Description of the command
     * @param {String} [options.usage="No usage"] Usage of the command
     * @param {Array<String>} [options.aliases=[]] An array of command aliases
     * @param {Boolean} [options.guildOnly=false] Whether the command is guildOnly
     * @param {Boolean} [options.ignoreBots=false] Whether the command should ignore bots
     * @param {Object} [options.queues={}] Queues which host Pre Command and Post Command
     * @param {Function} [options.queues.preCommand] Executes before the command
     * @param {Function} [options.queues.postCommand] Executes after the command
     * @param {Object} [options.requires={}] Requirements of the command
     * @param {Array<String>} [options.requires.users=[]] Allowed users of the command
     * @param {Array<String>} [options.requires.roleIDs=[]] Allows roles of the command
     * @param {Array<String>} [options.requires.permissions=[]] Allows permissions of the command
     * @param {String} [options.invalidRequireMSG] Message to send if the requirements check didn't pass
     * @param {Promise<Function> | Function} [execute=undefined] Execute function (not required)
     * @returns {Command}
    */
    registerCommand(name, group, options, execute) {
        let command;
        if (!(name instanceof Command)) {
            command = new Command(this, name, group, options, execute);
        } else {
            command = name;
            group = name.group;
            options = name.optionsUsed;
        }
        for (const key in this.clientOptions.defaultCommandOptions) {
            if (this.clientOptions.defaultCommandOptions.hasOwnProperty(key) && options[key] == undefined) {
                command[key] = this.clientOptions.defaultCommandOptions[key];
            }
        }
        if (this.commands[command.name] != undefined) {
            if (this.Logger) {
                this.Logger.error(new Error(`Command by the name ${command.name} already exists`));
                return;
            } else {
                throw new Error(`Command by the name ${command.name} already exists`);
            }
        }
        Object.values(this.commands).forEach(command => {
            if (command.aliases.includes(command.name)) {
                if (this.Logger) {
                    this.Logger.error(new Error(`Can't register ${command.name} as a command name if it already exists as a command alias`));
                    return;
                } else {
                    throw new Error(`Can't register ${command.name} as a command name if it already exists as a command alias`);
                }
            }
        });
        if (command.aliases.length > 0) {
            for (const alias in command.aliases) {
                Object.values(this.commands).forEach(command => {
                    if (command.aliases.includes(alias)) {
                        if (this.Logger) {
                            this.Logger.error(new Error(`Command alias ${alias} already exists`));
                            return;
                        } else {
                            throw new Error(`Command alias ${alias} already exists`);
                        }
                    }
                });
            }
        }

        if (this.groups[group] != undefined
            && !this.groups[group].isParent) {
            this.groups[group].commands[command.name] = command;
            command.group = this.groups[group];
        } else {
            const parentGroups = Object.values(this.groups).filter(grp => grp.isParent);
            let parentGroup = undefined;
            for (const pGrp of parentGroups) {
                if (pGrp.groups[group] != undefined) {
                    parentGroup = pGrp.id;
                }
            }
            if (parentGroup != undefined) {
                if (this.groups[parentGroup].groups[group] != undefined) {
                    this.groups[parentGroup].groups[group].commands[command.name] = command;
                    command.group = this.groups[parentGroup].groups[group];
                } else {
                    if (this.Logger) {
                        this.Logger.warn(`Failed to register command ${command.name} in ${group}`);
                    } else {
                        this.emit("warn", `Failed to register command ${command.name} in ${group}`);
                    }
                }
            } else {
                if (this.Logger) {
                    this.Logger.error(new Error(`Group by the name ${command.group} isn't registered yet`));
                    return;
                } else {
                    throw new Error(`Group by the name ${command.group} isn't registered yet`);
                }
            }
        }
        this.commands[command.name] = command;
        return command;
    }

    /**
     * Register commands
     * @param {String} dir Directory to look through 
    */
    registerCommandsIn(dir) {
        let groups = fs.readdirSync(dir)
            .filter(group => fs.lstatSync(`${dir}/${group}`).isDirectory());
        groups.forEach(parent => {
            const array = fs.readdirSync(`${dir}/${parent}`)
                .filter(group => fs.lstatSync(`${dir}/${parent}/${group}`).isDirectory())
                .map(group => `${parent}/${group}`);
            groups = groups.filter(group => group !== parent).concat(array);
        });

        let commandsInGroups = [];
        groups.map(group => fs.readdirSync(`${dir}/${group}`)
            .filter(file => file.toLowerCase().endsWith(".js")
                && fs.lstatSync(`${dir}/${group}/${file}`).isFile())
            .map(file => require(`${dir}/${group}/${file}`))).forEach(array => {
                commandsInGroups = commandsInGroups.concat(array); // Converts the 2D Array into 1D
            });
        const commandsInDir = fs.readdirSync(dir)
            .filter(file => file.toLowerCase().endsWith(".js"))
            .map(file => require(`${dir}/${file}`));
        const commands = commandsInGroups.concat(commandsInDir);

        for (let command of commands) {
            try {
                // @ts-ignore
                command = new command(this);
                // @ts-ignore
                this.registerCommand(command);
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Register a new group
     * @param {String | Group} name Name of the group
     * @param {String} [id] ID of the group
     * @param {String} [parentGroup] Name of the parent group
     * @returns {Group}
    */
    registerGroup(name, id, parentGroup) {
        const group = name instanceof Group ? name : new Group(name, id, parentGroup);
        id = group.id;
        parentGroup = group.parent;
        // Checks all parent groups
        const parentGroups = Object.values(this.groups).filter(grp => grp.isParent);
        let groupExistsInParent = false;
        for (const pGrp of parentGroups) {
            if (pGrp.groups[group.id] != undefined) {
                groupExistsInParent = pGrp.id;
            }
        }
        if (parentGroup != undefined) {
            if (this.groups[parentGroup] != undefined) {
                if (!this.groups[parentGroup].isParent) {
                    if (this.Logger) {
                        this.Logger.error(new Error(`${parentGroup} isn't registered as a parent group`));
                        return;
                    } else {
                        throw new Error(`${parentGroup} isn't registered as a parent group`);
                    }
                }
                if (this.groups[parentGroup].groups[group.id] == undefined) {
                    this.groups[parentGroup].groups[group.id] = group;
                    this.groups[group.id] = group;
                } else {
                    if (this.Logger) {
                        this.Logger.error(new Error(`Group by the name ${group.name} already exists in ${parentGroup}`));
                        return;
                    } else {
                        throw new Error(`Group by the name ${group.name} already exists in ${parentGroup}`);
                    }
                }
            } else {
                if (this.Logger) {
                    this.Logger.error(new Error(`Parent group by the name ${parentGroup} isn't registered`));
                    return;
                } else {
                    throw new Error(`Parent group by the name ${parentGroup} isn't registered`);
                }
            }
        } else {
            if (this.groups[group.id] == undefined) {
                this.groups[group.id] = group;
            } else {
                if (this.Logger) {
                    this.Logger.error(new Error(`Group by the name ${group.name} already exists`));
                    return;
                } else {
                    throw new Error(`Group by the name ${group.name} already exists`);
                }
            }
        }
        if (groupExistsInParent != false) {
            if (this.Logger) {
                this.Logger.error(new Error(`Group by the name ${group.name} already exists in ${groupExistsInParent}`));
                return;
            } else {
                throw new Error(`Group by the name ${group.name} already exists in ${groupExistsInParent}`);
            }
        }
        return group;
    }

    /**
     * Register an array of groups
     * @param {Array<Group | ParentGroup>} groups
    */
    registerGroups(groups) {
        for (const group of groups) {
            if (group.isParent && group instanceof ParentGroup) {
                this.registerParentGroup(group);
            } else {
                this.registerGroup(group);
            }
        }
    }

    /**
     * Register a parent group
     * @param {String | ParentGroup} name Name of the group
     * @param {String} [id] ID of the group
    */
    registerParentGroup(name, id) {
        const group = name instanceof ParentGroup ? name : new ParentGroup(name, id);
        if (this.groups[group.id] != undefined) {
            if (this.Logger) {
                this.Logger.error(new Error(`Parent (or normal) group by the name ${group.name} already exists`));
                return;
            } else {
                throw new Error(`Parent (or normal) group by the name ${group.name} already exists`);
            }
        }
        this.groups[group.id] = group;
        return group;
    }

    /**
     * Unregister a command
     * @param {String} name Name of the command
    */
    unregisterCommand(name) {
        delete this.commands[name];
    }

    /**
     * Unregister a group
     * @param {String} id ID of the group
     * @param {String} [parentGroup] Name of the parent group
    */
    unregisterGroup(id, parentGroup) {
        if (parentGroup != undefined) {
            if (this.groups[parentGroup] == undefined) {
                if (this.Logger) {
                    this.Logger.error(new Error(`Parent group by the name ${parentGroup} isn't registered`));
                    return;
                } else {
                    throw new Error(`Parent group by the name ${parentGroup} isn't registered`);
                }
            } else {
                const commands = Object.values(this.groups[parentGroup].groups[id].commands);
                if (commands.length > 0) {
                    for (const command of commands) {
                        this.unregisterCommand(command.name);
                    }
                }
                delete this.groups[parentGroup].groups[id];
            }
        } else {
            const commands = Object.values(this.groups[id].commands);
            if (commands.length > 0) {
                for (const command of commands) {
                    this.unregisterCommand(command.name);
                }
            }
            delete this.groups[id];
        }
    }

    /**
     * Unregister an array of groups
     * @param {Array<Group | ParentGroup>} groups 
     */
    unregisterGroups(groups) {
        for (const group of groups) {
            if (group.isParent) {
                this.unregisterParentGroup(group.id);
            } else {
                this.unregisterGroup(group.id, group.parent);
            }
        }
    }

    /**
     * Unregister a parent group
     * @param {String} id ID of the group
    */
    unregisterParentGroup(id) {
        if (this.groups[id] != undefined) {
            if (this.groups[id].isParent) {
                const subGroups = Object.values(this.groups[id].groups);
                if (subGroups.length > 0) {
                    for (const group of subGroups) {
                        this.unregisterGroup(group.id);
                    }
                }
                delete this.groups[id];
            } else {
                this.unregisterGroup(id);
            }
        }
    }

    /**
     * Set the database provider
     * Use one of the custom or provide your own (requires an INIT FUNCTION)
     * @param {*} provider 
     * @returns {Promise<void>}
    */
    async setProvider(provider) {
        this.provider = provider;

        if (this.startTime) {
            await provider.init(this);
            return;
        }

        await new Promise(resolve => {
            this.once("ready", () => {
                resolve(provider.init(this));
            });
        });
        return;
    }

    /**
     * Default output
     * @returns {String}
    */
    toString() {
        return `[CommandClient ${this.user.id}]`;
    }

    /**
     * @param {String} props
     * @returns {Eris.JSONCache} 
    */
    toJSON(props = []) {
        return super.toJSON([
            "clientOptions",
            "guildPrefixes",
            "commands",
            ...props
        ]);
    }

    /**
     * Validates the Command Client Options
     * @param {Object} clientOptions 
     * @private
    */
    static validateCommandClient(clientOptions) {
        if (typeof clientOptions !== "object") {
            throw new TypeError("Client options must be an object");
        }

        if (!["string", "undefined"].includes(typeof clientOptions.name)) {
            throw new TypeError("Client name must be a string");
        }
        if (!["string", "undefined"].includes(typeof clientOptions.description)) {
            throw new TypeError("Client description must be a string");
        }
        if (!["string", "undefined"].includes(typeof clientOptions.owner)) {
            throw new TypeError("Client owner must be a string");
        }
        if (!["string", "undefined"].includes(typeof clientOptions.prefix)) {
            throw new TypeError("Client prefix must be a string");
        }

        if (!["object", "undefined"].includes(typeof clientOptions.defaultCommandOptions)) {
            throw new TypeError("Client defaultCommandOptions must be an object");
        }
    }
}