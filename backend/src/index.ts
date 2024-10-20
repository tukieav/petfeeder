import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import Message from './models/Message';
const app : any = express();
app.use(bodyParser.json());
// Użycie tras
app.use('/auth', authRoutes);
// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://localhost:27017/pet-health-book')
  .then(async () => {
    const existingMessage : any = await Message.findOne();
    if (!existingMessage) {
      const message : any = new Message({ text: 'hello world' });
      await message.save();
    }
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => console.error(err));
// Przykładowa trasa
app.get('/', async (req : any, res : any) => {
  try {
    const message : any = await Message.findOne();
    res.send(message ? message.text : 'No message found');
  } catch (error) {
    res.status(500).send('Error retrieving message');
  }
});