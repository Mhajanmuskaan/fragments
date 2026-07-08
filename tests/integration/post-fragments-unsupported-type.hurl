# POST with unsupported Content-Type should fail
POST http://localhost:8080/v1/fragments
Content-Type: application/xml
[BasicAuth]
test-user1@fragments-testing.com:test-password1
`<message>This type is not supported</message>`

HTTP/1.1 415