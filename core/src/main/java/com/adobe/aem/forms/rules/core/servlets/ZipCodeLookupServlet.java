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
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * A backend proxy servlet for ZIP code lookup.
 * Demonstrates AEM backend integrations supporting client-side custom functions.
 * Validates input parameters programmatically and prevents log injection.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/zip-lookup",
        "sling.servlet.methods=GET"
    }
)
@ServiceDescription("ZIP Code Lookup Proxy Servlet for AEM Forms Rules Editor")
public class ZipCodeLookupServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(ZipCodeLookupServlet.class);

    private static final Pattern ZIP_PATTERN = Pattern.compile("^\\d{5}(-\\d{4})?$");

    // Mock DB of ZIP codes for demonstration
    private static final Map<String, String> ZIP_DATABASE = new HashMap<>();

    static {
        ZIP_DATABASE.put("95101", "{\"city\": \"San Jose\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("10001", "{\"city\": \"New York\", \"state\": \"NY\", \"valid\": true}");
        ZIP_DATABASE.put("60601", "{\"city\": \"Chicago\", \"state\": \"IL\", \"valid\": true}");
        ZIP_DATABASE.put("90210", "{\"city\": \"Beverly Hills\", \"state\": \"CA\", \"valid\": true}");
        ZIP_DATABASE.put("02108", "{\"city\": \"Boston\", \"state\": \"MA\", \"valid\": true}");
    }

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String zip = request.getParameter("zip");
        if (zip != null) {
            zip = zip.trim();
        }

        // Clean input for secure logging (prevent Log Injection)
        String safeZipLog = (zip == null) ? "null" : zip.replaceAll("[^a-zA-Z0-9-]", "");
        LOG.info("ZipCodeLookupServlet: Looking up ZIP code: {}", safeZipLog);

        if (zip == null || zip.isEmpty() || !ZIP_PATTERN.matcher(zip).matches()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid ZIP code parameter. Must be 5 digits (e.g. 12345) or ZIP+4 (e.g. 12345-6789).\", \"valid\": false}");
            return;
        }

        // If it's ZIP+4 (9 digits with a hyphen), extract the first 5 digits for the database lookup
        String lookupKey = zip;
        if (zip.contains("-")) {
            lookupKey = zip.split("-")[0];
        }

        String jsonResponse = ZIP_DATABASE.get(lookupKey);

        if (jsonResponse != null) {
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write(jsonResponse);
        } else {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"ZIP code not found in backend database.\", \"valid\": false}");
        }
    }
}
