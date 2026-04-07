package com.portfolio.service;

import com.portfolio.dto.request.MgmLifeItemRequest;
import com.portfolio.entity.MgmLifeItem;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.MgmLifeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MgmLifeItemService {

    private final MgmLifeItemRepository repository;

    public List<MgmLifeItem> getPublished() {
        return repository.findByPublishedTrueOrderBySortOrderAsc();
    }

    public List<MgmLifeItem> getAll() {
        return repository.findAllByOrderBySortOrderAsc();
    }

    public MgmLifeItem getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MgmLifeItem", "id", id));
    }

    public MgmLifeItem create(MgmLifeItemRequest request) {
        MgmLifeItem item = MgmLifeItem.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .mediaType(request.getMediaType() != null ? request.getMediaType() : "IMAGE")
                .mediaUrl(request.getMediaUrl())
                .thumbnailUrl(request.getThumbnailUrl())
                .category(request.getCategory() != null ? request.getCategory() : "GENERAL")
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .published(request.getPublished() != null ? request.getPublished() : true)
                .build();
        return repository.save(item);
    }

    public MgmLifeItem update(UUID id, MgmLifeItemRequest request) {
        MgmLifeItem item = getById(id);
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        if (request.getMediaType() != null) item.setMediaType(request.getMediaType());
        item.setMediaUrl(request.getMediaUrl());
        item.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getCategory() != null) item.setCategory(request.getCategory());
        if (request.getSortOrder() != null) item.setSortOrder(request.getSortOrder());
        if (request.getPublished() != null) item.setPublished(request.getPublished());
        return repository.save(item);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("MgmLifeItem", "id", id);
        }
        repository.deleteById(id);
    }
}
