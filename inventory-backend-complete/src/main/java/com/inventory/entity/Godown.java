package com.inventory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "godown")
public class Godown {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "godown_id")
    private Long godownId;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "volume", nullable = false)
    private Double volume;

    @Column(name = "used_volume", nullable = false)
    private Double usedVolume = 0.0;

    @JsonIgnore
    @OneToMany(mappedBy = "godown", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> products;

    @JsonIgnore
    @OneToMany(mappedBy = "godown", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GodownHead> godownHeads;

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getGodownId() { return godownId; }
    public void setGodownId(Long godownId) { this.godownId = godownId; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getVolume() { return volume; }
    public void setVolume(Double volume) { this.volume = volume; }

    public Double getUsedVolume() { return usedVolume != null ? usedVolume : 0.0; }
    public void setUsedVolume(Double usedVolume) { this.usedVolume = usedVolume; }

    public List<Product> getProducts() { return products; }
    public void setProducts(List<Product> products) { this.products = products; }

    public List<GodownHead> getGodownHeads() { return godownHeads; }
    public void setGodownHeads(List<GodownHead> godownHeads) { this.godownHeads = godownHeads; }
}
