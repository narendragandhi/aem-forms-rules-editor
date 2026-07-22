/**
 * XFA Field Operation Helpers
 *
 * Provides utility functions for common XFA field operations
 * within the IC fragment code editor. All functions are attached
 * to the window.CustomFormRules.xfa namespace and use defensive
 * try/catch blocks for safe XFA API access.
 *
 * @namespace window.CustomFormRules.xfa
 */
(function (window) {
    "use strict";

    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * Safe rawValue read with null handling.
     * Returns the rawValue of the field resolved from the given SOM path,
     * or null if the field cannot be found or an error occurs.
     *
     * @name getFieldValue
     * @function
     * @param {string} somPath - The SOM path of the target field (e.g., "xfa.form.page1.field1").
     * @return {string|null} The rawValue of the field, or null if unavailable.
     * @example
     * var value = xfa.getFieldValue("xfa.form.page1.field1");
     * if (value !== null) {
     *     xfa.host.messageBox("Value: " + value);
     * }
     */
    window.CustomFormRules.xfa.getFieldValue = function (somPath) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return null;
            }
            return field.rawValue;
        } catch (e) {
            return null;
        }
    };

    /**
     * Safe rawValue write with null handling.
     * Sets the rawValue of the field resolved from the given SOM path.
     * Returns true if the write succeeded, false otherwise.
     *
     * @name setFieldValue
     * @function
     * @param {string} somPath - The SOM path of the target field (e.g., "xfa.form.page1.field1").
     * @param {*} value - The value to set on the field's rawValue.
     * @return {boolean} True if the value was set successfully, false otherwise.
     * @example
     * var success = xfa.setFieldValue("xfa.form.page1.field1", "Hello World");
     * if (success) {
     *     xfa.host.messageBox("Field updated successfully.");
     * } else {
     *     xfa.host.messageBox("Failed to update field.");
     * }
     */
    window.CustomFormRules.xfa.setFieldValue = function (somPath, value) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return false;
            }
            field.rawValue = value;
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Set the presence property of a field.
     * Controls whether a field is visible, hidden, or invisible.
     *
     * @name setFieldPresence
     * @function
     * @param {string} somPath - The SOM path of the target field.
     * @param {string} presence - The desired presence value: "visible", "hidden", or "invisible".
     * @return {boolean} True if the presence was set successfully, false otherwise.
     * @example
     * xfa.setFieldPresence("xfa.form.page1.header", "visible");
     * xfa.setFieldPresence("xfa.form.page1.secretField", "hidden");
     * xfa.setFieldPresence("xfa.form.page1.placeholder", "invisible");
     */
    window.CustomFormRules.xfa.setFieldPresence = function (somPath, presence) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return false;
            }
            field.presence = presence;
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Set the access property of a field.
     * Controls the interaction mode of a field.
     *
     * @name setFieldAccess
     * @function
     * @param {string} somPath - The SOM path of the target field.
     * @param {string} access - The desired access value: "open", "protected", "readOnly", or "nonInteractive".
     * @return {boolean} True if the access was set successfully, false otherwise.
     * @example
     * xfa.setFieldAccess("xfa.form.page1.name", "open");
     * xfa.setFieldAccess("xfa.form.page1.readOnlyField", "readOnly");
     * xfa.setFieldAccess("xfa.form.page1.printOnly", "nonInteractive");
     */
    window.CustomFormRules.xfa.setFieldAccess = function (somPath, access) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return false;
            }
            field.access = access;
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Set the mandatory (nullTest) property of a field.
     * Controls the null validation behavior of a field.
     *
     * @name setFieldMandatory
     * @function
     * @param {string} somPath - The SOM path of the target field.
     * @param {string} mandatory - The desired nullTest value: "disabled", "error", or "warning".
     * @return {boolean} True if the mandatory property was set successfully, false otherwise.
     * @example
     * xfa.setFieldMandatory("xfa.form.page1.email", "error");
     * xfa.setFieldMandatory("xfa.form.page1.phone", "warning");
     * xfa.setFieldMandatory("xfa.form.page1.notes", "disabled");
     */
    window.CustomFormRules.xfa.setFieldMandatory = function (somPath, mandatory) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return false;
            }
            field.nullTest = mandatory;
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Clear a field by setting its rawValue to an empty string.
     *
     * @name clearField
     * @function
     * @param {string} somPath - The SOM path of the target field.
     * @return {boolean} True if the field was cleared successfully, false otherwise.
     * @example
     * xfa.clearField("xfa.form.page1.comments");
     * xfa.clearField("xfa.form.page1.searchBox");
     */
    window.CustomFormRules.xfa.clearField = function (somPath) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return false;
            }
            field.rawValue = "";
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Check if a field exists by resolving the given SOM path.
     * Returns true if the field resolves to a non-null object, false otherwise.
     *
     * @name fieldExists
     * @function
     * @param {string} somPath - The SOM path to check (e.g., "xfa.form.page1.field1").
     * @return {boolean} True if the field exists and resolves, false otherwise.
     * @example
     * if (xfa.fieldExists("xfa.form.page1.optionalField")) {
     *     xfa.setFieldValue("xfa.form.page1.optionalField", "Found it!");
     * } else {
     *     xfa.host.messageBox("Field does not exist.");
     * }
     */
    window.CustomFormRules.xfa.fieldExists = function (somPath) {
        try {
            var field = xfa.resolveNode(somPath);
            return field !== null;
        } catch (e) {
            return false;
        }
    };

    /**
     * Copy the rawValue from one field to another.
     * Both fields are resolved from their respective SOM paths.
     * Returns true if the copy succeeded, false if either field is not found.
     *
     * @name copyFieldValue
     * @function
     * @param {string} sourceSomPath - The SOM path of the source field to copy from.
     * @param {string} targetSomPath - The SOM path of the target field to copy to.
     * @return {boolean} True if the value was copied successfully, false otherwise.
     * @example
     * var copied = xfa.copyFieldValue(
     *     "xfa.form.page1.firstName",
     *     "xfa.form.page2.firstName"
     * );
     * if (!copied) {
     *     xfa.host.messageBox("Copy failed: source or target not found.");
     * }
     */
    window.CustomFormRules.xfa.copyFieldValue = function (sourceSomPath, targetSomPath) {
        try {
            var source = xfa.resolveNode(sourceSomPath);
            var target = xfa.resolveNode(targetSomPath);
            if (source === null || target === null) {
                return false;
            }
            target.rawValue = source.rawValue;
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Check if a field's presence is set to "visible".
     * Returns true if the field is visible, false if hidden, invisible, or if the
     * field cannot be found.
     *
     * @name isFieldVisible
     * @function
     * @param {string} somPath - The SOM path of the target field.
     * @return {boolean} True if the field presence is "visible", false otherwise.
     * @example
     * if (xfa.isFieldVisible("xfa.form.page1.totalAmount")) {
     *     xfa.host.messageBox("The total amount field is visible.");
     * } else {
     *     xfa.setFieldPresence("xfa.form.page1.totalAmount", "visible");
     * }
     */
    window.CustomFormRules.xfa.isFieldVisible = function (somPath) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return false;
            }
            return field.presence === "visible";
        } catch (e) {
            return false;
        }
    };

    /**
     * Check if a field's access is set to "readOnly" or "protected".
     * Returns true if the field is either readOnly or protected, false otherwise.
     *
     * @name isFieldReadOnly
     * @function
     * @param {string} somPath - The SOM path of the target field.
     * @return {boolean} True if the field access is "readOnly" or "protected", false otherwise.
     * @example
     * if (xfa.isFieldReadOnly("xfa.form.page1.accountNumber")) {
     *     xfa.host.messageBox("Account number is read-only.");
     * } else {
     *     xfa.setFieldAccess("xfa.form.page1.accountNumber", "readOnly");
     * }
     */
    window.CustomFormRules.xfa.isFieldReadOnly = function (somPath) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return false;
            }
            return field.access === "readOnly" || field.access === "protected";
        } catch (e) {
            return false;
        }
    };

    /**
     * Get the className of a field object.
     * Returns the internal XFA class name of the resolved field, or null if the
     * field cannot be found.
     *
     * @name getFieldClassName
     * @function
     * @param {string} somPath - The SOM path of the target field.
     * @return {string|null} The className of the field, or null if unavailable.
     * @example
     * var className = xfa.getFieldClassName("xfa.form.page1.textField1");
     * if (className === "field") {
     *     xfa.host.messageBox("The element is a field.");
     * }
     */
    window.CustomFormRules.xfa.getFieldClassName = function (somPath) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return null;
            }
            return field.className;
        } catch (e) {
            return null;
        }
    };

    /**
     * Change the fill color of a field to highlight it.
     * Sets the fill color using an RGB value. Pass null or an empty string as
     * the color parameter to clear the highlight.
     *
     * @name setFieldHighlight
     * @function
     * @param {string} somPath - The SOM path of the target field.
     * @param {string|null} fillColor - The hex fill color (e.g., "FFFF00" for yellow).
     *   Pass null or empty string to clear the highlight.
     * @return {boolean} True if the highlight was applied successfully, false otherwise.
     * @example
     * xfa.setFieldHighlight("xfa.form.page1.errorField", "FF0000");
     * xfa.setFieldHighlight("xfa.form.page1.successField", "00FF00");
     * xfa.setFieldHighlight("xfa.form.page1.highlightedField", "FFFF00");
     * xfa.setFieldHighlight("xfa.form.page1.errorField", null);
     */
    window.CustomFormRules.xfa.setFieldHighlight = function (somPath, fillColor) {
        try {
            var field = xfa.resolveNode(somPath);
            if (field === null) {
                return false;
            }
            var fill = field.fill;
            if (fill === null) {
                return false;
            }
            if (fillColor === null || fillColor === "") {
                fill.color = "";
            } else {
                fill.color = fillColor;
            }
            return true;
        } catch (e) {
            return false;
        }
    };

})(window);
