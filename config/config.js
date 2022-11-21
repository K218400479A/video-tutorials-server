module.exports = {
    development: {
        port: process.env.PORT || 3300
    },
    production: {},
    saltRounds: Number(process.env.saltRounds) || 9,
    jwt:{
        secret: process.env.secret || "vidoesAreAwesome",
        options: {
            expiresIn: process.env.expiresIn || '2d'
        }
    },
    database: process.env.DATABASE_URI || "mongodb://localhost:27017/videos"
};
