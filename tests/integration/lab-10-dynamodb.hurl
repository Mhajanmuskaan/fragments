# Lab 10 DynamoDB Integration Test

# Create the first JSON fragment
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
test-user1@fragments-testing.com:test-password1
`{ "service": "DynamoDB" }`

HTTP/1.1 201

[Asserts]
header "Location" matches /^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$/
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" isString
jsonpath "$.fragment.ownerId" matches /^[0-9a-fA-F]+$/
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 25

[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"


# Get the first fragment's metadata
GET {{fragment1_url}}/info
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == "{{fragment1_id}}"
jsonpath "$.fragment.ownerId" matches /^[0-9a-fA-F]+$/
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 25


# Create the second Markdown fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
test-user1@fragments-testing.com:test-password1
`DynamoDB is **great**.`

HTTP/1.1 201

[Asserts]
header "Location" matches /^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$/
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" isString
jsonpath "$.fragment.ownerId" matches /^[0-9a-fA-F]+$/
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22

[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"


# Get the second fragment's metadata
GET {{fragment2_url}}/info
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == "{{fragment2_id}}"
jsonpath "$.fragment.ownerId" matches /^[0-9a-fA-F]+$/
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22


# List all fragment IDs and confirm both exist
GET http://localhost:8080/v1/fragments
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"


# Delete the first fragment
DELETE {{fragment1_url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"


# Confirm the first fragment's metadata was deleted
GET {{fragment1_url}}/info
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 404

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404


# Confirm only the second fragment remains
GET http://localhost:8080/v1/fragments
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" not includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"