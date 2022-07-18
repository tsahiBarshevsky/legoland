const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;
var router = express.Router();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.get('/check', async (req, res) => {
    res.json("check ok");
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = router;