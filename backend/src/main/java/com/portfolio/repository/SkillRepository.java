package com.portfolio.repository;

import com.portfolio.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {
    List<Skill> findAllByOrderBySortOrder();
    List<Skill> findByCategoryOrderBySortOrder(String category);
}
