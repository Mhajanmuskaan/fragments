# POST without authentication should fail
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
`This request has no auth`

HTTP/1.1 401