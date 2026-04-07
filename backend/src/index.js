const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const worldRoutes = require('./routes/world');
const knowledgeRoutes = require('./routes/knowledge');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');
const mistakeRoutes = require('./routes/mistake');
const recommendRoutes = require('./routes/recommend');
const shareRoutes = require('./routes/share');
const achievementRoutes = require('./routes/achievement');
const learningPathRoutes = require('./routes/learningPath');
const buildingScoreRoutes = require('./routes/buildingScore');
const { sequelize } = require('./db');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/world', worldRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/mistake', mistakeRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/achievement', achievementRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/building-score', buildingScoreRoutes);

const rooms = new Map();
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) rooms.set(roomId, []);
    rooms.get(roomId).push(socket.id);
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });
  socket.on('place-block', (data) => socket.to(data.roomId).emit('block-placed', data));
  socket.on('remove-block', (data) => socket.to(data.roomId).emit('block-removed', data));
  socket.on('disconnect', () => {
    rooms.forEach((users, roomId) => {
      const index = users.indexOf(socket.id);
      if (index !== -1) users.splice(index, 1);
      socket.to(roomId).emit('user-left', { userId: socket.id });
    });
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '古建智境后端运行中' });
});

sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});