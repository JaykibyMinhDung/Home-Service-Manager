package com.movingservice.fleet;

import com.movingservice.catalog.VehicleTypeResponse;

public record VehicleResponse(Long id, String licensePlate, VehicleTypeResponse vehicleType, Vehicle.Status status) {

    public static VehicleResponse from(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getLicensePlate(),
                VehicleTypeResponse.from(vehicle.getVehicleType()),
                vehicle.getStatus());
    }
}
