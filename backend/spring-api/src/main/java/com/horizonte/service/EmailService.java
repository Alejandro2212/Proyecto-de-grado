package com.horizonte.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // =========================
    // ENVIAR CORREO
    // =========================
    public void enviarCorreo(

            String destino,

            String asunto,

            String mensaje
    ) {

        SimpleMailMessage mail =
                new SimpleMailMessage();

        mail.setTo(destino);

        mail.setSubject(asunto);

        mail.setText(mensaje);

        mailSender.send(mail);
    }
}