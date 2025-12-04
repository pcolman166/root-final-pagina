require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const http = require("http");
const cors = require("cors");
const session = require("express-session");
const axios = require("axios");
const helmet = require("helmet");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const bcrypt = require("bcrypt");
const path = require("path"); 
const fs = require('fs');
const PDFDocument = require('pdfkit');
const multer = require('multer');
// NUEVA LIBRERÍA PARA GUARDAR SESIÓN EN MYSQL
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const PORT = process.env.PORT || 3030;

let BASE_URL = process.env.BASE_URL || '';
if (BASE_URL && !/^https?:\/\//i.test(BASE_URL)) {
  BASE_URL = 'https://' + BASE_URL;
}

console.log('🔧 Iniciando aplicación (NODE_ENV=' + (process.env.NODE_ENV || 'development') + ')');
console.log('🔧 Cargando variables de entorno relevantes: PORT=' + PORT + ', BASE_URL=' + BASE_URL);

process.on('uncaughtException', (err) => {
  console.error('💥 Excepción no capturada:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Rechazo de promesa no manejado:', reason);
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ----------------- Conexión a la DB -----------------
let conexion;

const dbOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const connectWithRetry = () => {
  conexion = mysql.createConnection(dbOptions);

  conexion.connect(err => {
    if (err) {
      console.error('❌ Error conectando a MySQL:', err && err.code ? err.code : err.message || err);
      try { conexion.destroy(); } catch (e) { }
      setTimeout(connectWithRetry, 5000);
      return;
    }
    console.log("🟢 Conectado a la base de datos");
  });

  conexion.on('error', (err) => {
    console.error('💥 Error en conexión MySQL (evento):', err && err.code ? err.code : err.message || err);
    if (err && (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal)) {
      console.log('🔁 Reintentando conexión a MySQL...');
      setTimeout(connectWithRetry, 2000);
    }
  });
};

connectWithRetry();

// ----------------- Middlewares -----------------
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://kit.fontawesome.com', "'unsafe-inline'", 'https://player.vimeo.com'],
      scriptSrcAttr: ["'unsafe-inline'"],
      scriptSrcElem: ["'self'", "'unsafe-inline'", 'https://kit.fontawesome.com', 'https://player.vimeo.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://*.fontawesome.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://*.fontawesome.com'],
      imgSrc: ["'self'", 'data:', 'https://*'],
      connectSrc: ["'self'", BASE_URL || "'self'", 'https://player.vimeo.com', 'https://ka-f.fontawesome.com'],
      frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://player.vimeo.com', 'https://vimeo.com', 'https://i.vimeocdn.com'],
      childSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://player.vimeo.com', 'https://vimeo.com', 'https://i.vimeocdn.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    }
  }
};
app.use(helmet(helmetOptions));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use('/js', express.static(path.join(__dirname, 'views', 'js')));

app.enable('trust proxy');

// --- CONFIGURACIÓN DE STORE DE SESIONES (MYSQL) ---
const sessionStore = new MySQLStore({
    ...dbOptions,
    createDatabaseTable: true // Crea la tabla 'sessions' automáticamente si no existe
});

app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'tu-secreto-seguro',
    store: sessionStore, // AQUÍ SE GUARDA LA SESIÓN EN LA DB
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: (process.env.NODE_ENV === 'production'),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      sameSite: (process.env.NODE_ENV === 'production') ? 'none' : 'lax',
      path: '/'
    }
}));

const allowedOrigins = [ 'http://localhost:3030' ];
if (BASE_URL) allowedOrigins.push(BASE_URL);

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    if (BASE_URL && origin.startsWith(BASE_URL)) return callback(null, true);
    if ((process.env.NODE_ENV || 'development') !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    // Si hay sesión, la refrescamos
    if (req.session?.usuarioID) {
        req.session.touch();
    }
    next();
});

const staticOptions = {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'public, max-age=3600');
    }
};

app.use("/css", express.static(__dirname + "/views/css", staticOptions));
app.use("/imagenes", express.static(__dirname + "/views/imagenes", staticOptions));
app.use(express.static(path.join(__dirname, 'views'), staticOptions));

