package com.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Async
    public void sendContactNotification(String senderName, String senderEmail, String subject, String message) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(adminEmail);
            mail.setSubject("Portfolio Contact: " + (subject != null ? subject : "New Message"));
            mail.setText(String.format(
                    "New contact form submission:\n\nFrom: %s (%s)\nSubject: %s\n\nMessage:\n%s",
                    senderName, senderEmail, subject, message
            ));
            mail.setReplyTo(senderEmail);
            mailSender.send(mail);
            logger.info("Contact notification email sent for: {}", senderEmail);
        } catch (Exception e) {
            logger.error("Failed to send contact notification email: {}", e.getMessage());
        }
    }
}
