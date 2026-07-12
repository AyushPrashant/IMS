package com.inventory.repository;

import com.inventory.entity.Godown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GodownRepository extends JpaRepository<Godown, Long> {
}
