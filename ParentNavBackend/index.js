require('dotenv').config();
const express = require('express');
const cors = require('cors');    // 1. 先引入cors
const app = express();           // 2. 先创建app

const PORT = 8888;

app.use(cors());                 // 3. 然后用app.use
app.use(express.json());         // 4. 支持JSON请求

// 引入主业务路由
const askRouter = require('./routes/askAI');
app.use('/ask', askRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