// Middleware de seguridad
const verificarSesion = (req, res, next) => {
    if (!req.session?.usuarioID) {
        console.log('❌ Acceso denegado: no hay sesión');
        return res.redirect('/login');
    }
    next();
};

// ====================================================================
// RUTAS PRINCIPALES
// ====================================================================

// Ruta PÚBLICA de cursos
app.get("/cursos", (req, res) => {
    const usuarioID = req.session ? req.session.usuarioID : null;
    console.log('🎓 Mostrando cursos. Usuario:', usuarioID || 'Invitado');
    
    // Quitamos columna IMAGEN y usamos ASC
    const sql = `
        SELECT ID_CURSO, NOMBRE_CURSO, DESCRIPCION, PRECIO, URL_VIDEO
        FROM curso
        ORDER BY ID_CURSO ASC
    `;
    
    conexion.query(sql, (err, cursos) => {
        if (err) {
            console.error('Error al obtener cursos:', err);
            return res.status(500).send('Error al cargar los cursos: ' + err.message);
        }
        
        res.render("cursos", { 
            usuarioID: usuarioID,
            usuario: req.session ? req.session.usuario : null,
            cursos: cursos
        });
    });
});

app.get("/login", (req, res) => {
  if (req.session?.usuarioID) {
    return res.redirect(req.session.rol === "admin" ? "/admin" : "/index1");
  }
  res.render("login");
});

app.get("/registro", (req, res) => {
  res.render("registro");
});

app.get("/carrito", verificarSesion, (req, res) => {
  res.render("carrito", { usuarioID: req.session.usuarioID });
});

app.get("/perfil", verificarSesion, (req, res) => {
  res.render("perfil", { usuarioID: req.session.usuarioID });
});

app.get("/editar-cuenta", verificarSesion, (req, res) => {
  const sql = `SELECT p.EMAIL, p.NOMBRE as nombre, p.APELLIDO as apellido, p.TELEFONO as telefono
               FROM persona p JOIN usuario u ON p.DNI = u.DNI WHERE u.ID_USUARIO = ?`;
  conexion.query(sql, [req.session.usuarioID], (err, results) => {
    if (err) return res.render("editar-cuenta", { error: "Error al cargar los datos" });
    const row = results[0] || {};
    res.render("editar-cuenta", { 
      email: row.EMAIL || '',
      nombre: row.nombre || '',
      apellido: row.apellido || '',
      telefono: row.telefono || ''
    });
  });
});

app.post('/actualizar-perfil', verificarSesion, (req, res) => {
  const { nombre, apellido, telefono } = req.body;
  const sqlUpdate = `UPDATE persona p JOIN usuario u ON p.DNI = u.DNI SET p.NOMBRE = ?, p.APELLIDO = ?, p.TELEFONO = ? WHERE u.ID_USUARIO = ?`;
  conexion.query(sqlUpdate, [nombre, apellido, telefono || null, req.session.usuarioID], (err) => {
      if (err) return res.render('editar-cuenta', { error: 'Error al actualizar' });
      return res.render('editar-cuenta', { success: 'Perfil actualizado', nombre, apellido, telefono, email: req.body.email || '' });
  });
});

app.post("/actualizar-email", verificarSesion, (req, res) => {
  const { "email-nuevo": nuevoEmail } = req.body;
  const sql = "UPDATE persona p JOIN usuario u ON p.DNI = u.DNI SET p.EMAIL = ? WHERE u.ID_USUARIO = ?";
  conexion.query(sql, [nuevoEmail, req.session.usuarioID], (err) => {
      if (err) return res.render("editar-cuenta", { error: "Error al actualizar" });
      res.render("editar-cuenta", { success: "Email actualizado", email: nuevoEmail });
  });
});

