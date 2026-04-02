package com.cleanops.backend.common.status;

import java.util.List;

public enum OrderItemStatus {
    RECEIVED("Received", List.of("PAY", "CANCEL", "RECALCULATE_PRICE")),
    PAYMENT_PENDING("Payment Pending", List.of("PAY", "APPROVE_POSTPAID")),
    PAYMENT_COMPLETED("Payment Completed", List.of("REQUEST_COLLECTION", "REQUEST_REFUND")),
    COLLECTION_REQUESTED("Collection Requested", List.of("COLLECT")),
    COLLECTED("Collected", List.of("REGISTER_TO_PLANT_TRANSIT")),
    IN_TRANSIT_TO_PLANT("In Transit To Plant", List.of("MARK_PLANT_RECEIVED")),
    PLANT_RECEIVED("Plant Received", List.of("DECIDE_ROUTING", "MARK_HOLD_FOR_CONFIRMATION")),
    ROUTING_READY("Routing Ready", List.of("START_PROCESSING", "REQUEST_OUTSOURCING")),
    PROCESSING("Processing", List.of("MARK_PROCESS_COMPLETED", "REGISTER_EXCEPTION")),
    PROCESS_COMPLETED("Process Completed", List.of("ENTER_INSPECTION", "REQUEST_REFUND")),
    INSPECTION_PENDING("Inspection Pending", List.of("COMPLETE_INSPECTION")),
    INSPECTION_COMPLETED("Inspection Completed", List.of("PREPARE_SHIPMENT")),
    READY_FOR_SHIPMENT("Ready For Shipment", List.of("REGISTER_TO_STORE_TRANSIT")),
    IN_TRANSIT_TO_STORE("In Transit To Store", List.of("MARK_ARRIVED_AT_STORE")),
    ARRIVED_AT_STORE("Arrived At Store", List.of("PARTIAL_PICKUP", "FULL_PICKUP")),
    PICKED_UP("Picked Up", List.of("REGISTER_CLAIM", "REQUEST_REWASH", "REQUEST_POST_WASH_REFUND")),
    HOLD_FOR_CONFIRMATION("Hold For Confirmation", List.of("REGION_REVIEW")),
    REGION_REVIEW("Region Review", List.of("APPROVE_PROGRESS", "APPROVE_RETURN_TO_STORE")),
    STORE_CONFIRM_PENDING("Store Confirm Pending", List.of("OWNER_APPROVE_PROGRESS", "OWNER_APPROVE_RETURN")),
    RETURNED_TO_STORE("Returned To Store", List.of("RE_RECEIVE", "TERMINATE")),
    OUTSOURCING_REQUESTED("Outsourcing Requested", List.of("OUTSOURCING_RECEIVE")),
    OUTSOURCING_IN_PROGRESS("Outsourcing In Progress", List.of("OUTSOURCING_COMPLETE")),
    OUTSOURCING_COMPLETED("Outsourcing Completed", List.of("MARK_PROCESS_COMPLETED")),
    CLAIM_REQUESTED("Claim Requested", List.of("START_CLAIM_REVIEW")),
    CLAIM_REVIEWING("Claim Reviewing", List.of("APPROVE_REFUND", "APPROVE_COMPENSATION", "APPROVE_REWASH", "REJECT_CLAIM")),
    CLAIM_RESOLVED("Claim Resolved", List.of("CLOSE")),
    REFUND_REQUESTED("Refund Requested", List.of("APPROVE_REFUND", "REJECT_REFUND")),
    REFUND_COMPLETED("Refund Completed", List.of("CLOSE")),
    CLOSED("Closed", List.of()),
    TERMINATED("Terminated", List.of());

    private final String displayStatus;
    private final List<String> availableActions;

    OrderItemStatus(String displayStatus, List<String> availableActions) {
        this.displayStatus = displayStatus;
        this.availableActions = availableActions;
    }

    public String getDisplayStatus() {
        return displayStatus;
    }

    public List<String> getAvailableActions() {
        return availableActions;
    }
}

