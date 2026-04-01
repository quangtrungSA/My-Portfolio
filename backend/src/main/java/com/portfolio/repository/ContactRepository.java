package com.portfolio.repository;

import com.portfolio.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID> {
    List<Contact> findAllByOrderByCreatedAtDesc();
    long countByReadFalse();
}
