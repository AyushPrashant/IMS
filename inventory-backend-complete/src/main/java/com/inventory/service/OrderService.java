package com.inventory.service;

import com.inventory.dto.Requests.DeliveryOrderRequest;
import com.inventory.dto.Requests.PurchaseOrderRequest;
import com.inventory.dto.Responses.CustomerResponse;
import com.inventory.dto.Responses.DeliveryItemResponse;
import com.inventory.dto.Responses.DeliveryOrderResponse;
import com.inventory.dto.Responses.MonthlyOrderQtyResponse;
import com.inventory.dto.Responses.MonthlySalesResponse;
import com.inventory.dto.Responses.PurchaseItemResponse;
import com.inventory.dto.Responses.PurchaseOrderResponse;
import com.inventory.dto.Responses.SalesByDateResponse;
import com.inventory.dto.Responses.SalesCountResponse;
import com.inventory.entity.Customer;
import com.inventory.entity.DeliveryOrder;
import com.inventory.entity.DeliveryOrderItem;
import com.inventory.entity.Godown;
import com.inventory.entity.Product;
import com.inventory.entity.PurchaseOrder;
import com.inventory.entity.PurchaseOrderItem;
import com.inventory.entity.Supplier;
import com.inventory.repository.CustomerRepository;
import com.inventory.repository.DeliveryOrderRepository;
import com.inventory.repository.GodownHeadRepository;
import com.inventory.repository.GodownRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.PurchaseOrderRepository;
import com.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final PurchaseOrderRepository purchRepo;
    private final DeliveryOrderRepository delRepo;
    private final SupplierRepository      supplierRepo;
    private final CustomerRepository      customerRepo;
    private final GodownRepository        godownRepo;
    private final GodownHeadRepository    ghRepo;
    private final ProductRepository       productRepo;

    public OrderService(PurchaseOrderRepository purchRepo,
                        DeliveryOrderRepository delRepo,
                        SupplierRepository supplierRepo,
                        CustomerRepository customerRepo,
                        GodownRepository godownRepo,
                        GodownHeadRepository ghRepo,
                        ProductRepository productRepo) {
        this.purchRepo    = purchRepo;
        this.delRepo      = delRepo;
        this.supplierRepo = supplierRepo;
        this.customerRepo = customerRepo;
        this.godownRepo   = godownRepo;
        this.ghRepo       = ghRepo;
        this.productRepo  = productRepo;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELIVERY MAPPING
    // ─────────────────────────────────────────────────────────────────────────

    private DeliveryOrderResponse toDeliveryResponse(DeliveryOrder d) {
        DeliveryOrderResponse r = new DeliveryOrderResponse();

        r.orderId   = d.getDeliveryId();
        r.orderDate = d.getOrderDate() != null ? d.getOrderDate().toString() : null;
        r.status    = d.getStatus();

        if (d.getCustomer() != null) {
            CustomerResponse cr = new CustomerResponse();
            cr.customerId      = d.getCustomer().getCustomerId();
            cr.customerName    = d.getCustomer().getCustomerName();
            cr.customerNo      = d.getCustomer().getContactNumber();
            cr.customerAddress = d.getCustomer().getAddress();
            cr.email           = d.getCustomer().getEmail();
            r.customer         = cr;
        }

        List<DeliveryItemResponse> products = new ArrayList<>();
        if (d.getItems() != null) {
            for (DeliveryOrderItem item : d.getItems()) {
                DeliveryItemResponse ir = new DeliveryItemResponse();
                ir.productName   = item.getProductName();
                ir.orderQuantity = item.getQuantity();
                ir.sellPrice     = item.getSellPrice();
                ir.totalPrice    = item.getTotalPrice();
                products.add(ir);
            }
        }
        r.products = products;

        r.totalSellPrice = d.getSubTotal();
        r.cgstPercent    = d.getCgstPercent();
        r.sgstPercent    = d.getSgstPercent();
        r.cgstAmount     = d.getCgstAmount();
        r.sgstAmount     = d.getSgstAmount();
        r.totalAmount    = d.getTotalAmount();

        if (d.getGodownHead() != null) {
            r.godownHeadName = d.getGodownHead().getGodownHeadName();
        }
        if (d.getGodown() != null) {
            r.godownAddress = d.getGodown().getAddress();
        }

        return r;
    }

    private List<DeliveryOrderResponse> toDeliveryResponseList(List<DeliveryOrder> list) {
        List<DeliveryOrderResponse> result = new ArrayList<>();
        for (DeliveryOrder d : list) {
            result.add(toDeliveryResponse(d));
        }
        return result;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PURCHASE MAPPING
    // ─────────────────────────────────────────────────────────────────────────

    private PurchaseOrderResponse toPurchaseResponse(PurchaseOrder p) {
        PurchaseOrderResponse r = new PurchaseOrderResponse();
        r.purchaseId   = p.getPurchaseId();
        r.purchaseDate = p.getOrderDate() != null ? p.getOrderDate().toString() : null;
        r.godownId     = p.getGodown() != null ? p.getGodown().getGodownId() : null;
        r.totalAmount  = p.getTotalAmount();
        r.status       = p.getStatus();

        List<PurchaseItemResponse> items = new ArrayList<>();
        if (p.getItems() != null) {
            for (PurchaseOrderItem item : p.getItems()) {
                PurchaseItemResponse ir = new PurchaseItemResponse();
                ir.productName      = item.getProductName();
                ir.purchaseQuantity = item.getQuantity();
                ir.unitPrice        = item.getUnitPrice();
                ir.totalPrice       = item.getTotalPrice();

                if (r.godownId != null) {
                    productRepo.findByProductNameAndGodown_GodownId(
                            item.getProductName(), r.godownId)
                            .ifPresent(prod -> {
                                ir.productVolume   = prod.getProductVolume();
                                ir.productType     = prod.getProductType();
                                ir.productCategory = prod.getProductCategory();
                            });
                }
                items.add(ir);
            }
        }
        r.products = items;
        return r;
    }

    private List<PurchaseOrderResponse> toPurchaseResponseList(List<PurchaseOrder> list) {
        List<PurchaseOrderResponse> result = new ArrayList<>();
        for (PurchaseOrder p : list) {
            result.add(toPurchaseResponse(p));
        }
        return result;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PURCHASE OPERATIONS
    // ─────────────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getAllPurchase() {
        return toPurchaseResponseList(purchRepo.findAll());
    }

    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseById(Long id) {
        PurchaseOrder p = purchRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found: " + id));
        return toPurchaseResponse(p);
    }

    public Long getPurchaseCountByGodown(Long godownId) {
        Long c = purchRepo.countPurchasedProductsByGodownId(godownId);
        return c != null ? c : 0L;
    }

    public Long getTotalPurchaseCount() {
        Long c = purchRepo.countAllPurchasedProducts();
        return c != null ? c : 0L;
    }

    @Transactional
    public PurchaseOrderResponse createPurchase(PurchaseOrderRequest req, String username) {
        Supplier supplier = supplierRepo.findById(req.supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found: " + req.supplierId));
        Godown godown = godownRepo.findById(req.godownId)
                .orElseThrow(() -> new RuntimeException("Godown not found: " + req.godownId));

        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(supplier);
        order.setGodown(godown);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("COMPLETED");

        List<PurchaseOrderItem> items = new ArrayList<>();
        double total = 0.0;

        for (PurchaseOrderRequest.ItemLine line : req.items) {
            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setProductName(line.productName);
            item.setQuantity(line.quantity);
            item.setUnitPrice(line.unitPrice);
            item.setTotalPrice(line.quantity * line.unitPrice);
            item.setPurchaseOrder(order);
            items.add(item);
            total += item.getTotalPrice();

            productRepo.findByProductNameAndGodown_GodownId(line.productName, req.godownId)
                    .ifPresent(prod -> {
                        prod.setTotalQuantity(prod.getTotalQuantity() + line.quantity);
                        productRepo.save(prod);
                    });
        }

        order.setItems(items);
        order.setTotalAmount(total);
        return toPurchaseResponse(purchRepo.save(order));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELIVERY OPERATIONS
    // ─────────────────────────────────────────────────────────────────────────

    public List<DeliveryOrderResponse> getAllDelivery() {
        return toDeliveryResponseList(delRepo.findAll());
    }

    public List<DeliveryOrderResponse> getDeliveryByGodown(Long godownId) {
        return toDeliveryResponseList(
                delRepo.findByGodown_GodownIdOrderByOrderDateDesc(godownId));
    }

    public DeliveryOrderResponse getDeliveryById(Long id) {
        DeliveryOrder d = delRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery order not found: " + id));
        return toDeliveryResponse(d);
    }

    public Long getTotalDeliveryProductsCount() {
        Long c = delRepo.countTotalDeliveryProducts();
        return c != null ? c : 0L;
    }

    @Transactional
    public DeliveryOrderResponse placeOrder(Long customerId, Long godownId,
                                             DeliveryOrderRequest req, String username) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));
        Godown godown = godownRepo.findById(godownId)
                .orElseThrow(() -> new RuntimeException("Godown not found: " + godownId));

        DeliveryOrder order = new DeliveryOrder();
        order.setCustomer(customer);
        order.setGodown(godown);
        order.setOrderDate(LocalDateTime.now());
        order.setCgstPercent(9.0);
        order.setSgstPercent(9.0);
        order.setStatus("DELIVERED");

        ghRepo.findByUsername(username).ifPresent(order::setGodownHead);

        List<DeliveryOrderItem> items = new ArrayList<>();
        double subtotal = 0.0;

        for (DeliveryOrderRequest.ItemLine line : req.products) {
            Product prod = productRepo
                    .findByProductNameAndGodown_GodownId(line.productName, godownId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + line.productName));

            int qty = line.orderQuantity;
            if (prod.getTotalQuantity() < qty) {
                throw new RuntimeException("Insufficient stock for: " + line.productName
                        + " (available: " + prod.getTotalQuantity() + ")");
            }

            prod.setTotalQuantity(prod.getTotalQuantity() - qty);
            productRepo.save(prod);

            DeliveryOrderItem item = new DeliveryOrderItem();
            item.setProductName(line.productName);
            item.setQuantity(qty);
            item.setSellPrice(line.sellPrice);
            item.setTotalPrice(qty * line.sellPrice);
            item.setDeliveryOrder(order);
            items.add(item);
            subtotal += item.getTotalPrice();
        }

        double cgst = subtotal * 9.0 / 100.0;
        double sgst = subtotal * 9.0 / 100.0;

        order.setItems(items);
        order.setSubTotal(subtotal);
        order.setCgstAmount(cgst);
        order.setSgstAmount(sgst);
        order.setTotalAmount(subtotal + cgst + sgst);

        return toDeliveryResponse(delRepo.save(order));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ANALYTICS
    // ─────────────────────────────────────────────────────────────────────────

    public SalesCountResponse getTotalSalesCountByGodown(Long godownId) {
        Long orderCount;
        Long qtySum;

        if (godownId != null) {
            orderCount = delRepo.countByGodown_GodownId(godownId);
            qtySum     = delRepo.sumQuantitiesByGodownId(godownId);
        } else {
            orderCount = delRepo.count();
            qtySum     = delRepo.countTotalDeliveryProducts();
        }

        return new SalesCountResponse(
                orderCount != null ? orderCount : 0L,
                qtySum     != null ? qtySum     : 0L);
    }

    public SalesByDateResponse getSalesByDate(Long godownId, String date) {
        Long orderCount = 0L;
        Long qtySum     = 0L;

        if (godownId != null && date != null) {
            orderCount = delRepo.countByGodownIdAndDate(godownId, date);
            qtySum     = delRepo.sumQuantitiesByGodownIdAndDate(godownId, date);
        }

        return new SalesByDateResponse(
                orderCount != null ? orderCount : 0L,
                qtySum     != null ? qtySum     : 0L);
    }

    public List<MonthlySalesResponse> getSalesByMonth(Long godownId) {
        int year = LocalDateTime.now().getYear();
        List<Object[]> rows = delRepo.findMonthlySalesByGodownAndYear(godownId, year);

        long[] counts = new long[13];
        for (Object[] row : rows) {
            int  m = ((Number) row[0]).intValue();
            long c = ((Number) row[1]).longValue();
            if (m >= 1 && m <= 12) counts[m] = c;
        }

        List<MonthlySalesResponse> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            result.add(new MonthlySalesResponse(Month.of(m).name(), counts[m]));
        }
        return result;
    }

    public List<MonthlyOrderQtyResponse> getOrderQtyByMonth(Long godownId) {
        int year = LocalDateTime.now().getYear();
        List<Object[]> rows = delRepo.findMonthlyOrderQtyByGodownAndYear(godownId, year);

        long[] counts = new long[13];
        for (Object[] row : rows) {
            int  m = ((Number) row[0]).intValue();
            long c = ((Number) row[1]).longValue();
            if (m >= 1 && m <= 12) counts[m] = c;
        }

        List<MonthlyOrderQtyResponse> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            result.add(new MonthlyOrderQtyResponse(Month.of(m).name(), counts[m]));
        }
        return result;
    }

    public List<Object[]> getSalesByWeek() {
        return delRepo.findWeeklySales();
    }
}
