package com.cleanops.backend.application.order.dto.response;

import com.cleanops.backend.common.status.OrderItemStatus;
import com.cleanops.backend.common.status.PaymentStatus;

import java.time.OffsetDateTime;
import java.util.List;

public record CreateOrderResponse(
        Long orderId,
        String orderNo,
        PaymentStatus paymentStatus,
        List<OrderItemSummaryDTO> items,
        PolicyDecisionDTO policy
) {
    public record OrderItemSummaryDTO(
            Long orderItemId,
            String externalTagNo,
            OrderItemStatus currentStatus,
            String displayStatus,
            List<String> availableActions,
            OffsetDateTime statusUpdatedAt,
            OffsetDateTime expectedFinishAt
    ) {
    }
}

