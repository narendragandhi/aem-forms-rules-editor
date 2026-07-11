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

/**
 * A backend proxy servlet for ZIP code lookup.
 * Demonstrates AEM backend integrations supporting client-side custom functions.
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
        LOG.info("ZipCodeLookupServlet: Looking up ZIP code: {}", zip);

        if (zip == null || zip.trim().length() != 5) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid ZIP code parameter. Must be 5 digits.\", \"valid\": false}");
            return;
        }

        String jsonResponse = ZIP_DATABASE.get(zip.trim());

        if (jsonResponse != null) {
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write(jsonResponse);
        } else {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"ZIP code not found in backend database.\", \"valid\": false}");
        }
    }
}
