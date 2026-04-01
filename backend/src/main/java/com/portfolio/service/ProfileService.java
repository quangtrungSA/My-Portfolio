package com.portfolio.service;

import com.portfolio.dto.request.ProfileRequest;
import com.portfolio.entity.Profile;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository repository;

    public List<Profile> getAll() {
        return repository.findAll();
    }

    public Profile getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", id));
    }

    public Profile update(UUID id, ProfileRequest request) {
        Profile profile = getById(id);
        profile.setName(request.getName());
        profile.setTitle(request.getTitle());
        profile.setBio(request.getBio());
        profile.setAvatarUrl(request.getAvatarUrl());
        profile.setResumeUrl(request.getResumeUrl());
        profile.setSocialLinks(request.getSocialLinks());
        profile.setLocation(request.getLocation());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setMetaTitle(request.getMetaTitle());
        profile.setMetaDescription(request.getMetaDescription());
        profile.setOgImageUrl(request.getOgImageUrl());
        profile.setTagline(request.getTagline());
        profile.setAvailableForHire(request.getAvailableForHire());
        return repository.save(profile);
    }
}
