package com.cleanops.backend.common.api;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record ResponseMeta(
        String requestId,
        OffsetDateTime timestamp,
        String nextCursor,
        Long totalCount
) {
    public static ResponseMeta now(String requestId) {
        return new ResponseMeta(requestId, OffsetDateTime.now(ZoneOffset.UTC), null, null);
    }

    public static ResponseMeta page(String requestId, String nextCursor, Long totalCount) {
        return new ResponseMeta(requestId, OffsetDateTime.now(ZoneOffset.UTC), nextCursor, totalCount);
    }
}

