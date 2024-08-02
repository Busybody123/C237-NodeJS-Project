-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2024 at 05:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quizdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `leaderboardId` int(10) NOT NULL,
  `username` varchar(100) NOT NULL,
  `quizId` int(10) NOT NULL,
  `attemptDate` date NOT NULL,
  `score` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaderboard`
--

INSERT INTO `leaderboard` (`leaderboardId`, `username`, `quizId`, `attemptDate`, `score`) VALUES
(1, 'Wee Yeow', 8, '2024-07-18', 5),
(2, 'admin', 1, '2024-07-18', 4),
(3, 'wee yeow', 8, '2024-07-18', 10),
(4, 'admin', 1, '2024-07-18', 8);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `questionId` int(11) NOT NULL,
  `question` varchar(300) NOT NULL,
  `options` varchar(500) DEFAULT NULL,
  `answer` int(10) NOT NULL,
  `marks` int(10) NOT NULL,
  `quizId` int(11) NOT NULL,
  `image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`questionId`, `question`, `options`, `answer`, `marks`, `quizId`, `image`) VALUES
(1, 'A whale can:', 'swim,crawl,walk,talk', 1, 2, 1, NULL),
(1, 'What percentage of our brain do we actually use?', '<10%,<25%,<50%,>50%', 4, 5, 8, NULL),
(2, 'A whale lives on:', 'Land,Sea,Air,Underground', 2, 1, 1, '182.webp'),
(2, 'Does sugar affect children\'s rowdy behavior?', 'Yes. Sugar makes children hyperactive,No. There is no actual evidence to support these claims,Yes. Sugar makes children happy,No. There is a negligible difference in children\'s behavior', 2, 5, 8, ''),
(3, 'A whale is a:', 'Reptile,Ampibian,turtle,fish', 4, 1, 1, NULL),
(3, 'You should pee on a jellyfish sting', 'No. Peeing on the sting will worsen the sting,Yes. Peeing on the sting will make the sting numb,No. Peeing on the sting will splash onto the victim,Yes. Peeing on the sting helps to disinfect the wound', 1, 3, 8, ''),
(4, 'A whale has: ', 'Gills,Fins ,An extra life,wheelchair', 1, 5, 1, 'whale.png');

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `quizId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(500) NOT NULL,
  `description` varchar(400) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`quizId`, `name`, `image`, `description`) VALUES
(1, 'Characteristics of a whale', '111.webp', 'Learn about whales, the largest animals on Earth, and their two types: toothed and baleen. Find out how whales communicate, feed, migrate, and face threats from h…'),
(7, 'Is wee yeow handsome', '184.webp', 'Hint: (yes)'),
(8, 'Myths', 'broccoli.png', 'Test you knowledge about popular myths!!! If you fail you watch too much TikTok');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`leaderboardId`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`questionId`,`quizId`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`quizId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `questionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `quizId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
