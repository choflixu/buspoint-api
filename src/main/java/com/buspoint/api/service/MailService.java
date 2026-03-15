package com.buspoint.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("BusPoint — Password Reset");
        message.setText("Use this token to reset your password:\n\n" + token +
                "\n\nThis link expires in 1 hour.");
        mailSender.send(message);
    }

    public void sendTicketConfirmation(String to, String ticketId, String routeName) {
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
