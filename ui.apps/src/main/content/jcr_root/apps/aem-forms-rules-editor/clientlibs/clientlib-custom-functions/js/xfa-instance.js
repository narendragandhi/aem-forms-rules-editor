(function (window) {
    "use strict";
    window.CustomFormRules = window.CustomFormRules || {};
    window.CustomFormRules.xfa = window.CustomFormRules.xfa || {};

    /**
     * Safe wrapper for instanceManager.addInstance(). Adds a new instance
     * to the end of the repeated element's instance collection.
     *
     * @name addInstance
     * @function
     * @param {string} somExpression - SOM expression that resolves to the instance manager,
     *   e.g. "form1.page1.subform1.repeatableSubform[0]"
     * @return {boolean} true if the instance was added successfully, false otherwise
     *
     * @example
     * // Add a new row to a repeatable subform
     * var added = CustomFormRules.xfa.addInstance("form1.body.table.row");
     * if (added) {
     *     xfa.host.messageBox("Row added successfully.");
     * } else {
     *     xfa.host.messageBox("Failed to add row.");
     * }
     */
    window.CustomFormRules.xfa.addInstance = function (somExpression) {
        try {
            var instanceManager = xfa.resolveNode(somExpression);
            if (!instanceManager || typeof instanceManager.addInstance !== "function") {
                return false;
            }
            instanceManager.addInstance(1);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Safe wrapper for instanceManager.removeInstance(index). Removes a single
     * instance at the given zero-based index from the repeated element.
     *
     * @name removeInstance
     * @function
     * @param {string} somExpression - SOM expression that resolves to the instance manager,
     *   e.g. "form1.page1.subform1.repeatableSubform[0]"
     * @param {number} index - Zero-based index of the instance to remove
     * @return {boolean} true if the instance was removed successfully, false otherwise
     *
     * @example
     * // Remove the third row from a repeatable table
     * var removed = CustomFormRules.xfa.removeInstance("form1.body.table.row", 2);
     * if (removed) {
     *     xfa.host.messageBox("Row removed.");
     * } else {
     *     xfa.host.messageBox("Failed to remove row. Check the index.");
     * }
     */
    window.CustomFormRules.xfa.removeInstance = function (somExpression, index) {
        try {
            var instanceManager = xfa.resolveNode(somExpression);
            if (!instanceManager || typeof instanceManager.removeInstance !== "function") {
                return false;
            }
            if (index < 0 || index >= instanceManager.count) {
                return false;
            }
            instanceManager.removeInstance(index);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Safe wrapper for instanceManager.insertInstance(index). Inserts a new
     * instance before the specified zero-based index in the repeated element.
     *
     * @name insertInstance
     * @function
     * @param {string} somExpression - SOM expression that resolves to the instance manager,
     *   e.g. "form1.page1.subform1.repeatableSubform[0]"
     * @param {number} index - Zero-based index at which to insert the new instance
     * @return {boolean} true if the instance was inserted successfully, false otherwise
     *
     * @example
     * // Insert a new row before index 1 (second position)
     * var inserted = CustomFormRules.xfa.insertInstance("form1.body.table.row", 1);
     * if (inserted) {
     *     xfa.host.messageBox("Row inserted at position 2.");
     * } else {
     *     xfa.host.messageBox("Failed to insert row.");
     * }
     */
    window.CustomFormRules.xfa.insertInstance = function (somExpression, index) {
        try {
            var instanceManager = xfa.resolveNode(somExpression);
            if (!instanceManager || typeof instanceManager.insertInstance !== "function") {
                return false;
            }
            if (index < 0 || index > instanceManager.count) {
                return false;
            }
            instanceManager.insertInstance(index, 1);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Get the current number of instances managed by the given instance manager.
     *
     * @name getInstanceCount
     * @function
     * @param {string} somExpression - SOM expression that resolves to the instance manager
     * @return {number} the number of instances, or -1 if the instance manager could not be resolved
     *
     * @example
     * // Get the number of rows currently in a repeatable table
     * var count = CustomFormRules.xfa.getInstanceCount("form1.body.table.row");
     * xfa.host.messageBox("Current row count: " + count);
     */
    window.CustomFormRules.xfa.getInstanceCount = function (somExpression) {
        try {
            var instanceManager = xfa.resolveNode(somExpression);
            if (!instanceManager) {
                return -1;
            }
            return instanceManager.count;
        } catch (e) {
            return -1;
        }
    };

    /**
     * Set the instance collection to an exact count using setInstances().
     * If the target count is larger than the current count, new instances are
     * appended. If smaller, excess instances are removed from the end.
     *
     * @name setInstanceCount
     * @function
     * @param {string} somExpression - SOM expression that resolves to the instance manager
     * @param {number} targetCount - Desired number of instances (must be >= 1)
     * @return {boolean} true if the count was set successfully, false otherwise
     *
     * @example
     * // Ensure exactly 5 rows exist in the repeatable table
     * var success = CustomFormRules.xfa.setInstanceCount("form1.body.table.row", 5);
     * if (success) {
     *     var currentCount = CustomFormRules.xfa.getInstanceCount("form1.body.table.row");
     *     xfa.host.messageBox("Table now has " + currentCount + " rows.");
     * }
     */
    window.CustomFormRules.xfa.setInstanceCount = function (somExpression, targetCount) {
        try {
            if (typeof targetCount !== "number" || targetCount < 1) {
                return false;
            }
            var instanceManager = xfa.resolveNode(somExpression);
            if (!instanceManager || typeof instanceManager.setInstances !== "function") {
                return false;
            }
            instanceManager.setInstances(targetCount);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Retrieve the value of a field within the last instance of a repeated element.
     * Useful for reading the most recently added row's data.
     *
     * @name getLastInstanceField
     * @function
     * @param {string} instanceManagerSom - SOM expression that resolves to the instance manager
     * @param {string} fieldName - Name of the field relative to each instance subform,
     *   e.g. "txtName" or "dateValue"
     * @return {string|null} the rawValue of the field, or null if it could not be resolved
     *
     * @example
     * // Get the name field from the last row of a table
     * var lastName = CustomFormRules.xfa.getLastInstanceField("form1.body.table.row", "txtName");
     * if (lastName !== null) {
     *     xfa.host.messageBox("Last entered name: " + lastName);
     * } else {
     *     xfa.host.messageBox("No rows found or field not accessible.");
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
     * Remove all instances except the first one, effectively resetting the
     * repeated element to a single instance while preserving the template.
     *
     * @name clearAllInstances
     * @function
     * @param {string} somExpression - SOM expression that resolves to the instance manager
     * @return {boolean} true if all extra instances were removed, false on error
     *
     * @example
     * // Clear all rows except the first one from a repeatable table
     * var cleared = CustomFormRules.xfa.clearAllInstances("form1.body.table.row");
     * if (cleared) {
     *     xfa.host.messageBox("Table reset to a single row.");
     * } else {
     *     xfa.host.messageBox("Failed to clear rows.");
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

    /**
     * Resolve an instanceManager from a SOM path. Returns the raw instance
     * manager node so callers can perform advanced operations not covered
     * by the other helpers.
     *
     * @name getInstanceManager
     * @function
     * @param {string} somExpression - SOM expression that resolves to the instance manager
     * @return {object|null} the XFA instance manager node, or null if not found
     *
     * @example
     * // Resolve and inspect an instance manager directly
     * var mgr = CustomFormRules.xfa.getInstanceManager("form1.body.table.row");
     * if (mgr) {
     *     xfa.host.messageBox(
     *         "Instance count: " + mgr.count +
     *         ", max: " + mgr.max +
     *         ", min: " + mgr.min
     *     );
     * } else {
     *     xfa.host.messageBox("Could not resolve instance manager.");
     * }
     */
    window.CustomFormRules.xfa.getInstanceManager = function (somExpression) {
        try {
            var node = xfa.resolveNode(somExpression);
            if (!node) {
                return null;
            }
            return node;
        } catch (e) {
            return null;
        }
    };

})(window);
