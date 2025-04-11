-- MySQL dump 10.13  Distrib 5.7.24, for osx11.1 (x86_64)
--
-- Host: localhost    Database: demoo
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer` (
  `team_id` varchar(128) NOT NULL,
  `user_id` varchar(128) NOT NULL,
  `quiz_id` int NOT NULL,
  `diary_id` int NOT NULL,
  `language_id` int NOT NULL,
  `answer_date` datetime NOT NULL,
  `choices` char(1) NOT NULL,
  `judgement` int NOT NULL,
  PRIMARY KEY (`team_id`,`user_id`,`quiz_id`,`diary_id`),
  KEY `quiz_id` (`quiz_id`,`diary_id`),
  KEY `language_id` (`language_id`),
  CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`quiz_id`, `diary_id`) REFERENCES `quiz` (`quiz_id`, `diary_id`),
  CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `language` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answer_set`
--

DROP TABLE IF EXISTS `answer_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer_set` (
  `set_id` int NOT NULL AUTO_INCREMENT,
  `team_id` varchar(128) NOT NULL,
  `user_id` varchar(128) NOT NULL,
  `diary_id` int NOT NULL,
  `answer_time` datetime NOT NULL,
  `correct_set` int NOT NULL,
  PRIMARY KEY (`set_id`),
  KEY `user_id` (`user_id`,`team_id`),
  KEY `diary_id` (`diary_id`),
  CONSTRAINT `answer_set_ibfk_1` FOREIGN KEY (`user_id`, `team_id`) REFERENCES `user` (`user_id`, `team_id`),
  CONSTRAINT `answer_set_ibfk_2` FOREIGN KEY (`diary_id`) REFERENCES `diary` (`diary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer_set`
--

LOCK TABLES `answer_set` WRITE;
/*!40000 ALTER TABLE `answer_set` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer_set` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash_quiz`
--

DROP TABLE IF EXISTS `cash_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cash_quiz` (
  `cash_quiz_id` int NOT NULL,
  `diary_id` int NOT NULL,
  `user_id` varchar(128) NOT NULL,
  `question` text NOT NULL,
  `correct` char(1) NOT NULL,
  `a` text NOT NULL,
  `b` text NOT NULL,
  `c` text NOT NULL,
  `d` text NOT NULL,
  PRIMARY KEY (`cash_quiz_id`,`diary_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_quiz`
--

LOCK TABLES `cash_quiz` WRITE;
/*!40000 ALTER TABLE `cash_quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `cash_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country` (
  `id` int NOT NULL,
  `country_name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (1,'Japan'),(2,'United States'),(3,'Portugal'),(4,'Spain'),(5,'China'),(6,'Taiwan'),(7,'South Korea'),(8,'Philippines'),(9,'Vietnam'),(10,'Indonesia'),(11,'Nepal'),(12,'France'),(13,'Germany'),(14,'Italy'),(15,'Russia'),(16,'India'),(17,'Brazil'),(18,'Mexico'),(19,'Turkey'),(20,'Australia'),(21,'Peru');
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diary`
--

DROP TABLE IF EXISTS `diary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diary` (
  `diary_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(128) NOT NULL,
  `title` varchar(128) NOT NULL,
  `diary_time` datetime NOT NULL,
  `main_language` int NOT NULL,
  `content` text NOT NULL,
  `thumbs_up` int DEFAULT '0',
  `love` int DEFAULT '0',
  `laugh` int DEFAULT '0',
  `surprised` int DEFAULT '0',
  `sad` int DEFAULT '0',
  PRIMARY KEY (`diary_id`),
  KEY `user_id` (`user_id`),
  KEY `main_language` (`main_language`),
  CONSTRAINT `diary_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `diary_ibfk_2` FOREIGN KEY (`main_language`) REFERENCES `language` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diary`
--

LOCK TABLES `diary` WRITE;
/*!40000 ALTER TABLE `diary` DISABLE KEYS */;
/*!40000 ALTER TABLE `diary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `language` (
  `language_id` int NOT NULL AUTO_INCREMENT,
  `language_name` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`language_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language`
--

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` VALUES (1,'日本語'),(2,'英語'),(3,'ポルトガル語'),(4,'スペイン語'),(5,'中国語（簡）'),(6,'中国語（繁）'),(7,'韓国語'),(8,'タガログ語'),(9,'ベトナム語'),(10,'インドネシア語'),(11,'ネパール語');
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `multilingual_diary`
--

DROP TABLE IF EXISTS `multilingual_diary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `multilingual_diary` (
  `diary_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(128) NOT NULL,
  `language_id` int NOT NULL,
  `title` varchar(128) NOT NULL,
  `diary_time` datetime NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`diary_id`,`user_id`,`language_id`),
  KEY `user_id` (`user_id`),
  KEY `language_id` (`language_id`),
  CONSTRAINT `multilingual_diary_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `multilingual_diary_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `language` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `multilingual_diary`
--

LOCK TABLES `multilingual_diary` WRITE;
/*!40000 ALTER TABLE `multilingual_diary` DISABLE KEYS */;
/*!40000 ALTER TABLE `multilingual_diary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `multilingual_quiz`
--

DROP TABLE IF EXISTS `multilingual_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `multilingual_quiz` (
  `quiz_id` int NOT NULL,
  `diary_id` int NOT NULL,
  `language_id` int NOT NULL,
  `question` text NOT NULL,
  `correct` char(1) NOT NULL,
  `a` text NOT NULL,
  `b` text NOT NULL,
  `c` text NOT NULL,
  `d` text NOT NULL,
  PRIMARY KEY (`quiz_id`,`diary_id`,`language_id`),
  KEY `language_id` (`language_id`),
  KEY `diary_id` (`diary_id`),
  CONSTRAINT `multilingual_quiz_ibfk_1` FOREIGN KEY (`language_id`) REFERENCES `language` (`language_id`),
  CONSTRAINT `multilingual_quiz_ibfk_2` FOREIGN KEY (`diary_id`) REFERENCES `diary` (`diary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `multilingual_quiz`
--

LOCK TABLES `multilingual_quiz` WRITE;
/*!40000 ALTER TABLE `multilingual_quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `multilingual_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz` (
  `quiz_id` int NOT NULL,
  `diary_id` int NOT NULL,
  `question` text NOT NULL,
  `correct` char(1) NOT NULL,
  `a` text NOT NULL,
  `b` text NOT NULL,
  `c` text NOT NULL,
  `d` text NOT NULL,
  PRIMARY KEY (`quiz_id`,`diary_id`),
  KEY `diary_id` (`diary_id`),
  CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`diary_id`) REFERENCES `diary` (`diary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team` (
  `team_id` varchar(128) NOT NULL,
  `team_name` varchar(128) NOT NULL,
  `team_time` datetime NOT NULL,
  `country` int NOT NULL,
  `age` int NOT NULL,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` varchar(128) NOT NULL,
  `team_id` varchar(128) NOT NULL,
  `password` varchar(64) NOT NULL,
  `name` varchar(32) NOT NULL,
  `main_language` int NOT NULL,
  `learn_language` int NOT NULL,
  `answer_count` int DEFAULT '0',
  `diary_count` int DEFAULT '0',
  `nickname` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`team_id`),
  KEY `team_id` (`team_id`),
  KEY `main_language` (`main_language`),
  KEY `learn_language` (`learn_language`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`),
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`main_language`) REFERENCES `language` (`language_id`),
  CONSTRAINT `user_ibfk_3` FOREIGN KEY (`learn_language`) REFERENCES `language` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-02 15:15:47
