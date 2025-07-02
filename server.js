const express = require('express');
const app = express();
const cors = require('cors');
const aiRoutes = require('./routes/ai-routes');

require('dotenv').config();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use("/api/v1",aiRoutes);

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})