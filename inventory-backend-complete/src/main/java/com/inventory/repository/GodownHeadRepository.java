package com.inventory.repository;

import com.inventory.entity.GodownHead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GodownHeadRepository extends JpaRepository<GodownHead, Long> {

    Optional<GodownHead> findByUsername(String username);

    Optional<GodownHead> findByEmail(String email);

    Optional<GodownHead> findByGodownheadNo(String godownheadNo);

    List<GodownHead> findByGodown_GodownId(Long godownId);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
