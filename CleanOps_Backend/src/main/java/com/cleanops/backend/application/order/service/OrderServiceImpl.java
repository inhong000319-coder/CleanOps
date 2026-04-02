package com.cleanops.backend.application.order.service;

import com.cleanops.backend.application.order.dto.request.CreateOrderRequest;
import com.cleanops.backend.application.order.dto.response.CreateOrderResponse;
import com.cleanops.backend.application.order.dto.response.PolicyDecisionDTO;
import com.cleanops.backend.application.order.support.ExternalTagNumberGenerator;
import com.cleanops.backend.application.order.support.OrderNumberGenerator;
import com.cleanops.backend.common.error.BusinessException;
import com.cleanops.backend.common.error.ErrorCode;
import com.cleanops.backend.common.status.OrderItemStatus;
import com.cleanops.backend.common.status.PaymentStatus;
import com.cleanops.backend.domain.audit.entity.AuditLog;
import com.cleanops.backend.domain.audit.entity.StatusHistory;
import com.cleanops.backend.domain.audit.repository.AuditLogRepository;
import com.cleanops.backend.domain.audit.repository.StatusHistoryRepository;
import com.cleanops.backend.domain.order.entity.ExternalTag;
import com.cleanops.backend.domain.order.entity.Order;
import com.cleanops.backend.domain.order.entity.OrderItem;
import com.cleanops.backend.domain.order.entity.Payment;
import com.cleanops.backend.domain.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    private static final String DEFAULT_STORE_CODE = "ST00";
    private static final Long DEFAULT_STORE_ID = 1L;
    private static final Long DEFAULT_ACTOR_USER_ID = 0L;
    private static final String DEFAULT_ACTOR_ROLE = "STORE_STAFF";

    private final OrderRepository orderRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final AuditLogRepository auditLogRepository;
    private final OrderNumberGenerator orderNumberGenerator;
    private final ExternalTagNumberGenerator externalTagNumberGenerator;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            StatusHistoryRepository statusHistoryRepository,
            AuditLogRepository auditLogRepository,
            OrderNumberGenerator orderNumberGenerator,
            ExternalTagNumberGenerator externalTagNumberGenerator
    ) {
        this.orderRepository = orderRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
        this.orderNumberGenerator = orderNumberGenerator;
        this.externalTagNumberGenerator = externalTagNumberGenerator;
    }

    @Override
    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request, String requestId, String idempotencyKey) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, Map.of("items", "At least one item is required."));
        }

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        PaymentStatus paymentStatus = resolvePaymentStatus(request.payment().amount(), request.payment().allowPostpaid());
        OrderItemStatus targetItemStatus = paymentStatus == PaymentStatus.PAID
                ? OrderItemStatus.PAYMENT_COMPLETED
                : OrderItemStatus.PAYMENT_PENDING;

        PolicyDecisionDTO policyDecision = new PolicyDecisionDTO(
                0L,
                "ALLOW",
                Collections.emptyList(),
                Collections.emptyList()
        );

        Order order = new Order(
                orderNumberGenerator.next(DEFAULT_STORE_CODE),
                request.customerId(),
                DEFAULT_STORE_ID,
                null,
                request.orderType(),
                paymentStatus,
                policyDecision.policySnapshotId(),
                policyDecision.policyDecision(),
                now
        );

        Payment payment = new Payment(
                request.payment().method(),
                request.payment().amount(),
                paymentStatus,
                request.payment().allowPostpaid(),
                idempotencyKey,
                paymentStatus == PaymentStatus.PAID ? now : null
        );
        order.addPayment(payment);

        int itemSequence = 1;
        for (CreateOrderRequest.CreateOrderItemRequest itemRequest : request.items()) {
            OrderItem item = new OrderItem(
                    itemRequest.serviceType(),
                    itemRequest.itemName(),
                    itemRequest.quantity(),
                    itemRequest.notes(),
                    OrderItemStatus.RECEIVED,
                    now,
                    now.plusDays(2)
            );

            if (targetItemStatus != OrderItemStatus.RECEIVED) {
                item.updateStatus(targetItemStatus, now);
            }

            ExternalTag externalTag = new ExternalTag(externalTagNumberGenerator.next(DEFAULT_STORE_CODE, itemSequence));
            item.assignExternalTag(externalTag);
            order.addItem(item);
            itemSequence++;
        }

        Order savedOrder = orderRepository.save(order);

        List<StatusHistory> statusHistories = new ArrayList<>();
        for (OrderItem savedItem : savedOrder.getItems()) {
            statusHistories.add(new StatusHistory(
                    savedItem,
                    null,
                    OrderItemStatus.RECEIVED,
                    "ORDER_CREATED",
                    "Initial order item created.",
                    DEFAULT_ACTOR_USER_ID,
                    DEFAULT_ACTOR_ROLE,
                    now
            ));

            if (savedItem.getCurrentStatus() != OrderItemStatus.RECEIVED) {
                statusHistories.add(new StatusHistory(
                        savedItem,
                        OrderItemStatus.RECEIVED,
                        savedItem.getCurrentStatus(),
                        "PAYMENT_REGISTERED",
                        "Status moved after payment decision.",
                        DEFAULT_ACTOR_USER_ID,
                        DEFAULT_ACTOR_ROLE,
                        now
                ));
            }
        }
        statusHistoryRepository.saveAll(statusHistories);

        auditLogRepository.save(new AuditLog(
                "ORDER_CREATED",
                "ORDER",
                savedOrder.getId(),
                DEFAULT_ACTOR_USER_ID,
                DEFAULT_ACTOR_ROLE,
                "Order creation completed.",
                requestId == null ? "req_auto" : requestId,
                "{\"itemCount\":%d}".formatted(savedOrder.getItems().size())
        ));

        List<CreateOrderResponse.OrderItemSummaryDTO> responseItems = savedOrder.getItems()
                .stream()
                .map(item -> new CreateOrderResponse.OrderItemSummaryDTO(
                        item.getId(),
                        item.getExternalTag().getTagFullNo(),
                        item.getCurrentStatus(),
                        item.getDisplayStatus(),
                        item.getCurrentStatus().getAvailableActions(),
                        item.getStatusUpdatedAt(),
                        item.getExpectedFinishAt()
                ))
                .toList();

        return new CreateOrderResponse(
                savedOrder.getId(),
                savedOrder.getOrderNo(),
                savedOrder.getPaymentStatus(),
                responseItems,
                policyDecision
        );
    }

    private PaymentStatus resolvePaymentStatus(BigDecimal amount, boolean allowPostpaid) {
        if (allowPostpaid) {
            return PaymentStatus.PENDING;
        }
        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            return PaymentStatus.PAID;
        }
        return PaymentStatus.PENDING;
    }
}

