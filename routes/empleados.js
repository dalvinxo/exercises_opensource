import express from 'express';
const router = express.Router();
import { Empleado } from '../models.js';

// Obtener todos los empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await Empleado.findAll();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los empleados' });
  }
});

// Insertar un empleado
router.post('/', async (req, res) => {
  try {
    const { nombre, cedula, cuenta, salario } = req.body;
    console.log(req.body)
    const nuevoEmpleado = await Empleado.create({ nombre, cedula, cuenta, salario });
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el empleado', details: error.message });
  }
});

export default router;
