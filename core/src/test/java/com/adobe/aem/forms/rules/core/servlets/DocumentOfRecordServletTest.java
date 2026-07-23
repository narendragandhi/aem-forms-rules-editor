package com.adobe.aem.forms.rules.core.servlets;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class DocumentOfRecordServletTest {

    private final DocumentOfRecordServlet servlet = new DocumentOfRecordServlet();

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
        assertTrue(content.contains("DOR-STD-001"));
    }

    @Test
    void testGetTemplate(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=get-template&templateId=DOR-STD-001");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("DOR-STD-001"));
        assertTrue(content.contains("Standard Form Summary"));
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
    void testGenerateDoR(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=generate&templateId=DOR-STD-001&formPath=/content/forms/af/test-form");
        MockSlingHttpServletResponse response = context.response();

        servlet.doPost(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("dorId"));
        assertTrue(content.contains("generated"));
        assertTrue(content.contains("pdfUrl"));
    }

    @Test
    void testGenerateDoRMissingTemplate(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=generate&formPath=/content/forms/af/test-form");
        MockSlingHttpServletResponse response = context.response();

        servlet.doPost(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("templateId parameter required"));
    }

    @Test
    void testGenerateDoRMissingFormPath(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=generate&templateId=DOR-STD-001");
        MockSlingHttpServletResponse response = context.response();

        servlet.doPost(request, response);

        assertEquals(400, response.getStatus());
        assertTrue(response.getOutputAsString().contains("formPath parameter required"));
    }

    @Test
    void testGenerateDoRNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=generate&templateId=NONEXISTENT&formPath=/content/forms/af/test-form");
        MockSlingHttpServletResponse response = context.response();

        servlet.doPost(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Template not found"));
    }

    @Test
    void testGetDoR(AemContext context) throws Exception {
        // First generate a DoR
        MockSlingHttpServletRequest genRequest = context.request();
        genRequest.setQueryString("action=generate&templateId=DOR-STD-001&formPath=/content/forms/af/test-form");
        MockSlingHttpServletResponse genResponse = context.response();
        servlet.doPost(genRequest, genResponse);

        // Extract the dorId from the response
        String genContent = genResponse.getOutputAsString();
        String dorId = genContent.split("\"dorId\": \"")[1].split("\"")[0];

        // Then get the DoR
        MockSlingHttpServletRequest getRequest = context.request();
        getRequest.setQueryString("action=get-dor&dorId=" + dorId);
        MockSlingHttpServletResponse getResponse = context.response();

        servlet.doGet(getRequest, getResponse);

        assertEquals(200, getResponse.getStatus());
        String content = getResponse.getOutputAsString();
        assertTrue(content.contains(dorId));
        assertTrue(content.contains("pdfUrl"));
    }

    @Test
    void testGetDoRNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=get-dor&dorId=NONEXISTENT");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("not found"));
    }

    @Test
    void testListDoRs(AemContext context) throws Exception {
        // First generate a DoR
        MockSlingHttpServletRequest genRequest = context.request();
        genRequest.setQueryString("action=generate&templateId=DOR-STD-001&formPath=/content/forms/af/test-form");
        MockSlingHttpServletResponse genResponse = context.response();
        servlet.doPost(genRequest, genResponse);

        assertEquals(200, genResponse.getStatus());

        // Then list DoRs
        MockSlingHttpServletRequest listRequest = context.request();
        listRequest.setQueryString("action=list-dors");
        MockSlingHttpServletResponse listResponse = context.response();

        servlet.doGet(listRequest, listResponse);

        assertEquals(200, listResponse.getStatus());
        String content = listResponse.getOutputAsString();
        assertTrue(content.contains("\"documents\":"));
        assertTrue(content.contains("\"valid\": true"));
    }

    @Test
    void testRegenerateDoR(AemContext context) throws Exception {
        // First generate a DoR
        MockSlingHttpServletRequest genRequest = context.request();
        genRequest.setQueryString("action=generate&templateId=DOR-STD-001&formPath=/content/forms/af/test-form");
        MockSlingHttpServletResponse genResponse = context.response();
        servlet.doPost(genRequest, genResponse);

        // Extract the dorId from the response
        String genContent = genResponse.getOutputAsString();
        String dorId = genContent.split("\"dorId\": \"")[1].split("\"")[0];

        // Then regenerate
        MockSlingHttpServletRequest regenRequest = context.request();
        regenRequest.setQueryString("action=regenerate&dorId=" + dorId);
        MockSlingHttpServletResponse regenResponse = context.response();

        servlet.doPost(regenRequest, regenResponse);

        assertEquals(200, regenResponse.getStatus());
        String content = regenResponse.getOutputAsString();
        assertTrue(content.contains("regenerated"));
        assertTrue(content.contains("regenerationId"));
    }

    @Test
    void testGetStatus(AemContext context) throws Exception {
        // First generate a DoR
        MockSlingHttpServletRequest genRequest = context.request();
        genRequest.setQueryString("action=generate&templateId=DOR-STD-001&formPath=/content/forms/af/test-form");
        MockSlingHttpServletResponse genResponse = context.response();
        servlet.doPost(genRequest, genResponse);

        // Extract the dorId from the response
        String genContent = genResponse.getOutputAsString();
        String dorId = genContent.split("\"dorId\": \"")[1].split("\"")[0];

        // Then get status
        MockSlingHttpServletRequest statusRequest = context.request();
        statusRequest.setQueryString("action=status&dorId=" + dorId);
        MockSlingHttpServletResponse statusResponse = context.response();

        servlet.doGet(statusRequest, statusResponse);

        assertEquals(200, statusResponse.getStatus());
        String content = statusResponse.getOutputAsString();
        assertTrue(content.contains("generated"));
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