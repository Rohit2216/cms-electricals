ALTER TABLE `energy_companies` ADD `admin_id` INT(11) NOT NULL AFTER `id`;

ALTER TABLE `energy_companies` ADD `webeiste` VARCHAR(255) NULL DEFAULT NULL AFTER `name`;

ALTER TABLE `admins` CHANGE `first_name` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;

ALTER TABLE `users` CHANGE `zone_id` `zone_id` VARCHAR(11) NULL DEFAULT NULL, CHANGE `regional_id` `regional_id` VARCHAR(11) NULL DEFAULT NULL, CHANGE `sale_area_id` `sale_area_id` VARCHAR(11) NULL DEFAULT NULL;

ALTER TABLE `admins` CHANGE `status` `status` VARCHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1';

