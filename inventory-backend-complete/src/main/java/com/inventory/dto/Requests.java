package com.inventory.dto;

import java.util.List;

public class Requests {

    // ── Auth ──────────────────────────────────────────────────────────────────

    public static class LoginRequest {
        public String username;
        public String password;
    }

    public static class OtpRequest {
        public String godownheadNo;
    }

    public static class VerifyOtpRequest {
        public String godownheadNo;
        public String otp;
    }

    public static class ResetPasswordRequest {
        public String godownheadNo;
        public String newPassword;
    }

    public static class LoginWithOtpRequest {
        public String godownheadNo;
        public String otp;
    }

    public static class RegisterRequest {
        public Long   godownId;
        public String godownHeadName;
        public String username;
        public String password;
        public String email;
        public String address;
        public String godownHeadNo;
    }

    public static class UpdateProfileRequest {
        public String godownHeadName;
        public String email;
        public String address;
        public String phoneNumber;
    }

    public static class UpdatePasswordRequest {
        public String oldPassword;
        public String newPassword;
    }

    // ── Godown ────────────────────────────────────────────────────────────────

    public static class GodownRequest {
        public String address;
        public Double volume;
    }

    // ── Product ───────────────────────────────────────────────────────────────

    public static class ProductRequest {
        public String  productName;
        public String  productCategory;
        public Integer totalQuantity;
        public Double  productVolume;
        public Double  price;
        public String  productType;
        public String  unit;
        public Long    godownId;
    }

    public static class UpdateProductByNameRequest {
        public String  productName;
        public Long    godownId;
        public Double  price;
        public Double  productVolume;
        public Integer totalQuantity;
    }

    // ── Supplier ──────────────────────────────────────────────────────────────

    public static class SupplierRequest {
        public Long   supplierId;
        public String supplierName;
        public String contactNumber;
        public String email;
        public String address;
    }

    // ── Customer ──────────────────────────────────────────────────────────────

    public static class CustomerRequest {
        public String customerName;
        public String customerNo;
        public String customerAddress;
        public String email;
    }

    // ── Purchase Order ────────────────────────────────────────────────────────

    public static class PurchaseOrderRequest {
        public Long supplierId;
        public Long godownId;
        public List<ItemLine> items;

        public static class ItemLine {
            public String  productName;
            public Integer quantity;
            public Double  unitPrice;
        }
    }

    // ── Delivery Order ────────────────────────────────────────────────────────

    public static class DeliveryOrderRequest {
        public List<ItemLine> products;

        public static class ItemLine {
            public String  productName;
            public Integer orderQuantity;
            public Double  sellPrice;
        }
    }
}
