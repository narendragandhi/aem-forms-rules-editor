/**
 * Document of Record (DoR) functions for AEM Forms Rules Editor.
 * Generates, retrieves, and manages PDF documents that serve as official records
 * of form submissions for archival and compliance purposes.
 *
 * @namespace CustomFormRules.documentOfRecord
 */

(function() {
    'use strict';

    var DOR_API = '/bin/rules-api/document-of-record';

    /**
     * Fetch JSON from the Document of Record API.
     * @private
     * @param {string} url - The API endpoint URL.
     * @returns {Promise<Object>} Parsed JSON response.
     */
    function dorFetch(url) {
        return fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }).then(function(resp) {
            if (!resp.ok) throw new Error('DoR API returned status ' + resp.status);
            return resp.json();
        });
    }

    /**
     * POST to the Document of Record API.
     * @private
     * @param {string} url - The API endpoint URL.
     * @returns {Promise<Object>} Parsed JSON response.
     */
    function dorPost(url) {
        return fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        }).then(function(resp) {
            if (!resp.ok) throw new Error('DoR API returned status ' + resp.status);
            return resp.json();
        });
    }

    window.CustomFormRules.documentOfRecord = window.CustomFormRules.documentOfRecord || {};

    /**
     * List all available Document of Record templates.
     *
     * @name listDoRTemplates
     * @function
     * @returns {Promise<Array>} Array of DoR template objects.
     * @example
     * var templates = CustomFormRules.documentOfRecord.listDoRTemplates();
     * templates.then(function(tpls) { console.log(tpls.length); });
     */
    window.CustomFormRules.documentOfRecord.listDoRTemplates = function() {
        return dorFetch(DOR_API + '?action=list-templates').then(function(data) {
            return data.templates || [];
        });
    };

    /**
     * Get a specific DoR template by ID.
     *
     * @name getDoRTemplate
     * @function
     * @param {string} templateId - The template ID (e.g. 'DOR-STD-001').
     * @returns {Promise<Object>} Template object.
     * @example
     * var tpl = CustomFormRules.documentOfRecord.getDoRTemplate('DOR-STD-001');
     * tpl.then(function(t) { console.log(t.name); });
     */
    window.CustomFormRules.documentOfRecord.getDoRTemplate = function(templateId) {
        if (!templateId) throw new Error('templateId is required');
        return dorFetch(DOR_API + '?action=get-template&templateId=' + encodeURIComponent(templateId));
    };

    /**
     * Generate a Document of Record from a form submission.
     * Creates a PDF snapshot of the form data for archival.
     *
     * @name generateDoR
     * @function
     * @param {string} templateId - The DoR template ID to use.
     * @param {string} formPath - The AEM form container path.
     * @param {string} [submissionId] - Optional submission identifier.
     * @returns {Promise<Object>} Generated DoR object with dorId and pdfUrl.
     * @example
     * var dor = CustomFormRules.documentOfRecord.generateDoR(
     *     'DOR-STD-001', '/content/forms/af/my-form', 'SUB-12345'
     * );
     * dor.then(function(d) { console.log('PDF:', d.pdfUrl); });
     */
    window.CustomFormRules.documentOfRecord.generateDoR = function(templateId, formPath, submissionId) {
        if (!templateId) throw new Error('templateId is required');
        if (!formPath) throw new Error('formPath is required');
        var url = DOR_API + '?action=generate&templateId=' + encodeURIComponent(templateId)
            + '&formPath=' + encodeURIComponent(formPath);
        if (submissionId) url += '&submissionId=' + encodeURIComponent(submissionId);
        return dorPost(url);
    };

    /**
     * Retrieve an existing Document of Record by ID.
     *
     * @name getDoR
     * @function
     * @param {string} dorId - The DoR identifier.
     * @returns {Promise<Object>} DoR object with metadata and pdfUrl.
     * @example
     * var dor = CustomFormRules.documentOfRecord.getDoR('DOR-1234567890');
     * dor.then(function(d) { console.log(d.status); });
     */
    window.CustomFormRules.documentOfRecord.getDoR = function(dorId) {
        if (!dorId) throw new Error('dorId is required');
        return dorFetch(DOR_API + '?action=get-dor&dorId=' + encodeURIComponent(dorId));
    };

    /**
     * List all generated Documents of Record, optionally filtered by form path.
     *
     * @name listDoRs
     * @function
     * @param {string} [formPath] - Optional form path to filter by.
     * @returns {Promise<Object>} Object with 'documents' array and 'total' count.
     * @example
     * var allDors = CustomFormRules.documentOfRecord.listDoRs();
     * allDors.then(function(d) { console.log(d.total); });
     */
    window.CustomFormRules.documentOfRecord.listDoRs = function(formPath) {
        var url = DOR_API + '?action=list-dors';
        if (formPath) url += '&formPath=' + encodeURIComponent(formPath);
        return dorFetch(url);
    };

    /**
     * Regenerate an existing Document of Record.
     * Creates a new version while preserving the original dorId.
     *
     * @name regenerateDoR
     * @function
     * @param {string} dorId - The DoR identifier to regenerate.
     * @returns {Promise<Object>} Updated DoR object with regenerationId.
     * @example
     * var updated = CustomFormRules.documentOfRecord.regenerateDoR('DOR-1234567890');
     * updated.then(function(d) { console.log(d.lastUpdated); });
     */
    window.CustomFormRules.documentOfRecord.regenerateDoR = function(dorId) {
        if (!dorId) throw new Error('dorId is required');
        return dorPost(DOR_API + '?action=regenerate&dorId=' + encodeURIComponent(dorId));
    };

    /**
     * Check the processing status of a Document of Record.
     *
     * @name getDoRStatus
     * @function
     * @param {string} dorId - The DoR identifier.
     * @returns {Promise<Object>} Status object with status and lastUpdated.
     * @example
     * var status = CustomFormRules.documentOfRecord.getDoRStatus('DOR-1234567890');
     * status.then(function(s) { console.log(s.status); }); // 'generated'
     */
    window.CustomFormRules.documentOfRecord.getDoRStatus = function(dorId) {
        if (!dorId) throw new Error('dorId is required');
        return dorFetch(DOR_API + '?action=status&dorId=' + encodeURIComponent(dorId));
    };

    /**
     * Auto-select the best DoR template for a given form path.
     * Returns the compliance template if the form path contains regulatory keywords,
     * the executive template for summary forms, or the standard template otherwise.
     *
     * @name autoSelectTemplate
     * @function
     * @param {string} formPath - The AEM form container path.
     * @returns {Promise<string>} The selected template ID.
     * @example
     * var templateId = CustomFormRules.documentOfRecord.autoSelectTemplate('/content/forms/af/tax-form');
     * templateId.then(function(id) { console.log(id); }); // 'DOR-STD-004' (compliance)
     */
    window.CustomFormRules.documentOfRecord.autoSelectTemplate = function(formPath) {
        if (!formPath) return Promise.resolve('DOR-STD-001');

        var pathLower = formPath.toLowerCase();

        return window.CustomFormRules.documentOfRecord.listDoRTemplates().then(function(templates) {
            // Compliance forms
            if (pathLower.indexOf('tax') !== -1 || pathLower.indexOf('compliance') !== -1 ||
                pathLower.indexOf('legal') !== -1 || pathLower.indexOf('regulatory') !== -1) {
                for (var i = 0; i < templates.length; i++) {
                    if (templates[i].style === 'compliance') return templates[i].id;
                }
            }
            // Executive/summary forms
            if (pathLower.indexOf('summary') !== -1 || pathLower.indexOf('executive') !== -1 ||
                pathLower.indexOf('dashboard') !== -1) {
                for (var j = 0; j < templates.length; j++) {
                    if (templates[j].style === 'executive') return templates[j].id;
                }
            }
            // Detailed forms
            if (pathLower.indexOf('detail') !== -1 || pathLower.indexOf('audit') !== -1) {
                for (var k = 0; k < templates.length; k++) {
                    if (templates[k].style === 'detailed') return templates[k].id;
                }
            }
            // Default
            return 'DOR-STD-001';
        });
    };

    /**
     * Generate a DoR using the auto-selected template for a form path.
     * Convenience function combining autoSelectTemplate and generateDoR.
     *
     * @name autoGenerateDoR
     * @function
     * @param {string} formPath - The AEM form container path.
     * @param {string} [submissionId] - Optional submission identifier.
     * @returns {Promise<Object>} Generated DoR object.
     * @example
     * var dor = CustomFormRules.documentOfRecord.autoGenerateDoR('/content/forms/af/loan-app');
     * dor.then(function(d) { console.log('PDF ready:', d.pdfUrl); });
     */
    window.CustomFormRules.documentOfRecord.autoGenerateDoR = function(formPath, submissionId) {
        if (!formPath) throw new Error('formPath is required');

        return window.CustomFormRules.documentOfRecord.autoSelectTemplate(formPath).then(function(templateId) {
            return window.CustomFormRules.documentOfRecord.generateDoR(templateId, formPath, submissionId);
        });
    };

})();