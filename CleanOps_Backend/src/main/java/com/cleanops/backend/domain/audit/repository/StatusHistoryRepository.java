package com.cleanops.backend.domain.audit.repository;

import com.cleanops.backend.domain.audit.entity.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
}
