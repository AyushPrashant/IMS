package com.inventory.controller;

import com.inventory.dto.Requests.UpdatePasswordRequest;
import com.inventory.dto.Requests.UpdateProfileRequest;
import com.inventory.entity.GodownHead;
import com.inventory.service.GodownHeadService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GodownHeadController {

    private final GodownHeadService service;

    public GodownHeadController(GodownHeadService service) {
        this.service = service;
    }

    @GetMapping("/getGodownHead")
    public ResponseEntity<?> getProfile(Authentication auth) {
        try {
            return ResponseEntity.ok(service.getByUsername(auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getGodownHead/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getGodownHeadByGodownId/{godownId}")
    public ResponseEntity<?> getByGodownIdPath(@PathVariable Long godownId) {
        try {
            return ResponseEntity.ok(service.getFirstByGodownId(godownId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getGodownHeadByGodownId")
    public ResponseEntity<?> getByGodownIdQuery(@RequestParam Long godownId) {
        try {
            return ResponseEntity.ok(service.getFirstByGodownId(godownId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updateGodownHead")
    public ResponseEntity<?> update(Authentication auth,
                                     @RequestBody UpdateProfileRequest req) {
        try {
            GodownHead current = service.getEntityByUsername(auth.getName());
            return ResponseEntity.ok(service.update(current.getGodownHeadId(), req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(Authentication auth,
                                             @RequestBody UpdatePasswordRequest req) {
        try {
            GodownHead current = service.getEntityByUsername(auth.getName());
            service.updatePassword(current.getGodownHeadId(), req);
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
