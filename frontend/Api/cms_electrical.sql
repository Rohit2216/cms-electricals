-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 16, 2023 at 12:29 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_electrical`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(150) NOT NULL,
  `contact_no` char(15) DEFAULT NULL,
  `alt_number` varchar(15) DEFAULT NULL,
  `user_type` bigint(11) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `address_1` text NOT NULL,
  `status` varchar(5) NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `country` varchar(120) DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `pin_code` varchar(8) DEFAULT NULL,
  `image` varchar(244) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `gst_number` varchar(255) DEFAULT NULL,
  `fb_url` varchar(244) DEFAULT NULL,
  `inst_url` varchar(244) DEFAULT NULL,
  `twitter_url` varchar(244) DEFAULT NULL,
  `linkedin_url` varchar(244) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `contact_no`, `alt_number`, `user_type`, `remember_token`, `address_1`, `status`, `is_deleted`, `country`, `city`, `pin_code`, `image`, `description`, `gst_number`, `fb_url`, `inst_url`, `twitter_url`, `linkedin_url`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Super Admins', 'superadmin1@gmail.com', '$2b$10$G5o/ryHubhH90xmEH7ot0uzmuax0LAx6IVHb.at0eu7noZbQFHXqW', '9313301020', NULL, 1, NULL, 'Noida', '1', '0', '', NULL, NULL, '/super_admin_images/16787952628084k-1.jfif', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-02-06 12:44:51', '2023-03-14 12:01:02'),
(2, 'Contractor 1', 'con@gmail.com', '$2b$10$LihWa1/V3caZGjiR6PHikeMjQRJ/h5XaOiJIb/Ly7poQuNNiZV5b6', '9313301020', '659849885', 3, NULL, 'Noida 2', '1', '1', 'India', 'Noida', '110092', NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-02-09 17:07:40', '2023-03-14 15:59:25'),
(3, 'Dealer123', 'delear1@gmail.com', '$2b$10$kItrIrXeWTpsowO43iLgMugPintCnJaku4Di0xCJCWbF3itIzfame', '9313301020', '8521456325', 4, NULL, 'Noida sector 6', '1', '0', 'India', 'Noida', '201301', '/user_images/16788611269364k-2.jfif', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-02-09 18:04:59', '2023-03-15 11:48:53'),
(5, 'Rahul ', 'admin@gmail.com', '$2b$10$je1z8w/50E2ed5uEK49xBOuc0ZHbaFNFJXTS/Tcpd4y25TTKLVXBy', '9313301020', '659849885', 8, NULL, '', '', '0', '', '', '110092', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-02-10 10:38:12', NULL),
(11, 'Energy Company ', 'energycompany1@gmail.com', '$2b$10$4wc/yP40/ExP5ZuTzLorUecGombgjfclTIA3DgvSp2J2x0LGq/qpC', '9313301020', '9313301020', 2, NULL, 'Moida sector-6', '1', '0', 'India', 'Noida', '2301301', '', 'this is test for profile update', 'DGD8675DFJ', '', '', '', '', 1, '2023-02-15 14:07:03', '2023-03-15 18:15:54'),
(12, 'Energy Company 3', 'energycompany2@gmail.com', '$2b$10$8vS6QufBCh4bTEvZ1rYFJee2bi6DdVe44DG14/YCKYo8ZfHd77lkO', '9313301020', '659849885', 2, NULL, '', '1', '0', '', '', '110092', NULL, 'test energy company 2 created', 'DGD8675DFJ', NULL, NULL, NULL, NULL, 1, '2023-02-16 11:31:14', NULL),
(14, 'Energy Company 2', 'energycompany2@gmail.com', '$2b$10$7OusHF1scdvJRIbRB0yxGedfOUJZin.bGZ9U2kkncHDF37QRLpM9O', '9313301020', '659849885', 2, NULL, 'NOida sector 6', '1', '0', 'India', 'Noida', '110092', '', 'test energy company 2 created', 'DGD8675DFJ', NULL, NULL, NULL, NULL, 1, '2023-02-17 18:04:07', '2023-03-16 10:54:49'),
(15, 'Energy Company 4', 'energycompany1@gmail.com', '$2b$10$IAqu12OnV671685dsl3ovujY.3G835silnR0QIImlTE5VfhayqMGa', '9313301020', '659849885', 2, NULL, 'NOida sector 6', '1', '0', '', '', '110092', '', 'test energy company 2 created', 'DGD8675DFJ', NULL, NULL, NULL, NULL, 1, '2023-02-17 18:05:05', NULL),
(16, 'Energy Company 5', 'energycompany1@gmail.com', '$2b$10$ybANX5J2xEnBebuGhXMvF.kvFByzQxAqY0jnxLzL3b1XqLzTMMzL.', '9313301020', '659849885', 2, NULL, 'NOida sector 6', '1', '0', '', '', '110092', '', 'test energy company 2 created', 'DGD8675DFJ', NULL, NULL, NULL, NULL, 1, '2023-02-17 18:20:57', NULL),
(18, 'Contractor 2', 'contractor2@gmail.com', '$2b$10$YqCs2Wtz/SgVafmxCyr7Z.KgKvycdHPFE/vfQM4jm780vkPlyneWK', '9313301020', '9313301020', 3, NULL, 'Noida sector 6', '1', '0', 'India', 'Noida', '230125', '/user_images/1678876327966download.jpg', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-02-20 12:16:55', '2023-03-15 16:02:07'),
(24, 'Dealer 2', 'dealer2@gmail.com', '$2b$10$LAFiVhyM9j3rR0bQejM.veVnClIiszQrLQtaAe2uwhejtZUcNrpwK', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '1', '0', 'India', 'Noida', '2301025', '/user_images/1676974615106istockphoto-1163423519-612x612.jpg', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-02-21 15:46:55', NULL),
(25, 'Dealer 2', 'dealer2@gmail.com', '$2b$10$ml7nwzqlflsYOplIma5MI.IivQy1ZHuCYxPwT.hokNNxT8DW13oZO', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '1', '0', 'India', 'Noida', '2301025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-06 14:41:59', '2023-03-14 13:30:36'),
(26, 'Dealer 2', 'dealer2@gmail.com', '$2b$10$YhUxAOYdlQF8nF9RKsfovuEpCBnWjatXBb6q5yk2LL1BuHVI34lWa', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '0', '0', 'India', 'Noida', '2301025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-07 14:54:51', NULL),
(27, 'Dealer 4', 'dealer4@gmail.com', '$2b$10$tAImxvYmjQO8I8Ym0mADFetVWY.qxc18/InDG6RxRKJM3rL0kO8qu', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '0', '0', 'India', 'Noida', '2301025', '/user_images/1678185413270istockphoto-1163423519-612x612.jpg', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:06:53', NULL),
(28, 'Altaf', 'superadmin@gmail.com', '$2b$10$72xdDk5qlp0ezwommGvc4u3rFa0qQk/TLauQxnB1AcHKD38gSB8km', '5165151651', '6516516511', 4, NULL, 'h-16', '0', '0', 'india', 'noida', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:13:41', '2023-03-14 15:26:16'),
(29, 'Altaf', 'superadmin1@gmail.com', '$2b$10$vjQ6D46loOYJzBkr782YTeeNyjfjwTvvCNfSljKgwtkWqXKCLTfGK', '6516516516', '1465165165', 4, NULL, 'undefined', '0', '0', 'undefined', 'undefined', 'undefine', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:09:49', '2023-03-14 15:26:26'),
(30, 'Altaf', 'superadmin@gmail.com', '$2b$10$Hk1rk93/KlzUCb4uk4h3B.UKz7/IJchcHqkZzc6uzpu9Kcbq0PKrO', '', '', 4, NULL, '', '0', '0', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:10:19', NULL),
(31, 'Altaf', 'superadmin1@gmail.com', '$2b$10$lUEju.1XHAXrg6UImZJISeqHvPC9elwpM0s7FB4LF5ZvTtxH4bQrW', '', '', 4, NULL, '', '0', '0', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:11:12', NULL),
(32, 'Mohit', 'superadmin@gmail.com', '$2b$10$2yPVeOMVwOsPKOQ307SHEOx0bS/ojzYJvgYnT.F07dK1uJ12JBsAC', '4851254754', '4851254754', 4, NULL, 'gsddha colony', '0', '0', 'india', 'delhi', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:15:32', NULL),
(33, 'Dealer 4', 'dealeradmin@gmail.com', '$2b$10$ACSZe1tC5t9rGmgSg9TTBeaqpN5ZWD0ZCOg7AmIz/Zd1fSpntKoGW', '7521458623', '7521452144', 4, NULL, 'faridabad', '0', '0', 'india', 'noida', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:17:42', NULL),
(34, 'ankur', 'superadmin@gmail.com', '$2b$10$9hIou1hSHKPXBrU2Argb2OpzoWliYHG1rAdX2YdBZpFTbAdqYBmcy', '12345678421', '12345678', 4, NULL, 'gsddha colony', '0', '0', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 13:29:10', NULL),
(35, 'ansarul', 'superadmin@gmail.com', '$2b$10$ufb89Y9vLwF0F6QSgKL3beqMvg04P.jDeEmqvHAHaj8n0tjj6IylW', '123456785', '123456785', 4, NULL, 'h-16gg', '0', '0', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 13:35:37', NULL),
(36, 'imran ahmad123', 'superadmin@gmail.com', '$2b$10$0dc/RnyP.remFtAho55DtuPDSeRs2up6CuPsMOP0iM7vyOzb.3MbO', '', '', 4, NULL, 'h-16', '0', '0', 'india', '', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:21:13', NULL),
(37, 'salu admin', 'superadmin@gmail.com', '$2b$10$kG8ggIi5ZiPH1CphGAdo.OkcUSf7L2pHsaYee..1ueqJtNp.BVxSu', '6516516516', '6541651651', 4, NULL, '', '0', '0', 'india', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:23:46', '2023-03-14 15:27:03'),
(38, 'Dealer 2', 'dealer2@gmail.com', '$2b$10$rOfPlbX6Dgw4.LKyNTkTL.V2H3fRMzZXyC9j70wHCgpgH3UBYOD7W', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '0', '0', 'India', 'Noida', '2301025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 12:04:42', NULL),
(39, 'ankur', 'ankuradmin1@gmail.com', '$2b$10$waWDYIB9MVNxQHGz/KYacOqUckx374CoaTVDSAtkpY5I4bvTeVHie', '7617068524', '5416587571', 4, NULL, 'h-16/524 ratiya ', '1', '0', 'india', 'delhi', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 12:28:14', NULL),
(40, 'mohit', 'mohitadmin@gmail.com', '$2b$10$32t9jcylQ.xTVboiTR07Ve/dkIvRcmQLEcbjLiE2D7KndoVtCumHq', '2', '665262', 4, NULL, 'h-16', '0', '0', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 14:50:00', NULL),
(41, 'mahesh', 'maheshadmin1@gmail.com', '$2b$10$vE3pZAnb/HbC9Jcvsfbyv.2APXOYfuUw1CoWyRLvdl5qaOEBzNrZ6', '', '6254147854', 4, NULL, 'h-16 854 .gym', '0', '0', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:26:05', NULL),
(42, 'mahesh kumar', 'maheshadmin1@gmail.com', '$2b$10$ew7GrGg/O5rA45Lvw0L8B.LtZVfm2r904a/wWUP9w1MQKXY7wwARq', '1236547895', '6254147854', 4, NULL, 'h-16 854 .gym', '0', '0', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:28:01', '2023-03-10 16:31:14'),
(43, 'mahesh yadav', 'maheshadmin1@gmail.com', '$2b$10$Dz7Df4qpM.Vspams6BHEC.BSGXGQYdHo55QK994cMJxAX.JybD1h2', '2365214587', '6254147854', 4, NULL, 'h-16 854 .gym', '0', '0', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:28:07', '2023-03-10 16:31:41'),
(44, 'ankurs', 'superadmin1@gmail.com', '$2b$10$GASjwO6vL76dvpkn4d/74Ol37iHnuaPVZvcZJuFAqD/Yb4wP1EKv.', '2365214577', '265515456', 4, NULL, 'h-16', '0', '0', 'india', 'noida', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:32:10', NULL),
(45, 'ankurs', 'superadmin1@gmail.com', '$2b$10$XXGpDsn3l5U/EJ/4I6vRPu.zSnNylfhe9Ba3x3OrMh5bahFVz7SOO', '2365214577', '265515456', 4, NULL, 'h-16', '0', '0', 'india', 'noida', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:32:19', NULL),
(46, 'Dealer 2ss', 'dealer2@gmail.com', '$2b$10$gsSWv/5S.UCPtccDQ0xncuLeRbXuFb25cRwYgj9u/OlFGQb99VpnC', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '1', '0', 'India', 'Noida', '2301025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-13 10:48:51', '2023-03-13 16:36:03'),
(47, 'Altaf ali', 'superadmin1@gmail.com', '$2b$10$5Xf0FBEvG1AbO5qHB2.KA.ld6VtZ44ETARQ50aTapENgc5lxzXFMK', '5632145624', '8965478563', 4, NULL, 'h-16/524 ratiya marg', '1', '1', 'india', 'delhi', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 10:04:18', NULL),
(48, 'Altaf', 'superadmin1@gmail.com', '$2b$10$jjhy.kJ3RXEE/CdYVIVWj.TiPDZG586psonPS.rkBNaC4WG1GV3yO', '555555555551', '62626265282', 4, NULL, 'h-16gg', '1', '0', 'india', 'noida', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 10:17:41', '2023-03-14 11:28:06'),
(49, 'Rahul Kumar', 'rahulkumar@sartiaglobal.com', '$2b$10$.Ymufsoyh.tPDiNyPRcY5.EVvrud2nUQx6TIoaD3tkezC2NDcZPJm', '9313301030', '9821626068', 4, NULL, 'Noida 2', '1', '1', 'India', 'Noida', '230103', '', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 10:26:49', '2023-03-14 13:28:04'),
(50, 'Contractor 2', 'contractor2@gmail.com', '$2b$10$r359w45N2ii46Nz4iwVYjOCaHmYycaaJEiRw1UkdM.pzx59lvcx0e', '9313301020', '9313301020', 3, NULL, 'Noida sector 6', '1', '1', 'India', '230125', 'Noida', '', 'Contractor 2 account create check by super admin', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 13:33:15', NULL),
(51, 'Contractor sub user', 'contractsubuser45@gmail.com', '$2b$10$8HKuo/8aCaUty53iYXdPiuLm0sV6ZK5fA0hYaVUyof48vjr/fhAfq', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:16:34', NULL),
(52, 'Super Altaf', 'superadmin1@gmail.com', '$2b$10$t7Gb/lyLYOeYJPjOQ3Wt/uyDEkrp6yCfk8lMOIK75gMC5qn7svKv.', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:17:32', NULL),
(53, 'Altaf', 'superadmin1@gmail.com', '$2b$10$O4SYclswy0UJeVnZmg2.0uogsMYFn6WNt6fOR94GVoeQV66k9g6Ii', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:21:22', NULL),
(54, 'Altaf', 'superadmin1@gmail.com', '$2b$10$RG0EqgJHrAOl7.RKSoqw5OyZ2S0LFSNYX/nGYmSM3CpV/Mwahd3JW', '6516516516', '6516516511', 3, NULL, 'gsddha colony', '1', '0', 'india', '110025', 'noida', '/user_images/1678855643302404-error.png', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:35:25', '2023-03-15 10:33:00'),
(55, 'Altaf ali', 'superadmin1@gmail.com', '$2b$10$rgAvBK6Xg30IRPpl1oUqf.f2rR6f4z61zYNhIzlcp40gsSLkv8x5C', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:38:08', NULL),
(56, 'Altaf', 'superadmin1@gmail.com', '$2b$10$QWDqra4Yu3OmKXSNrPMe0utFzfejJjqlrvCw/T/pp9hmnalkv2wZ.', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:41:09', NULL),
(57, 'sumit123', 'superadmin1@gmail.com', '$2b$10$1jvNOIw7xtGdpYr6Uv9gcu5F61T949UyaVCrCOk0.VKYcrVgGGaIW', '1521515155', '1515151515', 3, NULL, 'h-16', '1', '0', 'india', 'noida', '110025', '/user_images/1678855653602bubble.jpg', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:42:04', '2023-03-15 10:21:27'),
(58, 'ansarul 1231', 'superadmin1@gmail.com', '$2b$10$zC80GcxtkKKJOrWs3Y/T5.8T7V4I8GE26dTHiaZrDByvyAU1iad46', '1236547996', '6515165151', 3, NULL, 'h-16gg', '1', '0', 'india', '110025', 'noida', '/user_images/1678855666078bg-2.png', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:56:34', '2023-03-15 10:17:46'),
(59, 'asasas', 'superadmin1@gmail.com', '$2b$10$aehmRXl8Fo6lyTJf4.uVR.GNkLinrUpdUc5AO6tWubUluWdKt9Vuu', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:02:52', NULL),
(60, 'Altaf', 'superadmin1@gmail.com', '$2b$10$iRGQwRO.SJ32OEo6iIgj1utBzFHfmMGrVOsksYIYzOKxtd0VSTt42', '5615625125', '5165165126', 3, NULL, 'h-16', '1', '0', 'india', 'delhi', '110025', '/user_images/1678855718557profile-outside.webp', 'undefined', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:05:29', '2023-03-15 10:18:38'),
(66, 'rahul kumar', 'rahulkumar@sartiaglobal.com', '$2b$10$tasIYidhwPzguNQ69Z896Oyv8XjRCp002mWLg6QWddxHzkpRhGrIq', '9313301020', '9313301020', 2, NULL, 'Noida 2', '1', '0', 'India', 'Noida', '110092', NULL, 'scsdvdf', 'DGD8675DFJ', NULL, NULL, NULL, NULL, 1, '2023-03-16 13:31:12', '2023-03-16 14:08:42');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `company_id` int(11) NOT NULL,
  `company_unique_id` varchar(50) NOT NULL,
  `company_type` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_email` varchar(250) DEFAULT NULL,
  `company_contact` varchar(255) NOT NULL,
  `company_mobile` varchar(16) NOT NULL,
  `company_address` text NOT NULL,
  `company_contact_person` varchar(255) NOT NULL,
  `primary_contact_number` varchar(16) NOT NULL,
  `primary_contact_email` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `department` varchar(244) DEFAULT NULL,
  `company_website` varchar(244) DEFAULT NULL,
  `gst_treatment_type` varchar(244) DEFAULT NULL,
  `business_legal_name` varchar(244) NOT NULL,
  `business_trade_name` varchar(244) DEFAULT NULL,
  `pan_number` varchar(40) DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `place_of_supply` varchar(244) DEFAULT NULL,
  `billings_address` text NOT NULL,
  `shipping_address` text DEFAULT NULL,
  `is_superadmin_company` enum('0','1') NOT NULL DEFAULT '0',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`company_id`, `company_unique_id`, `company_type`, `company_name`, `company_email`, `company_contact`, `company_mobile`, `company_address`, `company_contact_person`, `primary_contact_number`, `primary_contact_email`, `designation`, `department`, `company_website`, `gst_treatment_type`, `business_legal_name`, `business_trade_name`, `pan_number`, `gst_number`, `place_of_supply`, `billings_address`, `shipping_address`, `is_superadmin_company`, `is_deleted`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '367313', 1, 'Sartia global', 'wing@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', '0', '0', 1, '2023-03-16 15:14:23', NULL),
