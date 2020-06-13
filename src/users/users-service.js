const UsersService = {
    insertUser(db, newUser) {
        return db.insert(newUser).into('users')
            .returning('*').then(rows => {
                return rows[0]
            })
    },
}

module.exports = UsersService