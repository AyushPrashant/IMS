package com.inventory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "delivery_order_item")
public class DeliveryOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id")
    private DeliveryOrder deliveryOrder;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 0;

    @Column(name = "sell_price")
    private Double sellPrice = 0.0;

    @Column(name = "total_price")
    private Double totalPrice = 0.0;

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public DeliveryOrder getDeliveryOrder() { return deliveryOrder; }
    public void setDeliveryOrder(DeliveryOrder deliveryOrder) { this.deliveryOrder = deliveryOrder; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getSellPrice() { return sellPrice; }
    public void setSellPrice(Double sellPrice) { this.sellPrice = sellPrice; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
}
