/**
 * Data transformation rules for AEM Forms Rules Editor.
 * Encoding, UUID generation, and object manipulation utilities.
 */

(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};

    /**
     * Encode a string to Base64.
     * @name toBase64
     * @function
     * @param {string} text The plain text string.
     * @return {string} Base64 encoded string.
     */
    window.CustomFormRules.toBase64 = function (text) {
        if (!text) return "";
        try {
            return btoa(unescape(encodeURIComponent(text)));
        } catch (e) {
            return "";
        }
    };

    /**
     * Decode a Base64 string.
     * @name fromBase64
     * @function
     * @param {string} encoded The Base64 encoded string.
     * @return {string} Decoded plain text.
     */
    window.CustomFormRules.fromBase64 = function (encoded) {
        if (!encoded) return "";
        try {
            return decodeURIComponent(escape(atob(encoded)));
        } catch (e) {
            return "";
        }
    };

    /**
     * Generate a UUID v4.
     * @name generateUUID
     * @function
     * @return {string} A UUID v4 string.
     */
    window.CustomFormRules.generateUUID = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /**
     * Generate a random alphanumeric string of specified length.
     * @name generateRandomString
     * @function
     * @param {number} length The desired string length.
     * @return {string} Random alphanumeric string.
     */
    window.CustomFormRules.generateRandomString = function (length) {
        var len = Number(length) || 8;
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var result = "";
        for (var i = 0; i < len; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    /**
     * Deep clone a plain object or array.
     * @name deepCloneObject
     * @function
     * @param {object} obj The object to clone.
     * @return {object} Deep clone of the object.
     */
    window.CustomFormRules.deepCloneObject = function (obj) {
        if (obj === null || typeof obj !== "object") return obj;
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (e) {
            return obj;
        }
    };

    /**
     * Flatten a nested object into dot-notation keys.
     * @name flattenObject
     * @function
     * @param {object} obj The nested object.
     * @param {string} prefix The prefix for keys (internal use).
     * @return {object} Flattened object.
     */
    window.CustomFormRules.flattenObject = function (obj, prefix) {
        var result = {};
        var pre = prefix || "";
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            var newKey = pre ? pre + "." + key : key;
            if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
                var nested = window.CustomFormRules.flattenObject(obj[key], newKey);
                for (var k in nested) {
                    if (nested.hasOwnProperty(k)) result[k] = nested[k];
                }
            } else {
                result[newKey] = obj[key];
            }
        }
        return result;
    };

    /**
     * Convert an object to a URL query string.
     * @name objectToQueryString
     * @function
     * @param {object} obj The object to convert.
     * @return {string} URL query string (without leading ?).
     */
    window.CustomFormRules.objectToQueryString = function (obj) {
        if (!obj || typeof obj !== "object") return "";
        var parts = [];
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            var value = obj[key] !== null && obj[key] !== undefined ? encodeURIComponent(obj[key]) : "";
            parts.push(encodeURIComponent(key) + "=" + value);
        }
        return parts.join("&");
    };

    /**
     * Parse a URL query string into an object.
     * @name queryStringToObject
     * @function
     * @param {string} queryString The query string (with or without leading ?).
     * @return {object} Parsed object.
     */
    window.CustomFormRules.queryStringToObject = function (queryString) {
        if (!queryString) return {};
        var str = queryString.charAt(0) === "?" ? queryString.substring(1) : queryString;
        var result = {};
        var pairs = str.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            if (pair.length === 2) {
                result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        }
        return result;
    };

})(window);
