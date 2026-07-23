/**
 * String manipulation rules for AEM Forms Rules Editor.
 * Text processing, case conversion, and string utilities.
 */

(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};

    /**
     * Convert string to URL-safe slug.
     * @name slugify
     * @function
     * @param {string} text The input text.
     * @return {string} URL-safe slug (e.g., "Hello World!" -> "hello-world").
     */
    window.CustomFormRules.slugify = function (text) {
        if (!text) return "";
        return text.toString().toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "");
    };

    /**
     * Convert string to camelCase.
     * @name camelCase
     * @function
     * @param {string} text The input text.
     * @return {string} camelCase string (e.g., "Hello World" -> "helloWorld").
     */
    window.CustomFormRules.camelCase = function (text) {
        if (!text) return "";
        return text.toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, function (match, c) { return c.toUpperCase(); })
            .replace(/^[A-Z]/, function (c) { return c.toLowerCase(); });
    };

    /**
     * Convert string to snake_case.
     * @name snakeCase
     * @function
     * @param {string} text The input text.
     * @return {string} snake_case string (e.g., "Hello World" -> "hello_world").
     */
    window.CustomFormRules.snakeCase = function (text) {
        if (!text) return "";
        return text.replace(/([A-Z])/g, "_$1")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_/, "")
            .replace(/_$/, "");
    };

})(window);