app.post("/actualizar-password", verificarSesion, async (req, res) => {
  const { "pass-actual": passActual, "pass-nuevo": passNuevo } = req.body;
  const sqlVerificar = "SELECT CONTRASENIA FROM usuario WHERE ID_USUARIO = ?";
  conexion.query(sqlVerificar, [req.session.usuarioID], async (err, results) => {
      if (err || !results[0]) return res.render("editar-cuenta", { error: "Error" });
      const usuario = results[0];
      const esValida = await bcrypt.compare(passActual, usuario.CONTRASENIA);
      if (!esValida) return res.render("editar-cuenta", { error: "Contraseña incorrecta" });
      
      const hash = await bcrypt.hash(passNuevo, 10);
      const sqlUpdate = "UPDATE usuario SET CONTRASENIA = ? WHERE ID_USUARIO = ?";
      conexion.query(sqlUpdate, [hash, req.session.usuarioID], (err) => {
          if (err) return res.render("editar-cuenta", { error: "Error al actualizar" });
          res.render("editar-cuenta", { success: "Contraseña actualizada" });
      });
  });
});

app.get("/sobremi", (req, res) => {
    res.render("sobremi", { usuario: req.session ? req.session.usuario : null });
});

app.get("/contacto", (req, res) => {
    res.render("contacto", { usuario: req.session ? req.session.usuario : null });
});

app.get("/servicios", (req, res) => {
    res.render("servicios", { usuario: req.session ? req.session.usuario : null });
});

app.get("/", (req, res) => {
    if (req.session?.usuarioID) {
        return res.redirect(req.session.rol === "admin" ? "/admin" : "/index1");
    }
    res.redirect('/index1');
});

app.get("/index1", (req, res) => {
    res.render("index1", { usuario: req.session ? req.session.usuario : null });
});

// ----------------- Login y Registro -----------------

app.post("/iniciar", async (req, res) => {
    const { usuarioIng, contrasenaIng } = req.body;
    const consultaUsuario = "SELECT * FROM usuario WHERE NOMBRE = ?";
    conexion.query(consultaUsuario, [usuarioIng], async (error, resultadoUsuario) => {
        if (error || resultadoUsuario.length === 0) return res.status(401).send("Usuario no encontrado");
        
        const usuario = resultadoUsuario[0];
        const esValida = await bcrypt.compare(contrasenaIng, usuario.CONTRASENIA);
        if (!esValida) return res.status(401).send("Contraseña incorrecta");

        const esAdmin = await new Promise((resolve) => {
            conexion.query('SELECT 1 FROM ADMINISTRADOR WHERE ID_USUARIO = ?', [usuario.ID_USUARIO], (err, results) => {
                resolve(results && results.length > 0);
            });
        });

        req.session.usuarioID = usuario.ID_USUARIO;
        req.session.rol = esAdmin ? "admin" : "usuario";
        req.session.usuario = usuario.NOMBRE;
        
        req.session.save(() => {
            res.redirect(req.session.rol === "admin" ? "/admin" : "/index1");
        });
    });
});

