import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import {registerSocketEvents} from "./socket";
import registerRouter from "./routes/register";  // register route'u import ettik
import loginRouter from "./routes/login";
import forgotPasswordRouter from "./routes/forgotpassword";
import themeRouter from "./routes/theme"
import getGroupRouter from "./routes/getgroup"
import  getUserGroupsRouter  from "./routes/getusergroups"
import messagesRouter from './routes/message';
import path from 'path';
import createGroupRouter from "./routes/addgroup";
import getGroupMembersRouter from "./routes/getgroupmembers"
import uploadRouter from './routes/uploadRouter';
import { authenticateToken } from "./middleware/authenticateToken"
import leaveGroupRouter from "./routes/leavegroup"
import logoutRouter from  "./routes/logout"
import  availableGroupsRouter from "./routes/getgroupbyteam"
import joinGroupRouter from "./routes/joingroup"
import getUserInfoRouter from "./routes/getuserinfo"
import updateUserRouter from  "./routes/updateUser"
import changePasswordRouter from "./routes/changepassword"
import deleteAccountRouter from "./routes/deleteaccount"
import searchUserRouter from "./routes/getsearchuser"
import inviteToGroupRouter from "./routes/invitetogroups"
import notificationsRouter from './routes/notification';
import themeRoutes from './routes/defaulttheme';




const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json()); // JSON request body'leri okumak için



// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

registerSocketEvents(io);
app.use('/groupImage', express.static(path.join(__dirname, 'public', 'groupImage')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/profileImage', express.static(path.join(__dirname, 'public', 'profileImage')));
app.use('/themes', express.static(path.join(__dirname, 'public', 'themes')));










// Routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/forgot-password', forgotPasswordRouter);

app.use('/api', themeRouter);
app.use('/themes',authenticateToken, themeRoutes);
app.use("/themes",themeRoutes)


// Burada authenticateToken kullanarak koruma sağla
app.use('/groups', authenticateToken, getGroupRouter);
app.use('/groups', authenticateToken, leaveGroupRouter);
app.use('/groups', authenticateToken, availableGroupsRouter);
app.use('/groups', authenticateToken, joinGroupRouter);

// Eğer gerekirse messages route’u da authenticateToken ile koruabilirsin
app.use('/messages', authenticateToken, messagesRouter);
app.use('/notifications',authenticateToken, notificationsRouter);;
app.use('/addgroup', authenticateToken, createGroupRouter);
app.use('/groups/user', authenticateToken, getUserGroupsRouter);
app.use('/upload', authenticateToken, uploadRouter);
app.use('/getgroupmembers', authenticateToken, getGroupMembersRouter);
app.use('/userinfo', authenticateToken, getUserInfoRouter);
app.use('/updateuser', authenticateToken, updateUserRouter);
app.use('/user',authenticateToken,changePasswordRouter)
app.use('/user',authenticateToken,deleteAccountRouter)
app.use("/users",authenticateToken,searchUserRouter)

app.use("/users",authenticateToken,inviteToGroupRouter);

server.listen(5000, () => {
  console.log('Server is running on port 5000 🚀');
});
