package com.cleanops.backend.application.order.dto.response;

import java.util.List;

public record PolicyDecisionDTO(
        Long policySnapshotId,
        String policyDecision,
        List<String> obligations,
        List<String> reasonCodes
) {
}

