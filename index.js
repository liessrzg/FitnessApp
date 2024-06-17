const express = require('express');
const cors = require('cors');
const nutritionRoute = require('./routes/nutrition');

const app = express();

app.use(cors());
app.use(express.json()); // pour pouvoir lire le corps des requêtes POST en JSON
app.use('/api', nutritionRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
