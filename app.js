import express from 'express';
import path from 'path';
import cors from 'cors';
import {fileURLToPath} from 'url';
import fs from 'fs';
import multer from 'multer';
import readline from 'readline';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors())

const upload = multer({ dest: 'uploads/' });

app.use(express.json())

app.get('/api', (req, res) => {
    console.log('HTTP GET request received')
    res.send('Hello, World!')
})

app.post('/api/formulario', upload.none(), (req, res) => {

    const { mes, year, numeroCuenta, fechaCreacion } = req.body;

    if (!mes || !year || !numeroCuenta || !fechaCreacion) {
        return res.status(400).json({
            message: 'Todos los campos son requeridos.',
        });
    }

    console.log(req.body)

    try {
       
        const empleados = [
            { documento: '0012345678', cuenta: '00000000000000000001', salario: 1500000 },
            { documento: '0012345679', cuenta: '00000000000000000002', salario: 2000000 },
        ];

        const totalEmpleados = empleados.length;
        const totalMonto = empleados.reduce((acc, emp) => acc + emp.salario, 0);

        const fechaArchivo = fechaCreacion;

        const fechaFormateada = `${mes.padStart(2, '0')}/${year}`;

        let contenido = `E|401005107|${numeroCuenta}|${fechaArchivo}|${fechaFormateada}\n`;

        empleados.forEach((emp) => {
            contenido += `D|${emp.documento}|${emp.cuenta}|${emp.salario}\n`;
        });

        contenido += `S|${totalEmpleados}|${totalMonto}`;

        const fileName = `nomina_unapec.txt`;
        const filePath = path.join(__dirname, fileName);
        fs.writeFileSync(filePath, contenido);

        res.download(filePath, fileName, (err) => {
            
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).json({ message: 'Error al generar el archivo.' });
            }

            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error('Error en el procesamiento:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
   
});

app.post('/api/cargar-nomina', upload.single('archivo'), async (req, res) => {
    const archivo = req.file;

    if (!archivo) {
        return res.status(400).json({ message: 'No se envió ningún archivo.' });
    }

    try {
        const filePath = archivo.path;
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity,
        });

        const data = [];
        for await (const line of rl) {
            const partes = line.split('|');
            const tipo = partes[0];

            if (tipo === 'D') {
                data.push({
                    tipo: 'Empleado',
                    documento: partes[1],
                    cuenta: partes[2],
                    salario: partes[3],
                });
            } else if (tipo === 'S') {
                data.push({
                    tipo: 'Resumen',
                    documento: null,
                    cuenta: partes[1], 
                    salario: partes[2], 
                });
            }
        }

        fs.unlinkSync(filePath);       
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al procesar el archivo:', error);
        res.status(500).json({ message: 'Error al procesar el archivo.' });
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