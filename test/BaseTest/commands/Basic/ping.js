const Commando = require("../../../../src");

module.exports = class Ping extends Commando.Command {
    constructor(client) {
        super(
            client,
            "ping",
            "basic",
            {}
        )
    }

    async execute(message, args) {
        message.channel.createMessage(`Pong! ${args.join(" ")}`);
        message.channel.createMessage(`You are: ${this.client.util.useful.getUserTag(message.author)}`);
    }
}