require('dotenv').config({ path: __dirname + "/../.env"});

module.exports = {
    development: {
        port: process.env.PORT
    },
    production: {},
    saltRounds: Number(process.env.SALT) || 9,
    jwt: {
        secret: process.env.SECRET || "vidoesAreAwesome",
        options: {
            expiresIn: process.env.JWT_EXP || '2d'
        }
    },
    database: process.env.DATABASE_URI,
    rootURI: process.env.ROOT_URI || null,
};
