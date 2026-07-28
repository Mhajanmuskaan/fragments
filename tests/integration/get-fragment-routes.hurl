# Create a fragment used by the GET tests
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test-user1@fragments-testing.com: test-password1
`GET route test data`

HTTP 201
[Asserts]
jsonpath "$.status" == "ok"
[Captures]
fragment_id: jsonpath "$.fragment.id"


# List the authenticated user's fragment IDs
GET http://localhost:8080/v1/fragments
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" contains "{{fragment_id}}"


# List expanded fragment metadata
GET http://localhost:8080/v1/fragments?expand=1
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" count > 0


# Get the fragment data
GET http://localhost:8080/v1/fragments/{{fragment_id}}
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
body == "GET route test data"


# Get the fragment metadata
GET http://localhost:8080/v1/fragments/{{fragment_id}}/info
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == "{{fragment_id}}"
jsonpath "$.fragment.type" == "text/plain"


# Return 404 when fragment data does not exist
GET http://localhost:8080/v1/fragments/does-not-exist
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404


# Return 404 when fragment metadata does not exist
GET http://localhost:8080/v1/fragments/does-not-exist/info
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404


# Reject an unauthenticated list request
GET http://localhost:8080/v1/fragments

HTTP 401


# Reject an unauthenticated fragment-data request
GET http://localhost:8080/v1/fragments/{{fragment_id}}

HTTP 401


# Reject an unauthenticated fragment-info request
GET http://localhost:8080/v1/fragments/{{fragment_id}}/info

HTTP 401