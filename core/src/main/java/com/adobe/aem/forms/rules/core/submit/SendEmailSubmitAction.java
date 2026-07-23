package com.adobe.aem.forms.rules.core.submit;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Component(
    service = FormSubmitActionService.class,
    immediate = true,
    property = {
        "service.description=Send Email Submit Action with real SMTP"
    }
)
public class SendEmailSubmitAction implements FormSubmitActionService {

    private static final Logger LOG = LoggerFactory.getLogger(SendEmailSubmitAction.class);
    private static final String SERVICE_NAME = "Send Email Submit Action";

    private volatile String smtpHost = "localhost";
    private volatile int smtpPort = 25;
    private volatile String smtpUsername = "";
    private volatile String smtpPassword = "";
    private volatile String smtpFrom = "noreply@example.com";
    private volatile String smtpTo = "admin@example.com";
    private volatile boolean useStartTls = false;
    private volatile int connectionTimeout = 5000;
    private volatile int readTimeout = 5000;

    public void setSmtpHost(String host) { this.smtpHost = host; }
    public void setSmtpPort(int port) { this.smtpPort = port; }
    public void setSmtpUsername(String username) { this.smtpUsername = username; }
    public void setSmtpPassword(String password) { this.smtpPassword = password; }
    public void setSmtpFrom(String from) { this.smtpFrom = from; }
    public void setSmtpTo(String to) { this.smtpTo = to; }
    public void setUseStartTls(boolean useTls) { this.useStartTls = useTls; }

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
            String subject = "Form Submission Notification \u2014 " + formPath;
            String body = buildEmailBody(formSubmitInfo, formPath, data);

            String[] recipients = smtpTo.split(",");
            for (String recipient : recipients) {
                sendEmail(subject, body, recipient.trim());
            }

            int attachmentCount = (formSubmitInfo.getFileAttachments() != null)
                ? formSubmitInfo.getFileAttachments().size() : 0;

            LOG.info("Email sent to {} recipient(s) for form: {} ({} attachments)",
                recipients.length, formPath, attachmentCount);

            return createSuccessResponse("Email sent to " + recipients.length + " recipient(s).");

        } catch (Exception e) {
            LOG.error("Failed to send email notification.", e);
            return createErrorResponse("Email failed: " + e.getMessage());
        }
    }

    protected void sendEmail(String subject, String body, String toAddress) throws MessagingException {
        Properties props = new Properties();
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", String.valueOf(smtpPort));
        props.put("mail.smtp.auth", (smtpUsername != null && !smtpUsername.isEmpty()) ? "true" : "false");
        props.put("mail.smtp.connectiontimeout", String.valueOf(connectionTimeout));
        props.put("mail.smtp.timeout", String.valueOf(readTimeout));

        if (useStartTls) {
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        }

        Session session;
        if (smtpUsername != null && !smtpUsername.isEmpty()) {
            session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(smtpUsername, smtpPassword);
                }
            });
        } else {
            session = Session.getInstance(props);
        }

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(smtpFrom));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toAddress));
        message.setSubject(subject, "UTF-8");

        MimeBodyPart textPart = new MimeBodyPart();
        textPart.setText(body, "UTF-8", "plain");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(textPart);
        message.setContent(multipart);

        Transport.send(message);
    }

    private String buildEmailBody(FormSubmitInfo formSubmitInfo, String formPath, String data) {
        StringBuilder sb = new StringBuilder();
        sb.append("A new form submission has been received.\n\n");
        sb.append("Form: ").append(formPath).append("\n");
        sb.append("Timestamp: ").append(java.time.Instant.now().toString()).append("\n\n");

        String preview = data.length() > 500 ? data.substring(0, 500) + "..." : data;
        sb.append("Submission Data:\n").append(preview).append("\n\n");

        if (formSubmitInfo.getFileAttachments() != null && !formSubmitInfo.getFileAttachments().isEmpty()) {
            sb.append("Attachments: ").append(formSubmitInfo.getFileAttachments().size()).append(" file(s)\n");
        }

        sb.append("\nPlease review the submission in AEM Forms.");
        return sb.toString();
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
