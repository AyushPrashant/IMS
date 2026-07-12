package com.inventory.controller;

import com.inventory.dto.Requests.GodownRequest;
import com.inventory.dto.Responses.CapacityResponse;
import com.inventory.dto.Responses.GodownResponse;
import com.inventory.service.GodownService;
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
public class GodownController {

    private final GodownService service;

    public GodownController(GodownService service) {
        this.service = service;
    }

    @GetMapping("/getAllGodown")
    public ResponseEntity<List<GodownResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/getGodown/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getGodwnCount")
    public ResponseEntity<Long> getCount() {
        return ResponseEntity.ok(service.count());
    }

    @GetMapping("/getCapacity/{godownId}")
    public ResponseEntity<?> getCapacity(@PathVariable Long godownId) {
        try {
            return ResponseEntity.ok(service.getCapacity(godownId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/createGodown")
    public ResponseEntity<?> create(@RequestBody GodownRequest req) {
        try {
            String msg = service.create(req);
            return ResponseEntity.ok(msg);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/createGodown/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @RequestBody GodownRequest req) {
        try {
            return ResponseEntity.ok(service.update(id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/createGodown/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Godown deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
