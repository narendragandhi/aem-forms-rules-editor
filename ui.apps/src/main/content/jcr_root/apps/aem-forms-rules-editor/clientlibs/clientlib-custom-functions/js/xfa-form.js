(function (window) {
    "use strict";
    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * @name resolveNode
     * @function
     * @description Safely resolves an XFA node by SOM path with error handling.
     * @param {string} somPath - The SOM path to the XFA node (e.g., "xfa.form.#subform[0].#field[0]").
     * @return {Object|null} The resolved XFA node, or null if resolution fails.
     * @example
     * // Resolve a field by its SOM path
     * var node = window.CustomFormRules.xfa.resolveNode("xfa.form.#subform[0].#field[0]");
     * if (node) {
     *     console.log("Found node:", node.name);
     * }
     */
    window.CustomFormRules.xfa.resolveNode = function resolveNode(somPath) {
        try {
            if (!somPath || typeof somPath !== "string") {
                return null;
            }
            var resolved = xfa.form.resolveNode(somPath);
            return resolved || null;
        } catch (e) {
            window.console.warn("[xfa-form] resolveNode failed for path:", somPath, e);
            return null;
        }
    };

    /**
     * @name resolveNodes
     * @function
     * @description Safely resolves multiple XFA nodes by SOM path, returning an array.
     * @param {string} somPath - The SOM path pattern that may match multiple nodes.
     * @return {Array} Array of resolved XFA nodes, or an empty array if none found.
     * @example
     * // Resolve all field nodes under a subform
     * var fields = window.CustomFormRules.xfa.resolveNodes("xfa.form.#subform[0].#field[*]");
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
     * @name getNodeText
     * @function
     * @description Resolves an XFA node and returns its rawValue in a single call.
     * @param {string} somPath - The SOM path to the XFA node.
     * @return {string|null} The rawValue of the node, or null if resolution fails.
     * @example
     * // Get the text value of a field
     * var firstName = window.CustomFormRules.xfa.getNodeText("xfa.form.#subform[0].#field[0]");
     * console.log("First Name:", firstName);
     */
    window.CustomFormRules.xfa.getNodeText = function getNodeText(somPath) {
        try {
            var node = window.CustomFormRules.xfa.resolveNode(somPath);
            if (!node) {
                return null;
            }
            return node.rawValue !== undefined ? node.rawValue : null;
        } catch (e) {
            window.console.warn("[xfa-form] getNodeText failed for path:", somPath, e);
            return null;
        }
    };

    /**
     * @name setNodeText
     * @function
     * @description Resolves an XFA node and sets its rawValue in a single call.
     * @param {string} somPath - The SOM path to the XFA node.
     * @param {string} value - The value to set as the node's rawValue.
     * @return {boolean} True if the operation succeeded, false otherwise.
     * @example
     * // Set the value of a field
     * var success = window.CustomFormRules.xfa.setNodeText("xfa.form.#subform[0].#field[0]", "John");
     * if (success) {
     *     console.log("Field updated successfully");
     * }
     */
    window.CustomFormRules.xfa.setNodeText = function setNodeText(somPath, value) {
        try {
            var node = window.CustomFormRules.xfa.resolveNode(somPath);
            if (!node) {
                return false;
            }
            node.rawValue = value;
            return true;
        } catch (e) {
            window.console.warn("[xfa-form] setNodeText failed for path:", somPath, e);
            return false;
        }
    };

    /**
     * @name getNodeProperty
     * @function
     * @description Reads any property from an XFA node by SOM path.
     * @param {string} somPath - The SOM path to the XFA node.
     * @param {string} propertyName - The name of the property to read.
     * @return {*} The property value, or null if the operation fails.
     * @example
     * // Read the access property of a field
     * var access = window.CustomFormRules.xfa.getNodeProperty(
     *     "xfa.form.#subform[0].#field[0]",
     *     "access"
     * );
     * console.log("Field access:", access);
     */
    window.CustomFormRules.xfa.getNodeProperty = function getNodeProperty(somPath, propertyName) {
        try {
            if (!propertyName || typeof propertyName !== "string") {
                return null;
            }
            var node = window.CustomFormRules.xfa.resolveNode(somPath);
            if (!node) {
                return null;
            }
            var value = node[propertyName];
            return value !== undefined ? value : null;
        } catch (e) {
            window.console.warn("[xfa-form] getNodeProperty failed for path:", somPath, "prop:", propertyName, e);
            return null;
        }
    };

    /**
     * @name setNodeProperty
     * @function
     * @description Sets any property on an XFA node by SOM path.
     * @param {string} somPath - The SOM path to the XFA node.
     * @param {string} propertyName - The name of the property to set.
     * @param {*} value - The value to assign to the property.
     * @return {boolean} True if the operation succeeded, false otherwise.
     * @example
     * // Set the access property of a field to "open"
     * var success = window.CustomFormRules.xfa.setNodeProperty(
     *     "xfa.form.#subform[0].#field[0]",
     *     "access",
     *     "open"
     * );
     * if (success) {
     *     console.log("Property updated successfully");
     * }
     */
    window.CustomFormRules.xfa.setNodeProperty = function setNodeProperty(somPath, propertyName, value) {
        try {
            if (!propertyName || typeof propertyName !== "string") {
                return false;
            }
            var node = window.CustomFormRules.xfa.resolveNode(somPath);
            if (!node) {
                return false;
            }
            node[propertyName] = value;
            return true;
        } catch (e) {
            window.console.warn("[xfa-form] setNodeProperty failed for path:", somPath, "prop:", propertyName, e);
            return false;
        }
    };

    /**
     * @name execFormCalculate
     * @function
     * @description Triggers a form-wide recalculation of all calculate scripts.
     * @return {boolean} True if the recalculation succeeded, false otherwise.
     * @example
     * // Trigger form recalculation after updating multiple fields
     * window.CustomFormRules.xfa.setNodeText("xfa.form.#subform[0].#field[0]", "100");
     * window.CustomFormRules.xfa.setNodeText("xfa.form.#subform[0].#field[1]", "200");
     * window.CustomFormRules.xfa.execFormCalculate();
     * console.log("Form recalculated");
     */
    window.CustomFormRules.xfa.execFormCalculate = function execFormCalculate() {
        try {
            xfa.form.execCalculate();
            return true;
        } catch (e) {
            window.console.warn("[xfa-form] execFormCalculate failed:", e);
            return false;
        }
    };

    /**
     * @name execFormValidate
     * @function
     * @description Triggers a form-wide validation of all validate scripts.
     * @return {boolean} True if the validation completed without throwing, false otherwise.
     * @example
     * // Validate all fields in the form
     * var isValid = window.CustomFormRules.xfa.execFormValidate();
     * if (isValid) {
     *     console.log("Form validation completed without errors");
     * }
     */
    window.CustomFormRules.xfa.execFormValidate = function execFormValidate() {
        try {
            xfa.form.execValidate();
            return true;
        } catch (e) {
            window.console.warn("[xfa-form] execFormValidate failed:", e);
            return false;
        }
    };

    /**
     * @name getInvalidFields
     * @function
     * @description Returns a list of fields that failed validation, including their SOM paths and error messages.
     * @return {Array<Object>} Array of objects with `somPath`, `name`, and `errorMessage` properties for each invalid field.
     * @example
     * // Get all fields that failed validation
     * var invalidFields = window.CustomFormRules.xfa.getInvalidFields();
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

    /**
     * @name getNodeClassName
     * @function
     * @description Gets the class name (XFA type) of a node by SOM path.
     * @param {string} somPath - The SOM path to the XFA node.
     * @return {string|null} The className of the node, or null if resolution fails.
     * @example
     * // Get the class name of a node to determine its type
     * var className = window.CustomFormRules.xfa.getNodeClassName("xfa.form.#subform[0].#field[0]");
     * console.log("Node type:", className); // e.g., "field", "subform", "button"
     */
    window.CustomFormRules.xfa.getNodeClassName = function getNodeClassName(somPath) {
        try {
            var node = window.CustomFormRules.xfa.resolveNode(somPath);
            if (!node) {
                return null;
            }
            return node.className || null;
        } catch (e) {
            window.console.warn("[xfa-form] getNodeClassName failed for path:", somPath, e);
            return null;
        }
    };

})(window);
