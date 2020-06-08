module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    //what are the || cases for these?
    DB_URL: process.env.DB_URL,
    TEST_DB_URL: process.env.TEST_DB_URL
}