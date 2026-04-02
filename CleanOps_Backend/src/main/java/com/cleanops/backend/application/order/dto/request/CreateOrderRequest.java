package com.cleanops.backend.application.order.dto.request;

import com.cleanops.backend.domain.order.type.OrderType;
import com.cleanops.backend.domain.order.type.PaymentMethod;
import com.cleanops.backend.domain.order.type.ServiceType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreateOrderRequest(
        @NotNull Long customerId,
        @NotNull OrderType orderType,
        @NotEmpty List<@Valid CreateOrderItemRequest> items,
        String couponCode,
        @NotNull @Valid CreatePaymentRequest payment
) {
    public record CreateOrderItemRequest(
            @NotNull ServiceType serviceType,
            @NotBlank String itemName,
            @NotNull @Min(1) Integer quantity,
            List<String> options,
            String notes,
            List<Long> photoAttachmentIds
    ) {
    }

    public record CreatePaymentRequest(
            @NotNull PaymentMethod method,
            @NotNull @DecimalMin("0.00") BigDecimal amount,
            boolean allowPostpaid
    ) {
    }
}

