package com.cleanops.backend.application.order.support;

import com.cleanops.backend.common.error.BusinessException;
import com.cleanops.backend.common.error.ErrorCode;
import com.cleanops.backend.domain.order.repository.ExternalTagRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class ExternalTagNumberGenerator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyMMdd");

    private final ExternalTagRepository externalTagRepository;

    public ExternalTagNumberGenerator(ExternalTagRepository externalTagRepository) {
        this.externalTagRepository = externalTagRepository;
    }

    public String next(String storeCode, int sequence) {
        String normalizedStoreCode = storeCode == null || storeCode.isBlank() ? "ST00" : storeCode;
        String businessDate = LocalDate.now(ZoneOffset.UTC).format(DATE_FORMATTER);

        for (int i = 0; i < 100; i++) {
            int salt = ThreadLocalRandom.current().nextInt(100, 999);
            String candidate = "%s-%s-%03d-%02d".formatted(normalizedStoreCode, businessDate, salt, sequence);
            if (!externalTagRepository.existsByTagFullNo(candidate)) {
                return candidate;
            }
        }

        throw new BusinessException(ErrorCode.EXTERNAL_TAG_CONFLICT);
    }
}
