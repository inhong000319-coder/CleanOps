package com.cleanops.backend.application.order.service;

import com.cleanops.backend.application.order.dto.request.CreateOrderRequest;
import com.cleanops.backend.application.order.dto.response.CreateOrderResponse;

public interface OrderService {
    CreateOrderResponse createOrder(CreateOrderRequest request, String requestId, String idempotencyKey);
}
