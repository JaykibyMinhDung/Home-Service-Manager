package com.movingservice.catalog;

import com.movingservice.common.ApiException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final VehicleTypeRepository vehicleTypeRepository;
    private final ExtraServiceRepository extraServiceRepository;

    @Transactional(readOnly = true)
    public List<VehicleType> listVehicleTypes(boolean includeInactive) {
        return includeInactive
                ? vehicleTypeRepository.findAllByOrderByCapacityKgAscIdAsc()
                : vehicleTypeRepository.findByActiveTrueOrderByCapacityKgAscIdAsc();
    }

    @Transactional(readOnly = true)
    public Optional<VehicleType> findVehicleType(Long id) {
        return vehicleTypeRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public VehicleType getVehicleType(Long id) {
        return findVehicleType(id).orElseThrow(() -> ApiException.notFound("Không tìm thấy loại xe"));
    }

    @Transactional
    public VehicleType createVehicleType(VehicleTypeRequest request) {
        String name = request.name().trim();
        if (vehicleTypeRepository.existsByNameIgnoreCase(name)) {
            throw ApiException.conflict("Tên loại xe đã tồn tại");
        }
        VehicleType type = new VehicleType();
        applyVehicleType(type, name, request);
        return vehicleTypeRepository.save(type);
    }

    @Transactional
    public VehicleType updateVehicleType(Long id, VehicleTypeRequest request) {
        VehicleType type = getVehicleType(id);
        String name = request.name().trim();
        if (vehicleTypeRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw ApiException.conflict("Tên loại xe đã tồn tại");
        }
        applyVehicleType(type, name, request);
        if (request.active() != null) {
            type.setActive(request.active());
        }
        return type;
    }

    @Transactional
    public void deleteVehicleType(Long id) {
        VehicleType type = getVehicleType(id);
        try {
            vehicleTypeRepository.delete(type);
            vehicleTypeRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw ApiException.conflict(
                    "Loại xe đã có xe hoặc đơn dùng tới, không xóa được. Hãy chuyển sang ngừng cung cấp.");
        }
    }

    @Transactional(readOnly = true)
    public List<ExtraService> listExtraServices(boolean includeInactive) {
        return includeInactive
                ? extraServiceRepository.findAllByOrderByIdAsc()
                : extraServiceRepository.findByActiveTrueOrderByIdAsc();
    }

    @Transactional(readOnly = true)
    public ExtraService getExtraService(Long id) {
        return extraServiceRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy dịch vụ kèm theo"));
    }

    @Transactional
    public ExtraService createExtraService(ExtraServiceRequest request) {
        String name = request.name().trim();
        if (extraServiceRepository.existsByNameIgnoreCase(name)) {
            throw ApiException.conflict("Tên dịch vụ đã tồn tại");
        }
        ExtraService service = new ExtraService();
        applyExtraService(service, name, request);
        return extraServiceRepository.save(service);
    }

    @Transactional
    public ExtraService updateExtraService(Long id, ExtraServiceRequest request) {
        ExtraService service = getExtraService(id);
        String name = request.name().trim();
        if (extraServiceRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw ApiException.conflict("Tên dịch vụ đã tồn tại");
        }
        applyExtraService(service, name, request);
        if (request.active() != null) {
            service.setActive(request.active());
        }
        return service;
    }

    @Transactional
    public void deleteExtraService(Long id) {
        ExtraService service = getExtraService(id);
        try {
            extraServiceRepository.delete(service);
            extraServiceRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw ApiException.conflict(
                    "Dịch vụ đã có đơn dùng tới, không xóa được. Hãy chuyển sang ngừng cung cấp.");
        }
    }

    private void applyVehicleType(VehicleType type, String name, VehicleTypeRequest request) {
        type.setName(name);
        type.setCapacityKg(request.capacityKg());
        type.setBasePrice(request.basePrice());
        type.setPricePerKm(request.pricePerKm());
    }

    private void applyExtraService(ExtraService service, String name, ExtraServiceRequest request) {
        String description = request.description() == null ? "" : request.description().trim();
        service.setName(name);
        service.setDescription(description.isEmpty() ? null : description);
        service.setPrice(request.price());
    }
}
