const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => { 
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running!' 
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        status: 'ERROR',
        message: 'Something went wrong!'
    });
});

module.exports = app;