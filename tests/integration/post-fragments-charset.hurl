# POST with Content-Type including charset should work
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
test-user1@fragments-testing.com:test-password1
`Fragment with charset`

HTTP/1.1 201

[Asserts]
header "Location" matches /^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$/
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/plain; charset=utf-8"
jsonpath "$.fragment.size" == 21

[Captures]
url: header "Location"

# GET the fragment back
GET {{url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
Content-Length: 21

[Asserts]
body == "Fragment with charset"