app.post("/registrar", async (req, res) => {
  const { nombre, apellido, DNI, correo, telefono, contrasena } = req.body;
  const hash = await bcrypt.hash(contrasena, 10);
  
  const regPersona = "INSERT INTO persona (DNI, NOMBRE, APELLIDO, EMAIL, TELEFONO) VALUES (?, ?, ?, ?, ?)";
  conexion.query(regPersona, [DNI, nombre, apellido, correo, telefono], (errP) => {
      if (errP) return res.status(500).send("Error registrando persona");
      const regUsuario = "INSERT INTO usuario (DNI, NOMBRE, CONTRASENIA) VALUES (?, ?, ?)";
      conexion.query(regUsuario, [DNI, correo, hash], (errU) => {
          if (errU) return res.status(500).send("Error registrando usuario");
          res.redirect('/login?registro=exito');
      });
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get('/dashboard', verificarSesion, (req, res) => {
    const usuario = req.session.usuario;
    const sql = `
        SELECT c.ID_CARRITO, c.ID_CURSO, cr.NOMBRE_CURSO, cr.PRECIO, c.FECHACOMPRA,
               DATE_ADD(c.FECHACOMPRA, INTERVAL 30 DAY) AS expiresOn,
               DATEDIFF(DATE_ADD(c.FECHACOMPRA, INTERVAL 30 DAY), CURDATE()) AS diasRestantes
        FROM CARRITO c
        JOIN COMPROBANTE comp ON comp.ID_CARRITO = c.ID_CARRITO
        LEFT JOIN CURSO cr ON c.ID_CURSO = cr.ID_CURSO
        WHERE c.ID_USUARIO = ?
        ORDER BY c.FECHACOMPRA DESC
    `;
    conexion.query(sql, [req.session.usuarioID], (err, results) => {
        const courses = (results || []).map(r => ({
            id: r.ID_CURSO,
            title: r.NOMBRE_CURSO,
            diasRestantes: Number(r.diasRestantes) >= 0 ? Number(r.diasRestantes) : 0
        }));
        res.render('dashboard', { usuario, courses });
    });
});

// ----------------- Mercado Pago -----------------
const verificarDatosPago = (req, res, next) => {
    if (!process.env.MP_ACCESS_TOKEN || !process.env.MP_PUBLIC_KEY) {
        console.error('❌ Error: Faltan credenciales de MercadoPago');
        return res.status(500).send('Error de configuración del servidor');
    }
    next();
};

app.get("/configMercadoPago", (req, res) => {
  res.json({ publicKey: process.env.MP_PUBLIC_KEY });
});

app.get('/generar', verificarSesion, verificarDatosPago, async (req, res) => {
    try {
        const usuarioID = req.session.usuarioID;
        const cursoId = req.query.cursoId;
        
        const curso = await new Promise((resolve, reject) => {
            conexion.query('SELECT * FROM CURSO WHERE ID_CURSO = ?', [cursoId], (err, res) => {
                if (err) return reject(err);
                resolve(res[0]);
            });
        });

        if (!curso) return res.status(404).send('Curso no encontrado');

        const existePago = await new Promise((resolve) => {
            const sql = `SELECT 1 FROM COMPROBANTE comp JOIN CARRITO c ON comp.ID_CARRITO = c.ID_CARRITO WHERE c.ID_USUARIO = ? AND c.ID_CURSO = ? LIMIT 1`;
            conexion.query(sql, [usuarioID, curso.ID_CURSO], (err, res) => resolve(res && res.length > 0));
        });

        if (existePago) return res.redirect('/dashboard');

        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const preference = {
            items: [{
                id: String(curso.ID_CURSO),
                title: curso.NOMBRE_CURSO,
                quantity: 1,
                unit_price: Number(curso.PRECIO),
                currency_id: 'ARS'
            }],
            back_urls: {
                success: `${BASE_URL}/success`,
                failure: `${BASE_URL}/failure`,
                pending: `${BASE_URL}/pending`
            },
            auto_return: 'approved',
            external_reference: `${usuarioID}-${curso.ID_CURSO}`,
            notification_url: `${BASE_URL}/notificar?usuario=${usuarioID}&curso=${curso.ID_CURSO}`
        };

        const response = await new Preference(client).create({ body: preference });
        if (response.init_point) {
            return res.redirect(response.init_point);
        } else {
            return res.redirect('/failure');
        }

    } catch (error) {
        console.error('Error generando pago:', error);
        res.status(500).send('Error en pago');
    }
});

app.all('/notificar', async (req, res) => {
    res.sendStatus(200);
});

// ----------------- Admin -----------------
const verificarAdmin = (req, res, next) => {
  if (!req.session?.usuarioID) return res.redirect('/login');
  conexion.query('SELECT 1 FROM ADMINISTRADOR WHERE ID_USUARIO = ? LIMIT 1', [req.session.usuarioID], (err, results) => {
    if (!results || results.length === 0) return res.redirect('/login');
    next();
  });
};

app.get('/admin', verificarAdmin, (req, res) => {
  res.render('admin-landing', { admin: req.session.usuario });
});

app.get('/admin/panel', verificarAdmin, async (req, res) => {
    res.render("admin", { 
        admin: req.session.usuario,
        stats: { totalUsuarios: 0, totalCursos: 0, ventasTotales: 0, ventasMes: 0 },
        usuarios: [],
        cursos: [],
        ventas: []
    });
});

http.createServer(app).listen(PORT, () => {
  console.log("🚀 Servidor activo en puerto " + PORT);
});