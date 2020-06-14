module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'ndfoivsorio43i5j4ijtvoi34lkmslfd',

    //what are the || cases for these?
    DB_URL: process.env.DB_URL || 'postgresql://traveler_admin:aksdhfj823@localhost/traveler',
    TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://traveler_admin:aksdhfj823@localhost/traveler_test'
}