// ✅ ADD THIS AT THE VERY TOP - BEFORE ANY IMPORTS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log('SSL verification disabled globally');

import app from './app';
import dotenv from 'dotenv';
import { initializeDatabase } from './seeders/dbInitializer';

dotenv.config();

const PORT = process.env.PORT || 5704;

// ✅ Add timeout for initialization
const initApp = async () => {
  try {
    console.log('🔄 Starting application initialization...');
    
    // Set timeout for database initialization
    const initPromise = initializeDatabase();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database initialization timeout')), 30000);
    });
    
    await Promise.race([initPromise, timeoutPromise]);
    
    console.log('🚀 Starting server...');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
    });
    
  } catch (error: any) {
    console.error('❌ Application startup failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    // Check for SSL errors
    if (error.message.includes('certificate') || error.code === 'ESOCKET') {
      console.error('\n=========================================');
      console.error('SSL CERTIFICATE FIX REQUIRED:');
      console.error('1. Check MySQL SSL certificates');
      console.error('2. Or disable SSL in database connection');
      console.error('=========================================\n');
    }
    
    process.exit(1);
  }
};

// Start the application
initApp();