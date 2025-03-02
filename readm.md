# Proyecto: Integración de Nómina Unapec - APAP

## Descripción
Este proyecto implementa una solución para la integración del pago de nómina de Unapec con el banco APAP mediante el uso de servicios web en lugar del intercambio de archivos. La aplicación permite generar la nómina, visualizar una vista previa y confirmar el pago mediante una API REST.

## Características
- Generación de nómina en formato JSON.
- Vista previa de la nómina antes del pago.
- Envío de la nómina a APAP para procesar los pagos.
- Confirmación del pago mediante la API.

## Tecnologías Utilizadas
- **Backend:** Node.js con Express.
- **Base de Datos:** Sequelize con soporte para PostgreSQL o MySQL.
- **Frontend:** HTML, CSS y JavaScript.
- **APIs RESTful:** Para la comunicación entre Unapec y APAP.

## Instalación
### Requisitos Previos
- Node.js (versión 18+)
- npm o yarn
- Base de datos compatible con Sequelize

### Pasos de Instalación
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/tu-repositorio.git
   cd nombre-del-proyecto
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Configurar la base de datos en el archivo `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=usuario
   DB_PASS=contraseña
   DB_NAME=nombre_base_datos
   ```
4. Ejecutar las migraciones:
   ```sh
   npx sequelize db:migrate
   ```
5. Iniciar el servidor:
   ```sh
   npm start
   ```

## Uso
1. Accede a `http://localhost:3000`.
2. Genera la nómina llenando el formulario.
3. Revisa la vista previa de los empleados y salarios.
4. Confirma el pago haciendo clic en "Pagar".
5. Verifica en la base de datos las transacciones registradas.

## Endpoints Principales
### Generar Nómina
**POST** `/api/generar-nomina`
- **Body:**
  ```json
  {
    "mes": "3",
    "year": "2025",
    "numeroCuenta": "807931407",
    "fechaCreacion": "02/03/2025"
  }
  ```
- **Respuesta:**
  ```json
  {
    "empresa": "Unapec",
    "rnc": "401005107",
    "cuenta_origen": "807931407",
    "fecha_creacion": "02/03/2025",
    "periodo_pago": "03/2025",
    "empleados": [{ "documento": "123456789", "cuenta": "987654321", "salario": 50000 }]
  }
  ```

### Confirmar Pago
**POST** `/api/recibir-confirmacion`
- **Body:**
  ```json
  {
    "transacciones": [
      {
        "cuenta_origen": "807931407",
        "cuenta_destino": "987654321",
        "monto": 50000,
        "fecha_transaccion": "2025-03-02"
      }
    ]
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Transacciones guardadas correctamente."
  }
  ```

## Contribuyentes
- **Dalvin Molina**

## Licencia
Este proyecto está bajo la licencia MIT.

