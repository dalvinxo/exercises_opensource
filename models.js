import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';

const Empleado = sequelize.define('Empleado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  cuenta: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  salario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'empleados', 
  timestamps: false,     
});

const Transaccion = sequelize.define('Transaccion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cuenta_origen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuenta_destino: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Empleado,
      key: 'cuenta',
    },
  },
  monto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_transaccion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'transacciones',
  timestamps: false,
});

export { Empleado, Transaccion };

