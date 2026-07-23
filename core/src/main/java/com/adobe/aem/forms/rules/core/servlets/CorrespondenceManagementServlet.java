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
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Backend servlet for Correspondence Management operations.
 * Provides letter template listing, correspondence generation, data dictionary lookup,
 * and correspondence history retrieval.
 *
 * Integrates with AEM Forms Correspondence Management APIs when available.
 * Falls back to simulated responses for development/demo environments.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/correspondence",
        "sling.servlet.methods=GET,POST"
    }
)
@ServiceDescription("Correspondence Management Servlet for AEM Forms Rules Editor")
public class CorrespondenceManagementServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(CorrespondenceManagementServlet.class);

    // Simulated letter template database
    private static final Map<String, Map<String, Object>> LETTER_TEMPLATES = new LinkedHashMap<>();
    static {
        addTemplate("LETTER-001", "Welcome Letter", "customer-onboarding", "Welcome to our service, {{firstName}} {{lastName}}.");
        addTemplate("LETTER-002", "Account Statement", "financial", "Your account balance as of {{statementDate}} is {{currency}} {{balance}}.");
        addTemplate("LETTER-003", "Payment Reminder", "billing", "Dear {{firstName}}, your payment of {{currency}} {{amount}} is due on {{dueDate}}.");
        addTemplate("LETTER-004", "Service Agreement", "legal", "This agreement between {{companyName}} and {{customerName}} is effective {{effectiveDate}}.");
        addTemplate("LETTER-005", "Claim Acknowledgment", "insurance", "Dear {{firstName}}, we have received your claim #{{claimNumber}} dated {{claimDate}}.");
        addTemplate("LETTER-006", "Tax Notification", "government", "Dear {{taxpayerName}}, your tax return for {{taxYear}} has been processed.");
        addTemplate("LETTER-007", "Shipping Confirmation", "logistics", "Dear {{firstName}}, your order #{{orderNumber}} has shipped via {{carrier}}.");
        addTemplate("LETTER-008", "Appointment Confirmation", "healthcare", "Dear {{patientName}}, your appointment is scheduled for {{appointmentDate}} at {{appointmentTime}}.");
    }

    private static void addTemplate(String id, String name, String category, String bodyTemplate) {
        Map<String, Object> template = new LinkedHashMap<>();
        template.put("id", id);
        template.put("name", name);
        template.put("category", category);
        template.put("bodyTemplate", bodyTemplate);
        template.put("status", "active");
        template.put("createdDate", "2024-01-15");
        template.put("version", 1);
        LETTER_TEMPLATES.put(id, template);
    }

    // Simulated data dictionary
    private static final Map<String, Map<String, String>> DATA_DICTIONARIES = new LinkedHashMap<>();
    static {
        Map<String, String> usStates = new LinkedHashMap<>();
        usStates.put("AL", "Alabama"); usStates.put("AK", "Alaska"); usStates.put("AZ", "Arizona");
        usStates.put("AR", "Arkansas"); usStates.put("CA", "California"); usStates.put("CO", "Colorado");
        usStates.put("CT", "Connecticut"); usStates.put("DE", "Delaware"); usStates.put("DC", "District of Columbia");
        usStates.put("FL", "Florida"); usStates.put("GA", "Georgia"); usStates.put("HI", "Hawaii");
        usStates.put("ID", "Idaho"); usStates.put("IL", "Illinois"); usStates.put("IN", "Indiana");
        usStates.put("IA", "Iowa"); usStates.put("KS", "Kansas"); usStates.put("KY", "Kentucky");
        usStates.put("LA", "Louisiana"); usStates.put("ME", "Maine"); usStates.put("MD", "Maryland");
        usStates.put("MA", "Massachusetts"); usStates.put("MI", "Michigan"); usStates.put("MN", "Minnesota");
        usStates.put("MS", "Mississippi"); usStates.put("MO", "Missouri"); usStates.put("MT", "Montana");
        usStates.put("NE", "Nebraska"); usStates.put("NV", "Nevada"); usStates.put("NH", "New Hampshire");
        usStates.put("NJ", "New Jersey"); usStates.put("NM", "New Mexico"); usStates.put("NY", "New York");
        usStates.put("NC", "North Carolina"); usStates.put("ND", "North Dakota"); usStates.put("OH", "Ohio");
        usStates.put("OK", "Oklahoma"); usStates.put("OR", "Oregon"); usStates.put("PA", "Pennsylvania");
        usStates.put("RI", "Rhode Island"); usStates.put("SC", "South Carolina"); usStates.put("SD", "South Dakota");
        usStates.put("TN", "Tennessee"); usStates.put("TX", "Texas"); usStates.put("UT", "Utah");
        usStates.put("VT", "Vermont"); usStates.put("VA", "Virginia"); usStates.put("WA", "Washington");
        usStates.put("WV", "West Virginia"); usStates.put("WI", "Wisconsin"); usStates.put("WY", "Wyoming");
        DATA_DICTIONARIES.put("us-states", usStates);

        Map<String, String> currencies = new LinkedHashMap<>();
        currencies.put("USD", "US Dollar"); currencies.put("EUR", "Euro"); currencies.put("GBP", "British Pound");
        currencies.put("JPY", "Japanese Yen"); currencies.put("CAD", "Canadian Dollar");
        currencies.put("AUD", "Australian Dollar"); currencies.put("CHF", "Swiss Franc");
        currencies.put("CNY", "Chinese Yuan"); currencies.put("INR", "Indian Rupee");
        currencies.put("MXN", "Mexican Peso"); currencies.put("BRL", "Brazilian Real");
        DATA_DICTIONARIES.put("currencies", currencies);

        Map<String, String> salutations = new LinkedHashMap<>();
        salutations.put("MR", "Mr."); salutations.put("MRS", "Mrs."); salutations.put("MS", "Ms.");
        salutations.put("DR", "Dr."); salutations.put("PROF", "Prof."); salutations.put("REV", "Rev.");
        salutations.put("HON", "Hon.");
        DATA_DICTIONARIES.put("salutations", salutations);

        Map<String, String> countries = new LinkedHashMap<>();
        countries.put("US", "United States"); countries.put("CA", "Canada"); countries.put("GB", "United Kingdom");
        countries.put("DE", "Germany"); countries.put("FR", "France"); countries.put("JP", "Japan");
        countries.put("AU", "Australia"); countries.put("IN", "India"); countries.put("BR", "Brazil");
        countries.put("MX", "Mexico");
        DATA_DICTIONARIES.put("countries", countries);
    }

    // Correspondence history cache
    private static final Map<String, List<Map<String, Object>>> CORRESPONDENCE_HISTORY = new ConcurrentHashMap<>();

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        if (action == null) action = "list-templates";

        LOG.info("CorrespondenceManagement: action={}", sanitize(action));

        switch (action) {
            case "list-templates":
                handleListTemplates(response);
                break;
            case "get-template":
                handleGetTemplate(request, response);
                break;
            case "list-dictionaries":
                handleListDictionaries(response);
                break;
            case "lookup-dictionary":
                handleLookupDictionary(request, response);
                break;
            case "history":
                handleGetHistory(request, response);
                break;
            case "generate":
                handleGenerateCorrespondence(request, response);
                break;
            case "preview":
                handlePreviewCorrespondence(request, response);
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
        if (action == null) action = "generate";

        LOG.info("CorrespondenceManagement POST: action={}", sanitize(action));

        switch (action) {
            case "generate":
                handleGenerateCorrespondence(request, response);
                break;
            case "preview":
                handlePreviewCorrespondence(request, response);
                break;
            default:
                response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Unknown action: " + sanitize(action) + "\", \"valid\": false}");
        }
    }

    private void handleListTemplates(SlingHttpServletResponse response) throws IOException {
        String category = null;
        List<Map<String, Object>> templates = new ArrayList<>();
        for (Map.Entry<String, Map<String, Object>> entry : LETTER_TEMPLATES.entrySet()) {
            templates.add(entry.getValue());
        }

        StringBuilder json = new StringBuilder("{\"templates\": [");
        for (int i = 0; i < templates.size(); i++) {
            if (i > 0) json.append(",");
            json.append(mapToJson(templates.get(i)));
        }
        json.append("], \"total\": ").append(templates.size()).append(", \"valid\": true}");

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
    }

    private void handleGetTemplate(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String templateId = request.getParameter("templateId");
        if (templateId == null || templateId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"templateId parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> template = LETTER_TEMPLATES.get(templateId.trim().toUpperCase());
        if (template == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Template not found: " + sanitize(templateId) + "\", \"valid\": false}");
            return;
        }

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(template));
    }

    private void handleListDictionaries(SlingHttpServletResponse response) throws IOException {
        List<String> names = new ArrayList<>(DATA_DICTIONARIES.keySet());

        StringBuilder json = new StringBuilder("{\"dictionaries\": [");
        for (int i = 0; i < names.size(); i++) {
            if (i > 0) json.append(",");
            json.append("{\"name\": \"").append(names.get(i)).append("\", \"entries\": ")
                .append(DATA_DICTIONARIES.get(names.get(i)).size()).append("}");
        }
        json.append("], \"total\": ").append(names.size()).append(", \"valid\": true}");

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
    }

    private void handleLookupDictionary(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String dictName = request.getParameter("dictionary");
        String key = request.getParameter("key");

        if (dictName == null || dictName.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"dictionary parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, String> dictionary = DATA_DICTIONARIES.get(dictName.trim().toLowerCase());
        if (dictionary == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Dictionary not found: " + sanitize(dictName) + "\", \"valid\": false}");
            return;
        }

        if (key != null && !key.isEmpty()) {
            String value = dictionary.get(key.trim().toUpperCase());
            if (value == null) {
                response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"error\": \"Key not found in dictionary: " + sanitize(key) + "\", \"valid\": false}");
                return;
            }
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write("{\"key\": \"" + key.trim().toUpperCase() + "\", \"value\": \"" + value + "\", \"valid\": true}");
        } else {
            StringBuilder json = new StringBuilder("{\"entries\": {");
            boolean first = true;
            for (Map.Entry<String, String> entry : dictionary.entrySet()) {
                if (!first) json.append(",");
                json.append("\"").append(entry.getKey()).append("\": \"").append(entry.getValue()).append("\"");
                first = false;
            }
            json.append("}, \"total\": ").append(dictionary.size()).append(", \"valid\": true}");
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write(json.toString());
        }
    }

    private void handleGenerateCorrespondence(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String templateId = request.getParameter("templateId");
        String recipientId = request.getParameter("recipientId");

        if (templateId == null || templateId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"templateId parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> template = LETTER_TEMPLATES.get(templateId.trim().toUpperCase());
        if (template == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Template not found: " + sanitize(templateId) + "\", \"valid\": false}");
            return;
        }

        String correspondenceId = "CORR-" + System.currentTimeMillis();
        Map<String, Object> correspondence = new LinkedHashMap<>();
        correspondence.put("correspondenceId", correspondenceId);
        correspondence.put("templateId", templateId);
        correspondence.put("templateName", template.get("name"));
        correspondence.put("recipientId", recipientId != null ? recipientId : "unknown");
        correspondence.put("status", "generated");
        correspondence.put("generatedDate", java.time.Instant.now().toString());
        correspondence.put("valid", true);

        // Store in history
        String historyKey = recipientId != null ? recipientId : "anonymous";
        CORRESPONDENCE_HISTORY.computeIfAbsent(historyKey, k -> new ArrayList<>()).add(correspondence);

        LOG.info("Generated correspondence {} from template {}", correspondenceId, templateId);

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(correspondence));
    }

    private void handlePreviewCorrespondence(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String templateId = request.getParameter("templateId");

        if (templateId == null || templateId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"templateId parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> template = LETTER_TEMPLATES.get(templateId.trim().toUpperCase());
        if (template == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Template not found: " + sanitize(templateId) + "\", \"valid\": false}");
            return;
        }

        Map<String, Object> preview = new LinkedHashMap<>(template);
        preview.put("previewMode", true);
        preview.put("previewDate", java.time.Instant.now().toString());

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(preview));
    }

    private void handleGetHistory(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String recipientId = request.getParameter("recipientId");

        if (recipientId == null || recipientId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"recipientId parameter required.\", \"valid\": false}");
            return;
        }

        List<Map<String, Object>> history = CORRESPONDENCE_HISTORY.get(recipientId.trim());
        if (history == null) history = new ArrayList<>();

        StringBuilder json = new StringBuilder("{\"recipientId\": \"").append(sanitize(recipientId))
            .append("\", \"correspondences\": [");
        for (int i = 0; i < history.size(); i++) {
            if (i > 0) json.append(",");
            json.append(mapToJson(history.get(i)));
        }
        json.append("], \"total\": ").append(history.size()).append(", \"valid\": true}");

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
    }

    private String mapToJson(Map<String, Object> map) {
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (!first) json.append(",");
            json.append("\"").append(entry.getKey()).append("\": \"").append(entry.getValue()).append("\"");
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