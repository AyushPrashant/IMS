package com.inventory.service;

import com.inventory.dto.Requests.SupplierRequest;
import com.inventory.dto.Responses.SupplierResponse;
import com.inventory.entity.Supplier;
import com.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository repo;

    public SupplierService(SupplierRepository repo) {
        this.repo = repo;
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    public SupplierResponse toResponse(Supplier s) {
        SupplierResponse r = new SupplierResponse();
        r.supplierId    = s.getSupplierId();
        r.supplierName  = s.getSupplierName();
        r.contactNumber = s.getContactNumber();
        r.email         = s.getEmail();
        r.address       = s.getAddress();
        return r;
    }

    public List<SupplierResponse> toResponseList(List<Supplier> list) {
        List<SupplierResponse> result = new ArrayList<>();
        for (Supplier s : list) {
            result.add(toResponse(s));
        }
        return result;
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    public List<SupplierResponse> getAll() {
        return toResponseList(repo.findAll());
    }

    public Supplier getEntityById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + id));
    }

    // ── Mutations ─────────────────────────────────────────────────────────────

    @Transactional
    public SupplierResponse create(SupplierRequest req) {
        Supplier s = new Supplier();
        s.setSupplierName(req.supplierName);
        s.setContactNumber(req.contactNumber);
        s.setEmail(req.email);
        s.setAddress(req.address);
        return toResponse(repo.save(s));
    }

    @Transactional
    public SupplierResponse update(Long id, SupplierRequest req) {
        Supplier s = getEntityById(id);
        if (req.supplierName  != null) s.setSupplierName(req.supplierName);
        if (req.contactNumber != null) s.setContactNumber(req.contactNumber);
        if (req.email         != null) s.setEmail(req.email);
        if (req.address       != null) s.setAddress(req.address);
        return toResponse(repo.save(s));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Supplier not found: " + id);
        }
        repo.deleteById(id);
    }
}
