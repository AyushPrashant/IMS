package com.inventory.repository;

import com.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByGodown_GodownId(Long godownId);

    Optional<Product> findByProductNameAndGodown_GodownId(String productName, Long godownId);

    @Query("SELECT i.productName, SUM(i.quantity) as totalSold " +
           "FROM DeliveryOrderItem i " +
           "GROUP BY i.productName " +
           "ORDER BY totalSold DESC")
    List<Object[]> findTopSellingProducts();

    @Query("SELECT i.productName, SUM(i.quantity) as totalSold " +
           "FROM DeliveryOrderItem i " +
           "WHERE i.deliveryOrder.godown.godownId = :godownId " +
           "GROUP BY i.productName " +
           "ORDER BY totalSold DESC")
    List<Object[]> findTopSellingProductsByGodown(@Param("godownId") Long godownId);
}
