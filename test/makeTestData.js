function makeTestUsers() {
    return [
        {
            id: 1,
            username: 'pamb',
            fullname: 'Pam Halpert',
            password: 'heyPassword',
            email: 'pamhalpert@gmail.com'
        },
        {
            id: 2,
            username: 'jimothy',
            fullname: 'Jim Halpert',
            password: 'aNewPassword',
            email: 'jimothyhalpert@gmail.com'
        },
        {
            id: 3,
            username: 'beetMaster',
            fullname: 'Dwight Schrute',
            password: 'beetROX',
            email: 'beetsRus@gmail.com'
        },
    ]
}

function makeTestReviews() {
    return [
        {
            id: 1,
            name: 'Dunder Mifflin',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Dunder_Mifflin%2C_Inc.svg/1200px-Dunder_Mifflin%2C_Inc.svg.png', 
            image_alt: 'Dunder Mifflin Paper Company', 
            city: 'Scranton', 
            country: 'USA', 
            date_created: '2020-06-09T20:37:33.162Z',
            address: '1725 Slough Avenue Scranton, PA.', 
            rating: 5, 
            category: 'shopping', 
            comments: 'they have a pretzel day every year, that is pretty awesome. ', 
            user_id: 3,
        },
        {
            id: 2,
            name: 'Vance Refrigeration',
            image: 'https://vignette.wikia.nocookie.net/theoffice/images/9/92/Vance_Refrigeration_Logo.jpg/revision/latest?cb=20180718165550', 
            image_alt: 'Vance Refrigeration, Air Conditioning & Heating', 
            city: 'Scranton', 
            country: 'USA', 
            date_created: '2020-06-08T20:37:33.162Z',
            address: '1725 Slough Avenue Scranton, PA.', 
            rating: 4, 
            category: 'shopping', 
            comments: 'very cool place', 
            user_id: 1,
        },
    ]
}

function makeTestTrips() {
    return [
        {
            id: 1,
            name: 'Weekend Trip',
            city: 'test city',
            country: 'USA',
            date_created: '2020-06-08T20:37:33.162Z',
            user_id: 1
        },
        {
            id: 2,
            name: 'Other Trip',
            city: 'New city',
            country: 'Thailand',
            date_created: '2020-06-08T20:37:33.162Z',
            user_id: 1
        },
        {
            id: 3,
            name: 'Last one',
            city: 'City Name',
            country: 'South Africa',
            date_created: '2020-06-09T20:37:33.162Z',
            user_id: 2
        },
    ]
}


function cleanTables(db) {
    return db.raw(
      `TRUNCATE
        users,
        reviews
        RESTART IDENTITY CASCADE`
    )
}

function makeMaliciousReview(review) {
    const maliciousReview = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image: 'http://placehold.it/500x500',
        image_alt: 'Naughty naughty very naughty <script>alert("xss");</script>', 
        city: 'Naughty naughty very naughty <script>alert("xss");</script>', 
        country: 'Naughty naughty very naughty <script>alert("xss");</script>', 
        date_created: new Date().toISOString(),
        address: 'Naughty naughty very naughty <script>alert("xss");</script>', 
        rating: 4, 
        category: 'shopping', 
        comments: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`, 
        user_id: 1,
    }
    const expectedReview = {
        id: 911,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image: 'http://placehold.it/500x500',
        image_alt: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', 
        city: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', 
        country: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', 
        date_created: new Date().toISOString(),
        address: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', 
        rating: 4, 
        category: 'shopping', 
        comments: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`, 
        user_id: 1,
    }
    return {
      maliciousReview,
      expectedReview,
    }
}

function makeMaliciousTrip(trip) {
    const maliciousTrip = {
        id: 911,
        name: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        city: 'Naughty naughty very naughty <script>alert("xss");</script>', 
        country: 'Naughty naughty very naughty <script>alert("xss");</script>', 
        date_created: new Date().toISOString(),
        user_id: 1,
        
    }
    const expectedTrip = {
        id: 911,
        name: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        city: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', 
        country: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', 
        date_created: new Date().toISOString(),
        user_id: 1,
    }
    return {
      maliciousTrip,
      expectedTrip,
    }
}
//   regex for url sanitizing 
//if no image_alt, name.value + ' image'

module.exports = {
    makeTestUsers,
    makeTestReviews,
    makeTestTrips,
    
    makeMaliciousReview,
    makeMaliciousTrip,

    cleanTables,
}