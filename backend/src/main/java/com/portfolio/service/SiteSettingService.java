package com.portfolio.service;

import com.portfolio.dto.request.SiteSettingRequest;
import com.portfolio.entity.SiteSetting;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.SiteSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SiteSettingService {

    private final SiteSettingRepository repository;

    public List<SiteSetting> getAll() {
        return repository.findAll();
    }

    public SiteSetting getByKey(String key) {
        return repository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("SiteSetting", "key", key));
    }

    public SiteSetting upsert(SiteSettingRequest request) {
        Optional<SiteSetting> existing = repository.findByKey(request.getKey());

        if (existing.isPresent()) {
            SiteSetting setting = existing.get();
            setting.setValue(request.getValue());
            if (request.getType() != null) setting.setType(request.getType());
            if (request.getDescription() != null) setting.setDescription(request.getDescription());
            return repository.save(setting);
        }

        SiteSetting setting = SiteSetting.builder()
                .key(request.getKey())
                .value(request.getValue())
                .type(request.getType() != null ? request.getType() : "string")
                .description(request.getDescription())
                .build();
        return repository.save(setting);
    }
}
