package com.portfolio.repository;

import com.portfolio.entity.MgmLifeItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MgmLifeItemRepository extends JpaRepository<MgmLifeItem, UUID> {

    List<MgmLifeItem> findByPublishedTrueOrderBySortOrderAsc();

    List<MgmLifeItem> findAllByOrderBySortOrderAsc();

    List<MgmLifeItem> findByPublishedTrueAndCategoryOrderBySortOrderAsc(String category);
}
