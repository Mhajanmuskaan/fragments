# POST a JSON fragment, then GET it back
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
test-user1@fragments-testing.com:test-password1
`{"message":"This is a JSON fragment"}`

HTTP/1.1 201

[Asserts]
header "Location" matches /^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$/
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" isString
jsonpath "$.fragment.ownerId" matches /^[0-9a-fA-F]+$/
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 37

[Captures]
url: header "Location"

# GET the JSON fragment back
GET {{url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200

[Asserts]
header "Content-Type" contains "application/json"
jsonpath "$.message" == "This is a JSON fragment"