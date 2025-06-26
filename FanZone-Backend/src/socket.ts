import { Server } from "socket.io";
import { poolPromise } from "./db/mssql"; 


export const registerSocketEvents = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🔌 Yeni bir kullanıcı bağlandı:", socket.id);

    // Kullanıcı gruba katılıyor
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId.toString());
      console.log(`🟢 Kullanıcı ${socket.id} gruba katıldı: ${groupId}`);
    });

    // Mesaj gönderme
   socket.on("sendMessage", async (data) => {
  const {  userId, groupId, message, username, profileImage,image} = data;
  console.log("Mesaj geldi backend'e:", data);

  // Mesajı odadaki diğer kullanıcılara gönder
  io.to(groupId.toString()).emit("receiveMessage", {
    userId,
    username,
    groupId,
    message,
    image,
    profileImage,  
    sentAt: new Date()
  });

      // 2. Veritabanına kaydet
      try {
        const pool = await poolPromise;

        await pool.request()
          .input("UserID", userId)
          .input("GroupID", groupId)
          .input("MessageText", message || null)  // message boş olabilir, null gönder
          .input("Image", image || null) 
          .query(`
            INSERT INTO Messages (UserID, GroupID, MessageText,Image)
            VALUES (@UserID, @GroupID, @MessageText,@Image)
          `);

        console.log("✅ Mesaj veritabanına kaydedildi");
      } catch (err) {
        console.error("❌ Mesaj veritabanına kaydedilemedi:", err);
      }
    });
  });
};

