package com.inventory.service;

import com.inventory.dto.Requests.RegisterRequest;
import com.inventory.dto.Requests.UpdatePasswordRequest;
import com.inventory.dto.Requests.UpdateProfileRequest;
import com.inventory.dto.Responses.GodownHeadResponse;
import com.inventory.entity.Godown;
import com.inventory.entity.GodownHead;
import com.inventory.repository.GodownHeadRepository;
import com.inventory.repository.GodownRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class GodownHeadService {

    private final GodownHeadRepository repo;
    private final GodownRepository     godownRepo;
    private final PasswordEncoder      encoder;

    public GodownHeadService(GodownHeadRepository repo,
                              GodownRepository godownRepo,
                              PasswordEncoder encoder) {
        this.repo       = repo;
        this.godownRepo = godownRepo;
        this.encoder    = encoder;
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    public GodownHeadResponse toResponse(GodownHead h) {
        GodownHeadResponse r = new GodownHeadResponse();
        r.godownHeadId   = h.getGodownHeadId();
        r.godownHeadName = h.getGodownHeadName();
        r.username       = h.getUsername();
        r.email          = h.getEmail();
        r.godownheadNo   = h.getGodownheadNo();
        r.address        = h.getAddress();
        r.phoneNumber    = h.getPhoneNumber();
        r.role           = h.getRole();
        r.godownId       = h.getGodown() != null ? h.getGodown().getGodownId() : null;
        return r;
    }

    public List<GodownHeadResponse> toResponseList(List<GodownHead> list) {
        List<GodownHeadResponse> result = new ArrayList<>();
        for (GodownHead h : list) {
            result.add(toResponse(h));
        }
        return result;
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    public GodownHeadResponse getById(Long id) {
        GodownHead h = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("GodownHead not found: " + id));
        return toResponse(h);
    }

    public GodownHeadResponse getByUsername(String username) {
        GodownHead h = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return toResponse(h);
    }

    public GodownHead getEntityByUsername(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public GodownHeadResponse getFirstByGodownId(Long godownId) {
        List<GodownHead> list = repo.findByGodown_GodownId(godownId);
        if (list == null || list.isEmpty()) {
            GodownHeadResponse empty = new GodownHeadResponse();
            empty.godownHeadName = "";
            return empty;
        }
        return toResponse(list.get(0));
    }

    // ── Mutations ─────────────────────────────────────────────────────────────

    @Transactional
    public GodownHead register(RegisterRequest req) {
        if (repo.existsByUsername(req.username)) {
            throw new RuntimeException("Username already taken");
        }
        if (req.email != null && !req.email.isBlank() && repo.existsByEmail(req.email)) {
            throw new RuntimeException("Email already registered");
        }

        GodownHead h = new GodownHead();
        h.setGodownHeadName(req.godownHeadName);
        h.setUsername(req.username);
        h.setPassword(encoder.encode(req.password));
        h.setEmail(req.email);
        h.setAddress(req.address);
        h.setGodownheadNo(req.godownHeadNo);
        h.setRole("GODOWNHEAD");

        if (req.godownId != null) {
            Godown g = godownRepo.findById(req.godownId)
                    .orElseThrow(() -> new RuntimeException("Godown not found: " + req.godownId));
            h.setGodown(g);
        }

        return repo.save(h);
    }

    @Transactional
    public GodownHeadResponse update(Long id, UpdateProfileRequest req) {
        GodownHead h = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("GodownHead not found: " + id));

        if (req.godownHeadName != null) h.setGodownHeadName(req.godownHeadName);
        if (req.email          != null) h.setEmail(req.email);
        if (req.address        != null) h.setAddress(req.address);
        if (req.phoneNumber    != null) h.setPhoneNumber(req.phoneNumber);

        return toResponse(repo.save(h));
    }

    @Transactional
    public void updatePassword(Long id, UpdatePasswordRequest req) {
        GodownHead h = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("GodownHead not found: " + id));

        if (!encoder.matches(req.oldPassword, h.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        h.setPassword(encoder.encode(req.newPassword));
        repo.save(h);
    }
}
