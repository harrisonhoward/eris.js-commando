import * as Eris from "eris";
import * as NodeLogger from "forbidden-node-logger";
import { IncomingMessage, ServerResponse } from "http";
import { MongoClient } from "mongodb";

declare function Commando(token: string, options?: Eris.ClientOptions, clientOptions?: Commando.ClientOptions): Commando.CommandClient;

declare namespace Commando {
    interface ClientOptions {
        name?: string,
        description?: string,
        owner?: string | null,
        prefix?: string,
        defaultCommandOptions?: CommandOptions
    }

    interface ClientEvents<T> {
        (event: "guildPrefixUpdate", listener: (guild: Eris.Guild, oldPrefix: string, newPrefix: string) => void): T;
        (event: "guildPrefixRemove", listener: (guild: Eris.Guild, oldPrefix: string) => void): T;
        (event: "commandExecute", listener: (command: Command, message: Eris.Message, args: string[]) => void): T;
        (event: "commandError", listener: (command: Command, message: Eris.Message, err: Error) => void): T;
    }

    interface CommandOptions {
        description?: string,
        usage?: string,
        aliases?: string[],
        guildOnly?: boolean,
        ignoreBots?: boolean,
        queues?: CommandQueues,
        requires?: CommandRequires,
        invalidRequireMSG?: string | boolean,
        execute?: Promise<Function> | Function
    }

    interface CommandQueues {
        preCommand?: Function,
        postCommand?: Function
    }

    interface CommandRequires {
        users?: Eris.User[],
        roleIDs?: string[],
        permissions?: string[]
    }

    interface MongoDB {
        host: string,
        name: string,
        auth?: {
            username: string,
            password: string
        }
    }

    interface WebhookPorts {
        url: string,
        fn: Function,
        auth?: string
    }

    interface UsefulPagifyReturn {
        currentPage: number,
        maxPages: number,
        arrayResult: any[]
    }

    interface ParseContent {
        arg: string,
        mentions?: string[] | Eris.User[];
    }

    interface ParseTypes {
        id?: boolean,
        name?: boolean,
        tag?: boolean,
        mention?: boolean
    }

    interface ConversionBufferReturn {
        extension: string,
        imageBuffer: Buffer
    }

    export class CommandClient extends Eris.Client {
        clientOptions: ClientOptions;
        commands: { [key: string]: Command };
        groups: { [key: string]: ParentGroup | Group };
        Logger?: NodeLogger.Logger;
        util?: UtilManager;
        webhookmngr?: WebhookManager;
        private preReady?: true;
        private _guildPrefixes: { [key: string]: string };
        constructor(token: string, options?: Eris.ClientOptions, clientOptions?: ClientOptions, loggerOptions?: NodeLogger.LoggerOptions);
        get guildPrefixes(): { [key: string]: string };
        addGuildPrefix(guild: Eris.Guild, prefix: string): void;
        removeGuildPrefix(guild: Eris.Guild): void;
        onMessageCreate(msg: Eris.Message): Promise<void>;
        onMessageEdit(msg: Eris.Message, oldMsg: Eris.OldMessage): Promise<void>;
        resolveCommand(name: string): Command | void;
        registerGuildPrefix(guildID: string, prefix: string): void;
        checkPrefix(msg: Eris.Message): string | void;
        registerCommand(name: string | Command, group?: string, options?: CommandOptions, execute?: Promise<Function> | Function): Command | void;
        registerCommandsIn(dir: string): void;
        registerGroup(name: string | Group, id?: string, parentGroup?: string): Group | void;
        registerGroups(groups: (Group | ParentGroup)[]): void;
        registerParentGroup(name: string | ParentGroup, id?: string): ParentGroup;
        unregisterCommand(name: string): void;
        unregisterGroup(id: string, parentGroup?: string): void;
        unregisterGroups(groups: (Group | ParentGroup)[]): void;
        unregisterParentGroup(id: string): void;
        setProvider(provider: any): Promise<void>;
        toString(): string;
        toJSON(props: string[]): Eris.JSONCache;
        on: Eris.ClientEvents<this> & ClientEvents<this>;
        private static validateCommandClient(clientOptions: ClientOptions): void;
    }

    export class Command {
        client: CommandClient;
        name: string;
        group: string | Group;
        optionsUsed: ClientOptions;
        description: string;
        usage: string;
        aliases: string[];
        guildOnly: boolean;
        ignoreBots: boolean;
        queues: CommandQueues;
        requires: CommandRequires;
        invalidRequireMSG: string | boolean;
        constructor(client: CommandClient, name: string, group: string, options: CommandOptions, execute?: Promise<Function> | Function);
        execute(message: Eris.Message, args: string[]): void;
        requiresCheck(msg: Eris.Message): Promise<boolean>;
        process(args: string[], msg: Eris.Message): Promise<void>;
        toString(): string;
        toJSON(props: string[]): Eris.JSONCache;
        private static validateCommand(name: string, group: string, options: CommandOptions): void;
    }

