// GitHub synchronization module v3.0
(function() {
    'use strict';

    var SETTINGS_KEY = 'github_settings';
    var OWNER = 'lvansnippenburg';
    var REPO = 'JsonDataStorage';

    function getSettings() {
        var settings = localStorage.getItem(SETTINGS_KEY);
        if (!settings) {
            return null;
        }
        try {
            return JSON.parse(settings);
        } catch (e) {
            console.error('Failed to parse GitHub settings:', e);
            return null;
        }
    }

    function saveSettings(token, filepath, branch) {
        var settingsObj = {
            token: token,
            filepath: filepath || 'prosopography-database.json',
            branch: branch || 'main'
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsObj));
        updateConnectionStatus();
    }

    function clearSettings() {
        localStorage.removeItem(SETTINGS_KEY);
        updateConnectionStatus();
    }

    function isConfigured() {
        var settings = getSettings();
        return settings && settings.token && settings.filepath && settings.branch;
    }

    function updateConnectionStatus() {
        var statusEl = document.getElementById('github-status');
        var pushBtn = document.getElementById('btn-push-github');
        var pullBtn = document.getElementById('btn-pull-github');

        if (!statusEl) {
            return;
        }

        if (isConfigured()) {
            var settings = getSettings();
            statusEl.innerHTML = 'Connected to ' + OWNER + '/' + REPO;
            statusEl.className = 'github-status connected';
            if (pushBtn) {
                pushBtn.disabled = false;
            }
            if (pullBtn) {
                pullBtn.disabled = false;
            }
        } else {
            statusEl.innerHTML = 'Not connected to GitHub';
            statusEl.className = 'github-status disconnected';
            if (pushBtn) {
                pushBtn.disabled = true;
            }
            if (pullBtn) {
                pullBtn.disabled = true;
            }
        }
    }

    function githubRequest(endpoint, method, body) {
        method = method || 'GET';
        body = body || null;

        var settings = getSettings();
        if (!settings || !settings.token) {
            return Promise.reject(new Error('GitHub not configured'));
        }

        var url = 'https://api.github.com/repos/' + OWNER + '/' + REPO + endpoint;
        var headers = {
            'Authorization': 'token ' + settings.token,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };

        var options = {
            method: method,
            headers: headers
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        return fetch(url, options).then(function(response) {
            if (!response.ok) {
                return response.json().then(function(error) {
                    throw new Error(error.message || 'GitHub API error: ' + response.status);
                });
            }
            return response.json();
        });
    }

    function testConnection() {
        return githubRequest('').then(function(repo) {
            return {
                success: true,
                message: 'Successfully connected to ' + repo.full_name
            };
        }).catch(function(error) {
            return {
                success: false,
                message: 'Connection failed: ' + error.message
            };
        });
    }

    function getFile() {
        var settings = getSettings();
        var endpoint = '/contents/' + settings.filepath + '?ref=' + settings.branch;

        return githubRequest(endpoint).then(function(data) {
            var content = atob(data.content.replace(/\s/g, ''));
            return {
                content: content,
                sha: data.sha
            };
        }).catch(function(error) {
            if (error.message.includes('404')) {
                return null;
            }
            throw error;
        });
    }

    function push(commitMessage) {
        var settings = getSettings();
        var dbContent = Database.exportJSON();

        return getFile().then(function(existing) {
            var bodyObj = {
                message: commitMessage || 'Update prosopography database - ' + new Date().toISOString(),
                content: btoa(unescape(encodeURIComponent(dbContent))),
                branch: settings.branch
            };

            if (existing && existing.sha) {
                bodyObj.sha = existing.sha;
            }

            return githubRequest('/contents/' + settings.filepath, 'PUT', bodyObj);
        }).then(function() {
            return {
                success: true,
                message: 'Database successfully pushed to GitHub!'
            };
        });
    }

    function pull() {
        return getFile().then(function(fileData) {
            if (!fileData) {
                throw new Error('No database file found in GitHub repository.');
            }

            var success = Database.importJSON(fileData.content);

            if (!success) {
                throw new Error('Failed to import database from GitHub. Invalid format.');
            }

            return {
                success: true,
                message: 'Database successfully pulled from GitHub!'
            };
        });
    }

    function getHistory(limit) {
        limit = limit || 10;
        var settings = getSettings();
        var endpoint = '/commits?path=' + settings.filepath + '&sha=' + settings.branch + '&per_page=' + limit;

        return githubRequest(endpoint).then(function(commits) {
            return commits.map(function(commit) {
                return {
                    sha: commit.sha.substring(0, 7),
                    message: commit.commit.message,
                    author: commit.commit.author.name,
                    date: new Date(commit.commit.author.date),
                    url: commit.html_url
                };
            });
        });
    }

    function showHistory() {
        getHistory(20).then(function(history) {
            var html = '<div class="history-modal-content">';
            html += '<h3>Recent Changes on GitHub</h3>';

            if (history.length === 0) {
                html += '<p>No commits found for this file.</p>';
            } else {
                html += '<ul class="commit-list">';
                for (var i = 0; i < history.length; i++) {
                    var commit = history[i];
                    html += '<li class="commit-item">';
                    html += '<div class="commit-header">';
                    html += '<strong>' + commit.message + '</strong>';
                    html += '<span class="commit-sha">' + commit.sha + '</span>';
                    html += '</div>';
                    html += '<div class="commit-meta">';
                    html += 'by ' + commit.author + ' on ' + commit.date.toLocaleString();
                    html += '</div>';
                    html += '<a href="' + commit.url + '" target="_blank" class="commit-link">View on GitHub</a>';
                    html += '</li>';
                }
                html += '</ul>';
            }

            html += '</div>';

            var historyDiv = document.getElementById('sync-status');
            if (historyDiv) {
                historyDiv.innerHTML = html;
                historyDiv.style.display = 'block';
            }
        }).catch(function(error) {
            alert('Failed to load history: ' + error.message);
        });
    }

    // Create and expose GitHubSync global object
    window.GitHubSync = {
        getSettings: getSettings,
        saveSettings: saveSettings,
        clearSettings: clearSettings,
        isConfigured: isConfigured,
        updateConnectionStatus: updateConnectionStatus,
        testConnection: testConnection,
        push: push,
        pull: pull,
        showHistory: showHistory
    };

    console.log('GitHubSync module v3.0 loaded successfully');
    console.log('Available methods:', Object.keys(window.GitHubSync));
})();
