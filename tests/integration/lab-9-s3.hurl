# Lab 9 S3 Integration Test
# POST -> GET -> DELETE -> GET 404

POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test-user1@fragments-testing.com:test-password1
`Hello S3!`

HTTP/1.1 201

[Asserts]
header "Location" matches /^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$/
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" isString
jsonpath "$.fragment.ownerId" matches /^[0-9a-fA-F]+$/
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 9

[Captures]
url: header "Location"

# GET the fragment we just created
GET {{url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 9

[Asserts]
body == "Hello S3!"

# DELETE the fragment
DELETE {{url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"

# GET the deleted fragment, should be 404
GET {{url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 404

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