(2, '446896', 2, 'Thewingshield technology', 'company@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', '0', '0', 1, '2023-03-16 15:15:09', NULL),
(3, '855175', 3, 'bOTH cOMPANY', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', '0', '0', 1, '2023-03-16 15:15:39', NULL),
(4, '647726', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number 1', 'supply', 'C-14, Noida sector-6', 'shipping', '1', '1', 1, '2023-03-16 15:16:08', '2023-03-16 15:57:59');

-- --------------------------------------------------------

--
-- Table structure for table `company_types`
--

CREATE TABLE `company_types` (
  `company_type_id` int(11) NOT NULL,
  `company_type_name` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_types`
--

INSERT INTO `company_types` (`company_type_id`, `company_type_name`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Sale Company', 1, '2023-03-16 12:33:24', NULL),
(2, 'Purchase Company', 1, '2023-03-16 12:33:24', NULL),
(3, 'Both', 1, '2023-03-16 12:33:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `complaint_types`
--

CREATE TABLE `complaint_types` (
  `id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `complaint_type` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaint_types`
--

INSERT INTO `complaint_types` (`id`, `energy_company_id`, `complaint_type`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'Light Repairing Works', 1, 1, '2023-03-15 11:10:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_id` int(11) NOT NULL,
  `sales_area_id` int(11) NOT NULL,
  `district_name` varchar(255) NOT NULL,
  `status` int(3) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `zone_id`, `regional_office_id`, `sales_area_id`, `district_name`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 1, 'SZRO1SA1 District name 1', 1, 1, '2023-03-06 11:04:49', '2023-03-06 11:05:01'),
(2, 3, 4, 4, 'NZRO2SA2 DISTRICT NAME 2', 1, 1, '2023-03-06 11:05:29', NULL),
(3, 2, 5, 5, 'WZRO1SA1 DISTRICT NAME 3', 1, 1, '2023-03-06 11:05:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `document_category_id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `remark` longtext NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document_categories`
--

CREATE TABLE `document_categories` (
  `id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document_categories`
--

INSERT INTO `document_categories` (`id`, `category`, `title`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Identification', 'Adhar Card', 'This category belongs to adhar card', 1, '2023-02-25 17:52:18', NULL),
(2, 'Identification', 'PAN Card', 'This category belongs to adhar card', 1, '2023-02-25 17:52:30', NULL),
(3, 'Identification 1', 'Voter Id Card', 'This category belongs to adhar card', 1, '2023-02-25 17:52:38', '2023-02-27 11:10:17');

-- --------------------------------------------------------

--
-- Table structure for table `energy_companies`
--

CREATE TABLE `energy_companies` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `energy_companies`
--

INSERT INTO `energy_companies` (`id`, `admin_id`, `name`, `website`, `status`, `created_at`, `updated_at`) VALUES
(1, 14, 'Energy Company First', 'www.company1.com', 1, '2023-02-15 14:06:07', NULL),
(2, 16, 'Energy Company 2', 'www.company1.com', 1, '2023-02-15 14:07:03', '2023-02-17 18:20:57'),
(3, 12, 'Energy Company 3', 'www.company2.com', 1, '2023-02-16 11:31:14', NULL),
(8, 66, 'Rahul Company', 'www.rahul.com', 1, '2023-03-16 13:31:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `feedback_and_suggestions`
--

CREATE TABLE `feedback_and_suggestions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `complaint_id` int(11) NOT NULL,
  `suggestion_text` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback_and_suggestions`
--

INSERT INTO `feedback_and_suggestions` (`id`, `user_id`, `complaint_id`, `suggestion_text`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 14, 1, 'there is something to tell you, that you are working on test mode', 1, 14, '2023-02-14 16:02:05', '2023-02-28 17:21:06');

-- --------------------------------------------------------

--
-- Table structure for table `item_masters`
--

CREATE TABLE `item_masters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rate` varchar(142) NOT NULL,
  `qty` varchar(142) NOT NULL,
  `image` varchar(142) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `title`, `path`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Dashboard', 'dashbaord', 1, '2023-02-10 09:28:33', NULL, NULL, NULL),
(2, 'Analytics', 'Analytics', 1, '2023-02-10 09:29:21', NULL, NULL, NULL),
(3, 'Master Data', 'MasterData', 1, '2023-02-10 09:29:21', NULL, NULL, NULL),
(4, 'User Management', 'RolesPermissions', 1, '2023-02-10 09:31:12', NULL, NULL, NULL),
(5, 'Enable & Disable Features', 'EnableDisableFeatures', 1, '2023-02-10 09:31:12', NULL, NULL, NULL),
(6, 'Software Activation', 'SoftwareActivation', 1, '2023-02-10 09:31:12', NULL, NULL, NULL),
(7, 'Feedbacks & Suggestions', 'SuggestionsFeedbacks', 1, '2023-02-10 09:31:12', NULL, NULL, NULL),
(8, 'Contacts', '#', 1, '2023-02-10 09:31:12', NULL, NULL, NULL),
(9, 'Tutorials', 'Tutorials', 1, '2023-02-10 09:32:22', NULL, NULL, NULL),
(10, 'Plan & Pricing', 'PlanPricing', 1, '2023-02-10 09:32:22', NULL, NULL, NULL),
(11, 'Billings', 'Billings', 1, '2023-02-10 09:32:22', NULL, NULL, NULL),
(12, 'Notifications', 'AllNotifications', 1, '2023-02-10 09:32:22', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `user_type` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_for` int(11) NOT NULL,
  `read_by` int(11) NOT NULL DEFAULT 0,
  `read_for` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `message`, `user_type`, `created_by`, `created_for`, `read_by`, `read_for`, `created_at`) VALUES
(1, 'Test Notifications', 'this is for notifications message testing', 1, 10, 1, 0, 1, '2023-02-23 15:14:19'),
(2, 'Test Notifications 2', 'this is for notifications message testing 2', 3, 1, 12, 0, 0, '2023-02-23 15:21:01'),
(3, 'Test Notifications 2', 'this is for notifications message testing 2', 3, 1, 12, 0, 0, '2023-03-13 12:51:38');

-- --------------------------------------------------------

--
-- Table structure for table `outlets`
--

CREATE TABLE `outlets` (
  `id` int(11) NOT NULL,
  `energy_company_id` smallint(11) NOT NULL,
  `zone_id` smallint(11) NOT NULL,
  `regional_office_id` smallint(11) NOT NULL,
  `sales_area_id` smallint(11) NOT NULL,
  `district_id` smallint(11) NOT NULL,
  `outlet_name` varchar(255) NOT NULL,
  `outlet_contact_person_name` varchar(255) NOT NULL,
  `outlet_contact_number` varchar(15) NOT NULL,
  `primary_number` varchar(15) DEFAULT NULL,
  `secondary_number` varchar(15) DEFAULT NULL,
  `primary_email` varchar(255) DEFAULT NULL,
  `secondary_email` varchar(255) DEFAULT NULL,
  `customer_code` varchar(244) NOT NULL,
  `outlet_category` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `outlet_ccnoms` varchar(255) NOT NULL,
  `outlet_ccnohsd` varchar(255) NOT NULL,
  `outlet_resv` varchar(255) DEFAULT NULL,
  `outlet_longitude` varchar(255) DEFAULT NULL,
  `outlet_lattitude` varchar(255) DEFAULT NULL,
  `outlet_image` varchar(255) DEFAULT NULL,
  `created_by` smallint(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `outlets`
--

INSERT INTO `outlets` (`id`, `energy_company_id`, `zone_id`, `regional_office_id`, `sales_area_id`, `district_id`, `outlet_name`, `outlet_contact_person_name`, `outlet_contact_number`, `primary_number`, `secondary_number`, `primary_email`, `secondary_email`, `customer_code`, `outlet_category`, `location`, `address`, `outlet_ccnoms`, `outlet_ccnohsd`, `outlet_resv`, `outlet_longitude`, `outlet_lattitude`, `outlet_image`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 1, 3, 4, 4, 2, 'OUTLET2', '', '7474747482', '7409101025', '7409101025', 'ahmad@gmail.com', 'ahjjh@gmail.com', 'kgkg525', 'kgf123321', 'public_html/seotest', 'H-16/514SANGAM-VIHAR', 'DUMMY', 'DUMMY', 'DUMMY', 'DUMMY', 'DUMMY', '', 1, '2023-03-06 12:12:33', '2023-03-06 14:11:02'),
(3, 1, 3, 4, 4, 3, 'OUTLET2', '', '9313301068', '7641475244', '8547652154', 'ahmad@gmail.com', 'ahjjh@gmail.com', 'sds848d', 'New', 'public_html/seotest', 'H-16/514SANGAM-VIHARs', 'DUMMY', 'DUMMY', 'DUMMY', 'DUMMY', 'DUMMY', '', 1, '2023-03-06 13:00:41', '2023-03-06 13:55:31');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `sub_module_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` tinyint(4) NOT NULL DEFAULT 0,
  `viewed` tinyint(4) NOT NULL DEFAULT 0,
  `updated` tinyint(4) NOT NULL DEFAULT 0,
  `deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `module_id`, `sub_module_id`, `role_id`, `user_id`, `created`, `viewed`, `updated`, `deleted`, `created_at`, `updated_at`) VALUES
(1, 8, 1, 7, 0, 1, 0, 0, 0, '2023-02-10 11:58:54', NULL),
(2, 8, 1, 7, 0, 1, 0, 1, 0, '2023-02-10 11:59:44', NULL),
(3, 7, 0, 7, 0, 0, 0, 0, 1, '2023-02-13 04:50:54', NULL),
(4, 2, 0, 3, 2, 0, 0, 0, 0, '2023-02-14 09:34:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `price` varchar(50) NOT NULL,
  `duration` varchar(244) NOT NULL,
  `description` text NOT NULL,
  `module` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`module`)),
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plan_checklists`
--

CREATE TABLE `plan_checklists` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `checklist_name` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purpose_masters`
--

CREATE TABLE `purpose_masters` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purpose_masters`
--

INSERT INTO `purpose_masters` (`id`, `name`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Purpose master created for tubelight', 1, 1, '2023-02-24 12:57:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `regional_offices`
--

CREATE TABLE `regional_offices` (
  `id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `address_1` mediumtext NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regional_offices`
--

INSERT INTO `regional_offices` (`id`, `zone_id`, `regional_office_name`, `code`, `address_1`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(3, 3, 'North zone Regional office 2', 'NZRO2', 'Noida 2', 0, 1, '2023-03-06 11:01:10', '2023-03-15 15:14:16'),
(4, 3, 'North zone Regional office 2', 'NZRO2', 'Noida 2', 0, 1, '2023-03-06 11:01:26', '2023-03-15 15:16:15'),
(5, 2, 'West zone Regional office 1', 'WZRO1', 'Noida 3', 1, 1, '2023-03-06 11:01:46', NULL),
(6, 2, 'West zone Regional office 2', 'WZRO2', 'Noida 3', 1, 1, '2023-03-06 11:02:02', NULL),
(7, 3, 'South zone Regional office 1', 'SZRO1', 'Noida 2', 1, 1, '2023-03-15 13:00:44', NULL),
(8, 2, 'West zone Regional office 1', 'SZRO1', 'Noida 2', 1, 1, '2023-03-15 13:00:58', NULL),
(10, 2, 'South zone Regional office 1', 'WZRO2', 'Noida 3', 1, 1, '2023-03-15 13:01:58', NULL),
(11, 2, 'West zone Regional office 1', 'WZRO25', 'Noida 2', 1, 1, '2023-03-15 13:02:16', '2023-03-15 15:18:41');

-- --------------------------------------------------------

--
-- Table structure for table `regional_office_assigns`
--

CREATE TABLE `regional_office_assigns` (
  `id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regional_office_assigns`
--

INSERT INTO `regional_office_assigns` (`id`, `zone_id`, `regional_office_id`, `energy_company_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 14, 0, '2023-03-15 17:40:01', '2023-03-16 10:54:49'),
(5, 3, 4, 66, 0, '2023-03-16 13:31:12', '2023-03-16 14:08:42');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `status`, `created_at`) VALUES
(1, 'Super Admin', 1, '2023-02-06 12:36:01'),
(2, 'Energy Company', 1, '2023-02-06 12:36:01'),
(3, 'Contractor', 1, '2023-02-06 17:04:58'),
(4, 'Dealer', 1, '2023-02-09 15:54:32'),
(5, 'Admin', 1, '2023-02-09 15:55:16'),
(6, 'User', 1, '2023-02-09 15:55:20'),
(7, 'Sub user', 1, '2023-02-09 15:55:27'),
(8, 'Vendor', 1, '2023-02-10 10:34:21');

-- --------------------------------------------------------

--
-- Table structure for table `sales_area`
--

CREATE TABLE `sales_area` (
  `id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_id` int(11) NOT NULL,
  `sales_area_name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_area`
--

INSERT INTO `sales_area` (`id`, `zone_id`, `regional_office_id`, `sales_area_name`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 'RO1 Sale area 1', 1, 1, '2023-03-06 11:02:46', NULL),
(2, 4, 1, 'RO1 SALE AREA 2', 1, 1, '2023-03-06 11:03:01', '2023-03-06 05:33:06'),
(3, 3, 3, 'RO1 SALE AREA 1', 1, 1, '2023-03-06 11:03:32', NULL),
(4, 3, 4, 'RO1 SALE AREA 2', 1, 1, '2023-03-06 11:03:43', NULL),
(5, 2, 5, 'RO1 SALE AREA 1', 1, 1, '2023-03-06 11:03:56', NULL),
(6, 2, 6, 'RO1 SALE AREA 2', 1, 1, '2023-03-06 11:04:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sale_area_assigns`
--

CREATE TABLE `sale_area_assigns` (
  `id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_id` int(11) NOT NULL,
  `sale_area_id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_area_assigns`
--

INSERT INTO `sale_area_assigns` (`id`, `zone_id`, `regional_office_id`, `sale_area_id`, `energy_company_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 3, 14, 0, '2023-03-15 17:40:01', '2023-03-16 10:54:49'),
(5, 3, 4, 4, 66, 0, '2023-03-16 13:31:12', '2023-03-16 14:08:42');

-- --------------------------------------------------------

--
-- Table structure for table `sale_companies`
--

CREATE TABLE `sale_companies` (
  `sale_company_id` int(11) NOT NULL,
  `sale_company_unique_id` varchar(50) NOT NULL,
  `name` varchar(244) NOT NULL,
  `email` varchar(244) DEFAULT NULL,
  `contact` varchar(120) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `primary_contact_person` varchar(244) NOT NULL,
  `primary_contact_mobile` varchar(15) NOT NULL,
  `primary_contact_email` varchar(120) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `company_website` varchar(100) DEFAULT NULL,
  `gst_treatment_type` varchar(120) NOT NULL,
  `business_legal_name` varchar(220) NOT NULL,
  `business_trade_name` varchar(244) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `place_of_supply` varchar(244) DEFAULT NULL,
  `billing_address` text NOT NULL,
  `shipping_address` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_companies`
--

INSERT INTO `sale_companies` (`sale_company_id`, `sale_company_unique_id`, `name`, `email`, `contact`, `mobile`, `address`, `primary_contact_person`, `primary_contact_mobile`, `primary_contact_email`, `designation`, `department`, `company_website`, `gst_treatment_type`, `business_legal_name`, `business_trade_name`, `pan_number`, `gst_number`, `place_of_supply`, `billing_address`, `shipping_address`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '', 'Sartia Global', 'sartia@sartiaglobal.com', 'Sartia', '9313301020', 'C-14 Noida, Sector-6', 'Nikhil', '8546522854', 'nilhil@sartiaglobal.com', 'HR Head', 'IT', 'www.sartiaglobal.com', 'regular', 'Sartia Global', 'Thewingshield', 'TG754Dq2', 'sdfr5578erf', 'Noida', 'C-14, Noida, Sector-6', 'Laxmi Nagar', 1, '2023-02-08 18:27:53', NULL),
(2, '', 'Sartia Global Second', 'sartia@sartiaglobal.com', 'Sartia', '9313301020', 'C-14 Noida, Sector-6', 'Nikhil', '8546522854', 'nilhil@sartiaglobal.com', 'HR Head', 'IT', 'www.sartiaglobal.com', 'regular', 'Sartia Global', 'Thewingshield', 'TG754Dq2', 'sdfr5578erf', 'Noida', 'C-14, Noida, Sector-6', 'Laxmi Nagar', 1, '2023-02-08 18:28:37', '2023-02-09 11:30:42'),
(3, '', 'Sartia Global', 'sartia@sartiaglobal.com', 'Sartia', '9313301020', 'C-14 Noida, Sector-6', 'Nikhil', '8546522854', 'nilhil@sartiaglobal.com', 'HR Head', 'IT', 'www.sartiaglobal.com', 'regular', 'Sartia Global', 'Thewingshield', 'TG754Dq2', 'sdfr5578erf', 'Noida', 'C-14, Noida, Sector-6', 'Laxmi Nagar', 1, '2023-02-08 18:28:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `software_activation_requests`
--

CREATE TABLE `software_activation_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `status` int(11) DEFAULT 0,
  `requested_date` datetime NOT NULL DEFAULT current_timestamp(),
  `approved_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `software_activation_requests`
--

INSERT INTO `software_activation_requests` (`id`, `user_id`, `company_id`, `module_id`, `status`, `requested_date`, `approved_by`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 2, 1, '2023-02-14 12:04:54', NULL, '2023-02-14 12:04:54', NULL),
(2, 2, 2, 8, 0, '2023-02-14 12:05:01', NULL, '2023-02-14 12:05:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sub_modules`
--

CREATE TABLE `sub_modules` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `module_id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_modules`
--

INSERT INTO `sub_modules` (`id`, `title`, `module_id`, `path`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Energy Companies', 8, 'energy-companies-contacts', 1, '2023-02-10 10:16:11', 1, NULL, NULL),
(2, 'Contractors and sub user', 8, 'contractors-contacts', 1, '2023-02-10 10:17:32', 1, NULL, NULL),
(3, 'Dealers and sub users', 8, 'dealers-contacts', 1, '2023-02-10 10:17:32', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `survey`
--

CREATE TABLE `survey` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `format` varchar(255) NOT NULL,
  `assign_to` int(11) DEFAULT NULL,
  `assign_to_sub_user` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `survey_questions`
--

CREATE TABLE `survey_questions` (
  `id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `question` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`question`)),
  `created_by` int(11) NOT NULL,
  `assign_to` int(11) DEFAULT NULL,
  `assign_to_sub_user` int(11) DEFAULT NULL,
  `survey_response` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `assign_to` int(11) NOT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `start_date`, `end_date`, `assign_to`, `project_name`, `category_id`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'Task first', '2023-02-27', '2023-02-28', 13, 'Task Project', 2, 'completed', 1, 1, '2023-02-28 12:28:03', '2023-02-28 13:24:46'),
(2, 'Task second', '2023-02-20', '2023-02-24', 5, 'Task Project', 6, 'in progress', 1, NULL, '2023-02-28 12:28:31', NULL),
(3, 'Task third', '2023-02-02', '2023-04-28', 5, 'Task Project', 6, 'assign', 1, NULL, '2023-02-28 12:29:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `task_categories`
--

CREATE TABLE `task_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_categories`
--

INSERT INTO `task_categories` (`id`, `name`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Task Category first', 1, 1, '2023-03-01 12:30:24', NULL),
(2, 'Task Category Second', 1, 1, '2023-03-01 12:30:37', '2023-03-01 13:05:01'),
(3, 'Task Category Third', 1, 1, '2023-03-01 12:30:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `task_comments`
--

CREATE TABLE `task_comments` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `remark` text NOT NULL,
  `status` varchar(120) NOT NULL,
  `previous_status` varchar(255) DEFAULT NULL,
  `status_changed_at` datetime DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_comments`
--

INSERT INTO `task_comments` (`id`, `task_id`, `user_id`, `remark`, `status`, `previous_status`, `status_changed_at`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 12, 'This is updated task to check status', 'Done', 'to do', '2023-03-01 15:22:07', 1, '2023-03-01 14:00:48', '2023-03-01 15:22:07'),
(2, 1, 12, 'This is test for task 2', 'to do', NULL, NULL, 1, '2023-03-01 15:48:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `team_name` varchar(255) NOT NULL,
  `team_short_description` text DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `child_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `user_id`, `team_name`, `team_short_description`, `parent_id`, `child_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 105, 'Super admin team 1', 'Super admin first team to see how it`s works', 1, 105, 1, '2023-03-16 11:06:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tutorials`
--

CREATE TABLE `tutorials` (
  `id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL,
  `application_type` varchar(56) NOT NULL,
  `module_type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tutorial_format` varchar(50) NOT NULL,
  `attachment` text NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutorials`
--

INSERT INTO `tutorials` (`id`, `user_type`, `application_type`, `module_type`, `tutorial_format`, `attachment`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'Web', 'Dashboard', 'Video', '/tutorials/1677051154319istockphoto-1390035299-640_adpp_is.mp4', 'This is for test tutorial upload', 1, '2023-02-22 13:02:34', NULL),
(2, 1, 'Web', 'Dashboard', 'Audio', '/tutorials/1677051181124istockphoto-1390035299-640_adpp_is.mp4', 'This is for test tutorial upload', 1, '2023-02-22 13:03:01', NULL),
(3, 1, 'Web', 'Dashboard', 'docs', '/tutorials/1677057699222HRMS Scope (New).docx', 'This is for test tutorial upload', 1, '2023-02-22 14:51:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(16) NOT NULL,
  `joining_date` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` int(3) NOT NULL DEFAULT 1,
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `user_type` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `zone_id` varchar(11) DEFAULT NULL,
  `regional_id` varchar(11) DEFAULT NULL,
  `sale_area_id` varchar(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `mobile`, `joining_date`, `image`, `status`, `is_deleted`, `user_type`, `admin_id`, `user_id`, `zone_id`, `regional_id`, `sale_area_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Dealer 3 user', 'Dealer 3 user', 'dealer3user@gmail.com', '$2b$10$s9uMEyXup3VwA/fqgWd62OLgeRp8cVhRPLEH8AHQusOTKiHEDz/Lu', '9313301020', '2010-05-21', '/user_images/16788611546404k-2.jfif', 1, '0', 6, 3, NULL, NULL, NULL, NULL, 1, '2023-03-06 14:43:22', '2023-03-15 11:49:24'),
(2, 'Altaf', 'Altaf', 'superadmin@gmail.com', '$2b$10$zGs.wSaIYNwQ27dvboSwluizgd0Rjh6.dF9PD6onfe3wTm2ZkmNeG', 'undefined', 'undefined', '', 0, '0', 6, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 14:37:02', NULL),
(3, 'Dealer 3 users', 'Altaf', 'dealer3user@gmail.com', '$2b$10$wtYNXt5cP6Jek.61ffhBQ.jdO/P7c/4lkJmBkoc9rHnXVG/RbIrFG', '', '', '', 0, '0', 6, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 14:54:13', '2023-03-10 14:25:22'),
(4, 'Altaf', 'Altaf', 'superadmin@gmail.com', '$2b$10$R6i24LqUDCfP5BKdXPeF9eMYnbmZawgvuUT7hZEgew53JW.dSzHSW', 'undefined', 'undefined', '', 0, '0', 6, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:02:55', NULL),
(5, 'Altaf Ahmad', 'Altaf Ahmad', 'superadmin1@gmail.com', '$2b$10$sBZQglaxLY9/xuoUZPmGt.LGumc1752n6DJw/bP7KiZgOtSqB3nIu', 'undefined', 'undefined', '', 0, '0', 6, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:05:38', NULL),
(6, 'Dealer 5', 'Dealer 5', 'dealer5@gmail.com', '$2b$10$Qc4vVc0ymphN4v/EJSQZ5eQ6Liw96nRwwts2yHRpx0Pp6ULOL9XjS', 'undefined', 'undefined', '', 0, '0', 6, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:08:47', NULL),
(7, 'Super admin', 'Super admin', 'superadmin@gmail.com', '$2b$10$xpAPowaRqFrQIsVWMyvNK.chYlrf8NI0PfX0iY43fY7qqNTH5154S', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:13:46', NULL),
(8, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$9UpSp9YQNTp7KrS7OEhWcujBHlXfu0PqDvuvmJk2YL8/dD.NlGA.a', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:15:19', NULL),
(9, 'Altaf', 'Altaf', 'superadmin@gmail.com', '$2b$10$FUNr6SpmUBXoVeJ8YTmnUusH66vFY74PZgf/bxro2YHkZaNIh7N4G', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:26:34', NULL),
(10, 'Super admin', 'Super admin', 'superadmin1@gmail.com', '$2b$10$FHKjBIzh1zAN0GwpmxXR4e.0d4BseaH4zwmKIDJb7iFdfPSKYmJzO', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:27:21', NULL),
(11, 'Super admin', 'Super admin', 'superadmin1@gmail.com', '$2b$10$2v1Ve9ivPpFX8ZHegQq4duA0C5RXZN8DvkgEdwwLGCIq/MaUnalmy', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:04:02', NULL),
(12, 'Altaf', 'Altaf', 'superadmin@gmail.com', '$2b$10$qOPhU/XQI7DE7L/0TWd81.xb9.JjCcEX4Ip7eKafxwJHiwBFbRN3K', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:05:37', NULL),
(13, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$5WWMw0gkGZexFgcrnoccIeSexZgvkexGQ6JppUj6.XihNaBUmCQnu', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:09:53', NULL),
(14, 'Altaf', 'Altaf', 'superadmin@gmail.com', '$2b$10$CJIJuC1uU3Z5kkeLqcfs9eNOtMXpkKzW6vc6GOJfnii1hfMuCvBVm', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:11:43', NULL),
(15, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$IKs/Emnt3tj2dgkjq20sn.lmYBVS8gmlCJlapUAl6bOS8aJtqdqYC', 'undefined', '2023-03-24', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:14:14', NULL),
(16, 'imran', 'imran', 'superadmin1@gmail.com', '$2b$10$uxFQd8v0HtWKQ8eL4qEoa.VMYCq60KE0uQV6ZoICCqSTD4P8wtzwC', 'undefined', '2023-03-14', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 13:56:54', NULL),
(17, 'imran', 'imran', 'imranadmin1@gmail.com', '$2b$10$smNy2y3GxY.VsuClY63lx.yRC2hHZgedqFhEe9TNt.bibyV0WPJje', 'undefined', '2023-03-15', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 13:59:03', NULL),
(18, 'Dealer 3 user imran', 'Dealer 3 user imran', 'dealeruser3@gmail.co', '$2b$10$cy6/7C2piAmxJezNXWXyluf.GdVUtiOKRD030Z5v2XoorSZsP/Bvq', '9313301020', '21-02-2023', '', 0, '1', 6, 3, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:05:10', NULL),
(19, 'imran ahmad', 'imran ahmad', 'superadmin1@gmail.com', '$2b$10$5GFSIv.vZMtbbnTD7VPFReGVSce0E85KV0fI4YAN28cMP35ftg71e', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:06:52', NULL),
(20, 'imran ahmad', 'imran ahmad', 'superadmin@gmail.com', '$2b$10$r5Ltw01wK2cKtj.9KSkMQOspS9prRIp1KbNKoTcYjX7Ujynn/qV5K', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:08:28', NULL),
(21, 'imran ahmad', 'imran ahmad', 'superadmin1@gmail.com', '$2b$10$tXgWHIbZVe20aFjV1MrKmeOqwbqCRocpZ4kW8yka0UObZhQtVi3F2', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:09:38', NULL),
(22, 'imran ahmad user1', 'imran ahmad user1', 'superadmin1@gmail.com', '$2b$10$xslEZ7353TBPmVsnrpdWC.15UqMuQWKQ0T/rqO6WWB.HzTdNBJn2q', '1234567895', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:23:26', NULL),
(23, 'Altaf admin', 'Altaf admin', 'superadmin@gmail.com', '$2b$10$p.J8iFN9n/UkEt7qTjsYhOWzy3EdxSuEoF2qlTUi3oRfIPcGkfPpC', '123658', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:30:13', NULL),
(24, 'Dealer 4567s', 'Rahul Kumar', 'superadmin1@gmail.com', '$2b$10$1pKWp68pKZt0RjSRyLM4YOl9tqirSpTv/5i4R7Eq.QFXNYo6npaN.', '989898989', '2023-03-13', '', 0, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:40:13', '2023-03-15 10:45:31'),
(25, 'Dealer 4567', 's', 'dealer4@gmail.com', '$2b$10$q3mvrkd.Eqa29I6Sc9YfTeONDY8KCYj9xv9mzcd/PYoZLB0GKU10m', '9313301020', '', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:43:54', '2023-03-10 11:16:12'),
(26, 'abcdf', 'abcd', 'delear1@gmail.com', '$2b$10$8pGF5d3noeOiIKIF8PHE2edErj6BDYfk5IUlq5ZMNimb8qMFipkwy', '9313301020', '2023-03-09', '/user_images/1678362324518download.jpg', 0, '1', 6, 3, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:46:00', '2023-03-09 17:15:24'),
(27, 'Altaf456', 'Altaf456', 'superadmin1@gmail.com', '$2b$10$tvFUl9eBvMqWtUnZOurWdeJfD1b.EHl8Zo16Esdzj9WAPa.8DM6V6', '', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:16:31', NULL),
(28, 'ravi', 'ravi', 'superadmin@gmail.com', '$2b$10$t5rv3b9DldU6ZXG.jkvJOeKtaOiscDAqs/dHUR2S9ReScPVPLN8fW', '', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:17:57', NULL),
(29, 'ravi', 'ravi', 'superadmin1@gmail.com', '$2b$10$ZEkYp.0xAGuqRESV582/tec.UcoH02mtxqBsobNqYl85fz2SERXUa', '', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:21:13', NULL),
(30, 'ravi', 'ravi', 'superadmin@gmail.com', '$2b$10$aBlb40/MsZwKy/8RvBm34evu.9z5U0f3VuGP4K0tg2jh4Xxj9qCeq', '', 'undefined', '', 1, '0', 6, 34, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:22:35', NULL),
(31, 'salu', 'salu', 'superadmin1@gmail.com', '$2b$10$r99IwOE4/QpUBYDjxvehNeh0E5Zb6204lhbaIbzq4qRDEVhCSsvm.', '', 'undefined', '', 0, '0', 6, 36, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:23:26', NULL),
(32, 'crm', 'crm', 'crm@gmail.com', '$2b$10$gQGQsACBdM5gFidKuXNMiepn75OjXTFOdyAIowB7Mf3kagsaBhnIi', '7617065200', 'undefined', '', 0, '0', 6, 34, NULL, NULL, NULL, NULL, 1, '2023-03-09 16:12:32', NULL),
(33, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$eFhkHBFKMniyV4Q1pRYsWO1Tp5du4IGvZrTZyBlDjurNk0sR7MqNe', '123654789', '2023-03-15', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 11:58:52', NULL),
(34, 'Super admin', 'Super admin', 'superadmin1@gmail.com', '$2b$10$papQpnc4.kr9YNE0M7.ehukkScKBIApP98gRWm/nHs6aS/Mavr5F6', '521456955', '2023-03-08', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 12:00:55', NULL),
(35, 'Dealer 3 user imran1', 'Dealer 3 user imran', 'dealeruser3@gmail.co', '$2b$10$vhIS6tKFd9zdFFjo/Bo7tOrQTwPrrCj2srV71zfnBhaIu/Dg8QRLu', '9313301020', 'Invalid date', '', 1, '1', 6, 3, NULL, NULL, NULL, NULL, 1, '2023-03-10 12:04:47', '2023-03-14 13:05:57'),
(36, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$vzYc5BU2d4sB0gm2/PlID.cueJF1w/rUssrYzqGMWT6SGC13LC0DG', '1236547889', '2023-03-24', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:22:52', NULL),
(37, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$kS9H55vc2O3iQ7LTtns4j.wq6NK/Z4da1ZEPUyi/oz3UUmF.m.EIC', '1236547889', '2023-03-24', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:24:59', NULL),
(38, 'ankurs', 'ankurs', 'superadmin1@gmail.com', '$2b$10$ovzoiSVdWGt779lkQI65ves.5Ul6l4Nle6hhp9/rP4F/JTwoNHZ/S', '123654785', '2023-03-23', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:25:20', NULL),
(39, 'Altaf s', 'Altaf', 'superadmin1@gmail.com', '$2b$10$RYmZ2lABidXNHwVZ4t0uUO/rdFCibnL5wxb6sDhL4AEEyy1tu1mAW', '78568568568', '2023-03-09', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:27:10', '2023-03-13 16:20:18'),
(40, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$KbV8/YyfraAMD0oR6W6xN.UiOr2Ew2zm6SrDzFWpWxnAfEd53Xzlm', '123654547', '2023-03-15', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:28:14', NULL),
(41, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$cfQq7tCjo7z.qE.mfisArex4L5CaEaYlcR.4wzBWW9dMZlaepgcbO', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 10:51:18', NULL),
(42, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$O5No.4v.vZ.S/eOxQ7YEZeXzcqIKq7HDv2AsAB.sawctbP4DG2fKu', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 10:58:27', NULL),
(43, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$IcA3pVw0nSnB/p3SuecIXug5C/CjkMBcNTS04Ysb/ozvaUqhMzy0W', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 11:00:00', NULL),
(44, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$3rSJqVWV8hN4tRvWjxonw.8EUjtWqxoMTDZpzSrc4txfWvwye0UWO', '415', '2023-03-08', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:21:27', NULL),
(45, 'Sartiaaaaa', 'Sartiaaaaa', 'superadmin1@gmail.com', '$2b$10$ZDnamTscs4jPKGne4QtiyORgzc/hSKypBcHeEhiKrwa9PPiLDydJe', '7970797897', '2023-03-02', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:32:12', NULL),
(46, 'chandan kumar', 'undefined', 'superadmin1@gmail.com', '$2b$10$wr6fC63Eh81ZQp9X8EmMl.fO2ZGOeGs2Zdh5e8Ck8.H5DWpNG3V.a', '446516513', '2023-03-23', '', 0, '1', 6, 3, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:37:05', '2023-03-13 16:50:51'),
(47, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$5mpkmJExJCZpjwDWY26/5O9bHs4CcUgibtJt.m.fAtEWh8LMOjE7a', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:38:22', NULL),
(48, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$bCjobPzyaaQptCUEs3fqF.eON28gZBR7en/BShAgRnAUtIb0.JVsC', 'undefined', 'undefined', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:39:25', NULL),
(49, 'altaf', 'undefined', 'ahmad@gmail.com', '$2b$10$Pr2VyUskl3r2Hyjqup4IVuwFuDbdSOnLpVYwtI8Nlfz8jTegb8OL2', '516515151', '2023-03-17', '', 1, '1', 6, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:39:44', '2023-03-14 13:31:59'),
(50, 'dpt123', 'dpt123', 'superadmin1@gmail.com', '$2b$10$4jR3T4UJWIVW.DYj3ZZH7OuwfBiA7fS6WUeBU.wKVGAvfsl9qLpCK', '8860214536', '2023-03-17', '', 0, '1', 6, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:41:53', NULL),
(51, 'SARTIA GLOBAL', 'SARTIA GLOBAL', 'superadmin1@gmail.com', '$2b$10$OGMoU362H/YRXbk/QaHX1e/JuLyVZfLr/77dQi7T8jOEmQlzgK3gS', '989689889787', '', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:15:15', NULL),
(52, 'XXXXXXXXX', 'XXXXXXXXX', 'superadmin1@gmail.com', '$2b$10$ev/3nrG0kNT5oM1NnSouZOXFt7kW7EOfMnqllgYHZiA6xt.1kNU2W', '5674745742', '2023-03-02', '', 0, '0', 6, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:17:26', NULL),
(53, 'mahesh', 'aarif', 'dealer2@gmail.com', '$2b$10$4MrnRL8yIMRnqGGdhFT8HetCf1KgE5XpZ8ExzLH9sRyQw2ixckIq.', '', '', '', 1, '0', 6, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:21:16', '2023-03-13 16:01:27'),
(54, 'Ankur', 'Ankur', 'superadmin1@gmail.com', '$2b$10$qtlaXWdpORfn.wDYVJpsnOB2pSXWLiPua0bLyH4AnxeC/0hQ9UfNm', '9003477343', '2023-03-09', '', 1, '0', 6, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:50:11', NULL),
(55, 's', 's', 'superadmin1@gmail.com', '$2b$10$j.q2zBJ0X87gAx3N1lcHae5QtcnBy0eiW3.IGcxp/UJq0eecnIBUa', '57858568', '2023-03-28', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:54:28', NULL),
(56, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$9ygkTcuuEMU4npk0LdiWqOUfOGxsh8vmoXvi6h5gRfWXez6FlhMuK', '6785685865', '2023-03-28', '', 1, '0', 6, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:55:26', NULL),
(57, 'rheryjnyj', 'rheryjnyj', 'superadmin1@gmail.com', '$2b$10$szGEb6XyKZ/L7u4FszBLFOZd.TZs4e6tAozz2zZ7K84EyKUoVloc.', '689695695679', '2023-03-16', '', 1, '0', 6, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:56:57', NULL),
(58, 'bndfgn', 'bndfgn', 'superadmin1@gmail.com', '$2b$10$mzSWrr5jjRyGNu3GBNEEHOoomF/5VBkXW8.hYMNNWb/E8n1jBr28O', '686868745', '2023-03-29', '', 0, '0', 6, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:57:50', NULL),
(59, 'Super admin', 'Super admin', 'superadmin1@gmail.com', '$2b$10$YZXBREWtF1wwMNAPZ/k1U.fRPgp0TjKQHrH5X4MjYm1qLP7wRvNyG', '69659569', '2023-04-05', '', 0, '0', 6, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:58:51', NULL),
(60, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$pOHwHDIuKY5HWe9yCLW4nuh7B9tbzZgqsKTpfDyDMJ5ENEipFUdnW', '78568568568', '2023-03-09', '', 1, '0', 6, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 15:04:12', NULL),
(61, 'Altaf123', 'Altaf123', 'superadmin1@gmail.com', '$2b$10$.AFueoZuyShiDJJd88gP3OJ9xh.oG8zA1AhPcuKMam.iG52O3KapG', '651612612612', '2023-03-10', '', 0, '1', 6, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 15:06:48', NULL),
(62, 'Dealer 2', 'Dealer 4567', 'superadmin1@gmail.com', '$2b$10$X4OEhWj7EPxpORXBRDnHD.vLnAf83DSbde15zzfFhFuhEpcrEI0zC', '989898989', '2023-03-13', '/user_images/1678859872561download.jpg', 0, '0', 6, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 15:32:36', '2023-03-15 11:27:57'),
(63, 'Dealer 4567', 'Dealer 4567', 'superadmin1@gmail.com', '$2b$10$M55oYMZ3ossrLOmPDJozae/AA0eZfXXZrlHsoB.JmRnM15zxm1S6S', '989898898989', '2023-03-09', '', 0, '1', 6, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 15:38:47', NULL),
(64, 'sunjay', 'sunjay', 'superadmin1@gmail.com', '$2b$10$C6X350cUAcp3zk7yg8Fg4e.Y7uHi5eap5fZPJTGwsjp9.7Yz90/Xy', '886522414', '2023-03-15', '', 1, '0', 6, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:05:58', NULL),
(65, 'Sartiaaaaa', 'Sartiaaaaa', 'superadmin1@gmail.com', '$2b$10$a0aOPl8iCBeMXMoGdo6PwepxXrXen1pXnrzLNVqyB33OS2fLApW.u', '4574545', '2023-03-17', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:06:54', NULL),
(66, 'asas', 'asas', 'superadmin1@gmail.com', '$2b$10$wimjq12W4UEsyk.POlGp9eoaGlE.zeUCRh8s0iT/4Q75XgFd3Awvy', '', '', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:07:32', NULL),
(67, 'asa', 'asa', 'superadmin1@gmail.com', '$2b$10$Qw10tyuOB5bg9MiOYdg1YOqUUVIUqwYROFgnzawhQLjlXHDs9pcfS', '', '', '', 0, '0', 6, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:07:48', NULL),
(68, 'Altaf ahmad', 'Altaf ahmad', 'superadmin1@gmail.com', '$2b$10$G1zSmH7iRFB0HAuQRjAhLuhNQ8fNZuwX2DyXe3rHn4.rYF2Mwu0Zy', '515156151', '2023-03-16', '', 1, '0', 6, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:08:19', NULL),
(69, 'chandan kumar', 'chandan', 'superadmin1@gmail.com', '$2b$10$3Vu6Yv61l6gGJvVXmweLqeyKBk.ml5cuX6ERLJAz5CsuFu8BSC4aq', '446516513', '2023-03-23', '', 1, '0', 6, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:09:27', '2023-03-13 17:23:12'),
(70, 'deepenshu', 'deepenshu', 'superadmin1@gmail.com', '$2b$10$9BRYU3U3so9uV7sIZxI91OuHrG65QSNbFUXM1zw7gp44iT9KE7CYq', '65165165', '2023-03-16', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:15:18', NULL),
(71, 'deepen', 'deepen', 'superadmin1@gmail.com', '$2b$10$fBdyZjeSUx/tnVuW.j2QCOVFuBjhqVpbNUZE./RqCaJqNs30jVa5C', '', '', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:16:16', NULL),
(72, 'lataf', 'ops', 'superadmin1@gmail.com', '$2b$10$l1o.sdIp4eqCdMwn8KUqlenXKP7wAWitFO3hLBGkY78MYrchp1OES', '626262655', '2023-03-10', '', 1, '0', 6, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:07:32', '2023-03-13 17:32:15'),
(73, 'Altaf alss123', 'Altaf ali', 'superadmin1@gmail.com', '$2b$10$nB/py0spxNBDvt/3skPD6eQ5yCMhPoGd/8GzLqAvrjIWPL21.GjFq', '5655613', '2023-03-17', '', 0, '0', 6, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:19:00', '2023-03-13 17:31:18'),
(74, 'ankurs', 'ankurs', 'superadmin1@gmail.com', '$2b$10$0KAZXWGnpVvLROQ78D8iAe3dIHGLa2l9h3pJIsqPEBmdQiUfAzjjq', '132165148', '2023-03-24', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:32:50', NULL),
(75, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$nfS3x.Svg4bLB7Fd2RLspuuqqH04Vib3KCSnTAWtzW8o2glfezq4i', '46515165161', '2023-03-09', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:35:31', NULL),
(76, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$Y71SLAGGct.wiAw9VE4qteAZ/rCHRbq.xmSfdvcPX1YceNWAXgMRC', '4514514', '2023-03-10', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:36:21', NULL),
(77, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$nzj52l66G2DGKRCfJZ26W.tKcTSvLv3qE3AjTznBj4J5OOa.5hQbW', '651516157', '2023-03-03', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:36:53', NULL),
(78, 'asasas', 'asasas', 'superadmin1@gmail.com', '$2b$10$Cz0sRkWcCYyPhltMYR/3SuqIrH4/gOCLFHKIkAOL9fbXY5qF8dXmS', '', '', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:38:01', NULL),
(79, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$0UHuhmW2djbvbtsfad5b2u4c47Wt0ACXqLUQ9DKw9hrt05F.TPZ3m', '51651651', '2023-03-10', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:38:57', NULL),
(80, 'punkaj', 'punkaj', 'superadmin1@gmail.com', '$2b$10$LXVHOLiKmDPD1EqcJ1wXKuVUM.ELvAPWUxfrry7xTbJEsBDaeioHi', '5165163', '2023-03-10', '', 1, '0', 6, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:39:16', NULL),
(81, 'kuldeep kumar', 'kuldeep', 'superadmin1@gmail.com', '$2b$10$0fd5HrfwKQa0KB3zxpRtU.CyM87/dJ0Lii5uKqQ/pKTEdA1zm3LMi', '9313301020', '2023-03-17', '', 0, '1', 6, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:41:28', '2023-03-14 13:17:27'),
(82, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$0KhHycHOuGDaiGMK1yrkHuFbykk7.3kL3GxkHcsUNfWStRfN1Q0su', '54192', '2023-03-17', '', 1, '0', 6, 47, NULL, NULL, NULL, NULL, 1, '2023-03-14 10:16:28', NULL),
(83, 'sumit', 'sumit', 'superadmin1@gmail.com', '$2b$10$zEMlHV3Rdk.Fd6HV5P8AqugZoX2NTj/1wiim3y2bNrh6ksbwsdB4C', '4541515156', '2023-03-10', '', 1, '1', 6, 3, NULL, NULL, NULL, NULL, 1, '2023-03-14 11:27:22', '2023-03-14 11:27:38'),
(84, 'uday', 'uday', 'superadmin1@gmail.com', '$2b$10$82PGqTLoE0KNT8n44io2Uu/1w7QH3miGuCDSU3NNPctLTcGPeEEDu', '12', '', '', 1, '1', 6, 48, NULL, NULL, NULL, NULL, 1, '2023-03-14 11:31:08', '2023-03-14 13:16:29'),
(85, 'Dealer 4567', 'Dealer 4567', 'superadmin1@gmail.com', '$2b$10$u7HltOEmDX04zQHeCnskweDlVyGcEqZwVJTRzT.TTG5oV.b3th6Ci', '5216526562', '2023-03-16', '', 1, '0', 6, 48, NULL, NULL, NULL, NULL, 1, '2023-03-14 11:52:14', NULL),
(86, 'Altaf hm', 'Altaf hm', 'superadmin1@gmail.com', '$2b$10$uWgU02v7iACwOmiklJD0a.5lPWQsWRK5nScfhCTuXQmvOjB.6Hic6', '8855666651', '2023-03-14', '', 0, '1', 6, 24, NULL, NULL, NULL, NULL, 1, '2023-03-14 12:35:04', '2023-03-14 13:01:42'),
(87, 'Dealer 4567', 'Dealer 4567', 'superadmin1@gmail.com', '$2b$10$bnwAul/C4QCXo2MZG.f5ZugTqQ.FiAq7iHg8R1yR0BBDU1.m498rW', '9595959959', '2023-03-09', '', 1, '1', 6, 24, NULL, NULL, NULL, NULL, 1, '2023-03-14 12:39:54', '2023-03-14 13:17:44'),
(88, 'Contractor 1 user', 'Contractor 1 user', 'contractoruser1@gmail.com', '$2b$10$iFmb2AS4fF4XU.5e4YWxmepq7VP6MVumKPRH1vEYlNgDhCavUJyYi', '9313301020', '2023-03-14', '/user_images/1678799806236download.png', 0, '0', 6, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 13:37:24', '2023-03-14 18:46:46'),
(89, 'Contractor 1 user', 'Contractor 1 user', 'contractoruser1@gmail.com', '$2b$10$I5qUjbUXtPwLOw.cy5YGt.SvrO6EqhfFyQKtDQIV2KgwiqXxy1d4.', '9313301020', '21-02-2023', '/user_images/1678787442428image.png', 1, '0', 6, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:20:42', NULL),
(90, 'pintu', 'pintu', 'PINTUadmin1@gmail.com', '$2b$10$oeu/oEQEXWzdN4FTfoVFOul8eV9D7oIpvM9GkSotBKS7hxP9iiSrS', '6515165165', '2023-03-31', '', 1, '0', 6, 37, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:22:38', NULL),
(91, 'ankurs', 'ankurs', 'superadmin1@gmail.com', '$2b$10$BspP5ez07QwB1Blb.1W5q.T56Q8EyTJ1m1FQSWZ8hqs/aX1eYM9i2', '8855666651', '2023-03-02', '', 1, '1', 6, 3, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:38:39', NULL),
(92, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$pEBExbzz.MDodAyfE54wAuX5/quK18ZNE4HqSCCXydD8j/hO3m2aG', '', '', '', 1, '1', 6, 3, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:03:55', NULL),
(93, 'Rahul Kumar', 'Rahul Kumar', 'rahul@gmail.com', '$2b$10$aT4HYlBIer5cPA2.lmkk/eB0Q1a8WeRxb2dkzHlyUQN0SdTX.hT8W', '9313301020', '2023-03-14', '', 0, '1', 6, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:18:02', NULL),
(94, 'Super Altaf', 'Super Altaf', 'superadmin1@gmail.com', '$2b$10$0yMlK.a7/fNyvbXha0g31e1lAwC.2jfe3C3zBNhDHBpnxl3TwOT3O', '9313301020', '2023-03-29', '', 1, '1', 6, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:18:49', '2023-03-14 16:19:09'),
(95, 'Rahul Kumar', 'Rahul Kumar', 'rahulkumar@sartiaglobal.com', '$2b$10$qsnOX3rbyJHOeRFRCBpa3eeu3.AcXPbGw94dSl/BisQs9dG1rFppK', '9313301020', '2023-03-14', '/user_images/1678799278847free-diploma-of-graduation.webp', 1, '0', 6, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:34:29', '2023-03-14 18:37:58'),
(96, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$RI6exSkp3o62olSbtrY8q.12gHNfgR6FdwUskqn4xjvga07ezfqLi', '8855666651', '2023-03-09', '', 1, '1', 6, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:53:14', '2023-03-14 17:35:46'),
(97, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$NgNMDDvP5NkL4tRhVn5kQOM/uJ2JIrGbpHz7Td9Z4KetlIp/jaRZC', '8855666651', '2023-03-15', '', 1, '1', 6, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:08:12', NULL),
(98, 'gdfgdfg', 'gdfgdfg', 'superadmin1@gmail.com', '$2b$10$fIBLgvJBTJM8bbJOdI91lOm6wXzv/rWl0SBN1efx2eL/a9TJbjVMO', '8855666651', '', '/user_images/16787977940354k-2.jfif', 1, '0', 6, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:13:14', '2023-03-15 11:13:35'),
(99, 'test', 'test', 'superadmin1@gmail.com', '$2b$10$A6hSKvtpwtdx/lT7bn8qVuFhsCsCgWKIxNkCd1Cd4DIaINmMmHPna', '3453453453', '2023-03-14', '/user_images/16787978954284k-2.jfif', 0, '0', 6, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:14:55', NULL),
(100, 'ertert', 'ertert', 'superadmin1@gmail.com', '$2b$10$SyGdFNrDzDjM.IxVRM7oUe9O8G4bAGYmHGwiALseASu0ShTfCPfaO', '8855666651', '', '/user_images/1678797908955404-error.png', 1, '0', 6, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:15:08', NULL),
(101, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$Y/OKRzbqv/KqxeptbYl7c.422zeoo/vrrInV4eFioUWCJaD5KahRO', '8855666651', '2023-03-16', '/user_images/1678799762404404-error.png', 0, '0', 6, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:36:25', '2023-03-14 18:46:02'),
(102, 'CONTRACTORS user 1', 'CONTRACTORS user 1', 'superadmin1@gmail.com', '$2b$10$rJ2lHM5iwo84soGsi83aK.cdcFw00.kDfL6fAYMUiJ9YtmRtlSbt6', '5415848484', '2023-03-15', '/user_images/16788558031114k-2.jfif', 1, '0', 6, 60, NULL, NULL, NULL, NULL, 1, '2023-03-15 10:20:03', '2023-03-15 10:33:18'),
(103, 'CONTRACTORS user 1', 'CONTRACTORS user 1', 'superadmin1@gmail.com', '$2b$10$0hjch2TPgvwrvbjgsVsiIOTzzOXlTcuo5NIg/YFh/.MkpWsQXNCJ2', '1236547899', '2023-03-15', '/user_images/1678855908911404-error.png', 0, '0', 6, 57, NULL, NULL, NULL, NULL, 1, '2023-03-15 10:21:48', NULL),
(104, 'CONTRACTORS user 2', 'CONTRACTORS user 2', 'superadmin1@gmail.com', '$2b$10$KnJBtk54Zd4bZIukrUn3GuCAU1yP9aCBObMqj0D2pN17GmDjW7cAq', '8855666651', '2023-03-16', '/user_images/1678855995633logo.jpg', 1, '0', 6, 57, NULL, NULL, NULL, NULL, 1, '2023-03-15 10:23:01', '2023-03-15 10:23:15'),
(105, 'team member 1', 'teammemeber1@gmail.com', 'team member 1', '$2b$10$OlBXTMwyqQ1MLrxNpDEksuHvKxDWNK/wt1V3LzXjytp7/xsEOwu7y', '', '2023-03-16', '/user_images/1678944993962download.png', 1, '0', 7, 1, 1, NULL, NULL, NULL, 1, '2023-03-16 11:06:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

CREATE TABLE `zones` (
  `zone_id` int(11) NOT NULL,
  `zone_name` varchar(120) NOT NULL,
  `zone_description` longtext DEFAULT NULL,
  `zone_status` smallint(3) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zones`
--

INSERT INTO `zones` (`zone_id`, `zone_name`, `zone_description`, `zone_status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'EAST ZONE', 'East zone description', 1, 1, '2023-03-06 10:47:33', NULL),
(2, 'West zone', 'West ZONE DESCRIPTION', 1, 1, '2023-03-06 10:47:50', NULL),
(3, 'North Zone', 'North zone description', 1, 1, '2023-03-06 10:48:10', NULL),
(4, 'South ZOne', 'South ZONE DESCRIPTION', 1, 1, '2023-03-06 10:48:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `zone_assigns`
--

CREATE TABLE `zone_assigns` (
  `id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zone_assigns`
--

INSERT INTO `zone_assigns` (`id`, `zone_id`, `energy_company_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 4, 16, 1, '2023-02-15 14:07:03', '2023-02-17 18:20:57'),
(2, 3, 14, 1, '2023-02-16 11:31:14', '2023-03-16 10:54:49'),
(7, 3, 66, 0, '2023-03-16 13:31:12', '2023-03-16 14:08:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `company_types`
--
ALTER TABLE `company_types`
  ADD PRIMARY KEY (`company_type_id`);

--
-- Indexes for table `complaint_types`
--
ALTER TABLE `complaint_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `document_categories`
--
ALTER TABLE `document_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `energy_companies`
--
ALTER TABLE `energy_companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback_and_suggestions`
--
ALTER TABLE `feedback_and_suggestions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_masters`
--
ALTER TABLE `item_masters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `outlets`
--
ALTER TABLE `outlets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plan_checklists`
--
ALTER TABLE `plan_checklists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purpose_masters`
--
ALTER TABLE `purpose_masters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `regional_offices`
--
ALTER TABLE `regional_offices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `regional_office_assigns`
--
ALTER TABLE `regional_office_assigns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_area`
--
ALTER TABLE `sales_area`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_area_assigns`
--
ALTER TABLE `sale_area_assigns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_companies`
--
ALTER TABLE `sale_companies`
  ADD PRIMARY KEY (`sale_company_id`);

--
-- Indexes for table `software_activation_requests`
--
ALTER TABLE `software_activation_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sub_modules`
--
ALTER TABLE `sub_modules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `survey`
--
ALTER TABLE `survey`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `survey_questions`
--
ALTER TABLE `survey_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_categories`
--
ALTER TABLE `task_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_comments`
--
ALTER TABLE `task_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tutorials`
--
ALTER TABLE `tutorials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `zones`
--
ALTER TABLE `zones`
  ADD PRIMARY KEY (`zone_id`);

--
-- Indexes for table `zone_assigns`
--
ALTER TABLE `zone_assigns`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `company_types`
--
ALTER TABLE `company_types`
  MODIFY `company_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `complaint_types`
--
ALTER TABLE `complaint_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document_categories`
--
ALTER TABLE `document_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `energy_companies`
--
ALTER TABLE `energy_companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `feedback_and_suggestions`
--
ALTER TABLE `feedback_and_suggestions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `item_masters`
--
ALTER TABLE `item_masters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `outlets`
--
ALTER TABLE `outlets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plan_checklists`
--
ALTER TABLE `plan_checklists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purpose_masters`
--
ALTER TABLE `purpose_masters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `regional_offices`
--
ALTER TABLE `regional_offices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `regional_office_assigns`
--
ALTER TABLE `regional_office_assigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sales_area`
--
ALTER TABLE `sales_area`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sale_area_assigns`
--
ALTER TABLE `sale_area_assigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sale_companies`
--
ALTER TABLE `sale_companies`
  MODIFY `sale_company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `software_activation_requests`
--
ALTER TABLE `software_activation_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sub_modules`
--
ALTER TABLE `sub_modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `survey`
--
ALTER TABLE `survey`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `survey_questions`
--
ALTER TABLE `survey_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `task_categories`
--
ALTER TABLE `task_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `task_comments`
--
ALTER TABLE `task_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tutorials`
--
ALTER TABLE `tutorials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `zones`
--
ALTER TABLE `zones`
  MODIFY `zone_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `zone_assigns`
--
ALTER TABLE `zone_assigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
