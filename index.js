const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://kit.fontawesome.com', "'unsafe-inline'", 'https://player.vimeo.com'],
      scriptSrcAttr: ["'unsafe-inline'"],
      scriptSrcElem: ["'self'", "'unsafe-inline'", 'https://kit.fontawesome.com', 'https://player.vimeo.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://*.fontawesome.com'], // Agregado permiso estilos
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://*.fontawesome.com'], // <--- AQUÍ ESTABA EL PROBLEMA (Agregado permiso fuentes)
      imgSrc: ["'self'", 'data:', 'https://*'],
      connectSrc: ["'self'", BASE_URL || "'self'", 'https://player.vimeo.com', 'https://ka-f.fontawesome.com'],
      frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://player.vimeo.com', 'https://vimeo.com', 'https://i.vimeocdn.com'],
      childSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://player.vimeo.com', 'https://vimeo.com', 'https://i.vimeocdn.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    }
  }
};