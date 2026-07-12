package com.inventory.dto;

import java.util.List;

public class Responses {

    // ── Auth ──────────────────────────────────────────────────────────────────

    public static class LoginResponse {
        public String cookie;
        public String username;
        public Long   godownHeadId;
        public Long   godownId;
        public String role;

        public LoginResponse(String cookie, String username,
                             Long godownHeadId, Long godownId, String role) {
            this.cookie       = cookie;
            this.username     = username;
            this.godownHeadId = godownHeadId;
            this.godownId     = godownId;
            this.role         = role;
        }
    }

    public static class ErrorResponse {
        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    // ── Product ───────────────────────────────────────────────────────────────

    public static class ProductResponse {
        public Long    productId;
        public String  productName;
        public String  productCategory;
        public Integer totalQuantity;
        public Double  productVolume;
        public Double  price;
        public String  productType;
        public String  unit;
        public Long    godownId;

        public ProductResponse() {}
    }

    // ── Supplier ──────────────────────────────────────────────────────────────

    public static class SupplierResponse {
        public Long   supplierId;
        public String supplierName;
        public String contactNumber;
        public String email;
        public String address;

        public SupplierResponse() {}
    }

    // ── Customer ──────────────────────────────────────────────────────────────

    public static class CustomerResponse {
        public Long   customerId;
        public String customerName;
        public String customerNo;
        public String customerAddress;
        public String email;

        public CustomerResponse() {}
    }

    // ── Godown ────────────────────────────────────────────────────────────────

    public static class GodownResponse {
        public Long                  godownId;
        public String                address;
        public Double                volume;
        public Double                usedVolume;
        public List<ProductResponse> productList;

        public GodownResponse() {}
    }

    public static class CapacityResponse {
        public Double total;
        public Double used;
        public Double availableCapacity;

        public CapacityResponse(Double total, Double used, Double availableCapacity) {
            this.total             = total;
            this.used              = used;
            this.availableCapacity = availableCapacity;
        }
    }

    // ── GodownHead ────────────────────────────────────────────────────────────

    public static class GodownHeadResponse {
        public Long   godownHeadId;
        public String godownHeadName;
        public String username;
        public String email;
        public String godownheadNo;
        public String address;
        public String phoneNumber;
        public String role;
        public Long   godownId;

        public GodownHeadResponse() {}
    }

    // ── Delivery Order ────────────────────────────────────────────────────────

    public static class DeliveryOrderResponse {
        public Long                       orderId;
        public String                     orderDate;
        public CustomerResponse           customer;
        public List<DeliveryItemResponse> products;
        public Double                     totalSellPrice;
        public Double                     cgstPercent;
        public Double                     sgstPercent;
        public Double                     cgstAmount;
        public Double                     sgstAmount;
        public Double                     totalAmount;
        public String                     status;
        public String                     godownHeadName;
        public String                     godownAddress;

        public DeliveryOrderResponse() {}
    }

    public static class DeliveryItemResponse {
        public String  productName;
        public Integer orderQuantity;
        public Double  sellPrice;
        public Double  totalPrice;

        public DeliveryItemResponse() {}
    }

    // ── Purchase Order ────────────────────────────────────────────────────────

    public static class PurchaseOrderResponse {
        public Long                        purchaseId;
        public String                      purchaseDate;
        public Long                        godownId;
        public Double                      totalAmount;
        public String                      status;
        public List<PurchaseItemResponse>  products;

        public PurchaseOrderResponse() {}
    }

    public static class PurchaseItemResponse {
        public String  productName;
        public Integer purchaseQuantity;
        public Double  unitPrice;
        public Double  totalPrice;
        public Double  productVolume;
        public String  productType;
        public String  productCategory;

        public PurchaseItemResponse() {}
    }

    // ── Dashboard / Analytics ─────────────────────────────────────────────────

    public static class SalesCountResponse {
        public Long saleOrdersCount;
        public Long totalQuantitiesSold;

        public SalesCountResponse(Long saleOrdersCount, Long totalQuantitiesSold) {
            this.saleOrdersCount     = saleOrdersCount;
            this.totalQuantitiesSold = totalQuantitiesSold;
        }
    }

    public static class SalesByDateResponse {
        public Long salesByDate;
        public Long totalQuantitiesSoldByDate;

        public SalesByDateResponse(Long salesByDate, Long totalQuantitiesSoldByDate) {
            this.salesByDate               = salesByDate;
            this.totalQuantitiesSoldByDate = totalQuantitiesSoldByDate;
        }
    }

    public static class MonthlySalesResponse {
        public String Month;
        public Long   salesCount;

        public MonthlySalesResponse(String month, Long salesCount) {
            this.Month      = month;
            this.salesCount = salesCount;
        }
    }

    public static class MonthlyOrderQtyResponse {
        public String Month;
        public Long   orderQuantity;

        public MonthlyOrderQtyResponse(String month, Long orderQuantity) {
            this.Month         = month;
            this.orderQuantity = orderQuantity;
        }
    }
}
