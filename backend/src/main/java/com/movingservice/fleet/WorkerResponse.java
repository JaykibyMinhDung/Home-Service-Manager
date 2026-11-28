package com.movingservice.fleet;

public record WorkerResponse(Long id, String fullName, String phone, Worker.Position position, Worker.Status status) {

    public static WorkerResponse from(Worker worker) {
        return new WorkerResponse(
                worker.getId(), worker.getFullName(), worker.getPhone(), worker.getPosition(), worker.getStatus());
    }
}
