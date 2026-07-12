package com.inventory.controller;

import com.inventory.dto.Requests.SupplierRequest;
import com.inventory.dto.Responses.SupplierResponse;
import com.inventory.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SupplierController {

    private final SupplierService service;

    public SupplierController(SupplierService service) {
        this.service = service;
    }

    @GetMapping("/getAllSuppliers")
    public ResponseEntity<List<SupplierResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping("/createSupplier")
    public ResponseEntity<?> create(@RequestBody SupplierRequest req) {
        try {
            return ResponseEntity.ok(service.create(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updateSuppliers")
    public ResponseEntity<?> updateByBodyId(@RequestBody SupplierRequest req) {
        try {
            if (req.supplierId == null) {
                return ResponseEntity.badRequest().body("supplierId is required");
            }
            return ResponseEntity.ok(service.update(req.supplierId, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updateSuppliers/{id}")
    public ResponseEntity<?> updateById(@PathVariable Long id,
                                         @RequestBody SupplierRequest req) {
        try {
            return ResponseEntity.ok(service.update(id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/updateSuppliers/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Supplier deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
