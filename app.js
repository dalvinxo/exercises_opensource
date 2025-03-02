import express from 'express';
import path from 'path';
import cors from 'cors';
import {fileURLToPath} from 'url';
import multer from 'multer';

import { Empleado, Transaccion } from './models.js';

import EmpleadoRouter from './routes/empleados.js';
import TransaccionesRouter from './routes/transacciones.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    
    cb(null, file.originalname);
  }
});

app.use(express.json())

app.get('/api', (req, res) => {
     res.send('Documentación API actualizada para JSON!');
})

app.use('/api/empleados', EmpleadoRouter);
app.use('/api/transacciones', TransaccionesRouter);


app.post('/api/generar-nomina', async (req, res) => {
    const { mes, year, numeroCuenta, fechaCreacion } = req.body;

    if (!mes || !year || !numeroCuenta || !fechaCreacion) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        const empleadosDb = await Empleado.findAll();
        const empleados = empleadosDb.map(empleado => ({
            documento: empleado.cedula,
            cuenta: empleado.cuenta,
            salario: empleado.salario
        }));

        const totalEmpleados = empleados.length;
        const totalMonto = empleados.reduce((acc, emp) => acc + emp.salario, 0);

        const nominaJSON = {
            empresa: "Unapec",
            rnc: "401005107",
            cuenta_origen: numeroCuenta,
            fecha_creacion: fechaCreacion,
            periodo_pago: `${mes.padStart(2, '0')}/${year}`,
            empleados: empleados,
            resumen: {
                total_empleados: totalEmpleados,
                monto_total: totalMonto
            }
        };

        res.status(200).json(nominaJSON);

    } catch (error) {
        console.error('Error al generar la nómina:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.post('/api/recibir-confirmacion', async (req, res) => {
    const { transacciones } = req.body;

    console.log(transacciones);
    if (!Array.isArray(transacciones) || transacciones.length === 0) {
        return res.status(400).json({ message: 'No se enviaron transacciones válidas.' });
    }

    try {
        await Transaccion.bulkCreate(transacciones);
        
        res.status(200).json({ message: 'Transacciones guardadas correctamente.' });
    } catch (error) {
        console.error('Error al guardar transacciones:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.use(express.static(path.join(__dirname, '/public')));

app.use((req, res) => {
    res.status(404);
    res.sendFile(path.join(__dirname, '/public', '404.html'));
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});