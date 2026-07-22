package com.adobe.aem.forms.rules.core.servlets;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
class AddressValidationServletTest {

    private final AemContext context = new AemContext();
    private AddressValidationServlet servlet;

    @BeforeEach
    void setUp() {
        servlet = new AddressValidationServlet();
    }

    @Test
    void testValidAddress() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("street", "123 Main St");
        params.put("city", "Beverly Hills");
        params.put("state", "CA");
        params.put("zip", "90210");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        assertTrue(response.getOutputAsString().contains("\"valid\": true"));
        assertTrue(response.getOutputAsString().contains("Beverly Hills"));
    }

    @Test
    void testMissingFields() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        request.setParameterMap(java.util.Collections.singletonMap("street", "123 Main St"));

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("required"));
    }

    @Test
    void testInvalidStateCode() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("street", "123 Main St");
        params.put("city", "Test City");
        params.put("state", "XX");
        params.put("zip", "90210");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Invalid state"));
    }

    @Test
    void testInvalidZipFormat() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        Map<String, Object> params = new HashMap<>();
        params.put("street", "123 Main St");
        params.put("city", "Test City");
        params.put("state", "CA");
        params.put("zip", "1234");
        request.setParameterMap(params);

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Invalid ZIP"));
    }
}
