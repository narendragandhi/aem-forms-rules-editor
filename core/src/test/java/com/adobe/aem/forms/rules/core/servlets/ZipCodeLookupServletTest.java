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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
class ZipCodeLookupServletTest {

    private final AemContext context = new AemContext();
    private ZipCodeLookupServlet servlet;

    @BeforeEach
    void setUp() {
        servlet = new ZipCodeLookupServlet();
    }

    @Test
    void testZipLookupSuccess() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        request.setParameterMap(java.util.Collections.singletonMap("zip", "90210"));

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        assertTrue(response.getContentType().startsWith("application/json"));
        assertEquals("UTF-8", response.getCharacterEncoding());
        assertTrue(response.getOutputAsString().contains("Beverly Hills"));
        assertTrue(response.getOutputAsString().contains("CA"));
        assertTrue(response.getOutputAsString().contains("\"valid\": true"));
    }

    @Test
    void testZipLookupInvalid() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        request.setParameterMap(java.util.Collections.singletonMap("zip", "123"));

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Invalid ZIP code"));
        assertTrue(response.getOutputAsString().contains("\"valid\": false"));
    }

    @Test
    void testZipLookupNotFound() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        request.setParameterMap(java.util.Collections.singletonMap("zip", "99999"));

        servlet.doGet(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("not found"));
        assertTrue(response.getOutputAsString().contains("\"valid\": false"));
    }

    @Test
    void testZipLookupNull() throws ServletException, IOException {
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
    }
}
