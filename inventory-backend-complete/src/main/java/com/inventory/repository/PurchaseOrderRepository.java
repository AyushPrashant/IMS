package com.inventory.repository;

import com.inventory.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM PurchaseOrderItem i " +
           "WHERE i.purchaseOrder.godown.godownId = :godownId")
    Long countPurchasedProductsByGodownId(@Param("godownId") Long godownId);

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM PurchaseOrderItem i")
    Long countAllPurchasedProducts();
}
