package com.inventory.service;

import com.inventory.dto.Requests.LoginRequest;
import com.inventory.dto.Requests.LoginWithOtpRequest;
import com.inventory.dto.Requests.OtpRequest;
import com.inventory.dto.Requests.ResetPasswordRequest;
import com.inventory.dto.Requests.VerifyOtpRequest;
import com.inventory.dto.Responses.LoginResponse;
import com.inventory.entity.GodownHead;
import com.inventory.repository.GodownHeadRepository;
import com.inventory.security.JwtUtil;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
public class AuthService {

    private final GodownHeadRepository repo;
    private final JwtUtil              jwtUtil;
    private final PasswordEncoder      encoder;
    private final JavaMailSender       mailer;

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASS_HASH =
            "$2a$12$ncJOqQL4dCsLmAwKUXs9F.gqeIAiJgc6dK6HcsJPnX4e08an6YWKu";

    public AuthService(GodownHeadRepository repo,
                       JwtUtil jwtUtil,
                       PasswordEncoder encoder,
                       JavaMailSender mailer) {
        this.repo    = repo;
        this.jwtUtil = jwtUtil;
        this.encoder = encoder;
        this.mailer  = mailer;
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public LoginResponse login(LoginRequest req) {
        if (ADMIN_USERNAME.equalsIgnoreCase(req.username)) {
            if (!encoder.matches(req.password, ADMIN_PASS_HASH)) {
                throw new RuntimeException("Invalid admin credentials");
            }
            String token = jwtUtil.generate(ADMIN_USERNAME, "ADMIN");
            return new LoginResponse(token, ADMIN_USERNAME, 0L, null, "ADMIN");
        }

        GodownHead head = repo.findByUsername(req.username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(req.password, head.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token    = jwtUtil.generate(head.getUsername(), head.getRole());
        Long   godownId = head.getGodown() != null ? head.getGodown().getGodownId() : null;

        return new LoginResponse(token, head.getUsername(),
                head.getGodownHeadId(), godownId, head.getRole());
    }

    // ── Send OTP ──────────────────────────────────────────────────────────────

    @Transactional
    public String sendOtp(String godownheadNo) {
        GodownHead head = repo.findByGodownheadNo(godownheadNo)
                .orElseThrow(() -> new RuntimeException("Phone number not registered"));

        String otp = String.format("%06d", new Random().nextInt(999999));
        head.setOtp(otp);
        head.setOtpExpiry(System.currentTimeMillis() + 5L * 60 * 1000);
        repo.save(head);

        if (head.getEmail() != null && !head.getEmail().isBlank()) {
            try {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(head.getEmail());
                msg.setSubject("IMS — Your OTP");
                msg.setText("Your OTP is: " + otp + "\nValid for 5 minutes.");
                mailer.send(msg);
            } catch (Exception e) {
                System.err.println("Mail delivery failed (OTP=" + otp + "): " + e.getMessage());
            }
        }

        return otp;
    }

    // ── Verify OTP ────────────────────────────────────────────────────────────

    public String verifyOtp(String godownheadNo, String otp) {
        GodownHead head = repo.findByGodownheadNo(godownheadNo)
                .orElseThrow(() -> new RuntimeException("Phone number not found"));

        if (head.getOtp() == null || !head.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        if (head.getOtpExpiry() == null || System.currentTimeMillis() > head.getOtpExpiry()) {
            throw new RuntimeException("OTP expired");
        }
        return "OTP Verified";
    }

    // ── Reset Password ────────────────────────────────────────────────────────

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        GodownHead head = repo.findByGodownheadNo(req.godownheadNo)
                .orElseThrow(() -> new RuntimeException("Phone number not found"));

        head.setPassword(encoder.encode(req.newPassword));
        head.setOtp(null);
        head.setOtpExpiry(null);
        repo.save(head);
    }

    // ── Login With OTP ────────────────────────────────────────────────────────

    @Transactional
    public LoginResponse loginWithOtp(LoginWithOtpRequest req) {
        GodownHead head = repo.findByGodownheadNo(req.godownheadNo)
                .orElseThrow(() -> new RuntimeException("Phone number not found"));

        if (head.getOtp() == null || !head.getOtp().equals(req.otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        if (head.getOtpExpiry() == null || System.currentTimeMillis() > head.getOtpExpiry()) {
            throw new RuntimeException("OTP expired");
        }

        head.setOtp(null);
        head.setOtpExpiry(null);
        repo.save(head);

        String token    = jwtUtil.generate(head.getUsername(), head.getRole());
        Long   godownId = head.getGodown() != null ? head.getGodown().getGodownId() : null;

        return new LoginResponse(token, head.getUsername(),
                head.getGodownHeadId(), godownId, head.getRole());
    }
}
