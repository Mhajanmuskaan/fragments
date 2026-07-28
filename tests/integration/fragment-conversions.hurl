# Create a Markdown fragment for conversion tests
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
test-user1@fragments-testing.com: test-password1
`# Conversion Test`

HTTP 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/markdown"
[Captures]
fragment_id: jsonpath "$.fragment.id"


# Retrieve the original Markdown data
GET http://localhost:8080/v1/fragments/{{fragment_id}}
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
header "Content-Type" startsWith "text/markdown"
body == "# Conversion Test"


# Convert Markdown to HTML
GET http://localhost:8080/v1/fragments/{{fragment_id}}.html
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
header "Content-Type" startsWith "text/html"
body contains "<h1>Conversion Test</h1>"


# Convert Markdown to plain text
GET http://localhost:8080/v1/fragments/{{fragment_id}}.txt
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
header "Content-Type" startsWith "text/plain"
body == "# Conversion Test"


# Reject an unsupported Markdown-to-PNG conversion
GET http://localhost:8080/v1/fragments/{{fragment_id}}.png
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415


# Return 404 when converting an unknown fragment
GET http://localhost:8080/v1/fragments/does-not-exist.html
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404


# Reject an unauthenticated conversion request
GET http://localhost:8080/v1/fragments/{{fragment_id}}.html

HTTP 401



# Create a PNG fragment for image conversion tests
POST http://localhost:8080/v1/fragments
Content-Type: image/png
[BasicAuth]
test-user1@fragments-testing.com: test-password1
file,tests/fixtures/test.png;

HTTP 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "image/png"
[Captures]
image_fragment_id: jsonpath "$.fragment.id"


# Convert PNG to JPEG
GET http://localhost:8080/v1/fragments/{{image_fragment_id}}.jpg
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
header "Content-Type" startsWith "image/jpeg"


# Convert PNG to WebP
GET http://localhost:8080/v1/fragments/{{image_fragment_id}}.webp
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
header "Content-Type" startsWith "image/webp"


# Convert PNG to AVIF
GET http://localhost:8080/v1/fragments/{{image_fragment_id}}.avif
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
header "Content-Type" startsWith "image/avif"


# Convert PNG to GIF
GET http://localhost:8080/v1/fragments/{{image_fragment_id}}.gif
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 200
[Asserts]
header "Content-Type" startsWith "image/gif"


# Reject an unsupported image-to-HTML conversion
GET http://localhost:8080/v1/fragments/{{image_fragment_id}}.html
[BasicAuth]
test-user1@fragments-testing.com: test-password1

HTTP 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415