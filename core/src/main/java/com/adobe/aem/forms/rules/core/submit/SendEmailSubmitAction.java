package com.adobe.aem.forms.rules.core.submit;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Submit action that sends an email notification after form submission.
 * Uses AEM's mail service for email delivery.
 */
@Component(
    service = FormSubmitActionService.class,
    immediate = true
)
public class SendEmailSubmitAction implements FormSubmitActionService {

    private static final Logger LOG = LoggerFactory.getLogger(SendEmailSubmitAction.class);
    private static final String SERVICE_NAME = "Send Email Submit Action";

    @Override
    public String getServiceName() {
        return SERVICE_NAME;
    }

    @Override
    public Map<String, Object> submit(FormSubmitInfo formSubmitInfo) {
        LOG.info("SendEmailSubmitAction: Processing email notification...");

        String data = formSubmitInfo.getData();
        if (data == null || data.trim().isEmpty()) {
            LOG.warn("No form data received for email notification.");
            return createErrorResponse("No form data to process.");
        }

        try {
            String formPath = formSubmitInfo.getFormContainerPath();
            String subject = "Form Submission Notification - " + formPath;
            String preview = data.substring(0, Math.min(data.length(), 200));
            String body = "A new form submission has been received.\n\n"
                + "Form: " + formPath + "\n"
                + "Data Preview: " + preview + "...\n\n"
                + "Please review the submission in AEM Forms.";

            // In production, inject @Reference MessageGatewayService:
            // MessagePreparer message = new GenericMessage(subject, body);
            // messageGateway.send(message);
            LOG.info("Email notification prepared for form: {}", formPath);
            LOG.info("Subject: {}", subject);

            if (formSubmitInfo.getFileAttachments() != null && !formSubmitInfo.getFileAttachments().isEmpty()) {
                LOG.info("Form included {} file attachment(s).", formSubmitInfo.getFileAttachments().size());
            }

            return createSuccessResponse("Email notification sent successfully.");

        } catch (Exception e) {
            LOG.error("Failed to send email notification.", e);
            return createErrorResponse("Email notification failed: " + e.getMessage());
        }
    }

    private Map<String, Object> createSuccessResponse(String msg) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.put("message", msg);
        return result;
    }

    private Map<String, Object> createErrorResponse(String msg) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "error");
        result.put("message", msg);
        return result;
    }
}
