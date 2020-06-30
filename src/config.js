module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'ndfoivsorio43i5j4ijtvoi34lkmslfd',

    DATABASE_URL:
        process.env.DATABASE_URL || 'postgresql://traveler_admin:aksdhfj823@localhost/traveler',
    TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'postgresql://traveler_admin:aksdhfj823@localhost/traveler_test',

    CLIENT_ORIGIN: process.env.DEV_ORIGIN || 'https://traveler.now.sh',
};
