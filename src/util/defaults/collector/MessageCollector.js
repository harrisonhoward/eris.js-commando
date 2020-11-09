const { EventEmitter } = require("events");

module.exports = class MessageCollector extends EventEmitter {
    constructor(client, channel, filter, timeout = 60000) {
        super();
        this.filter = filter;
        this.client = client;
        this.channel = channel;
        this.message = null;
        this.end = false;
        this._handleCollect = this._handleCollect.bind(this);
        this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
        this._handleGuildDeletion = this._handleChannelDeletion.bind(this);
        this._idleTimeout = setTimeout(() => this._stop("idle"), timeout);
        this.client.awaitMessage = true;
        this.client.on("messageCreate", this._handleCollect);
        this.client.on("channelDelete", this._handleChannelDeletion);
        this.client.on("guildDelete", this._handleGuildDeletion);
        this.once("end", () => {
            this.client.removeListener("messageCreate", this._handleCollect);
            this.client.removeListener("channelDelete", this._handleChannelDeletion);
            this.client.removeListener("guildDelete", this._handleGuildDeletion);
        });

        if (this.client.awaitMessages == undefined) {
            this.client.awaitMessages = {};
        }
        this.client.awaitMessages[channel.id] = filter;
    }

    _handleCollect(message) {
        const prefix = this.client.util.getPrefix(this.channel.guild);
        if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) {
            message.content = message.content.substring(prefix.length);
        }
        if (message && this.filter(message)) {
            this.message = message;
            this._stop();
        }
    }

    _stop(reason = "user") {
        if (this.end) {
            return;
        }
        if (this._idleTimeout) {
            clearTimeout(this._idleTimeout);
            this._idleTimeout = null;
        }
        this.end = true;
        delete this.client.awaitMessage;
        this.emit("end", this.message, reason);
    }

    _handleChannelDeletion(channel) {
        if (channel.id === this.channel.id) {
            this._stop("channelDelete");
        }
    }

    _handleGuildDeletion(guild) {
        if (this.channel.guild && guild.id === this.channel.guild.id) {
            this._stop("guildDelete");
        }
    }
}