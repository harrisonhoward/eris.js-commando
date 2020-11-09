const http = require("http");
const CommandClient = require("../CommandClient");

module.exports = class WebhookManager {
    /**
     * Create a new Webhook Manager
     * @param {CommandClient} bot Passed to each function
    */
    constructor(bot) {
        this.bot = bot;
        this.ports = new Map();
        this._parseRequest = this._parseRequest.bind(this);
    }

    /**
     * Listen on a new port
     * @param {Number} port
    */
    listenOn(port) {
        if (this.ports.has(port)) {
            if (this.bot.Logger) {
                this.bot.Logger.warn(`${port} is already being listened on`);
            } else {
                this.bot.emit("warn", `${port} is already being listened on`);
            }
        } else {
            const server = http.createServer((req, res) => {
                this._parseRequest(port, req, res);
            }).listen(port, () => {
                if (this.bot.Logger) {
                    this.bot.Logger.info(`Listening on http://0.0.0.0:${port}`);
                } else {
                    console.log(`Listening on http://0.0.0.0:${port}`);
                }
            });
            this.ports.set(port, { server: server, waitFor: [] });
        }
    }

    /**
     * Waits for the specified URL on the port
     * @param {Number} port Port assiociated with the function
     * @param {String} waitFor URL to wait for (i.e. /bfdwebhook)
     * @param {Function} fn Function to be executed upon request (bot, data)
     * @param {String} [auth] Authoirsation token to compare
    */
    waitFor(port, waitFor, fn, auth = undefined) {
        if (!this.ports.has(port)) {
            if (this.bot.Logger) {
                this.bot.Logger.warn(`${port} hasn't been registered yet`);
            } else {
                this.bot.emit("warn", `${port} hasn't been registered yet`);
            }
        } else {
            if ((typeof waitFor !== "string" || !waitFor.startsWith("/"))
                && typeof fn !== "function"
                && !["string", "undefined"].includes(auth)) {
                if (this.bot.Logger) {
                    this.bot.Logger.warn(`Can't wait on ${port}${waitFor}, invalid information was provided`);
                } else {
                    this.bot.emit("warn", `Can't wait on ${port}${waitFor}, invalid information was provided`);
                }
            }
            const portInfo = this.ports.get(port);
            portInfo.waitFor.push({ url: waitFor, fn: fn, auth: auth });
            this.ports.set(port, portInfo);
        }
    }

    /**
     * Manages incomming requests
     * @param {Number} port 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
    */
    _parseRequest(port, req, res) {
        if (!this.ports.has(port)) {
            return;
        }
        const url = req.url;
        const waitFors = this.ports.get(port).waitFor;
        for (const waitFor of waitFors) {
            if (waitFor.url === url && req.method === "POST") {
                if (waitFor.auth != undefined) {
                    if (req.headers.authorization !== waitFor.auth) {
                        return;
                    }
                }
                if (req.headers["content-type"] === "application/json") {
                    let data = "";
                    req.on("data", chunk => {
                        data += chunk;
                    });
                    req.on("end", () => {
                        waitFor.fn(this.bot, data);
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end();
                    });
                }
            }
        }
    }
}