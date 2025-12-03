-- Agregar columnas a la tabla CURSO si no existen
ALTER TABLE CURSO
ADD COLUMN IF NOT EXISTS DESCRIPCION TEXT,
ADD COLUMN IF NOT EXISTS URL_VIDEO VARCHAR(255);

-- Ejemplo de actualización para un curso de prueba
UPDATE CURSO 
SET 
  DESCRIPCION = 'En este curso aprenderás las técnicas fundamentales del automaquillaje artístico.',
  URL_VIDEO = 'https://www.youtube.com/embed/tu-video-id'
WHERE ID_CURSO = 1;