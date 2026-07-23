/**
 * Forms Portal Prefill functions for AEM Forms Rules Editor.
 * Provides form listing, metadata retrieval, draft management,
 * prefill data loading, and form analytics.
 *
 * @namespace CustomFormRules.formsPortal
 */

(function() {
    'use strict';

    var FP_API = '/bin/rules-api/forms-portal';

    /**
     * Fetch JSON from the Forms Portal API.
     * @private
     * @param {string} url - The API endpoint URL.
     * @returns {Promise<Object>} Parsed JSON response.
     */
    function fpFetch(url) {
        return fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }).then(function(resp) {
            if (!resp.ok) throw new Error('Forms Portal API returned status ' + resp.status);
            return resp.json();
        });
    }

    /**
     * POST to the Forms Portal API.
     * @private
     * @param {string} url - The API endpoint URL.
     * @returns {Promise<Object>} Parsed JSON response.
     */
    function fpPost(url) {
        return fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }).then(function(resp) {
            if (!resp.ok) throw new Error('Forms Portal API returned status ' + resp.status);
            return resp.json();
        });
    }

    /**
     * DELETE via the Forms Portal API.
     * @private
     * @param {string} url - The API endpoint URL.
     * @returns {Promise<Object>} Parsed JSON response.
     */
    function fpDelete(url) {
        return fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }).then(function(resp) {
            if (!resp.ok) throw new Error('Forms Portal API returned status ' + resp.status);
            return resp.json();
        });
    }

    window.CustomFormRules.formsPortal = window.CustomFormRules.formsPortal || {};

    /**
     * List all available forms from the Forms Portal.
     * Supports optional filtering by category and status.
     *
     * @name listForms
     * @function
     * @param {Object} [filters] - Optional filters.
     * @param {string} [filters.category] - Filter by category (e.g. 'financial', 'hr').
     * @param {string} [filters.status] - Filter by status (e.g. 'active', 'inactive').
     * @returns {Promise<Array>} Array of form objects.
     * @example
     * var forms = CustomFormRules.formsPortal.listForms({ category: 'financial' });
     * forms.then(function(f) { console.log(f.length + ' forms found'); });
     */
    window.CustomFormRules.formsPortal.listForms = function(filters) {
        var url = FP_API + '?action=list-forms';
        if (filters) {
            if (filters.category) url += '&category=' + encodeURIComponent(filters.category);
            if (filters.status) url += '&status=' + encodeURIComponent(filters.status);
        }
        return fpFetch(url).then(function(data) {
            return data.forms || [];
        });
    };

    /**
     * Get metadata for a specific form.
     * Returns title, description, status, category, and configuration.
     *
     * @name getFormMetadata
     * @function
     * @param {string} formPath - The AEM form container path.
     * @returns {Promise<Object>} Form metadata object.
     * @example
     * var meta = CustomFormRules.formsPortal.getFormMetadata('/content/forms/af/loan-application');
     * meta.then(function(m) { console.log(m.title); });
     */
    window.CustomFormRules.formsPortal.getFormMetadata = function(formPath) {
        if (!formPath) throw new Error('formPath is required');
        return fpFetch(FP_API + '?action=get-form-metadata&formPath=' + encodeURIComponent(formPath));
    };

    /**
     * Save a form draft for a specific user.
     * Persists the current form data so the user can resume later.
     *
     * @name saveDraft
     * @function
     * @param {string} formPath - The AEM form container path.
     * @param {string} userId - The user identifier.
     * @param {string} data - The form data to save (JSON string).
     * @returns {Promise<Object>} Saved draft object with savedDate.
     * @example
     * var draft = CustomFormRules.formsPortal.saveDraft(
     *     '/content/forms/af/loan-application', 'user123', '{"name":"John"}'
     * );
     * draft.then(function(d) { console.log('Saved:', d.savedDate); });
     */
    window.CustomFormRules.formsPortal.saveDraft = function(formPath, userId, data) {
        if (!formPath) throw new Error('formPath is required');
        if (!userId) throw new Error('userId is required');
        var url = FP_API + '?action=save-draft&formPath=' + encodeURIComponent(formPath)
            + '&userId=' + encodeURIComponent(userId);
        if (data) url += '&data=' + encodeURIComponent(data);
        return fpPost(url);
    };

    /**
     * Retrieve a saved form draft.
     *
     * @name getDraft
     * @function
     * @param {string} formPath - The AEM form container path.
     * @param {string} userId - The user identifier.
     * @returns {Promise<Object>} Draft object with saved data.
     * @example
     * var draft = CustomFormRules.formsPortal.getDraft('/content/forms/af/loan-application', 'user123');
     * draft.then(function(d) { console.log(d.data); });
     */
    window.CustomFormRules.formsPortal.getDraft = function(formPath, userId) {
        if (!formPath) throw new Error('formPath is required');
        if (!userId) throw new Error('userId is required');
        return fpFetch(FP_API + '?action=get-draft&formPath=' + encodeURIComponent(formPath)
            + '&userId=' + encodeURIComponent(userId));
    };

    /**
     * List all drafts for a specific user across all forms.
     *
     * @name listDrafts
     * @function
     * @param {string} userId - The user identifier.
     * @returns {Promise<Array>} Array of draft objects.
     * @example
     * var drafts = CustomFormRules.formsPortal.listDrafts('user123');
     * drafts.then(function(d) { console.log(d.length + ' drafts'); });
     */
    window.CustomFormRules.formsPortal.listDrafts = function(userId) {
        if (!userId) throw new Error('userId is required');
        return fpFetch(FP_API + '?action=list-drafts&userId=' + encodeURIComponent(userId))
            .then(function(data) {
                return data.drafts || [];
            });
    };

    /**
     * Delete a saved form draft.
     *
     * @name deleteDraft
     * @function
     * @param {string} formPath - The AEM form container path.
     * @param {string} userId - The user identifier.
     * @returns {Promise<Object>} Deletion confirmation.
     * @example
     * var result = CustomFormRules.formsPortal.deleteDraft('/content/forms/af/loan-application', 'user123');
     * result.then(function(r) { console.log(r.status); }); // 'deleted'
     */
    window.CustomFormRules.formsPortal.deleteDraft = function(formPath, userId) {
        if (!formPath) throw new Error('formPath is required');
        if (!userId) throw new Error('userId is required');
        return fpDelete(FP_API + '?action=delete-draft&formPath=' + encodeURIComponent(formPath)
            + '&userId=' + encodeURIComponent(userId));
    };

    /**
     * Get prefill data from a named data source.
     * Optionally filter to specific keys.
     *
     * @name getPrefillData
     * @function
     * @param {string} source - The prefill source name (e.g. 'user-profile', 'customer-data').
     * @param {string|Array<string>} [keys] - Optional specific keys to retrieve.
     * @returns {Promise<Object>} Prefill data object.
     * @example
     * var data = CustomFormRules.formsPortal.getPrefillData('user-profile');
     * data.then(function(d) { console.log(d.data.firstName); }); // 'John'
     *
     * var filtered = CustomFormRules.formsPortal.getPrefillData('user-profile', ['email', 'phone']);
     * filtered.then(function(d) { console.log(d.data); }); // { email: '...', phone: '...' }
     */
    window.CustomFormRules.formsPortal.getPrefillData = function(source, keys) {
        if (!source) throw new Error('source is required');
        var url = FP_API + '?action=prefill-data&source=' + encodeURIComponent(source);
        if (keys) {
            var keysStr = Array.isArray(keys) ? keys.join(',') : keys;
            url += '&keys=' + encodeURIComponent(keysStr);
        }
        return fpFetch(url);
    };

    /**
     * List all available prefill data sources.
     *
     * @name listPrefillSources
     * @function
     * @returns {Promise<Array>} Array of source info objects.
     * @example
     * var sources = CustomFormRules.formsPortal.listPrefillSources();
     * sources.then(function(s) { console.log(s.length + ' sources'); });
     */
    window.CustomFormRules.formsPortal.listPrefillSources = function() {
        return fpFetch(FP_API + '?action=list-prefill-sources').then(function(data) {
            return data.sources || [];
        });
    };

    /**
     * Get submission analytics for a specific form or all forms.
     *
     * @name getFormAnalytics
     * @function
     * @param {string} [formPath] - Optional form path. If omitted, returns analytics for all forms.
     * @returns {Promise<Object>} Analytics object with submission counts and completion rates.
     * @example
     * var analytics = CustomFormRules.formsPortal.getFormAnalytics('/content/forms/af/loan-application');
     * analytics.then(function(a) { console.log(a.completionRate + '% completion'); });
     */
    window.CustomFormRules.formsPortal.getFormAnalytics = function(formPath) {
        var url = FP_API + '?action=analytics';
        if (formPath) url += '&formPath=' + encodeURIComponent(formPath);
        return fpFetch(url);
    };

    /**
     * Prefill a form by combining data from multiple sources.
     * Merges prefill data from user-profile, customer-data, and organization sources.
     *
     * @name prefillsFormFromMultipleSources
     * @function
     * @param {Array<string>} sources - Array of source names to merge.
     * @returns {Promise<Object>} Merged prefill data object.
     * @example
     * var data = CustomFormRules.formsPortal.prefillsFormFromMultipleSources(
     *     ['user-profile', 'organization']
     * );
     * data.then(function(d) { console.log(d.data); });
     */
    window.CustomFormRules.formsPortal.prefillsFormFromMultipleSources = function(sources) {
        if (!sources || !sources.length) throw new Error('sources array is required');

        var promises = [];
        for (var i = 0; i < sources.length; i++) {
            promises.push(
                window.CustomFormRules.formsPortal.getPrefillData(sources[i])
            );
        }

        return Promise.all(promises).then(function(results) {
            var merged = {};
            for (var j = 0; j < results.length; j++) {
                if (results[j] && results[j].data) {
                    var keys = Object.keys(results[j].data);
                    for (var k = 0; k < keys.length; k++) {
                        merged[keys[k]] = results[j].data[keys[k]];
                    }
                }
            }
            return { data: merged, sources: sources, valid: true };
        });
    };

    /**
     * Auto-save form data with debouncing.
     * Returns a function that, when called, schedules a draft save after the specified delay.
     *
     * @name createAutoSaver
     * @function
     * @param {string} formPath - The AEM form container path.
     * @param {string} userId - The user identifier.
     * @param {number} [delayMs=30000] - Debounce delay in milliseconds (default 30s).
     * @returns {Function} A function to trigger auto-save with current data.
     * @example
     * var autoSave = CustomFormRules.formsPortal.createAutoSaver(
     *     '/content/forms/af/loan-application', 'user123', 5000
     * );
     * // Call autoSave(jsonData) to trigger debounced save
     */
    window.CustomFormRules.formsPortal.createAutoSaver = function(formPath, userId, delayMs) {
        var delay = delayMs || 30000;
        var timer = null;

        return function(data) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(function() {
                window.CustomFormRules.formsPortal.saveDraft(formPath, userId, data)
                    .then(function(result) {
                        console.log('Auto-saved draft at', result.savedDate);
                    })
                    .catch(function(err) {
                        console.error('Auto-save failed:', err);
                    });
            }, delay);
        };
    };

    /**
     * Search forms by title or description.
     * Performs client-side filtering of available forms.
     *
     * @name searchForms
     * @function
     * @param {string} query - The search query.
     * @returns {Promise<Array>} Array of matching form objects.
     * @example
     * var results = CustomFormRules.formsPortal.searchForms('loan');
     * results.then(function(f) { console.log(f.length + ' matches'); });
     */
    window.CustomFormRules.formsPortal.searchForms = function(query) {
        if (!query) throw new Error('query is required');
        var lowerQuery = query.toLowerCase();

        return window.CustomFormRules.formsPortal.listForms().then(function(forms) {
            return forms.filter(function(form) {
                var title = (form.title || '').toLowerCase();
                var desc = (form.description || '').toLowerCase();
                return title.indexOf(lowerQuery) !== -1 || desc.indexOf(lowerQuery) !== -1;
            });
        });
    };

    /**
     * Check if a form has a saved draft for a specific user.
     *
     * @name hasDraft
     * @function
     * @param {string} formPath - The AEM form container path.
     * @param {string} userId - The user identifier.
     * @returns {Promise<boolean>} True if a draft exists.
     * @example
     * var exists = CustomFormRules.formsPortal.hasDraft('/content/forms/af/loan-application', 'user123');
     * exists.then(function(e) { if (e) console.log('Draft exists'); });
     */
    window.CustomFormRules.formsPortal.hasDraft = function(formPath, userId) {
        return window.CustomFormRules.formsPortal.getDraft(formPath, userId)
            .then(function() { return true; })
            .catch(function() { return false; });
    };

})();