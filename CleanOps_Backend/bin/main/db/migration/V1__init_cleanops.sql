CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_no VARCHAR(64) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    region_id BIGINT,
    order_type VARCHAR(32) NOT NULL,
    payment_status VARCHAR(32) NOT NULL,
    policy_snapshot_id BIGINT,
    policy_decision VARCHAR(64),
    status_updated_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_item (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    service_type VARCHAR(32) NOT NULL,
    item_name VARCHAR(120) NOT NULL,
    quantity INT NOT NULL,
    notes VARCHAR(1000),
    current_status VARCHAR(64) NOT NULL,
    display_status VARCHAR(120) NOT NULL,
    status_updated_at TIMESTAMPTZ NOT NULL,
    expected_finish_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE external_tag (
    id BIGSERIAL PRIMARY KEY,
    order_item_id BIGINT NOT NULL UNIQUE REFERENCES order_item(id),
    tag_full_no VARCHAR(100) NOT NULL UNIQUE,
    retired BOOLEAN NOT NULL DEFAULT FALSE,
    retired_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    method VARCHAR(32) NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    status VARCHAR(32) NOT NULL,
    allow_postpaid BOOLEAN NOT NULL DEFAULT FALSE,
    idempotency_key VARCHAR(120),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refund (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    refund_no VARCHAR(64) NOT NULL UNIQUE,
    refund_type VARCHAR(32) NOT NULL,
    refund_amount NUMERIC(18, 2) NOT NULL,
    refund_status VARCHAR(32) NOT NULL,
    reason_code VARCHAR(64),
    reason_text VARCHAR(2000),
    approval_required BOOLEAN NOT NULL DEFAULT FALSE,
    attachment_required BOOLEAN NOT NULL DEFAULT FALSE,
    report_required BOOLEAN NOT NULL DEFAULT FALSE,
    requested_by_user_id BIGINT NOT NULL,
    requested_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE claim (
    id BIGSERIAL PRIMARY KEY,
    claim_no VARCHAR(64) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    order_item_id BIGINT REFERENCES order_item(id),
    claim_type VARCHAR(32) NOT NULL,
    claim_status VARCHAR(32) NOT NULL,
    owner_org_type VARCHAR(32) NOT NULL,
    reason_text VARCHAR(2000),
    customer_request VARCHAR(1000),
    approval_required BOOLEAN NOT NULL DEFAULT FALSE,
    attachment_required BOOLEAN NOT NULL DEFAULT FALSE,
    report_required BOOLEAN NOT NULL DEFAULT FALSE,
    urgent BOOLEAN NOT NULL DEFAULT FALSE,
    requested_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE settlement (
    id BIGSERIAL PRIMARY KEY,
    settlement_no VARCHAR(64) NOT NULL UNIQUE,
    settlement_period VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    cutoff_at TIMESTAMPTZ NOT NULL,
    draft_writer_user_id BIGINT NOT NULL,
    confirmer_user_id BIGINT,
    policy_snapshot_id BIGINT,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE settlement_line (
    id BIGSERIAL PRIMARY KEY,
    settlement_id BIGINT NOT NULL REFERENCES settlement(id),
    source_type VARCHAR(32) NOT NULL,
    source_id BIGINT NOT NULL,
    order_item_id BIGINT,
    line_type VARCHAR(32) NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    owner_org_id BIGINT NOT NULL,
    description VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE settlement_adjustment (
    id BIGSERIAL PRIMARY KEY,
    settlement_id BIGINT NOT NULL REFERENCES settlement(id),
    settlement_line_id BIGINT REFERENCES settlement_line(id),
    reason_code VARCHAR(64) NOT NULL,
    reason_text VARCHAR(2000),
    amount NUMERIC(18, 2) NOT NULL,
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE status_history (
    id BIGSERIAL PRIMARY KEY,
    order_item_id BIGINT NOT NULL REFERENCES order_item(id),
    from_status VARCHAR(64),
    to_status VARCHAR(64) NOT NULL,
    reason_code VARCHAR(64),
    reason_text VARCHAR(2000),
    changed_by_user_id BIGINT NOT NULL,
    changed_by_role VARCHAR(64) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    actor_user_id BIGINT NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    reason_text VARCHAR(2000),
    request_id VARCHAR(120) NOT NULL,
    details_json TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE attachment (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(120) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_key VARCHAR(512) NOT NULL,
    uploaded_by BIGINT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_item_order_id ON order_item(order_id);
CREATE INDEX idx_payment_order_id ON payment(order_id);
CREATE INDEX idx_refund_order_id ON refund(order_id);
CREATE INDEX idx_claim_order_id ON claim(order_id);
CREATE INDEX idx_claim_order_item_id ON claim(order_item_id);
CREATE INDEX idx_status_history_order_item_id ON status_history(order_item_id);
CREATE INDEX idx_status_history_changed_at ON status_history(changed_at);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_settlement_line_settlement_id ON settlement_line(settlement_id);
CREATE INDEX idx_settlement_adjustment_settlement_id ON settlement_adjustment(settlement_id);

