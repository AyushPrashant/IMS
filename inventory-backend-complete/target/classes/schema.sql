-- ─────────────────────────────────────────────────────────────────────────────
-- Inventory Management System — MySQL Schema
-- Run this once to create the database and all tables.
-- Hibernate ddl-auto=update will keep tables in sync after first run.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS inventory_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE inventory_db;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: godown
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS godown (
    godown_id   BIGINT       NOT NULL AUTO_INCREMENT,
    address     VARCHAR(255) NOT NULL,
    volume      DOUBLE       NOT NULL DEFAULT 0,
    used_volume DOUBLE       NOT NULL DEFAULT 0,
    PRIMARY KEY (godown_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: godown_head
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS godown_head (
    godown_head_id   BIGINT       NOT NULL AUTO_INCREMENT,
    godown_head_name VARCHAR(255) NOT NULL,
    username         VARCHAR(100) NOT NULL UNIQUE,
    password         VARCHAR(255) NOT NULL,
    email            VARCHAR(255),
    godownhead_no    VARCHAR(20),
    address          VARCHAR(255),
    phone_number     VARCHAR(20),
    role             VARCHAR(50)  NOT NULL DEFAULT 'GODOWNHEAD',
    otp              VARCHAR(10),
    otp_expiry       BIGINT,
    godown_id        BIGINT,
    PRIMARY KEY (godown_head_id),
    CONSTRAINT fk_godown_head_godown
        FOREIGN KEY (godown_id) REFERENCES godown(godown_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: product
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product (
    product_id       BIGINT       NOT NULL AUTO_INCREMENT,
    product_name     VARCHAR(255) NOT NULL,
    product_category VARCHAR(255),
    total_quantity   INT          NOT NULL DEFAULT 0,
    product_volume   DOUBLE                DEFAULT 0,
    price            DOUBLE                DEFAULT 0,
    product_type     VARCHAR(100),
    unit             VARCHAR(50),
    godown_id        BIGINT,
    PRIMARY KEY (product_id),
    CONSTRAINT fk_product_godown
        FOREIGN KEY (godown_id) REFERENCES godown(godown_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: supplier
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS supplier (
    supplier_id    BIGINT       NOT NULL AUTO_INCREMENT,
    supplier_name  VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    email          VARCHAR(255),
    address        VARCHAR(255),
    PRIMARY KEY (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: customer
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer (
    customer_id    BIGINT       NOT NULL AUTO_INCREMENT,
    customer_name  VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    email          VARCHAR(255),
    address        VARCHAR(255),
    PRIMARY KEY (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: purchase_order
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_order (
    purchase_id  BIGINT         NOT NULL AUTO_INCREMENT,
    supplier_id  BIGINT,
    godown_id    BIGINT,
    order_date   DATETIME,
    total_amount DOUBLE                  DEFAULT 0,
    status       VARCHAR(50)             DEFAULT 'COMPLETED',
    PRIMARY KEY (purchase_id),
    CONSTRAINT fk_purchase_supplier
        FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_purchase_godown
        FOREIGN KEY (godown_id) REFERENCES godown(godown_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: purchase_order_item
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_order_item (
    item_id      BIGINT       NOT NULL AUTO_INCREMENT,
    purchase_id  BIGINT       NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity     INT          NOT NULL DEFAULT 0,
    unit_price   DOUBLE                DEFAULT 0,
    total_price  DOUBLE                DEFAULT 0,
    PRIMARY KEY (item_id),
    CONSTRAINT fk_poi_purchase
        FOREIGN KEY (purchase_id) REFERENCES purchase_order(purchase_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: delivery_order
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS delivery_order (
    delivery_id     BIGINT      NOT NULL AUTO_INCREMENT,
    customer_id     BIGINT,
    godown_id       BIGINT,
    godown_head_id  BIGINT,
    order_date      DATETIME,
    sub_total       DOUBLE               DEFAULT 0,
    cgst_percent    DOUBLE               DEFAULT 9,
    sgst_percent    DOUBLE               DEFAULT 9,
    cgst_amount     DOUBLE               DEFAULT 0,
    sgst_amount     DOUBLE               DEFAULT 0,
    total_amount    DOUBLE               DEFAULT 0,
    status          VARCHAR(50)          DEFAULT 'DELIVERED',
    PRIMARY KEY (delivery_id),
    CONSTRAINT fk_delivery_customer
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_delivery_godown
        FOREIGN KEY (godown_id) REFERENCES godown(godown_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_delivery_godown_head
        FOREIGN KEY (godown_head_id) REFERENCES godown_head(godown_head_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: delivery_order_item
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS delivery_order_item (
    item_id      BIGINT       NOT NULL AUTO_INCREMENT,
    delivery_id  BIGINT       NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity     INT          NOT NULL DEFAULT 0,
    sell_price   DOUBLE                DEFAULT 0,
    total_price  DOUBLE                DEFAULT 0,
    PRIMARY KEY (item_id),
    CONSTRAINT fk_doi_delivery
        FOREIGN KEY (delivery_id) REFERENCES delivery_order(delivery_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- SEED DATA — default admin password: Admin@1234
-- BCrypt hash of "Admin@1234" with strength 12
-- ─────────────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO godown (godown_id, address, volume, used_volume)
VALUES (1, 'Main Warehouse, Pune', 100000, 0);

INSERT IGNORE INTO godown_head (
    godown_head_id, godown_head_name, username, password,
    email, godownhead_no, address, phone_number, role, godown_id
) VALUES (
    1,
    'Administrator',
    'admin',
    '$2a$12$Uef38YpG8ccA3Wlr.iY/3OIqfo1PPiXJnaCg6h82L5pWo3eXscXCC',
    'admin@inventory.com',
    '9999999999',
    'Head Office, Pune',
    '9999999999',
    'ADMIN',
    NULL
);
