"use strict";

const Eris = require("eris");

/**
 * Represents the Command Client Group
 * @property {Object} commands Object mapping the group-specific commands by name and objects
*/
module.exports = class Group {
    /**
     * Create a new Command Group
     * @param {String} name Name of the group
     * @param {String} id ID of the group
     * @param {String} [parentGroup] Name of the parent group
    */
    constructor(name, id, parentGroup) {
        Group.validateGroup(name, id, parentGroup);

        this.name = name;
        this.id = id;
        this.commands = {};
        this.parent = parentGroup;
        this.isParent = false;
    }

    /**
     * Default output
     * @returns {String}
    */
    toString() {
        return `[Group ${this.name}]`;
    }

    /** 
     * @param {Array<String>} props 
     * @returns {Eris.JSONCache}
    */
    toJSON(props = []) {
        return Eris.Base.prototype.toJSON.call(this, [
            "name",
            "id",
            "parent",
            "isParent",
            ...props
        ]);
    }

    /**
     * Validates the Group
     * @param {String} name 
     * @param {String} id
     * @param {String | undefined} parentGroup 
     * @private
    */
    static validateGroup(name, id, parentGroup) {
        if (!name) {
            throw new Error("No group name was specified");
        }
        if (!id) {
            throw new Error("No group id was specified");
        }
        if (typeof name !== "string") {
            throw new TypeError("Group name must be a string");
        }
        if (typeof id !== "string") {
            throw new TypeError("Group id must be a string");
        }
        if (!["string", "undefined"].includes(typeof parentGroup)) {
            throw new TypeError("Group parent must be a string");
        }
    }
}