package com.inventory.controller;

import com.inventory.dto.Requests.DeliveryOrderRequest;
import com.inventory.dto.Requests.PurchaseOrderRequest;
import com.inventory.dto.Responses.DeliveryOrderResponse;
import com.inventory.dto.Responses.MonthlyOrderQtyResponse;
import com.inventory.dto.Responses.MonthlySalesResponse;
import com.inventory.dto.Responses.PurchaseOrderResponse;
import com.inventory.dto.Responses.SalesByDateResponse;
import com.inventory.dto.Responses.SalesCountResponse;
import com.inventory.entity.GodownHead;
import com.inventory.service.GodownHeadService;
import com.inventory.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService      service;
    private final GodownHeadService ghService;

    public OrderController(OrderService service, GodownHeadService ghService) {
        this.service   = service;
        this.ghService = ghService;
    }

    // ── Purchase ──────────────────────────────────────────────────────────────

    @GetMapping("/getAllPurchaseOrders")
    public ResponseEntity<List<PurchaseOrderResponse>> getAllPurchase() {
        return ResponseEntity.ok(service.getAllPurchase());
    }

    @GetMapping("/getPurchaseOrderByPurchaseId/{id}")
    public ResponseEntity<?> getPurchaseById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getPurchaseById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getPurchasedProductsCountByGodownId/{godownId}")
    public ResponseEntity<Long> getPurchaseCountByGodown(@PathVariable Long godownId) {
        return ResponseEntity.ok(service.getPurchaseCountByGodown(godownId));
    }

    @GetMapping("/getPurchasedProductsCount")
    public ResponseEntity<Long> getTotalPurchaseCount() {
        return ResponseEntity.ok(service.getTotalPurchaseCount());
    }

    @PostMapping("/createPurchaseOrder")
    public ResponseEntity<?> createPurchase(@RequestBody PurchaseOrderRequest req,
                                             Authentication auth) {
        try {
            return ResponseEntity.ok(service.createPurchase(req, auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Delivery ──────────────────────────────────────────────────────────────

    @GetMapping("/getDeliveryOrders")
    public ResponseEntity<List<DeliveryOrderResponse>> getAllDelivery() {
        return ResponseEntity.ok(service.getAllDelivery());
    }

    @GetMapping("/getDeliveryOrdersByGodownId/{godownId}")
    public ResponseEntity<List<DeliveryOrderResponse>> getDeliveryByGodown(
            @PathVariable Long godownId) {
        return ResponseEntity.ok(service.getDeliveryByGodown(godownId));
    }

    @GetMapping("/getDeliveryOrdersById/{id}")
    public ResponseEntity<?> getDeliveryById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getDeliveryById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getTotalDeliveryProducts")
    public ResponseEntity<Long> getTotalDelivered() {
        return ResponseEntity.ok(service.getTotalDeliveryProductsCount());
    }

    @PostMapping("/placeOrder/{customerId}")
    public ResponseEntity<?> placeOrder(@PathVariable Long customerId,
                                         @RequestBody DeliveryOrderRequest req,
                                         Authentication auth) {
        try {
            GodownHead gh = ghService.getEntityByUsername(auth.getName());
            Long godownId = gh.getGodown() != null ? gh.getGodown().getGodownId() : null;
            if (godownId == null) {
                return ResponseEntity.badRequest().body("No godown assigned to this user");
            }
            return ResponseEntity.ok(
                    service.placeOrder(customerId, godownId, req, auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Analytics ─────────────────────────────────────────────────────────────

    @GetMapping("/getTotalSalesCount/{godownId}")
    public ResponseEntity<SalesCountResponse> getTotalSalesByGodown(
            @PathVariable Long godownId) {
        return ResponseEntity.ok(service.getTotalSalesCountByGodown(godownId));
    }

    @GetMapping("/getTotalSalesCount")
    public ResponseEntity<SalesCountResponse> getTotalSales() {
        return ResponseEntity.ok(service.getTotalSalesCountByGodown(null));
    }

    @GetMapping("/getSalesByDate")
    public ResponseEntity<SalesByDateResponse> getSalesByDate(
            @RequestParam(required = false) Long godownId,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(service.getSalesByDate(godownId, date));
    }

    @GetMapping("/getSalesByMonth/{godownId}")
    public ResponseEntity<List<MonthlySalesResponse>> getSalesByMonth(
            @PathVariable Long godownId) {
        return ResponseEntity.ok(service.getSalesByMonth(godownId));
    }

    @GetMapping("/getOrderQuantityByMonth/{godownId}")
    public ResponseEntity<List<MonthlyOrderQtyResponse>> getOrderQtyByMonth(
            @PathVariable Long godownId) {
        return ResponseEntity.ok(service.getOrderQtyByMonth(godownId));
    }

    @GetMapping("/getSalesByWeek")
    public ResponseEntity<?> getSalesByWeek() {
        return ResponseEntity.ok(service.getSalesByWeek());
    }
}
