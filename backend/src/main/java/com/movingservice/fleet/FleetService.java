package com.movingservice.fleet;

import com.movingservice.catalog.CatalogService;
import com.movingservice.catalog.VehicleType;
import com.movingservice.common.ApiException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FleetService {

    private final VehicleRepository vehicleRepository;
    private final WorkerRepository workerRepository;
    private final CatalogService catalogService;

    @Transactional(readOnly = true)
    public List<VehicleResponse> listVehicles() {
        return vehicleRepository.findAllByOrderByIdAsc().stream().map(VehicleResponse::from).toList();
    }

    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request) {
        String licensePlate = normalizePlate(request.licensePlate());
        if (vehicleRepository.existsByLicensePlateIgnoreCase(licensePlate)) {
            throw ApiException.conflict("Biển số đã tồn tại");
        }
        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate(licensePlate);
        vehicle.setVehicleType(vehicleType(request.vehicleTypeId()));
        return VehicleResponse.from(vehicleRepository.save(vehicle));
    }

    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = getVehicle(id);
        String licensePlate = normalizePlate(request.licensePlate());
        if (vehicleRepository.existsByLicensePlateIgnoreCaseAndIdNot(licensePlate, id)) {
            throw ApiException.conflict("Biển số đã tồn tại");
        }
        vehicle.setLicensePlate(licensePlate);
        vehicle.setVehicleType(vehicleType(request.vehicleTypeId()));
        if (request.status() != null) {
            vehicle.setStatus(request.status());
        }
        return VehicleResponse.from(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicle(id);
        try {
            vehicleRepository.delete(vehicle);
            vehicleRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw ApiException.conflict("Xe đã từng được phân công, không xóa được. Hãy chuyển sang Bảo dưỡng.");
        }
    }

    @Transactional(readOnly = true)
    public List<WorkerResponse> listWorkers() {
        return workerRepository.findAllByOrderByIdAsc().stream().map(WorkerResponse::from).toList();
    }

    @Transactional
    public WorkerResponse createWorker(WorkerRequest request) {
        Worker worker = new Worker();
        applyWorker(worker, request);
        return WorkerResponse.from(workerRepository.save(worker));
    }

    @Transactional
    public WorkerResponse updateWorker(Long id, WorkerRequest request) {
        Worker worker = getWorker(id);
        applyWorker(worker, request);
        if (request.status() != null) {
            worker.setStatus(request.status());
        }
        return WorkerResponse.from(worker);
    }

    @Transactional
    public void deleteWorker(Long id) {
        Worker worker = getWorker(id);
        try {
            workerRepository.delete(worker);
            workerRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw ApiException.conflict(
                    "Nhân sự đã từng được phân công, không xóa được. Hãy chuyển sang Đã nghỉ.");
        }
    }

    private Vehicle getVehicle(Long id) {
        return vehicleRepository.findById(id).orElseThrow(() -> ApiException.notFound("Không tìm thấy xe"));
    }

    private Worker getWorker(Long id) {
        return workerRepository.findById(id).orElseThrow(() -> ApiException.notFound("Không tìm thấy nhân sự"));
    }

    private VehicleType vehicleType(Long id) {
        return catalogService.findVehicleType(id)
                .orElseThrow(() -> ApiException.badRequest("Loại xe không tồn tại"));
    }

    private void applyWorker(Worker worker, WorkerRequest request) {
        worker.setFullName(request.fullName().trim());
        worker.setPhone(request.phone().trim());
        worker.setPosition(request.position());
    }

    private String normalizePlate(String licensePlate) {
        return licensePlate.trim().toUpperCase();
    }
}
