-- MySQL dump 10.13  Distrib 5.5.40, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: kochtracker
-- ------------------------------------------------------
-- Server version	5.5.40-0ubuntu1

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
-- Table structure for table `koch_orgs`
--

DROP TABLE IF EXISTS `koch_orgs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `koch_orgs` (
  `org_name` varchar(100) NOT NULL,
  `org_alias` varchar(100) NOT NULL,
  `tier` int(11) NOT NULL,
  PRIMARY KEY (`org_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `koch_orgs`
--

LOCK TABLES `koch_orgs` WRITE;
/*!40000 ALTER TABLE `koch_orgs` DISABLE KEYS */;
INSERT INTO `koch_orgs` VALUES ('','',0);
INSERT INTO `koch_orgs` VALUES ('60 Plus Assn','60 Plus Assn',1);
INSERT INTO `koch_orgs` VALUES ('American Commitment','American Commitment',1);
INSERT INTO `koch_orgs` VALUES ('American Crossroads','American Crossroads',1);
INSERT INTO `koch_orgs` VALUES ('American Encore','American Encore',1);
INSERT INTO `koch_orgs` VALUES ('American Energy Alliance','American Energy Alliance',1);
INSERT INTO `koch_orgs` VALUES ('American Enterprise Institute','American Enterprise Institute',1);
INSERT INTO `koch_orgs` VALUES ('American Future Fund','American Future Fund',1);
INSERT INTO `koch_orgs` VALUES ('Americans For Prosperity','Americans For Prosperity',1);
INSERT INTO `koch_orgs` VALUES ('Americans for Tax Reform','Americans for Tax Reform',1);
INSERT INTO `koch_orgs` VALUES ('Arizona Right To Life','Arizona Right To Life',2);
INSERT INTO `koch_orgs` VALUES ('Atlas PAC','Atlas PAC',1);
INSERT INTO `koch_orgs` VALUES ('Black Americans for Life','Black Americans for Life',2);
INSERT INTO `koch_orgs` VALUES ('Carolina Rising','Carolina Rising',1);
INSERT INTO `koch_orgs` VALUES ('CFACT','CFACT',2);
INSERT INTO `koch_orgs` VALUES ('Charles Koch Foundation','Charles Koch Foundation',1);
INSERT INTO `koch_orgs` VALUES ('Charles Koch Institute','Charles Koch Institute',1);
INSERT INTO `koch_orgs` VALUES ('Citizens Club for Growth','Citizens Club for Growth',1);
INSERT INTO `koch_orgs` VALUES ('Claude R. Lambe Foundation','Claude R. Lambe Foundation',1);
INSERT INTO `koch_orgs` VALUES ('Club for Growth','Club for Growth',1);
INSERT INTO `koch_orgs` VALUES ('Club for Growth Action','Club for Growth Action',1);
INSERT INTO `koch_orgs` VALUES ('Common Sense Issues','Common Sense Issues',2);
INSERT INTO `koch_orgs` VALUES ('Concerned Veterans for America','Concerned Veterans for America',1);
INSERT INTO `koch_orgs` VALUES ('Concerned Women for America','Concerned Women for America',1);
INSERT INTO `koch_orgs` VALUES ('Daughter','Daughter',0);
INSERT INTO `koch_orgs` VALUES ('Evangchr4 Trust','Evangchr4 Trust',1);
INSERT INTO `koch_orgs` VALUES ('Faith & Freedom Coalition','Faith & Freedom Coalition',2);
INSERT INTO `koch_orgs` VALUES ('Flint Hills Resources','Flint Hills Resources',1);
INSERT INTO `koch_orgs` VALUES ('Freedom Partners','Freedom Partners',1);
INSERT INTO `koch_orgs` VALUES ('Freedom Works PAC','Freedom Works PAC',1);
INSERT INTO `koch_orgs` VALUES ('Generation Opportunity','Generation Opportunity',1);
INSERT INTO `koch_orgs` VALUES ('Georgia Right To Life','Georgia Right To Life',2);
INSERT INTO `koch_orgs` VALUES ('Georgia-Pacific Corp','Georgia-Pacific Corp',1);
INSERT INTO `koch_orgs` VALUES ('Georgia-Pacific LLC','Georgia-Pacific LLC',0);
INSERT INTO `koch_orgs` VALUES ('Heritage Action for America','Heritage Action for America',1);
INSERT INTO `koch_orgs` VALUES ('Heritage Foundation','Heritage Foundation',1);
INSERT INTO `koch_orgs` VALUES ('HOMEMAKER','HOMEMAKER',0);
INSERT INTO `koch_orgs` VALUES ('Independent Women\'s Forum','Independent Women\'s Forum',1);
INSERT INTO `koch_orgs` VALUES ('INVISTA','INVISTA',1);
INSERT INTO `koch_orgs` VALUES ('John Locke Foundation','John Locke Foundation',2);
INSERT INTO `koch_orgs` VALUES ('Kansans for Life','Kansans for Life',2);
INSERT INTO `koch_orgs` VALUES ('KOCH AG & ENERGY SOLUTION','KOCH AG & ENERGY SOLUTION',1);
INSERT INTO `koch_orgs` VALUES ('Koch Agronomic Services','Koch Agronomic Services',1);
INSERT INTO `koch_orgs` VALUES ('KOCH AGRONOMIC SVCS, LLC','Koch Agronomic Services',1);
INSERT INTO `koch_orgs` VALUES ('KOCH BUSINESS HOLDINGS LLC','Koch Business Holdings',1);
INSERT INTO `koch_orgs` VALUES ('KOCH BUSINESS HOLDINGS, LLC','Koch Business Holdings',1);
INSERT INTO `koch_orgs` VALUES ('KOCH BUSINESS HOLDINGS, LLC/MANAGER','Koch Business Holdings',1);
INSERT INTO `koch_orgs` VALUES ('Koch Capital Markets','Koch Capital Markets',1);
INSERT INTO `koch_orgs` VALUES ('Koch Cellulose','Koch Cellulose',1);
INSERT INTO `koch_orgs` VALUES ('KOCH CHEM TECH GROUP LLC','Koch Chemical Tech Group',1);
INSERT INTO `koch_orgs` VALUES ('KOCH CHEMICAL TECH GROUP LLC','Koch Chemical Tech Group',1);
INSERT INTO `koch_orgs` VALUES ('KOCH CHEMICAL TECH GROUP LLC/EXECUT','Koch Chemical Tech Group',1);
INSERT INTO `koch_orgs` VALUES ('Koch Companies Public Sector','Koch Companies Public Sector',1);
INSERT INTO `koch_orgs` VALUES ('Koch Energy Trading','Koch Energy Trading',1);
INSERT INTO `koch_orgs` VALUES ('Koch Fertilizer','Koch Fertilizer',1);
INSERT INTO `koch_orgs` VALUES ('KOCH FERTILIZER LLC','Koch Fertilizer',1);
INSERT INTO `koch_orgs` VALUES ('KOCH FERTILIZER, LLC','Koch Fertilizer',1);
INSERT INTO `koch_orgs` VALUES ('Koch Hydrocarbon','Koch Hydrocarbon',1);
INSERT INTO `koch_orgs` VALUES ('KOCH INDUSTIRES','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('Koch Industries','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('KOCH INDUSTRIES INC','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('KOCH INDUSTRIES INC.','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('Koch Industries Inc./Chairman of th','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('KOCH INDUSTRIES INC/CHAIRMAN & CEO','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('Koch Industries Inc/Manager Ict-Koc','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('KOCH INDUSTRIES, INC.','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('KOCH INDUSTRIES, INC./CHAIRMAN OF T','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('Koch Industries/Son','Koch Industries',1);
INSERT INTO `koch_orgs` VALUES ('Koch Materials','Koch Materials',1);
INSERT INTO `koch_orgs` VALUES ('Koch Membrane Systems','Koch Membrane Systems',1);
INSERT INTO `koch_orgs` VALUES ('Koch Mineral Services','Koch Mineral Services',1);
INSERT INTO `koch_orgs` VALUES ('Koch Minerals','Koch Minerals',1);
INSERT INTO `koch_orgs` VALUES ('Koch Nitrogen','Koch Nitrogen',1);
INSERT INTO `koch_orgs` VALUES ('KOCH NITROGEN COMPANY, LLC/VICE PRE','Koch Nitrogen',1);
INSERT INTO `koch_orgs` VALUES ('KOCH NITROGEN COMPANY/VICE PRESIDEN','Koch Nitrogen',1);
INSERT INTO `koch_orgs` VALUES ('Koch Performance Roads','Koch Performance Roads',1);
INSERT INTO `koch_orgs` VALUES ('Koch Petroleum Group','Koch Petroleum Group',1);
INSERT INTO `koch_orgs` VALUES ('Koch Pipeline Co','Koch Pipeline Co',1);
INSERT INTO `koch_orgs` VALUES ('Koch Refining','Koch Refining',1);
INSERT INTO `koch_orgs` VALUES ('Koch Supplies','Koch Supplies',1);
INSERT INTO `koch_orgs` VALUES ('Koch Supply & Trading','Koch Supply & Trading',1);
INSERT INTO `koch_orgs` VALUES ('Libre Initiative ','Libre Initiative ',1);
INSERT INTO `koch_orgs` VALUES ('Missouri Right to Life','Missouri Right to Life',2);
INSERT INTO `koch_orgs` VALUES ('Molex Inc','Molex Inc',1);
INSERT INTO `koch_orgs` VALUES ('National Association of Manufacturers','National Association of Manufacturers',2);
INSERT INTO `koch_orgs` VALUES ('National Center for Policy Analysis','National Center for Policy Analysis',2);
INSERT INTO `koch_orgs` VALUES ('National Federation of Independent Business','National Federation of Independent Business',1);
INSERT INTO `koch_orgs` VALUES ('National Rifle Association','National Rifle Association',2);
INSERT INTO `koch_orgs` VALUES ('National Right to Life','National Right to Life',2);
INSERT INTO `koch_orgs` VALUES ('National Right to Work Committee','National Right to Work Committee',1);
INSERT INTO `koch_orgs` VALUES ('National Taxpayers Union','National Taxpayers Union',2);
INSERT INTO `koch_orgs` VALUES ('New York State Right To Life','New York State Right To Life',2);
INSERT INTO `koch_orgs` VALUES ('None/Spouse of Exec VP','None/Spouse of Exec VP',0);
INSERT INTO `koch_orgs` VALUES ('NOT APPLICABLE','NOT APPLICABLE',0);
INSERT INTO `koch_orgs` VALUES ('Oregon Right to Life','Oregon Right to Life',2);
INSERT INTO `koch_orgs` VALUES ('Partnership for Ohio\'s Future','Partnership for Ohio\'s Future',2);
INSERT INTO `koch_orgs` VALUES ('Public Engagement Group Trust','Public Engagement Group Trust',1);
INSERT INTO `koch_orgs` VALUES ('Public Notice','Public Notice',1);
INSERT INTO `koch_orgs` VALUES ('Purina Mills','Purina Mills',1);
INSERT INTO `koch_orgs` VALUES ('Republican Governor\'s Association','Republican Governor\'s Association',1);
INSERT INTO `koch_orgs` VALUES ('Republican Jewish Coalition','Republican Jewish Coalition',2);
INSERT INTO `koch_orgs` VALUES ('Restore Our Future','Restore Our Future',2);
INSERT INTO `koch_orgs` VALUES ('Right To Life','Right To Life',2);
INSERT INTO `koch_orgs` VALUES ('Right To Life of Michigan','Right To Life of Michigan',2);
INSERT INTO `koch_orgs` VALUES ('SPOUSE','SPOUSE',0);
INSERT INTO `koch_orgs` VALUES ('State Policy Network','State Policy Network',2);
INSERT INTO `koch_orgs` VALUES ('State Tea Party Express','State Tea Party Express',2);
INSERT INTO `koch_orgs` VALUES ('TC4','TC4',1);
INSERT INTO `koch_orgs` VALUES ('Texas Public Policy Action Foundation','Texas Public Policy Action Foundation',1);
INSERT INTO `koch_orgs` VALUES ('Texas Right to Life','Texas Right to Life',2);
INSERT INTO `koch_orgs` VALUES ('Themis','Themis',1);
INSERT INTO `koch_orgs` VALUES ('US Chamber of Commerce','US Chamber of Commerce',2);
INSERT INTO `koch_orgs` VALUES ('Wesley Medical Center','Wesley Medical Center',2);
INSERT INTO `koch_orgs` VALUES ('West Michigan Policy Forum','West Michigan Policy Forum',2);
INSERT INTO `koch_orgs` VALUES ('Young Americans for Liberty','Young Americans for Liberty',1);
/*!40000 ALTER TABLE `koch_orgs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-11-07 18:33:45
