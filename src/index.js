"use strict";

const CommandClient = require("./CommandClient");

function Commando(token, options = {}, clientOptions = {}, loggerOptions = {}) {
    return new CommandClient(token, options, clientOptions, loggerOptions);
}

Commando.CommandClient = CommandClient;
Commando.UtilManager = require("./util/UtilManager");
Commando.WebhookManager = require("./webhook/WebhookManager");
Commando.Command = require("./structures/Command");
Commando.ParentGroup = require("./structures/ParentGroup");
Commando.Group = require("./structures/Group");
Commando.SQLiteProvider = require("./provider/sqlite");
Commando.MongoDBProvider = require("./provider/mongodb");

module.exports = Commando;