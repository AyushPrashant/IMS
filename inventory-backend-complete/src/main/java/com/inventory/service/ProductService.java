package com.inventory.service;

import com.inventory.dto.Requests.ProductRequest;
import com.inventory.dto.Requests.UpdateProductByNameRequest;
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
public class ProductService {

    private final ProductRepository repo;
    private final GodownRepository  godownRepo;

    public ProductService(ProductRepository repo, GodownRepository godownRepo) {
        this.repo       = repo;
        this.godownRepo = godownRepo;
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    public ProductResponse toResponse(Product p) {
        ProductResponse r = new ProductResponse();
        r.productId       = p.getProductId();
        r.productName     = p.getProductName();
        r.productCategory = p.getProductCategory();
        r.totalQuantity   = p.getTotalQuantity();
        r.productVolume   = p.getProductVolume();
        r.price           = p.getPrice();
        r.productType     = p.getProductType();
        r.unit            = p.getUnit();
        r.godownId        = p.getGodown() != null ? p.getGodown().getGodownId() : null;
        return r;
    }

    public List<ProductResponse> toResponseList(List<Product> products) {
        List<ProductResponse> list = new ArrayList<>();
        for (Product p : products) {
            list.add(toResponse(p));
        }
        return list;
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    public List<ProductResponse> getAll() {
        return toResponseList(repo.findAll());
    }

    public List<ProductResponse> getByGodown(Long godownId) {
        return toResponseList(repo.findByGodown_GodownId(godownId));
    }

    public ProductResponse getById(Long id) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        return toResponse(p);
    }

    public List<String[]> getAllProductNamesAsArrays() {
        List<Product> all = repo.findAll();
        List<String[]> result = new ArrayList<>();
        for (Product p : all) {
            result.add(new String[]{p.getProductName()});
        }
        return result;
    }

    public List<Object[]> getTopSelling(Long godownId) {
        if (godownId != null) {
            return repo.findTopSellingProductsByGodown(godownId);
        }
        return repo.findTopSellingProducts();
    }

    // ── Mutations ─────────────────────────────────────────────────────────────

    @Transactional
    public ProductResponse create(ProductRequest req) {
        Godown g = godownRepo.findById(req.godownId)
                .orElseThrow(() -> new RuntimeException("Godown not found: " + req.godownId));

        double vol = (req.productVolume != null ? req.productVolume : 0.0)
                   * (req.totalQuantity  != null ? req.totalQuantity  : 0);

        if (vol > 0 && (g.getVolume() - g.getUsedVolume()) < vol) {
            throw new RuntimeException("Insufficient godown capacity");
        }

        Product p = new Product();
        p.setProductName(req.productName);
        p.setProductCategory(req.productCategory);
        p.setTotalQuantity(req.totalQuantity != null ? req.totalQuantity : 0);
        p.setProductVolume(req.productVolume != null ? req.productVolume : 0.0);
        p.setPrice(req.price != null ? req.price : 0.0);
        p.setProductType(req.productType);
        p.setUnit(req.unit);
        p.setGodown(g);

        g.setUsedVolume(g.getUsedVolume() + vol);
        godownRepo.save(g);

        return toResponse(repo.save(p));
    }

    @Transactional
    public ProductResponse updateByName(UpdateProductByNameRequest req) {
        Product p = repo.findByProductNameAndGodown_GodownId(req.productName, req.godownId)
                .orElseThrow(() -> new RuntimeException(
                        "Product not found: " + req.productName + " in godown " + req.godownId));

        if (req.price         != null) p.setPrice(req.price);
        if (req.productVolume != null) p.setProductVolume(req.productVolume);
        if (req.totalQuantity != null) p.setTotalQuantity(req.totalQuantity);

        return toResponse(repo.save(p));
    }

    @Transactional
    public ProductResponse updateById(Long id, ProductRequest req) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        if (req.productName     != null) p.setProductName(req.productName);
        if (req.productCategory != null) p.setProductCategory(req.productCategory);
        if (req.totalQuantity   != null) p.setTotalQuantity(req.totalQuantity);
        if (req.price           != null) p.setPrice(req.price);
        if (req.productType     != null) p.setProductType(req.productType);
        if (req.unit            != null) p.setUnit(req.unit);
        if (req.productVolume   != null) p.setProductVolume(req.productVolume);

        return toResponse(repo.save(p));
    }

    @Transactional
    public void delete(Long id) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        Godown g = p.getGodown();
        if (g != null) {
            double freed = p.getProductVolume() * p.getTotalQuantity();
            g.setUsedVolume(Math.max(0.0, g.getUsedVolume() - freed));
            godownRepo.save(g);
        }
        repo.deleteById(id);
    }
}