    export class Group {
        name: string;
        id: string;
        commands?: { [key: string]: Command };
        parent?: string;
        isParent: boolean;
        constructor(name: string, id: string, parentGroup?: string);
        toString(): string;
        toJSON(props: string[]): Eris.JSONCache;
        private static validateGroup(name: string, id: string, parentGroup: string | undefined): void;
    }

    export class ParentGroup extends Group {
        isParent: true;
        commands: undefined;
        groups: { [key: string]: Group };
        toString(): string;
        toJSON(props: string[]): Eris.JSONCache;
    }

    export class MongoDBProvider {
        mongo: MongoDB;
        url: string;
        db: MongoClient;
        settings: Map<string, any>;
        bot?: CommandClient;
        constructor(mongo: MongoDB, db: MongoClient);
        init(bot: CommandClient): Promise<void>;
        updateDB(): Promise<void>;
        all(): Map<string, any>;
        get(guild: Eris.Guild | string, key: string, def?: any): any;
        set(guild: Eris.Guild | string, key: string, value: any): Promise<any>;
        remove(guild: Eris.Guild | string, key: string): Promise<any>;
        setupGuild(guild: string, settings: any): void;
        getGuildID(guild: Eris.Guild | string | null): string | "global";
        private static validateMongoDB(mongo: MongoDB): void;
    }

    export class SQLiteProvider {
        db: object;
        settings: Map<string, any>;
        preparedStatements: { insertOrReplace: null | Promise<any> };
        bot?: CommandClient;
        constructor(db: object);
        init(bot: CommandClient): Promise<void>;
        all(): Map<string, any>;
        get(guild: Eris.Guild | string, key: string, def?: any): any;
        set(guild: Eris.Guild | string, key: string, value: any): Promise<any>;
        remove(guild: Eris.Guild | string, key: string): Promise<any>;
        setupGuild(guild: string, settings: any): void;
        getGuildID(guild: Eris.Guild | string | null): string | "global";
    }

    export class UtilManager {
        bot: CommandClient;
        useful: typeof Useful;
        parse: typeof Parse;
        database: typeof Database;
        conversion: typeof Conversion;
        constructor(bot: CommandClient);
        bind(obj: object): void;
        bindAll(): void;
        checkProps(prop: string): boolean;
    }

    export class WebhookManager {
        bot: CommandClient;
        ports: Map<string, { [key: number]: WebhookPorts }>;
        constructor(bot: CommandClient);
        listenOn(port: number): void;
        waitFor(port: number, waitFor: string, fn: Function, auth?: string): void;
        private _parseRequest(port: number, req: IncomingMessage, res: ServerResponse): void;
    }

    class Useful {
        static getPrefix(guild: Eris.Guild | string): string;
        static arrayPagify(array: any[], pageNumber?: number, amountPerPage?: number): UsefulPagifyReturn;
        static getDefaultChannel(guild: Eris.Guild): Eris.Channel | undefined;
        static getUserTag(id: Eris.User | string): string;
        static awaitMessage(channel: Eris.Channel, timeout: number, filter: Function): Promise<Eris.Message | string>;
    }

    class Parse {
        static userParse(content: ParseContent, types: ParseTypes): Eris.User | void;
        static cmdParse(content: ParseContent): Command | void;
        static guildParse(content: ParseContent, types: ParseTypes): Eris.Guild | void;
        static channelParse(guild: Eris.Guild, content: ParseContent, types: ParseTypes): Eris.Channel | void;
        static roleParse(guild: Eris.Guild, content: ParseContent, types: ParseTypes): Eris.Role | void;
    }

    class Database {
        static mapToJson(map: Map<any, any>): string;
        static jsonToMap(jsonString: string): Map<any, any>;
        static get emptyMap(): string;
        static addToStorage(group: string, key: string, value: any, guild?: string): Promise<any>;
        static getFromStorage(group: string, key: string, defaultValue?: any, guild?: string): any;
        static getMapFromStorage(group: string, guild?: string): Map<any, any>;
        static removeFromStorage(group: string, key: string, guild?: string): Promise<void>;
        static clearFromStorage(group: string, guild?: string): Promise<void>;
        static addPrefix(guild: Eris.Guild, prefix: string): Promise<void>;
        static removePrefix(guild: Eris.Guild): Promise<void>;
    }

    class Conversion {
        static imageToBuffer(url: string): Promise<ConversionBufferReturn>;
        static imageToBase64DataUri(url: string): Promise<string>;
    }
}

export = Commando;