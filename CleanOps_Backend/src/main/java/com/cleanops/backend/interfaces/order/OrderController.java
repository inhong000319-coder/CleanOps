package com.cleanops.backend.interfaces.order;

import com.cleanops.backend.application.order.dto.request.CreateOrderRequest;
import com.cleanops.backend.application.order.dto.response.CreateOrderResponse;
import com.cleanops.backend.application.order.service.OrderService;
import com.cleanops.backend.common.api.ApiResponse;
import com.cleanops.backend.common.api.ResponseMeta;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createOrder(
            @RequestHeader("X-Request-Id") String requestId,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody @Valid CreateOrderRequest request
    ) {
        CreateOrderResponse response = orderService.createOrder(request, requestId, idempotencyKey);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, ResponseMeta.now(requestId)));
    }
}

