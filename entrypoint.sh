#!/bin/sh

echo "Injecting runtime env into env-config.js..."
envsubst < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js

exec "$@"
