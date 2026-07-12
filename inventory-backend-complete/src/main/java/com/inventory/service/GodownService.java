package com.inventory.service;

import com.inventory.dto.Requests.GodownRequest;
import com.inventory.dto.Responses.CapacityResponse;
import com.inventory.dto.Responses.GodownResponse;
import com.inventory.dto.Responses.ProductResponse;
import com.inventory.entity.Godown;
import com.inventory.entity.Product;
import com.inventory.repository.GodownRepository;
import com.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class GodownService {

    private final GodownRepository  repo;
    private final ProductRepository productRepo;

    public GodownService(GodownRepository repo, ProductRepository productRepo) {
        this.repo        = repo;
        this.productRepo = productRepo;
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    public GodownResponse toResponse(Godown g) {
        GodownResponse r = new GodownResponse();
        r.godownId   = g.getGodownId();
        r.address    = g.getAddress();
        r.volume     = g.getVolume();
        r.usedVolume = g.getUsedVolume();
        return r;
    }

    public GodownResponse toResponseWithProducts(Godown g) {
        GodownResponse r = toResponse(g);
        List<Product> products = productRepo.findByGodown_GodownId(g.getGodownId());
        List<ProductResponse> productList = new ArrayList<>();
        for (Product p : products) {
            ProductResponse pr = new ProductResponse();
            pr.productId       = p.getProductId();
            pr.productName     = p.getProductName();
            pr.productCategory = p.getProductCategory();
            pr.totalQuantity   = p.getTotalQuantity();
            pr.productVolume   = p.getProductVolume();
            pr.price           = p.getPrice();
            pr.productType     = p.getProductType();
            pr.unit            = p.getUnit();
            pr.godownId        = g.getGodownId();
            productList.add(pr);
        }
        r.productList = productList;
        return r;
    }

    public List<GodownResponse> toResponseList(List<Godown> list) {
        List<GodownResponse> result = new ArrayList<>();
        for (Godown g : list) {
            result.add(toResponse(g));
        }
        return result;
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    public List<GodownResponse> getAll() {
        return toResponseList(repo.findAll());
    }

    public GodownResponse getById(Long id) {
        Godown g = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Godown not found: " + id));
        return toResponseWithProducts(g);
    }

    public long count() {
        return repo.count();
    }

    public CapacityResponse getCapacity(Long id) {
        Godown g = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Godown not found: " + id));
        double available = Math.max(0.0, g.getVolume() - g.getUsedVolume());
        return new CapacityResponse(g.getVolume(), g.getUsedVolume(), available);
    }

    // ── Mutations ─────────────────────────────────────────────────────────────

    @Transactional
    public String create(GodownRequest req) {
        Godown g = new Godown();
        g.setAddress(req.address);
        g.setVolume(req.volume);
        g.setUsedVolume(0.0);
        Godown saved = repo.save(g);
        return "Godown created with ID " + saved.getGodownId();
    }

    @Transactional
    public GodownResponse update(Long id, GodownRequest req) {
        Godown g = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Godown not found: " + id));
        if (req.address != null) g.setAddress(req.address);
        if (req.volume  != null) g.setVolume(req.volume);
        return toResponse(repo.save(g));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Godown not found: " + id);
        }
        repo.deleteById(id);
    }
}
