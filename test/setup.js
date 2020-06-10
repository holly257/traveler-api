require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')

process.env.TEST_DB_URL = process.env.TEST_DB_URL || "postgresql://traveler_admin:aksdhfj823@localhost/traveler_test"

global.expect = expect
global.supertest = supertest