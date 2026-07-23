package com.adobe.aem.forms.rules.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Backend servlet for Forms Portal prefill integration.
 * Provides form listing, metadata retrieval, draft management, prefill data loading,
 * and form analytics capabilities.
 *
 * Forms Portal allows users to:
 * - Browse and search available forms
 * - Prefill form data from external sources
 * - Save and retrieve form drafts
 * - Track form submission analytics
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/forms-portal",
        "sling.servlet.methods=GET,POST,DELETE"
    }
)
@ServiceDescription("Forms Portal Prefill Servlet for AEM Forms Rules Editor")
public class FormsPortalPrefillServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(FormsPortalPrefillServlet.class);

    // Simulated form registry
    private static final Map<String, Map<String, Object>> FORM_REGISTRY = new LinkedHashMap<>();
    static {
        addForm("/content/forms/af/customer-registration", "Customer Registration Form", "Register new customers with contact details", "active", "customer");
        addForm("/content/forms/af/loan-application", "Loan Application Form", "Apply for personal or business loans", "active", "financial");
        addForm("/content/forms/af/employee-onboarding", "Employee Onboarding Form", "New employee setup and information collection", "active", "hr");
        addForm("/content/forms/af/feedback-survey", "Customer Feedback Survey", "Collect customer feedback and satisfaction ratings", "active", "marketing");
        addForm("/content/forms/af/invoice-submission", "Invoice Submission Form", "Submit invoices for processing and payment", "active", "finance");
        addForm("/content/forms/af/travel-request", "Travel Request Form", "Request business travel approvals", "active", "operations");
        addForm("/content/forms/af/expense-report", "Expense Report Form", "Submit expense reports with receipts", "active", "finance");
        addForm("/content/forms/af/it-support-ticket", "IT Support Ticket", "Create IT support requests", "active", "it");
        addForm("/content/forms/af/leave-request", "Leave Request Form", "Request time off or vacation", "active", "hr");
        addForm("/content/forms/af/vendor-registration", "Vendor Registration Form", "Register as an approved vendor", "inactive", "procurement");
    }

    private static void addForm(String path, String title, String description, String status, String category) {
        Map<String, Object> form = new LinkedHashMap<>();
        form.put("path", path);
        form.put("title", title);
        form.put("description", description);
        form.put("status", status);
        form.put("category", category);
        form.put("version", "1.0");
        form.put("createdDate", "2024-01-15");
        form.put("lastModified", "2024-06-20");
        form.put("author", "admin");
        form.put("submissionCount", 0);
        form.put("enableDraft", true);
        form.put("enablePrefill", true);
        FORM_REGISTRY.put(path, form);
    }

    // Simulated draft storage
    private static final Map<String, Map<String, Object>> DRAFT_STORAGE = new ConcurrentHashMap<>();

    // Simulated prefill data sources
    private static final Map<String, Map<String, Object>> PREFILL_SOURCES = new LinkedHashMap<>();
    static {
        // User profile prefill data
        Map<String, Object> userProfile = new LinkedHashMap<>();
        userProfile.put("firstName", "John");
        userProfile.put("lastName", "Doe");
        userProfile.put("email", "john.doe@example.com");
        userProfile.put("phone", "+1-555-0123");
        userProfile.put("company", "Acme Corp");
        userProfile.put("department", "Engineering");
        userProfile.put("employeeId", "EMP-001");
        PREFILL_SOURCES.put("user-profile", userProfile);

        // Customer data prefill
        Map<String, Object> customerData = new LinkedHashMap<>();
        customerData.put("customerId", "CUST-12345");
        customerData.put("customerName", "Acme Corporation");
        customerData.put("accountType", "Enterprise");
        customerData.put("creditLimit", "50000");
        customerData.put("paymentTerms", "Net 30");
        PREFILL_SOURCES.put("customer-data", customerData);

        // Organization data
        Map<String, Object> orgData = new LinkedHashMap<>();
        orgData.put("companyName", "Acme Corp");
        orgData.put("address", "123 Business Ave");
        orgData.put("city", "San Francisco");
        orgData.put("state", "CA");
        orgData.put("zip", "94105");
        orgData.put("country", "US");
        orgData.put("phone", "+1-555-0100");
        orgData.put("website", "https://acme.example.com");
        PREFILL_SOURCES.put("organization", orgData);

        // Recent transactions
        Map<String, Object> recentTxn = new LinkedHashMap<>();
        recentTxn.put("lastInvoiceDate", "2024-06-15");
        recentTxn.put("lastInvoiceAmount", "1250.00");
        recentTxn.put("outstandingBalance", "3750.00");
        recentTxn.put("lastPaymentDate", "2024-06-01");
        recentTxn.put("paymentMethod", "ACH Transfer");
        PREFILL_SOURCES.put("recent-transactions", recentTxn);
    }

    // Form submission analytics
    private static final Map<String, Map<String, Object>> FORM_ANALYTICS = new ConcurrentHashMap<>();
    static {
        addAnalytics("/content/forms/af/customer-registration", 245, 189, 56, 77.1);
        addAnalytics("/content/forms/af/loan-application", 132, 98, 34, 74.2);
        addAnalytics("/content/forms/af/employee-onboarding", 67, 67, 0, 100.0);
        addAnalytics("/content/forms/af/feedback-survey", 523, 487, 36, 93.1);
        addAnalytics("/content/forms/af/invoice-submission", 89, 82, 7, 92.1);
    }

    private static void addAnalytics(String formPath, int starts, int completions, int abandons, double completionRate) {
        Map<String, Object> analytics = new LinkedHashMap<>();
        analytics.put("formPath", formPath);
        analytics.put("totalStarts", starts);
        analytics.put("totalCompletions", completions);
        analytics.put("totalAbandons", abandons);
        analytics.put("completionRate", completionRate);
        analytics.put("avgCompletionTime", "4m 32s");
        analytics.put("lastSubmissionDate", "2024-06-20");
        FORM_ANALYTICS.put(formPath, analytics);
    }

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        if (action == null) action = "list-forms";

        LOG.info("FormsPortalPrefill: action={}", sanitize(action));

        switch (action) {
            case "list-forms":
                handleListForms(request, response);
                break;
            case "get-form-metadata":
                handleGetFormMetadata(request, response);
                break;
            case "get-draft":
                handleGetDraft(request, response);
                break;
            case "list-drafts":
                handleListDrafts(request, response);
                break;
            case "prefill-data":
                handleGetPrefillData(request, response);
                break;
            case "list-prefill-sources":
                handleListPrefillSources(response);
                break;
            case "analytics":
                handleGetAnalytics(request, response);
                break;
            case "delete-draft":
                handleDeleteDraft(request, response);
                break;
            case "save-draft":
                handleSaveDraft(request, response);
                break;
            case "prefill-form":
                handlePrefillForm(request, response);
                break;
            default:
                response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Unknown action: " + sanitize(action) + "\", \"valid\": false}");
        }
    }

    @Override
    protected void doPost(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        if (action == null) action = "save-draft";

        LOG.info("FormsPortalPrefill POST: action={}", sanitize(action));

        switch (action) {
            case "save-draft":
                handleSaveDraft(request, response);
                break;
            case "prefill-form":
                handlePrefillForm(request, response);
                break;
            default:
                response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Unknown action: " + sanitize(action) + "\", \"valid\": false}");
        }
    }

    @Override
    protected void doDelete(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        if (action == null) action = "delete-draft";

        LOG.info("FormsPortalPrefill DELETE: action={}", sanitize(action));

        switch (action) {
            case "delete-draft":
                handleDeleteDraft(request, response);
                break;
            default:
                response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Unknown action: " + sanitize(action) + "\", \"valid\": false}");
        }
    }

    private void handleListForms(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String category = request.getParameter("category");
        String status = request.getParameter("status");

        List<Map<String, Object>> forms = new ArrayList<>();
        for (Map.Entry<String, Map<String, Object>> entry : FORM_REGISTRY.entrySet()) {
            Map<String, Object> form = entry.getValue();
            boolean matchCategory = category == null || category.isEmpty() || category.equals(form.get("category"));
            boolean matchStatus = status == null || status.isEmpty() || status.equals(form.get("status"));
            if (matchCategory && matchStatus) {
                forms.add(form);
            }
        }

        StringBuilder json = new StringBuilder("{\"forms\": [");
        for (int i = 0; i < forms.size(); i++) {
            if (i > 0) json.append(",");
            json.append(mapToJson(forms.get(i)));
        }
        json.append("], \"total\": ").append(forms.size()).append(", \"valid\": true}");

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
    }

    private void handleGetFormMetadata(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String formPath = request.getParameter("formPath");
        if (formPath == null || formPath.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"formPath parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> form = FORM_REGISTRY.get(formPath.trim());
        if (form == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Form not found: " + sanitize(formPath) + "\", \"valid\": false}");
            return;
        }

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(form));
    }

    private void handleGetDraft(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String formPath = request.getParameter("formPath");
        String userId = request.getParameter("userId");

        if (formPath == null || formPath.isEmpty() || userId == null || userId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"formPath and userId parameters required.\", \"valid\": false}");
            return;
        }

        String draftKey = formPath.trim() + "|" + userId.trim();
        Map<String, Object> draft = DRAFT_STORAGE.get(draftKey);

        if (draft == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"No draft found for this form and user.\", \"valid\": false}");
            return;
        }

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(draft));
    }

    private void handleListDrafts(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String userId = request.getParameter("userId");

        if (userId == null || userId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"userId parameter required.\", \"valid\": false}");
            return;
        }

        List<Map<String, Object>> drafts = new ArrayList<>();
        for (Map.Entry<String, Map<String, Object>> entry : DRAFT_STORAGE.entrySet()) {
            if (entry.getKey().endsWith("|" + userId.trim())) {
                drafts.add(entry.getValue());
            }
        }

        StringBuilder json = new StringBuilder("{\"drafts\": [");
        for (int i = 0; i < drafts.size(); i++) {
            if (i > 0) json.append(",");
            json.append(mapToJson(drafts.get(i)));
        }
        json.append("], \"total\": ").append(drafts.size()).append(", \"valid\": true}");

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
    }

    private void handleSaveDraft(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String formPath = request.getParameter("formPath");
        String userId = request.getParameter("userId");
        String data = request.getParameter("data");

        if (formPath == null || formPath.isEmpty() || userId == null || userId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"formPath and userId parameters required.\", \"valid\": false}");
            return;
        }

        String draftKey = formPath.trim() + "|" + userId.trim();
        Map<String, Object> draft = new LinkedHashMap<>();
        draft.put("formPath", formPath.trim());
        draft.put("userId", userId.trim());
        draft.put("data", data != null ? data : "");
        draft.put("savedDate", java.time.Instant.now().toString());
        draft.put("status", "draft");
        draft.put("valid", true);

        DRAFT_STORAGE.put(draftKey, draft);

        LOG.info("Saved draft for form {} user {}", formPath, userId);

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(draft));
    }

    private void handleDeleteDraft(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String formPath = request.getParameter("formPath");
        String userId = request.getParameter("userId");

        if (formPath == null || formPath.isEmpty() || userId == null || userId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"formPath and userId parameters required.\", \"valid\": false}");
            return;
        }

        String draftKey = formPath.trim() + "|" + userId.trim();
        Map<String, Object> removed = DRAFT_STORAGE.remove(draftKey);

        if (removed == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"No draft found to delete.\", \"valid\": false}");
            return;
        }

        LOG.info("Deleted draft for form {} user {}", formPath, userId);

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write("{\"status\": \"deleted\", \"valid\": true}");
    }

    private void handleGetPrefillData(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String source = request.getParameter("source");
        String keys = request.getParameter("keys");

        if (source == null || source.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"source parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> prefillData = PREFILL_SOURCES.get(source.trim().toLowerCase());
        if (prefillData == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Prefill source not found: " + sanitize(source) + "\", \"valid\": false}");
            return;
        }

        if (keys != null && !keys.isEmpty()) {
            String[] keyArray = keys.split(",");
            Map<String, Object> filtered = new LinkedHashMap<>();
            for (String key : keyArray) {
                String trimmedKey = key.trim();
                if (prefillData.containsKey(trimmedKey)) {
                    filtered.put(trimmedKey, prefillData.get(trimmedKey));
                }
            }
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write("{\"data\": " + mapToJson(filtered) + ", \"source\": \"" + source + "\", \"valid\": true}");
        } else {
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write("{\"data\": " + mapToJson(prefillData) + ", \"source\": \"" + source + "\", \"valid\": true}");
        }
    }

    private void handleListPrefillSources(SlingHttpServletResponse response) throws IOException {
        StringBuilder json = new StringBuilder("{\"sources\": [");
        boolean first = true;
        for (Map.Entry<String, Map<String, Object>> entry : PREFILL_SOURCES.entrySet()) {
            if (!first) json.append(",");
            json.append("{\"name\": \"").append(entry.getKey()).append("\", \"fields\": ").append(entry.getValue().size()).append("}");
            first = false;
        }
        json.append("], \"total\": ").append(PREFILL_SOURCES.size()).append(", \"valid\": true}");

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
    }

    private void handleGetAnalytics(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String formPath = request.getParameter("formPath");

        if (formPath == null || formPath.isEmpty()) {
            // Return all analytics
            StringBuilder json = new StringBuilder("{\"analytics\": [");
            boolean first = true;
            for (Map.Entry<String, Map<String, Object>> entry : FORM_ANALYTICS.entrySet()) {
                if (!first) json.append(",");
                json.append(mapToJson(entry.getValue()));
                first = false;
            }
            json.append("], \"valid\": true}");
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write(json.toString());
        } else {
            Map<String, Object> analytics = FORM_ANALYTICS.get(formPath.trim());
            if (analytics == null) {
                response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"error\": \"No analytics found for form: " + sanitize(formPath) + "\", \"valid\": false}");
                return;
            }
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write(mapToJson(analytics));
        }
    }

    private void handlePrefillForm(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String formPath = request.getParameter("formPath");
        String sources = request.getParameter("sources");

        if (formPath == null || formPath.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"formPath parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> form = FORM_REGISTRY.get(formPath.trim());
        if (form == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Form not found: " + sanitize(formPath) + "\", \"valid\": false}");
            return;
        }

        // Merge data from specified sources
        Map<String, Object> mergedData = new LinkedHashMap<>();
        List<String> sourceList = new ArrayList<>();

        if (sources != null && !sources.isEmpty()) {
            String[] sourceArray = sources.split(",");
            for (String sourceName : sourceArray) {
                String trimmedSource = sourceName.trim().toLowerCase();
                Map<String, Object> prefillData = PREFILL_SOURCES.get(trimmedSource);
                if (prefillData != null) {
                    sourceList.add(trimmedSource);
                    mergedData.putAll(prefillData);
                }
            }
        } else {
            // Default: merge all sources
            for (Map.Entry<String, Map<String, Object>> entry : PREFILL_SOURCES.entrySet()) {
                sourceList.add(entry.getKey());
                mergedData.putAll(entry.getValue());
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("formPath", formPath);
        result.put("formTitle", form.get("title"));
        result.put("data", mergedData);
        result.put("sources", sourceList);
        result.put("prefilledAt", java.time.Instant.now().toString());
        result.put("valid", true);

        LOG.info("Prefilled form {} with {} fields from {} sources", formPath, mergedData.size(), sourceList.size());

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(result));
    }

    private String mapToJson(Map<String, Object> map) {
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (!first) json.append(",");
            String val = String.valueOf(entry.getValue());
            val = val.replace("\\", "\\\\").replace("\"", "\\\"");
            json.append("\"").append(entry.getKey()).append("\": \"").append(val).append("\"");
            first = false;
        }
        json.append("}");
        return json.toString();
    }

    private String sanitize(String input) {
        if (input == null) return "null";
        return input.replaceAll("[^a-zA-Z0-9 .,-]", "");
    }
}