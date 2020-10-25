"use strict";

const Eris = require("eris");
const Group = require("./Group");

/**
 * Represents the Command Client Parent Group
 * @property {Object<Group>} groups Object mapping all child groups
*/
module.exports = class ParentGroup extends Group {
    /**
     * Create a new Parent Group
     * @param {String} name Name of the group
     * @param {String} id ID of the group
    */
    constructor(name, id) {
        super(name, id);
        this.isParent = true;
        this.commands = undefined;
        this.groups = {};
    }

    /**
     * Default output
     * @returns {String}
    */
    toString() {
        return `[ParentGroup ${this.name}]`;
    }

    /** 
     * @param {Array<String>} props 
     * @returns {Eris.JSONCache}
    */
    toJSON(props = []) {
        return super.toJSON.call(this, [
            "isParent",
            "groups",
            ...props
        ]);
    }
}