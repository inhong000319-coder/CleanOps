package com.cleanops.backend.application.order.support;

import com.cleanops.backend.domain.order.repository.OrderRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class OrderNumberGenerator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.BASIC_ISO_DATE;

    private final OrderRepository orderRepository;

    public OrderNumberGenerator(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public String next(String storeCode) {
        String businessDate = LocalDate.now(ZoneOffset.UTC).format(DATE_FORMATTER);
        String normalizedStoreCode = storeCode == null || storeCode.isBlank() ? "ST00" : storeCode;

        for (int i = 0; i < 100; i++) {
            int random = ThreadLocalRandom.current().nextInt(1, 10000);
            String candidate = "%s-%s-%04d".formatted(normalizedStoreCode, businessDate, random);
            if (!orderRepository.existsByOrderNo(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Unable to generate unique order number.");
    }
}
