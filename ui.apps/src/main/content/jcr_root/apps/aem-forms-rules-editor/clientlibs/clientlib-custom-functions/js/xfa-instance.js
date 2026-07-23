(function (window) {
    "use strict";
    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * Retrieve the value of a field within the last instance of a repeated element.
     * @name getLastInstanceField
     * @function
     * @param {string} instanceManagerSom - SOM expression that resolves to the instance manager
     * @param {string} fieldName - Name of the field relative to each instance subform
     * @return {string|null} the rawValue of the field, or null if it could not be resolved
     * @example
     * var lastName = CustomFormRules.xfa.getLastInstanceField("form1.body.table.row", "txtName");
     * if (lastName !== null) {
     *     xfa.host.messageBox("Last entered name: " + lastName);
     * }
     */
    window.CustomFormRules.xfa.getLastInstanceField = function (instanceManagerSom, fieldName) {
        try {
            var instanceManager = xfa.resolveNode(instanceManagerSom);
            if (!instanceManager || instanceManager.count === 0) {
                return null;
            }
            var lastIndex = instanceManager.count - 1;
            var instance = instanceManager.resolveNode("[" + lastIndex + "]");
            if (!instance) {
                return null;
            }
            var field = instance.resolveNode(fieldName);
            if (!field) {
                return null;
            }
            return field.rawValue !== undefined ? field.rawValue : null;
        } catch (e) {
            return null;
        }
    };

    /**
     * Remove all instances except the first one, resetting the repeated element to a single instance.
     * @name clearAllInstances
     * @function
     * @param {string} somExpression - SOM expression that resolves to the instance manager
     * @return {boolean} true if all extra instances were removed, false on error
     * @example
     * var cleared = CustomFormRules.xfa.clearAllInstances("form1.body.table.row");
     * if (cleared) {
     *     xfa.host.messageBox("Table reset to a single row.");
     * }
     */
    window.CustomFormRules.xfa.clearAllInstances = function (somExpression) {
        try {
            var instanceManager = xfa.resolveNode(somExpression);
            if (!instanceManager || typeof instanceManager.removeInstance !== "function") {
                return false;
            }
            var count = instanceManager.count;
            for (var i = count - 1; i >= 1; i--) {
                instanceManager.removeInstance(i);
            }
            return true;
        } catch (e) {
            return false;
        }
    };

})(window);
