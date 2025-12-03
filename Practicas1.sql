-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2025 a las 02:31:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `practicas1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `ID_ADMINISTRADOR` bigint(20) NOT NULL,
  `ID_USUARIO` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`ID_ADMINISTRADOR`, `ID_USUARIO`) VALUES
(1, 1),
(2, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `ID_CARRITO` bigint(20) NOT NULL,
  `ID_USUARIO` bigint(20) DEFAULT NULL,
  `ID_CURSO` bigint(20) DEFAULT NULL,
  `CANTIDAD` int(11) DEFAULT NULL,
  `FECHACOMPRA` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`ID_CARRITO`, `ID_USUARIO`, `ID_CURSO`, `CANTIDAD`, `FECHACOMPRA`) VALUES
(1, 1, 1, 1, '2025-10-29'),
(2, 2, 2, 1, '2025-10-29'),
(3, 5, 2, 1, '2025-10-29'),
(4, 5, 1, 1, '2025-10-29'),
(5, 5, 2, 1, '2025-10-29'),
(7, 5, 3, 1, '2025-10-30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `ID_CATEGORIA` bigint(20) NOT NULL,
  `NOMBRE_CATEGORIA` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`ID_CATEGORIA`, `NOMBRE_CATEGORIA`) VALUES
(1, 'Novias'),
(2, 'Noche'),
(3, 'Artístico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `certificados`
--

CREATE TABLE `certificados` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `archivo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `certificados`
--

