# Create a fragment to delete
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test-user1@fragments-testing.com: test-password1
`fragment to delete`

HTTP 201
[Asserts]
jsonpath "$.status" == "ok"
[Captures]
fragment_id: jsonpath "$.fragment.id"


# Reject an unauthenticated delete request
DELETE http://localhost:8080/v1/fragments/{{fragment_id}}

HTTP 401


# Successfully delete the fragment
DELETE http://localhost:8080/v1/fragments/{{fragment_id}}
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"


# Confirm the deleted fragment data is unavailable
GET http://localhost:8080/v1/fragments/{{fragment_id}}
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404


# Confirm the deleted fragment metadata is unavailable
GET http://localhost:8080/v1/fragments/{{fragment_id}}/info
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404


# Return 404 when deleting an unknown fragment
DELETE http://localhost:8080/v1/fragments/does-not-exist
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404