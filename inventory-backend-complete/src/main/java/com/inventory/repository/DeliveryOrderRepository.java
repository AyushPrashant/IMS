package com.inventory.repository;

import com.inventory.entity.DeliveryOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryOrderRepository extends JpaRepository<DeliveryOrder, Long> {

    List<DeliveryOrder> findByGodown_GodownIdOrderByOrderDateDesc(Long godownId);

    Long countByGodown_GodownId(Long godownId);

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM DeliveryOrderItem i")
    Long countTotalDeliveryProducts();

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM DeliveryOrderItem i " +
           "WHERE i.deliveryOrder.godown.godownId = :godownId")
    Long sumQuantitiesByGodownId(@Param("godownId") Long godownId);

    @Query("SELECT COUNT(d) FROM DeliveryOrder d " +
           "WHERE d.godown.godownId = :godownId " +
           "AND CAST(d.orderDate AS date) = CAST(:date AS date)")
    Long countByGodownIdAndDate(@Param("godownId") Long godownId,
                                @Param("date") String date);

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM DeliveryOrderItem i " +
           "WHERE i.deliveryOrder.godown.godownId = :godownId " +
           "AND CAST(i.deliveryOrder.orderDate AS date) = CAST(:date AS date)")
    Long sumQuantitiesByGodownIdAndDate(@Param("godownId") Long godownId,
                                        @Param("date") String date);

    @Query("SELECT MONTH(d.orderDate), COUNT(d) " +
           "FROM DeliveryOrder d " +
           "WHERE d.godown.godownId = :godownId AND YEAR(d.orderDate) = :year " +
           "GROUP BY MONTH(d.orderDate)")
    List<Object[]> findMonthlySalesByGodownAndYear(@Param("godownId") Long godownId,
                                                    @Param("year") int year);

    @Query("SELECT MONTH(i.deliveryOrder.orderDate), COALESCE(SUM(i.quantity), 0) " +
           "FROM DeliveryOrderItem i " +
           "WHERE i.deliveryOrder.godown.godownId = :godownId " +
           "AND YEAR(i.deliveryOrder.orderDate) = :year " +
           "GROUP BY MONTH(i.deliveryOrder.orderDate)")
    List<Object[]> findMonthlyOrderQtyByGodownAndYear(@Param("godownId") Long godownId,
                                                       @Param("year") int year);

    @Query("SELECT COALESCE(SUM(d.totalAmount), 0) FROM DeliveryOrder d")
    Double getTotalRevenue();

    @Query("SELECT WEEK(d.orderDate), SUM(d.totalAmount) " +
           "FROM DeliveryOrder d GROUP BY WEEK(d.orderDate)")
    List<Object[]> findWeeklySales();
}
