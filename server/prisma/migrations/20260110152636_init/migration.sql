-- CreateTable
CREATE TABLE `user_activity` (
    `activity_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `session_id` VARCHAR(100) NOT NULL,
    `is_guest` BOOLEAN NOT NULL DEFAULT false,
    `event_type` ENUM('login_success', 'login_failed', 'logout', 'register_email', 'register_google', 'password_changed', 'password_reset_request', 'password_reset_success', 'session_start', 'session_end', 'page_view', 'add_to_cart', 'remove_from_cart', 'checkout_started', 'payment_initiated', 'payment_success', 'payment_failed', 'certification_view', 'practice_test_start', 'final_test_start', 'review_submitted', 'site_error') NOT NULL,
    `page_url` VARCHAR(500) NULL,
    `referrer_url` VARCHAR(500) NULL,
    `device_type` ENUM('desktop', 'mobile', 'tablet') NULL,
    `browser_name` VARCHAR(100) NULL,
    `ip_address` VARCHAR(50) NULL,
    `geo_country` VARCHAR(100) NULL,
    `geo_city` VARCHAR(100) NULL,
    `order_id` BIGINT NULL,
    `amount` DECIMAL(10, 2) NULL,
    `currency` VARCHAR(10) NULL DEFAULT 'INR',
    `event_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `metadata` JSON NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_user_activity_user`(`user_id`),
    INDEX `idx_user_activity_event`(`event_type`),
    INDEX `idx_user_activity_session`(`session_id`),
    INDEX `idx_user_activity_time`(`event_time`),
    INDEX `idx_user_activity_order`(`order_id`),
    PRIMARY KEY (`activity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `session_id` VARCHAR(100) NOT NULL,
    `user_id` INTEGER NULL,
    `is_guest` BOOLEAN NOT NULL DEFAULT false,
    `auth_method` ENUM('email', 'google', 'guest') NOT NULL DEFAULT 'guest',
    `login_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `logout_time` DATETIME(0) NULL,
    `last_seen_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ip_address` VARCHAR(50) NULL,
    `geo_country` VARCHAR(100) NULL,
    `geo_city` VARCHAR(100) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_user_sessions_active`(`logout_time`, `last_seen_at`),
    INDEX `idx_user_sessions_user`(`user_id`),
    INDEX `idx_user_sessions_login_time`(`login_time`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_audit_log` (
    `audit_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `action_type` ENUM('password_changed', 'profile_updated', 'email_changed', 'role_changed', 'account_locked', 'account_unlocked') NOT NULL,
    `performed_by` INTEGER NULL,
    `ip_address` VARCHAR(50) NULL,
    `old_value` JSON NULL,
    `new_value` JSON NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_audit_user`(`user_id`),
    INDEX `idx_audit_action`(`action_type`),
    INDEX `idx_audit_created_at`(`created_at`),
    PRIMARY KEY (`audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `auth_provider` ENUM('EMAIL', 'GOOGLE') NULL,
    `password_changed_at` DATETIME(0) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_activity` ADD CONSTRAINT `fk_user_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `fk_user_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_audit_log` ADD CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_audit_log` ADD CONSTRAINT `fk_audit_performed_by` FOREIGN KEY (`performed_by`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
