/**
 * Correspondence Management functions for AEM Forms Rules Editor.
 * Provides letter template management, correspondence generation,
 * data dictionary lookup, and correspondence history.
 *
 * @namespace CustomFormRules.correspondence
 */

(function() {
    'use strict';

    var CM_API = '/bin/rules-api/correspondence';

    /**
     * Fetch JSON from the Correspondence Management API.
     * @private
     * @param {string} url - The API endpoint URL.
     * @returns {Promise<Object>} Parsed JSON response.
     */
    function cmFetch(url) {
        return fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }).then(function(resp) {
            if (!resp.ok) throw new Error('CM API returned status ' + resp.status);
            return resp.json();
        });
    }

    /**
     * POST to the Correspondence Management API.
     * @private
     * @param {string} url - The API endpoint URL.
     * @returns {Promise<Object>} Parsed JSON response.
     */
    function cmPost(url) {
        return fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }).then(function(resp) {
            if (!resp.ok) throw new Error('CM API returned status ' + resp.status);
            return resp.json();
        });
    }

    /**
     * List all available letter templates.
     * Returns an array of template objects with id, name, category, and status.
     *
     * @name listLetterTemplates
     * @function
     * @returns {Promise<Array>} Array of letter template objects.
     * @example
     * var templates = CustomFormRules.correspondence.listLetterTemplates();
     * templates.then(function(tpls) {
     *     console.log('Available templates:', tpls.length);
     * });
     */
    window.CustomFormRules.correspondence = window.CustomFormRules.correspondence || {};
    window.CustomFormRules.correspondence.listLetterTemplates = function() {
        return cmFetch(CM_API + '?action=list-templates').then(function(data) {
            return data.templates || [];
        });
    };

    /**
     * Get a specific letter template by ID.
     *
     * @name getLetterTemplate
     * @function
     * @param {string} templateId - The template ID (e.g. 'LETTER-001').
     * @returns {Promise<Object>} Template object with id, name, category, bodyTemplate.
     * @example
     * var tpl = CustomFormRules.correspondence.getLetterTemplate('LETTER-001');
     * tpl.then(function(t) { console.log(t.name); });
     */
    window.CustomFormRules.correspondence.getLetterTemplate = function(templateId) {
        if (!templateId) throw new Error('templateId is required');
        return cmFetch(CM_API + '?action=get-template&templateId=' + encodeURIComponent(templateId));
    };

    /**
     * List all available data dictionaries.
     * Returns an array of dictionary names with entry counts.
     *
     * @name listDataDictionaries
     * @function
     * @returns {Promise<Array>} Array of dictionary info objects.
     * @example
     * var dicts = CustomFormRules.correspondence.listDataDictionaries();
     * dicts.then(function(d) { console.log(d); });
     */
    window.CustomFormRules.correspondence.listDataDictionaries = function() {
        return cmFetch(CM_API + '?action=list-dictionaries').then(function(data) {
            return data.dictionaries || [];
        });
    };

    /**
     * Look up a value in a data dictionary.
     * If key is provided, returns the single value. If omitted, returns all entries.
     *
     * @name lookupDataDictionary
     * @function
     * @param {string} dictionaryName - The dictionary name (e.g. 'us-states', 'currencies').
     * @param {string} [key] - Optional key to look up (e.g. 'CA').
     * @returns {Promise<Object>} Dictionary entries or a single key-value pair.
     * @example
     * var val = CustomFormRules.correspondence.lookupDataDictionary('us-states', 'CA');
     * val.then(function(v) { console.log(v.value); }); // 'California'
     */
    window.CustomFormRules.correspondence.lookupDataDictionary = function(dictionaryName, key) {
        if (!dictionaryName) throw new Error('dictionaryName is required');
        var url = CM_API + '?action=lookup-dictionary&dictionary=' + encodeURIComponent(dictionaryName);
        if (key) url += '&key=' + encodeURIComponent(key);
        return cmFetch(url);
    };

    /**
     * Generate a correspondence from a letter template.
     * Creates a new correspondence record and adds it to the recipient's history.
     *
     * @name generateCorrespondence
     * @function
     * @param {string} templateId - The template ID to use.
     * @param {string} [recipientId] - Optional recipient identifier.
     * @returns {Promise<Object>} Generated correspondence object with correspondenceId.
     * @example
     * var corr = CustomFormRules.correspondence.generateCorrespondence('LETTER-001', 'CUST-12345');
     * corr.then(function(c) { console.log('Generated:', c.correspondenceId); });
     */
    window.CustomFormRules.correspondence.generateCorrespondence = function(templateId, recipientId) {
        if (!templateId) throw new Error('templateId is required');
        var url = CM_API + '?action=generate&templateId=' + encodeURIComponent(templateId);
        if (recipientId) url += '&recipientId=' + encodeURIComponent(recipientId);
        return cmPost(url);
    };

    /**
     * Preview a letter template with placeholder data.
     * Returns the template content with a preview indicator.
     *
     * @name previewCorrespondence
     * @function
     * @param {string} templateId - The template ID to preview.
     * @returns {Promise<Object>} Template preview object.
     * @example
     * var preview = CustomFormRules.correspondence.previewCorrespondence('LETTER-003');
     * preview.then(function(p) { console.log(p.bodyTemplate); });
     */
    window.CustomFormRules.correspondence.previewCorrespondence = function(templateId) {
        if (!templateId) throw new Error('templateId is required');
        return cmPost(CM_API + '?action=preview&templateId=' + encodeURIComponent(templateId));
    };

    /**
     * Get correspondence history for a specific recipient.
     *
     * @name getCorrespondenceHistory
     * @function
     * @param {string} recipientId - The recipient identifier.
     * @returns {Promise<Object>} History object with array of correspondence records.
     * @example
     * var hist = CustomFormRules.correspondence.getCorrespondenceHistory('CUST-12345');
     * hist.then(function(h) { console.log('Total sent:', h.total); });
     */
    window.CustomFormRules.correspondence.getCorrespondenceHistory = function(recipientId) {
        if (!recipientId) throw new Error('recipientId is required');
        return cmFetch(CM_API + '?action=history&recipientId=' + encodeURIComponent(recipientId));
    };

    /**
     * Resolve template placeholders with actual data values.
     * Replaces {{key}} placeholders in a template string with values from a data object.
     *
     * @name resolveTemplate
     * @function
     * @param {string} templateString - Template with {{key}} placeholders.
     * @param {Object} data - Key-value pairs for substitution.
     * @returns {string} Resolved string with placeholders replaced.
     * @example
     * var resolved = CustomFormRules.correspondence.resolveTemplate(
     *     'Hello {{firstName}}, your balance is ${{balance}}.',
     *     { firstName: 'John', balance: '1250.00' }
     * );
     * // Returns: 'Hello John, your balance is $1250.00.'
     */
    window.CustomFormRules.correspondence.resolveTemplate = function(templateString, data) {
        if (!templateString || !data) return templateString || '';
        var result = templateString;
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var placeholder = '{{' + keys[i] + '}}';
            result = result.split(placeholder).join(data[keys[i]]);
        }
        return result;
    };

    /**
     * Batch generate correspondences for multiple recipients.
     * Generates a correspondence for each recipient using the same template.
     *
     * @name batchGenerateCorrespondence
     * @function
     * @param {string} templateId - The template ID to use for all.
     * @param {Array<string>} recipientIds - Array of recipient identifiers.
     * @returns {Promise<Array>} Array of generated correspondence objects.
     * @example
     * var batch = CustomFormRules.correspondence.batchGenerateCorrespondence(
     *     'LETTER-001', ['CUST-001', 'CUST-002', 'CUST-003']
     * );
     * batch.then(function(results) { console.log('Generated:', results.length); });
     */
    window.CustomFormRules.correspondence.batchGenerateCorrespondence = function(templateId, recipientIds) {
        if (!templateId) throw new Error('templateId is required');
        if (!recipientIds || !recipientIds.length) throw new Error('recipientIds array is required');

        var promises = [];
        for (var i = 0; i < recipientIds.length; i++) {
            promises.push(
                window.CustomFormRules.correspondence.generateCorrespondence(templateId, recipientIds[i])
            );
        }
        return Promise.all(promises);
    };

    /**
     * Get template categories.
     * Returns a deduplicated list of categories from all available templates.
     *
     * @name getTemplateCategories
     * @function
     * @returns {Promise<Array<string>>} Array of unique category strings.
     * @example
     * var cats = CustomFormRules.correspondence.getTemplateCategories();
     * cats.then(function(c) { console.log(c); }); // ['customer-onboarding', 'financial', ...]
     */
    window.CustomFormRules.correspondence.getTemplateCategories = function() {
        return window.CustomFormRules.correspondence.listLetterTemplates().then(function(templates) {
            var seen = {};
            var categories = [];
            for (var i = 0; i < templates.length; i++) {
                var cat = templates[i].category;
                if (cat && !seen[cat]) {
                    seen[cat] = true;
                    categories.push(cat);
                }
            }
            return categories;
        });
    };

})();