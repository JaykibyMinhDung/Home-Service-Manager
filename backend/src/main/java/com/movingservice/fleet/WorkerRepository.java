package com.movingservice.fleet;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerRepository extends JpaRepository<Worker, Long> {

    List<Worker> findAllByOrderByIdAsc();
}
