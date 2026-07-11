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
class CustomRulesFormSubmitActionTest {

    private CustomRulesFormSubmitAction submitAction;

    @Mock
    private FormSubmitInfo formSubmitInfo;

    @BeforeEach
    void setUp() {
        submitAction = new CustomRulesFormSubmitAction();
    }

    @Test
    void testGetServiceName() {
        assertEquals("Custom Rules Editor Submit Action", submitAction.getServiceName());
    }

    @Test
    void testSubmitSuccess() {
        // Arrange
        String testData = "{\"firstName\":\"John\",\"lastName\":\"Doe\"}";
        when(formSubmitInfo.getData()).thenReturn(testData);

        // Act
        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        // Assert
        assertNotNull(result);
        assertEquals("success", result.get("status"));
        assertTrue(result.containsKey("message"));
        verify(formSubmitInfo, times(1)).getData();
    }

    @Test
    void testSubmitErrorEmptyData() {
        // Arrange
        when(formSubmitInfo.getData()).thenReturn("");

        // Act
        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        // Assert
        assertNotNull(result);
        assertEquals("error", result.get("status"));
        assertTrue(result.containsKey("message"));
    }

    @Test
    void testSubmitErrorNullData() {
        // Arrange
        when(formSubmitInfo.getData()).thenReturn(null);

        // Act
        Map<String, Object> result = submitAction.submit(formSubmitInfo);

        // Assert
        assertNotNull(result);
        assertEquals("error", result.get("status"));
        assertTrue(result.containsKey("message"));
    }
}
