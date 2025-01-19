import express from 'express';
const router = express.Router();
import { Transaccion } from '../models.js';

// Obtener todas las transacciones
router.get('/', async (req, res) => {
  try {
    const transacciones = await Transaccion.findAll();
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las transacciones' });
  }
});

// Insertar una transacción
router.post('/', async (req, res) => {
  try {
    const { cuenta_origen, cuenta_destino, monto, fecha_transaccion } = req.body;
    const nuevaTransaccion = await Transaccion.create({
      cuenta_origen,
      cuenta_destino,
      monto,
      fecha_transaccion,
    });
    res.status(201).json(nuevaTransaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la transacción', details: error.message });
  }
});

export default router;
