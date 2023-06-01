export default defineEventHandler((event) => {

    const secure = event.node.req.headers['x-forwarded-proto'] === 'https'

    // Connection already secure or non production environment.
    if (secure || process.env.NODE_ENV !== 'production') {
        return
    }

    // Redirect to secure URL.
    event.node.res.writeHead(302, { 'Location': 'https://' + event.node.req.headers.host + event.node.req.url })
    event.node.res.end()
})
