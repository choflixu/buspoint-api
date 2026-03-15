package com.buspoint.api.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class MailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String token) {
        if (mailSender == null) {
            log.warn("Mail not configured — skipping password reset email to {}", to);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("BusPoint — Password Reset");
        message.setText("Use this token to reset your password:\n\n" + token +
                "\n\nThis link expires in 1 hour.");
        mailSender.send(message);
    }

    public void sendTicketConfirmation(String to, String ticketId, String routeName) {
        if (mailSender == null) {
            log.warn("Mail not configured — skipping ticket confirmation email to {}", to);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("BusPoint — Booking Confirmed");
        message.setText("Your ticket has been confirmed!\n\n" +
                "Route: " + routeName + "\n" +
                "Ticket ID: " + ticketId + "\n\n" +
                "Show this ID or your QR code when boarding.");
        mailSender.send(message);
    }
}
