package com.cleanops.backend.common.error;

import com.cleanops.backend.common.api.ApiErrorResponse;
import com.cleanops.backend.common.api.ResponseMeta;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        ErrorCode errorCode = ex.getErrorCode();
        String requestId = getRequestId(request);
        ApiErrorResponse response = ApiErrorResponse.of(
                errorCode.getCode(),
                errorCode.getMessage(),
                ex.getDetails(),
                errorCode.isRetryable(),
                errorCode.isApprovalRequired(),
                errorCode.isAttachmentRequired(),
                errorCode.isReportRequired(),
                ResponseMeta.now(requestId)
        );
        return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        Map<String, Object> details = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            details.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        String requestId = getRequestId(request);
        ApiErrorResponse response = ApiErrorResponse.of(
                ErrorCode.VALIDATION_FAILED.getCode(),
                ErrorCode.VALIDATION_FAILED.getMessage(),
                details,
                ErrorCode.VALIDATION_FAILED.isRetryable(),
                ErrorCode.VALIDATION_FAILED.isApprovalRequired(),
                ErrorCode.VALIDATION_FAILED.isAttachmentRequired(),
                ErrorCode.VALIDATION_FAILED.isReportRequired(),
                ResponseMeta.now(requestId)
        );
        return ResponseEntity.status(ErrorCode.VALIDATION_FAILED.getHttpStatus()).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnhandledException(Exception ex, HttpServletRequest request) {
        String requestId = getRequestId(request);
        ApiErrorResponse response = ApiErrorResponse.of(
                ErrorCode.INTERNAL_ERROR.getCode(),
                ErrorCode.INTERNAL_ERROR.getMessage(),
                Map.of("exception", ex.getClass().getSimpleName()),
                ErrorCode.INTERNAL_ERROR.isRetryable(),
                ErrorCode.INTERNAL_ERROR.isApprovalRequired(),
                ErrorCode.INTERNAL_ERROR.isAttachmentRequired(),
                ErrorCode.INTERNAL_ERROR.isReportRequired(),
                ResponseMeta.now(requestId)
        );
        return ResponseEntity.status(ErrorCode.INTERNAL_ERROR.getHttpStatus()).body(response);
    }

    private String getRequestId(HttpServletRequest request) {
        String fromHeader = request.getHeader("X-Request-Id");
        return fromHeader == null || fromHeader.isBlank() ? "req_" + UUID.randomUUID() : fromHeader;
    }
}

