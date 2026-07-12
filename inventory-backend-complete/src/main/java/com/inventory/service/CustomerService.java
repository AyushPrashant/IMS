package com.inventory.service;

import com.inventory.dto.Requests.CustomerRequest;
import com.inventory.dto.Responses.CustomerResponse;
import com.inventory.entity.Customer;
import com.inventory.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repo;

    public CustomerService(CustomerRepository repo) {
        this.repo = repo;
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    public CustomerResponse toResponse(Customer c) {
        CustomerResponse r = new CustomerResponse();
        r.customerId      = c.getCustomerId();
        r.customerName    = c.getCustomerName();
        r.customerNo      = c.getContactNumber();
        r.customerAddress = c.getAddress();
        r.email           = c.getEmail();
        return r;
    }

    public List<CustomerResponse> toResponseList(List<Customer> list) {
        List<CustomerResponse> result = new ArrayList<>();
        for (Customer c : list) {
            result.add(toResponse(c));
        }
        return result;
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    public List<CustomerResponse> getAll() {
        return toResponseList(repo.findAll());
    }

    public CustomerResponse getById(Long id) {
        Customer c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + id));
        return toResponse(c);
    }

    public Customer getEntityById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + id));
    }

    // ── Mutations ─────────────────────────────────────────────────────────────

    @Transactional
    public CustomerResponse create(CustomerRequest req) {
        Customer c = new Customer();
        c.setCustomerName(req.customerName);
        c.setContactNumber(req.customerNo);
        c.setAddress(req.customerAddress);
        c.setEmail(req.email);
        return toResponse(repo.save(c));
    }

    @Transactional
    public CustomerResponse update(Long id, CustomerRequest req) {
        Customer c = getEntityById(id);
        if (req.customerName    != null) c.setCustomerName(req.customerName);
        if (req.customerNo      != null) c.setContactNumber(req.customerNo);
        if (req.customerAddress != null) c.setAddress(req.customerAddress);
        if (req.email           != null) c.setEmail(req.email);
        return toResponse(repo.save(c));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Customer not found: " + id);
        }
        repo.deleteById(id);
    }
}
