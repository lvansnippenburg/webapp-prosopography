-- Livorno Prosopography � Server Launcher
-- Starts server.py if not already running, then opens the app in the default browser.

set python3Path to "/Library/Frameworks/Python.framework/Versions/3.14/bin/python3"
set serverScript to "/Users/lvansnippenburg/Documents/Ontwikkeling/webapp-prosopography/server/server.py"
set serverURL to "http://localhost:8081"
set logFile to "/tmp/prosopography-server.log"

-- Check if server is already running
set serverRunning to false
try
	do shell script "curl -sf --max-time 1 " & serverURL & "/api/records > /dev/null"
	set serverRunning to true
end try

if not serverRunning then
	-- Launch server in the background
	do shell script quoted form of python3Path & " " & quoted form of serverScript & " >> " & quoted form of logFile & " 2>&1 &"
	
	-- Poll until ready (up to 10 s)
	set ready to false
	repeat 20 times
		delay 0.5
		try
			do shell script "curl -sf --max-time 1 " & serverURL & "/api/records > /dev/null"
			set ready to true
			exit repeat
		end try
	end repeat
	
	if not ready then
		display dialog "The server did not start in time." & return & return & "Check: " & logFile buttons {"OK"} default button "OK" with icon stop
		return
	end if
end if

open location serverURL
