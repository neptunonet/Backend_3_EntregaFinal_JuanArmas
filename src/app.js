import express from 'express';
import swaggerUi from 'swagger-ui-express';
import adoptionsRouter from './routes/adoption.router.js';
import mongoose from 'mongoose';
import usersRouter from './routes/users.router.js';
import mocksRouter from './routes/mocks.router.js';
import sessionsRouter from './routes/sessions.router.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import petsRouter from './routes/pets.router.js';
import swaggerSpec from './utils/swaggerConfig.js';

// Variables de entorno
dotenv.config();

// Inicialización del Express app
const app = express();
const PORT = process.env.PORT || 8080;
const connection = process.env.MONGODB_URL;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Conexión a MongoDB
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB');
  // Iniciar el servidor después de conectar a MongoDB
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación de Swagger disponible en http://localhost:${PORT}/api-docs`);
  });
})
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  // Aquí puedes agregar lógica adicional para manejar errores no capturados
});

export default app;