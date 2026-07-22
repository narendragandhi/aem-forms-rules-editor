package com.adobe.aem.forms.rules.core.submit;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.forms.common.service.FileAttachmentWrapper;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomRulesFormSubmitActionTest {

    private CustomRulesFormSubmitAction submitAction;

    @Mock
    private FormSubmitInfo formSubmitInfo;

    @Mock
    private FileAttachmentWrapper fileAttachment;

    @Mock
    private Resource containerResource;

    @Mock
    private ResourceResolver resourceResolver;

    @BeforeEach
    void setUp() {
        submitAction = new CustomRulesFormSubmitAction();
    }

    @Test
    void testGetServiceName() {
        assertEquals("Custom Rules Editor Submit Action", submitAction.getServiceName());
    }

    @Test
    void testSubmitSuccessPlainJson() {
        String testData = "{\"email\":\"john@example.com\",\"ssn\":\"123-45-6789\",\"zip\":\"90210\",\"creditCard\":\"1234567890123456\"}";
        when(formSubmitInfo.getData()).thenReturn(testData);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("success", result.get("status"));
        assertTrue(result.containsKey("message"));
    }

    @Test
    void testSubmitSuccessNestedJson() {
        String testData = "{"
            + "\"afData\": {"
            + "  \"afBoundData\": {"
            + "    \"data\": {"
            + "      \"email\": \"test@domain.com\","
            + "      \"ssn\": \"234-56-7890\","
            + "      \"zip\": \"02108-1234\","
            + "      \"creditCard\": \"1234567890123\""
            + "    }"
            + "  }"
            + "}"
            + "}";
        when(formSubmitInfo.getData()).thenReturn(testData);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("success", result.get("status"));
    }

    @Test
    void testSubmitSuccessPlainXml() {
        String testData = "<data>"
            + "  <email>test@domain.com</email>"
            + "  <ssn>234-56-7890</ssn>"
            + "  <zip>90210</zip>"
            + "  <creditCard>1234567890123456</creditCard>"
            + "</data>";
        when(formSubmitInfo.getData()).thenReturn(testData);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("success", result.get("status"));
    }

    @Test
    void testSubmitWithAttachmentsAndWorkflow() {
        String testData = "{\"email\":\"john@example.com\",\"ssn\":\"123-45-6789\",\"zip\":\"90210\"}";
        
        when(formSubmitInfo.getData()).thenReturn(testData);
        when(formSubmitInfo.getFileAttachments()).thenReturn(Collections.singletonList(fileAttachment));
        when(fileAttachment.getFileName()).thenReturn("test-doc.pdf");
        when(fileAttachment.getContentType()).thenReturn("application/pdf");
        when(fileAttachment.getUri()).thenReturn("temp:/test-doc.pdf");
        
        // Mock container path and resource resolver
        when(formSubmitInfo.getFormContainerPath()).thenReturn("/content/forms/af/test-form");
        when(formSubmitInfo.getFormContainerResource()).thenReturn(containerResource);
        when(containerResource.getResourceResolver()).thenReturn(resourceResolver);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("success", result.get("status"));
        verify(fileAttachment, times(1)).getFileName();
    }

    @Test
    void testSubmitFailureInvalidEmail() {
        String testData = "{\"email\":\"invalid-email-format\",\"ssn\":\"123-45-6789\"}";
        when(formSubmitInfo.getData()).thenReturn(testData);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }

    @Test
    void testSubmitFailureDummySsn() {
        // Starts with 000
        String testData = "{\"ssn\":\"000-45-6789\"}";
        when(formSubmitInfo.getData()).thenReturn(testData);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }

    @Test
    void testSubmitFailureInvalidZip() {
        String testData = "{\"zip\":\"1234\"}"; // Too short
        when(formSubmitInfo.getData()).thenReturn(testData);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }

    @Test
    void testSubmitFailureInvalidCreditCardLength() {
        String testData = "{\"creditCard\":\"123456789\"}"; // Too short
        when(formSubmitInfo.getData()).thenReturn(testData);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }

    @Test
    void testSubmitErrorEmptyData() {
        when(formSubmitInfo.getData()).thenReturn("");

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }

    @Test
    void testSubmitErrorNullData() {
        when(formSubmitInfo.getData()).thenReturn(null);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }

    @Test
    void testSubmitUnsupportedFormat() {
        when(formSubmitInfo.getData()).thenReturn("random-plain-text");

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }

    @Test
    void testSubmitXmlWithDtdDisallowed() {
        // Test XXE prevention via DTD disallow feature
        String exploitData = "<!DOCTYPE foo [<!ENTITY xxe SYSTEM \"http://attacker.com\">]><data><email>&xxe;</email></data>";
        when(formSubmitInfo.getData()).thenReturn(exploitData);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }
}
