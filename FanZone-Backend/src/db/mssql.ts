// MSSQL veritabanına bağlanmak için gerekli modül import ediliyor
import * as sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Veritabanı bağlantı ayarları
const config: sql.config = {
  user: process.env.DB_USER,               // SQL Server kullanıcı adı
  password: process.env.DB_PASSWORD,           // SQL Server şifresi
  server: process.env.DB_SERVER || 'localhost',  // Sunucu adresi (lokal makine)
  database:process.env.DB_DATABASE,     // Bağlanılacak veritabanı adı
  options: {
    encrypt: false,               // Şifreleme devre dışı (local için genelde false olur)
    trustServerCertificate: true  // Sertifika doğrulaması devre dışı (local bağlantı için gerekli)
  }
};

// Connection Pool oluşturup tekrar kullanılabilir hale getiriyoruz
export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ MSSQL bağlantısı başarılı!');
    return pool;
  })
  .catch(error => {
    console.error('❌ MSSQL bağlantı hatası:', error);
    throw error;
  });

