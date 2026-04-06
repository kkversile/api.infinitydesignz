-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 28, 2025 at 09:00 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `defaultdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `applied_coupons`
--

DROP TABLE IF EXISTS `applied_coupons`;
CREATE TABLE IF NOT EXISTS `applied_coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `couponId` int NOT NULL,
  `orderId` int DEFAULT NULL,
  `appliedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `applied_coupons_userId_couponId_key` (`userId`,`couponId`),
  KEY `applied_coupons_couponId_fkey` (`couponId`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applied_coupons`
--

INSERT INTO `applied_coupons` (`id`, `userId`, `couponId`, `orderId`, `appliedAt`) VALUES
(31, 6, 1, NULL, '2025-08-11 06:30:36.580'),
(109, 1, 4, NULL, '2025-08-21 11:00:00.898'),
(157, 12, 4, NULL, '2025-09-04 10:06:47.597'),
(168, 3, 4, NULL, '2025-09-04 10:23:07.632');

-- --------------------------------------------------------

--
-- Table structure for table `assembly_types`
--

DROP TABLE IF EXISTS `assembly_types`;
CREATE TABLE IF NOT EXISTS `assembly_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
CREATE TABLE IF NOT EXISTS `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `brands_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `logo_url`, `status`, `created_at`) VALUES
(21, 'Casacraft from Pepperfryy', NULL, 0, '2025-07-24 07:29:20.526'),
(23, 'Infinity', NULL, 1, '2025-07-24 11:16:47.640'),
(32, 'Blum', NULL, 1, '2025-08-02 07:41:49.009');

-- --------------------------------------------------------

--
-- Table structure for table `buy_now_items`
--

DROP TABLE IF EXISTS `buy_now_items`;
CREATE TABLE IF NOT EXISTS `buy_now_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `variantId` int DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `buy_now_items_userId_key` (`userId`),
  KEY `buy_now_items_productId_fkey` (`productId`),
  KEY `buy_now_items_variantId_fkey` (`variantId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `buy_now_items`
--

INSERT INTO `buy_now_items` (`id`, `userId`, `productId`, `variantId`, `quantity`, `createdAt`, `updatedAt`) VALUES
(7, 3, 165, NULL, 1, '2025-08-22 06:04:52.185', '2025-09-04 10:20:37.857'),
(8, 1, 168, NULL, 2, '2025-08-22 06:36:56.118', '2025-08-22 06:37:25.812'),
(9, 8, 167, NULL, 1, '2025-09-03 06:19:23.238', '2025-09-03 06:23:56.284'),
(10, 12, 173, 269, 1, '2025-09-04 08:49:50.766', '2025-09-04 10:04:52.549'),
(12, 11, 173, NULL, 1, '2025-09-04 10:20:34.496', '2025-09-16 20:03:16.130');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `variantId` int DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_userId_productId_variantId_key` (`userId`,`productId`,`variantId`),
  KEY `cart_items_productId_fkey` (`productId`),
  KEY `cart_items_variantId_fkey` (`variantId`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `userId`, `productId`, `variantId`, `quantity`, `createdAt`, `updatedAt`) VALUES
(51, 6, 165, NULL, 1, '2025-08-11 06:10:47.133', '2025-08-11 06:10:47.133'),
(72, 8, 167, NULL, 1, '2025-09-03 06:24:02.746', '2025-09-03 06:24:02.746'),
(77, 12, 173, 269, 2, '2025-09-04 10:06:15.922', '2025-09-04 10:06:15.922'),
(78, 3, 173, NULL, 1, '2025-09-04 10:07:49.862', '2025-09-04 10:07:49.862');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `frontDisplay` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `appIcon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `webImage` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mainImage` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `featureTypeId` int DEFAULT NULL,
  `filterTypeId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `showInNeedHelpBuying` tinyint(1) NOT NULL DEFAULT '0',
  `showInHomeTabs` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `categories_parentId_fkey` (`parentId`),
  KEY `categories_featureTypeId_fkey` (`featureTypeId`),
  KEY `categories_filterTypeId_fkey` (`filterTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=283 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `title`, `position`, `status`, `frontDisplay`, `appIcon`, `webImage`, `mainImage`, `parentId`, `featureTypeId`, `filterTypeId`, `createdAt`, `updatedAt`, `showInNeedHelpBuying`, `showInHomeTabs`) VALUES
