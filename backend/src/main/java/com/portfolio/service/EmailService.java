package com.portfolio.service;

import com.portfolio.repository.ContactRepository;
import com.portfolio.repository.ProfileRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm z");

    private final JavaMailSender mailSender;
    private final ProfileRepository profileRepository;
    private final ContactRepository contactRepository;

    @Value("${app.admin.email}")
    private String adminEmailFallback;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    /**
     * Resolve recipient email: prefer profile.email → fallback to ADMIN_EMAIL env var.
     */
    private String resolveRecipientEmail() {
        return profileRepository.findAll().stream()
                .filter(p -> p.getEmail() != null && !p.getEmail().isBlank())
                .map(p -> p.getEmail())
                .findFirst()
                .orElse(adminEmailFallback);
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Async fire-and-forget: sends HTML email in background thread.
     * HTTP response is returned immediately — SMTP never blocks the request.
     * Updates contact.email_sent = true on success.
     */
    @Async
    public void sendContactNotificationAsync(UUID contactId,
                                             String senderName, String senderEmail,
                                             String subject, String message) {
        // Skip if mail is not configured
        if (fromEmail == null || fromEmail.isBlank()) {
            logger.warn("MAIL_USERNAME not configured — email notification skipped for contact id={}", contactId);
            return;
        }

        String recipientEmail = resolveRecipientEmail();
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");

            String displayFrom = (fromEmail != null && !fromEmail.isBlank())
                    ? fromEmail : recipientEmail;

            helper.setFrom(displayFrom, "Portfolio Contact Form");
            helper.setTo(recipientEmail);
            helper.setReplyTo(senderEmail, senderName);
            helper.setSubject("[Portfolio] " + (subject != null && !subject.isBlank()
                    ? subject : "New Message") + " — from " + senderName);
            helper.setText(buildHtml(senderName, senderEmail, subject, message), true);

            mailSender.send(mime);
            logger.info("Email sent → {} | from: {} <{}>", recipientEmail, senderName, senderEmail);

            // Mark email_sent in DB
            contactRepository.findById(contactId).ifPresent(c -> {
                c.setEmailSent(true);
                c.setEmailSentAt(Instant.now());
                contactRepository.save(c);
            });
        } catch (Exception e) {
            logger.error("Failed to send contact email to {}: {}", recipientEmail, e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // HTML template
    // -------------------------------------------------------------------------

    private String buildHtml(String senderName, String senderEmail,
                              String subject, String message) {

        String timestamp = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
                .format(FORMATTER);

        String safeMessage = escapeHtml(message)
                .replace("\n", "<br>");

        String safeSubject  = escapeHtml(subject  != null ? subject  : "(no subject)");
        String safeName     = escapeHtml(senderName);
        String safeEmail    = escapeHtml(senderEmail);

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>New Contact Message</title>
            </head>
            <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">

              <!-- Wrapper -->
              <table width="100%%" cellpadding="0" cellspacing="0"
                     style="background:#0f172a;padding:40px 16px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0"
                           style="max-width:600px;width:100%%;">

                      <!-- Header -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#1e3a5f 0%%,#1e293b 100%%);
                                   border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
                          <div style="display:inline-block;background:rgba(59,130,246,0.15);
                                      border:1px solid rgba(59,130,246,0.3);
                                      border-radius:50%%;padding:14px;margin-bottom:16px;">
                            <!-- Envelope icon -->
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <rect x="2" y="4" width="20" height="16" rx="3"
                                    stroke="#60a5fa" stroke-width="1.8"/>
                              <path d="M2 7l10 7 10-7" stroke="#60a5fa" stroke-width="1.8"
                                    stroke-linecap="round"/>
                            </svg>
                          </div>
                          <h1 style="margin:0;font-size:22px;font-weight:700;
                                     color:#f1f5f9;letter-spacing:-0.3px;">
                            New Contact Message
                          </h1>
                          <p style="margin:6px 0 0;font-size:13px;color:#94a3b8;">
                            Received via your portfolio contact form
                          </p>
                        </td>
                      </tr>

                      <!-- Top accent line -->
                      <tr>
                        <td style="height:3px;
                                   background:linear-gradient(90deg,#3b82f6,#06b6d4,#3b82f6);"></td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="background:#1e293b;padding:32px 40px;">

                          <!-- Sender info card -->
                          <table width="100%%" cellpadding="0" cellspacing="0"
                                 style="background:#0f172a;border:1px solid #334155;
                                        border-radius:12px;margin-bottom:24px;">
                            <tr>
                              <td style="padding:20px 24px;">
                                <p style="margin:0 0 12px;font-size:11px;font-weight:600;
                                          letter-spacing:1px;text-transform:uppercase;
                                          color:#64748b;">Sender</p>

                                <!-- Name row -->
                                <table cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                                  <tr>
                                    <td style="padding-right:10px;">
                                      <div style="width:32px;height:32px;border-radius:50%%;
                                                  background:linear-gradient(135deg,#3b82f6,#06b6d4);
                                                  display:flex;align-items:center;justify-content:center;
                                                  font-size:14px;font-weight:700;color:#fff;
                                                  text-align:center;line-height:32px;">
                                        %s
                                      </div>
                                    </td>
                                    <td>
                                      <p style="margin:0;font-size:15px;font-weight:600;
                                                color:#f1f5f9;">%s</p>
                                      <a href="mailto:%s"
                                         style="font-size:13px;color:#60a5fa;
                                                text-decoration:none;">%s</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Subject -->
                          <table width="100%%" cellpadding="0" cellspacing="0"
                                 style="margin-bottom:20px;">
                            <tr>
                              <td style="background:#0f172a;border:1px solid #334155;
                                         border-left:3px solid #3b82f6;
                                         border-radius:0 8px 8px 0;padding:12px 16px;">
                                <p style="margin:0 0 4px;font-size:11px;font-weight:600;
                                          letter-spacing:1px;text-transform:uppercase;
                                          color:#64748b;">Subject</p>
                                <p style="margin:0;font-size:15px;font-weight:600;
                                          color:#e2e8f0;">%s</p>
                              </td>
                            </tr>
                          </table>

                          <!-- Message -->
                          <table width="100%%" cellpadding="0" cellspacing="0"
                                 style="margin-bottom:28px;">
                            <tr>
                              <td>
                                <p style="margin:0 0 10px;font-size:11px;font-weight:600;
                                          letter-spacing:1px;text-transform:uppercase;
                                          color:#64748b;">Message</p>
                                <div style="background:#0f172a;border:1px solid #334155;
                                            border-radius:10px;padding:20px 24px;">
                                  <p style="margin:0;font-size:15px;line-height:1.7;
                                            color:#cbd5e1;white-space:pre-wrap;">%s</p>
                                </div>
                              </td>
                            </tr>
                          </table>

                          <!-- Reply CTA -->
                          <table width="100%%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center">
                                <a href="mailto:%s?subject=Re%%3A%%20%s"
                                   style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0891b2);
                                          color:#fff;text-decoration:none;font-size:14px;
                                          font-weight:600;padding:13px 32px;border-radius:8px;
                                          letter-spacing:0.3px;">
                                  ✉&nbsp; Reply to %s
                                </a>
                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background:#0f172a;border-radius:0 0 16px 16px;
                                   padding:20px 40px;border-top:1px solid #1e293b;">
                          <table width="100%%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td>
                                <p style="margin:0;font-size:12px;color:#475569;">
                                  🕐 Received: %s (ICT)
                                </p>
                              </td>
                              <td align="right">
                                <p style="margin:0;font-size:12px;color:#334155;">
                                  Ly Van Quang Trung · Portfolio
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

            </body>
            </html>
            """.formatted(
                // Avatar initial
                safeName.isEmpty() ? "?" : safeName.substring(0, 1).toUpperCase(),
                // Sender name, email (x2)
                safeName, safeEmail, safeEmail,
                // Subject
                safeSubject,
                // Message body
                safeMessage,
                // Reply-to mailto href
                safeEmail, encodeUriComponent("Re: " + (subject != null ? subject : "")),
                // Reply button label
                safeName,
                // Timestamp
                timestamp
        );
    }

    // -------------------------------------------------------------------------
    // Utilities
    // -------------------------------------------------------------------------

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input
                .replace("&",  "&amp;")
                .replace("<",  "&lt;")
                .replace(">",  "&gt;")
                .replace("\"", "&quot;")
                .replace("'",  "&#39;");
    }

    private String encodeUriComponent(String value) {
        try {
            return java.net.URLEncoder.encode(value, "UTF-8").replace("+", "%%20");
        } catch (Exception e) {
            return value;
        }
    }
}
