const AuthService = {
    getUserWithUsername(db, username) {
        return db('users').where({ username }).first()
    },
}

module.exports = AuthService