INSERT INTO `certificados` (`id`, `nombre`, `fecha`, `archivo`) VALUES
(1, 'Certificado Curso Día - Marcos', '2025-10-29', 'certificados/marcos-dia.pdf'),
(2, 'Certificado Curso Noche - Lucía', '2025-10-29', 'certificados/lucia-noche.pdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobante`
--

CREATE TABLE `comprobante` (
  `ID_COMPROBANTE` bigint(20) NOT NULL,
  `ID_CARRITO` bigint(20) DEFAULT NULL,
  `ID_USUARIO` bigint(20) DEFAULT NULL,
  `NUM_OP` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comprobante`
--

INSERT INTO `comprobante` (`ID_COMPROBANTE`, `ID_CARRITO`, `ID_USUARIO`, `NUM_OP`) VALUES
(1, 1, 1, 9876543210),
(2, 2, 2, 9876543211),
(3, 3, 5, 131775331822),
(4, 4, 5, 131776223390),
(5, 5, 5, 131180101291),
(7, 7, 5, 131285597787);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `ID_CURSO` bigint(20) NOT NULL,
  `NOMBRE_CURSO` varchar(100) DEFAULT NULL,
  `ID_CATEGORIA` bigint(20) DEFAULT NULL,
  `PRECIO` decimal(10,2) NOT NULL DEFAULT 100.00,
  `DESCRIPCION` text DEFAULT NULL,
  `URL_VIDEO` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`ID_CURSO`, `NOMBRE_CURSO`, `ID_CATEGORIA`, `PRECIO`, `DESCRIPCION`, `URL_VIDEO`) VALUES
(1, 'Curso de Automaquillaje de día', 1, 100.00, 'En este curso aprenderás las técnicas fundamentales del automaquillaje artístico.', 'https://www.youtube-nocookie.com/embed/Wl9mAg4A2T8?rel=0&modestbranding=1'),
(2, 'Curso de Automaquillaje de noche', 2, 100.00, NULL, 'https://onedrive.live.com/download?cid=B91BC57EA45EB4C5&resid=B91BC57EA45EB4C5%211586&authkey=ABuJOeeoCCC2-YU'),
(3, 'Curso de Automaquillaje artístico', 3, 100.00, NULL, 'https://www.youtube.com/embed/ejemplo3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mp_notificaciones`
--

CREATE TABLE `mp_notificaciones` (
  `ID` int(11) NOT NULL,
  `RECIBIDO_AT` datetime DEFAULT current_timestamp(),
  `QUERY` text DEFAULT NULL,
  `BODY` text DEFAULT NULL,
  `HEADERS` text DEFAULT NULL,
  `PROCESADO` tinyint(1) DEFAULT 0,
  `NOTA` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `DNI` bigint(20) NOT NULL,
  `NOMBRE` varchar(45) DEFAULT NULL,
  `APELLIDO` varchar(45) DEFAULT NULL,
  `EMAIL` varchar(50) DEFAULT NULL,
  `TELEFONO` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`DNI`, `NOMBRE`, `APELLIDO`, `EMAIL`, `TELEFONO`) VALUES
(123456, 'hola', 'hola', 'HOLA@GMAIL.COM', '2444444'),
(20123456, 'Marcos', 'Gómez', 'marcos@example.com', '1155550001'),
(30123457, 'Lucía', 'Pérez', 'lucia@example.com', '1155550002'),
(40123458, 'Ana', 'Rodríguez', 'ana@example.com', '1155550003'),
(123456789, 'marcos', 'ford', 'marcos@gmail.com', '24272323');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenia`
--

CREATE TABLE `resenia` (
  `ID_RESENIA` bigint(20) NOT NULL,
  `ID_USUARIO` bigint(20) NOT NULL,
  `ID_CURSO` bigint(20) NOT NULL,
  `CALIFICACION` int(11) NOT NULL,
  `COMENTARIO` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resenia`
--

INSERT INTO `resenia` (`ID_RESENIA`, `ID_USUARIO`, `ID_CURSO`, `CALIFICACION`, `COMENTARIO`) VALUES
(1, 1, 1, 5, 'Excelente curso, muy práctico.'),
(2, 2, 2, 4, 'Muy buena explicación, repetiría.'),
(3, 3, 3, 5, 'Creativo y profesional.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_USUARIO` bigint(20) NOT NULL,
  `NOMBRE` varchar(45) NOT NULL,
  `CONTRASENIA` varchar(100) NOT NULL,
  `DNI` bigint(20) NOT NULL,
  `ID_CURSO` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_USUARIO`, `NOMBRE`, `CONTRASENIA`, `DNI`, `ID_CURSO`) VALUES
(1, 'marcos@example.com', '$2b$10$EXAMPLEEXAMPLEEXAMPLEEXAMPLEEXAMPLEEXAMPLEEXAMPL', 20123456, 1),
(2, 'lucia@example.com', '$2b$10$EXAMPLEEXAMPLEEXAMPLEEXAMPLEEXAMPLEEXAMPLEEXAMPL', 30123457, 2),
(3, 'ana@example.com', '$2b$10$EXAMPLEEXAMPLEEXAMPLEEXAMPLEEXAMPLEEXAMPLEEXAMPL', 40123458, 3),
(4, 'HOLA@GMAIL.COM', '$2b$10$H6ROwdnF1S.nT19vZtNAOu99567Os7ftnUvoJdKYOjak/nMVMbzqO', 123456, NULL),
(5, 'marcos@gmail.com', '$2b$10$pIJYCx5r9hJhvWERqJc/GupHhdiS1SGWjr63nk.6GpWm.wAqX4d9C', 123456789, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`ID_ADMINISTRADOR`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`);

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`ID_CARRITO`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`),
  ADD KEY `ID_CURSO` (`ID_CURSO`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`ID_CATEGORIA`);

--
-- Indices de la tabla `certificados`
--
ALTER TABLE `certificados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `comprobante`
--
ALTER TABLE `comprobante`
  ADD PRIMARY KEY (`ID_COMPROBANTE`),
  ADD UNIQUE KEY `NUM_OP` (`NUM_OP`),
  ADD KEY `ID_CARRITO` (`ID_CARRITO`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`ID_CURSO`),
  ADD KEY `ID_CATEGORIA` (`ID_CATEGORIA`);

--
-- Indices de la tabla `mp_notificaciones`
--
ALTER TABLE `mp_notificaciones`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`DNI`);

--
-- Indices de la tabla `resenia`
--
ALTER TABLE `resenia`
  ADD PRIMARY KEY (`ID_RESENIA`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`),
  ADD KEY `ID_CURSO` (`ID_CURSO`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_USUARIO`),
  ADD KEY `ID_CURSO` (`ID_CURSO`),
  ADD KEY `DNI` (`DNI`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `ID_ADMINISTRADOR` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `ID_CARRITO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `ID_CATEGORIA` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `certificados`
--
ALTER TABLE `certificados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `comprobante`
--
ALTER TABLE `comprobante`
  MODIFY `ID_COMPROBANTE` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `ID_CURSO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `mp_notificaciones`
--
ALTER TABLE `mp_notificaciones`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resenia`
--
ALTER TABLE `resenia`
  MODIFY `ID_RESENIA` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_USUARIO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`);

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`ID_CURSO`) REFERENCES `curso` (`ID_CURSO`);

--
-- Filtros para la tabla `comprobante`
--
ALTER TABLE `comprobante`
  ADD CONSTRAINT `comprobante_ibfk_1` FOREIGN KEY (`ID_CARRITO`) REFERENCES `carrito` (`ID_CARRITO`),
  ADD CONSTRAINT `comprobante_ibfk_2` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`);

--
-- Filtros para la tabla `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`ID_CATEGORIA`) REFERENCES `categoria` (`ID_CATEGORIA`);

--
-- Filtros para la tabla `resenia`
--
ALTER TABLE `resenia`
  ADD CONSTRAINT `resenia_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`),
  ADD CONSTRAINT `resenia_ibfk_2` FOREIGN KEY (`ID_CURSO`) REFERENCES `curso` (`ID_CURSO`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`ID_CURSO`) REFERENCES `curso` (`ID_CURSO`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`DNI`) REFERENCES `persona` (`DNI`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
