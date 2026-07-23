package com.adobe.aem.forms.rules.core.servlets;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class FormsPortalPrefillServletTest {

    private final FormsPortalPrefillServlet servlet = new FormsPortalPrefillServlet();

    @Test
    void testListForms(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=list-forms");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("\"forms\":"));
        assertTrue(content.contains("\"valid\": true"));
        assertTrue(content.contains("/content/forms/af/customer-registration"));
    }

    @Test
    void testListFormsByCategory(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=list-forms&category=finance");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("invoice-submission"));
        assertTrue(content.contains("expense-report"));
    }

    @Test
    void testGetFormMetadata(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=get-form-metadata&formPath=/content/forms/af/loan-application");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("Loan Application Form"));
        assertTrue(content.contains("/content/forms/af/loan-application"));
    }

    @Test
    void testGetFormMetadataNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=get-form-metadata&formPath=/content/forms/af/nonexistent");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Form not found"));
    }

    @Test
    void testSaveDraft(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=save-draft&formPath=/content/forms/af/loan-application&userId=user123&data=%7B%22name%22%3A%22John%22%7D");
        MockSlingHttpServletResponse response = context.response();

        servlet.doPost(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("savedDate"));
        assertTrue(content.contains("draft"));
    }

    @Test
    void testGetDraft(AemContext context) throws Exception {
        // First save a draft
        MockSlingHttpServletRequest saveRequest = context.request();
        saveRequest.setQueryString("action=save-draft&formPath=/content/forms/af/loan-application&userId=user-get&data=test");
        MockSlingHttpServletResponse saveResponse = context.response();
        servlet.doPost(saveRequest, saveResponse);

        assertEquals(200, saveResponse.getStatus());

        // Then get it
        MockSlingHttpServletRequest getRequest = context.request();
        getRequest.setQueryString("action=get-draft&formPath=/content/forms/af/loan-application&userId=user-get");
        MockSlingHttpServletResponse getResponse = context.response();

        servlet.doGet(getRequest, getResponse);

        assertEquals(200, getResponse.getStatus());
        String content = getResponse.getOutputAsString();
        assertTrue(content.contains("user-get"));
        assertTrue(content.contains("test"));
    }

    @Test
    void testGetDraftNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=get-draft&formPath=/content/forms/af/loan-application&userId=nonexistent");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("No draft found"));
    }

    @Test
    void testDeleteDraft(AemContext context) throws Exception {
        // First save a draft
        MockSlingHttpServletRequest saveRequest = context.request();
        saveRequest.setQueryString("action=save-draft&formPath=/content/forms/af/loan-application&userId=user-del&data=test");
        MockSlingHttpServletResponse saveResponse = context.response();
        servlet.doPost(saveRequest, saveResponse);

        assertEquals(200, saveResponse.getStatus());

        // Then delete it
        MockSlingHttpServletRequest deleteRequest = context.request();
        deleteRequest.setQueryString("action=delete-draft&formPath=/content/forms/af/loan-application&userId=user-del");
        MockSlingHttpServletResponse deleteResponse = context.response();

        servlet.doDelete(deleteRequest, deleteResponse);

        assertEquals(200, deleteResponse.getStatus());
        assertTrue(deleteResponse.getOutputAsString().contains("deleted"));
    }

    @Test
    void testDeleteDraftNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=delete-draft&formPath=/content/forms/af/loan-application&userId=nonexistent");
        MockSlingHttpServletResponse response = context.response();

        servlet.doDelete(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("No draft found"));
    }

    @Test
    void testPrefillData(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=prefill-data&source=user-profile");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("\"data\":"));
        assertTrue(content.contains("John"));
        assertTrue(content.contains("john.doe@example.com"));
    }

    @Test
    void testPrefillDataWithKeys(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=prefill-data&source=user-profile&keys=email,phone");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("john.doe@example.com"));
        assertTrue(content.contains("+1-555-0123"));
        assertFalse(content.contains("firstName"));
    }

    @Test
    void testPrefillDataNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=prefill-data&source=nonexistent");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Prefill source not found"));
    }

    @Test
    void testListPrefillSources(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=list-prefill-sources");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("user-profile"));
        assertTrue(content.contains("customer-data"));
        assertTrue(content.contains("organization"));
    }

    @Test
    void testGetAnalytics(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=analytics&formPath=/content/forms/af/customer-registration");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("completionRate"));
        assertTrue(content.contains("totalStarts"));
    }

    @Test
    void testGetAnalyticsNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=analytics&formPath=/content/forms/af/nonexistent");
        MockSlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("No analytics found"));
    }

    @Test
    void testPrefillForm(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=prefill-form&formPath=/content/forms/af/loan-application&sources=user-profile,customer-data");
        MockSlingHttpServletResponse response = context.response();

        servlet.doPost(request, response);

        assertEquals(200, response.getStatus());
        String content = response.getOutputAsString();
        assertTrue(content.contains("formTitle"));
        assertTrue(content.contains("Loan Application Form"));
        assertTrue(content.contains("\"data\":"));
        assertTrue(content.contains("John"));
        assertTrue(content.contains("CUST-12345"));
    }

    @Test
    void testPrefillFormNotFound(AemContext context) throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setQueryString("action=prefill-form&formPath=/content/forms/af/nonexistent");
        MockSlingHttpServletResponse response = context.response();

        servlet.doPost(request, response);

        assertEquals(404, response.getStatus());
        assertTrue(response.getOutputAsString().contains("Form not found"));
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