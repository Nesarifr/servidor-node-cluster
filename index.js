'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var HttpServer = _interopRequireWildcard(_http);

var _socket = require('socket.io');

var IoServer = _interopRequireWildcard(_socket);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _expressHandlebars = require('express-handlebars');

var _productos = require('./src/router/productos.js');

var _info = require('./src/router/info.js');

var _login = require('./src/router/login.js');

var _login2 = _interopRequireDefault(_login);

var _random = require('./src/router/random.js');

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _connectMongo = require('connect-mongo');

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('./config.js');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _ContenedorArchivo = require('./src/managers/ContenedorArchivo.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* ------------------- import de clase contenedora y otros ------------------ */


/* --------------------------- constantes globales -------------------------- */
var chatsUsers = new _ContenedorArchivo.ContenedorArchivo('chats');
var apiproducts = new _ContenedorArchivo.ContenedorArchivo('products');
var options = { default: { p: 8080, mode: "FORK" }, alias: { p: "puerto", m: "mode" } };
var objArguments = (0, _minimist2.default)(process.argv.slice(2), options);
var port = objArguments.puerto;
var modo = objArguments.mode;
console.log(port, modo);
/* ------------------- constantes necesarias del servidor ------------------- */
var app = (0, _express2.default)();
var httpServer = new HttpServer.createServer(app);
//io: servidor de Websocket
var io = new IoServer.Server(httpServer); //conectamos con el servidor principal Http
var __filename = (0, _url.fileURLToPath)(process.argv[1]);
// ^^^ Esta es una variable especial que contiene toda la meta información relativa al módulo, de forma que podremos acceder al contexto del módulo.
var __dirname = _path2.default.dirname(__filename);
var PORT = port || 3000;

/* ------------------------------- configuracion del servidor ------------------------------- */
app.use(_express2.default.static(__dirname + '/src/public'));
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));

/* ------------------------------- Conexion a la base de datos ------------------------------- */
var mongoUrl = _config.config.MONGOURLBD;

_mongoose2.default.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (error) {
    if (error) return console.log('Hubo un error conectandose a la base ' + error);
    console.log("conexion a la base de datos de manera exitosa");
});

/* ------------------------------- configuracion de SESSION ------------------------------- */
app.use((0, _expressSession2.default)({
    store: _connectMongo2.default.create({
        mongoUrl: _config.config.MONGOURLSESSION
    }),
    secret: "claveCualquiera",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000 //10 min
    }
}));

/* --------------------------- configurar passport -------------------------- */
app.use(_passport2.default.initialize()); //conectamos a passport con express.
app.use(_passport2.default.session()); //vinculacion entre passport y las sesiones de nuestros usuarios.

/* ------------------- rutas /api/productos ------------------- */
app.use('/api/productos', _productos.routerProducts);
app.use('/api/login', _login2.default);
app.use('/api/info', _info.routerInfo);
app.use('/api/randoms', _random.routerRandom);

/* ---------------------- definicion motor de plantilla --------------------- */
app.engine('hbs', (0, _expressHandlebars.engine)({ extname: 'hbs' }));
app.set('views', _path2.default.join(__dirname, '/src/public/views')); //ubicacion de templates
app.set('view engine', 'hbs'); // definitar motor para express

/* -------------------- Se crea el servidor y se enciende ------------------- */

if (modo === "CLUSTER" && _cluster2.default.isPrimary) {
    var numCPUS = _os2.default.cpus().length;
    console.log(numCPUS);
    for (var index = 0; index < numCPUS; index++) {
        _cluster2.default.fork(); // se crean los subprocesos
    }
    _cluster2.default.on("exit", function (worker) {
        console.log('el subproceso ' + worker.process.pid + ' fallo');
    });
} else {

    httpServer.listen(PORT, function () {
        return console.log('Server listening on port ' + PORT + ' on process ' + process.pid);
    });
    /* -------------------------- serializar un usuario ------------------------- */
    _passport2.default.serializeUser(function (user, done) {
        done(null, user.id);
    });

    /* --------- GET '/' -> devuelve todos los productos, conecto con handlebars --------- */
    var checkUserLogged = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!req.session.username) {
                                _context.next = 4;
                                break;
                            }

                            next();
                            _context.next = 5;
                            break;

                        case 4:
                            return _context.abrupt('return', res.redirect('/api/login'));

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function checkUserLogged(_x, _x2, _x3) {
            return _ref.apply(this, arguments);
        };
    }();

    app.get('/', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
            var user, productosAll;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;

                            if (req.isAuthenticated()) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt('return', res.redirect('./api/login'));

                        case 3:
                            user = req.session.username;
                            _context2.next = 6;
                            return apiproducts.getAllRandom();

                        case 6:
                            productosAll = _context2.sent;

                            if (!productosAll) {
                                _context2.next = 11;
                                break;
                            }

                            return _context2.abrupt('return', res.render('home', { productos: productosAll, user: user }));

                        case 11:
                            res.render('partials/error', { productos: { error: 'No existe una lista de productos todavia' } });

                        case 12:
                            _context2.next = 17;
                            break;

                        case 14:
                            _context2.prev = 14;
                            _context2.t0 = _context2['catch'](0);

                            res.status(500).send('Error en el servidor');

                        case 17:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[0, 14]]);
        }));

        return function (_x4, _x5) {
            return _ref2.apply(this, arguments);
        };
    }());

    /* ---------------------- Websocket --------------------- */
    io.on('connection', function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(socket) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.t0 = socket;
                            _context4.next = 3;
                            return apiproducts.getAllRandom();

                        case 3:
                            _context4.t1 = _context4.sent;

                            _context4.t0.emit.call(_context4.t0, 'allProducts', _context4.t1);

                            //nuevo producto
                            socket.on('newProduct', function () {
                                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(newProducto) {
                                    var productosAll;
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    newProducto.price = parseFloat(newProducto.price);
                                                    _context3.next = 3;
                                                    return _productos.products.save(newProducto);

                                                case 3:
                                                    _context3.next = 5;
                                                    return _productos.products.getAllRandom();

                                                case 5:
                                                    productosAll = _context3.sent;

                                                    io.sockets.emit('refreshTable', productosAll);

                                                case 7:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, undefined);
                                }));

                                return function (_x7) {
                                    return _ref4.apply(this, arguments);
                                };
                            }());

                        case 6:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        }));

        return function (_x6) {
            return _ref3.apply(this, arguments);
        };
    }());
    //mensajes hasta el inicio
    //     socket.emit('allMensajes', await normalizarMensajes())
    //nuevo msj
    //     socket.on('newMsjChat', async newMsjChat =>{
    //         await chatsUsers.save(newMsjChat);
    //         const msjsAll = await normalizarMensajes()
    //         io.sockets.emit('refreshChat', msjsAll )
    //     })

    // })

    /* ------------------------- normalizar los mensajes ------------------------ */
    /* --------------------------- schemas de mensajes -------------------------- */

    /* ------------------------- aplicando normalizacion ------------------------ */
    // const normalizarChat = (msjs)=>{
    //     const normalizeData = normalize({id:"Chat-Historial", chat: msjs}, chatSchema);
    //     return normalizeData;
    // }

    // const normalizarMensajes = async ()=>{
    //     const results = await chatsUsers.getAll();
    //     const mensajesNormalizados = normalizarChat(results);
    //     return mensajesNormalizados;
    // }
}
