-- Actualizar URLs de videos para los cursos
UPDATE CURSO 
SET URL_VIDEO = 'https://www.youtube-nocookie.com/embed/Wl9mAg4A2T8?rel=0&modestbranding=1&origin=https://leroy-pricklier-distemperately.ngrok-free.dev'
WHERE ID_CURSO = 1;

UPDATE CURSO 
SET URL_VIDEO = 'https://onedrive.live.com/download?cid=B91BC57EA45EB4C5&resid=B91BC57EA45EB4C5%211586&authkey=ABuJOeeoCCC2-YU'
WHERE ID_CURSO = 2;

-- Para el tercer curso podemos dejar el ejemplo por ahora
UPDATE CURSO 
SET URL_VIDEO = 'https://www.youtube.com/embed/ejemplo3'
WHERE ID_CURSO = 3;