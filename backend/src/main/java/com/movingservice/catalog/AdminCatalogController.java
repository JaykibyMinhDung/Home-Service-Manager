package com.movingservice.catalog;

import com.movingservice.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
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
public class AdminCatalogController {

    private final CatalogService catalogService;

    @PostMapping("/vehicle-types")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<VehicleTypeResponse> createVehicleType(@Valid @RequestBody VehicleTypeRequest request) {
        return ApiResponse.created(VehicleTypeResponse.from(catalogService.createVehicleType(request)));
    }

    @PutMapping("/vehicle-types/{id}")
    public ApiResponse<VehicleTypeResponse> updateVehicleType(
            @PathVariable Long id, @Valid @RequestBody VehicleTypeRequest request) {
        return ApiResponse.ok(VehicleTypeResponse.from(catalogService.updateVehicleType(id, request)));
    }

    @DeleteMapping("/vehicle-types/{id}")
    public ApiResponse<Void> deleteVehicleType(@PathVariable Long id) {
        catalogService.deleteVehicleType(id);
        return ApiResponse.message("Đã xóa loại xe");
    }

    @PostMapping("/extra-services")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ExtraServiceResponse> createExtraService(@Valid @RequestBody ExtraServiceRequest request) {
        return ApiResponse.created(ExtraServiceResponse.from(catalogService.createExtraService(request)));
    }

    @PutMapping("/extra-services/{id}")
    public ApiResponse<ExtraServiceResponse> updateExtraService(
            @PathVariable Long id, @Valid @RequestBody ExtraServiceRequest request) {
        return ApiResponse.ok(ExtraServiceResponse.from(catalogService.updateExtraService(id, request)));
    }

    @DeleteMapping("/extra-services/{id}")
    public ApiResponse<Void> deleteExtraService(@PathVariable Long id) {
        catalogService.deleteExtraService(id);
        return ApiResponse.message("Đã xóa dịch vụ kèm theo");
    }
}
