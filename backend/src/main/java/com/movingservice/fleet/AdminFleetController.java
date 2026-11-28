package com.movingservice.fleet;

import com.movingservice.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminFleetController {

    private final FleetService fleetService;

    @GetMapping("/vehicles")
    public ApiResponse<List<VehicleResponse>> vehicles() {
        return ApiResponse.ok(fleetService.listVehicles());
    }

    @PostMapping("/vehicles")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request) {
        return ApiResponse.created(fleetService.createVehicle(request));
    }

    @PutMapping("/vehicles/{id}")
    public ApiResponse<VehicleResponse> updateVehicle(
            @PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return ApiResponse.ok(fleetService.updateVehicle(id, request));
    }

    @DeleteMapping("/vehicles/{id}")
    public ApiResponse<Void> deleteVehicle(@PathVariable Long id) {
        fleetService.deleteVehicle(id);
        return ApiResponse.message("Đã xóa xe");
    }

    @GetMapping("/workers")
    public ApiResponse<List<WorkerResponse>> workers() {
        return ApiResponse.ok(fleetService.listWorkers());
    }

    @PostMapping("/workers")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<WorkerResponse> createWorker(@Valid @RequestBody WorkerRequest request) {
        return ApiResponse.created(fleetService.createWorker(request));
    }

    @PutMapping("/workers/{id}")
    public ApiResponse<WorkerResponse> updateWorker(@PathVariable Long id, @Valid @RequestBody WorkerRequest request) {
        return ApiResponse.ok(fleetService.updateWorker(id, request));
    }

    @DeleteMapping("/workers/{id}")
    public ApiResponse<Void> deleteWorker(@PathVariable Long id) {
        fleetService.deleteWorker(id);
        return ApiResponse.message("Đã xóa nhân sự");
    }
}
