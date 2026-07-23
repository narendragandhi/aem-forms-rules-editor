package com.adobe.aem.forms.rules.core.servlets;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class CorrespondenceManagementServletTest {

    private final CorrespondenceManagementServlet servlet = new CorrespondenceManagementServlet();

    @Test
    void testListTemplates(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=list-templates");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("\"templates\":"));
        assertTrue(content.contains("\"valid\": true"));
        assertTrue(content.contains("LETTER-001"));
    }

    @Test
    void testGetTemplate(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=get-template&templateId=LETTER-001");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("LETTER-001"));
        assertTrue(content.contains("Welcome Letter"));
    }

    @Test
    void testGetTemplateNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=get-template&templateId=NONEXISTENT");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Template not found"));
    }

    @Test
    void testListDictionaries(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=list-dictionaries");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("\"dictionaries\":"));
        assertTrue(content.contains("us-states"));
        assertTrue(content.contains("currencies"));
    }

    @Test
    void testLookupDictionaryWithKey(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=lookup-dictionary&dictionary=us-states&key=CA");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("California"));
    }

    @Test
    void testLookupDictionaryAllEntries(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=lookup-dictionary&dictionary=salutations");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("\"entries\":"));
        assertTrue(content.contains("Mr."));
    }

    @Test
    void testLookupDictionaryNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=lookup-dictionary&dictionary=nonexistent");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Dictionary not found"));
    }

    @Test
    void testGenerateCorrespondence(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=generate&templateId=LETTER-001&recipientId=CUST-001");
        MockSlingHttpServletResponse response = context.response();

        servlet.doPost(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("correspondenceId"));
        assertTrue(content.contains("generated"));
    }

    @Test
    void testGenerateCorrespondenceMissingTemplate(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=generate");
        MockSlingHttpServletResponse response = context.response();

        servlet.doPost(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("templateId parameter required"));
    }

    @Test
    void testGetHistory(AemContext context) throws Exception {
        // First generate a correspondence
        MockSlingHttpServletRequest genRequest = context.request();
        genRequest.setQueryString("action=generate&templateId=LETTER-001&recipientId=CUST-HIST-001");
        MockSlingHttpServletResponse genResponse = context.response();
        servlet.doPost(genRequest, genResponse);

        // Then get history
        MockSlingHttpServletRequest histRequest = context.request();
        histRequest.setQueryString("action=history&recipientId=CUST-HIST-001");
        MockSlingHttpServletResponse histResponse = context.response();

        servlet.doGet(histRequest, histResponse);

        assertEquals(200, histResponse.getStatus());
        String content = histResponse.getOutputAsString();
        assertTrue(content.contains("CUST-HIST-001"));
        assertTrue(content.contains("\"total\": 1"));
    }

    @Test
    void testUnknownAction(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=bogus");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Unknown action"));
    }
}