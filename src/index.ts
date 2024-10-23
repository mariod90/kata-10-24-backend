import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import taskRoutes from './infrastructure/web/routes';
import cors from 'cors';
import { connectToDatabase } from './config/db';

const app: Application = express();
const PORT: number = 3001;

// Permitir consumo a front en puerto 3000
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(bodyParser.json());

// Conectar a la base de datos
connectToDatabase();

// Rutas
app.use('/tasks', taskRoutes);

// Manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
