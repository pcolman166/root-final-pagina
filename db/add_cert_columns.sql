-- Añadir columnas para texto de certificado en la tabla curso (si no existen)
ALTER TABLE curso
  ADD COLUMN IF NOT EXISTS CERT_TITULO VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS CERT_LINEA TEXT DEFAULT NULL;

-- Ejemplos: actualizar algunos cursos con texto personalizado
UPDATE curso SET CERT_TITULO = 'Certifico que', CERT_LINEA = 'Ha realizado el curso ''Curso de Automaquillaje de noche'' en ROOT School.' WHERE ID_CURSO = 2;
UPDATE curso SET CERT_TITULO = 'Certifico que', CERT_LINEA = 'Ha realizado el curso ''Curso de Automaquillaje de día'' en ROOT School.' WHERE ID_CURSO = 1;
