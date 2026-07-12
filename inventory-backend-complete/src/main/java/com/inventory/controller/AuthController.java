package com.inventory.controller;

import com.inventory.dto.Requests.LoginRequest;
import com.inventory.dto.Requests.LoginWithOtpRequest;
import com.inventory.dto.Requests.OtpRequest;
import com.inventory.dto.Requests.RegisterRequest;
import com.inventory.dto.Requests.ResetPasswordRequest;
import com.inventory.dto.Requests.VerifyOtpRequest;
import com.inventory.dto.Responses.ErrorResponse;
import com.inventory.dto.Responses.LoginResponse;
import com.inventory.service.AuthService;
import com.inventory.service.GodownHeadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService       authService;
    private final GodownHeadService ghService;

    public AuthController(AuthService authService, GodownHeadService ghService) {
        this.authService = authService;
        this.ghService   = ghService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            LoginResponse resp = authService.login(req);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            ghService.register(req);
            return ResponseEntity.ok("GodownHead registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sendOtp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest req) {
        try {
            String otp = authService.sendOtp(req.godownheadNo);
            return ResponseEntity.ok(otp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verifyotp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest req) {
        try {
            String result = authService.verifyOtp(req.godownheadNo, req.otp);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/resetpassword")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        try {
            authService.resetPassword(req);
            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/loginWithOtp")
    public ResponseEntity<?> loginWithOtp(@RequestBody LoginWithOtpRequest req) {
        try {
            LoginResponse resp = authService.loginWithOtp(req);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }
}