(166, 'Mattresses', NULL, 1, NULL, '1753361783873-bedroom-decor-with-potted-plants.jpg', '1753361794709-bedroom-decor-with-potted-plants.jpg', '1753361799680-bedroom-decor-with-potted-plants.jpg', NULL, NULL, 4, '2025-07-24 10:48:36.261', '2025-07-28 06:12:48.627', 0, 0),
(169, 'Sofas & Seating', NULL, 1, NULL, '1753361803805-Recliner-PNG-Photos.png', '1753354551132-img.png', '1753354551220-finance-money-debt-credit-balance-concept.jpg', NULL, NULL, 4, '2025-07-24 10:55:52.149', '2025-07-24 12:56:44.828', 0, 0),
(172, 'Furniture', NULL, 1, NULL, '1756794570939-king_bed.svg', '1753356201857-1745306627_main_blog-4.png', '1753356201895-1745306627_main_blog-4.png', NULL, NULL, NULL, '2025-07-24 11:23:21.955', '2025-09-04 09:40:00.633', 0, 1),
(173, 'Sofa', NULL, 1, NULL, '1753356264996-1745306627_main_blog-4.png', '1753356265127-1745306627_main_blog-4.png', '1756792141509-sofa.png', 172, NULL, NULL, '2025-07-24 11:24:25.325', '2025-09-02 05:49:01.695', 0, 0),
(174, '3 Seater Sofas', NULL, 1, NULL, '1753356350343-1745306627_main_blog-4.png', '1753356350430-1745306627_main_blog-4.png', '1753356350461-1745306627_main_blog-4.png', 173, 29, 5, '2025-07-24 11:25:50.493', '2025-07-28 06:13:05.365', 0, 0),
(175, '2 Seater Sofas', NULL, 1, NULL, '1753357043827-1745306627_main_blog-4.png', '1753357043925-1745306627_main_blog-4.png', '1753357044011-1745306627_main_blog-4.png', 173, 29, 5, '2025-07-24 11:37:24.046', '2025-07-24 11:37:24.046', 0, 0),
(176, '1 Seater Sofas', NULL, 1, NULL, '1753357119269-1746418130_mid-century-interior-design.jpg', '1753357120023-1746418130_mid-century-interior-design.jpg', '1753357120715-1746418130_mid-century-interior-design.jpg', 173, 29, 5, '2025-07-24 11:38:41.840', '2025-07-24 11:38:41.840', 0, 0),
(177, 'Sofa Sets', NULL, 1, NULL, '1753357213057-1745306627_main_blog-4.png', '1753357213746-1746418130_mid-century-interior-design.jpg', '1753357225264-1746418130_mid-century-interior-design.jpg', 173, 29, 5, '2025-07-24 11:40:28.449', '2025-07-24 11:40:28.449', 0, 0),
(178, 'Recliners', NULL, 1, NULL, '1753357526692-Recliner-PNG-Photos.png', '1753357526834-Recliner-PNG-Photos.png', '1753357526918-Recliner-PNG-Photos.png', 172, NULL, NULL, '2025-07-24 11:45:26.958', '2025-07-24 11:45:26.958', 0, 0),
(179, '3 Seater Recliners', NULL, 1, NULL, '1753357675752-Recliner-PNG-Photos.png', '1753357675843-Recliner-PNG-Photos.png', '1753357675916-Recliner-PNG-Photos.png', 178, 29, 5, '2025-07-24 11:47:55.967', '2025-07-24 11:47:55.967', 0, 0),
(180, '2 Seater Recliners', NULL, 1, NULL, '1753358371570-Recliner-PNG-Photos.png', '1753358372774-Recliner-PNG-Photos.png', '1753358372844-Recliner-PNG-Photos.png', 178, 29, 5, '2025-07-24 11:59:32.889', '2025-07-24 12:00:03.478', 0, 0),
(182, ' Recliners Seats', NULL, 1, NULL, '1753358943741-Recliner-PNG-Photos.png', '1753358943826-Recliner-PNG-Photos.png', '1753358943857-Recliner-PNG-Photos.png', 178, 29, 5, '2025-07-24 12:09:03.901', '2025-07-24 12:09:03.901', 0, 0),
(183, 'Sofas', NULL, 1, NULL, '1753360465193-Recliner-PNG-Photos.png', '1753360465312-Recliner-PNG-Photos.png', '1753360465444-1746418130_mid-century-interior-design.jpg', 169, NULL, NULL, '2025-07-24 12:34:27.869', '2025-07-24 12:39:39.755', 0, 0),
(184, '3 Seater Sofas', NULL, 1, NULL, '1753360754398-Recliner-PNG-Photos.png', '1753360754495-Recliner-PNG-Photos.png', '1753360754550-Recliner-PNG-Photos.png', 183, 29, 5, '2025-07-24 12:39:14.610', '2025-07-24 12:39:14.610', 0, 0),
(185, '2 Seater Sofas', NULL, 1, NULL, '1753360840215-Recliner-PNG-Photos.png', '1753360840376-1745306627_main_blog-4.png', '1753360840478-1745306627_main_blog-4.png', 183, 29, 5, '2025-07-24 12:40:40.582', '2025-07-24 12:40:40.582', 0, 0),
(186, '1 Seater Sofas', NULL, 1, NULL, '1753361051037-Recliner-PNG-Photos.png', '1753361051499-Recliner-PNG-Photos.png', '1753361051592-Recliner-PNG-Photos.png', 183, 29, 5, '2025-07-24 12:44:11.676', '2025-07-24 12:44:11.676', 0, 0),
(187, 'Sofas Seats', NULL, 1, NULL, '1753361100420-Recliner-PNG-Photos.png', '1753361100549-Recliner-PNG-Photos.png', '1753361100629-Recliner-PNG-Photos.png', 183, 29, 5, '2025-07-24 12:45:00.709', '2025-07-24 12:45:00.709', 0, 0),
(188, 'Recliners', NULL, 1, NULL, '1753361191116-Recliner-PNG-Photos.png', '1753361191448-Recliner-PNG-Photos.png', '1753361191567-Recliner-PNG-Photos.png', 169, NULL, NULL, '2025-07-24 12:46:31.613', '2025-07-24 12:46:31.613', 0, 0),
(190, '2 Seater Recliners', NULL, 1, NULL, '1753361297820-Recliner-PNG-Photos.png', '1753361297978-Recliner-PNG-Photos.png', '1753361298066-Recliner-PNG-Photos.png', 188, 29, 5, '2025-07-24 12:48:18.143', '2025-07-24 12:48:18.143', 0, 0),
(191, '1 Seater Recliners', NULL, 1, NULL, '1753361330824-Recliner-PNG-Photos.png', '1753361330902-Recliner-PNG-Photos.png', '1753361330940-Recliner-PNG-Photos.png', 188, 29, 5, '2025-07-24 12:48:50.992', '2025-07-24 12:48:50.992', 0, 0),
(192, 'Seater Recliners', NULL, 1, NULL, '1753361383998-Recliner-PNG-Photos.png', '1753361384083-Recliner-PNG-Photos.png', '1753361384113-Recliner-PNG-Photos.png', 188, 29, 5, '2025-07-24 12:49:44.143', '2025-07-24 12:49:44.143', 0, 0),
(194, 'King Size Mattresses', NULL, 1, NULL, '1753361950490-bedroom-decor-with-potted-plants.jpg', '1753361959104-bedroom-decor-with-potted-plants.jpg', '1753361977361-bedroom-decor-with-potted-plants.jpg', 166, NULL, NULL, '2025-07-24 12:59:42.224', '2025-07-24 13:03:40.323', 0, 0),
(195, 'Foam', NULL, 1, NULL, '1753362564178-bedroom-decor-with-potted-plants.jpg', '1753362570327-bedroom-decor-with-potted-plants.jpg', '1753362578162-bedroom-decor-with-potted-plants.jpg', 194, 29, 4, '2025-07-24 13:09:44.731', '2025-07-24 13:09:44.731', 0, 0),
(196, 'Spring', NULL, 1, NULL, '1753362642189-bedroom-decor-with-potted-plants.jpg', '1753362647978-bedroom-decor-with-potted-plants.jpg', '1753362654317-bedroom-decor-with-potted-plants.jpg', 194, 29, 5, '2025-07-24 13:11:00.207', '2025-07-24 13:11:00.207', 0, 0),
(197, 'Coir', NULL, 1, NULL, '1753362801990-bedroom-decor-with-potted-plants.jpg', '1753362807108-bedroom-decor-with-potted-plants.jpg', '1753362810979-bedroom-decor-with-potted-plants.jpg', 194, 29, 5, '2025-07-24 13:13:35.513', '2025-07-24 13:13:35.513', 0, 0),
(198, 'Foldable Mattresses', NULL, 1, NULL, '1753363034695-bedroom-decor-with-potted-plants.jpg', '1753363040521-bedroom-decor-with-potted-plants.jpg', '1753363045026-bedroom-decor-with-potted-plants.jpg', 166, NULL, NULL, '2025-07-24 13:17:32.459', '2025-07-24 13:17:32.459', 0, 0),
(199, 'King Size', NULL, 1, NULL, '1753363152193-bedroom-decor-with-potted-plants.jpg', '1753363160989-bedroom-decor-with-potted-plants.jpg', '1753363166419-bedroom-decor-with-potted-plants.jpg', 198, 29, 5, '2025-07-24 13:19:30.275', '2025-07-24 13:19:30.275', 0, 0),
(200, 'Queen Size', NULL, 1, NULL, '1753363200203-bedroom-decor-with-potted-plants.jpg', '1753363203015-bedroom-decor-with-potted-plants.jpg', '1753363206797-bedroom-decor-with-potted-plants.jpg', 198, 29, 5, '2025-07-24 13:20:12.263', '2025-07-24 13:20:12.263', 0, 0),
(201, 'Single', NULL, 1, NULL, '1753363242765-bedroom-decor-with-potted-plants.jpg', '1753363246717-bedroom-decor-with-potted-plants.jpg', '1753363249013-bedroom-decor-with-potted-plants.jpg', 198, 29, 5, '2025-07-24 13:20:50.980', '2025-07-24 13:20:50.980', 0, 0),
(202, 'Home Decor', NULL, 1, NULL, '1756794670440-countertops.svg', '1753363439531-white-modern-vases-arrangement.jpg', '1753363441770-white-modern-vases-arrangement.jpg', NULL, NULL, NULL, '2025-07-24 13:24:04.697', '2025-09-02 06:31:10.450', 0, 1),
(203, 'Vases', NULL, 1, NULL, '1753363504950-white-modern-vases-arrangement.jpg', '1753363508077-white-modern-vases-arrangement.jpg', '1753363510726-white-modern-vases-arrangement.jpg', 202, NULL, NULL, '2025-07-24 13:25:13.438', '2025-07-24 13:25:13.438', 0, 0),
(204, 'Table Vases', NULL, 1, NULL, '1753363608878-white-modern-vases-arrangement.jpg', '1753363611157-white-modern-vases-arrangement.jpg', '1753363613603-white-modern-vases-arrangement.jpg', 203, 29, 5, '2025-07-24 13:26:55.981', '2025-07-24 13:26:55.981', 0, 0),
(205, 'Floor Vases', NULL, 1, NULL, '1753363707031-white-modern-vases-arrangement.jpg', '1753363710022-white-modern-vases-arrangement.jpg', '1753363713101-white-modern-vases-arrangement.jpg', 203, 29, 5, '2025-07-24 13:28:36.412', '2025-07-24 13:28:36.412', 0, 0),
(206, 'Table Decor', NULL, 1, NULL, '1753363783085-white-modern-vases-arrangement.jpg', '1753363786311-white-modern-vases-arrangement.jpg', '1753363788567-white-modern-vases-arrangement.jpg', 202, NULL, NULL, '2025-07-24 13:29:51.450', '2025-07-24 13:29:51.450', 0, 0),
(207, 'Decorative Boxes', NULL, 1, NULL, '1753363854141-white-modern-vases-arrangement.jpg', NULL, NULL, 206, 29, 5, '2025-07-24 13:30:57.680', '2025-07-24 13:30:57.680', 0, 0),
(208, 'Desk Organizers', NULL, 1, NULL, '1753363900417-white-modern-vases-arrangement.jpg', '1753363905178-white-modern-vases-arrangement.jpg', '1753363919391-white-modern-vases-arrangement.jpg', 206, 29, 5, '2025-07-24 13:32:08.051', '2025-07-24 13:32:08.051', 0, 0),
(209, 'Magazine Racks', NULL, 1, NULL, '1753416215207-white-modern-vases-arrangement.jpg', '1753416218053-bedroom-decor-with-potted-plants.jpg', '1753416221770-white-modern-vases-arrangement.jpg', 206, 29, 5, '2025-07-25 04:03:44.122', '2025-07-25 04:03:44.122', 0, 0),
(210, 'Pen Stands', NULL, 1, NULL, '1753416275493-white-modern-vases-arrangement.jpg', '1753416279019-white-modern-vases-arrangement.jpg', '1753416281316-white-modern-vases-arrangement.jpg', 206, 29, 5, '2025-07-25 04:04:43.710', '2025-07-25 04:04:43.710', 0, 0),
(211, 'Furnishings', NULL, 1, NULL, '1753416471384-pillow-sofa.jpg', '1753416473498-pillow-sofa.jpg', '1753416475510-pillow-sofa.jpg', NULL, NULL, NULL, '2025-07-25 04:07:57.737', '2025-09-04 05:21:13.601', 0, 0),
(212, 'Bed Sheets', NULL, 1, NULL, '1753416706148-folded-towels-bed.jpg', '1753416707401-folded-towels-bed.jpg', '1753416708567-folded-towels-bed.jpg', 211, NULL, NULL, '2025-07-25 04:11:49.440', '2025-07-25 04:11:49.440', 0, 0),
(213, 'Queen Bed Sheets', NULL, 1, NULL, '1753416808566-folded-towels-bed.jpg', '1753416810567-folded-towels-bed.jpg', '1753416811921-folded-towels-bed.jpg', 212, 29, 5, '2025-07-25 04:13:33.128', '2025-07-25 04:13:33.128', 0, 0),
(214, 'King Bed Sheets', NULL, 1, NULL, '1753416922099-folded-towels-bed.jpg', '1753416924523-folded-towels-bed.jpg', '1753416925824-folded-towels-bed.jpg', 212, 29, 5, '2025-07-25 04:15:26.926', '2025-07-25 04:15:26.926', 0, 0),
(215, 'Fitted Bed Sheets', NULL, 1, NULL, '1753417578358-folded-towels-bed.jpg', '1753417579376-folded-towels-bed.jpg', '1753417580352-folded-towels-bed.jpg', 212, 29, 5, '2025-07-25 04:26:21.332', '2025-07-25 04:26:21.332', 0, 0),
(216, 'Bath Linen', NULL, 1, NULL, '1753417639738-folded-towels-bed.jpg', '1753417641915-folded-towels-bed.jpg', NULL, 211, NULL, NULL, '2025-07-25 04:27:24.651', '2025-07-25 04:27:24.651', 0, 0),
(217, 'Bath Towels', NULL, 1, NULL, '1753417721037-folded-towels-bed.jpg', '1753417722246-folded-towels-bed.jpg', '1753417723642-folded-towels-bed.jpg', 216, 29, 5, '2025-07-25 04:28:44.700', '2025-07-25 04:28:44.700', 0, 0),
(218, 'Hand & Face Towels', NULL, 1, NULL, '1753417934127-folded-towels-bed.jpg', '1753417936030-folded-towels-bed.jpg', '1753417938987-folded-towels-bed.jpg', 216, 29, 5, '2025-07-25 04:32:20.580', '2025-07-25 04:32:20.580', 0, 0),
(219, 'Beach Towels', NULL, 1, NULL, '1753418032925-folded-towels-bed.jpg', NULL, NULL, 216, 29, 5, '2025-07-25 04:33:54.959', '2025-07-25 04:33:54.959', 0, 0),
(220, 'Lamps & Lighting', NULL, 1, NULL, '1756794704312-local_library.svg', NULL, '1753418123121-1746418130_mid-century-interior-design.jpg', NULL, NULL, NULL, '2025-07-25 04:35:24.265', '2025-09-02 06:31:44.320', 1, 1),
(221, 'Ceiling Lights', NULL, 1, NULL, '1753418242579-1746418130_mid-century-interior-design.jpg', '1753418243750-1746418130_mid-century-interior-design.jpg', '1753418244767-1746418130_mid-century-interior-design.jpg', 220, NULL, NULL, '2025-07-25 04:37:26.345', '2025-07-25 04:37:26.345', 0, 0),
(222, 'Hanging Lights', NULL, 1, NULL, '1753418296544-1746418130_mid-century-interior-design.jpg', '1753418299411-1746418130_mid-century-interior-design.jpg', '1753418301215-1746418130_mid-century-interior-design.jpg', 221, 29, 5, '2025-07-25 04:38:22.529', '2025-07-25 04:38:22.529', 0, 0),
(223, 'Chandeliers', NULL, 1, NULL, '1753418390623-1746418130_mid-century-interior-design.jpg', NULL, NULL, 221, 29, 5, '2025-07-25 04:39:53.238', '2025-07-25 04:39:53.238', 0, 0),
(224, 'Ceiling Flush Mounts', NULL, 1, NULL, '1753418461619-1745306627_main_blog-4.png', '1753418461741-1745306627_main_blog-4.png', '1753418461848-1745306627_main_blog-4.png', 221, 29, 5, '2025-07-25 04:41:01.963', '2025-07-25 04:41:01.963', 0, 0),
(225, 'Smart Lights', NULL, 1, NULL, '1753418611417-1745306627_main_blog-4.png', '1753418611753-1745306627_main_blog-4.png', '1753418611886-1746418130_mid-century-interior-design.jpg', 220, NULL, NULL, '2025-07-25 04:43:33.325', '2025-07-25 04:43:33.325', 0, 0),
(226, 'Smart Ceiling Lights', NULL, 1, NULL, '1753418785162-1745306627_main_blog-4.png', '1753418785271-1745306627_main_blog-4.png', '1753418785351-1746418130_mid-century-interior-design.jpg', 225, 29, 5, '2025-07-25 04:46:27.326', '2025-07-25 04:46:27.326', 0, 0),
(227, 'Smart Chandeliers', NULL, 1, NULL, NULL, NULL, NULL, 225, 29, 5, '2025-07-25 04:47:03.084', '2025-07-25 04:47:03.084', 0, 0),
(228, 'Smart Lamps', NULL, 1, NULL, NULL, NULL, NULL, 225, 29, 5, '2025-07-25 04:47:35.481', '2025-07-25 04:47:35.481', 0, 0),
(229, 'Smart Bulbs', NULL, 1, NULL, '1753418938794-1745306627_main_blog-4.png', '1753418938891-1746418130_mid-century-interior-design.jpg', '1753418940478-1746418130_mid-century-interior-design.jpg', 225, 29, 5, '2025-07-25 04:49:02.382', '2025-07-25 04:49:02.382', 0, 0),
(230, 'Kitchen & Dining', NULL, 1, NULL, '1756794689535-king_bed.svg', '1753419325604-woman-talking-her-long-distance-lover.jpg', NULL, NULL, NULL, NULL, '2025-07-25 04:55:28.645', '2025-09-02 06:31:29.548', 0, 1),
(231, 'Serveware', NULL, 1, NULL, '1753419390655-woman-talking-her-long-distance-lover.jpg', '1753419393286-woman-talking-her-long-distance-lover.jpg', '1753419395753-woman-talking-her-long-distance-lover.jpg', 230, NULL, NULL, '2025-07-25 04:56:37.935', '2025-07-25 04:56:37.935', 0, 0),
(232, 'Serving Bowls', NULL, 1, NULL, '1753419456292-woman-talking-her-long-distance-lover.jpg', '1753419459270-woman-talking-her-long-distance-lover.jpg', '1753419462369-woman-talking-her-long-distance-lover.jpg', 231, 29, 5, '2025-07-25 04:57:44.498', '2025-07-25 04:57:44.498', 0, 0),
(233, 'Casseroles', NULL, 1, NULL, '1753419487386-woman-talking-her-long-distance-lover.jpg', '1753419490517-woman-talking-her-long-distance-lover.jpg', NULL, 231, 29, 5, '2025-07-25 04:58:12.999', '2025-07-25 04:58:12.999', 0, 0),
(234, 'Butter Dishes', NULL, 1, NULL, '1753419529642-woman-talking-her-long-distance-lover.jpg', '1753419532134-woman-talking-her-long-distance-lover.jpg', '1753419534836-woman-talking-her-long-distance-lover.jpg', 231, 29, 5, '2025-07-25 04:58:57.761', '2025-07-25 04:58:57.761', 0, 0),
(235, 'Dinnerware', NULL, 1, NULL, '1753420846905-woman-talking-her-long-distance-lover.jpg', '1753420849958-woman-talking-her-long-distance-lover.jpg', '1753420852655-woman-talking-her-long-distance-lover.jpg', 230, NULL, NULL, '2025-07-25 05:20:55.624', '2025-07-25 05:20:55.624', 0, 0),
(236, 'Dinnerware Sets', NULL, 1, NULL, '1753420897908-woman-talking-her-long-distance-lover.jpg', '1753420900521-woman-talking-her-long-distance-lover.jpg', '1753420903738-woman-talking-her-long-distance-lover.jpg', 235, 29, 5, '2025-07-25 05:21:46.919', '2025-07-25 05:21:46.919', 0, 0),
(237, 'Bowls', NULL, 1, NULL, '1753420964631-woman-talking-her-long-distance-lover.jpg', '1753420967445-woman-talking-her-long-distance-lover.jpg', '1753420970559-woman-talking-her-long-distance-lover.jpg', 235, 29, 5, '2025-07-25 05:22:53.415', '2025-07-25 05:22:53.415', 0, 0),
(238, 'Dinner Plates', NULL, 1, NULL, '1753421003444-woman-talking-her-long-distance-lover.jpg', '1753421006692-woman-talking-her-long-distance-lover.jpg', '1753421010726-woman-talking-her-long-distance-lover.jpg', 235, 29, 5, '2025-07-25 05:23:34.212', '2025-09-03 06:17:51.468', 0, 0),
(239, 'Luxury', NULL, 1, NULL, '1756794716612-apartment.svg', '1753421347619-white-modern-vases-arrangement.jpg', '1753421350521-1746418130_mid-century-interior-design.jpg', NULL, NULL, NULL, '2025-07-25 05:29:12.552', '2025-09-02 06:31:56.621', 0, 1),
(240, 'Living Room', NULL, 1, NULL, '1753421387812-1745306627_main_blog-4.png', '1753421391693-1745306627_main_blog-4.png', '1753421394508-1746417841_beautiful-kitchen-interior-design.jpg', 239, NULL, NULL, '2025-07-25 05:29:58.553', '2025-07-25 05:29:58.553', 0, 0),
(241, 'Sofas', NULL, 1, NULL, '1753422080280-Recliner-PNG-Photos.png', '1753422080381-Recliner-PNG-Photos.png', '1753422080485-Recliner-PNG-Photos.png', 240, 29, 5, '2025-07-25 05:41:20.607', '2025-07-25 05:41:20.607', 0, 0),
(242, 'Recliners', NULL, 1, NULL, '1753422130451-Recliner-PNG-Photos.png', '1753422130553-Recliner-PNG-Photos.png', '1753422130691-Recliner-PNG-Photos.png', 240, 29, 5, '2025-07-25 05:42:10.795', '2025-08-30 04:52:57.832', 1, 0),
(243, 'Chairs', NULL, 1, NULL, '1753422186914-1746417841_beautiful-kitchen-interior-design.jpg', '1753422188663-1745306627_main_blog-4.png', '1753422188716-1746417841_beautiful-kitchen-interior-design.jpg', 240, 29, 5, '2025-07-25 05:43:10.602', '2025-07-25 05:43:10.602', 0, 0),
(244, 'Coffee Tables', NULL, 1, NULL, '1753422269130-pillow-sofa.jpg', '1753422271065-pillow-sofa.jpg', '1753422272796-pillow-sofa.jpg', 240, 29, 5, '2025-07-25 05:44:34.571', '2025-09-04 05:39:34.550', 0, 0),
(245, 'Home Office', NULL, 1, NULL, '1753422492416-pillow-sofa.jpg', '1753422502663-pillow-sofa.jpg', '1753434983673-Recliner-PNG-Photos.png', 239, NULL, NULL, '2025-07-25 05:48:28.599', '2025-07-25 09:16:25.229', 0, 0),
(246, 'Study Tables', NULL, 1, NULL, '1753422607814-pillow-sofa.jpg', '1753422609929-white-modern-vases-arrangement.jpg', NULL, 245, 29, 5, '2025-07-25 05:50:12.289', '2025-07-25 05:50:12.289', 0, 0),
(247, 'Office Chairs', NULL, 1, NULL, '1753422657060-white-modern-vases-arrangement.jpg', '1753422660938-pillow-sofa.jpg', '1753422663597-1745306627_main_blog-4.png', 245, 29, 5, '2025-07-25 05:51:03.632', '2025-09-03 06:20:35.759', 1, 0),
(248, 'Book Cases', NULL, 1, NULL, '1753422704745-pillow-sofa.jpg', '1753422707361-pillow-sofa.jpg', '1753422710158-1745306627_main_blog-4.png', 240, 29, 5, '2025-07-25 05:51:50.184', '2025-08-30 04:51:23.863', 1, 0),
(249, 'Dining Room', NULL, 1, NULL, '1753438289056-pillow-sofa.jpg', NULL, NULL, 239, NULL, NULL, '2025-07-25 10:11:31.228', '2025-07-25 10:11:31.228', 0, 0),
(250, 'Bedroom', NULL, 1, NULL, '1753438323251-pillow-sofa.jpg', NULL, NULL, 239, NULL, NULL, '2025-07-25 10:12:06.398', '2025-07-25 10:12:06.398', 0, 0),
(251, 'Top Brands', NULL, 1, NULL, NULL, NULL, NULL, 230, NULL, NULL, '2025-07-25 10:13:50.304', '2025-07-25 10:13:50.304', 0, 0),
(252, 'Kitchen Linen', NULL, 0, NULL, NULL, NULL, NULL, 230, NULL, NULL, '2025-07-25 10:14:08.801', '2025-07-25 10:14:08.801', 0, 0),
(253, 'Jars and Containers', NULL, 1, NULL, NULL, NULL, NULL, 230, NULL, NULL, '2025-07-25 10:14:42.032', '2025-07-25 10:14:42.032', 0, 0),
(254, 'Top Brands', NULL, 1, NULL, NULL, NULL, NULL, 220, NULL, NULL, '2025-07-25 10:16:18.530', '2025-07-25 10:16:18.530', 0, 0),
(255, 'Emergency Lights', NULL, 1, NULL, NULL, NULL, NULL, 220, NULL, NULL, '2025-07-25 10:16:37.662', '2025-07-25 10:16:37.662', 0, 0),
(256, 'Outdoor Lights', NULL, 1, NULL, NULL, NULL, NULL, 220, NULL, NULL, '2025-07-25 10:17:07.813', '2025-07-25 10:17:07.813', 0, 0),
(257, 'Curtains', NULL, 1, NULL, NULL, NULL, NULL, 211, NULL, NULL, '2025-07-25 10:18:14.242', '2025-07-25 10:18:14.242', 0, 0),
(258, 'Cushions & Covers', NULL, 1, NULL, NULL, NULL, NULL, 211, NULL, NULL, '2025-07-25 10:18:31.528', '2025-07-25 10:18:31.528', 0, 0),
(259, 'Kids Furnishings', NULL, 1, NULL, NULL, NULL, NULL, 211, NULL, NULL, '2025-07-25 10:19:23.029', '2025-07-25 10:19:23.029', 0, 0),
(260, 'Photo Frames', NULL, 1, NULL, NULL, NULL, NULL, 202, NULL, NULL, '2025-07-25 10:20:03.107', '2025-07-25 10:20:03.107', 0, 0),
(261, 'Spiritual', NULL, 1, NULL, NULL, NULL, NULL, 202, NULL, NULL, '2025-07-25 10:20:25.797', '2025-07-25 10:20:25.797', 0, 0),
(262, 'Prayer Essentials', NULL, 1, NULL, NULL, NULL, NULL, 202, NULL, NULL, '2025-07-25 10:20:55.604', '2025-07-25 10:20:55.604', 0, 0),
(264, 'Centre Tables', NULL, 1, NULL, NULL, NULL, '1756792082905-centerTable.png', 172, NULL, NULL, '2025-07-25 10:22:41.785', '2025-09-02 05:48:02.942', 0, 0),
(265, 'Dining Chairs', NULL, 1, NULL, NULL, NULL, '1756792256054-cabinets.png', 172, NULL, NULL, '2025-07-25 10:22:57.694', '2025-09-02 05:50:56.198', 0, 0),
(266, 'Top Collections', NULL, 1, NULL, NULL, NULL, '1756792236498-carpet.png', 172, NULL, NULL, '2025-07-25 10:23:26.598', '2025-09-02 05:50:36.545', 0, 0),
(267, 'Dining Chairs', NULL, 1, NULL, NULL, NULL, '1756792192607-cabinets.png', 169, NULL, NULL, '2025-07-25 10:23:56.333', '2025-09-02 05:49:52.692', 0, 0),
(268, 'Outdoor Seating', NULL, 1, NULL, NULL, NULL, NULL, 169, NULL, NULL, '2025-07-25 10:24:17.065', '2025-07-25 10:24:17.065', 0, 0),
(269, 'Sofa Cum Beds', NULL, 1, NULL, NULL, NULL, NULL, 169, NULL, NULL, '2025-07-25 10:24:33.568', '2025-07-25 10:24:33.568', 0, 0),
(270, 'Queen Size Mattresses', NULL, 1, NULL, NULL, NULL, NULL, 166, NULL, NULL, '2025-07-25 10:24:59.178', '2025-07-25 10:24:59.178', 0, 0),
(271, 'Mattress Protectors', NULL, 1, NULL, '1756901552696-apartment.svg', '1756901535891-apartment.svg', '1756901545956-apartment.svg', 166, NULL, NULL, '2025-07-25 10:25:17.280', '2025-09-03 12:12:32.707', 0, 0),
(272, 'Single Size Mattresses', NULL, 1, NULL, NULL, '1756966623113-cabinets.png', NULL, 186, NULL, NULL, '2025-07-25 10:25:40.509', '2025-09-04 06:17:09.117', 0, 0),
(277, 'Panel Lights', NULL, 1, NULL, NULL, '1754120700742-Insta Banner Logo.png', '1754120687111-Insta Banner Logo.png', 221, 31, 5, '2025-07-31 10:29:50.164', '2025-08-02 07:45:00.749', 0, 0),
(278, 'Example 12345', NULL, 1, NULL, NULL, '1756498647395-1751537320265-sofa2.jpg', '1756498647395-Capture.PNG', NULL, NULL, NULL, '2025-08-29 20:17:27.609', '2025-09-04 05:20:11.095', 1, 0),
(279, 'Example 123458', NULL, 1, NULL, NULL, '1756498678607-1751537320265-sofa2.jpg', '1756498678607-Capture.PNG', 278, NULL, NULL, '2025-08-29 20:17:58.830', '2025-09-01 13:11:57.284', 1, 1),
(282, 'test', NULL, 1, NULL, NULL, '1756901524098-countertops.svg', NULL, 279, 41, 8, '2025-09-03 11:52:58.491', '2025-09-04 09:40:45.554', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `colors`
--

DROP TABLE IF EXISTS `colors`;
CREATE TABLE IF NOT EXISTS `colors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hex_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `colors`
--

INSERT INTO `colors` (`id`, `label`, `hex_code`, `status`) VALUES
(13, 'Red', '#F14141', 1),
(24, 'Blue', '#1e4ebe', 1),
(25, 'White', '#FFFFFF', 1),
(26, 'Green', '#5FD523', 1),
(27, 'Orange', '#EDBF2E', 1);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `mobile`, `subject`, `description`, `created_at`, `updated_at`) VALUES
(2, 'Mehul Galiyawala', 'sales@styleelifestyle.com', '9081117788', 'Business Proposal', 'Stylee Lifestyle # Business', '2025-08-25 07:45:10.768', '2025-08-25 07:45:10.768'),
(3, 'Mehul Galiyawala', 'sales@styleelifestyle.com', '9081117788', 'Business Proposal', 'Stylee Lifestyle # Business', '2025-08-25 09:06:35.509', '2025-08-25 09:06:35.509'),
(6, 'Updated Name', 'updated@example.com', '9000000000', 'Updated Subject', 'Updated description', '2025-08-25 10:04:19.706', '2025-08-25 10:04:36.238'),
(7, 'Amit Sharma', '12345@gmil.com', '8790969134', 'query ', 'vdsevedvgew', '2025-08-25 10:17:05.099', '2025-08-25 10:17:05.099');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('LIST_SUBMENU','BRAND','URL','PRICE','SELLER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priceType` enum('FIXED','PERCENTAGE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` double NOT NULL,
  `minOrderAmount` double NOT NULL DEFAULT '0',
  `fromDate` datetime(3) DEFAULT NULL,
  `toDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `menuId` int DEFAULT NULL,
  `subMenuId` int DEFAULT NULL,
  `listSubMenuId` int DEFAULT NULL,
  `brandId` int DEFAULT NULL,
  `sellerId` int DEFAULT NULL,
  `url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priceRangeId` int DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_key` (`code`),
  KEY `coupons_priceRangeId_fkey` (`priceRangeId`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `type`, `priceType`, `value`, `minOrderAmount`, `fromDate`, `toDate`, `createdAt`, `updatedAt`, `menuId`, `subMenuId`, `listSubMenuId`, `brandId`, `sellerId`, `url`, `priceRangeId`, `status`) VALUES
(1, 'LS-1', 'LIST_SUBMENU', 'FIXED', 150, 750, '2025-07-12 00:00:00.000', '2025-07-23 00:00:00.000', '2025-07-24 05:56:08.327', '2025-09-03 13:05:58.829', 149, 150, 151, NULL, NULL, NULL, NULL, 1),
(2, 'BR-5', 'BRAND', 'PERCENTAGE', 200, 1500, '2025-07-12 00:00:00.000', '2025-07-31 00:00:00.000', '2025-07-24 05:57:07.518', '2025-09-04 04:21:01.424', 149, 150, 151, 15, NULL, NULL, NULL, 0),
(3, 'URL-3', 'URL', 'FIXED', 201, 1000, '2025-07-15 00:00:00.000', '2025-07-23 00:00:00.000', '2025-07-24 05:57:30.575', '2025-09-04 04:19:59.548', NULL, NULL, NULL, NULL, NULL, 'www.example.com', NULL, 1),
(4, 'PR-5', 'PRICE', 'FIXED', 300, 800, '2025-07-18 00:00:00.000', '2025-07-22 00:00:00.000', '2025-07-24 05:57:56.455', '2025-09-03 12:50:37.892', NULL, NULL, NULL, NULL, NULL, NULL, 3, 1),
(6, 'PR-6', 'PRICE', 'FIXED', 900, 5000, '2025-07-12 00:00:00.000', '2025-07-12 00:00:00.000', '2025-08-07 07:48:39.331', '2025-09-03 12:50:37.892', NULL, NULL, NULL, NULL, NULL, NULL, 5, 1),
(7, 'LS-5', 'LIST_SUBMENU', 'FIXED', 300, 500, '2025-07-12 00:00:00.000', '2025-07-12 00:00:00.000', '2025-08-07 07:52:10.224', '2025-09-03 12:50:37.892', 166, 194, 195, NULL, NULL, NULL, NULL, 1),
(9, 'TS-1', 'LIST_SUBMENU', 'FIXED', 100, 10, NULL, NULL, '2025-09-03 12:59:26.900', '2025-09-03 12:59:26.900', 278, 279, 282, NULL, NULL, NULL, NULL, 1),
(11, 'LSM100', 'LIST_SUBMENU', 'FIXED', 150, 750, '2025-07-21 00:00:00.000', '2025-12-31 00:00:00.000', '2025-09-12 18:03:13.702', '2025-09-12 18:15:14.505', 1, 2, 3, NULL, NULL, NULL, NULL, 1),
(12, 'BRAND20', 'BRAND', 'PERCENTAGE', 20, 1000, '2025-07-22 00:00:00.000', '2025-12-31 00:00:00.000', '2025-09-12 18:03:38.754', '2025-09-12 18:03:38.754', NULL, NULL, NULL, 4, NULL, NULL, NULL, 1),
(13, 'PRSLAB500', 'PRICE', 'PERCENTAGE', 20, 600, '2025-07-22 00:00:00.000', '2025-12-31 00:00:00.000', '2025-09-13 07:23:42.698', '2025-09-13 07:23:42.698', NULL, NULL, NULL, NULL, NULL, NULL, 3, 1),
(21, 'PRICE_CPN1', 'PRICE', 'FIXED', 20, 0, '2025-09-17 00:00:00.000', '2025-09-20 00:00:00.000', '2025-09-15 17:36:39.446', '2025-09-15 17:36:39.446', NULL, NULL, NULL, NULL, NULL, NULL, 3, 1),
(23, 'PRICE_CPN12', 'PRICE', 'FIXED', 20, 0, '2025-09-17 00:00:00.000', '2025-09-20 00:00:00.000', '2025-09-15 17:42:51.498', '2025-09-15 17:42:51.498', NULL, NULL, NULL, NULL, NULL, NULL, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `deliveryoption`
--

DROP TABLE IF EXISTS `deliveryoption`;
CREATE TABLE IF NOT EXISTS `deliveryoption` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fee` double NOT NULL,
  `days` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deliveryoption`
--

INSERT INTO `deliveryoption` (`id`, `name`, `description`, `fee`, `days`) VALUES
(1, 'Express Delivery', NULL, 100, '1-2'),
(2, 'Express Delivery', NULL, 100, '1-2');

-- --------------------------------------------------------

--
-- Table structure for table `featuredcategory`
--

DROP TABLE IF EXISTS `featuredcategory`;
CREATE TABLE IF NOT EXISTS `featuredcategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `room` enum('LivingRoom','Kitchen','Office','Study','Garden') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `titleOverride` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageOverride` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startsAt` datetime(3) DEFAULT NULL,
  `endsAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `FeaturedCategory_room_categoryId_key` (`room`,`categoryId`),
  KEY `FeaturedCategory_room_position_idx` (`room`,`position`),
  KEY `FeaturedCategory_categoryId_fkey` (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `featuredcategory`
--

INSERT INTO `featuredcategory` (`id`, `categoryId`, `room`, `position`, `status`, `titleOverride`, `imageOverride`, `startsAt`, `endsAt`, `createdAt`, `updatedAt`) VALUES
(2, 279, 'LivingRoom', 2, 1, NULL, NULL, NULL, NULL, '2025-09-01 05:29:32.072', '2025-09-01 05:33:13.840');

-- --------------------------------------------------------

--
-- Table structure for table `feature_lists`
--

DROP TABLE IF EXISTS `feature_lists`;
CREATE TABLE IF NOT EXISTS `feature_lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `featureSetId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `feature_lists_featureSetId_fkey` (`featureSetId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feature_lists`
--

INSERT INTO `feature_lists` (`id`, `label`, `priority`, `status`, `featureSetId`) VALUES
(6, 'Leatherd', 1, 1, 6),
(7, 'Faux Leather', 1, 1, 6),
(9, 'Catton', 1, 1, 10),
(11, 'Cloth type', 1, 1, 12),
(12, 'Lengh', 2, 1, 12),
(13, 'Width', 3, 1, 12),
(16, 'test123', 1, 1, 17);

-- --------------------------------------------------------

--
-- Table structure for table `feature_sets`
--

DROP TABLE IF EXISTS `feature_sets`;
CREATE TABLE IF NOT EXISTS `feature_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `featureTypeId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `feature_sets_featureTypeId_fkey` (`featureTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feature_sets`
--

INSERT INTO `feature_sets` (`id`, `title`, `priority`, `status`, `featureTypeId`) VALUES
(6, 'Upholstery Material', 1, 1, 29),
(10, 'Abc Material', 2, 1, 29),
(12, 'Fabric', 1, 1, 41),
(13, 'General Details', 2, 1, 41),
(14, 'Dial Dimentions', 3, 1, 41),
(17, 'twst', 6, 1, 45);

-- --------------------------------------------------------

--
-- Table structure for table `feature_types`
--

DROP TABLE IF EXISTS `feature_types`;
CREATE TABLE IF NOT EXISTS `feature_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feature_types_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feature_types`
--

INSERT INTO `feature_types` (`id`, `name`) VALUES
(29, 'Material'),
(30, 'Premium Feature'),
(32, 'Recliner'),
(33, 'Sofa Material'),
(45, 'test'),
(31, 'Urban Ladder'),
(41, 'Watches Features');

-- --------------------------------------------------------

--
-- Table structure for table `filter_lists`
--

DROP TABLE IF EXISTS `filter_lists`;
CREATE TABLE IF NOT EXISTS `filter_lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `filterSetId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `filter_lists_filterSetId_fkey` (`filterSetId`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `filter_lists`
--

INSERT INTO `filter_lists` (`id`, `label`, `priority`, `status`, `filterSetId`) VALUES
(8, '1 Seater', 1, 1, 6),
(9, 'Grey', 1, 1, 7),
(10, 'Beige', 0, 1, 7),
(11, 'Blue', 1, 1, 7),
(12, 'Black', 1, 1, 7),
(13, '2 Seater', 1, 1, 6),
(14, '3 Seater', 1, 1, 6),
(15, '4 Seater', 2, 1, 6),
(16, 'Length', 1, 1, 8),
(17, 'Width', 1, 1, 8),
(18, 'Height', 1, 1, 8),
(19, 'Seat Heights', 1, 1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `filter_sets`
--

DROP TABLE IF EXISTS `filter_sets`;
CREATE TABLE IF NOT EXISTS `filter_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `filterTypeId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `filter_sets_filterTypeId_fkey` (`filterTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `filter_sets`
--

INSERT INTO `filter_sets` (`id`, `title`, `priority`, `status`, `filterTypeId`) VALUES
(6, 'Seating Capacity', 1, 1, 5),
(7, 'Color Options', 1, 1, 6),
(8, ' Sofa Dimensions', 1, 1, 5),
(9, 'fvvc', -1, 1, 8),
(13, 'Basic Filters', 1, 1, 8),
(18, 'testset', 2, 1, 13);

-- --------------------------------------------------------

--
-- Table structure for table `filter_types`
--

DROP TABLE IF EXISTS `filter_types`;
CREATE TABLE IF NOT EXISTS `filter_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `filter_types_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `filter_types`
--

INSERT INTO `filter_types` (`id`, `name`) VALUES
(6, 'Appearance'),
(8, 'Color Filters'),
(5, 'Size'),
(4, 'Sofa Material	'),
(13, 'test');

-- --------------------------------------------------------

--
-- Table structure for table `finishes`
--

DROP TABLE IF EXISTS `finishes`;
CREATE TABLE IF NOT EXISTS `finishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `keywords`
--

DROP TABLE IF EXISTS `keywords`;
CREATE TABLE IF NOT EXISTS `keywords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `keyword` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keywords_keyword_key` (`keyword`),
  KEY `keywords_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `keywords`
--

INSERT INTO `keywords` (`id`, `keyword`, `createdAt`, `updatedAt`) VALUES
(1, 'Filter_products', '2025-08-25 07:44:54.283', '2025-08-25 07:44:54.283'),
(3, 'Filter_products12', '2025-08-25 11:25:51.842', '2025-08-25 11:25:51.842'),
(4, 'Filter', '2025-08-25 12:49:37.109', '2025-08-25 12:49:37.109'),
(6, 'search', '2025-08-28 04:47:44.348', '2025-08-28 04:47:44.348'),
(7, 'Hanging Lights', '2025-08-28 04:48:55.756', '2025-08-28 04:48:55.756'),
(8, 'Mattress', '2025-08-28 05:07:43.895', '2025-08-28 05:07:43.895'),
(9, 'Furniture', '2025-08-28 05:08:00.011', '2025-08-28 05:08:00.011'),
(10, 'Chandeliers', '2025-08-28 05:08:22.805', '2025-08-28 05:08:22.805'),
(11, 'sofas', '2025-08-29 05:06:33.404', '2025-08-29 05:06:33.404'),
(12, 'luxury', '2025-08-29 09:42:23.279', '2025-08-29 09:42:23.279'),
(13, 'chandlier light', '2025-09-01 06:15:41.334', '2025-09-01 06:15:41.334'),
(14, 'Sleepwell', '2025-09-01 07:30:55.712', '2025-09-01 07:30:55.712'),
(15, 'Juan Grey Aluminium Hanging Light', '2025-09-01 07:31:18.854', '2025-09-01 07:31:18.854'),
(16, 'light', '2025-09-01 18:33:57.574', '2025-09-01 18:33:57.574'),
(17, 'beach', '2025-09-02 17:40:53.464', '2025-09-02 17:40:53.464'),
(18, 'Hanging', '2025-09-02 17:41:58.693', '2025-09-02 17:41:58.693'),
(19, 'steel', '2025-09-16 19:09:23.990', '2025-09-16 19:09:23.990'),
(20, 'water', '2025-09-16 19:09:34.574', '2025-09-16 19:09:34.574');

-- --------------------------------------------------------

--
-- Table structure for table `main_category_promotions`
--

DROP TABLE IF EXISTS `main_category_promotions`;
CREATE TABLE IF NOT EXISTS `main_category_promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `displayCount` int NOT NULL,
  `priority` int NOT NULL,
  `imageUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `showTitle` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `main_category_promotions`
--

INSERT INTO `main_category_promotions` (`id`, `title`, `displayCount`, `priority`, `imageUrl`, `status`, `createdAt`, `showTitle`) VALUES
(1, 'New Arrivals', 3, 2, '1756153583260-139065550.PNG', 1, '2025-08-25 20:26:23.445', 0),
(2, 'Trending', 5, 4, '1756190463916-565915086.jpg', 1, '2025-08-26 06:41:04.509', 1),
(3, 'Deals of the Day', 5, 3, '1756204488512-399478759.png', 1, '2025-08-26 10:34:48.930', 1),
(5, 'Offers', 4, 1, '1756965811639-113137158.png', 1, '2025-08-28 07:55:44.344', 0);

-- --------------------------------------------------------

--
-- Table structure for table `main_product_promotions`
--

DROP TABLE IF EXISTS `main_product_promotions`;
CREATE TABLE IF NOT EXISTS `main_product_promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int NOT NULL DEFAULT '0',
  `mainCategoryPromotionId` int NOT NULL,
  `imageUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` int NOT NULL,
  `brandId` int DEFAULT NULL,
  `seller` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minPrice` double DEFAULT NULL,
  `maxPrice` double DEFAULT NULL,
  `offerPercentFrom` double DEFAULT NULL,
  `offerPercentTo` double DEFAULT NULL,
  `seoTitle` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDescription` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoKeywords` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `main_product_promotions_mainCategoryPromotionId_idx` (`mainCategoryPromotionId`),
  KEY `main_product_promotions_categoryId_fkey` (`categoryId`),
  KEY `main_product_promotions_brandId_fkey` (`brandId`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `main_product_promotions`
--

INSERT INTO `main_product_promotions` (`id`, `title`, `priority`, `mainCategoryPromotionId`, `imageUrl`, `categoryId`, `brandId`, `seller`, `minPrice`, `maxPrice`, `offerPercentFrom`, `offerPercentTo`, `seoTitle`, `seoDescription`, `seoKeywords`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Summer Sale', 4, 1, '1756153668380-517241798.jpg', 277, NULL, 'Infinity', 5000, 25000, 10, 30, 'Summer Sale on Sofas', 'Big savings on sofas this summer.', 'sofa, summer sale, discount', 0, '2025-08-25 20:27:48.396', '2025-08-26 12:42:48.374'),
(2, 'Summer Sale', 6, 1, '1756182041355-395789788.jpg', 277, NULL, 'Infinity', 5000, 25000, 10, 30, 'Summer Sale on Sofas', 'Big savings on sofas this summer.', 'sofa, summer sale, discount', 0, '2025-08-26 04:20:41.786', '2025-08-28 04:33:38.377'),
(3, 'Summer Sale', 3, 1, '1756186565214-538459374.jpg', 268, NULL, 'Infinity', 5000, 25000, 10, 30, 'Summer Sale on Sofas', 'Big savings on sofas this summer.', 'sofa, summer sale, discount', 0, '2025-08-26 05:36:05.913', '2025-08-28 04:33:29.881'),
(4, 'Summer Sale', 2, 1, '1756189725956-600999170.jpg', 268, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-08-26 06:28:46.719', '2025-08-28 04:33:25.273'),
(5, 'check', 1, 1, '1756194253869-610440200.jpg', 222, 23, 'seller1', 1000, 5000, 10, 20, 'seo', 'cdfced', 'gvrdge', 0, '2025-08-26 07:44:14.490', '2025-08-28 04:33:20.321'),
(6, 'promotion2', 5, 2, '1756200199373-343381752.png', 242, 23, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-08-26 09:23:19.826', '2025-08-28 04:33:34.178'),
(7, 'new arrivals section1', 1, 1, '1756355671107-522125385.jpg', 222, 23, 'seller1', 1000, 5000, 10, 20, 'seo', 'seo', 'sec', 0, '2025-08-28 04:34:31.563', '2025-08-28 05:51:36.444'),
(8, 'new section2', 2, 1, '1756358326440-951755843.jpg', 222, 23, 'seller2', 1500, 5000, 10, 20, 'seo', 'sec', 'ser', 0, '2025-08-28 05:18:46.665', '2025-08-28 05:51:36.444'),
(9, 'new setion3', 3, 1, '1756358434531-150040201.png', 223, 23, 'seller3', 5000, 10000, 10, 20, 'seo', 'seu', 'gbrhr', 0, '2025-08-28 05:20:34.652', '2025-08-28 05:51:36.444'),
(10, 'trending1', 1, 2, '1756359484898-456728047.png', 247, 23, 'seller1', 1000, 10000, 5, 15, 'seo', 'njmygj', 'hnb gfjnbhyt', 1, '2025-08-28 05:38:05.169', '2025-08-28 05:38:05.169'),
(11, 'trending2', 2, 2, '1756359616893-269528451.png', 174, 23, 'seller2', 800, 8600, 1, 2, 'seo', 'c dxew', 'fve', 1, '2025-08-28 05:40:17.399', '2025-08-28 05:40:17.399'),
(12, 'trending 3', 3, 2, '1756359916225-10939399.png', 191, 23, 'seller3', 5000, 10000, 6, 15, 'seo', 'seb', 'ser', 1, '2025-08-28 05:45:16.637', '2025-08-28 05:45:16.637'),
(13, 'trending4', 4, 2, '1756360091524-190199423.png', 204, 23, 'seller4', 200, 5200, 5, 10, 'seo', 'seo', 'aser', 1, '2025-08-28 05:48:11.883', '2025-08-28 05:48:11.883'),
(14, 'trending5', 5, 2, '1756360148460-107608576.png', 213, 23, 'seller5', 500, 1500, 1, 10, 'ers', 'sfer', 'grg54', 1, '2025-08-28 05:49:08.880', '2025-08-28 05:49:08.880'),
(15, 'deals1', 1, 3, '1756360209449-246298805.png', 233, 23, 'seller1', 2000, 3000, 1, 10, 'seo', 'cfew', 'dw3', 1, '2025-08-28 05:50:10.053', '2025-08-28 05:50:10.053'),
(16, 'deals2', 2, 3, '1756360274444-589552519.jpg', 227, 23, 'seller2', 9000, 15000, 6, 20, 'seo', 'jyhyt', 'czew', 1, '2025-08-28 05:51:14.963', '2025-08-28 05:51:14.963'),
(17, 'deals3', 3, 3, '1756360443787-286909550.png', 175, 23, 'seller3', 80000, 100000, 10, 30, 'seo', 'fcewew', 'fcewfew', 1, '2025-08-28 05:54:04.210', '2025-08-28 05:54:04.210'),
(18, 'new arrival1', 1, 1, '1756360495497-324362067.png', 200, 23, 'seller1', 6000, 18000, 10, 20, 'seoghyjhnty', 'fhbty', 'hnbyvtr', 1, '2025-08-28 05:54:55.653', '2025-08-28 05:54:55.653'),
(19, 'new arrival 2', 2, 1, '1756360542500-414784353.png', 238, 23, 'seller2', 1000, 3000, 10, 15, 'seoghyjhnty', 'tyt', 'hty', 1, '2025-08-28 05:55:42.798', '2025-08-28 05:55:42.798'),
(20, 'new arrival 3', 3, 1, '1756360594313-645884581.png', 244, 23, 'seller3', 9000, 15000, 2, 8, 'seo', 'seo', 'seo', 1, '2025-08-28 05:56:34.743', '2025-08-28 05:56:34.743'),
(21, 'deals4', 4, 3, '1756365143259-316814785.jpg', 219, 23, 'seller4', 100, 1000, 3, 6, 'seo', 'seo', 'seo', 0, '2025-08-28 07:12:23.774', '2025-08-28 12:15:05.885'),
(22, 'deals5', 5, 3, '1756365191997-607380363.png', 247, 23, 'seller5', 5000, 15000, 3, 10, 'seo', 'sewo', 'seo', 1, '2025-08-28 07:13:12.379', '2025-08-28 07:13:12.379'),
(23, 'offers1', 1, 5, '1756372680133-17952241.png', 190, 23, 'seller1', 12000, 25000, 1, 8, 'seo', 'seo', 'ser', 1, '2025-08-28 09:18:00.385', '2025-08-28 09:18:06.528'),
(24, 'offer2', 2, 5, '1756372764439-78195792.png', 247, 23, 'seller2', 600, 7400, 3, 30, 'seo', 'ser', 'sefe', 1, '2025-08-28 09:19:24.505', '2025-08-28 09:19:24.505'),
(25, 'offer3', 3, 5, '1756372844616-894872924.png', 195, 23, 'seller3', 1000, 50000, 10, 25, 'seo', 'xscds', 'dcw', 1, '2025-08-28 09:20:44.941', '2025-08-28 09:20:44.941'),
(26, 'offer4', 4, 5, '1756372913376-743298888.png', 177, 23, 'seller4', 600, 9000, 10, 15, 'seo', 'xdzw', 'dw', 1, '2025-08-28 09:21:53.571', '2025-08-28 09:21:53.571'),
(27, 'deals4', 4, 3, '1756383360292-39186910.png', 241, 23, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-08-28 12:16:00.695', '2025-08-28 12:16:00.695');

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
CREATE TABLE IF NOT EXISTS `materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `addressId` int DEFAULT NULL,
  `paymentMethod` enum('UPI','COD','CARD','NETBANKING') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `couponId` int DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `subtotal` double NOT NULL,
  `shippingFee` double NOT NULL,
  `gst` double NOT NULL,
  `totalAmount` double NOT NULL,
  `note` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `orderFrom` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'web',
  `couponDiscount` double NOT NULL DEFAULT '0',
  `addressSnapshot` json DEFAULT NULL,
  `platformFee` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_userId_fkey` (`userId`),
  KEY `orders_addressId_fkey` (`addressId`),
  KEY `orders_couponId_fkey` (`couponId`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `userId`, `addressId`, `paymentMethod`, `couponId`, `status`, `subtotal`, `shippingFee`, `gst`, `totalAmount`, `note`, `createdAt`, `updatedAt`, `orderFrom`, `couponDiscount`, `addressSnapshot`, `platformFee`) VALUES
(4, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-06 11:21:54.439', '2025-08-07 04:55:25.021', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(5, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-06 11:23:19.121', '2025-08-07 04:55:30.172', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(21, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-07 05:18:18.115', '2025-08-07 05:18:18.115', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(22, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-07 05:18:59.972', '2025-08-07 05:18:59.972', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(23, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-07 05:31:33.007', '2025-08-07 05:31:33.007', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(24, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-07 05:31:35.495', '2025-08-07 05:31:35.495', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(25, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-07 05:50:57.997', '2025-08-07 05:50:57.997', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(26, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-07 05:55:41.412', '2025-08-07 05:55:41.412', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(27, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-07 06:14:58.046', '2025-08-07 06:14:58.046', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(28, 1, 4, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-07 06:15:13.273', '2025-08-07 06:15:13.273', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(29, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-07 06:40:36.533', '2025-08-07 06:40:36.533', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(30, 1, 4, 'COD', NULL, 'PENDING', 12060, 80, 0, 11160, 'Leave at door', '2025-08-07 09:32:16.426', '2025-08-07 09:32:16.426', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(31, 1, 4, 'COD', NULL, 'PENDING', 12060, 80, 0, 11160, 'Leave at door', '2025-08-07 10:10:53.221', '2025-08-07 10:10:53.221', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(32, 1, 4, 'COD', NULL, 'PENDING', 12060, 80, 0, 11160, 'Leave at door', '2025-08-07 10:18:09.613', '2025-08-07 10:18:09.613', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(33, 1, 4, 'COD', NULL, 'PENDING', 12060, 80, 0, 11160, 'Leave at door', '2025-08-07 10:21:04.832', '2025-08-07 10:21:04.832', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(34, 1, 4, 'COD', NULL, 'PENDING', 12060, 80, 0, 11160, 'Leave at door', '2025-08-07 10:28:20.440', '2025-08-07 10:28:20.440', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(35, 1, 4, 'COD', NULL, 'PENDING', 0, 80, 0, -900, 'Leave at door', '2025-08-07 10:42:11.838', '2025-08-07 10:42:11.838', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(36, 1, 4, 'COD', NULL, 'PENDING', 14997, 80, 0, 14097, 'Leave at door', '2025-08-07 10:54:48.887', '2025-08-07 10:54:48.887', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(37, 1, 4, 'COD', NULL, 'PENDING', 16499, 80, 0, 16599, 'Leave at door', '2025-08-08 09:34:32.132', '2025-08-08 09:34:32.132', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(38, 1, 4, 'COD', NULL, 'PENDING', 16499, 80, 0, 16599, 'Leave at door', '2025-08-08 09:35:37.287', '2025-08-08 09:35:37.287', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(39, 1, 4, 'COD', NULL, 'PENDING', 16499, 80, 0, 16599, 'Leave at door', '2025-08-09 05:31:44.392', '2025-08-09 05:31:44.392', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(40, 1, 4, 'COD', NULL, 'PENDING', 16499, 80, 0, 16599, 'Delivered to security at gate', '2025-08-09 05:34:58.320', '2025-08-19 12:18:06.397', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(41, 1, 4, 'COD', NULL, 'PENDING', 27999, 80, 0, 28099, 'Leave at door', '2025-08-09 07:48:16.524', '2025-08-09 07:48:16.524', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(42, 1, 1, 'COD', 6, 'PENDING', 25466, 80, 4556.88, 25416, 'Leave at door', '2025-08-11 17:56:00.098', '2025-08-11 17:56:00.098', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(43, 1, 1, 'COD', 6, 'PENDING', 25466, 80, 4556.88, 25416, 'Leave at door', '2025-08-14 05:47:40.253', '2025-08-14 05:47:40.253', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(44, 3, 13, 'COD', NULL, 'PENDING', 8560, 80, 0, 8660, 'Leave at door', '2025-08-14 11:04:20.777', '2025-08-14 11:04:20.777', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(45, 1, 1, 'COD', 6, 'PENDING', 25466, 80, 4556.88, 25416, 'Leave at door', '2025-08-14 12:25:56.113', '2025-08-14 12:25:56.113', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(46, 1, 4, 'COD', NULL, 'PENDING', 13632, 80, 0, 13732, 'Leave at door', '2025-08-14 12:54:17.075', '2025-08-14 12:54:17.075', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(47, 1, 4, 'COD', NULL, 'PENDING', 5896, 80, 0, 5996, 'Leave at door', '2025-08-14 12:54:31.407', '2025-08-14 12:54:31.407', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(48, 1, 4, 'COD', NULL, 'PENDING', 6982, 80, 0, 7082, 'Leave at door', '2025-08-14 13:18:28.900', '2025-08-14 13:18:28.900', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(49, 1, 4, 'COD', NULL, 'PENDING', 6682, 80, 0, 6782, 'Leave at door', '2025-08-14 13:18:58.495', '2025-08-14 13:18:58.495', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(50, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-14 13:23:34.973', '2025-08-14 13:23:34.973', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(51, 1, 4, 'COD', 4, 'PENDING', 6982, 80, 1202.76, 6782, 'Leave at door', '2025-08-14 13:29:30.209', '2025-08-14 13:29:30.209', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(52, 1, 4, 'COD', NULL, 'PENDING', 13632, 80, 0, 13732, 'Leave at door', '2025-08-14 13:30:53.156', '2025-08-14 13:30:53.156', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(53, 1, 4, 'COD', NULL, 'CANCELLED', 3500, 80, 630, 3600, 'Leave at door', '2025-08-14 13:31:13.733', '2025-08-20 10:32:22.982', 'web', 0, '{\"id\": 4, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Office\", \"phone\": \"9880018896\", \"state\": \"Karnataka\", \"default\": 1, \"pincode\": \"560068\", \"createdAt\": \"2025-08-05T09:45:38Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(54, 3, 14, 'COD', NULL, 'PENDING', 780, 80, 140.4, 880, 'Leave at door', '2025-08-18 10:57:15.771', '2025-08-18 10:57:15.771', 'web', 0, '{\"id\": 14, \"city\": \"Hyderābād\", \"name\": \"Chaitanya Nelluri\", \"label\": \"Office\", \"phone\": \"9880018778\", \"state\": \"Telangana\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-14T05:46:13Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(55, 3, 13, 'COD', NULL, 'PENDING', 16499, 80, 0, 16599, 'Leave at door', '2025-08-19 06:20:52.983', '2025-08-19 06:20:52.983', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(56, 3, 14, 'COD', NULL, 'CANCELLED', 19035, 80, 0, 19135, 'Leave at door', '2025-08-19 12:03:04.136', '2025-08-20 09:00:40.617', 'web', 0, '{\"id\": 14, \"city\": \"Hyderābād\", \"name\": \"Chaitanya Nelluri\", \"label\": \"Office\", \"phone\": \"9880018778\", \"state\": \"Telangana\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-14T05:46:13Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(57, 3, 13, 'COD', NULL, 'PENDING', 19035, 80, 0, 19135, 'Leave at door', '2025-08-20 09:03:01.207', '2025-08-20 09:03:01.207', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(58, 3, 14, 'COD', NULL, 'PENDING', 3500, 80, 630, 3600, 'Leave at door', '2025-08-20 12:13:09.371', '2025-08-20 12:13:09.371', 'web', 0, '{\"id\": 14, \"city\": \"Hyderābād\", \"name\": \"Chaitanya Nelluri\", \"label\": \"Office\", \"phone\": \"9880018778\", \"state\": \"Telangana\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-14T05:46:13Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(59, 3, 13, 'UPI', NULL, 'PENDING', 35061, 80, 0, 35161, 'Leave at door', '2025-08-21 10:11:57.104', '2025-08-21 10:11:57.104', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(60, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:13:30.290', '2025-08-21 10:13:30.290', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(61, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:15:04.062', '2025-08-21 10:15:04.062', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(62, 1, 1, 'COD', NULL, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-08-21 10:16:13.308', '2025-08-21 10:16:13.308', 'web', 0, '{\"id\": 1, \"city\": \"Mumbai\", \"name\": \"Amit Sharma\", \"label\": \"Other\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-05T06:07:39Z\", \"updatedAt\": \"2025-08-07T06:13:01Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(63, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:17:33.280', '2025-08-21 10:17:33.280', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(64, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:20:21.977', '2025-08-21 10:20:21.977', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(65, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:29:08.291', '2025-08-21 10:29:08.291', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(66, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:34:55.707', '2025-08-21 10:34:55.707', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(67, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:36:37.676', '2025-08-21 10:36:37.676', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(68, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:50:22.956', '2025-08-21 10:50:22.956', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(69, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:51:08.520', '2025-08-21 10:51:08.520', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(70, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:51:23.977', '2025-08-21 10:51:23.977', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(71, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:51:55.676', '2025-08-21 10:51:55.676', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(72, 3, 13, 'UPI', NULL, 'PENDING', 35961, 80, 0, 36061, 'Leave at door', '2025-08-21 10:52:29.454', '2025-08-21 10:52:29.454', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(73, 3, 13, 'UPI', NULL, 'PENDING', 3200, 80, 0, 3300, 'Leave at door', '2025-08-21 11:33:56.341', '2025-08-21 11:33:56.341', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(74, 3, 13, 'UPI', NULL, 'PENDING', 5596, 80, 0, 5696, 'Leave at door', '2025-08-21 12:15:18.435', '2025-08-21 12:15:18.435', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(75, 3, 13, 'COD', NULL, 'PENDING', 19623, 80, 3532.14, 19723, 'Leave at door', '2025-08-21 12:17:53.902', '2025-08-21 12:17:53.902', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(76, 3, 13, 'COD', NULL, 'PENDING', 8560, 80, 1540.8, 8660, 'Leave at door', '2025-08-21 12:27:29.165', '2025-08-21 12:27:29.165', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(77, 3, 13, 'COD', 4, 'PENDING', 3644, 80, 601.92, 3444, 'Leave at door', '2025-08-21 12:34:33.722', '2025-08-21 12:34:33.722', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(78, 3, 13, 'UPI', NULL, 'PENDING', 2236, 80, 0, 2336, 'Leave at door', '2025-08-21 12:50:54.721', '2025-08-21 12:50:54.721', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(79, 3, 13, 'COD', 4, 'PENDING', 10500, 80, 1836, 10300, 'Leave at door', '2025-08-22 07:08:51.306', '2025-08-22 07:08:51.306', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(80, 3, 14, 'UPI', NULL, 'PENDING', 41822, 80, 0, 41922, 'Leave at door', '2025-09-02 12:34:29.543', '2025-09-02 12:34:29.543', 'web', 0, '{\"id\": 14, \"city\": \"Hyderābād\", \"name\": \"Chaitanya Nelluri\", \"label\": \"Office\", \"phone\": \"9880018778\", \"state\": \"Telangana\", \"default\": 0, \"pincode\": \"400001\", \"createdAt\": \"2025-08-14T05:46:13Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"Flat 105\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"Sunshine Apartments\"}', NULL),
(81, 3, 13, 'UPI', NULL, 'PENDING', 46545, 80, 0, 46645, 'Leave at door', '2025-09-03 10:33:23.450', '2025-09-03 10:33:23.450', 'web', 0, '{\"id\": 13, \"city\": \"Bangalore Urban\", \"name\": \"Pakki\", \"label\": \"Home\", \"phone\": \"9880018732\", \"state\": \"Karnataka\", \"default\": 0, \"pincode\": \"560068\", \"createdAt\": \"2025-08-14T05:45:29Z\", \"updatedAt\": \"2025-09-03T10:13:57Z\", \"flatNumber\": \"305\", \"addressLine1\": \"akshyanagar\", \"addressLine2\": \"Bangalore\", \"buildingName\": \"SLV Samskurthi apt\"}', NULL),
(82, 11, NULL, 'COD', 4, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-09-08 17:49:37.191', '2025-09-08 17:49:37.191', 'web', 0, '{\"id\": 17, \"city\": \"Mumbai\", \"name\": \"Amit Sharma Updated\", \"label\": \"Office\", \"phone\": \"9876543211\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400002\", \"createdAt\": \"2025-09-08T17:48:54Z\", \"updatedAt\": \"2025-09-13T07:27:11Z\", \"flatNumber\": \"102\", \"addressLine1\": \"MG Road Updated\", \"addressLine2\": \"Near Metro\", \"buildingName\": \"Updated Apartments\"}', NULL),
(83, 11, NULL, 'COD', 4, 'PENDING', 900, 50, 162, 1112, 'Leave at door', '2025-09-08 17:50:26.812', '2025-09-08 17:50:26.812', 'web', 0, '{\"id\": 17, \"city\": \"Mumbai\", \"name\": \"Amit Sharma Updated\", \"label\": \"Office\", \"phone\": \"9876543211\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400002\", \"createdAt\": \"2025-09-08T17:48:54Z\", \"updatedAt\": \"2025-09-13T07:27:11Z\", \"flatNumber\": \"102\", \"addressLine1\": \"MG Road Updated\", \"addressLine2\": \"Near Metro\", \"buildingName\": \"Updated Apartments\"}', NULL),
(84, 11, NULL, 'COD', 4, 'PENDING', 9000, 50, 162, 1112, 'Leave at door', '2025-09-08 17:52:39.906', '2025-09-08 17:52:39.906', 'web', 0, '{\"id\": 17, \"city\": \"Mumbai\", \"name\": \"Amit Sharma Updated\", \"label\": \"Office\", \"phone\": \"9876543211\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400002\", \"createdAt\": \"2025-09-08T17:48:54Z\", \"updatedAt\": \"2025-09-13T07:27:11Z\", \"flatNumber\": \"102\", \"addressLine1\": \"MG Road Updated\", \"addressLine2\": \"Near Metro\", \"buildingName\": \"Updated Apartments\"}', NULL),
(85, 11, NULL, 'COD', 4, 'PENDING', 9000, 50, 162, 1112, 'Leave at door', '2025-09-08 17:58:16.790', '2025-09-08 17:58:16.790', 'web', 0, '{\"id\": 17, \"city\": \"Mumbai\", \"name\": \"Amit Sharma Updated\", \"label\": \"Office\", \"phone\": \"9876543211\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400002\", \"createdAt\": \"2025-09-08T17:48:54Z\", \"updatedAt\": \"2025-09-13T07:27:11Z\", \"flatNumber\": \"102\", \"addressLine1\": \"MG Road Updated\", \"addressLine2\": \"Near Metro\", \"buildingName\": \"Updated Apartments\"}', NULL),
(86, 11, NULL, 'COD', 4, 'PENDING', 9000, 50, 162, 1112, 'Leave at door', '2025-09-08 18:00:20.413', '2025-09-08 18:00:20.413', 'web', 300, '{\"id\": 17, \"city\": \"Mumbai\", \"name\": \"Amit Sharma Updated\", \"label\": \"Office\", \"phone\": \"9876543211\", \"state\": \"Maharashtra\", \"default\": 0, \"pincode\": \"400002\", \"createdAt\": \"2025-09-08T17:48:54Z\", \"updatedAt\": \"2025-09-13T07:27:11Z\", \"flatNumber\": \"102\", \"addressLine1\": \"MG Road Updated\", \"addressLine2\": \"Near Metro\", \"buildingName\": \"Updated Apartments\"}', NULL),
(87, 11, 19, 'UPI', NULL, 'PENDING', 23512, 970, 0, 24512, 'Leave at door', '2025-09-16 18:43:28.062', '2025-09-16 18:43:28.062', 'web', 0, '{\"id\": 19, \"city\": \"Mumbai\", \"name\": \"Kiran Sharma\", \"label\": \"Office\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": true, \"pincode\": \"400001\", \"createdAt\": \"2025-09-13T09:06:36.890Z\", \"updatedAt\": \"2025-09-13T09:07:00.275Z\", \"flatNumber\": \"Flat 101\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"RIchlabz Apartments\"}', NULL),
(88, 11, 19, 'UPI', NULL, 'PENDING', 5200, 300, 0, 5530, 'Leave at door', '2025-09-16 18:44:53.189', '2025-09-16 18:44:53.189', 'web', 0, '{\"id\": 19, \"city\": \"Mumbai\", \"name\": \"Kiran Sharma\", \"label\": \"Office\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": true, \"pincode\": \"400001\", \"createdAt\": \"2025-09-13T09:06:36.890Z\", \"updatedAt\": \"2025-09-13T09:07:00.275Z\", \"flatNumber\": \"Flat 101\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"RIchlabz Apartments\"}', NULL),
(89, 11, 19, 'UPI', NULL, 'PENDING', 4160, 300, 0, 4490, 'Leave at door', '2025-09-16 18:50:21.440', '2025-09-16 18:50:21.440', 'web', 0, '{\"id\": 19, \"city\": \"Mumbai\", \"name\": \"Kiran Sharma\", \"label\": \"Office\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": true, \"pincode\": \"400001\", \"createdAt\": \"2025-09-13T09:06:36.890Z\", \"updatedAt\": \"2025-09-13T09:07:00.275Z\", \"flatNumber\": \"Flat 101\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"RIchlabz Apartments\"}', NULL),
(90, 11, 19, 'UPI', NULL, 'PENDING', 2300, 300, 0, 2630, 'Leave at door', '2025-09-16 18:55:08.786', '2025-09-16 18:55:08.786', 'web', 0, '{\"id\": 19, \"city\": \"Mumbai\", \"name\": \"Kiran Sharma\", \"label\": \"Office\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": true, \"pincode\": \"400001\", \"createdAt\": \"2025-09-13T09:06:36.890Z\", \"updatedAt\": \"2025-09-13T09:07:00.275Z\", \"flatNumber\": \"Flat 101\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"RIchlabz Apartments\"}', NULL),
(91, 11, 19, 'UPI', NULL, 'PENDING', 2300, 300, 0, 2630, 'Leave at door', '2025-09-16 18:57:14.645', '2025-09-16 18:57:14.645', 'web', 0, '{\"id\": 19, \"city\": \"Mumbai\", \"name\": \"Kiran Sharma\", \"label\": \"Office\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": true, \"pincode\": \"400001\", \"createdAt\": \"2025-09-13T09:06:36.890Z\", \"updatedAt\": \"2025-09-13T09:07:00.275Z\", \"flatNumber\": \"Flat 101\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"RIchlabz Apartments\"}', NULL),
(92, 11, 19, 'UPI', NULL, 'PENDING', 2300, 300, 0, 2630, 'Leave at door', '2025-09-16 19:55:30.359', '2025-09-16 19:55:30.359', 'web', 0, '{\"id\": 19, \"city\": \"Mumbai\", \"name\": \"Kiran Sharma\", \"label\": \"Office\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": true, \"pincode\": \"400001\", \"createdAt\": \"2025-09-13T09:06:36.890Z\", \"updatedAt\": \"2025-09-13T09:07:00.275Z\", \"flatNumber\": \"Flat 101\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"RIchlabz Apartments\"}', 30),
(93, 11, 19, 'UPI', NULL, 'PENDING', 2300, 300, 0, 2630, 'Leave at door', '2025-09-16 19:55:54.177', '2025-09-16 19:55:54.177', 'web', 0, '{\"id\": 19, \"city\": \"Mumbai\", \"name\": \"Kiran Sharma\", \"label\": \"Office\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": true, \"pincode\": \"400001\", \"createdAt\": \"2025-09-13T09:06:36.890Z\", \"updatedAt\": \"2025-09-13T09:07:00.275Z\", \"flatNumber\": \"Flat 101\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"RIchlabz Apartments\"}', 30),
(94, 11, 19, 'COD', NULL, 'PENDING', 5200, 300, 936, 5540, 'Leave at door', '2025-09-16 20:04:38.356', '2025-09-16 20:04:38.356', 'web', 0, '{\"id\": 19, \"city\": \"Mumbai\", \"name\": \"Kiran Sharma\", \"label\": \"Office\", \"phone\": \"9876543210\", \"state\": \"Maharashtra\", \"default\": true, \"pincode\": \"400001\", \"createdAt\": \"2025-09-13T09:06:36.890Z\", \"updatedAt\": \"2025-09-13T09:07:00.275Z\", \"flatNumber\": \"Flat 101\", \"addressLine1\": \"Sector 15, MG Road\", \"addressLine2\": \"Near Apollo Hospital\", \"buildingName\": \"RIchlabz Apartments\"}', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int DEFAULT NULL,
  `variantId` int DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` double NOT NULL,
  `total` double NOT NULL,
  `moderationNote` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','CANCEL_REQUESTED','APPROVED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  KEY `order_items_orderId_fkey` (`orderId`),
  KEY `order_items_variantId_fkey` (`variantId`),
  KEY `order_items_productId_fkey` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `orderId`, `productId`, `variantId`, `quantity`, `price`, `total`, `moderationNote`, `status`) VALUES
(15, 21, 163, 225, 2, 450, 900, NULL, 'PENDING'),
(16, 22, 168, NULL, 2, 450, 900, NULL, 'PENDING'),
(17, 23, 168, NULL, 2, 450, 900, NULL, 'PENDING'),
(18, 24, 168, NULL, 2, 450, 900, NULL, 'PENDING'),
(19, 25, 167, NULL, 2, 450, 900, NULL, 'PENDING'),
(20, 26, 167, NULL, 2, 450, 900, NULL, 'PENDING'),
(21, 27, 167, NULL, 2, 450, 900, NULL, 'PENDING'),
(22, 28, 167, NULL, 2, 450, 900, NULL, 'PENDING'),
(23, 29, 167, NULL, 2, 450, 900, NULL, 'PENDING'),
(24, 30, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(25, 30, 166, NULL, 1, 3500, 3500, NULL, 'PENDING'),
(26, 31, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(27, 31, 166, NULL, 1, 3500, 3500, NULL, 'PENDING'),
(28, 32, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(29, 32, 166, NULL, 1, 3500, 3500, NULL, 'PENDING'),
(30, 33, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(31, 33, 166, NULL, 1, 3500, 3500, NULL, 'PENDING'),
(32, 34, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(33, 34, 166, NULL, 1, 3500, 3500, NULL, 'PENDING'),
(34, 36, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(35, 37, 164, NULL, 1, 4999, 4999, NULL, 'PENDING'),
(36, 37, 167, NULL, 1, 11500, 11500, NULL, 'PENDING'),
(37, 38, 164, NULL, 1, 4999, 4999, NULL, 'PENDING'),
(38, 38, 167, NULL, 1, 11500, 11500, NULL, 'PENDING'),
(39, 39, 164, NULL, 1, 4999, 4999, NULL, 'PENDING'),
(40, 39, 167, NULL, 1, 11500, 11500, NULL, 'PENDING'),
(41, 40, 164, NULL, 1, 4999, 4999, 'Order by Mistake', 'CANCEL_REQUESTED'),
(42, 40, 167, NULL, 1, 11500, 11500, NULL, 'PENDING'),
(43, 41, 164, NULL, 1, 4999, 4999, NULL, 'PENDING'),
(44, 41, 167, NULL, 2, 11500, 23000, NULL, 'PENDING'),
(45, 42, 164, NULL, 1, 25466, 25466, NULL, 'PENDING'),
(46, 43, 164, NULL, 1, 25466, 25466, NULL, 'PENDING'),
(47, 44, 164, NULL, 1, 4999, 4999, NULL, 'PENDING'),
(48, 44, 167, NULL, 1, 11500, 11500, NULL, 'PENDING'),
(49, 45, 164, NULL, 1, 25466, 25466, NULL, 'PENDING'),
(50, 46, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(51, 46, 167, NULL, 2, 2536, 5072, NULL, 'PENDING'),
(52, 47, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(53, 47, 167, NULL, 2, 2536, 5072, NULL, 'PENDING'),
(54, 48, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(55, 48, 167, NULL, 2, 2536, 5072, NULL, 'PENDING'),
(56, 49, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(57, 49, 167, NULL, 2, 2536, 5072, NULL, 'PENDING'),
(58, 50, 168, NULL, 2, 450, 900, NULL, 'PENDING'),
(59, 51, 165, NULL, 1, 6982, 6982, NULL, 'PENDING'),
(60, 52, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(61, 52, 167, NULL, 2, 2536, 5072, NULL, 'PENDING'),
(62, 53, 166, NULL, 1, 3500, 3500, NULL, 'CANCELLED'),
(63, 54, 166, NULL, 1, 780, 780, 'Approved by admin', 'APPROVED'),
(64, 55, 164, NULL, 1, 4999, 4999, NULL, 'PENDING'),
(65, 55, 167, NULL, 1, 11500, 11500, NULL, 'PENDING'),
(66, 56, 164, NULL, 1, 4999, 4999, 'vgdrgre', 'CANCELLED'),
(67, 56, 167, NULL, 1, 2536, 2536, 'not reuiered', 'CANCELLED'),
(68, 56, 167, NULL, 1, 11500, 11500, 'gv fcbf', 'CANCELLED'),
(69, 57, 164, NULL, 1, 4999, 4999, 'not required anymore', 'CANCELLED'),
(70, 57, 167, NULL, 1, 2536, 2536, 'Approved by admin', 'APPROVED'),
(71, 57, 167, NULL, 1, 11500, 11500, NULL, 'PENDING'),
(72, 58, 166, NULL, 1, 3500, 3500, 'fsfs', 'CANCEL_REQUESTED'),
(73, 59, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(74, 59, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(75, 59, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(76, 60, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(77, 60, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(78, 60, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(79, 61, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(80, 61, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(81, 61, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(82, 62, 165, NULL, 2, 450, 900, NULL, 'PENDING'),
(83, 63, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(84, 63, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(85, 63, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(86, 64, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(87, 64, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(88, 64, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(89, 65, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(90, 65, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(91, 65, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(92, 66, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(93, 66, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(94, 66, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(95, 67, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(96, 67, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(97, 67, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(98, 68, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(99, 68, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(100, 68, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(101, 69, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(102, 69, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(103, 69, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(104, 70, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(105, 70, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(106, 70, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(107, 71, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(108, 71, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(109, 71, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(110, 72, 164, NULL, 3, 4999, 14997, NULL, 'PENDING'),
(111, 72, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(112, 72, 166, NULL, 2, 3500, 7000, NULL, 'PENDING'),
(113, 73, 166, NULL, 1, 3500, 3500, 'Approved by admin', 'APPROVED'),
(114, 74, 165, NULL, 1, 5896, 5896, 'cvcdvdg', 'CANCEL_REQUESTED'),
(115, 75, 167, NULL, 1, 19623, 19623, NULL, 'PENDING'),
(116, 76, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(117, 77, 165, NULL, 1, 3644, 3644, NULL, 'PENDING'),
(118, 78, 167, NULL, 1, 2536, 2536, NULL, 'PENDING'),
(119, 79, 166, NULL, 3, 3500, 10500, NULL, 'PENDING'),
(120, 80, 164, NULL, 2, 4999, 9998, NULL, 'PENDING'),
(121, 80, 165, NULL, 1, 8560, 8560, NULL, 'PENDING'),
(122, 80, 165, NULL, 2, 6982, 13964, NULL, 'PENDING'),
(123, 80, 166, NULL, 2, 3500, 7000, 'changed mind', 'CANCEL_REQUESTED'),
(124, 80, 173, 269, 1, 2300, 2300, 'Approved by admin', 'APPROVED'),
(125, 81, 164, NULL, 1, 4999, 4999, NULL, 'PENDING'),
(126, 81, 167, 263, 2, 19623, 39246, NULL, 'PENDING'),
(127, 81, 173, 269, 1, 2300, 2300, NULL, 'PENDING'),
(128, 82, 165, NULL, 2, 450, 900, NULL, 'PENDING'),
(129, 83, 165, NULL, 20, 450, 9000, NULL, 'PENDING'),
(130, 84, 165, NULL, 20, 450, 9000, NULL, 'PENDING'),
(131, 85, 165, NULL, 20, 450, 9000, NULL, 'PENDING'),
(132, 86, 165, NULL, 20, 450, 9000, NULL, 'PENDING'),
(133, 87, 166, NULL, 1, 3500, 3500, NULL, 'PENDING'),
(134, 87, 166, NULL, 1, 3500, 3500, NULL, 'PENDING'),
(135, 87, 168, NULL, 2, 456, 912, NULL, 'PENDING'),
(136, 87, 173, NULL, 3, 5200, 15600, NULL, 'PENDING'),
(137, 88, 173, NULL, 1, 5200, 5200, NULL, 'PENDING'),
(138, 89, 173, NULL, 1, 5200, 5200, NULL, 'PENDING'),
(139, 90, 173, 269, 1, 2300, 2300, NULL, 'PENDING'),
(140, 91, 173, 269, 1, 2300, 2300, NULL, 'PENDING'),
(141, 92, 173, 269, 1, 2300, 2300, NULL, 'PENDING'),
(142, 93, 173, 269, 1, 2300, 2300, NULL, 'PENDING'),
(143, 94, 173, NULL, 1, 5200, 5200, NULL, 'PENDING');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `method` enum('UPI','COD','CARD','NETBANKING') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED','REFUNDED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `paidAt` datetime(3) DEFAULT NULL,
  `transactionId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_orderId_key` (`orderId`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `orderId`, `method`, `status`, `paidAt`, `transactionId`) VALUES
(1, 4, 'COD', 'PENDING', NULL, NULL),
(2, 5, 'COD', 'PENDING', NULL, NULL),
(3, 21, 'COD', 'PENDING', NULL, NULL),
(4, 22, 'COD', 'PENDING', NULL, NULL),
(5, 23, 'COD', 'PENDING', NULL, NULL),
(6, 24, 'COD', 'PENDING', NULL, NULL),
(7, 25, 'COD', 'PENDING', NULL, NULL),
(8, 26, 'COD', 'PENDING', NULL, NULL),
(9, 27, 'COD', 'PENDING', NULL, NULL),
(10, 28, 'COD', 'PENDING', NULL, NULL),
(11, 29, 'COD', 'PENDING', NULL, NULL),
(12, 30, 'COD', 'PENDING', NULL, NULL),
(13, 31, 'COD', 'PENDING', NULL, NULL),
(14, 32, 'COD', 'PENDING', NULL, NULL),
(15, 33, 'COD', 'PENDING', NULL, NULL),
(16, 34, 'COD', 'PENDING', NULL, NULL),
(17, 35, 'COD', 'PENDING', NULL, NULL),
(18, 36, 'COD', 'PENDING', NULL, NULL),
(19, 37, 'COD', 'PENDING', NULL, NULL),
(20, 38, 'COD', 'PENDING', NULL, NULL),
(21, 39, 'COD', 'PENDING', NULL, NULL),
(22, 40, 'COD', 'SUCCESS', '2025-08-19 12:18:06.406', NULL),
(23, 41, 'COD', 'PENDING', NULL, NULL),
(24, 42, 'COD', 'PENDING', NULL, NULL),
(25, 43, 'COD', 'PENDING', NULL, NULL),
(26, 44, 'COD', 'PENDING', NULL, NULL),
(27, 45, 'COD', 'PENDING', NULL, NULL),
(28, 46, 'COD', 'PENDING', NULL, NULL),
(29, 47, 'COD', 'PENDING', NULL, NULL),
(30, 48, 'COD', 'PENDING', NULL, NULL),
(31, 49, 'COD', 'PENDING', NULL, NULL),
(32, 50, 'COD', 'PENDING', NULL, NULL),
(33, 51, 'COD', 'PENDING', NULL, NULL),
(34, 52, 'COD', 'PENDING', NULL, NULL),
(35, 53, 'COD', 'PENDING', NULL, NULL),
(36, 54, 'COD', 'PENDING', NULL, NULL),
(37, 55, 'COD', 'PENDING', NULL, NULL),
(38, 56, 'COD', 'PENDING', NULL, NULL),
(39, 57, 'COD', 'PENDING', NULL, NULL),
(40, 58, 'COD', 'PENDING', NULL, NULL),
(41, 59, 'UPI', 'PENDING', NULL, NULL),
(42, 60, 'UPI', 'PENDING', NULL, NULL),
(43, 61, 'UPI', 'PENDING', NULL, NULL),
(44, 62, 'COD', 'PENDING', NULL, NULL),
(45, 63, 'UPI', 'PENDING', NULL, NULL),
(46, 64, 'UPI', 'PENDING', NULL, NULL),
(47, 65, 'UPI', 'PENDING', NULL, NULL),
(48, 66, 'UPI', 'PENDING', NULL, NULL),
(49, 67, 'UPI', 'PENDING', NULL, NULL),
(50, 68, 'UPI', 'PENDING', NULL, NULL),
(51, 69, 'UPI', 'PENDING', NULL, NULL),
(52, 70, 'UPI', 'PENDING', NULL, NULL),
(53, 71, 'UPI', 'PENDING', NULL, NULL),
(54, 72, 'UPI', 'PENDING', NULL, NULL),
(55, 73, 'UPI', 'PENDING', NULL, NULL),
(56, 74, 'UPI', 'PENDING', NULL, NULL),
(57, 75, 'COD', 'PENDING', NULL, NULL),
(58, 76, 'COD', 'PENDING', NULL, NULL),
(59, 77, 'COD', 'PENDING', NULL, NULL),
(60, 78, 'UPI', 'PENDING', NULL, NULL),
(61, 79, 'COD', 'PENDING', NULL, NULL),
(62, 80, 'UPI', 'PENDING', NULL, NULL),
(63, 81, 'UPI', 'PENDING', NULL, NULL),
(64, 82, 'COD', 'PENDING', NULL, NULL),
(65, 83, 'COD', 'PENDING', NULL, NULL),
(66, 84, 'COD', 'PENDING', NULL, NULL),
(67, 85, 'COD', 'PENDING', NULL, NULL),
(68, 86, 'COD', 'PENDING', NULL, NULL),
(69, 87, 'UPI', 'PENDING', NULL, NULL),
(70, 88, 'UPI', 'PENDING', NULL, NULL),
(71, 89, 'UPI', 'PENDING', NULL, NULL),
(72, 90, 'UPI', 'PENDING', NULL, NULL),
(73, 91, 'UPI', 'PENDING', NULL, NULL),
(74, 92, 'UPI', 'PENDING', NULL, NULL),
(75, 93, 'UPI', 'PENDING', NULL, NULL),
(76, 94, 'COD', 'PENDING', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pricerange`
--

DROP TABLE IF EXISTS `pricerange`;
CREATE TABLE IF NOT EXISTS `pricerange` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `min` int NOT NULL,
  `max` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PriceRange_label_key` (`label`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pricerange`
--

INSERT INTO `pricerange` (`id`, `label`, `min`, `max`) VALUES
(1, 'Upto 100', 0, 100),
(2, '100-500', 100, 500),
(3, '500-1000', 500, 1000),
(4, '1000-5000', 1000, 5000),
(5, '5000+', 5000, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sku` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brandId` int DEFAULT NULL,
  `categoryId` int NOT NULL,
  `colorId` int DEFAULT NULL,
  `sizeId` int DEFAULT NULL,
  `mrp` double NOT NULL,
  `sellingPrice` double NOT NULL,
  `stock` int NOT NULL,
  `searchKeywords` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_sku_key` (`sku`),
  KEY `products_categoryId_fkey` (`categoryId`),
  KEY `products_colorId_fkey` (`colorId`),
  KEY `products_sizeId_fkey` (`sizeId`),
  KEY `products_brandId_fkey` (`brandId`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `sku`, `title`, `description`, `brandId`, `categoryId`, `colorId`, `sizeId`, `mrp`, `sellingPrice`, `stock`, `searchKeywords`, `status`, `createdAt`, `updatedAt`) VALUES
(163, 'adb98', 'Magnus High Back Office Chair in Cream Colour with Knee Tilt Mechanism', '<p>Magnus High Back Office Chair in Cream Colour with Knee Tilt Mechanism</p>', 23, 241, 24, 14, 84999, 4999, 11, '(Set of 2) 300 ML Blue Drape Multipurpose Ceramic Bowl with Lid', 1, '2025-07-31 05:42:20.711', '2025-07-31 10:00:12.207'),
(164, 'asd456', 'Back Master 8 Inch Cool Gel Foam King Size Mattress', '<p>Back Master 8 Inch Cool Gel Foam King Size MattressBack Master 8 Inch Cool Gel Foam King Size Mattress</p>', 23, 195, 13, 14, 84999, 4999, 11, '(Set of 2) 300 ML Blue Drape Multipurpose Ceramic Bowl with Lid', 1, '2025-07-31 05:57:44.279', '2025-08-30 07:07:02.219'),
(165, 'SKU_CL1', 'Celing lights for living room', '<p>Celing lights for living roomCeling lights for living room</p><p>Celing lights for living room</p>', 23, 222, 27, 18, 10000, 8560, 9, 'Celing lights for living room', 1, '2025-07-31 10:10:52.792', '2025-09-04 22:33:02.709'),
(166, 'hk123', ' Juan Grey Aluminium Hanging LightWishlist icon Juan Grey Aluminium Hanging Light', '<p>Juan GreJuan Grey Aluminium Hanging Lighty Aluminium Hanging Light Juan Grey Aluminium Hanging LightJuan Grey Aluminium Hanging Light</p>', 23, 222, NULL, 14, 4500, 3500, 6, 'Juan Grey Aluminium Hanging Light', 1, '2025-07-31 10:35:27.507', '2025-08-30 07:16:34.792'),
(167, 'SKU_CH1', 'chandlier light', '<p>chandlier lightchandlier lightchandlier light</p>', 23, 223, 26, 18, 25100, 2536, 9, 'chandlier light', 1, '2025-07-31 10:39:05.630', '2025-08-29 13:23:06.454'),
(168, '12345', 'Sleepwell Matress', '<p>Spring Mattress</p>', NULL, 196, 26, 18, 1000, 456, 2535, 'Sleepwell', 1, '2025-08-02 07:49:13.459', '2025-09-01 07:37:12.370'),
(173, 'SKU_OC1', 'Office chairs black', '<p>&nbsp;chais black color for office purpose</p>', 23, 247, 24, 14, 6000, 5200, 9, 'office chairs, office, chairs', 1, '2025-09-02 12:18:29.515', '2025-09-16 20:04:38.375');

-- --------------------------------------------------------

--
-- Table structure for table `product_details`
--

DROP TABLE IF EXISTS `product_details`;
CREATE TABLE IF NOT EXISTS `product_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `model` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `sla` int DEFAULT NULL,
  `deliveryCharges` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_details_productId_key` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_details`
--

INSERT INTO `product_details` (`id`, `productId`, `model`, `weight`, `sla`, `deliveryCharges`) VALUES
(163, 163, 'Model 1', 980, 7, NULL),
(164, 164, 'Model 1', 980, 7, NULL),
(165, 165, 'Model 1', 500, 5, 500),
(166, 166, 'Hanging Lights', 980, 7, NULL),
(167, 167, 'Model 2', 123, 3, 50),
(168, 168, '', 25, 4, 35),
(173, 173, '', 1500, 3, 300);

-- --------------------------------------------------------

--
-- Table structure for table `product_features`
--

DROP TABLE IF EXISTS `product_features`;
CREATE TABLE IF NOT EXISTS `product_features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `featureListId` int NOT NULL,
  `value` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_features_productId_featureListId_key` (`productId`,`featureListId`),
  KEY `product_features_featureListId_fkey` (`featureListId`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_features`
--

INSERT INTO `product_features` (`id`, `productId`, `featureListId`, `value`) VALUES
(110, 163, 7, 'Sofa'),
(111, 163, 6, 'Sofa'),
(112, 163, 9, 'ASD'),
(113, 164, 6, 'Top-Grain Leather'),
(114, 164, 9, 'ASD'),
(115, 164, 7, 'Sofa'),
(116, 165, 6, 'leather'),
(117, 165, 7, 'faux leather'),
(118, 165, 9, 'check product feature1'),
(119, 166, 6, 'Light'),
(120, 166, 7, 'LIght'),
(121, 166, 9, 'A'),
(132, 173, 6, 'office chairs'),
(133, 173, 7, 'office chairs'),
(134, 173, 9, 'office chairs');

-- --------------------------------------------------------

--
-- Table structure for table `product_filters`
--

DROP TABLE IF EXISTS `product_filters`;
CREATE TABLE IF NOT EXISTS `product_filters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `filterListId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_filters_productId_filterListId_key` (`productId`,`filterListId`),
  KEY `product_filters_filterListId_fkey` (`filterListId`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_filters`
--

INSERT INTO `product_filters` (`id`, `productId`, `filterListId`) VALUES
(81, 163, 8),
(82, 163, 17),
(83, 165, 13),
(84, 165, 16),
(85, 166, 8),
(86, 166, 17),
(95, 173, 8),
(96, 173, 19);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int DEFAULT NULL,
  `variantId` int DEFAULT NULL,
  `url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isMain` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_images_productId_fkey` (`productId`),
  KEY `product_images_variantId_fkey` (`variantId`)
) ENGINE=InnoDB AUTO_INCREMENT=555 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `productId`, `variantId`, `url`, `alt`, `isMain`) VALUES
(444, 164, NULL, '1753941503330-bedroom-decor-with-potted-plants.jpg', NULL, 1),
(445, 164, NULL, '1753941510345-folded-towels-bed.jpg', NULL, 0),
(446, 164, NULL, '1753941512045-bedroom-decor-with-potted-plants.jpg', NULL, 0),
(447, 164, NULL, '1753941518257-folded-towels-bed.jpg', NULL, 1),
(448, 164, NULL, '1753941519971-folded-towels-bed.jpg', NULL, 0),
(449, 164, NULL, '1753941521457-bedroom-decor-with-potted-plants.jpg', NULL, 0),
(450, 163, NULL, '1753955986072-img1.png', NULL, 0),
(451, 163, NULL, '1753955986187-bedroom-decor-with-potted-plants.jpg', NULL, 1),
(452, 163, NULL, '1753955994625-1745306627_main_blog-4.png', NULL, 0),
(453, 163, NULL, '1753955994674-1746418130_mid-century-interior-design.jpg', NULL, 0),
(461, 166, NULL, '1753958237096-photorealistic-wedding-venue-with-intricate-decor-ornaments.jpg', NULL, 1),
(462, 166, NULL, '1753958242160-lights-hanging-from-pole.jpg', NULL, 0),
(463, 166, NULL, '1753958242505-blurred-light-bulbs.jpg', NULL, 0),
(464, 166, NULL, '1753958243580-close-up-lantern-brick-wall.jpg', NULL, 1),
(465, 166, NULL, '1753958246027-1745306627_main_blog-4.png', NULL, 0),
(466, 166, NULL, '1753958246060-1746418130_mid-century-interior-design.jpg', NULL, 0),
(467, 167, NULL, '1753958407042-chandlier1.jpg', NULL, 1),
(468, 167, NULL, '1753958407042-chandlier2.jpg', NULL, 0),
(469, 167, NULL, '1753958407140-chandlier3.jpg', NULL, 1),
(470, 167, NULL, '1753958407179-chandlier4.jpg', NULL, 0),
(471, 167, NULL, '1753958407183-candlier5.jpg', NULL, 1),
(472, 167, NULL, '1753958407185-chandlier6.jpg', NULL, 0),
(484, 168, NULL, '1754368329428-bed.jpg', NULL, 1),
(496, 167, 263, '1756539443018-chandlier3.jpg', NULL, 1),
(497, 167, 264, '1756539443019-candlier5.jpg', NULL, 1),
(498, 166, 267, '1756539557564-cieling2.jpg', NULL, 1),
(499, 173, NULL, '1756815880166-office chair blue.jpg', NULL, 1),
(500, 173, NULL, '1756815880168-office chair blue 2.jpg', NULL, 0),
(501, 173, NULL, '1756815880168-office chair blue1.jpg', NULL, 0),
(502, 173, 269, '1756815880386-office chair red.jpg', NULL, 1),
(503, 173, 269, '1756815880388-office chiar red1.jpg', NULL, 0),
(504, 173, 270, '1756815880389-office chiar white.jpg', NULL, 1),
(505, 173, 270, '1756815880391-office chiar white 1.jpg', NULL, 0),
(534, 165, 363, '1757026952922-Capture.PNG', NULL, 0),
(541, 165, NULL, '1757046367780-WhatsApp Image 2025-09-05 at 09.53.14_5a83403d.jpg', NULL, 0),
(542, 165, NULL, '1757046367847-WhatsApp Image 2025-09-05 at 09.53.14_ea4e545d.jpg', NULL, 0),
(543, 165, NULL, '1757046367854-WhatsApp Image 2025-09-05 at 09.53.15_4ee6272a.jpg', NULL, 0),
(544, 165, 365, '1757046367855-WhatsApp Image 2025-09-05 at 09.53.14_5a83403d.jpg', NULL, 0),
(545, 165, 365, '1757046367869-WhatsApp Image 2025-09-05 at 09.53.14_ea4e545d.jpg', NULL, 0),
(546, 165, 365, '1757046367870-WhatsApp Image 2025-09-05 at 09.53.15_4ee6272a.jpg', NULL, 0),
(547, 165, 365, '1757046367870-WhatsApp Image 2025-09-05 at 09.53.15_4ee6272a - Copy.jpg', NULL, 0),
(548, 165, 365, '1757046367871-WhatsApp Image 2025-09-05 at 09.53.14_5a83403d - Copy.jpg', NULL, 0),
(549, 165, 365, '1757046367883-WhatsApp Image 2025-09-05 at 09.53.14_ea4e545d - Copy.jpg', NULL, 0),
(550, 165, 366, '1757046367887-WhatsApp Image 2025-09-05 at 09.53.14_ea4e545d.jpg', NULL, 1),
(551, 165, 370, '1757046367887-WhatsApp Image 2025-09-05 at 09.53.14_5a83403d.jpg', NULL, 1),
(552, 165, 370, '1757046367897-WhatsApp Image 2025-09-05 at 09.53.14_5a83403d.jpg', NULL, 0),
(553, 165, 370, '1757046367905-WhatsApp Image 2025-09-05 at 09.53.14_ea4e545d.jpg', NULL, 0),
(554, 165, 370, '1757046367905-WhatsApp Image 2025-09-05 at 09.53.15_4ee6272a.jpg', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_main_category_promotions`
--

DROP TABLE IF EXISTS `product_main_category_promotions`;
CREATE TABLE IF NOT EXISTS `product_main_category_promotions` (
  `productId` int NOT NULL,
  `mainCategoryPromotionId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `mainProductPromotionId` int DEFAULT NULL,
  PRIMARY KEY (`productId`,`mainCategoryPromotionId`),
  KEY `product_main_category_promotions_mainCategoryPromotionId_fkey` (`mainCategoryPromotionId`),
  KEY `product_main_category_promotions_mainProductPromotionId_fkey` (`mainProductPromotionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_main_category_promotions`
--

INSERT INTO `product_main_category_promotions` (`productId`, `mainCategoryPromotionId`, `createdAt`, `mainProductPromotionId`) VALUES
(164, 3, '2025-08-30 07:07:02.536', NULL),
(165, 3, '2025-09-04 22:33:02.735', NULL),
(166, 2, '2025-08-30 07:16:34.834', NULL),
(167, 1, '2025-08-29 13:23:06.701', NULL),
(168, 2, '2025-09-01 07:37:12.462', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `sku` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` int NOT NULL,
  `mrp` double NOT NULL,
  `sellingPrice` double NOT NULL,
  `sizeId` int DEFAULT NULL,
  `colorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_variants_productId_fkey` (`productId`),
  KEY `product_variants_sizeId_fkey` (`sizeId`),
  KEY `product_variants_colorId_fkey` (`colorId`)
) ENGINE=InnoDB AUTO_INCREMENT=371 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `productId`, `sku`, `stock`, `mrp`, `sellingPrice`, `sizeId`, `colorId`) VALUES
(225, 163, 'asdf456', 11, 34999, 24999, 14, 13),
(263, 167, 'SKU_CH2', 1, 20000, 19623, 14, 25),
(264, 167, 'SKU_CH3', 3, 12000, 11500, 13, 24),
(265, 164, 'asdf458', 11, 34999, 24999, 18, 24),
(266, 164, 'sku-mm', 2, 32000, 25466, 13, 13),
(267, 166, 'nh09', 10, 990, 780, 14, 27),
(268, 168, 'gfgg', 343, 1000, 750, 18, 26),
(269, 173, 'SKU_OC3', 1, 4000, 2300, 13, 13),
(270, 173, 'SKU_OC2', 2, 5000, 4200, 14, 25),
(363, 165, 'SKU_CL7', 4, 5677, 5000, 18, 25),
(365, 165, 'SKU_CL2', 4, 8500, 6982, 14, 26),
(366, 165, 'SKU_CL3', 3, 6500, 5896, 13, 24),
(367, 165, 'SKU_CL4', 5, 5499, 3444, 13, 13),
(370, 165, 'SKU_CL9', 32, 54666, 5677, 18, 24);

-- --------------------------------------------------------

--
-- Table structure for table `serviceablearea`
--

DROP TABLE IF EXISTS `serviceablearea`;
CREATE TABLE IF NOT EXISTS `serviceablearea` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pincode` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `codAvailable` tinyint(1) NOT NULL DEFAULT '0',
  `deliveryEtaDays` int DEFAULT NULL,
  `lastMileFee` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ServiceableArea_pincode_key` (`pincode`),
  KEY `ServiceableArea_pincode_idx` (`pincode`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `serviceablearea`
--

INSERT INTO `serviceablearea` (`id`, `pincode`, `city`, `state`, `isActive`, `codAvailable`, `deliveryEtaDays`, `lastMileFee`) VALUES
(1, '500081', 'Hyderabad', 'Telangana', 1, 1, 2, 49),
(2, '560001', 'Bengaluru', 'Karnataka', 1, 0, 3, 0),
(3, '110001', 'New Delhi', 'Delhi', 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `shipping_partners`
--

DROP TABLE IF EXISTS `shipping_partners`;
CREATE TABLE IF NOT EXISTS `shipping_partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `size_uom`
--

DROP TABLE IF EXISTS `size_uom`;
CREATE TABLE IF NOT EXISTS `size_uom` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `size_uom_title_key` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `size_uom`
--

INSERT INTO `size_uom` (`id`, `title`, `status`) VALUES
(13, 'Small', 1),
(14, 'Medium ', 1),
(18, 'Large', 1),
(19, 'Customize', 1),
(20, 'test ', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sliders`
--

DROP TABLE IF EXISTS `sliders`;
CREATE TABLE IF NOT EXISTS `sliders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` int NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sliders`
--

INSERT INTO `sliders` (`id`, `title`, `image_url`, `link`, `priority`, `status`, `created_at`) VALUES
(1, 'Image1', '1755058931721-968382798.png', 'http://localhost:3000/products/lamps-lighting/ceiling-lights/hanging-lights-222', 4, 0, '2025-08-13 04:22:11.797'),
(5, 'slider2', '1755511281309-413132422.png', 'http://localhost:3000/products/lamps-lighting/ceiling-lights/hanging-lights-222', 2, 1, '2025-08-18 10:01:21.455'),
(6, 'slider3', '1755511334022-567007797.png', 'http://localhost:3000/products/lamps-lighting/ceiling-lights/hanging-lights-222', 3, 1, '2025-08-18 10:02:14.439'),
(7, 'slider1', '1755512901351-418184364.png', 'http://localhost:3000/products/lamps-lighting/ceiling-lights/hanging-lights-222', 1, 1, '2025-08-18 10:28:21.558');

-- --------------------------------------------------------

--
-- Table structure for table `slider_right`
--

DROP TABLE IF EXISTS `slider_right`;
CREATE TABLE IF NOT EXISTS `slider_right` (
  `id` int NOT NULL DEFAULT '1',
  `image1` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image2` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image3` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `slider_right`
--

INSERT INTO `slider_right` (`id`, `image1`, `image2`, `image3`, `updatedAt`) VALUES
(1, '1755058888981-960530856.jpg', '1755058888982-865369802.png', '1755058889137-17438194.png', '2025-08-13 04:21:29.178');

-- --------------------------------------------------------

--
-- Table structure for table `styles`
--

DROP TABLE IF EXISTS `styles`;
CREATE TABLE IF NOT EXISTS `styles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tax_rules`
--

DROP TABLE IF EXISTS `tax_rules`;
CREATE TABLE IF NOT EXISTS `tax_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `percentage` double DEFAULT NULL,
  `applicable_on` enum('MRP','Discounted') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MRP',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('CUSTOMER','ADMIN','VENDOR','SUPPORT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `profilePicture` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alternateMobile` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateOfBirth` datetime(3) DEFAULT NULL,
  `gender` enum('Male','Female','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_phone_key` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `status`, `createdAt`, `updatedAt`, `profilePicture`, `token`, `alternateMobile`, `dateOfBirth`, `gender`) VALUES
(1, 'Updated Name', 'updated@example.com', '9998887776', NULL, 'ADMIN', 1, '2025-07-31 04:40:11.928', '2025-08-26 12:39:01.656', 'https://example.com/pic.jpg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzU1ODQ0NjAwLCJleHAiOjE3NTU5MzEwMDB9.F8oSTT3QVqYh-79LSwfXyMuQXZJTtW4KNRsqwl68jUw', '9123456780', '1990-01-15 00:00:00.000', 'Male'),
(2, 'Amit Sharma', 'amith@gmail.com', '9880018732', NULL, 'ADMIN', 0, '2025-08-01 09:04:58.638', '2025-09-03 12:36:38.295', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzU0MDM5MDk4LCJleHAiOjE3NTQwNDI2OTh9.GAnxpoTkssDqyQ14UrVVXkHLBtGu5Uo4oCI4jYhYO_M', NULL, NULL, 'Male'),
(3, 'Pakki', 'admin@example.com', '8790969134', NULL, 'CUSTOMER', 1, '2025-08-04 04:50:35.553', '2025-09-04 07:48:19.174', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzU2OTcyMDk5LCJleHAiOjE3NTcwNTg0OTl9.IuRkQxthrk-yWwUbT8AnkZu4iCZfK44fteYZv41vNDI', '9848887252', '2025-09-02 00:00:00.000', 'Female'),
(5, NULL, NULL, '07207200372', NULL, 'CUSTOMER', 1, '2025-08-09 10:02:27.339', '2025-08-26 12:39:01.656', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzU0NzMzNzQ3LCJleHAiOjE3NTQ4MjAxNDd9.Mj4_bEQoZUKnGjir8mz-mnLSjUTXt8gk-r6UegEM47c', NULL, NULL, NULL),
(6, 'Chaitanya Nelluri', 'kits.chaithu007@gmail.com', '9820000486', NULL, 'CUSTOMER', 1, '2025-08-11 04:17:59.153', '2025-08-26 12:39:01.656', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzU0ODg1ODc5LCJleHAiOjE3NTQ5NzIyNzl9.nRZApTlzK8gjaIxDF1eQlAzdWv8TEo1Lwt-Jjrce2qU', '9848887252', '2025-08-14 00:00:00.000', 'Male'),
(8, NULL, NULL, '9876543212', NULL, 'CUSTOMER', 1, '2025-08-21 12:22:31.581', '2025-09-03 06:18:55.371', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzU2ODgwMzM1LCJleHAiOjE3NTY5NjY3MzV9.ybFHt7h-VvDJUN4un6-Q7249RtDRK0I2NcC3l-EFMLo', NULL, NULL, NULL),
(11, NULL, NULL, '9876543210', NULL, 'CUSTOMER', 1, '2025-09-01 20:42:00.995', '2025-09-16 18:56:56.525', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTc1ODA0OTAxNiwiZXhwIjoxNzU4MTM1NDE2fQ.oM0HL9T9Rg2CKGRrHaDPBtNbdTRfI7iB_7eTGZAzf80', NULL, NULL, NULL),
(12, 'Admin', 'admin@example.com', '0000000000', '$2b$12$Szy1lS6nQy0Ek3wf96NyVe8p5wHKkphzXpFaErk12gEvoZZRRuCpm', 'ADMIN', 1, '2025-09-02 08:44:33.714', '2025-09-03 12:29:08.692', NULL, NULL, '9848887252', '1992-06-07 00:00:00.000', 'Male');

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

DROP TABLE IF EXISTS `user_addresses`;
CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `addressLine1` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `addressLine2` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `buildingName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `flatNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `default` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_addresses_userId_fkey` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `userId`, `label`, `name`, `phone`, `city`, `state`, `createdAt`, `addressLine1`, `addressLine2`, `buildingName`, `flatNumber`, `pincode`, `updatedAt`, `default`) VALUES
(1, 1, 'Other', 'Amit Sharma', '9876543210', 'Mumbai', 'Maharashtra', '2025-08-05 06:07:39.215', 'Sector 15, MG Road', 'Near Apollo Hospital', 'Sunshine Apartments', 'Flat 105', '400001', '2025-08-07 06:13:01.610', 0),
(2, 1, 'Home', 'Amit Sharma', '9876543210', 'Mumbai', 'Maharashtra', '2025-08-05 09:02:36.466', 'Sector 15, MG Road', 'Near Apollo Hospital', 'Sunshine Apartments', 'Flat 101', '400001', '2025-08-07 06:13:01.610', 0),
(3, 1, 'Office', 'Chaitanya Nelluri', '9880018778', 'Cochin', 'Kerala', '2025-08-05 09:30:33.138', 'wewrrr', 'werwrrr', 'dwarakayamayi residency', '201', '560068', '2025-08-07 06:13:01.610', 0),
(4, 1, 'Office', 'Pakki', '9880018896', 'Bangalore Urban', 'Karnataka', '2025-08-05 09:45:38.864', 'akshyanagar', 'Bangalore', 'SLV Samskurthi apt', '305', '560068', '2025-08-07 06:13:01.633', 1),
(12, 6, 'Home', 'Pakki', '9880018778', 'Bangalore Urban', 'Karnataka', '2025-08-11 06:07:55.011', 'akshyanagar', 'Bangalore', 'SLV Samskurthi apt', 'Flat 105', '400001', '2025-08-11 06:07:55.011', 0),
(13, 3, 'Home', 'Pakki', '9880018732', 'Bangalore Urban', 'Karnataka', '2025-08-14 05:45:29.175', 'akshyanagar', 'Bangalore', 'SLV Samskurthi apt', '305', '560068', '2025-09-03 10:13:57.817', 0),
(14, 3, 'Office', 'Chaitanya Nelluri', '9880018778', 'Hyderābād', 'Telangana', '2025-08-14 05:46:13.806', 'Sector 15, MG Road', 'Near Apollo Hospital', 'Sunshine Apartments', 'Flat 105', '400001', '2025-09-03 10:13:57.817', 0),
(16, 8, 'Home', 'cdas', '9008876590', 'Gho Brāhmanān de', 'Jammu and Kashmir', '2025-09-03 10:15:57.880', 'dwdcw', 'axs', 'xax', 'xad', '897654', '2025-09-03 10:15:57.880', 0),
(19, 11, 'Office', 'Kiran Sharma', '9876543210', 'Mumbai', 'Maharashtra', '2025-09-13 09:06:36.890', 'Sector 15, MG Road', 'Near Apollo Hospital', 'RIchlabz Apartments', 'Flat 101', '400001', '2025-09-13 09:07:00.275', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_subscribers`
--

DROP TABLE IF EXISTS `user_subscribers`;
CREATE TABLE IF NOT EXISTS `user_subscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subscribed_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_subscribers`
--

INSERT INTO `user_subscribers` (`id`, `email`, `subscribed_at`) VALUES
(1, 'subscriber@example.com', '2018-06-14 00:00:00.000'),
(4, 'subscriber1265@example.com', '2018-06-14 00:00:00.000');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
CREATE TABLE IF NOT EXISTS `vendors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warranties`
--

DROP TABLE IF EXISTS `warranties`;
CREATE TABLE IF NOT EXISTS `warranties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `duration_months` int DEFAULT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `variantId` int DEFAULT NULL,
  `size` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `wishlist_userId_productId_variantId_key` (`userId`,`productId`,`variantId`),
  KEY `wishlist_productId_fkey` (`productId`),
  KEY `wishlist_variantId_fkey` (`variantId`)
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `userId`, `productId`, `variantId`, `size`, `quantity`, `createdAt`) VALUES
(12, 2, 165, NULL, NULL, 1, '2025-08-01 09:04:59.021'),
(13, 2, 166, NULL, NULL, 1, '2025-08-01 09:31:00.844'),
(93, 1, 168, NULL, NULL, 1, '2025-08-04 09:34:51.161'),
(127, 1, 167, NULL, NULL, 1, '2025-08-07 11:36:42.845'),
(130, 5, 167, NULL, NULL, 1, '2025-08-09 10:02:27.460'),
(131, 5, 166, NULL, NULL, 1, '2025-08-09 10:02:29.852'),
(141, 8, 164, NULL, NULL, 1, '2025-08-21 12:22:31.682'),
(156, 11, 166, NULL, NULL, 1, '2025-09-01 20:49:03.416'),
(161, 8, 167, NULL, NULL, 1, '2025-09-03 06:18:55.496'),
(165, 8, 166, NULL, NULL, 1, '2025-09-03 09:25:26.482'),
(166, 8, 166, 267, NULL, 1, '2025-09-03 09:25:29.673'),
(168, 3, 164, NULL, NULL, 1, '2025-09-03 10:31:35.114'),
(169, 3, 165, NULL, NULL, 1, '2025-09-03 10:31:39.484'),
(170, 11, 173, NULL, NULL, 1, '2025-09-15 08:35:52.289');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('2883c375-9c51-4f7b-a2a6-9bfeeb77e9ed', 'c35b2d9003a042c7b8addd050211e851b2fde63965e0afbdf12c5f7913c7fc9c', '2025-07-24 04:42:01.395', '20250722105802_coupon', NULL, NULL, '2025-07-24 04:42:00.880', 1),
('94a9764c-96ee-4766-8f08-4da919656c05', 'c671a644c862e1030a6b112173b2621901ff0de53abac6b6742b4e38d1ab9000', '2025-07-24 04:42:00.877', '20250717092141_init', NULL, NULL, '2025-07-24 04:41:59.668', 1),
('b2c7c4ea-46c0-4db1-8ae0-51faba1fa73e', '853e273399dbb9238566eff84e67ce60a23dc536f050261021522146a25c62e3', '2025-07-24 10:43:39.342', '20250724104339_brand_def', NULL, NULL, '2025-07-24 10:43:39.027', 1),
('da11a98c-6176-4cfa-aa74-f5406cad6f5d', 'da361b887f29c0fd412e471690f1de5cb9ee066631a3ad02482a0f8f455a44ba', '2025-07-24 04:42:09.882', '20250724044209_features', NULL, NULL, '2025-07-24 04:42:09.832', 1),
('fc331446-9da6-4d6c-8697-bde07c209687', 'a5283c88fc295431eaf6d9b679c3d65cfc165794618b8dc02466e904e290a0ca', '2025-07-24 04:42:01.636', '20250723124823_coupon_status', NULL, NULL, '2025-07-24 04:42:01.399', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products` ADD FULLTEXT KEY `ft_product_search` (`title`,`searchKeywords`,`description`,`sku`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applied_coupons`
--
ALTER TABLE `applied_coupons`
  ADD CONSTRAINT `applied_coupons_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupons` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `applied_coupons_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `buy_now_items`
--
ALTER TABLE `buy_now_items`
  ADD CONSTRAINT `buy_now_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `buy_now_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `buy_now_items_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_items_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_featureTypeId_fkey` FOREIGN KEY (`featureTypeId`) REFERENCES `feature_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_filterTypeId_fkey` FOREIGN KEY (`filterTypeId`) REFERENCES `filter_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `coupons_priceRangeId_fkey` FOREIGN KEY (`priceRangeId`) REFERENCES `pricerange` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `featuredcategory`
--
ALTER TABLE `featuredcategory`
  ADD CONSTRAINT `FeaturedCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `feature_lists`
--
ALTER TABLE `feature_lists`
  ADD CONSTRAINT `feature_lists_featureSetId_fkey` FOREIGN KEY (`featureSetId`) REFERENCES `feature_sets` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `feature_sets`
--
ALTER TABLE `feature_sets`
  ADD CONSTRAINT `feature_sets_featureTypeId_fkey` FOREIGN KEY (`featureTypeId`) REFERENCES `feature_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `filter_lists`
--
ALTER TABLE `filter_lists`
  ADD CONSTRAINT `filter_lists_filterSetId_fkey` FOREIGN KEY (`filterSetId`) REFERENCES `filter_sets` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `filter_sets`
--
ALTER TABLE `filter_sets`
  ADD CONSTRAINT `filter_sets_filterTypeId_fkey` FOREIGN KEY (`filterTypeId`) REFERENCES `filter_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `main_product_promotions`
--
ALTER TABLE `main_product_promotions`
  ADD CONSTRAINT `main_product_promotions_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `main_product_promotions_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `main_product_promotions_mainCategoryPromotionId_fkey` FOREIGN KEY (`mainCategoryPromotionId`) REFERENCES `main_category_promotions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `user_addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `products_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `size_uom` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_details`
--
ALTER TABLE `product_details`
  ADD CONSTRAINT `product_details_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `product_features`
--
ALTER TABLE `product_features`
  ADD CONSTRAINT `product_features_featureListId_fkey` FOREIGN KEY (`featureListId`) REFERENCES `feature_lists` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `product_features_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `product_filters`
--
ALTER TABLE `product_filters`
  ADD CONSTRAINT `product_filters_filterListId_fkey` FOREIGN KEY (`filterListId`) REFERENCES `filter_lists` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `product_filters_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `product_images_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_main_category_promotions`
--
ALTER TABLE `product_main_category_promotions`
  ADD CONSTRAINT `product_main_category_promotions_mainCategoryPromotionId_fkey` FOREIGN KEY (`mainCategoryPromotionId`) REFERENCES `main_category_promotions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `product_main_category_promotions_mainProductPromotionId_fkey` FOREIGN KEY (`mainProductPromotionId`) REFERENCES `main_product_promotions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `product_main_category_promotions_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `product_variants_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `product_variants_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `size_uom` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `user_addresses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlist_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
