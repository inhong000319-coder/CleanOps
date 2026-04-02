package com.cleanops.backend.common.api;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(
        boolean success,
        ErrorBody error,
        ResponseMeta meta
) {
    public static ApiErrorResponse of(
            String code,
            String message,
            Map<String, Object> details,
            boolean retryable,
            boolean approvalRequired,
            boolean attachmentRequired,
            boolean reportRequired,
            ResponseMeta meta
    ) {
        return new ApiErrorResponse(
                false,
                new ErrorBody(
                        code,
                        message,
                        details,
                        retryable,
                        approvalRequired,
                        attachmentRequired,
                        reportRequired
                ),
                meta
        );
    }

    public record ErrorBody(
            String code,
            String message,
            Map<String, Object> details,
            boolean retryable,
            boolean approvalRequired,
            boolean attachmentRequired,
            boolean reportRequired
    ) {
    }
}

