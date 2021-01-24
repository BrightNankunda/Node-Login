const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGODB } =  require('./config');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const notesRoute = require('./routes/note');
const auth = require('./middleware/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/users', userRoutes);
app.use('/api/notes', auth, notesRoute);

app.get('/', (req, res, next) => {
    res.json({Message: 'Login with Node By 97'})
});

app.use('/api/protected', auth, (req, res, next) => {
    res.json({Message: `Hi ${req.user.firstName}, Protected Login route with Node By 97`})
});

app.use((req, res, next) => {
    const err = new Error('NOT FOUND');
    err.status = 404;
    next(err)
})

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({Error: {message: err.message}})
})

const port = 600;

mongoose.connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
.then(() => {
    console.log('Connected');
    return app.listen(port)
})
.then(() => {
    console.log('Server running on port: ' + port);
})
.catch(err => {
    console.log(err);
})
