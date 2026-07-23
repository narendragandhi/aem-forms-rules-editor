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

/**
 * Backend servlet for Document of Record (DoR) operations.
 * Generates, retrieves, and manages PDF documents that serve as official records
 * of form submissions for archival and compliance purposes.
 *
 * Document of Record is used to:
 * - Generate PDF snapshots of form submissions
 * - Create archival copies for regulatory compliance
 * - Produce printable versions of submitted data
 * - Store official records in AEM DAM
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/document-of-record",
        "sling.servlet.methods=GET,POST"
    }
)
@ServiceDescription("Document of Record Servlet for AEM Forms Rules Editor")
public class DocumentOfRecordServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(DocumentOfRecordServlet.class);

    // DoR template configurations
    private static final Map<String, Map<String, Object>> DOR_TEMPLATES = new LinkedHashMap<>();
    static {
        addDoRTemplate("DOR-STD-001", "Standard Form Summary", "default",
            "Standard PDF layout with form fields displayed in a single-column format.", true);
        addDoRTemplate("DOR-STD-002", "Executive Summary", "executive",
            "Condensed view with key metrics and summary data only.", false);
        addDoRTemplate("DOR-STD-003", "Detailed Breakdown", "detailed",
            "Full form data with all sections, subsections, and validation notes.", true);
        addDoRTemplate("DOR-STD-004", "Compliance Record", "compliance",
            "Regulatory-compliant format with audit trail, timestamps, and signatures.", true);
        addDoRTemplate("DOR-STD-005", "Customer Copy", "customer",
            "Customer-friendly layout with branding and simplified data presentation.", false);
    }

    private static void addDoRTemplate(String id, String name, String style, String description, boolean includeMetadata) {
        Map<String, Object> template = new LinkedHashMap<>();
        template.put("id", id);
        template.put("name", name);
        template.put("style", style);
        template.put("description", description);
        template.put("includeMetadata", includeMetadata);
        template.put("pageFormat", "A4");
        template.put("orientation", "portrait");
        template.put("status", "active");
        DOR_TEMPLATES.put(id, template);
    }

    // Generated DoR storage (in-memory for demo)
    private static final Map<String, Map<String, Object>> GENERATED_DORS = new LinkedHashMap<>();

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        if (action == null) action = "list-templates";

        LOG.info("DocumentOfRecord: action={}", sanitize(action));

        switch (action) {
            case "list-templates":
                handleListTemplates(response);
                break;
            case "get-template":
                handleGetTemplate(request, response);
                break;
            case "get-dor":
                handleGetDoR(request, response);
                break;
            case "list-dors":
                handleListDoRs(request, response);
                break;
            case "status":
                handleGetStatus(request, response);
                break;
            case "generate":
                handleGenerateDoR(request, response);
                break;
            case "regenerate":
                handleRegenerateDoR(request, response);
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

        LOG.info("DocumentOfRecord POST: action={}", sanitize(action));

        switch (action) {
            case "generate":
                handleGenerateDoR(request, response);
                break;
            case "regenerate":
                handleRegenerateDoR(request, response);
                break;
            default:
                response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Unknown action: " + sanitize(action) + "\", \"valid\": false}");
        }
    }

    private void handleListTemplates(SlingHttpServletResponse response) throws IOException {
        StringBuilder json = new StringBuilder("{\"templates\": [");
        boolean first = true;
        for (Map.Entry<String, Map<String, Object>> entry : DOR_TEMPLATES.entrySet()) {
            if (!first) json.append(",");
            json.append(mapToJson(entry.getValue()));
            first = false;
        }
        json.append("], \"total\": ").append(DOR_TEMPLATES.size()).append(", \"valid\": true}");

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

        Map<String, Object> template = DOR_TEMPLATES.get(templateId.trim().toUpperCase());
        if (template == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Template not found: " + sanitize(templateId) + "\", \"valid\": false}");
            return;
        }

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(template));
    }

    private void handleGetDoR(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String dorId = request.getParameter("dorId");
        if (dorId == null || dorId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"dorId parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> dor = GENERATED_DORS.get(dorId.trim());
        if (dor == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Document of Record not found: " + sanitize(dorId) + "\", \"valid\": false}");
            return;
        }

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(dor));
    }

    private void handleListDoRs(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String formPath = request.getParameter("formPath");

        List<Map<String, Object>> dors = new ArrayList<>();
        for (Map.Entry<String, Map<String, Object>> entry : GENERATED_DORS.entrySet()) {
            Map<String, Object> dor = entry.getValue();
            if (formPath == null || formPath.isEmpty() || formPath.equals(dor.get("formPath"))) {
                dors.add(dor);
            }
        }

        StringBuilder json = new StringBuilder("{\"documents\": [");
        for (int i = 0; i < dors.size(); i++) {
            if (i > 0) json.append(",");
            json.append(mapToJson(dors.get(i)));
        }
        json.append("], \"total\": ").append(dors.size()).append(", \"valid\": true}");

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(json.toString());
    }

    private void handleGetStatus(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String dorId = request.getParameter("dorId");
        if (dorId == null || dorId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"dorId parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> dor = GENERATED_DORS.get(dorId.trim());
        if (dor == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Document not found.\", \"valid\": false}");
            return;
        }

        Map<String, Object> status = new LinkedHashMap<>();
        status.put("dorId", dorId);
        status.put("status", dor.get("status"));
        status.put("lastUpdated", dor.get("lastUpdated"));

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(status));
    }

    private void handleGenerateDoR(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String templateId = request.getParameter("templateId");
        String formPath = request.getParameter("formPath");
        String submissionId = request.getParameter("submissionId");

        if (templateId == null || templateId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"templateId parameter required.\", \"valid\": false}");
            return;
        }

        if (formPath == null || formPath.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"formPath parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> template = DOR_TEMPLATES.get(templateId.trim().toUpperCase());
        if (template == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Template not found: " + sanitize(templateId) + "\", \"valid\": false}");
            return;
        }

        String dorId = "DOR-" + System.currentTimeMillis();
        Map<String, Object> dor = new LinkedHashMap<>();
        dor.put("dorId", dorId);
        dor.put("templateId", templateId);
        dor.put("templateName", template.get("name"));
        dor.put("formPath", formPath);
        dor.put("submissionId", submissionId != null ? submissionId : "SUB-" + System.currentTimeMillis());
        dor.put("status", "generated");
        dor.put("pdfUrl", "/content/dam/aem-forms/dor/" + dorId + ".pdf");
        dor.put("fileSize", "245 KB");
        dor.put("pageCount", 2);
        dor.put("createdDate", java.time.Instant.now().toString());
        dor.put("lastUpdated", java.time.Instant.now().toString());
        dor.put("createdBy", "system");
        dor.put("valid", true);

        GENERATED_DORS.put(dorId, dor);

        LOG.info("Generated Document of Record {} for form {}", dorId, formPath);

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(dor));
    }

    private void handleRegenerateDoR(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        String dorId = request.getParameter("dorId");
        if (dorId == null || dorId.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"dorId parameter required.\", \"valid\": false}");
            return;
        }

        Map<String, Object> existingDor = GENERATED_DORS.get(dorId.trim());
        if (existingDor == null) {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Document not found: " + sanitize(dorId) + "\", \"valid\": false}");
            return;
        }

        existingDor.put("status", "regenerated");
        existingDor.put("lastUpdated", java.time.Instant.now().toString());

        Map<String, Object> result = new LinkedHashMap<>(existingDor);
        result.put("regenerationId", "REGEN-" + System.currentTimeMillis());

        LOG.info("Regenerated Document of Record {}", dorId);

        response.setStatus(SlingHttpServletResponse.SC_OK);
        response.getWriter().write(mapToJson(result));
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