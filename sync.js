import { sequelize } from './db.js'
import { Empleado, Transaccion } from './models.js';

(async () => {
  try {
    
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    // Sincronizar las tablas
    await sequelize.sync({ force: true }); // Usar `force: true` solo en desarrollo
    console.log('Tablas sincronizadas correctamente.');

  } catch (error) {

    console.error('Error al sincronizar las tablas:', error);

  } finally {

    await sequelize.close();

  }

})();
