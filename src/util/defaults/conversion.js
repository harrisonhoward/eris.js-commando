const fs = require("fs");
const https = require("https");

/**
 * @typedef {Object} bufferReturn
 * @property {String} extension File extension
 * @property {Buffer} imageBuffer
*/

module.exports = class Conversion {
    /**
     * Converts an image (local files) to a buffer
     * @param {String} url Location of the image
     * @returns {Promise<bufferReturn | Error>} 
    */
    static imageToBuffer(url) {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(url, { highWaterMark: 128 * 1024 });
            const data = [];

            readStream.on("data", chunk => {
                data.push(chunk);
            });

            readStream.once("end", async () => {
                const extension = url.match(/\.[0-9a-z]{1,10}/i);
                const imageBuffer = Buffer.concat(data);
                if (!extension || !imageBuffer) {
                    reject(new Error("imageToBuffer failed"));
                } else {
                    resolve({ extension: extension[extension.length - 1], imageBuffer: imageBuffer });
                }
            });
        });
    }

    /**
     * Convert a image (non local files) into a base64 data uri string
     * @param {String} url Location of the image
     * @returns {Promise<String | Error>}
    */
    static imageToBase64DataUri(url) {
        return new Promise((resolve, reject) => {
            https.get(url, req => {
                const buffers = [];
                req.on("data", chunk => {
                    buffers.push(chunk);
                });
                req.on("end", () => {
                    let extension = url.match(/\.[0-9a-z]{1,10}/i);
                    const data = Buffer.concat(buffers).toString("base64");
                    const dataUri = `data:image/${extension[extension.length - 1].substring(1)};base64,${data}`;
                    if (!extension || !data) {
                        reject(new Error("imageToBase64DataUri failed"));
                    } else {
                        resolve(dataUri);
                    }
                });
            });
        });
    }
}