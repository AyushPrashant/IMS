package com.inventory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "godown_head")
public class GodownHead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "godown_head_id")
    private Long godownHeadId;

    @Column(name = "godown_head_name", nullable = false)
    private String godownHeadName;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "godownhead_no")
    private String godownheadNo;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "role", nullable = false)
    private String role = "GODOWNHEAD";

    @Column(name = "otp")
    private String otp;

    @Column(name = "otp_expiry")
    private Long otpExpiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "godown_id")
    private Godown godown;

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getGodownHeadId() { return godownHeadId; }
    public void setGodownHeadId(Long godownHeadId) { this.godownHeadId = godownHeadId; }

    public String getGodownHeadName() { return godownHeadName; }
    public void setGodownHeadName(String godownHeadName) { this.godownHeadName = godownHeadName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGodownheadNo() { return godownheadNo; }
    public void setGodownheadNo(String godownheadNo) { this.godownheadNo = godownheadNo; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public Long getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(Long otpExpiry) { this.otpExpiry = otpExpiry; }

    public Godown getGodown() { return godown; }
    public void setGodown(Godown godown) { this.godown = godown; }
}
