package com.cleanops.backend.domain.order.repository;

import com.cleanops.backend.domain.order.entity.ExternalTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExternalTagRepository extends JpaRepository<ExternalTag, Long> {
    boolean existsByTagFullNo(String tagFullNo);
}
