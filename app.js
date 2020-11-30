const express = require('express');
const path = require('path');
const app = express();
const HOST = process.env.HOST || '0.0.0.0';
const PORT = 9999;
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(PORT, HOST, console.log(`Server is starting at port ${PORT}... `));
