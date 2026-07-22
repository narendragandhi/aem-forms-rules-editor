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
class AuditLogSubmitActionTest {

    private AuditLogSubmitAction submitAction;

    @Mock
    private FormSubmitInfo formSubmitInfo;

    @BeforeEach
    void setUp() {
        submitAction = new AuditLogSubmitAction();
    }

    @Test
    void testGetServiceName() {
        assertEquals("Audit Log Submit Action", submitAction.getServiceName());
    }

    @Test
    void testSubmitNullResource() {
        when(formSubmitInfo.getData()).thenReturn("{\"email\":\"test@example.com\"}");
        when(formSubmitInfo.getFormContainerResource()).thenReturn(null);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("error", result.get("status"));
        assertTrue(result.get("message").toString().contains("resource"));
    }
}
