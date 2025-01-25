package com.email_writer.service;

import com.email_writer.dto.EmailRequest;

public interface EmailGeneratorService {

    public String generateEmailReply(EmailRequest emailRequest);
}
