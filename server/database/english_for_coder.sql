/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50719
Source Host           : localhost:3306
Source Database       : english_for_coder

Target Server Type    : MYSQL
Target Server Version : 50719
File Encoding         : 65001

Date: 2019-08-22 22:16:37
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(20) NOT NULL,
  `account` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL DEFAULT '',
  `avatar` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `lastTime` bigint(20) DEFAULT NULL COMMENT '最近一次登陆时间',
  `root` int(1) NOT NULL DEFAULT '0' COMMENT '管理员权限',
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_website
-- ----------------------------
DROP TABLE IF EXISTS `user_website`;
CREATE TABLE `user_website` (
  `id` varchar(20) NOT NULL,
  `userID` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `off` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for word
-- ----------------------------
DROP TABLE IF EXISTS `word`;
CREATE TABLE `word` (
  `id` varchar(20) NOT NULL,
  `word` varchar(50) NOT NULL,
  `letter` varchar(1) NOT NULL,
  `type` varchar(20) DEFAULT '' COMMENT '词性',
  `mean` varchar(255) DEFAULT '',
  `pronounce` varchar(50) DEFAULT '' COMMENT '发音',
  `userID` varchar(20) NOT NULL DEFAULT '' COMMENT '添加者',
  `counter` int(11) NOT NULL DEFAULT '0' COMMENT '搜索计数',
  `like` int(11) NOT NULL DEFAULT '0',
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `verify` int(1) NOT NULL DEFAULT '0',
  `off` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for word_comment
-- ----------------------------
DROP TABLE IF EXISTS `word_comment`;
CREATE TABLE `word_comment` (
  `id` varchar(20) NOT NULL,
  `wordID` varchar(20) NOT NULL,
  `userID` varchar(20) NOT NULL,
  `comment` varchar(600) NOT NULL,
  `toUser` varchar(20) NOT NULL DEFAULT '' COMMENT '回复谁',
  `like` int(11) NOT NULL DEFAULT '0',
  `createTime` bigint(20) NOT NULL,
  `off` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for word_example
-- ----------------------------
DROP TABLE IF EXISTS `word_example`;
CREATE TABLE `word_example` (
  `id` varchar(20) NOT NULL,
  `wordID` varchar(20) NOT NULL,
  `en` varchar(255) NOT NULL,
  `zh` varchar(255) DEFAULT '',
  `userID` varchar(20) NOT NULL DEFAULT '' COMMENT '添加者',
  `like` int(11) NOT NULL DEFAULT '0',
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
