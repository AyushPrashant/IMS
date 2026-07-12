package com.inventory.controller;

import com.inventory.dto.Requests.CustomerRequest;
import com.inventory.dto.Responses.CustomerResponse;
import com.inventory.service.CustomerService;
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
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping("/getAllCustomers")
    public ResponseEntity<List<CustomerResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/getCustomerById/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/createCustomer")
    public ResponseEntity<?> create(@RequestBody CustomerRequest req) {
        try {
            return ResponseEntity.ok(service.create(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/updateCustomerById/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @RequestBody CustomerRequest req) {
        try {
            return ResponseEntity.ok(service.update(id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/updateCustomerById/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Customer deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
