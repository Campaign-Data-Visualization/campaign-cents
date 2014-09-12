-- MySQL dump 10.13  Distrib 5.5.38, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: kochtracker
-- ------------------------------------------------------
-- Server version	5.5.38-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidates` (
  `voteSmartId` mediumint(7) unsigned NOT NULL DEFAULT '0',
  `firstName` varchar(20) DEFAULT NULL,
  `lastName` varchar(20) DEFAULT NULL,
  `middleName` varchar(20) DEFAULT NULL,
  `preferredName` varchar(20) DEFAULT NULL,
  `nameSuffix` varchar(4) DEFAULT NULL,
  `ballotName` varchar(30) DEFAULT NULL,
  `nameLastFirst` varchar(40) DEFAULT NULL,
  `nameFirstLast` varchar(40) DEFAULT NULL,
  `nameSearch` varchar(70) DEFAULT NULL,
  `party` varchar(10) CHARACTER SET latin1 DEFAULT NULL,
  `state` char(2) CHARACTER SET latin1 DEFAULT NULL,
  `office` varchar(11) CHARACTER SET latin1 DEFAULT NULL,
  `2014contrib` int(10) unsigned DEFAULT '0',
  `since2000contrib` int(10) unsigned DEFAULT '0',
  `district` char(2) DEFAULT NULL,
  `electionStatus` varchar(20) NOT NULL DEFAULT 'Challeger',
  `photoURL` varchar(50) DEFAULT '/images/profile-blank.jpg',
  `CRPId` char(9) DEFAULT NULL,
  `address` varchar(80) NOT NULL,
  `address_city` varchar(30) NOT NULL,
  `address_state` char(2) NOT NULL,
  `address_zip` varchar(10) NOT NULL,
  `lat` decimal(9,6) NOT NULL,
  `lng` decimal(9,6) NOT NULL,
  PRIMARY KEY (`voteSmartId`),
  UNIQUE KEY `voteSmartId_UNIQUE` (`voteSmartId`),
  KEY `district` (`office`,`state`,`district`),
  KEY `cripid` (`CRPId`),
  KEY `map` (`since2000contrib`,`lat`,`lng`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `koch_contribs`
--

DROP TABLE IF EXISTS `koch_contribs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `koch_contribs` (
  `crpid` varchar(20) CHARACTER SET utf8 NOT NULL,
  `donor_name` varchar(200) CHARACTER SET latin1 NOT NULL,
  `donor_id` varchar(20) CHARACTER SET latin1 NOT NULL,
  `date` date NOT NULL,
  `amount` int(11) NOT NULL DEFAULT '0',
  `koch_tier` int(11) NOT NULL,
  `source` varchar(20) CHARACTER SET latin1 NOT NULL,
  `source_id` varchar(20) CHARACTER SET latin1 NOT NULL,
  `for_against` varchar(1) CHARACTER SET latin1 NOT NULL DEFAULT 'f',
  `cycle` int(11) NOT NULL,
  `voteSmartId` mediumint(7) unsigned NOT NULL,
  KEY `cycle` (`crpid`,`for_against`,`cycle`) USING BTREE,
  KEY `tier` (`crpid`,`for_against`,`koch_tier`),
  KEY `cycle2` (`voteSmartId`,`for_against`,`cycle`),
  KEY `tier2` (`voteSmartId`,`for_against`,`koch_tier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `koch_orgs`
--

DROP TABLE IF EXISTS `koch_orgs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `koch_orgs` (
  `org_name` varchar(100) NOT NULL,
  `tier` int(11) NOT NULL,
  PRIMARY KEY (`org_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `leadership_pacs`
--

DROP TABLE IF EXISTS `leadership_pacs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leadership_pacs` (
  `cmteid` char(9) DEFAULT NULL,
  `pacshort` varchar(40) DEFAULT NULL,
  `affiliate` varchar(40) DEFAULT NULL,
  `lastName` char(40) CHARACTER SET utf8 NOT NULL,
  `firstName` char(40) CHARACTER SET utf8 NOT NULL,
  `state` char(40) CHARACTER SET utf8 NOT NULL,
  `crpid` char(40) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `states` (
  `state_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK: Unique state ID',
  `state_name` varchar(32) COLLATE utf8_unicode_ci NOT NULL COMMENT 'State name with first letter capital',
  `state` varchar(8) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Optional state abbreviation (US is 2 capital letters)',
  `center_lat` decimal(9,6) NOT NULL,
  `center_lng` decimal(9,6) NOT NULL,
  `ne_lat` decimal(9,6) NOT NULL,
  `ne_lng` decimal(9,6) NOT NULL,
  `sw_lat` decimal(9,6) NOT NULL,
  `sw_lng` decimal(9,6) NOT NULL,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `zipcode`
--

DROP TABLE IF EXISTS `zipcode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zipcode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zip` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `county` varchar(75) NOT NULL,
  `fips` int(11) NOT NULL,
  `areacode` varchar(3) NOT NULL,
  `dst` enum('Y','N') NOT NULL,
  `timezone` varchar(20) NOT NULL,
  `lat` varchar(25) NOT NULL,
  `lon` varchar(25) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_zipcode` (`zip`(5))
) ENGINE=MyISAM AUTO_INCREMENT=42811 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content` (
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `detail` varchar(200) NOT NULL,
  `published` tinyint(1) DEFAULT '0',
  `type` varchar(10) NOT NULL,
  KEY `type` (`type`,`published`) USING BTREE,
  KEY `detail` (`detail`,`published`) USING BTREE,
  KEY `published` (`published`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `koch_assets`
--

DROP TABLE IF EXISTS `koch_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `koch_assets` (
  `title` varchar(150) NOT NULL,
  `description` text,
  `lat` decimal(9,6) NOT NULL,
  `lng` decimal(9,6) NOT NULL,
  `layer` varchar(15) NOT NULL,
  `city` varchar(30) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  KEY `state` (`state`,`layer`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-09-11 16:59:46
