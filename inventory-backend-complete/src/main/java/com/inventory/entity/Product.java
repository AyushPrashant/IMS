package com.inventory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_category")
    private String productCategory;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity = 0;

    @Column(name = "product_volume")
    private Double productVolume = 0.0;

    @Column(name = "price")
    private Double price = 0.0;

    @Column(name = "product_type")
    private String productType;

    @Column(name = "unit")
    private String unit;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "godown_id")
    private Godown godown;

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }

    public Integer getTotalQuantity() { return totalQuantity != null ? totalQuantity : 0; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }

    public Double getProductVolume() { return productVolume != null ? productVolume : 0.0; }
    public void setProductVolume(Double productVolume) { this.productVolume = productVolume; }

    public Double getPrice() { return price != null ? price : 0.0; }
    public void setPrice(Double price) { this.price = price; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Godown getGodown() { return godown; }
    public void setGodown(Godown godown) { this.godown = godown; }
}
