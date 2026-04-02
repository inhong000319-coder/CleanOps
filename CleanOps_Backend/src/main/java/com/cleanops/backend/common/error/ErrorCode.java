package com.cleanops.backend.common.error;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    INVALID_REQUEST("INVALID_REQUEST", "Invalid request payload.", HttpStatus.BAD_REQUEST, false, false, false, false),
    VALIDATION_FAILED("VALIDATION_FAILED", "Request validation failed.", HttpStatus.BAD_REQUEST, false, false, false, false),
    ORDER_NOT_FOUND("ORDER_NOT_FOUND", "Order not found.", HttpStatus.NOT_FOUND, false, false, false, false),
    ORDER_ITEM_STATUS_INVALID("ORDER_ITEM_STATUS_INVALID", "Action is not allowed at the current item status.", HttpStatus.CONFLICT, false, false, false, false),
    POLICY_EVALUATION_FAILED("POLICY_EVALUATION_FAILED", "Policy evaluation failed temporarily.", HttpStatus.SERVICE_UNAVAILABLE, true, false, false, false),
    APPROVAL_REQUIRED("APPROVAL_REQUIRED", "Approval is required before this action.", HttpStatus.FORBIDDEN, false, true, true, true),
    ATTACHMENT_REQUIRED("ATTACHMENT_REQUIRED", "Attachment is required for this action.", HttpStatus.BAD_REQUEST, false, false, true, false),
    DUPLICATE_SCAN_EVENT("DUPLICATE_SCAN_EVENT", "Duplicate scan event detected.", HttpStatus.CONFLICT, false, false, false, false),
    IDEMPOTENCY_REPLAY("IDEMPOTENCY_REPLAY", "Duplicated idempotency key replay detected.", HttpStatus.CONFLICT, false, false, false, false),
    EXTERNAL_TAG_CONFLICT("EXTERNAL_TAG_CONFLICT", "External tag number already exists.", HttpStatus.CONFLICT, true, false, false, false),
    SETTLEMENT_LOCKED("SETTLEMENT_LOCKED", "Confirmed settlement cannot be modified directly.", HttpStatus.CONFLICT, false, false, false, false),
    INTERNAL_ERROR("INTERNAL_ERROR", "Unexpected internal server error.", HttpStatus.INTERNAL_SERVER_ERROR, true, false, false, false);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
    private final boolean retryable;
    private final boolean approvalRequired;
    private final boolean attachmentRequired;
    private final boolean reportRequired;

    ErrorCode(
            String code,
            String message,
            HttpStatus httpStatus,
            boolean retryable,
            boolean approvalRequired,
            boolean attachmentRequired,
            boolean reportRequired
    ) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
        this.retryable = retryable;
        this.approvalRequired = approvalRequired;
        this.attachmentRequired = attachmentRequired;
        this.reportRequired = reportRequired;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public boolean isRetryable() {
        return retryable;
    }

    public boolean isApprovalRequired() {
        return approvalRequired;
    }

    public boolean isAttachmentRequired() {
        return attachmentRequired;
    }

    public boolean isReportRequired() {
        return reportRequired;
    }
}

