package com.inventory.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "delivery_order")
public class DeliveryOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Long deliveryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "godown_id")
    private Godown godown;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "godown_head_id")
    private GodownHead godownHead;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "sub_total")
    private Double subTotal = 0.0;

    @Column(name = "cgst_percent")
    private Double cgstPercent = 9.0;

    @Column(name = "sgst_percent")
    private Double sgstPercent = 9.0;

    @Column(name = "cgst_amount")
    private Double cgstAmount = 0.0;

    @Column(name = "sgst_amount")
    private Double sgstAmount = 0.0;

    @Column(name = "total_amount")
    private Double totalAmount = 0.0;

    @Column(name = "status")
    private String status = "DELIVERED";

    @OneToMany(mappedBy = "deliveryOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DeliveryOrderItem> items;

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getDeliveryId() { return deliveryId; }
    public void setDeliveryId(Long deliveryId) { this.deliveryId = deliveryId; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Godown getGodown() { return godown; }
    public void setGodown(Godown godown) { this.godown = godown; }

    public GodownHead getGodownHead() { return godownHead; }
    public void setGodownHead(GodownHead godownHead) { this.godownHead = godownHead; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public Double getSubTotal() { return subTotal; }
    public void setSubTotal(Double subTotal) { this.subTotal = subTotal; }

    public Double getCgstPercent() { return cgstPercent; }
    public void setCgstPercent(Double cgstPercent) { this.cgstPercent = cgstPercent; }

    public Double getSgstPercent() { return sgstPercent; }
    public void setSgstPercent(Double sgstPercent) { this.sgstPercent = sgstPercent; }

    public Double getCgstAmount() { return cgstAmount; }
    public void setCgstAmount(Double cgstAmount) { this.cgstAmount = cgstAmount; }

    public Double getSgstAmount() { return sgstAmount; }
    public void setSgstAmount(Double sgstAmount) { this.sgstAmount = sgstAmount; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<DeliveryOrderItem> getItems() { return items; }
    public void setItems(List<DeliveryOrderItem> items) { this.items = items; }
}
