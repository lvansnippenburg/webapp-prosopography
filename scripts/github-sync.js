// GitHub Sync Module - Handles synchronization with GitHub repository
var GitHubSync = {
    config: {
        token: '',
        owner: 'lvansnippenburg',
        repo: 'JsonDataStorage',
        filepath: 'prosopography-database.json',
        branch: 'main'
    },

    // Initialize GitHub settings from localStorage
    init: function() {
        this.loadSettings();
        this.updateStatus();
        this.bindEvents();
    },

    // Load settings from localStorage
    loadSettings: function() {
        var token = localStorage.getItem('github_token');
        var filepath = localStorage.getItem('github_filepath');
        var branch = localStorage.getItem('github_branch');

        if (token) this.config.token = token;
        if (filepath) this.config.filepath = filepath;
        if (branch) this.config.branch = branch;

        // Load settings into form
        if (document.getElementById('github-token')) {
            document.getElementById('github-token').value = token || '';
        }
        if (document.getElementById('github-filepath')) {
            document.getElementById('github-filepath').value = filepath || 'prosopography-database.json';
        }
        if (document.getElementById('github-branch')) {
            document.getElementById('github-branch').value = branch || 'main';
        }
    },

    // Save settings to localStorage
    saveSettings: function() {
        var token = document.getElementById('github-token').value.trim();
        var filepath = document.getElementById('github-filepath').value.trim();
        var branch = document.getElementById('github-branch').value.trim();

        if (token) {
            localStorage.setItem('github_token', token);
            this.config.token = token;
        }

        if (filepath) {
            localStorage.setItem('github_filepath', filepath);
            this.config.filepath = filepath;
        }

        if (branch) {
            localStorage.setItem('github_branch', branch);
            this.config.branch = branch;
        }

        this.updateStatus();
        alert('GitHub settings saved successfully');
    },

    // Clear settings
    clearSettings: function() {
        if (confirm('Are you sure you want to clear GitHub settings?')) {
            localStorage.removeItem('github_token');
            localStorage.removeItem('github_filepath');
            localStorage.removeItem('github_branch');

            this.config.token = '';
            this.config.filepath = 'prosopography-database.json';
            this.config.branch = 'main';

            document.getElementById('github-token').value = '';
            document.getElementById('github-filepath').value = 'prosopography-database.json';
            document.getElementById('github-branch').value = 'main';

            this.updateStatus();
            alert('GitHub settings cleared');
        }
    },

    // Update connection status display
    updateStatus: function() {
        var statusEl = document.getElementById('github-status');
        var pushBtn = document.getElementById('btn-push-github');
        var pullBtn = document.getElementById('btn-pull-github');

        if (!statusEl) return;

        if (this.config.token) {
            statusEl.innerHTML = '✓ Connected to GitHub repository: <strong>' + 
                this.config.owner + '/' + this.config.repo + '</strong><br>' +
                'File: ' + this.config.filepath + ' (branch: ' + this.config.branch + ')';
            statusEl.className = 'github-status connected';

            if (pushBtn) pushBtn.disabled = false;
            if (pullBtn) pullBtn.disabled = false;
        } else {
            statusEl.innerHTML = '✗ Not connected to GitHub. Please configure settings below.';
            statusEl.className = 'github-status disconnected';

            if (pushBtn) pushBtn.disabled = true;
            if (pullBtn) pullBtn.disabled = true;
        }
    },

    // Bind event handlers
    bindEvents: function() {
        var self = this;

        var saveBtn = document.getElementById('btn-save-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                self.saveSettings();
            });
        }

        var clearBtn = document.getElementById('btn-clear-settings');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                self.clearSettings();
            });
        }

        var testBtn = document.getElementById('btn-test-connection');
        if (testBtn) {
            testBtn.addEventListener('click', function() {
                self.testConnection();
            });
        }

        var pushBtn = document.getElementById('btn-push-github');
        if (pushBtn) {
            pushBtn.addEventListener('click', function() {
                self.pushToGitHub();
            });
        }

        var pullBtn = document.getElementById('btn-pull-github');
        if (pullBtn) {
            pullBtn.addEventListener('click', function() {
                self.pullFromGitHub();
            });
        }

        var historyBtn = document.getElementById('btn-view-history');
        if (historyBtn) {
            historyBtn.addEventListener('click', function() {
                self.viewHistory();
            });
        }
    },

    // Test GitHub connection
    testConnection: function() {
        if (!this.config.token) {
            alert('Please enter a GitHub token first');
            return;
        }

        var statusEl = document.getElementById('connection-status');
        statusEl.innerHTML = '<div class="status-progress">Testing connection...</div>';
        statusEl.style.display = 'block';

        var url = 'https://api.github.com/repos/' + this.config.owner + '/' + this.config.repo;

        fetch(url, {
            headers: {
                'Authorization': 'token ' + this.config.token,
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                statusEl.innerHTML = '<div class="status-success">✓ Connection successful! Repository found.</div>';
            } else {
                statusEl.innerHTML = '<div class="status-error">✗ Connection failed: ' + response.status + ' ' + response.statusText + '</div>';
            }
        })
        .catch(function(error) {
            statusEl.innerHTML = '<div class="status-error">✗ Connection error: ' + error.message + '</div>';
        });
    },

    // Push data to GitHub
    pushToGitHub: function() {
        if (!this.config.token) {
            alert('Please configure GitHub settings first');
            return;
        }

        if (!confirm('Push local database to GitHub? This will overwrite the remote file.')) {
            return;
        }

        var statusEl = document.getElementById('sync-status');
        statusEl.innerHTML = '<div class="sync-progress">Pushing to GitHub...</div>';
        statusEl.style.display = 'block';

        var self = this;
        var content = Database.exportJSON();
        var message = 'Update prosopography database - ' + new Date().toISOString();

        // Get current file SHA (required for update)
        var getUrl = 'https://api.github.com/repos/' + this.config.owner + '/' + this.config.repo + 
                     '/contents/' + this.config.filepath + '?ref=' + this.config.branch;

        fetch(getUrl, {
            headers: {
                'Authorization': 'token ' + this.config.token,
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                return null; // File doesn't exist yet
            } else {
                throw new Error('Failed to get file info: ' + response.statusText);
            }
        })
        .then(function(fileData) {
            var sha = fileData ? fileData.sha : null;

            // Update or create file
            var putUrl = 'https://api.github.com/repos/' + self.config.owner + '/' + self.config.repo + 
                         '/contents/' + self.config.filepath;

            var body = {
                message: message,
                content: btoa(unescape(encodeURIComponent(content))),
                branch: self.config.branch
            };

            if (sha) {
                body.sha = sha;
            }

            return fetch(putUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': 'token ' + self.config.token,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        })
        .then(function(response) {
            if (response.ok) {
                statusEl.innerHTML = '<div class="sync-success">✓ Successfully pushed to GitHub!</div>';
            } else {
                return response.json().then(function(data) {
                    throw new Error(data.message || 'Push failed');
                });
            }
        })
        .catch(function(error) {
            statusEl.innerHTML = '<div class="sync-error">✗ Push failed: ' + error.message + '</div>';
        });
    },

    // Pull data from GitHub
    pullFromGitHub: function() {
        if (!this.config.token) {
            alert('Please configure GitHub settings first');
            return;
        }

        if (!confirm('Pull database from GitHub? This will overwrite your local data.')) {
            return;
        }

        var statusEl = document.getElementById('sync-status');
        statusEl.innerHTML = '<div class="sync-progress">Pulling from GitHub...</div>';
        statusEl.style.display = 'block';

        var url = 'https://api.github.com/repos/' + this.config.owner + '/' + this.config.repo + 
                  '/contents/' + this.config.filepath + '?ref=' + this.config.branch;

        fetch(url, {
            headers: {
                'Authorization': 'token ' + this.config.token,
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch file: ' + response.statusText);
            }
        })
        .then(function(data) {
            var content = decodeURIComponent(escape(atob(data.content)));
            var success = Database.importJSON(content);

            if (success) {
                statusEl.innerHTML = '<div class="sync-success">✓ Successfully pulled from GitHub!</div>';
                UI.displayStatistics();
                UI.displayBrowseResults();
            } else {
                throw new Error('Invalid database format');
            }
        })
        .catch(function(error) {
            statusEl.innerHTML = '<div class="sync-error">✗ Pull failed: ' + error.message + '</div>';
        });
    },

    // View commit history
    viewHistory: function() {
        alert('Commit history viewer - Coming soon!\n\nFor now, visit:\nhttps://github.com/' + 
              this.config.owner + '/' + this.config.repo + '/commits/' + this.config.branch + '/' + this.config.filepath);
    }
};

// Initialize when settings view is loaded
document.addEventListener('DOMContentLoaded', function() {
    GitHubSync.init();
});

console.log('GitHub Sync module loaded successfully');