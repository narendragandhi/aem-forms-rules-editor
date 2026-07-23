(function (window) {
    "use strict";
    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * Safely resolves multiple XFA nodes by SOM path, returning an array.
     * @name resolveNodes
     * @function
     * @param {string} somPath - The SOM path pattern that may match multiple nodes.
     * @return {Array} Array of resolved XFA nodes, or an empty array if none found.
     * @example
     * var fields = CustomFormRules.xfa.resolveNodes("xfa.form.#subform[0].#field[*]");
     * fields.forEach(function (field) {
     *     console.log("Field:", field.name, "Value:", field.rawValue);
     * });
     */
    window.CustomFormRules.xfa.resolveNodes = function resolveNodes(somPath) {
        try {
            if (!somPath || typeof somPath !== "string") {
                return [];
            }
            var nodes = xfa.form.resolveNodes(somPath);
            if (!nodes || typeof nodes.length === "undefined") {
                return [];
            }
            var result = [];
            for (var i = 0; i < nodes.length; i++) {
                result.push(nodes.item(i));
            }
            return result;
        } catch (e) {
            window.console.warn("[xfa-form] resolveNodes failed for path:", somPath, e);
            return [];
        }
    };

    /**
     * Returns a list of fields that failed validation, including their SOM paths and error messages.
     * @name getInvalidFields
     * @function
     * @return {Array<Object>} Array of objects with somPath, name, and errorMessage properties.
     * @example
     * var invalidFields = CustomFormRules.xfa.getInvalidFields();
     * invalidFields.forEach(function (field) {
     *     console.log("Invalid:", field.somPath, "Error:", field.errorMessage);
     * });
     */
    window.CustomFormRules.xfa.getInvalidFields = function getInvalidFields() {
        try {
            var invalidFields = [];
            var fields = window.CustomFormRules.xfa.resolveNodes("xfa.form.#subform[*].#field[*]");
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                try {
                    if (field && field.validate && !field.validate()) {
                        var errorMessage = "";
                        if (field.message && field.message.value) {
                            errorMessage = field.message.value;
                        }
                        invalidFields.push({
                            somPath: field.somExpression || "",
                            name: field.name || "",
                            errorMessage: errorMessage
                        });
                    }
                } catch (fieldError) {
                    window.console.warn("[xfa-form] getInvalidFields - error validating field:", field.name, fieldError);
                }
            }
            return invalidFields;
        } catch (e) {
            window.console.warn("[xfa-form] getInvalidFields failed:", e);
            return [];
        }
    };

})(window);
