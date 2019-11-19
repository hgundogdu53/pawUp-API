const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''

    let basicToken
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'missing token' })
    } else {
        basicToken = authToken.slice(7, authToken.length, authToken.length)
    }

    try {
        const payload = AuthService.verifyJwt(basicToken)

        AuthService.getUserWithEmail(
            req.app.get('db'),
            payload.sub
        )
            .then(user => {
                if (!user)
                    return res.status(401).json({ error: 'Unauthorized request' })

                req.user = user
                next()
            })
            .catch(err => {
                next(err)
            })
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized request' })
    }
}

module.exports = {
    requireAuth
}