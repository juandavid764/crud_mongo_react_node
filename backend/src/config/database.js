/**
 * Configuración de conexión a MongoDB
 * Utiliza variables de entorno para la configuración
 */

const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  try {
    // Configuración de opciones de conexión
    const options = {
      maxPoolSize: 10, // Mantener hasta 10 conexiones socket
      serverSelectionTimeoutMS: 5000, // Mantener intentando enviar operaciones por 5 segundos
      socketTimeoutMS: 45000, // Cerrar sockets después de 45 segundos de inactividad
      family: 4, // Usar IPv4, omitir IPv6
    };

    // ✅ Usar variable de entorno MONGODB_URI
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('❌ MONGODB_URI no está definida en las variables de entorno');
    }

    console.log('🔗 Conectando a MongoDB...');
    
    // Conectar a MongoDB
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);

    // Eventos de conexión
    mongoose.connection.on("error", (err) => {
      console.error("❌ Error de conexión a MongoDB:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB desconectado");
    });

    // Manejo graceful del cierre de la aplicación
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log(
        "🔌 Conexión a MongoDB cerrada por terminación de la aplicación"
      );
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
