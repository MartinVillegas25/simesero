const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const { socketController } = require('../sockets/controller');
const {path, join} = require('path');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = require('http').createServer(this.app);
		this.io = require('socket.io')(this.server);
		this.paths = {
			main: '/'
		};
		//middlewares
		this.middelewares();

		//routers
		this.router();

		// Sockets
		this.sockets();
	}

	middelewares() {

		//directorio static
		this.app.use(express.static(join(__dirname,'../client/dist')));
		// Middleware para desactivar el almacenamiento en caché a nivel global
				this.app.use((req, res, next) => {
					res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
					res.setHeader('Pragma', 'no-cache');
					res.setHeader('Expires', '0');
					next();
				  });

		this.app.use(cors());
		this.app.use(morgan('dev'));

		//para obtener datos del front en json
		this.app.use(express.json());

		//subida de imagenes
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: './uploads',
				createParentPath: true
			})
		);
	}

	router() {
		this.app.use(this.paths.main, require('../routes/routes'));
	}
	sockets() {
		this.io.on('connection', socketController);
	}
	listen() {
		this.server.listen(this.port, () => {
			console.log('listening on port', this.port);
		});
	}
}

module.exports = Server;
