
// remove session
let server;
let db;

server.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
})

//restrict routes

function authorize(req, res, next) {
    if (req.session.name && req.session.userId) {
        next();
    } else {
        res.redirect('/');
    }
}

server.get('/api/users', authorize, (req, res) => {
    db('users')
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ error, message: 'Something went wrong' }));
})
