const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const bcrypt = require('bcryptjs')

const UsersService = {
    insertUser(db, newUser) {
        return db.insert(newUser).into('users')
            .returning('*').then(([user]) =>  user)
    },
    
    hasUserWithUsername(db, username) {
        return db('users').where({ username }).first().then(user => !!user)
    },

    validatePassword(password) {
        if(password.length < 7) {
            return 'Password must be longer than 7 characters'
        }
        if(password.length > 72) {
            return 'Password must be shorter than 72 characters'
        }
        if(password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with an empty space'
        }
        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
    },

    hashPassword(password) {
        return bcrypt.hash(password, 10)
    }
   
}

module.exports = UsersService