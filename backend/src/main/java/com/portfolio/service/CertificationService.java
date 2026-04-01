package com.portfolio.service;

import com.portfolio.dto.request.CertificationRequest;
import com.portfolio.entity.Certification;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository repository;

    public List<Certification> getAll() {
        return repository.findAllByOrderBySortOrder();
    }

    public Certification getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));
    }

    public Certification create(CertificationRequest request) {
        Certification certification = Certification.builder()
                .name(request.getName())
                .issuingOrg(request.getIssuingOrg())
                .credentialId(request.getCredentialId())
                .credentialUrl(request.getCredentialUrl())
                .badgeUrl(request.getBadgeUrl())
                .issueDate(request.getIssueDate())
                .expiryDate(request.getExpiryDate())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        return repository.save(certification);
    }

    public Certification update(UUID id, CertificationRequest request) {
        Certification certification = getById(id);
        certification.setName(request.getName());
        certification.setIssuingOrg(request.getIssuingOrg());
        certification.setCredentialId(request.getCredentialId());
        certification.setCredentialUrl(request.getCredentialUrl());
        certification.setBadgeUrl(request.getBadgeUrl());
        certification.setIssueDate(request.getIssueDate());
        certification.setExpiryDate(request.getExpiryDate());
        if (request.getSortOrder() != null) certification.setSortOrder(request.getSortOrder());
        return repository.save(certification);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Certification", "id", id);
        }
        repository.deleteById(id);
    }
}
