# Create a text fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test-user1@fragments-testing.com: test-password1
`original fragment data`

HTTP 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/plain"
[Captures]
fragment_id: jsonpath "$.fragment.id"


# Successfully update the fragment
PUT http://localhost:8080/v1/fragments/{{fragment_id}}
Content-Type: text/plain
[BasicAuth]
test-user1@fragments-testing.com: test-password1
`updated fragment data`

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == "{{fragment_id}}"
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 21


# Confirm the updated data
GET http://localhost:8080/v1/fragments/{{fragment_id}}
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
body == "updated fragment data"


# Reject an attempt to change the fragment type
PUT http://localhost:8080/v1/fragments/{{fragment_id}}
Content-Type: application/json
[BasicAuth]
test-user1@fragments-testing.com: test-password1
`{"updated":true}`

HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400


# Reject an unsupported content type
PUT http://localhost:8080/v1/fragments/{{fragment_id}}
Content-Type: application/xml
[BasicAuth]
test-user1@fragments-testing.com: test-password1
`<updated />`

HTTP 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415


# Return 404 for an unknown fragment
PUT http://localhost:8080/v1/fragments/does-not-exist
Content-Type: text/plain
[BasicAuth]
test-user1@fragments-testing.com: test-password1
`updated`

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404


# Reject an unauthenticated update
PUT http://localhost:8080/v1/fragments/{{fragment_id}}
Content-Type: text/plain
`unauthorized update`

HTTP 401