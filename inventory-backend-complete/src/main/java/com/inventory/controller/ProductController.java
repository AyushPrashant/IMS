package com.inventory.controller;

import com.inventory.dto.Requests.ProductRequest;
import com.inventory.dto.Requests.UpdateProductByNameRequest;
import com.inventory.dto.Responses.ProductResponse;
import com.inventory.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/listAllProducts")
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/listProducts/{godownId}")
    public ResponseEntity<List<ProductResponse>> getByGodown(@PathVariable Long godownId) {
        return ResponseEntity.ok(service.getByGodown(godownId));
    }

    @GetMapping("/getAllProduct")
    public ResponseEntity<List<String[]>> getAllProductNames() {
        return ResponseEntity.ok(service.getAllProductNamesAsArrays());
    }

    @GetMapping("/getAllProduct/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getTopSellingProducts/{godownId}")
    public ResponseEntity<?> getTopSellingByGodown(@PathVariable Long godownId) {
        return ResponseEntity.ok(service.getTopSelling(godownId));
    }

    @GetMapping("/getTopSellingProducts")
    public ResponseEntity<?> getTopSelling() {
        return ResponseEntity.ok(service.getTopSelling(null));
    }

    @PostMapping("/addProduct")
    public ResponseEntity<?> create(@RequestBody ProductRequest req) {
        try {
            return ResponseEntity.ok(service.create(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/updateProduct")
    public ResponseEntity<?> updateByName(@RequestBody UpdateProductByNameRequest req) {
        try {
            return ResponseEntity.ok(service.updateByName(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<?> updateById(@PathVariable Long id,
                                         @RequestBody ProductRequest req) {
        try {
            return ResponseEntity.ok(service.updateById(id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/updateProduct/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Product deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
