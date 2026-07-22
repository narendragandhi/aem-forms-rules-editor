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
 * Backend proxy servlet for US address validation.
 * Validates address components against a mock database and returns standardized results.
 */
@Component(
    service = { Servlet.class },
    property = {
        "sling.servlet.paths=/bin/rules-api/validate-address",
        "sling.servlet.methods=GET"
    }
)
@ServiceDescription("Address Validation Proxy Servlet for AEM Forms Rules Editor")
public class AddressValidationServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(AddressValidationServlet.class);

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String street = request.getParameter("street");
        String city = request.getParameter("city");
        String state = request.getParameter("state");
        String zip = request.getParameter("zip");

        String safeLog = "street=" + sanitize(street) + ", city=" + sanitize(city)
            + ", state=" + sanitize(state) + ", zip=" + sanitize(zip);
        LOG.info("AddressValidationServlet: Validating address - {}", safeLog);

        // Validate required fields
        if (isNullOrEmpty(street) || isNullOrEmpty(city) || isNullOrEmpty(state) || isNullOrEmpty(zip)) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"All address fields (street, city, state, zip) are required.\", \"valid\": false}");
            return;
        }

        // Validate state code
        if (!isValidStateCode(state.trim().toUpperCase())) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid state code.\", \"valid\": false}");
            return;
        }

        // Validate ZIP format
        if (!zip.trim().matches("^\\d{5}(-\\d{4})?$")) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid ZIP code format.\", \"valid\": false}");
            return;
        }

        // Mock validation: check if state/zip combination exists in our database
        boolean isValid = isMockAddressValid(state.trim().toUpperCase(), zip.trim().substring(0, 5));

        if (isValid) {
            String standardized = "{\"street\": \"" + street.trim()
                + "\", \"city\": \"" + city.trim()
                + "\", \"state\": \"" + state.trim().toUpperCase()
                + "\", \"zip\": \"" + zip.trim()
                + "\", \"valid\": true, \"standardized\": true}";
            response.setStatus(SlingHttpServletResponse.SC_OK);
            response.getWriter().write(standardized);
        } else {
            response.setStatus(SlingHttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Address not found in validation database.\", \"valid\": false}");
        }
    }

    private boolean isMockAddressValid(String state, String zip) {
        Map<String, String[]> stateZipRanges = new HashMap<>();
        stateZipRanges.put("CA", new String[]{"90001", "96162"});
        stateZipRanges.put("NY", new String[]{"10001", "14975"});
        stateZipRanges.put("TX", new String[]{"73301", "79999"});
        stateZipRanges.put("FL", new String[]{"32003", "34997"});
        stateZipRanges.put("IL", new String[]{"60001", "62999"});

        String[] range = stateZipRanges.get(state);
        if (range == null) return false;

        int zipNum = Integer.parseInt(zip);
        return zipNum >= Integer.parseInt(range[0]) && zipNum <= Integer.parseInt(range[1]);
    }

    private boolean isValidStateCode(String code) {
        String states = "AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY";
        return states.split("\\|").length > 0 && states.contains(code);
    }

    private boolean isNullOrEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }

    private String sanitize(String input) {
        if (input == null) return "null";
        return input.replaceAll("[^a-zA-Z0-9 .,-]", "");
    }
}
