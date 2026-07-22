package com.adobe.aem.forms.rules.core.submit;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SendEmailSubmitActionTest {

    private SendEmailSubmitAction submitAction;

    @Mock
    private FormSubmitInfo formSubmitInfo;

    @BeforeEach
    void setUp() {
        submitAction = new SendEmailSubmitAction();
    }

    @Test
    void testGetServiceName() {
        assertEquals("Send Email Submit Action", submitAction.getServiceName());
    }

    @Test
    void testSubmitEmptyData() {
        when(formSubmitInfo.getData()).thenReturn("");

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }

    @Test
    void testSubmitNullData() {
        when(formSubmitInfo.getData()).thenReturn(null);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
    }

    @Test
    void testSubmitSuccess() {
        String testData = "{\"email\":\"test@example.com\",\"name\":\"Test User\"}";
        when(formSubmitInfo.getData()).thenReturn(testData);
        when(formSubmitInfo.getFormContainerPath()).thenReturn("/content/forms/af/test-form");

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("success", result.get("status"));
        assertTrue(result.containsKey("message"));
    }
}
