package com.portfolio.service;

import com.portfolio.dto.request.ContactRequest;
import com.portfolio.entity.Contact;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository repository;
    private final EmailService emailService;

    public List<Contact> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public long getUnreadCount() {
        return repository.countByReadFalse();
    }

    public Contact create(ContactRequest request) {
        Contact contact = Contact.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        Contact saved = repository.save(contact);

        // Send notification email
        emailService.sendContactNotification(
                request.getName(), request.getEmail(), request.getSubject(), request.getMessage()
        );

        return saved;
    }

    public Contact toggleRead(UUID id) {
        Contact contact = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));
        contact.setRead(!contact.getRead());
        return repository.save(contact);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Contact", "id", id);
        }
        repository.deleteById(id);
    }
}
