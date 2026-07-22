package com.adobe.aem.forms.rules.core.submit;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.forms.common.service.FileAttachmentWrapper;
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
class SaveToDAMSubmitActionTest {

    private SaveToDAMSubmitAction submitAction;

    @Mock
    private FormSubmitInfo formSubmitInfo;

    @BeforeEach
    void setUp() {
        submitAction = new SaveToDAMSubmitAction();
    }

    @Test
    void testGetServiceName() {
        assertEquals("Save to DAM Submit Action", submitAction.getServiceName());
    }

    @Test
    void testSubmitNoAttachments() {
        when(formSubmitInfo.getFileAttachments()).thenReturn(null);

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("success", result.get("status"));
    }

    @Test
    void testSubmitEmptyAttachments() {
        when(formSubmitInfo.getFileAttachments()).thenReturn(Collections.emptyList());

        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        assertNotNull(result);
        assertEquals("success", result.get("status"));
    }
}
