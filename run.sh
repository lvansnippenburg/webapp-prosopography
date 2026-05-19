#!/bin/bash
# Start the Prosopography app local server and open the browser.
set -e

PORT=${1:-8081}
URL="http://127.0.0.1:$PORT"

cd "$(dirname "$0")"

echo "Starting Prosopography app on $URL …"
python3 server/server.py --port "$PORT" &
SERVER_PID=$!

# Give the server a moment to start
sleep 0.5

# Open in default browser
open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null || echo "Open $URL in your browser."

# Wait for Ctrl+C; then kill server
trap "kill $SERVER_PID 2>/dev/null; exit" INT TERM
wait $SERVER_PID
