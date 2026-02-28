## User (checkpoint)

this app uses localstorage to store the json data. Please migrate it to use IndexedDB. Also include in each recur a uuid and a modification date. When "backing" up the JSON to GitHub, backup each record as a seperate file, using it's uuid as the filename. Check each records's last modified data to see if it needs backup. The same for "import from github"

## Assistant

Let me start by exploring the project structure to understand the codebase.

**Tool Call: List the `webapp-prosopography` directory's contents**
Status: Completed

# Folders:
webapp-prosopography/icons
webapp-prosopography/images
webapp-prosopography/scripts

# Files:
webapp-prosopography/.gitignore
webapp-prosopography/CNAME
webapp-prosopography/README.md
webapp-prosopography/debug.html
webapp-prosopography/index.html
webapp-prosopography/manifest.json
webapp-prosopography/robots.txt
webapp-prosopography/styles.css


**Tool Call: List the `webapp-prosopography/scripts` directory's contents**
Status: Completed


# Files:
webapp-prosopography/scripts/app.js
webapp-prosopography/scripts/database.js
webapp-prosopography/scripts/github-sync.js
webapp-prosopography/scripts/service-worker.js
webapp-prosopography/scripts/ui.js


**Tool Call: Read file `index.html`**
Status: Completed

```webapp-prosopography/index.html
SUCCESS: File outline retrieved. This file is too large to read all at once, so the outline below shows the file's structure with line numbers.

IMPORTANT: Do NOT retry this call without line numbers - you will get the same outline.
Instead, use the line numbers below to read specific sections by calling this tool again with start_line and end_line parameters.

# File outline for /Users/lvansnippenburg/Documents/Ontwikkeling/webapp-prosopography/index.html

html [L2-358]
 head [L3-44]
  meta [L4-5]
  meta [L5-7]
  meta [L7-8]
  title [L8]
  link [L11-14]
  meta [L14-15]
  meta [L15-16]
  meta [L16-17]
  meta [L17-20]
  link [L20-21]
  link [L21-22]
  link [L30-31]
  link [L31-32]
  link [L32-34]
  link [L34-35]
 body [L45-357]
  div [L46-337]
   header [L47-64]
    div [L48-56]
     img [L49-50]
     h1 [L50]
     button [L51-55]
      span [L52]
      span [L53]
      span [L54]
    nav [L57-63]
     button [L58]
     button [L59]
     button [L60]
     button [L61]
     button [L62]
   main [L66-336]
    section [L68-92]
     h2 [L69]
     div [L71-83]
      input [L72-73]
      input [L73-74]
      input [L74-75]
      div [L75-80]
       label [L76-79]
        input [L77-79]
      button [L81]
      button [L82]
     div [L84]
     div [L85]
     div [L88-91]
      h3 [L89]
      div [L90]
    section [L95-221]
     h2 [L96]
     form [L97-220]
      input [L98-100]
      fieldset [L100-148]
       legend [L101]
       div [L102-108]
        label [L103-106]
         input [L105-106]
        div [L107]
       div [L110-127]
        div [L111-117]
         label [L112-115]
          input [L114-115]
         div [L116]
        label [L119-126]
         select [L121-125]
          option [L122]
          option [L123]
          option [L124]
       div [L129-147]
        div [L130-136]
         label [L131-134]
          input [L133-134]
         div [L135]
        label [L138-146]
         select [L140-145]
          option [L141]
          option [L142]
          option [L143]
          option [L144]
      fieldset [L150-154]
       legend [L151]
       div [L152]
       button [L153]
      fieldset [L156-190]
       legend [L157]
       div [L158-173]
        h4 [L159]
        label [L160]
         input [L160]
        label [L161]
         input [L161]
        label [L162]
         input [L162]
        label [L163]
         input [L163]
        label [L164]
         input [L164]
        label [L165-172]
         select [L166-171]
          option [L167]
          option [L168]
          option [L169]
          option [L170]
       div [L174-189]
        h4 [L175]
        label [L176]
         input [L176]
        label [L177]
         input [L177]
        label [L178]
         input [L178]
        label [L179]
         input [L179]
        label [L180]
         input [L180]
        label [L181-188]
         select [L182-187]
          option [L183]
          option [L184]
          option [L185]
          option [L186]
      fieldset [L192-196]
       legend [L193]
       div [L194]
       button [L195]
      fieldset [L198-202]
       legend [L199]
       div [L200]
       button [L201]
      fieldset [L204-214]
       legend [L205]
       label [L206-209]
        input [L208-209]
       label [L210-213]
        textarea [L212]
      div [L216-219]
       button [L217]
       button [L218]
    section [L224-237]
     h2 [L225]
     div [L226-235]
      label [L227-234]
       select [L229-233]
        option [L230]
        option [L231]
        option [L232]
     div [L236]
    section [L240-263]
     h2 [L241]
     div [L243-252]
      h3 [L244]
      p [L245]
      div [L246-250]
       button [L247]
       button [L248]
       button [L249]
      div [L251]
     div [L254-262]
      h3 [L255]
      p [L256]
      button [L257]
      div [L258-261]
       input [L259-260]
       button [L260]
    section [L266-323]
     h2 [L267]
     div [L269-315]
      h3 [L270]
      p [L271]
      div [L273-314]
       h4 [L274]
       ol [L275-284]
        li [L276]
         a [L276]
        li [L277]
        li [L278]
        li [L279]
        li [L280]
        li [L281]
         strong [L281]
        li [L282]
         strong [L282]
        li [L283]
       h4 [L286]
       div [L287-313]
        label [L288-292]
         input [L290-291]
         small [L291]
        label [L294-298]
         input [L296-297]
         small [L297]
        label [L300-304]
         input [L302-303]
         small [L303]
        div [L306-310]
         button [L307]
         button [L308]
         button [L309]
        div [L312]
     div [L317-322]
      h3 [L318]
      p [L319]
       strong [L319]
      p [L320]
      p [L321]
       a [L321]
    div [L326-335]
     div [L327-334]
      span [L328]
      div [L329]
      div [L330-333]
       button [L331]
       button [L332]

Showing symbols 1-215 (total symbols: 215)


NEXT STEPS: To read a specific symbol's implementation, call read_file with the same path plus start_line and end_line from the outline above.
For example, to read a function shown as [L100-150], use start_line: 100 and end_line: 150.
```


**Tool Call: Read file `scripts/database.js`**
Status: Completed

```webapp-prosopography/scripts/database.js
// Database Module - Handles all data storage and retrieval
const Database = {
    // Get all persons from localStorage
    getAllPersons: function() {
        var data = localStorage.getItem('prosopographyDB');
        if (!data) return [];

        try {
            var db = JSON.parse(data);
            return db.persons || [];
        } catch (e) {
            console.error('Error parsing database:', e);
            return [];
        }
    },

    // Get person by ID
    getPersonById: function(id) {
        var persons = this.getAllPersons();
        return persons.find(function(p) { return p.id === id; });
    },

    // Add new person
    addPerson: function(person) {
        var persons = this.getAllPersons();
        var newId = 'p' + Date.now();
        person.id = newId;
        person.createdAt = new Date().toISOString();
        person.updatedAt = new Date().toISOString();

        persons.push(person);
        this.savePersons(persons);
        return newId;
    },

    // Update existing person
    updatePerson: function(id, updatedPerson) {
        var persons = this.getAllPersons();
        var index = persons.findIndex(function(p) { return p.id === id; });

        if (index === -1) return false;

        updatedPerson.id = id;
        updatedPerson.createdAt = persons[index].createdAt;
        updatedPerson.updatedAt = new Date().toISOString();

        persons[index] = updatedPerson;
        this.savePersons(persons);
        return true;
    },

    // Delete person
    deletePerson: function(id) {
        var persons = this.getAllPersons();
        var filtered = persons.filter(function(p) { return p.id !== id; });
        this.savePersons(filtered);
    },

    // Save persons array to localStorage
    savePersons: function(persons) {
        var db = {
            persons: persons,
            lastModified: new Date().toISOString()
        };
        localStorage.setItem('prosopographyDB', JSON.stringify(db));
    },

    // Search persons
    searchPersons: function(criteria) {
        var persons = this.getAllPersons();
        var results = persons;

        // Filter by name (search in standardized name and variants)
        if (criteria.name) {
            var searchName = criteria.name.toLowerCase();

            if (criteria.usePhonetic) {
                var searchSoundex = this.soundex(criteria.name);
                results = results.filter(function(person) {
                    // Check standardized name
                    if (Database.soundex(person.standardizedName) === searchSoundex) {
                        return true;
                    }

                    // Check name variants
                    if (person.nameVariants) {
                        return person.nameVariants.some(function(variant) {
                            var fullName = variant.fullName || 
                                          (variant.firstName || '') + ' ' + (variant.lastName || '');
                            return Database.soundex(fullName) === searchSoundex;
                        });
                    }

                    return false;
                });
            } else {
                results = results.filter(function(person) {
                    // Check standardized name
                    if (person.standardizedName.toLowerCase().indexOf(searchName) !== -1) {
                        return true;
                    }

                    // Check name variants
                    if (person.nameVariants) {
                        return person.nameVariants.some(function(variant) {
                            var fullName = variant.fullName || 
                                          (variant.firstName || '') + ' ' + (variant.lastName || '');
                            return fullName.toLowerCase().indexOf(searchName) !== -1;
                        });
                    }

                    return false;
                });
            }
        }

        // Filter by place
        if (criteria.place) {
            var searchPlace = criteria.place.toLowerCase();
            results = results.filter(function(person) {
                // Check birth place
                if (person.lifeEvents?.birth?.place && 
                    person.lifeEvents.birth.place.toLowerCase().indexOf(searchPlace) !== -1) {
                    return true;
                }

                // Check death place
                if (person.lifeEvents?.death?.place && 
                    person.lifeEvents.death.place.toLowerCase().indexOf(searchPlace) !== -1) {
                    return true;
                }

                // Check attestation places
                if (person.attestations) {
                    return person.attestations.some(function(att) {
                        return att.place && att.place.toLowerCase().indexOf(searchPlace) !== -1;
                    });
                }

                return false;
            });
        }

        // Filter by year
        if (criteria.year) {
            var searchYear = parseInt(criteria.year);
            results = results.filter(function(person) {
                // Check birth year
                if (person.lifeEvents?.birth?.date?.year === searchYear) {
                    return true;
                }

                // Check death year
                if (person.lifeEvents?.death?.date?.year === searchYear) {
                    return true;
                }

                // Check attestation years
                if (person.attestations) {
                    return person.attestations.some(function(att) {
                        return att.date && att.date.year === searchYear;
                    });
                }

                return false;
            });
        }

        return results;
    },

    // Soundex algorithm for phonetic matching
    soundex: function(name) {
        if (!name) return '';

        var s = name.toUpperCase();
        var a = s.split('');
        var f = a.shift();

        // Replace consonants with digits as per Soundex rules
        var r = f + a.map(function(char) {
            switch(char) {
                case 'B': case 'F': case 'P': case 'V': return '1';
                case 'C': case 'G': case 'J': case 'K': case 'Q': case 'S': case 'X': case 'Z': return '2';
                case 'D': case 'T': return '3';
                case 'L': return '4';
                case 'M': case 'N': return '5';
                case 'R': return '6';
                default: return '';
            }
        }).join('');

        // Remove duplicates
        r = r.replace(/(\d)\1+/g, '$1');

        // Pad with zeros or truncate to 4 characters
        return (r + '000').substring(0, 4);
    },

    // Get database statistics
    getStatistics: function() {
        var persons = this.getAllPersons();

        var stats = {
            totalPersons: persons.length,
            totalAttestations: 0,
            totalRelationships: 0,
            personsWithBirth: 0,
            personsWithDeath: 0,
            uniqueNationalities: 0,
            uniqueReligions: 0,
            maleCount: 0,
            femaleCount: 0,
            unknownGenderCount: 0
        };

        var nationalitiesSet = new Set();
        var religionsSet = new Set();

        persons.forEach(function(person) {
            // Count attestations
            if (person.attestations) {
                stats.totalAttestations += person.attestations.length;
            }

            // Count relationships
            if (person.relationships) {
                stats.totalRelationships += person.relationships.length;
            }

            // Count life events
            if (person.lifeEvents?.birth) {
                stats.personsWithBirth++;
            }

            if (person.lifeEvents?.death) {
                stats.personsWithDeath++;
            }

            // Track nationalities
            if (person.nationality) {
                nationalitiesSet.add(person.nationality);
            }

            // Track religions
            if (person.religion) {
                religionsSet.add(person.religion);
            }

            // Count genders
            if (person.gender === 'male') {
                stats.maleCount++;
            } else if (person.gender === 'female') {
                stats.femaleCount++;
            } else {
                stats.unknownGenderCount++;
            }
        });

        stats.uniqueNationalities = nationalitiesSet.size;
        stats.uniqueReligions = religionsSet.size;

        return stats;
    },

    // Export database as JSON
    exportJSON: function() {
        var db = {
            persons: this.getAllPersons(),
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        return JSON.stringify(db, null, 2);
    },

    // Import database from JSON
    importJSON: function(jsonString) {
        try {
            var data = JSON.parse(jsonString);

            if (!data.persons || !Array.isArray(data.persons)) {
                console.error('Invalid database format');
                return false;
            }

            this.savePersons(data.persons);
            return true;
        } catch (e) {
            console.error('Error importing database:', e);
            return false;
        }
    }
};

console.log('Database module loaded successfully');
```


**Tool Call: Read file `scripts/github-sync.js`**
Status: Completed

```webapp-prosopography/scripts/github-sync.js
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
```


**Tool Call: Read file `scripts/app.js`**
Status: Completed

```webapp-prosopography/scripts/app.js
SUCCESS: File outline retrieved. This file is too large to read all at once, so the outline below shows the file's structure with line numbers.

IMPORTANT: Do NOT retry this call without line numbers - you will get the same outline.
Instead, use the line numbers below to read specific sections by calling this tool again with start_line and end_line parameters.

# File outline for /Users/lvansnippenburg/Documents/Ontwikkeling/webapp-prosopography/scripts/app.js

init [L3-7]
bindEvents [L9-148]
handleSearch [L150-182]
 name [L162]
 place [L163]
 year [L164]
 usePhonetic [L165]
handleSavePerson [L184-205]
collectFormData [L207-223]
 standardizedName [L209]
 nationality [L210]
 gender [L211]
 religion [L212]
 religionCertainty [L213]
 nameVariants [L214]
 lifeEvents [L215]
 attestations [L216]
 relationships [L217]
 occupations [L218]
 biography [L219]
collectNameVariants [L225-264]
 fullName [L240]
 firstName [L241]
 lastName [L242]
 notes [L243]
 sources [L244]
 documentName [L253]
 location [L254]
 citation [L255]
collectLifeEvents [L266-312]
 date [L279-284]
  year [L280]
  month [L281]
  day [L282]
  circa [L283]
 place [L285]
 certainty [L286]
 date [L300-305]
  year [L301]
  month [L302]
  day [L303]
  circa [L304]
 place [L306]
 certainty [L307]
collectAttestations [L314-359]
 place [L331]
 date [L332-336]
  year [L333]
  month [L334]
  day [L335]
 event [L337]
 notes [L338]
 sources [L339]
 documentName [L348]
 location [L349]
 citation [L350]
collectRelationships [L361-398]
 relatedPerson [L375]
 type [L376]
 notes [L377]
 sources [L378]
 documentName [L387]
 location [L388]
 citation [L389]
collectOccupations [L400-409]
exportJSON [L411-425]
 type [L413]
importJSON [L427-453]

Showing symbols 1-68 (total symbols: 68)


NEXT STEPS: To read a specific symbol's implementation, call read_file with the same path plus start_line and end_line from the outline above.
For example, to read a function shown as [L100-150], use start_line: 100 and end_line: 150.
```


**Tool Call: Read file `scripts/ui.js`**
Status: Completed

```webapp-prosopography/scripts/ui.js
SUCCESS: File outline retrieved. This file is too large to read all at once, so the outline below shows the file's structure with line numbers.

IMPORTANT: Do NOT retry this call without line numbers - you will get the same outline.
Instead, use the line numbers below to read specific sections by calling this tool again with start_line and end_line parameters.

# File outline for /Users/lvansnippenburg/Documents/Ontwikkeling/webapp-prosopography/scripts/ui.js

currentEditId [L3]
variantCounter [L4]
attestationCounter [L5]
relationshipCounter [L6]
init [L9-15]
initNavigation [L18-40]
switchView [L43-67]
initForms [L70-91]
initAutocomplete [L94-97]
initNationalityAutocomplete [L100-153]
initReligionAutocomplete [L156-209]
initSourceAutocomplete [L212-294]
getSourceData [L297-321]
 documentName [L299]
 location [L299]
 documentName [L307]
 location [L308]
 documentName [L315]
 location [L316]
 documentName [L320]
 location [L320]
addNameVariantField [L324-363]
addAttestationField [L366-410]
addRelationshipField [L413-449]
loadPersonIntoForm [L452-640]
clearLifeEventFields [L643-658]
clearForm [L661-676]
renderPersonCard [L679-723]
displaySearchResults [L726-747]
displayBrowseResults [L750-787]
showPersonDetail [L790-1022]
displayStatistics [L1025-1044]

Showing symbols 1-32 (total symbols: 32)


NEXT STEPS: To read a specific symbol's implementation, call read_file with the same path plus start_line and end_line from the outline above.
For example, to read a function shown as [L100-150], use start_line: 100 and end_line: 150.
```


**Tool Call: Read file `scripts/app.js` (lines 1-453)**
Status: Completed

```webapp-prosopography/scripts/app.js
// App Module - Main application logic and form handling
var App = {
    init: function() {
        this.bindEvents();
        UI.init();
        console.log('App initialized');
    },

    bindEvents: function() {
        // Search form
        document.getElementById('btn-search').addEventListener('click', function() {
            App.handleSearch();
        });

        document.getElementById('btn-clear').addEventListener('click', function() {
            document.getElementById('search-name').value = '';
            document.getElementById('search-place').value = '';
            document.getElementById('search-year').value = '';
            document.getElementById('phonetic-search').checked = false;
            document.getElementById('search-info').style.display = 'none';
            document.getElementById('search-results').innerHTML = '';
        });

        // Person form submission
        document.getElementById('person-form').addEventListener('submit', function(e) {
            e.preventDefault();
            App.handleSavePerson();
        });

        // Sort change in browse view
        document.getElementById('sort-by').addEventListener('change', function() {
            UI.displayBrowseResults();
        });

        // Export/Import buttons
        document.getElementById('btn-export-json').addEventListener('click', function() {
            App.exportJSON();
        });

        document.getElementById('btn-import-json').addEventListener('click', function() {
            App.importJSON();
        });

        // Standardized name input - check for similar names
        var nameInput = document.getElementById('standardized-name');
        var suggestionsPanel = document.getElementById('name-suggestions');

        nameInput.addEventListener('input', function() {
            var value = nameInput.value.trim();

            if (value.length < 3) {
                suggestionsPanel.style.display = 'none';
                return;
            }

            var persons = Database.getAllPersons();
            var currentEditId = UI.currentEditId;

            // Find similar names
            var similar = persons.filter(function(p) {
                if (p.id === currentEditId) return false;

                // Check standardized name
                if (p.standardizedName.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    return true;
                }

                // Check phonetic match
                if (Database.soundex(p.standardizedName) === Database.soundex(value)) {
                    return true;
                }

                return false;
            });

            if (similar.length === 0) {
                suggestionsPanel.style.display = 'none';
                return;
            }

            // Display suggestions
            var html = '<div class="suggestions-header">⚠ Similar names found - possible duplicates:</div>';
            html += '<div class="suggestions-list">';

            similar.forEach(function(person) {
                html += '<div class="suggestion-item">';
                html += '<div class="suggestion-main">';
                html += '<strong>' + person.standardizedName + '</strong>';
                var genderIcon = person.gender === 'male' ? '♂' : person.gender === 'female' ? '♀' : '⚪';
                html += '<span class="gender-indicator">' + genderIcon + '</span>';

                if (Database.soundex(person.standardizedName) === Database.soundex(value)) {
                    html += '<span class="phonetic-badge">Phonetic Match</span>';
                }
                html += '</div>';

                if (person.lifeEvents?.birth || person.lifeEvents?.death) {
                    var birthYear = person.lifeEvents?.birth?.date?.year || '?';
                    var deathYear = person.lifeEvents?.death?.date?.year || '?';
                    html += '<div class="suggestion-details">(' + birthYear + ' - ' + deathYear + ')';
                    if (person.nationality) html += ' • ' + person.nationality;
                    html += '</div>';
                }

                if (person.nameVariants && person.nameVariants.length > 0) {
                    var variants = person.nameVariants.slice(0, 3).map(function(v) {
                        return v.fullName || (v.firstName + ' ' + v.lastName);
                    }).join(', ');
                    html += '<div class="suggestion-variants">Variants: ' + variants + '</div>';
                }

                html += '<div class="suggestion-actions">';
                html += '<button type="button" class="btn-view-suggestion" data-id="' + person.id + '">View</button>';
                html += '<button type="button" class="btn-load-suggestion" data-id="' + person.id + '">Load for Editing</button>';
                html += '</div>';
                html += '</div>';
            });

            html += '</div>';
            suggestionsPanel.innerHTML = html;
            suggestionsPanel.style.display = 'block';

            // Bind suggestion buttons
            suggestionsPanel.querySelectorAll('.btn-view-suggestion').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var id = btn.dataset.id;
                    suggestionsPanel.style.display = 'none';
                    UI.showPersonDetail(id);
                });
            });

            suggestionsPanel.querySelectorAll('.btn-load-suggestion').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var id = btn.dataset.id;
                    var person = Database.getPersonById(id);
                    suggestionsPanel.style.display = 'none';
                    UI.loadPersonIntoForm(person);
                });
            });
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target !== nameInput && !suggestionsPanel.contains(e.target)) {
                suggestionsPanel.style.display = 'none';
            }
        });
    },

    handleSearch: function() {
        var name = document.getElementById('search-name').value.trim();
        var place = document.getElementById('search-place').value.trim();
        var year = document.getElementById('search-year').value.trim();
        var usePhonetic = document.getElementById('phonetic-search').checked;

        if (!name && !place && !year) {
            alert('Please enter at least one search criterion');
            return;
        }

        var criteria = {
            name: name,
            place: place,
            year: year ? parseInt(year) : null,
            usePhonetic: usePhonetic
        };

        var results = Database.searchPersons(criteria);

        // Display search info
        var searchInfo = document.getElementById('search-info');
        var infoText = 'Found ' + results.length + ' person(s)';
        if (name) infoText += ' matching name "' + name + '"';
        if (place) infoText += ' in place "' + place + '"';
        if (year) infoText += ' in year ' + year;
        if (usePhonetic) infoText += ' (phonetic matching enabled)';

        searchInfo.innerHTML = '<p>' + infoText + '</p>';
        searchInfo.style.display = 'block';

        UI.displaySearchResults(results);
    },

    handleSavePerson: function() {
        var personData = this.collectFormData();

        if (!personData.standardizedName) {
            alert('Standardized name is required');
            return;
        }

        var editId = document.getElementById('person-id').value;

        if (editId) {
            Database.updatePerson(editId, personData);
            alert('Person updated successfully');
        } else {
            Database.addPerson(personData);
            alert('Person added successfully');
        }

        UI.clearForm();
        UI.switchView('search-view');
        UI.displayStatistics();
    },

    collectFormData: function() {
        var person = {
            standardizedName: document.getElementById('standardized-name').value.trim(),
            nationality: document.getElementById('nationality').value.trim(),
            gender: document.getElementById('gender').value,
            religion: document.getElementById('religion').value.trim(),
            religionCertainty: document.getElementById('religion-certainty').value,
            nameVariants: this.collectNameVariants(),
            lifeEvents: this.collectLifeEvents(),
            attestations: this.collectAttestations(),
            relationships: this.collectRelationships(),
            occupations: this.collectOccupations(),
            biography: document.getElementById('biography').value.trim()
        };

        return person;
    },

    collectNameVariants: function() {
        var variants = [];
        var container = document.getElementById('name-variants-container');
        var items = container.querySelectorAll('.variant-item');

        items.forEach(function(item) {
            var index = item.dataset.index;

            var fullName = item.querySelector('[name="variant-fullname-' + index + '"]')?.value.trim();
            var firstName = item.querySelector('[name="variant-firstname-' + index + '"]')?.value.trim();
            var lastName = item.querySelector('[name="variant-lastname-' + index + '"]')?.value.trim();
            var notes = item.querySelector('[name="variant-notes-' + index + '"]')?.value.trim();

            if (fullName || firstName || lastName) {
                var variant = {
                    fullName: fullName,
                    firstName: firstName,
                    lastName: lastName,
                    notes: notes,
                    sources: []
                };

                // NEW: Collect source document and location
                var sourceDoc = item.querySelector('[name="variant-source-doc-' + index + '"]')?.value.trim();
                var sourceLoc = item.querySelector('[name="variant-source-loc-' + index + '"]')?.value.trim();

                if (sourceDoc || sourceLoc) {
                    variant.sources.push({
                        documentName: sourceDoc || '',
                        location: sourceLoc || '',
                        citation: sourceDoc + (sourceLoc ? ', ' + sourceLoc : '')
                    });
                }

                variants.push(variant);
            }
        });

        return variants;
    },

    collectLifeEvents: function() {
        var lifeEvents = {};

        // Birth
        var birthYear = document.getElementById('birth-year').value;
        var birthMonth = document.getElementById('birth-month').value;
        var birthDay = document.getElementById('birth-day').value;
        var birthCirca = document.getElementById('birth-circa').checked;
        var birthPlace = document.getElementById('birth-place').value.trim();
        var birthCertainty = document.getElementById('birth-certainty').value;

        if (birthYear || birthPlace) {
            lifeEvents.birth = {
                date: {
                    year: birthYear ? parseInt(birthYear) : null,
                    month: birthMonth ? parseInt(birthMonth) : null,
                    day: birthDay ? parseInt(birthDay) : null,
                    circa: birthCirca
                },
                place: birthPlace,
                certainty: birthCertainty
            };
        }

        // Death
        var deathYear = document.getElementById('death-year').value;
        var deathMonth = document.getElementById('death-month').value;
        var deathDay = document.getElementById('death-day').value;
        var deathCirca = document.getElementById('death-circa').checked;
        var deathPlace = document.getElementById('death-place').value.trim();
        var deathCertainty = document.getElementById('death-certainty').value;

        if (deathYear || deathPlace) {
            lifeEvents.death = {
                date: {
                    year: deathYear ? parseInt(deathYear) : null,
                    month: deathMonth ? parseInt(deathMonth) : null,
                    day: deathDay ? parseInt(deathDay) : null,
                    circa: deathCirca
                },
                place: deathPlace,
                certainty: deathCertainty
            };
        }

        return lifeEvents;
    },

    collectAttestations: function() {
        var attestations = [];
        var container = document.getElementById('attestations-container');
        var items = container.querySelectorAll('.attestation-item');

        items.forEach(function(item) {
            var index = item.dataset.index;

            var place = item.querySelector('[name="att-place-' + index + '"]')?.value.trim();
            var year = item.querySelector('[name="att-year-' + index + '"]')?.value;
            var month = item.querySelector('[name="att-month-' + index + '"]')?.value;
            var day = item.querySelector('[name="att-day-' + index + '"]')?.value;
            var event = item.querySelector('[name="att-event-' + index + '"]')?.value.trim();
            var notes = item.querySelector('[name="att-notes-' + index + '"]')?.value.trim();

            if (place || year || event) {
                var attestation = {
                    place: place,
                    date: {
                        year: year ? parseInt(year) : null,
                        month: month ? parseInt(month) : null,
                        day: day ? parseInt(day) : null
                    },
                    event: event,
                    notes: notes,
                    sources: []
                };

                // NEW: Collect source document and location
                var sourceDoc = item.querySelector('[name="att-source-doc-' + index + '"]')?.value.trim();
                var sourceLoc = item.querySelector('[name="att-source-loc-' + index + '"]')?.value.trim();

                if (sourceDoc || sourceLoc) {
                    attestation.sources.push({
                        documentName: sourceDoc || '',
                        location: sourceLoc || '',
                        citation: sourceDoc + (sourceLoc ? ', ' + sourceLoc : '')
                    });
                }

                attestations.push(attestation);
            }
        });

        return attestations;
    },

    collectRelationships: function() {
        var relationships = [];
        var container = document.getElementById('relationships-container');
        var items = container.querySelectorAll('.relationship-item');

        items.forEach(function(item) {
            var index = item.dataset.index;

            var relatedPerson = item.querySelector('[name="rel-person-' + index + '"]')?.value.trim();
            var type = item.querySelector('[name="rel-type-' + index + '"]')?.value.trim();
            var notes = item.querySelector('[name="rel-notes-' + index + '"]')?.value.trim();

            if (relatedPerson || type) {
                var relationship = {
                    relatedPerson: relatedPerson,
                    type: type,
                    notes: notes,
                    sources: []
                };

                // NEW: Collect source document and location
                var sourceDoc = item.querySelector('[name="rel-source-doc-' + index + '"]')?.value.trim();
                var sourceLoc = item.querySelector('[name="rel-source-loc-' + index + '"]')?.value.trim();

                if (sourceDoc || sourceLoc) {
                    relationship.sources.push({
                        documentName: sourceDoc || '',
                        location: sourceLoc || '',
                        citation: sourceDoc + (sourceLoc ? ', ' + sourceLoc : '')
                    });
                }

                relationships.push(relationship);
            }
        });

        return relationships;
    },

    collectOccupations: function() {
        var occupationsStr = document.getElementById('occupations').value.trim();
        if (!occupationsStr) return [];

        return occupationsStr.split(',').map(function(occ) {
            return occ.trim();
        }).filter(function(occ) {
            return occ.length > 0;
        });
    },

    exportJSON: function() {
        var json = Database.exportJSON();
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.href = url;
        a.download = 'prosopography-database-' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Database exported successfully');
    },

    importJSON: function() {
        var fileInput = document.getElementById('import-file');
        var file = fileInput.files[0];

        if (!file) {
            alert('Please select a file to import');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var success = Database.importJSON(e.target.result);
                if (success) {
                    alert('Database imported successfully');
                    UI.displayStatistics();
                    UI.displayBrowseResults();
                } else {
                    alert('Import failed: Invalid file format');
                }
            } catch (err) {
                alert('Import failed: ' + err.message);
            }
        };

        reader.readAsText(file);
    }

```


**Tool Call: Read file `scripts/ui.js` (lines 1-100)**
Status: Completed

```webapp-prosopography/scripts/ui.js
// UI Module - Handles all user interface rendering and interactions
var UI = {
    currentEditId: null,
    variantCounter: 0,
    attestationCounter: 0,
    relationshipCounter: 0,

    // Initialize the application
    init: function() {
        this.initNavigation();
        this.initForms();
        this.initAutocomplete();
        this.displayStatistics();
        console.log('UI initialized');
    },

    // Navigation setup
    initNavigation: function() {
        var hamburger = document.getElementById('hamburger-btn');
        var nav = document.getElementById('main-nav');
        var navButtons = document.querySelectorAll('.nav-btn');

        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('open');
        });

        navButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var viewName = btn.id.replace('nav-', '') + '-view';
                UI.switchView(viewName);

                navButtons.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');

                nav.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });
    },

    // Switch between views
    switchView: function(viewName) {
        console.log('Switching to view:', viewName);

        document.querySelectorAll('.view').forEach(function(view) {
            view.classList.remove('active');
        });

        var targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.add('active');

            if (viewName === 'browse-view') {
                this.displayBrowseResults();
            } else if (viewName === 'add-view') {
                // Don't clear form if we're editing
                if (!this.currentEditId) {
                    this.clearForm();
                }
            } else if (viewName === 'search-view') {
                this.displayStatistics();
            }
        } else {
            console.error('View not found:', viewName);
        }
    },

    // Initialize forms
    initForms: function() {
        var form = document.getElementById('person-form');
        var btnCancel = document.getElementById('btn-cancel');

        btnCancel.addEventListener('click', function() {
            UI.switchView('search-view');
            UI.clearForm();
        });

        // Dynamic field buttons
        document.getElementById('btn-add-variant').addEventListener('click', function() {
            UI.addNameVariantField();
        });

        document.getElementById('btn-add-attestation').addEventListener('click', function() {
            UI.addAttestationField();
        });

        document.getElementById('btn-add-relationship').addEventListener('click', function() {
            UI.addRelationshipField();
        });
    },

    // Initialize autocomplete for nationality, religion, and source documents
    initAutocomplete: function() {
        this.initNationalityAutocomplete();
        this.initReligionAutocomplete();
    },

    // Nationality autocomplete
    initNationalityAutocomplete: function() {

```


**Tool Call: Read file `scripts/ui.js` (lines 726-1044)**
Status: Completed

```webapp-prosopography/scripts/ui.js
    displaySearchResults: function(results) {
        var container = document.getElementById('search-results');

        if (results.length === 0) {
            container.innerHTML = '<p>No results found.</p>';
            return;
        }

        var html = '';
        results.forEach(function(person) {
            html += UI.renderPersonCard(person);
        });

        container.innerHTML = html;

        container.querySelectorAll('.person-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = card.dataset.id;
                UI.showPersonDetail(id);
            });
        });
    },

    // Display browse results
    displayBrowseResults: function() {
        var container = document.getElementById('browse-results');
        var sortBy = document.getElementById('sort-by').value;

        var persons = Database.getAllPersons();

        if (sortBy === 'birth') {
            persons.sort(function(a, b) {
                var aYear = a.lifeEvents && a.lifeEvents.birth && a.lifeEvents.birth.date ? a.lifeEvents.birth.date.year || 9999 : 9999;
                var bYear = b.lifeEvents && b.lifeEvents.birth && b.lifeEvents.birth.date ? b.lifeEvents.birth.date.year || 9999 : 9999;
                return aYear - bYear;
            });
        } else if (sortBy === 'death') {
            persons.sort(function(a, b) {
                var aYear = a.lifeEvents && a.lifeEvents.death && a.lifeEvents.death.date ? a.lifeEvents.death.date.year || 9999 : 9999;
                var bYear = b.lifeEvents && b.lifeEvents.death && b.lifeEvents.death.date ? b.lifeEvents.death.date.year || 9999 : 9999;
                return aYear - bYear;
            });
        } else {
            persons.sort(function(a, b) {
                return a.standardizedName.localeCompare(b.standardizedName);
            });
        }

        var html = '';
        persons.forEach(function(person) {
            html += UI.renderPersonCard(person);
        });

        container.innerHTML = html;

        container.querySelectorAll('.person-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var id = card.dataset.id;
                UI.showPersonDetail(id);
            });
        });
    },

    // Show person detail modal - WITH ENHANCED EDIT BUTTON
    showPersonDetail: function(id) {
        console.log('showPersonDetail called for ID:', id);

        var person = Database.getPersonById(id);
        if (!person) {
            console.error('Person not found:', id);
            return;
        }

        console.log('Person found:', person);

        var modal = document.getElementById('detail-modal');
        var content = document.getElementById('detail-content');

        var html = '<h2>' + person.standardizedName + '</h2>';

        html += '<div class="detail-basic-info">';
        if (person.nationality) {
            html += '<p><strong>Nationality:</strong> ' + person.nationality + '</p>';
        }
        if (person.gender) {
            html += '<p><strong>Gender:</strong> ' + person.gender + '</p>';
        }
        if (person.religion) {
            html += '<p><strong>Religion:</strong> ' + person.religion;
            if (person.religionCertainty && person.religionCertainty !== 'certain') {
                html += ' <em>(' + person.religionCertainty + ')</em>';
            }
            html += '</p>';
        }
        html += '</div>';

        if (person.lifeEvents) {
            html += '<h3>Life Events</h3>';

            if (person.lifeEvents.birth) {
                var birth = person.lifeEvents.birth;
                html += '<p><strong>Birth:</strong> ';
                if (birth.date) {
                    if (birth.date.circa) html += 'circa ';
                    html += birth.date.year || '';
                    if (birth.date.month) html += '-' + birth.date.month;
                    if (birth.date.day) html += '-' + birth.date.day;
                }
                if (birth.place) html += ' in ' + birth.place;
                if (birth.certainty && birth.certainty !== 'certain') {
                    html += ' <em>(' + birth.certainty + ')</em>';
                }
                html += '</p>';
            }

            if (person.lifeEvents.death) {
                var death = person.lifeEvents.death;
                html += '<p><strong>Death:</strong> ';
                if (death.date) {
                    if (death.date.circa) html += 'circa ';
                    html += death.date.year || '';
                    if (death.date.month) html += '-' + death.date.month;
                    if (death.date.day) html += '-' + death.date.day;
                }
                if (death.place) html += ' in ' + death.place;
                if (death.certainty && death.certainty !== 'certain') {
                    html += ' <em>(' + death.certainty + ')</em>';
                }
                html += '</p>';
            }
        }

        if (person.nameVariants && person.nameVariants.length > 0) {
            html += '<h3>Name Variants</h3>';
            html += '<ul class="variant-list">';
            person.nameVariants.forEach(function(variant) {
                html += '<li>';
                html += variant.fullName || (variant.firstName + ' ' + variant.lastName);
                if (variant.notes) {
                    html += ' <em>(' + variant.notes + ')</em>';
                }
                if (variant.sources && variant.sources.length > 0) {
                    html += '<br><span class="source-ref">Source: ';
                    var sourceParts = [];
                    variant.sources.forEach(function(source) {
                        if (source.documentName) {
                            var srcText = source.documentName;
                            if (source.location) srcText += ', ' + source.location;
                            sourceParts.push(srcText);
                        } else if (source.citation) {
                            sourceParts.push(source.citation);
                        }
                    });
                    html += sourceParts.join('; ');
                    html += '</span>';
                }
                html += '</li>';
            });
            html += '</ul>';
        }

        if (person.attestations && person.attestations.length > 0) {
            html += '<h3>Attestations</h3>';
            html += '<ul class="attestation-list">';
            person.attestations.forEach(function(att) {
                html += '<li>';
                if (att.date) {
                    html += '<strong>' + (att.date.year || '') + '</strong> ';
                }
                if (att.place) {
                    html += 'in ' + att.place + ': ';
                }
                if (att.event) {
                    html += att.event;
                }
                if (att.notes) {
                    html += ' <em>(' + att.notes + ')</em>';
                }
                if (att.sources && att.sources.length > 0) {
                    html += '<br><span class="source-ref">Source: ';
                    var sourceParts = [];
                    att.sources.forEach(function(source) {
                        if (source.documentName) {
                            var srcText = source.documentName;
                            if (source.location) srcText += ', ' + source.location;
                            sourceParts.push(srcText);
                        } else if (source.citation) {
                            sourceParts.push(source.citation);
                        }
                    });
                    html += sourceParts.join('; ');
                    html += '</span>';
                }
                html += '</li>';
            });
            html += '</ul>';
        }

        if (person.relationships && person.relationships.length > 0) {
            html += '<h3>Relationships</h3>';
            html += '<ul class="relationship-list">';
            person.relationships.forEach(function(rel) {
                html += '<li>';
                html += '<strong>' + rel.type + ':</strong> ' + rel.relatedPerson;
                if (rel.notes) {
                    html += ' <em>(' + rel.notes + ')</em>';
                }
                if (rel.sources && rel.sources.length > 0) {
                    html += '<br><span class="source-ref">Source: ';
                    var sourceParts = [];
                    rel.sources.forEach(function(source) {
                        if (source.documentName) {
                            var srcText = source.documentName;
                            if (source.location) srcText += ', ' + source.location;
                            sourceParts.push(srcText);
                        } else if (source.citation) {
                            sourceParts.push(source.citation);
                        }
                    });
                    html += sourceParts.join('; ');
                    html += '</span>';
                }
                html += '</li>';
            });
            html += '</ul>';
        }

        if (person.occupations && person.occupations.length > 0) {
            html += '<h3>Occupations</h3>';
            html += '<p>' + person.occupations.join(', ') + '</p>';
        }

        if (person.biography) {
            html += '<h3>Biography / Notes</h3>';
            html += '<p>' + person.biography + '</p>';
        }

        content.innerHTML = html;
        modal.classList.add('active');

        console.log('Modal displayed');

        // Bind close button
        var closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                console.log('Close button clicked');
                modal.classList.remove('active');
            };
        }

        // Bind edit button - ENHANCED
        var editBtn = document.getElementById('btn-edit-person');
        if (editBtn) {
            console.log('Edit button found, binding click handler');
            // Remove any existing listeners
            var newEditBtn = editBtn.cloneNode(true);
            editBtn.parentNode.replaceChild(newEditBtn, editBtn);

            newEditBtn.addEventListener('click', function() {
                console.log('=== EDIT BUTTON CLICKED ===');
                console.log('Closing modal...');
                modal.classList.remove('active');

                console.log('Loading person into form...');
                setTimeout(function() {
                    UI.loadPersonIntoForm(person);
                }, 100); // Small delay to ensure modal closes first
            });
        } else {
            console.error('Edit button not found!');
        }

        // Bind delete button
        var deleteBtn = document.getElementById('btn-delete-person');
        if (deleteBtn) {
            // Remove any existing listeners
            var newDeleteBtn = deleteBtn.cloneNode(true);
            deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

            newDeleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete ' + person.standardizedName + '?')) {
                    Database.deletePerson(id);
                    modal.classList.remove('active');
                    UI.displayBrowseResults();
                    UI.displayStatistics();
                }
            });
        }

        // Close on background click
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.classList.remove('active');
            }
        };
    },

    // Display statistics
    displayStatistics: function() {
        var stats = Database.getStatistics();
        var statsDiv = document.getElementById('stats-display');

        if (!statsDiv) return;

        var html = '';
        html += '<div class="stat-card"><div class="number">' + stats.totalPersons + '</div><div class="label">Total Persons</div></div>';
        html += '<div class="stat-card"><div class="number">' + stats.totalAttestations + '</div><div class="label">Total Attestations</div></div>';
        html += '<div class="stat-card"><div class="number">' + stats.totalRelationships + '</div><div class="label">Total Relationships</div></div>';
        html += '<div class="stat-card"><div class="number">' + stats.personsWithBirth + '</div><div class="label">With Birth Data</div></div>';
        html += '<div class="stat-card"><div class="number">' + stats.personsWithDeath + '</div><div class="label">With Death Data</div></div>';
        html += '<div class="stat-card"><div class="number">' + (stats.uniqueNationalities || 0) + '</div><div class="label">Nationalities</div></div>';
        html += '<div class="stat-card"><div class="number">' + (stats.uniqueReligions || 0) + '</div><div class="label">Religions</div></div>';
        html += '<div class="stat-card"><div class="number">' + stats.maleCount + '</div><div class="label">Male</div></div>';
        html += '<div class="stat-card"><div class="number">' + stats.femaleCount + '</div><div class="label">Female</div></div>';
        html += '<div class="stat-card"><div class="number">' + (stats.unknownGenderCount || 0) + '</div><div class="label">Unknown Gender</div></div>';

        statsDiv.innerHTML = html;
    }

```


**Tool Call: Read file `index.html` (lines 240-358)**
Status: Completed

```webapp-prosopography/index.html
            <section id="export-view" class="view">
                <h2>Export / Import Data</h2>

                <div class="export-section">
                    <h3>Sync with GitHub</h3>
                    <p id="github-status">Not connected to GitHub</p>
                    <div class="github-actions">
                        <button id="btn-push-github" disabled>Push to GitHub</button>
                        <button id="btn-pull-github" disabled>Pull from GitHub</button>
                        <button id="btn-view-history">View GitHub History</button>
                    </div>
                    <div id="sync-status" class="sync-status"></div>
                </div>

                <div class="export-section">
                    <h3>Local Export/Import</h3>
                    <p>Download or upload your database as a JSON file.</p>
                    <button id="btn-export-json">Download JSON</button>
                    <div style="margin-top: 1rem;">
                        <input type="file" id="import-file" accept=".json">
                        <button id="btn-import-json">Import JSON</button>
                    </div>
                </div>
            </section>

            <!-- Settings View -->
            <section id="settings-view" class="view">
                <h2>Settings</h2>

                <div class="settings-section">
                    <h3>GitHub Integration</h3>
                    <p>Connect your prosopography database to GitHub for automatic version control and backup.</p>

                    <div class="github-setup">
                        <h4>Step 1: Create a Personal Access Token</h4>
                        <ol>
                            <li>Go to <a href="https://github.com/settings/tokens?type=beta" target="_blank">GitHub Settings → Tokens (Fine-grained)</a></li>
                            <li>Click "Generate new token"</li>
                            <li>Give it a name like "Prosopography Database"</li>
                            <li>Set expiration (recommend 90 days or 1 year)</li>
                            <li>Under "Repository access", select "Only select repositories"</li>
                            <li>Choose: <strong>lvansnippenburg/JsonDataStorage</strong></li>
                            <li>Under "Repository permissions", set <strong>Contents</strong> to "Read and write"</li>
                            <li>Click "Generate token" and copy it</li>
                        </ol>

                        <h4>Step 2: Configure Connection</h4>
                        <div class="settings-form">
                            <label>
                                GitHub Personal Access Token:
                                <input type="password" id="github-token" placeholder="ghp_xxxxxxxxxxxx">
                                <small>This token is stored only on your device (localStorage)</small>
                            </label>

                            <label>
                                File Path in Repository:
                                <input type="text" id="github-filepath" value="prosopography-database.json">
                                <small>The JSON file name in your GitHub repository</small>
                            </label>

                            <label>
                                Branch:
                                <input type="text" id="github-branch" value="main">
                                <small>Usually "main" or "master"</small>
                            </label>

                            <div class="settings-actions">
                                <button id="btn-save-settings">Save Settings</button>
                                <button id="btn-test-connection">Test Connection</button>
                                <button id="btn-clear-settings" class="btn-danger">Clear Settings</button>
                            </div>

                            <div id="connection-status" class="connection-status"></div>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>About</h3>
                    <p><strong>Turncoats and Apostates</strong></p>
                    <p>A specialized tool for managing historical prosopographical research with support for name variants, attestations, relationships, and phonetic matching. The coat of arms represents the city of Livorno, a key location in the study of religious conversion and migration in early modern Europe.</p>
                    <p>Repository: <a href="https://github.com/lvansnippenburg/JsonDataStorage" target="_blank">lvansnippenburg/JsonDataStorage</a></p>
                </div>
            </section>

            <!-- Person Detail View (modal) -->
            <div id="detail-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div id="detail-content"></div>
                    <div class="modal-actions">
                        <button id="btn-edit-person">Edit</button>
                        <button id="btn-delete-person">Delete</button>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Scripts with cache busters to force reload -->
    <script src="scripts/database.js?v=10"></script>
    <script src="scripts/github-sync.js?v=10"></script>
    <script src="scripts/ui.js?v=10"></script>
    <script src="scripts/app.js?v=10"></script>

    <!-- Service Worker Registration -->
    <script>
    if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('scripts/service-worker.js')
        .then(function(registration) {
            console.log('ServiceWorker registered:', registration.scope);
        });
    });
    }
    </script>

</body>
</html>
```


## Assistant

Now I have a thorough understanding of the codebase. Let me also look at the remaining UI parts and the settings HTML:

**Tool Call: Read file `scripts/ui.js` (lines 452-726)**
Status: Completed

```webapp-prosopography/scripts/ui.js
    loadPersonIntoForm: function(person) {
        console.log('=== loadPersonIntoForm called ===');
        console.log('Person ID:', person.id);
        console.log('Person data:', person);

        try {
            this.currentEditId = person.id;
            console.log('Set currentEditId:', this.currentEditId);

            // Update form title and ID
            var formTitle = document.getElementById('form-title');
            var personIdField = document.getElementById('person-id');

            if (formTitle) {
                formTitle.textContent = 'Edit Person';
                console.log('✓ Updated form title');
            } else {
                console.error('✗ form-title element not found!');
            }

            if (personIdField) {
                personIdField.value = person.id;
                console.log('✓ Set person-id field');
            } else {
                console.error('✗ person-id element not found!');
            }

            // Basic info fields
            var nameField = document.getElementById('standardized-name');
            var nationalityField = document.getElementById('nationality');
            var genderField = document.getElementById('gender');
            var religionField = document.getElementById('religion');
            var religionCertaintyField = document.getElementById('religion-certainty');

            if (nameField) {
                nameField.value = person.standardizedName || '';
                console.log('✓ Set standardized-name:', nameField.value);
            } else {
                console.error('✗ standardized-name field not found!');
            }

            if (nationalityField) {
                nationalityField.value = person.nationality || '';
                console.log('✓ Set nationality:', nationalityField.value);
            }

            if (genderField) {
                genderField.value = person.gender || 'unknown';
                console.log('✓ Set gender:', genderField.value);
            }

            if (religionField) {
                religionField.value = person.religion || '';
                console.log('✓ Set religion:', religionField.value);
            }

            if (religionCertaintyField) {
                religionCertaintyField.value = person.religionCertainty || 'certain';
                console.log('✓ Set religion-certainty:', religionCertaintyField.value);
            }

            // Life events - Birth
            console.log('Loading birth data...');
            if (person.lifeEvents && person.lifeEvents.birth) {
                var birth = person.lifeEvents.birth;
                if (birth.date) {
                    var birthYearEl = document.getElementById('birth-year');
                    var birthMonthEl = document.getElementById('birth-month');
                    var birthDayEl = document.getElementById('birth-day');
                    var birthCircaEl = document.getElementById('birth-circa');

                    if (birthYearEl) birthYearEl.value = birth.date.year || '';
                    if (birthMonthEl) birthMonthEl.value = birth.date.month || '';
                    if (birthDayEl) birthDayEl.value = birth.date.day || '';
                    if (birthCircaEl) birthCircaEl.checked = birth.date.circa || false;

                    console.log('✓ Birth date:', birth.date.year, birth.date.month, birth.date.day);
                }
                var birthPlaceEl = document.getElementById('birth-place');
                var birthCertaintyEl = document.getElementById('birth-certainty');
                if (birthPlaceEl) birthPlaceEl.value = birth.place || '';
                if (birthCertaintyEl) birthCertaintyEl.value = birth.certainty || 'certain';
            } else {
                console.log('No birth data');
                this.clearLifeEventFields('birth');
            }

            // Life events - Death
            console.log('Loading death data...');
            if (person.lifeEvents && person.lifeEvents.death) {
                var death = person.lifeEvents.death;
                if (death.date) {
                    var deathYearEl = document.getElementById('death-year');
                    var deathMonthEl = document.getElementById('death-month');
                    var deathDayEl = document.getElementById('death-day');
                    var deathCircaEl = document.getElementById('death-circa');

                    if (deathYearEl) deathYearEl.value = death.date.year || '';
                    if (deathMonthEl) deathMonthEl.value = death.date.month || '';
                    if (deathDayEl) deathDayEl.value = death.date.day || '';
                    if (deathCircaEl) deathCircaEl.checked = death.date.circa || false;

                    console.log('✓ Death date:', death.date.year, death.date.month, death.date.day);
                }
                var deathPlaceEl = document.getElementById('death-place');
                var deathCertaintyEl = document.getElementById('death-certainty');
                if (deathPlaceEl) deathPlaceEl.value = death.place || '';
                if (deathCertaintyEl) deathCertaintyEl.value = death.certainty || 'certain';
            } else {
                console.log('No death data');
                this.clearLifeEventFields('death');
            }

            // Additional info
            var occupationsEl = document.getElementById('occupations');
            var biographyEl = document.getElementById('biography');

            if (occupationsEl) {
                if (person.occupations && person.occupations.length > 0) {
                    occupationsEl.value = person.occupations.join(', ');
                } else {
                    occupationsEl.value = '';
                }
                console.log('✓ Set occupations');
            }

            if (biographyEl) {
                biographyEl.value = person.biography || '';
                console.log('✓ Set biography');
            }

            // Clear dynamic fields
            console.log('Clearing dynamic fields...');
            var variantsContainer = document.getElementById('name-variants-container');
            var attestationsContainer = document.getElementById('attestations-container');
            var relationshipsContainer = document.getElementById('relationships-container');

            if (variantsContainer) variantsContainer.innerHTML = '';
            if (attestationsContainer) attestationsContainer.innerHTML = '';
            if (relationshipsContainer) relationshipsContainer.innerHTML = '';

            this.variantCounter = 0;
            this.attestationCounter = 0;
            this.relationshipCounter = 0;

            // Load name variants
            console.log('Loading name variants...');
            if (person.nameVariants && person.nameVariants.length > 0) {
                console.log('Found', person.nameVariants.length, 'variants');
                person.nameVariants.forEach(function(variant) {
                    UI.addNameVariantField(variant);
                });
                console.log('✓ Loaded variants');
            }

            // Load attestations
            console.log('Loading attestations...');
            if (person.attestations && person.attestations.length > 0) {
                console.log('Found', person.attestations.length, 'attestations');
                person.attestations.forEach(function(attestation) {
                    UI.addAttestationField(attestation);
                });
                console.log('✓ Loaded attestations');
            }

            // Load relationships
            console.log('Loading relationships...');
            if (person.relationships && person.relationships.length > 0) {
                console.log('Found', person.relationships.length, 'relationships');
                person.relationships.forEach(function(relationship) {
                    UI.addRelationshipField(relationship);
                });
                console.log('✓ Loaded relationships');
            }

            console.log('✓ loadPersonIntoForm completed successfully');
            console.log('Now switching to add-view...');

            // Switch to form view
            this.switchView('add-view');

            console.log('=== loadPersonIntoForm finished ===');

        } catch (error) {
            console.error('ERROR in loadPersonIntoForm:', error);
            console.error('Error stack:', error.stack);
            alert('Error loading person data: ' + error.message);
        }
    },

    // Helper to clear life event fields
    clearLifeEventFields: function(eventType) {
        var prefix = eventType; // 'birth' or 'death'
        var yearEl = document.getElementById(prefix + '-year');
        var monthEl = document.getElementById(prefix + '-month');
        var dayEl = document.getElementById(prefix + '-day');
        var circaEl = document.getElementById(prefix + '-circa');
        var placeEl = document.getElementById(prefix + '-place');
        var certaintyEl = document.getElementById(prefix + '-certainty');

        if (yearEl) yearEl.value = '';
        if (monthEl) monthEl.value = '';
        if (dayEl) dayEl.value = '';
        if (circaEl) circaEl.checked = false;
        if (placeEl) placeEl.value = '';
        if (certaintyEl) certaintyEl.value = 'certain';
    },

    // Clear form
    clearForm: function() {
        console.log('Clearing form...');
        this.currentEditId = null;
        document.getElementById('form-title').textContent = 'Add New Person';
        document.getElementById('person-form').reset();
        document.getElementById('person-id').value = '';

        document.getElementById('name-variants-container').innerHTML = '';
        document.getElementById('attestations-container').innerHTML = '';
        document.getElementById('relationships-container').innerHTML = '';

        this.variantCounter = 0;
        this.attestationCounter = 0;
        this.relationshipCounter = 0;
        console.log('✓ Form cleared');
    },

    // Render person card
    renderPersonCard: function(person) {
        var html = '<div class="person-card" data-id="' + person.id + '">';
        html += '<h3>';
        html += person.standardizedName;

        var badges = [];
        if (person.nationality) {
            badges.push('<span class="badge nationality-badge">' + person.nationality + '</span>');
        }

        if (person.religion) {
            var certaintyLabel = person.religionCertainty === 'certain' ? '' : ' (' + person.religionCertainty + ')';
            badges.push('<span class="badge" style="background: #9b59b6; color: white;">' + person.religion + certaintyLabel + '</span>');
        }

        var genderIcon = person.gender === 'male' ? '♂' : person.gender === 'female' ? '♀' : '⚪';
        var genderClass = 'gender-' + person.gender;
        badges.push('<span class="badge gender-badge ' + genderClass + '">' + genderIcon + '</span>');

        if (badges.length > 0) {
            html += ' ' + badges.join(' ');
        }

        html += '</h3>';

        if (person.lifeEvents && (person.lifeEvents.birth || person.lifeEvents.death)) {
            var birthYear = person.lifeEvents.birth && person.lifeEvents.birth.date ? person.lifeEvents.birth.date.year || '?' : '?';
            var deathYear = person.lifeEvents.death && person.lifeEvents.death.date ? person.lifeEvents.death.date.year || '?' : '?';
            html += '<div class="dates">(' + birthYear + ' - ' + deathYear + ')</div>';
        }

        if (person.nameVariants && person.nameVariants.length > 0) {
            var variantNames = person.nameVariants.map(function(v) {
                return v.fullName || (v.firstName + ' ' + v.lastName);
            }).join(', ');
            html += '<div class="variants">Also known as: ' + variantNames + '</div>';
        }

        if (person.attestations && person.attestations.length > 0) {
            html += '<div class="attestations-count">' + person.attestations.length + ' attestation(s)</div>';
        }

        html += '</div>';
        return html;
    },

    // Display search results
    displaySearchResults: function(results) {

```


**Tool Call: Read file `index.html` (lines 240-265)**
Status: Completed

```webapp-prosopography/index.html
            <section id="export-view" class="view">
                <h2>Export / Import Data</h2>

                <div class="export-section">
                    <h3>Sync with GitHub</h3>
                    <p id="github-status">Not connected to GitHub</p>
                    <div class="github-actions">
                        <button id="btn-push-github" disabled>Push to GitHub</button>
                        <button id="btn-pull-github" disabled>Pull from GitHub</button>
                        <button id="btn-view-history">View GitHub History</button>
                    </div>
                    <div id="sync-status" class="sync-status"></div>
                </div>

                <div class="export-section">
                    <h3>Local Export/Import</h3>
                    <p>Download or upload your database as a JSON file.</p>
                    <button id="btn-export-json">Download JSON</button>
                    <div style="margin-top: 1rem;">
                        <input type="file" id="import-file" accept=".json">
                        <button id="btn-import-json">Import JSON</button>
                    </div>
                </div>
            </section>

            <!-- Settings View -->

```


## Assistant

Now I have a complete picture of the codebase. Let me plan the changes:

1. **`database.js`** — Rewrite to use IndexedDB (async), add UUID + `modifiedAt` to every record
2. **`github-sync.js`** — Rewrite push/pull to work per-file (one file per UUID), compare `modifiedAt` dates, use a folder path (e.g. `records/`) instead of a single flat file; keep settings in `localStorage` (fine for non-sensitive config, token already was there)
3. **`app.js`** — All `Database.*` calls become async (await-based), update `handleSavePerson`, `handleSearch`, `exportJSON`, `importJSON`
4. **`ui.js`** — Same async treatment for `displayBrowseResults`, `displaySearchResults`, `displayStatistics`, `showPersonDetail`
5. **`index.html`** — Update the GitHub settings label (file path → folder path), bump `?v=` cache busters

Let's start with the complete rewrites:

**Tool Call: scripts/database.js**
Status: Completed

Diff: scripts/database.js
```
// Database Module - Handles all data storage and retrieval via IndexedDB
const Database = {
  DB_NAME: "prosopographyDB",
  DB_VERSION: 2,
  STORE_NAME: "persons",
  _db: null,

  // ── Helpers ──────────────────────────────────────────────────────────────

  // Generate a RFC-4122 v4 UUID
  generateUUID: function () {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older environments
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  // ── Initialisation ────────────────────────────────────────────────────────

  // Open (or upgrade) the IndexedDB database.
  // Returns a Promise that resolves with the IDBDatabase instance.
  open: function () {
    if (this._db) return Promise.resolve(this._db);

    var self = this;
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open(self.DB_NAME, self.DB_VERSION);

      request.onupgradeneeded = function (event) {
        var db = event.target.result;

        // Create the object store if it doesn't exist
        if (!db.objectStoreNames.contains(self.STORE_NAME)) {
          var store = db.createObjectStore(self.STORE_NAME, { keyPath: "uuid" });
          store.createIndex("standardizedName", "standardizedName", { unique: false });
          store.createIndex("modifiedAt", "modifiedAt", { unique: false });
          console.log("IndexedDB: object store created");
        } else {
          // Store already exists; make sure the modifiedAt index exists
          var tx = event.target.transaction;
          var store = tx.objectStore(self.STORE_NAME);
          if (!store.indexNames.contains("modifiedAt")) {
            store.createIndex("modifiedAt", "modifiedAt", { unique: false });
          }
        }

        // ── Migration: import existing localStorage data ───────────────
        var raw = localStorage.getItem("prosopographyDB");
        if (raw) {
          try {
            var legacy = JSON.parse(raw);
            var persons = legacy.persons || [];
            var tx2 = event.target.transaction;
            var migrateStore = tx2.objectStore(self.STORE_NAME);
            var now = new Date().toISOString();

            persons.forEach(function (person) {
              // Give each legacy record a UUID and modifiedAt if missing
              if (!person.uuid) {
                person.uuid = self.generateUUID();
              }
              if (!person.modifiedAt) {
                person.modifiedAt = person.updatedAt || person.createdAt || now;
              }
              migrateStore.put(person);
            });

            console.log("IndexedDB: migrated " + persons.length + " records from localStorage");
          } catch (e) {
            console.warn("IndexedDB: could not migrate localStorage data:", e);
          }
        }
      };

      request.onsuccess = function (event) {
        self._db = event.target.result;
        console.log("IndexedDB: opened successfully");
        resolve(self._db);
      };

      request.onerror = function (event) {
        console.error("IndexedDB: open error", event.target.error);
        reject(event.target.error);
      };
    });
  },

  // Convenience: run a callback inside a readwrite transaction on the persons store.
  // cb receives (store) and must return a request or null.
  // Returns a Promise.
  _txWrite: function (cb) {
    return this.open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(["persons"], "readwrite");
        var store = tx.objectStore("persons");
        var req = cb(store);
        if (req) {
          req.onsuccess = function () {
            resolve(req.result);
          };
          req.onerror = function () {
            reject(req.error);
          };
        } else {
          tx.oncomplete = function () {
            resolve();
          };
          tx.onerror = function () {
            reject(tx.error);
          };
        }
      });
    });
  },

  // Convenience: run a callback inside a readonly transaction.
  _txRead: function (cb) {
    return this.open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(["persons"], "readonly");
        var store = tx.objectStore("persons");
        var req = cb(store);
        req.onsuccess = function () {
          resolve(req.result);
        };
        req.onerror = function () {
          reject(req.error);
        };
      });
    });
  },

  // ── CRUD ──────────────────────────────────────────────────────────────────

  // Returns Promise<Person[]>
  getAllPersons: function () {
    return this._txRead(function (store) {
      return store.getAll();
    });
  },

  // Returns Promise<Person|undefined>
  getPersonByUUID: function (uuid) {
    return this._txRead(function (store) {
      return store.get(uuid);
    });
  },

  // Legacy alias used in older call-sites (id used to be a 'p'+timestamp string)
  // Now id === uuid.  Returns Promise<Person|undefined>
  getPersonById: function (id) {
    return this.getPersonByUUID(id);
  },

  // Returns Promise<string> — the new uuid
  addPerson: function (person) {
    var self = this;
    var now = new Date().toISOString();
    person.uuid = this.generateUUID();
    person.id = person.uuid; // keep id === uuid for compatibility
    person.createdAt = now;
    person.modifiedAt = now;
    // legacy field
    person.updatedAt = now;

    return this._txWrite(function (store) {
      return store.add(person);
    }).then(function () {
      return person.uuid;
    });
  },

  // Returns Promise<boolean>
  updatePerson: function (id, updatedPerson) {
    var self = this;
    return this.getPersonByUUID(id).then(function (existing) {
      if (!existing) return false;

      var now = new Date().toISOString();
      updatedPerson.uuid = id;
      updatedPerson.id = id;
      updatedPerson.createdAt = existing.createdAt;
      updatedPerson.modifiedAt = now;
      updatedPerson.updatedAt = now;

      return self
        ._txWrite(function (store) {
          return store.put(updatedPerson);
        })
        .then(function () {
          return true;
        });
    });
  },

  // Returns Promise<void>
  deletePerson: function (id) {
    return this._txWrite(function (store) {
      return store.delete(id);
    });
  },

  // Upsert a person by uuid (used by import / GitHub pull).
  // If a record with this uuid already exists and the incoming modifiedAt is
  // not newer, the existing record is left untouched.
  // Returns Promise<'inserted'|'updated'|'skipped'>
  upsertPerson: function (person) {
    var self = this;
    if (!person.uuid) {
      person.uuid = this.generateUUID();
      person.id = person.uuid;
    }
    return this.getPersonByUUID(person.uuid).then(function (existing) {
      if (!existing) {
        // New record
        var now = new Date().toISOString();
        if (!person.modifiedAt) person.modifiedAt = now;
        if (!person.createdAt) person.createdAt = now;
        person.id = person.uuid;
        return self
          ._txWrite(function (store) {
            return store.put(person);
          })
          .then(function () {
            return "inserted";
          });
      }

      // Existing record — only overwrite if incoming is newer
      var incomingDate = person.modifiedAt ? new Date(person.modifiedAt) : new Date(0);
      var existingDate = existing.modifiedAt ? new Date(existing.modifiedAt) : new Date(0);

      if (incomingDate <= existingDate) {
        return "skipped";
      }

      person.id = person.uuid;
      person.createdAt = existing.createdAt || person.createdAt;
      return self
        ._txWrite(function (store) {
          return store.put(person);
        })
        .then(function () {
          return "updated";
        });
    });
  },

  // ── Search ────────────────────────────────────────────────────────────────

  // Returns Promise<Person[]>
  searchPersons: function (criteria) {
    return this.getAllPersons().then(function (persons) {
      var results = persons;

      // Filter by name
      if (criteria.name) {
        var searchName = criteria.name.toLowerCase();

        if (criteria.usePhonetic) {
          var searchSoundex = Database.soundex(criteria.name);
          results = results.filter(function (person) {
            if (Database.soundex(person.standardizedName) === searchSoundex) return true;
            if (person.nameVariants) {
              return person.nameVariants.some(function (variant) {
                var fullName =
                  variant.fullName || (variant.firstName || "") + " " + (variant.lastName || "");
                return Database.soundex(fullName) === searchSoundex;
              });
            }
            return false;
          });
        } else {
          results = results.filter(function (person) {
            if (person.standardizedName.toLowerCase().indexOf(searchName) !== -1) return true;
            if (person.nameVariants) {
              return person.nameVariants.some(function (variant) {
                var fullName =
                  variant.fullName || (variant.firstName || "") + " " + (variant.lastName || "");
                return fullName.toLowerCase().indexOf(searchName) !== -1;
              });
            }
            return false;
          });
        }
      }

      // Filter by place
      if (criteria.place) {
        var searchPlace = criteria.place.toLowerCase();
        results = results.filter(function (person) {
          if (
            person.lifeEvents &&
            person.lifeEvents.birth &&
            person.lifeEvents.birth.place &&
            person.lifeEvents.birth.place.toLowerCase().indexOf(searchPlace) !== -1
          )
            return true;
          if (
            person.lifeEvents &&
            person.lifeEvents.death &&
            person.lifeEvents.death.place &&
            person.lifeEvents.death.place.toLowerCase().indexOf(searchPlace) !== -1
          )
            return true;
          if (person.attestations) {
            return person.attestations.some(function (att) {
              return att.place && att.place.toLowerCase().indexOf(searchPlace) !== -1;
            });
          }
          return false;
        });
      }

      // Filter by year
      if (criteria.year) {
        var searchYear = parseInt(criteria.year);
        results = results.filter(function (person) {
          if (
            person.lifeEvents &&
            person.lifeEvents.birth &&
            person.lifeEvents.birth.date &&
            person.lifeEvents.birth.date.year === searchYear
          )
            return true;
          if (
            person.lifeEvents &&
            person.lifeEvents.death &&
            person.lifeEvents.death.date &&
            person.lifeEvents.death.date.year === searchYear
          )
            return true;
          if (person.attestations) {
            return person.attestations.some(function (att) {
              return att.date && att.date.year === searchYear;
            });
          }
          return false;
        });
      }

      return results;
    });
  },

  // ── Soundex ───────────────────────────────────────────────────────────────

  soundex: function (name) {
    if (!name) return "";
    var s = name.toUpperCase();
    var a = s.split("");
    var f = a.shift();
    var r =
      f +
      a
        .map(function (char) {
          switch (char) {
            case "B":
            case "F":
            case "P":
            case "V":
              return "1";
            case "C":
            case "G":
            case "J":
            case "K":
            case "Q":
            case "S":
            case "X":
            case "Z":
              return "2";
            case "D":
            case "T":
              return "3";
            case "L":
              return "4";
            case "M":
            case "N":
              return "5";
            case "R":
              return "6";
            default:
              return "";
          }
        })
        .join("");
    r = r.replace(/(\d)\1+/g, "$1");
    return (r + "000").substring(0, 4);
  },

  // ── Statistics ────────────────────────────────────────────────────────────

  // Returns Promise<object>
  getStatistics: function () {
    return this.getAllPersons().then(function (persons) {
      var stats = {
        totalPersons: persons.length,
        totalAttestations: 0,
        totalRelationships: 0,
        personsWithBirth: 0,
        personsWithDeath: 0,
        uniqueNationalities: 0,
        uniqueReligions: 0,
        maleCount: 0,
        femaleCount: 0,
        unknownGenderCount: 0,
      };

      var nationalitiesSet = new Set();
      var religionsSet = new Set();

      persons.forEach(function (person) {
        if (person.attestations) stats.totalAttestations += person.attestations.length;
        if (person.relationships) stats.totalRelationships += person.relationships.length;
        if (person.lifeEvents && person.lifeEvents.birth) stats.personsWithBirth++;
        if (person.lifeEvents && person.lifeEvents.death) stats.personsWithDeath++;
        if (person.nationality) nationalitiesSet.add(person.nationality);
        if (person.religion) religionsSet.add(person.religion);

        if (person.gender === "male") stats.maleCount++;
        else if (person.gender === "female") stats.femaleCount++;
        else stats.unknownGenderCount++;
      });

      stats.uniqueNationalities = nationalitiesSet.size;
      stats.uniqueReligions = religionsSet.size;
      return stats;
    });
  },

  // ── Export / Import (local JSON) ─────────────────────────────────────────

  // Returns Promise<string>  (pretty-printed JSON)
  exportJSON: function () {
    return this.getAllPersons().then(function (persons) {
      var db = {
        persons: persons,
        exportedAt: new Date().toISOString(),
        version: "2.0",
      };
      return JSON.stringify(db, null, 2);
    });
  },

  // Returns Promise<boolean>
  importJSON: function (jsonString) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var data;
      try {
        data = JSON.parse(jsonString);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return resolve(false);
      }

      if (!data.persons || !Array.isArray(data.persons)) {
        console.error("Invalid database format");
        return resolve(false);
      }

      // Upsert every record (respects modifiedAt ordering)
      var promises = data.persons.map(function (person) {
        return self.upsertPerson(person);
      });

      Promise.all(promises)
        .then(function () {
          resolve(true);
        })
        .catch(function (e) {
          console.error("Error importing records:", e);
          resolve(false);
        });
    });
  },
};

// Open the database eagerly so the first user interaction feels instant
Database.open().catch(function (e) {
  console.error("Failed to open IndexedDB:", e);
});

console.log("Database module loaded (IndexedDB)");

```


## Assistant

Now rewrite `github-sync.js` to work per-record:

**Tool Call: scripts/github-sync.js**
Status: Completed

Diff: scripts/github-sync.js
```
// GitHub Sync Module - Per-record sync with GitHub repository
// Each person record is stored as records/<uuid>.json
// modifiedAt is compared to avoid unnecessary writes/overwrites

var GitHubSync = {
  config: {
    token: "",
    owner: "lvansnippenburg",
    repo: "JsonDataStorage",
    folder: "prosopography-records",
    branch: "main",
  },

  // ── Initialisation ─────────────────────────────────────────────────────────

  init: function () {
    this.loadSettings();
    this.updateStatus();
    this.bindEvents();
  },

  // ── Settings ───────────────────────────────────────────────────────────────

  loadSettings: function () {
    var token = localStorage.getItem("github_token");
    var folder = localStorage.getItem("github_folder");
    var branch = localStorage.getItem("github_branch");

    if (token) this.config.token = token;
    if (folder) this.config.folder = folder;
    if (branch) this.config.branch = branch;

    if (document.getElementById("github-token"))
      document.getElementById("github-token").value = token || "";
    if (document.getElementById("github-folder"))
      document.getElementById("github-folder").value = folder || this.config.folder;
    if (document.getElementById("github-branch"))
      document.getElementById("github-branch").value = branch || "main";
  },

  saveSettings: function () {
    var token = document.getElementById("github-token").value.trim();
    var folder = document.getElementById("github-folder").value.trim();
    var branch = document.getElementById("github-branch").value.trim();

    if (token) {
      localStorage.setItem("github_token", token);
      this.config.token = token;
    }
    if (folder) {
      localStorage.setItem("github_folder", folder);
      this.config.folder = folder;
    }
    if (branch) {
      localStorage.setItem("github_branch", branch);
      this.config.branch = branch;
    }

    this.updateStatus();
    alert("GitHub settings saved successfully");
  },

  clearSettings: function () {
    if (!confirm("Are you sure you want to clear GitHub settings?")) return;

    ["github_token", "github_folder", "github_branch"].forEach(function (k) {
      localStorage.removeItem(k);
    });

    this.config.token = "";
    this.config.folder = "prosopography-records";
    this.config.branch = "main";

    if (document.getElementById("github-token")) document.getElementById("github-token").value = "";
    if (document.getElementById("github-folder"))
      document.getElementById("github-folder").value = this.config.folder;
    if (document.getElementById("github-branch"))
      document.getElementById("github-branch").value = "main";

    this.updateStatus();
    alert("GitHub settings cleared");
  },

  // ── Status display ─────────────────────────────────────────────────────────

  updateStatus: function () {
    var statusEl = document.getElementById("github-status");
    var pushBtn = document.getElementById("btn-push-github");
    var pullBtn = document.getElementById("btn-pull-github");

    if (!statusEl) return;

    if (this.config.token) {
      statusEl.innerHTML =
        "&#10003; Connected to GitHub repository: <strong>" +
        this.config.owner +
        "/" +
        this.config.repo +
        "</strong><br>" +
        "Folder: <code>" +
        this.config.folder +
        "/</code> &nbsp;(branch: " +
        this.config.branch +
        ")";
      statusEl.className = "github-status connected";
      if (pushBtn) pushBtn.disabled = false;
      if (pullBtn) pullBtn.disabled = false;
    } else {
      statusEl.innerHTML = "&#10007; Not connected to GitHub. Please configure settings below.";
      statusEl.className = "github-status disconnected";
      if (pushBtn) pushBtn.disabled = true;
      if (pullBtn) pullBtn.disabled = true;
    }
  },

  // ── Event binding ──────────────────────────────────────────────────────────

  bindEvents: function () {
    var self = this;

    var bind = function (id, fn) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", fn.bind(self));
    };

    bind("btn-save-settings", self.saveSettings);
    bind("btn-clear-settings", self.clearSettings);
    bind("btn-test-connection", self.testConnection);
    bind("btn-push-github", self.pushToGitHub);
    bind("btn-pull-github", self.pullFromGitHub);
    bind("btn-view-history", self.viewHistory);
  },

  // ── GitHub API helpers ─────────────────────────────────────────────────────

  // Returns the base URL for the contents API for a given path inside the repo
  _contentsUrl: function (path) {
    return (
      "https://api.github.com/repos/" +
      this.config.owner +
      "/" +
      this.config.repo +
      "/contents/" +
      path
    );
  },

  _authHeaders: function () {
    return {
      Authorization: "token " + this.config.token,
      Accept: "application/vnd.github.v3+json",
    };
  },

  // Fetch a single file's metadata (sha + content).
  // Resolves with { sha, content } or null when the file does not exist.
  _getRemoteFile: function (filePath) {
    var url = this._contentsUrl(filePath) + "?ref=" + this.config.branch;
    return fetch(url, { headers: this._authHeaders() }).then(function (res) {
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("GET " + filePath + " failed: " + res.statusText);
      return res.json();
    });
  },

  // Decode a GitHub contents API response body to a string.
  _decode: function (data) {
    return decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
  },

  // Encode a string for the GitHub contents API.
  _encode: function (str) {
    return btoa(unescape(encodeURIComponent(str)));
  },

  // PUT (create or update) a single file.  sha is required for updates,
  // omitted (undefined/null) for new files.
  _putFile: function (filePath, content, message, sha) {
    var body = {
      message: message,
      content: this._encode(content),
      branch: this.config.branch,
    };
    if (sha) body.sha = sha;

    return fetch(this._contentsUrl(filePath), {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, this._authHeaders()),
      body: JSON.stringify(body),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (d) {
          throw new Error(d.message || "PUT failed for " + filePath);
        });
      }
      return res.json();
    });
  },

  // DELETE a single file.
  _deleteFile: function (filePath, sha, message) {
    var body = {
      message: message,
      sha: sha,
      branch: this.config.branch,
    };
    return fetch(this._contentsUrl(filePath), {
      method: "DELETE",
      headers: Object.assign({ "Content-Type": "application/json" }, this._authHeaders()),
      body: JSON.stringify(body),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (d) {
          throw new Error(d.message || "DELETE failed for " + filePath);
        });
      }
    });
  },

  // List all files inside the records folder.
  // Resolves with an array of { name, path, sha, download_url } objects,
  // or [] when the folder doesn't exist yet.
  _listRemoteRecords: function () {
    var url = this._contentsUrl(this.config.folder) + "?ref=" + this.config.branch;
    return fetch(url, { headers: this._authHeaders() })
      .then(function (res) {
        if (res.status === 404) return [];
        if (!res.ok) throw new Error("Could not list remote folder: " + res.statusText);
        return res.json();
      })
      .then(function (items) {
        // filter to .json files only
        return Array.isArray(items)
          ? items.filter(function (f) {
              return f.type === "file" && f.name.endsWith(".json");
            })
          : [];
      });
  },

  // ── Test connection ────────────────────────────────────────────────────────

  testConnection: function () {
    if (!this.config.token) {
      alert("Please enter a GitHub token first");
      return;
    }

    var statusEl = document.getElementById("connection-status");
    statusEl.innerHTML = '<div class="status-progress">Testing connection...</div>';
    statusEl.style.display = "block";

    fetch("https://api.github.com/repos/" + this.config.owner + "/" + this.config.repo, {
      headers: this._authHeaders(),
    })
      .then(function (res) {
        if (res.ok) {
          statusEl.innerHTML =
            '<div class="status-success">&#10003; Connection successful! Repository found.</div>';
        } else {
          statusEl.innerHTML =
            '<div class="status-error">&#10007; Connection failed: ' +
            res.status +
            " " +
            res.statusText +
            "</div>";
        }
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="status-error">&#10007; Connection error: ' + err.message + "</div>";
      });
  },

  // ── Push to GitHub ─────────────────────────────────────────────────────────

  pushToGitHub: function () {
    if (!this.config.token) {
      alert("Please configure GitHub settings first");
      return;
    }
    if (
      !confirm(
        "Push local database to GitHub?\nOnly records newer than the remote copy will be uploaded.",
      )
    )
      return;

    var self = this;
    var statusEl = document.getElementById("sync-status");
    statusEl.innerHTML = '<div class="sync-progress">Preparing push...</div>';
    statusEl.style.display = "block";

    // 1. Load all local records
    Database.getAllPersons()
      .then(function (localPersons) {
        if (localPersons.length === 0) {
          statusEl.innerHTML =
            '<div class="sync-success">Nothing to push (database is empty).</div>';
          return;
        }

        // 2. List remote files so we can get their SHAs
        return self._listRemoteRecords().then(function (remoteFiles) {
          // Build a map of uuid -> { sha, remoteModifiedAt }
          var remoteMap = {};
          remoteFiles.forEach(function (f) {
            var uuid = f.name.replace(/\.json$/, "");
            remoteMap[uuid] = { sha: f.sha, remoteFile: f };
          });

          // 3. For each local record, decide whether to upload
          var uploadCount = 0;
          var skipCount = 0;
          var total = localPersons.length;
          var done = 0;

          var updateProgress = function () {
            statusEl.innerHTML =
              '<div class="sync-progress">Pushing... ' +
              done +
              " / " +
              total +
              " &nbsp;(uploaded: " +
              uploadCount +
              ", skipped: " +
              skipCount +
              ")</div>";
          };
          updateProgress();

          // Process records sequentially to avoid rate-limit bursts
          var sequence = localPersons.reduce(function (chain, person) {
            return chain.then(function () {
              var uuid = person.uuid;
              if (!uuid) {
                // Skip legacy records without uuid (shouldn't happen after migration)
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              var filePath = self.config.folder + "/" + uuid + ".json";
              var localModified = person.modifiedAt ? new Date(person.modifiedAt) : new Date(0);
              var remote = remoteMap[uuid];

              // If no remote copy exists, upload unconditionally
              if (!remote) {
                var content = JSON.stringify(person, null, 2);
                var msg =
                  "Add record " + uuid + " (" + (person.standardizedName || "unknown") + ")";
                return self._putFile(filePath, content, msg, null).then(function () {
                  uploadCount++;
                  done++;
                  updateProgress();
                });
              }

              // Remote exists — fetch its modifiedAt before deciding
              return self._getRemoteFile(filePath).then(function (remoteData) {
                var remoteModified = new Date(0);
                if (remoteData) {
                  try {
                    var remoteJson = JSON.parse(self._decode(remoteData));
                    if (remoteJson.modifiedAt) remoteModified = new Date(remoteJson.modifiedAt);
                  } catch (e) {
                    /* ignore parse errors */
                  }
                }

                if (localModified <= remoteModified) {
                  // Remote is same age or newer — skip
                  skipCount++;
                  done++;
                  updateProgress();
                  return;
                }

                var content = JSON.stringify(person, null, 2);
                var msg =
                  "Update record " + uuid + " (" + (person.standardizedName || "unknown") + ")";
                return self._putFile(filePath, content, msg, remote.sha).then(function () {
                  uploadCount++;
                  done++;
                  updateProgress();
                });
              });
            });
          }, Promise.resolve());

          return sequence.then(function () {
            statusEl.innerHTML =
              '<div class="sync-success">&#10003; Push complete &mdash; ' +
              uploadCount +
              " record(s) uploaded, " +
              skipCount +
              " skipped.</div>";
          });
        });
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="sync-error">&#10007; Push failed: ' + err.message + "</div>";
        console.error("pushToGitHub error:", err);
      });
  },

  // ── Pull from GitHub ───────────────────────────────────────────────────────

  pullFromGitHub: function () {
    if (!this.config.token) {
      alert("Please configure GitHub settings first");
      return;
    }
    if (
      !confirm(
        "Pull records from GitHub?\nOnly records newer than your local copy will be imported.",
      )
    )
      return;

    var self = this;
    var statusEl = document.getElementById("sync-status");
    statusEl.innerHTML = '<div class="sync-progress">Listing remote records...</div>';
    statusEl.style.display = "block";

    self
      ._listRemoteRecords()
      .then(function (remoteFiles) {
        if (remoteFiles.length === 0) {
          statusEl.innerHTML =
            '<div class="sync-success">No remote records found in folder <code>' +
            self.config.folder +
            "/</code>.</div>";
          return;
        }

        var total = remoteFiles.length;
        var done = 0;
        var insertCount = 0;
        var updateCount = 0;
        var skipCount = 0;

        var updateProgress = function () {
          statusEl.innerHTML =
            '<div class="sync-progress">Pulling... ' +
            done +
            " / " +
            total +
            " &nbsp;(new: " +
            insertCount +
            ", updated: " +
            updateCount +
            ", skipped: " +
            skipCount +
            ")</div>";
        };
        updateProgress();

        var sequence = remoteFiles.reduce(function (chain, remoteFile) {
          return chain.then(function () {
            return self._getRemoteFile(remoteFile.path).then(function (data) {
              if (!data) {
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              var person;
              try {
                person = JSON.parse(self._decode(data));
              } catch (e) {
                console.warn("Could not parse remote file:", remoteFile.path, e);
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              if (!person.uuid) {
                person.uuid = remoteFile.name.replace(/\.json$/, "");
                person.id = person.uuid;
              }

              return Database.upsertPerson(person).then(function (result) {
                if (result === "inserted") insertCount++;
                else if (result === "updated") updateCount++;
                else skipCount++;
                done++;
                updateProgress();
              });
            });
          });
        }, Promise.resolve());

        return sequence.then(function () {
          statusEl.innerHTML =
            '<div class="sync-success">&#10003; Pull complete &mdash; ' +
            insertCount +
            " new, " +
            updateCount +
            " updated, " +
            skipCount +
            " skipped.</div>";

          // Refresh UI
          UI.displayStatistics();
          UI.displayBrowseResults();
        });
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="sync-error">&#10007; Pull failed: ' + err.message + "</div>";
        console.error("pullFromGitHub error:", err);
      });
  },

  // ── History ────────────────────────────────────────────────────────────────

  viewHistory: function () {
    var url =
      "https://github.com/" +
      this.config.owner +
      "/" +
      this.config.repo +
      "/commits/" +
      this.config.branch +
      "/" +
      this.config.folder;
    alert("Commit history viewer\n\nVisit the folder on GitHub:\n" + url);
  },
};

// Initialise when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  GitHubSync.init();
});

console.log("GitHub Sync module loaded (per-record IndexedDB edition)");

```


## Assistant

Now rewrite `app.js` to handle async Database calls:

**Tool Call: scripts/app.js**
Status: Completed

Diff: scripts/app.js
```
// App Module - Main application logic and form handling
var App = {
  init: function () {
    this.bindEvents();
    UI.init();
    console.log("App initialized");
  },

  bindEvents: function () {
    // Search form
    document.getElementById("btn-search").addEventListener("click", function () {
      App.handleSearch();
    });

    document.getElementById("btn-clear").addEventListener("click", function () {
      document.getElementById("search-name").value = "";
      document.getElementById("search-place").value = "";
      document.getElementById("search-year").value = "";
      document.getElementById("phonetic-search").checked = false;
      document.getElementById("search-info").style.display = "none";
      document.getElementById("search-results").innerHTML = "";
    });

    // Person form submission
    document.getElementById("person-form").addEventListener("submit", function (e) {
      e.preventDefault();
      App.handleSavePerson();
    });

    // Sort change in browse view
    document.getElementById("sort-by").addEventListener("change", function () {
      UI.displayBrowseResults();
    });

    // Export/Import buttons
    document.getElementById("btn-export-json").addEventListener("click", function () {
      App.exportJSON();
    });

    document.getElementById("btn-import-json").addEventListener("click", function () {
      App.importJSON();
    });

    // Standardized name input - check for similar names
    var nameInput = document.getElementById("standardized-name");
    var suggestionsPanel = document.getElementById("name-suggestions");

    nameInput.addEventListener("input", function () {
      var value = nameInput.value.trim();

      if (value.length < 3) {
        suggestionsPanel.style.display = "none";
        return;
      }

      Database.getAllPersons().then(function (persons) {
        var currentEditId = UI.currentEditId;

        // Find similar names
        var similar = persons.filter(function (p) {
          if (p.id === currentEditId) return false;

          // Check standardized name
          if (p.standardizedName.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
            return true;
          }

          // Check phonetic match
          if (Database.soundex(p.standardizedName) === Database.soundex(value)) {
            return true;
          }

          return false;
        });

        if (similar.length === 0) {
          suggestionsPanel.style.display = "none";
          return;
        }

        // Display suggestions
        var html =
          '<div class="suggestions-header">&#9888; Similar names found - possible duplicates:</div>';
        html += '<div class="suggestions-list">';

        similar.forEach(function (person) {
          html += '<div class="suggestion-item">';
          html += '<div class="suggestion-main">';
          html += "<strong>" + person.standardizedName + "</strong>";
          var genderIcon =
            person.gender === "male"
              ? "&#9794;"
              : person.gender === "female"
                ? "&#9792;"
                : "&#9711;";
          html += '<span class="gender-indicator">' + genderIcon + "</span>";

          if (Database.soundex(person.standardizedName) === Database.soundex(value)) {
            html += '<span class="phonetic-badge">Phonetic Match</span>';
          }
          html += "</div>";

          if (person.lifeEvents && (person.lifeEvents.birth || person.lifeEvents.death)) {
            var birthYear =
              person.lifeEvents.birth && person.lifeEvents.birth.date
                ? person.lifeEvents.birth.date.year || "?"
                : "?";
            var deathYear =
              person.lifeEvents.death && person.lifeEvents.death.date
                ? person.lifeEvents.death.date.year || "?"
                : "?";
            html += '<div class="suggestion-details">(' + birthYear + " - " + deathYear + ")";
            if (person.nationality) html += " &bull; " + person.nationality;
            html += "</div>";
          }

          if (person.nameVariants && person.nameVariants.length > 0) {
            var variants = person.nameVariants
              .slice(0, 3)
              .map(function (v) {
                return v.fullName || v.firstName + " " + v.lastName;
              })
              .join(", ");
            html += '<div class="suggestion-variants">Variants: ' + variants + "</div>";
          }

          html += '<div class="suggestion-actions">';
          html +=
            '<button type="button" class="btn-view-suggestion" data-id="' +
            person.id +
            '">View</button>';
          html +=
            '<button type="button" class="btn-load-suggestion" data-id="' +
            person.id +
            '">Load for Editing</button>';
          html += "</div>";
          html += "</div>";
        });

        html += "</div>";
        suggestionsPanel.innerHTML = html;
        suggestionsPanel.style.display = "block";

        // Bind suggestion buttons
        suggestionsPanel.querySelectorAll(".btn-view-suggestion").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var id = btn.dataset.id;
            suggestionsPanel.style.display = "none";
            UI.showPersonDetail(id);
          });
        });

        suggestionsPanel.querySelectorAll(".btn-load-suggestion").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var id = btn.dataset.id;
            suggestionsPanel.style.display = "none";
            Database.getPersonById(id).then(function (person) {
              if (person) UI.loadPersonIntoForm(person);
            });
          });
        });
      });
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", function (e) {
      if (e.target !== nameInput && !suggestionsPanel.contains(e.target)) {
        suggestionsPanel.style.display = "none";
      }
    });
  },

  handleSearch: function () {
    var name = document.getElementById("search-name").value.trim();
    var place = document.getElementById("search-place").value.trim();
    var year = document.getElementById("search-year").value.trim();
    var usePhonetic = document.getElementById("phonetic-search").checked;

    if (!name && !place && !year) {
      alert("Please enter at least one search criterion");
      return;
    }

    var criteria = {
      name: name,
      place: place,
      year: year ? parseInt(year) : null,
      usePhonetic: usePhonetic,
    };

    Database.searchPersons(criteria).then(function (results) {
      // Display search info
      var searchInfo = document.getElementById("search-info");
      var infoText = "Found " + results.length + " person(s)";
      if (name) infoText += ' matching name "' + name + '"';
      if (place) infoText += ' in place "' + place + '"';
      if (year) infoText += " in year " + year;
      if (usePhonetic) infoText += " (phonetic matching enabled)";

      searchInfo.innerHTML = "<p>" + infoText + "</p>";
      searchInfo.style.display = "block";

      UI.displaySearchResults(results);
    });
  },

  handleSavePerson: function () {
    var personData = this.collectFormData();

    if (!personData.standardizedName) {
      alert("Standardized name is required");
      return;
    }

    var editId = document.getElementById("person-id").value;

    var done = function () {
      UI.clearForm();
      UI.switchView("search-view");
      UI.displayStatistics();
    };

    if (editId) {
      Database.updatePerson(editId, personData)
        .then(function (success) {
          if (success) {
            alert("Person updated successfully");
          } else {
            alert("Update failed: person not found");
          }
          done();
        })
        .catch(function (err) {
          alert("Error saving person: " + err.message);
        });
    } else {
      Database.addPerson(personData)
        .then(function () {
          alert("Person added successfully");
          done();
        })
        .catch(function (err) {
          alert("Error saving person: " + err.message);
        });
    }
  },

  collectFormData: function () {
    var person = {
      standardizedName: document.getElementById("standardized-name").value.trim(),
      nationality: document.getElementById("nationality").value.trim(),
      gender: document.getElementById("gender").value,
      religion: document.getElementById("religion").value.trim(),
      religionCertainty: document.getElementById("religion-certainty").value,
      nameVariants: this.collectNameVariants(),
      lifeEvents: this.collectLifeEvents(),
      attestations: this.collectAttestations(),
      relationships: this.collectRelationships(),
      occupations: this.collectOccupations(),
      biography: document.getElementById("biography").value.trim(),
    };

    return person;
  },

  collectNameVariants: function () {
    var variants = [];
    var container = document.getElementById("name-variants-container");
    var items = container.querySelectorAll(".variant-item");

    items.forEach(function (item) {
      var index = item.dataset.index;

      var fullName = item.querySelector('[name="variant-fullname-' + index + '"]')
        ? item.querySelector('[name="variant-fullname-' + index + '"]').value.trim()
        : "";
      var firstName = item.querySelector('[name="variant-firstname-' + index + '"]')
        ? item.querySelector('[name="variant-firstname-' + index + '"]').value.trim()
        : "";
      var lastName = item.querySelector('[name="variant-lastname-' + index + '"]')
        ? item.querySelector('[name="variant-lastname-' + index + '"]').value.trim()
        : "";
      var notes = item.querySelector('[name="variant-notes-' + index + '"]')
        ? item.querySelector('[name="variant-notes-' + index + '"]').value.trim()
        : "";

      if (fullName || firstName || lastName) {
        var variant = {
          fullName: fullName,
          firstName: firstName,
          lastName: lastName,
          notes: notes,
          sources: [],
        };

        var sourceDoc = item.querySelector('[name="variant-source-doc-' + index + '"]')
          ? item.querySelector('[name="variant-source-doc-' + index + '"]').value.trim()
          : "";
        var sourceLoc = item.querySelector('[name="variant-source-loc-' + index + '"]')
          ? item.querySelector('[name="variant-source-loc-' + index + '"]').value.trim()
          : "";

        if (sourceDoc || sourceLoc) {
          variant.sources.push({
            documentName: sourceDoc || "",
            location: sourceLoc || "",
            citation: sourceDoc + (sourceLoc ? ", " + sourceLoc : ""),
          });
        }

        variants.push(variant);
      }
    });

    return variants;
  },

  collectLifeEvents: function () {
    var lifeEvents = {};

    // Birth
    var birthYear = document.getElementById("birth-year").value;
    var birthMonth = document.getElementById("birth-month").value;
    var birthDay = document.getElementById("birth-day").value;
    var birthCirca = document.getElementById("birth-circa").checked;
    var birthPlace = document.getElementById("birth-place").value.trim();
    var birthCertainty = document.getElementById("birth-certainty").value;

    if (birthYear || birthPlace) {
      lifeEvents.birth = {
        date: {
          year: birthYear ? parseInt(birthYear) : null,
          month: birthMonth ? parseInt(birthMonth) : null,
          day: birthDay ? parseInt(birthDay) : null,
          circa: birthCirca,
        },
        place: birthPlace,
        certainty: birthCertainty,
      };
    }

    // Death
    var deathYear = document.getElementById("death-year").value;
    var deathMonth = document.getElementById("death-month").value;
    var deathDay = document.getElementById("death-day").value;
    var deathCirca = document.getElementById("death-circa").checked;
    var deathPlace = document.getElementById("death-place").value.trim();
    var deathCertainty = document.getElementById("death-certainty").value;

    if (deathYear || deathPlace) {
      lifeEvents.death = {
        date: {
          year: deathYear ? parseInt(deathYear) : null,
          month: deathMonth ? parseInt(deathMonth) : null,
          day: deathDay ? parseInt(deathDay) : null,
          circa: deathCirca,
        },
        place: deathPlace,
        certainty: deathCertainty,
      };
    }

    return lifeEvents;
  },

  collectAttestations: function () {
    var attestations = [];
    var container = document.getElementById("attestations-container");
    var items = container.querySelectorAll(".attestation-item");

    items.forEach(function (item) {
      var index = item.dataset.index;

      var place = item.querySelector('[name="att-place-' + index + '"]')
        ? item.querySelector('[name="att-place-' + index + '"]').value.trim()
        : "";
      var year = item.querySelector('[name="att-year-' + index + '"]')
        ? item.querySelector('[name="att-year-' + index + '"]').value
        : "";
      var month = item.querySelector('[name="att-month-' + index + '"]')
        ? item.querySelector('[name="att-month-' + index + '"]').value
        : "";
      var day = item.querySelector('[name="att-day-' + index + '"]')
        ? item.querySelector('[name="att-day-' + index + '"]').value
        : "";
      var event = item.querySelector('[name="att-event-' + index + '"]')
        ? item.querySelector('[name="att-event-' + index + '"]').value.trim()
        : "";
      var notes = item.querySelector('[name="att-notes-' + index + '"]')
        ? item.querySelector('[name="att-notes-' + index + '"]').value.trim()
        : "";

      if (place || year || event) {
        var attestation = {
          place: place,
          date: {
            year: year ? parseInt(year) : null,
            month: month ? parseInt(month) : null,
            day: day ? parseInt(day) : null,
          },
          event: event,
          notes: notes,
          sources: [],
        };

        var sourceDoc = item.querySelector('[name="att-source-doc-' + index + '"]')
          ? item.querySelector('[name="att-source-doc-' + index + '"]').value.trim()
          : "";
        var sourceLoc = item.querySelector('[name="att-source-loc-' + index + '"]')
          ? item.querySelector('[name="att-source-loc-' + index + '"]').value.trim()
          : "";

        if (sourceDoc || sourceLoc) {
          attestation.sources.push({
            documentName: sourceDoc || "",
            location: sourceLoc || "",
            citation: sourceDoc + (sourceLoc ? ", " + sourceLoc : ""),
          });
        }

        attestations.push(attestation);
      }
    });

    return attestations;
  },

  collectRelationships: function () {
    var relationships = [];
    var container = document.getElementById("relationships-container");
    var items = container.querySelectorAll(".relationship-item");

    items.forEach(function (item) {
      var index = item.dataset.index;

      var relatedPerson = item.querySelector('[name="rel-person-' + index + '"]')
        ? item.querySelector('[name="rel-person-' + index + '"]').value.trim()
        : "";
      var type = item.querySelector('[name="rel-type-' + index + '"]')
        ? item.querySelector('[name="rel-type-' + index + '"]').value.trim()
        : "";
      var notes = item.querySelector('[name="rel-notes-' + index + '"]')
        ? item.querySelector('[name="rel-notes-' + index + '"]').value.trim()
        : "";

      if (relatedPerson || type) {
        var relationship = {
          relatedPerson: relatedPerson,
          type: type,
          notes: notes,
          sources: [],
        };

        var sourceDoc = item.querySelector('[name="rel-source-doc-' + index + '"]')
          ? item.querySelector('[name="rel-source-doc-' + index + '"]').value.trim()
          : "";
        var sourceLoc = item.querySelector('[name="rel-source-loc-' + index + '"]')
          ? item.querySelector('[name="rel-source-loc-' + index + '"]').value.trim()
          : "";

        if (sourceDoc || sourceLoc) {
          relationship.sources.push({
            documentName: sourceDoc || "",
            location: sourceLoc || "",
            citation: sourceDoc + (sourceLoc ? ", " + sourceLoc : ""),
          });
        }

        relationships.push(relationship);
      }
    });

    return relationships;
  },

  collectOccupations: function () {
    var occupationsStr = document.getElementById("occupations").value.trim();
    if (!occupationsStr) return [];

    return occupationsStr
      .split(",")
      .map(function (occ) {
        return occ.trim();
      })
      .filter(function (occ) {
        return occ.length > 0;
      });
  },

  exportJSON: function () {
    Database.exportJSON()
      .then(function (json) {
        var blob = new Blob([json], { type: "application/json" });
        var url = URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = url;
        a.download = "prosopography-database-" + new Date().toISOString().split("T")[0] + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert("Database exported successfully");
      })
      .catch(function (err) {
        alert("Export failed: " + err.message);
      });
  },

  importJSON: function () {
    var fileInput = document.getElementById("import-file");
    var file = fileInput.files[0];

    if (!file) {
      alert("Please select a file to import");
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      Database.importJSON(e.target.result)
        .then(function (success) {
          if (success) {
            alert("Database imported successfully");
            UI.displayStatistics();
            UI.displayBrowseResults();
          } else {
            alert("Import failed: Invalid file format");
          }
        })
        .catch(function (err) {
          alert("Import failed: " + err.message);
        });
    };

    reader.readAsText(file);
  },
};

document.addEventListener("DOMContentLoaded", function () {
  App.init();
});

```


## Assistant

Now update `ui.js` — the key async changes are in `displayBrowseResults`, `displayStatistics`, and `showPersonDetail`:

**Tool Call: Read file `scripts/ui.js` (lines 43-100)**
Status: Completed

```webapp-prosopography/scripts/ui.js
    switchView: function(viewName) {
        console.log('Switching to view:', viewName);

        document.querySelectorAll('.view').forEach(function(view) {
            view.classList.remove('active');
        });

        var targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.add('active');

            if (viewName === 'browse-view') {
                this.displayBrowseResults();
            } else if (viewName === 'add-view') {
                // Don't clear form if we're editing
                if (!this.currentEditId) {
                    this.clearForm();
                }
            } else if (viewName === 'search-view') {
                this.displayStatistics();
            }
        } else {
            console.error('View not found:', viewName);
        }
    },

    // Initialize forms
    initForms: function() {
        var form = document.getElementById('person-form');
        var btnCancel = document.getElementById('btn-cancel');

        btnCancel.addEventListener('click', function() {
            UI.switchView('search-view');
            UI.clearForm();
        });

        // Dynamic field buttons
        document.getElementById('btn-add-variant').addEventListener('click', function() {
            UI.addNameVariantField();
        });

        document.getElementById('btn-add-attestation').addEventListener('click', function() {
            UI.addAttestationField();
        });

        document.getElementById('btn-add-relationship').addEventListener('click', function() {
            UI.addRelationshipField();
        });
    },

    // Initialize autocomplete for nationality, religion, and source documents
    initAutocomplete: function() {
        this.initNationalityAutocomplete();
        this.initReligionAutocomplete();
    },

    // Nationality autocomplete
    initNationalityAutocomplete: function() {

```


**Tool Call: Read file `scripts/ui.js` (lines 100-370)**
Status: Completed

```webapp-prosopography/scripts/ui.js
    initNationalityAutocomplete: function() {
        var input = document.getElementById('nationality');
        var dropdown = document.getElementById('nationality-suggestions');

        if (!input || !dropdown) return;

        input.addEventListener('input', function() {
            var value = input.value.trim();

            if (value.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            var persons = Database.getAllPersons();
            var nationalitiesSet = new Set();

            persons.forEach(function(person) {
                if (person.nationality) {
                    nationalitiesSet.add(person.nationality);
                }
            });

            var nationalities = Array.from(nationalitiesSet).sort();
            var filtered = nationalities.filter(function(nat) {
                return nat.toLowerCase().indexOf(value.toLowerCase()) !== -1;
            });

            if (filtered.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            dropdown.innerHTML = '';
            filtered.forEach(function(nat) {
                var item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.textContent = nat;
                item.addEventListener('click', function() {
                    input.value = nat;
                    dropdown.style.display = 'none';
                });
                dropdown.appendChild(item);
            });

            dropdown.style.display = 'block';
        });

        document.addEventListener('click', function(e) {
            if (e.target !== input) {
                dropdown.style.display = 'none';
            }
        });
    },

    // Religion autocomplete
    initReligionAutocomplete: function() {
        var input = document.getElementById('religion');
        var dropdown = document.getElementById('religion-suggestions');

        if (!input || !dropdown) return;

        input.addEventListener('input', function() {
            var value = input.value.trim();

            if (value.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            var persons = Database.getAllPersons();
            var religionsSet = new Set();

            persons.forEach(function(person) {
                if (person.religion) {
                    religionsSet.add(person.religion);
                }
            });

            var religions = Array.from(religionsSet).sort();
            var filtered = religions.filter(function(rel) {
                return rel.toLowerCase().indexOf(value.toLowerCase()) !== -1;
            });

            if (filtered.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            dropdown.innerHTML = '';
            filtered.forEach(function(rel) {
                var item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.textContent = rel;
                item.addEventListener('click', function() {
                    input.value = rel;
                    dropdown.style.display = 'none';
                });
                dropdown.appendChild(item);
            });

            dropdown.style.display = 'block';
        });

        document.addEventListener('click', function(e) {
            if (e.target !== input) {
                dropdown.style.display = 'none';
            }
        });
    },

    // Source document autocomplete
    initSourceAutocomplete: function(inputElement, dropdownElement) {
        if (!inputElement || !dropdownElement) return;

        inputElement.addEventListener('input', function() {
            var value = inputElement.value.trim();

            if (value.length === 0) {
                dropdownElement.style.display = 'none';
                return;
            }

            var persons = Database.getAllPersons();
            var sourcesSet = new Set();

            persons.forEach(function(person) {
                if (person.nameVariants) {
                    person.nameVariants.forEach(function(variant) {
                        if (variant.sources) {
                            variant.sources.forEach(function(source) {
                                if (source.documentName) {
                                    sourcesSet.add(source.documentName);
                                }
                            });
                        }
                    });
                }

                if (person.attestations) {
                    person.attestations.forEach(function(att) {
                        if (att.sources) {
                            att.sources.forEach(function(source) {
                                if (source.documentName) {
                                    sourcesSet.add(source.documentName);
                                }
                            });
                        }
                    });
                }

                if (person.relationships) {
                    person.relationships.forEach(function(rel) {
                        if (rel.sources) {
                            rel.sources.forEach(function(source) {
                                if (source.documentName) {
                                    sourcesSet.add(source.documentName);
                                }
                            });
                        }
                    });
                }
            });

            var sources = Array.from(sourcesSet).sort();
            var filtered = sources.filter(function(src) {
                return src.toLowerCase().indexOf(value.toLowerCase()) !== -1;
            });

            if (filtered.length === 0) {
                dropdownElement.style.display = 'none';
                return;
            }

            dropdownElement.innerHTML = '';
            filtered.forEach(function(src) {
                var item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.textContent = src;
                item.addEventListener('click', function() {
                    inputElement.value = src;
                    dropdownElement.style.display = 'none';
                });
                dropdownElement.appendChild(item);
            });

            dropdownElement.style.display = 'block';
        });

        document.addEventListener('click', function(e) {
            if (e.target !== inputElement && !dropdownElement.contains(e.target)) {
                dropdownElement.style.display = 'none';
            }
        });
    },

    // Helper function to safely get source data (backward compatible)
    getSourceData: function(sources, index) {
        if (!sources || !sources[index]) {
            return { documentName: '', location: '' };
        }

        var source = sources[index];

        // New format
        if (source.documentName !== undefined) {
            return {
                documentName: source.documentName || '',
                location: source.location || ''
            };
        }

        // Old format (citation only)
        if (source.citation) {
            return {
                documentName: source.citation,
                location: ''
            };
        }

        return { documentName: '', location: '' };
    },

    // Add name variant field with source autocomplete
    addNameVariantField: function(variant) {
        var container = document.getElementById('name-variants-container');
        var index = this.variantCounter++;

        var item = document.createElement('div');
        item.className = 'variant-item';
        item.dataset.index = index;

        var sourceData = this.getSourceData(variant ? variant.sources : null, 0);

        var html = '';
        html += '<button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>';
        html += '<label>Full Name: <input type="text" name="variant-fullname-' + index + '" value="' + (variant && variant.fullName ? variant.fullName : '') + '"></label>';
        html += '<div class="form-row">';
        html += '<label>First Name: <input type="text" name="variant-firstname-' + index + '" value="' + (variant && variant.firstName ? variant.firstName : '') + '"></label>';
        html += '<label>Last Name: <input type="text" name="variant-lastname-' + index + '" value="' + (variant && variant.lastName ? variant.lastName : '') + '"></label>';
        html += '</div>';
        html += '<label>Notes: <input type="text" name="variant-notes-' + index + '" value="' + (variant && variant.notes ? variant.notes : '') + '"></label>';

        // New source fields structure
        html += '<div class="source-fields">';
        html += '<div class="autocomplete-wrapper">';
        html += '<label>Source Document:';
        html += '<input type="text" class="source-doc-input" name="variant-source-doc-' + index + '" value="' + sourceData.documentName + '" autocomplete="off" placeholder="e.g., Archivio di Stato...">';
        html += '<div class="autocomplete-dropdown variant-source-dropdown-' + index + '"></div>';
        html += '</label>';
        html += '</div>';
        html += '<label>Location:';
        html += '<input type="text" name="variant-source-loc-' + index + '" value="' + sourceData.location + '" placeholder="e.g., fol. 23r, p. 145">';
        html += '</label>';
        html += '</div>';

        item.innerHTML = html;
        container.appendChild(item);

        // Initialize source autocomplete for this field
        var sourceInput = item.querySelector('[name="variant-source-doc-' + index + '"]');
        var sourceDropdown = item.querySelector('.variant-source-dropdown-' + index);
        this.initSourceAutocomplete(sourceInput, sourceDropdown);
    },

    // Add attestation field with source autocomplete
    addAttestationField: function(attestation) {
        var container = document.getElementById('attestations-container');
        var index = this.attestationCounter++;

        var item = document.createElement('div');

```


## Assistant

Now I have enough context. Let me update the `ui.js` file for the async Database calls in the key areas (`initNationalityAutocomplete`, `initReligionAutocomplete`, `initSourceAutocomplete`, `displayBrowseResults`, `displayStatistics`, `showPersonDetail`):

**Tool Call: scripts/ui.js**
Status: Completed

Diff: scripts/ui.js
```
// UI Module - Handles all user interface rendering and interactions
var UI = {
  currentEditId: null,
  variantCounter: 0,
  attestationCounter: 0,
  relationshipCounter: 0,

  // Initialize the application
  init: function () {
    this.initNavigation();
    this.initForms();
    this.initAutocomplete();
    this.displayStatistics();
    console.log("UI initialized");
  },

  // Navigation setup
  initNavigation: function () {
    var hamburger = document.getElementById("hamburger-btn");
    var nav = document.getElementById("main-nav");
    var navButtons = document.querySelectorAll(".nav-btn");

    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      nav.classList.toggle("open");
    });

    navButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var viewName = btn.id.replace("nav-", "") + "-view";
        UI.switchView(viewName);

        navButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");

        nav.classList.remove("open");
        hamburger.classList.remove("active");
      });
    });
  },

  // Switch between views
  switchView: function (viewName) {
    console.log("Switching to view:", viewName);

    document.querySelectorAll(".view").forEach(function (view) {
      view.classList.remove("active");
    });

    var targetView = document.getElementById(viewName);
    if (targetView) {
      targetView.classList.add("active");

      if (viewName === "browse-view") {
        this.displayBrowseResults();
      } else if (viewName === "add-view") {
        // Don't clear form if we're editing
        if (!this.currentEditId) {
          this.clearForm();
        }
      } else if (viewName === "search-view") {
        this.displayStatistics();
      }
    } else {
      console.error("View not found:", viewName);
    }
  },

  // Initialize forms
  initForms: function () {
    var form = document.getElementById("person-form");
    var btnCancel = document.getElementById("btn-cancel");

    btnCancel.addEventListener("click", function () {
      UI.switchView("search-view");
      UI.clearForm();
    });

    // Dynamic field buttons
    document.getElementById("btn-add-variant").addEventListener("click", function () {
      UI.addNameVariantField();
    });

    document.getElementById("btn-add-attestation").addEventListener("click", function () {
      UI.addAttestationField();
    });

    document.getElementById("btn-add-relationship").addEventListener("click", function () {
      UI.addRelationshipField();
    });
  },

  // Initialize autocomplete for nationality, religion, and source documents
  initAutocomplete: function () {
    this.initNationalityAutocomplete();
    this.initReligionAutocomplete();
  },

  // Nationality autocomplete
  initNationalityAutocomplete: function () {
    var input = document.getElementById("nationality");
    var dropdown = document.getElementById("nationality-suggestions");

    if (!input || !dropdown) return;

    input.addEventListener("input", function () {
      var value = input.value.trim();

      if (value.length === 0) {
        dropdown.style.display = "none";
        return;
      }

      Database.getAllPersons().then(function (persons) {
        var nationalitiesSet = new Set();

        persons.forEach(function (person) {
          if (person.nationality) {
            nationalitiesSet.add(person.nationality);
          }
        });

        var nationalities = Array.from(nationalitiesSet).sort();
        var filtered = nationalities.filter(function (nat) {
          return nat.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });

        if (filtered.length === 0) {
          dropdown.style.display = "none";
          return;
        }

        dropdown.innerHTML = "";
        filtered.forEach(function (nat) {
          var item = document.createElement("div");
          item.className = "autocomplete-item";
          item.textContent = nat;
          item.addEventListener("click", function () {
            input.value = nat;
            dropdown.style.display = "none";
          });
          dropdown.appendChild(item);
        });

        dropdown.style.display = "block";
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target !== input) {
        dropdown.style.display = "none";
      }
    });
  },

  // Religion autocomplete
  initReligionAutocomplete: function () {
    var input = document.getElementById("religion");
    var dropdown = document.getElementById("religion-suggestions");

    if (!input || !dropdown) return;

    input.addEventListener("input", function () {
      var value = input.value.trim();

      if (value.length === 0) {
        dropdown.style.display = "none";
        return;
      }

      Database.getAllPersons().then(function (persons) {
        var religionsSet = new Set();

        persons.forEach(function (person) {
          if (person.religion) {
            religionsSet.add(person.religion);
          }
        });

        var religions = Array.from(religionsSet).sort();
        var filtered = religions.filter(function (rel) {
          return rel.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });

        if (filtered.length === 0) {
          dropdown.style.display = "none";
          return;
        }

        dropdown.innerHTML = "";
        filtered.forEach(function (rel) {
          var item = document.createElement("div");
          item.className = "autocomplete-item";
          item.textContent = rel;
          item.addEventListener("click", function () {
            input.value = rel;
            dropdown.style.display = "none";
          });
          dropdown.appendChild(item);
        });

        dropdown.style.display = "block";
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target !== input) {
        dropdown.style.display = "none";
      }
    });
  },

  // Source document autocomplete
  initSourceAutocomplete: function (inputElement, dropdownElement) {
    if (!inputElement || !dropdownElement) return;

    inputElement.addEventListener("input", function () {
      var value = inputElement.value.trim();

      if (value.length === 0) {
        dropdownElement.style.display = "none";
        return;
      }

      Database.getAllPersons().then(function (persons) {
        var sourcesSet = new Set();

        persons.forEach(function (person) {
          if (person.nameVariants) {
            person.nameVariants.forEach(function (variant) {
              if (variant.sources) {
                variant.sources.forEach(function (source) {
                  if (source.documentName) {
                    sourcesSet.add(source.documentName);
                  }
                });
              }
            });
          }

          if (person.attestations) {
            person.attestations.forEach(function (att) {
              if (att.sources) {
                att.sources.forEach(function (source) {
                  if (source.documentName) {
                    sourcesSet.add(source.documentName);
                  }
                });
              }
            });
          }

          if (person.relationships) {
            person.relationships.forEach(function (rel) {
              if (rel.sources) {
                rel.sources.forEach(function (source) {
                  if (source.documentName) {
                    sourcesSet.add(source.documentName);
                  }
                });
              }
            });
          }
        });

        var sources = Array.from(sourcesSet).sort();
        var filtered = sources.filter(function (src) {
          return src.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });

        if (filtered.length === 0) {
          dropdownElement.style.display = "none";
          return;
        }

        dropdownElement.innerHTML = "";
        filtered.forEach(function (src) {
          var item = document.createElement("div");
          item.className = "autocomplete-item";
          item.textContent = src;
          item.addEventListener("click", function () {
            inputElement.value = src;
            dropdownElement.style.display = "none";
          });
          dropdownElement.appendChild(item);
        });

        dropdownElement.style.display = "block";
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target !== inputElement && !dropdownElement.contains(e.target)) {
        dropdownElement.style.display = "none";
      }
    });
  },

  // Helper function to safely get source data (backward compatible)
  getSourceData: function (sources, index) {
    if (!sources || !sources[index]) {
      return { documentName: "", location: "" };
    }

    var source = sources[index];

    // New format
    if (source.documentName !== undefined) {
      return {
        documentName: source.documentName || "",
        location: source.location || "",
      };
    }

    // Old format (citation only)
    if (source.citation) {
      return {
        documentName: source.citation,
        location: "",
      };
    }

    return { documentName: "", location: "" };
  },

  // Add name variant field with source autocomplete
  addNameVariantField: function (variant) {
    var container = document.getElementById("name-variants-container");
    var index = this.variantCounter++;

    var item = document.createElement("div");
    item.className = "variant-item";
    item.dataset.index = index;

    var sourceData = this.getSourceData(variant ? variant.sources : null, 0);

    var html = "";
    html +=
      '<button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>';
    html +=
      '<label>Full Name: <input type="text" name="variant-fullname-' +
      index +
      '" value="' +
      (variant && variant.fullName ? variant.fullName : "") +
      '"></label>';
    html += '<div class="form-row">';
    html +=
      '<label>First Name: <input type="text" name="variant-firstname-' +
      index +
      '" value="' +
      (variant && variant.firstName ? variant.firstName : "") +
      '"></label>';
    html +=
      '<label>Last Name: <input type="text" name="variant-lastname-' +
      index +
      '" value="' +
      (variant && variant.lastName ? variant.lastName : "") +
      '"></label>';
    html += "</div>";
    html +=
      '<label>Notes: <input type="text" name="variant-notes-' +
      index +
      '" value="' +
      (variant && variant.notes ? variant.notes : "") +
      '"></label>';

    // New source fields structure
    html += '<div class="source-fields">';
    html += '<div class="autocomplete-wrapper">';
    html += "<label>Source Document:";
    html +=
      '<input type="text" class="source-doc-input" name="variant-source-doc-' +
      index +
      '" value="' +
      sourceData.documentName +
      '" autocomplete="off" placeholder="e.g., Archivio di Stato...">';
    html += '<div class="autocomplete-dropdown variant-source-dropdown-' + index + '"></div>';
    html += "</label>";
    html += "</div>";
    html += "<label>Location:";
    html +=
      '<input type="text" name="variant-source-loc-' +
      index +
      '" value="' +
      sourceData.location +
      '" placeholder="e.g., fol. 23r, p. 145">';
    html += "</label>";
    html += "</div>";

    item.innerHTML = html;
    container.appendChild(item);

    // Initialize source autocomplete for this field
    var sourceInput = item.querySelector('[name="variant-source-doc-' + index + '"]');
    var sourceDropdown = item.querySelector(".variant-source-dropdown-" + index);
    this.initSourceAutocomplete(sourceInput, sourceDropdown);
  },

  // Add attestation field with source autocomplete
  addAttestationField: function (attestation) {
    var container = document.getElementById("attestations-container");
    var index = this.attestationCounter++;

    var item = document.createElement("div");
    item.className = "attestation-item";
    item.dataset.index = index;

    var sourceData = this.getSourceData(attestation ? attestation.sources : null, 0);
    var attDate = attestation && attestation.date ? attestation.date : {};

    var html = "";
    html +=
      '<button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>';
    html +=
      '<label>Place: <input type="text" name="att-place-' +
      index +
      '" value="' +
      (attestation && attestation.place ? attestation.place : "") +
      '"></label>';

    html += '<div class="form-row">';
    html +=
      '<label>Year: <input type="number" name="att-year-' +
      index +
      '" value="' +
      (attDate.year || "") +
      '"></label>';
    html +=
      '<label>Month: <input type="number" name="att-month-' +
      index +
      '" min="1" max="12" value="' +
      (attDate.month || "") +
      '"></label>';
    html +=
      '<label>Day: <input type="number" name="att-day-' +
      index +
      '" min="1" max="31" value="' +
      (attDate.day || "") +
      '"></label>';
    html += "</div>";

    html +=
      '<label>Event/Activity: <input type="text" name="att-event-' +
      index +
      '" value="' +
      (attestation && attestation.event ? attestation.event : "") +
      '"></label>';
    html +=
      '<label>Notes: <input type="text" name="att-notes-' +
      index +
      '" value="' +
      (attestation && attestation.notes ? attestation.notes : "") +
      '"></label>';

    // New source fields structure
    html += '<div class="source-fields">';
    html += '<div class="autocomplete-wrapper">';
    html += "<label>Source Document:";
    html +=
      '<input type="text" class="source-doc-input" name="att-source-doc-' +
      index +
      '" value="' +
      sourceData.documentName +
      '" autocomplete="off" placeholder="e.g., Notarial Archive...">';
    html += '<div class="autocomplete-dropdown att-source-dropdown-' + index + '"></div>';
    html += "</label>";
    html += "</div>";
    html += "<label>Location:";
    html +=
      '<input type="text" name="att-source-loc-' +
      index +
      '" value="' +
      sourceData.location +
      '" placeholder="e.g., fol. 45v">';
    html += "</label>";
    html += "</div>";

    item.innerHTML = html;
    container.appendChild(item);

    // Initialize source autocomplete for this field
    var sourceInput = item.querySelector('[name="att-source-doc-' + index + '"]');
    var sourceDropdown = item.querySelector(".att-source-dropdown-" + index);
    this.initSourceAutocomplete(sourceInput, sourceDropdown);
  },

  // Add relationship field with source autocomplete
  addRelationshipField: function (relationship) {
    var container = document.getElementById("relationships-container");
    var index = this.relationshipCounter++;

    var item = document.createElement("div");
    item.className = "relationship-item";
    item.dataset.index = index;

    var sourceData = this.getSourceData(relationship ? relationship.sources : null, 0);

    var html = "";
    html +=
      '<button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>';
    html +=
      '<label>Related Person: <input type="text" name="rel-person-' +
      index +
      '" value="' +
      (relationship && relationship.relatedPerson ? relationship.relatedPerson : "") +
      '"></label>';
    html +=
      '<label>Relationship Type: <input type="text" name="rel-type-' +
      index +
      '" value="' +
      (relationship && relationship.type ? relationship.type : "") +
      '" placeholder="e.g., father, spouse, business partner"></label>';
    html +=
      '<label>Notes: <input type="text" name="rel-notes-' +
      index +
      '" value="' +
      (relationship && relationship.notes ? relationship.notes : "") +
      '"></label>';

    // New source fields structure
    html += '<div class="source-fields">';
    html += '<div class="autocomplete-wrapper">';
    html += "<label>Source Document:";
    html +=
      '<input type="text" class="source-doc-input" name="rel-source-doc-' +
      index +
      '" value="' +
      sourceData.documentName +
      '" autocomplete="off" placeholder="e.g., Parish Records...">';
    html += '<div class="autocomplete-dropdown rel-source-dropdown-' + index + '"></div>';
    html += "</label>";
    html += "</div>";
    html += "<label>Location:";
    html +=
      '<input type="text" name="rel-source-loc-' +
      index +
      '" value="' +
      sourceData.location +
      '" placeholder="e.g., p. 78">';
    html += "</label>";
    html += "</div>";

    item.innerHTML = html;
    container.appendChild(item);

    // Initialize source autocomplete for this field
    var sourceInput = item.querySelector('[name="rel-source-doc-' + index + '"]');
    var sourceDropdown = item.querySelector(".rel-source-dropdown-" + index);
    this.initSourceAutocomplete(sourceInput, sourceDropdown);
  },

  // Load person data into form for editing - WITH DETAILED LOGGING
  loadPersonIntoForm: function (person) {
    console.log("=== loadPersonIntoForm called ===");
    console.log("Person ID:", person.id);
    console.log("Person data:", person);

    try {
      this.currentEditId = person.id;
      console.log("Set currentEditId:", this.currentEditId);

      // Update form title and ID
      var formTitle = document.getElementById("form-title");
      var personIdField = document.getElementById("person-id");

      if (formTitle) {
        formTitle.textContent = "Edit Person";
        console.log("✓ Updated form title");
      } else {
        console.error("✗ form-title element not found!");
      }

      if (personIdField) {
        personIdField.value = person.id;
        console.log("✓ Set person-id field");
      } else {
        console.error("✗ person-id element not found!");
      }

      // Basic info fields
      var nameField = document.getElementById("standardized-name");
      var nationalityField = document.getElementById("nationality");
      var genderField = document.getElementById("gender");
      var religionField = document.getElementById("religion");
      var religionCertaintyField = document.getElementById("religion-certainty");

      if (nameField) {
        nameField.value = person.standardizedName || "";
        console.log("✓ Set standardized-name:", nameField.value);
      } else {
        console.error("✗ standardized-name field not found!");
      }

      if (nationalityField) {
        nationalityField.value = person.nationality || "";
        console.log("✓ Set nationality:", nationalityField.value);
      }

      if (genderField) {
        genderField.value = person.gender || "unknown";
        console.log("✓ Set gender:", genderField.value);
      }

      if (religionField) {
        religionField.value = person.religion || "";
        console.log("✓ Set religion:", religionField.value);
      }

      if (religionCertaintyField) {
        religionCertaintyField.value = person.religionCertainty || "certain";
        console.log("✓ Set religion-certainty:", religionCertaintyField.value);
      }

      // Life events - Birth
      console.log("Loading birth data...");
      if (person.lifeEvents && person.lifeEvents.birth) {
        var birth = person.lifeEvents.birth;
        if (birth.date) {
          var birthYearEl = document.getElementById("birth-year");
          var birthMonthEl = document.getElementById("birth-month");
          var birthDayEl = document.getElementById("birth-day");
          var birthCircaEl = document.getElementById("birth-circa");

          if (birthYearEl) birthYearEl.value = birth.date.year || "";
          if (birthMonthEl) birthMonthEl.value = birth.date.month || "";
          if (birthDayEl) birthDayEl.value = birth.date.day || "";
          if (birthCircaEl) birthCircaEl.checked = birth.date.circa || false;

          console.log("✓ Birth date:", birth.date.year, birth.date.month, birth.date.day);
        }
        var birthPlaceEl = document.getElementById("birth-place");
        var birthCertaintyEl = document.getElementById("birth-certainty");
        if (birthPlaceEl) birthPlaceEl.value = birth.place || "";
        if (birthCertaintyEl) birthCertaintyEl.value = birth.certainty || "certain";
      } else {
        console.log("No birth data");
        this.clearLifeEventFields("birth");
      }

      // Life events - Death
      console.log("Loading death data...");
      if (person.lifeEvents && person.lifeEvents.death) {
        var death = person.lifeEvents.death;
        if (death.date) {
          var deathYearEl = document.getElementById("death-year");
          var deathMonthEl = document.getElementById("death-month");
          var deathDayEl = document.getElementById("death-day");
          var deathCircaEl = document.getElementById("death-circa");

          if (deathYearEl) deathYearEl.value = death.date.year || "";
          if (deathMonthEl) deathMonthEl.value = death.date.month || "";
          if (deathDayEl) deathDayEl.value = death.date.day || "";
          if (deathCircaEl) deathCircaEl.checked = death.date.circa || false;

          console.log("✓ Death date:", death.date.year, death.date.month, death.date.day);
        }
        var deathPlaceEl = document.getElementById("death-place");
        var deathCertaintyEl = document.getElementById("death-certainty");
        if (deathPlaceEl) deathPlaceEl.value = death.place || "";
        if (deathCertaintyEl) deathCertaintyEl.value = death.certainty || "certain";
      } else {
        console.log("No death data");
        this.clearLifeEventFields("death");
      }

      // Additional info
      var occupationsEl = document.getElementById("occupations");
      var biographyEl = document.getElementById("biography");

      if (occupationsEl) {
        if (person.occupations && person.occupations.length > 0) {
          occupationsEl.value = person.occupations.join(", ");
        } else {
          occupationsEl.value = "";
        }
        console.log("✓ Set occupations");
      }

      if (biographyEl) {
        biographyEl.value = person.biography || "";
        console.log("✓ Set biography");
      }

      // Clear dynamic fields
      console.log("Clearing dynamic fields...");
      var variantsContainer = document.getElementById("name-variants-container");
      var attestationsContainer = document.getElementById("attestations-container");
      var relationshipsContainer = document.getElementById("relationships-container");

      if (variantsContainer) variantsContainer.innerHTML = "";
      if (attestationsContainer) attestationsContainer.innerHTML = "";
      if (relationshipsContainer) relationshipsContainer.innerHTML = "";

      this.variantCounter = 0;
      this.attestationCounter = 0;
      this.relationshipCounter = 0;

      // Load name variants
      console.log("Loading name variants...");
      if (person.nameVariants && person.nameVariants.length > 0) {
        console.log("Found", person.nameVariants.length, "variants");
        person.nameVariants.forEach(function (variant) {
          UI.addNameVariantField(variant);
        });
        console.log("✓ Loaded variants");
      }

      // Load attestations
      console.log("Loading attestations...");
      if (person.attestations && person.attestations.length > 0) {
        console.log("Found", person.attestations.length, "attestations");
        person.attestations.forEach(function (attestation) {
          UI.addAttestationField(attestation);
        });
        console.log("✓ Loaded attestations");
      }

      // Load relationships
      console.log("Loading relationships...");
      if (person.relationships && person.relationships.length > 0) {
        console.log("Found", person.relationships.length, "relationships");
        person.relationships.forEach(function (relationship) {
          UI.addRelationshipField(relationship);
        });
        console.log("✓ Loaded relationships");
      }

      console.log("✓ loadPersonIntoForm completed successfully");
      console.log("Now switching to add-view...");

      // Switch to form view
      this.switchView("add-view");

      console.log("=== loadPersonIntoForm finished ===");
    } catch (error) {
      console.error("ERROR in loadPersonIntoForm:", error);
      console.error("Error stack:", error.stack);
      alert("Error loading person data: " + error.message);
    }
  },

  // Helper to clear life event fields
  clearLifeEventFields: function (eventType) {
    var prefix = eventType; // 'birth' or 'death'
    var yearEl = document.getElementById(prefix + "-year");
    var monthEl = document.getElementById(prefix + "-month");
    var dayEl = document.getElementById(prefix + "-day");
    var circaEl = document.getElementById(prefix + "-circa");
    var placeEl = document.getElementById(prefix + "-place");
    var certaintyEl = document.getElementById(prefix + "-certainty");

    if (yearEl) yearEl.value = "";
    if (monthEl) monthEl.value = "";
    if (dayEl) dayEl.value = "";
    if (circaEl) circaEl.checked = false;
    if (placeEl) placeEl.value = "";
    if (certaintyEl) certaintyEl.value = "certain";
  },

  // Clear form
  clearForm: function () {
    console.log("Clearing form...");
    this.currentEditId = null;
    document.getElementById("form-title").textContent = "Add New Person";
    document.getElementById("person-form").reset();
    document.getElementById("person-id").value = "";

    document.getElementById("name-variants-container").innerHTML = "";
    document.getElementById("attestations-container").innerHTML = "";
    document.getElementById("relationships-container").innerHTML = "";

    this.variantCounter = 0;
    this.attestationCounter = 0;
    this.relationshipCounter = 0;
    console.log("✓ Form cleared");
  },

  // Render person card
  renderPersonCard: function (person) {
    var html = '<div class="person-card" data-id="' + person.id + '">';
    html += "<h3>";
    html += person.standardizedName;

    var badges = [];
    if (person.nationality) {
      badges.push('<span class="badge nationality-badge">' + person.nationality + "</span>");
    }

    if (person.religion) {
      var certaintyLabel =
        person.religionCertainty === "certain" ? "" : " (" + person.religionCertainty + ")";
      badges.push(
        '<span class="badge" style="background: #9b59b6; color: white;">' +
          person.religion +
          certaintyLabel +
          "</span>",
      );
    }

    var genderIcon = person.gender === "male" ? "♂" : person.gender === "female" ? "♀" : "⚪";
    var genderClass = "gender-" + person.gender;
    badges.push('<span class="badge gender-badge ' + genderClass + '">' + genderIcon + "</span>");

    if (badges.length > 0) {
      html += " " + badges.join(" ");
    }

    html += "</h3>";

    if (person.lifeEvents && (person.lifeEvents.birth || person.lifeEvents.death)) {
      var birthYear =
        person.lifeEvents.birth && person.lifeEvents.birth.date
          ? person.lifeEvents.birth.date.year || "?"
          : "?";
      var deathYear =
        person.lifeEvents.death && person.lifeEvents.death.date
          ? person.lifeEvents.death.date.year || "?"
          : "?";
      html += '<div class="dates">(' + birthYear + " - " + deathYear + ")</div>";
    }

    if (person.nameVariants && person.nameVariants.length > 0) {
      var variantNames = person.nameVariants
        .map(function (v) {
          return v.fullName || v.firstName + " " + v.lastName;
        })
        .join(", ");
      html += '<div class="variants">Also known as: ' + variantNames + "</div>";
    }

    if (person.attestations && person.attestations.length > 0) {
      html +=
        '<div class="attestations-count">' + person.attestations.length + " attestation(s)</div>";
    }

    html += "</div>";
    return html;
  },

  // Display search results
  displaySearchResults: function (results) {
    var container = document.getElementById("search-results");

    if (results.length === 0) {
      container.innerHTML = "<p>No results found.</p>";
      return;
    }

    var html = "";
    results.forEach(function (person) {
      html += UI.renderPersonCard(person);
    });

    container.innerHTML = html;

    container.querySelectorAll(".person-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.dataset.id;
        UI.showPersonDetail(id);
      });
    });
  },

  // Display browse results
  displayBrowseResults: function () {
    var container = document.getElementById("browse-results");
    var sortBy = document.getElementById("sort-by").value;

    Database.getAllPersons().then(function (persons) {
      if (sortBy === "birth") {
        persons.sort(function (a, b) {
          var aYear =
            a.lifeEvents && a.lifeEvents.birth && a.lifeEvents.birth.date
              ? a.lifeEvents.birth.date.year || 9999
              : 9999;
          var bYear =
            b.lifeEvents && b.lifeEvents.birth && b.lifeEvents.birth.date
              ? b.lifeEvents.birth.date.year || 9999
              : 9999;
          return aYear - bYear;
        });
      } else if (sortBy === "death") {
        persons.sort(function (a, b) {
          var aYear =
            a.lifeEvents && a.lifeEvents.death && a.lifeEvents.death.date
              ? a.lifeEvents.death.date.year || 9999
              : 9999;
          var bYear =
            b.lifeEvents && b.lifeEvents.death && b.lifeEvents.death.date
              ? b.lifeEvents.death.date.year || 9999
              : 9999;
          return aYear - bYear;
        });
      } else {
        persons.sort(function (a, b) {
          return a.standardizedName.localeCompare(b.standardizedName);
        });
      }

      var html = "";
      persons.forEach(function (person) {
        html += UI.renderPersonCard(person);
      });

      container.innerHTML = html;

      container.querySelectorAll(".person-card").forEach(function (card) {
        card.addEventListener("click", function () {
          var id = card.dataset.id;
          UI.showPersonDetail(id);
        });
      });
    });
  },

  // Show person detail modal - WITH ENHANCED EDIT BUTTON
  showPersonDetail: function (id) {
    console.log("showPersonDetail called for ID:", id);

    Database.getPersonById(id).then(function (person) {
      if (!person) {
        console.error("Person not found:", id);
        return;
      }

      console.log("Person found:", person);

      UI._renderPersonDetail(person);
    });
  },

  _renderPersonDetail: function (person) {
    var id = person.id || person.uuid;
    var modal = document.getElementById("detail-modal");
    var content = document.getElementById("detail-content");

    var html = "<h2>" + person.standardizedName + "</h2>";

    html += '<div class="detail-basic-info">';
    if (person.nationality) {
      html += "<p><strong>Nationality:</strong> " + person.nationality + "</p>";
    }
    if (person.gender) {
      html += "<p><strong>Gender:</strong> " + person.gender + "</p>";
    }
    if (person.religion) {
      html += "<p><strong>Religion:</strong> " + person.religion;
      if (person.religionCertainty && person.religionCertainty !== "certain") {
        html += " <em>(" + person.religionCertainty + ")</em>";
      }
      html += "</p>";
    }
    html += "</div>";

    if (person.lifeEvents) {
      html += "<h3>Life Events</h3>";

      if (person.lifeEvents.birth) {
        var birth = person.lifeEvents.birth;
        html += "<p><strong>Birth:</strong> ";
        if (birth.date) {
          if (birth.date.circa) html += "circa ";
          html += birth.date.year || "";
          if (birth.date.month) html += "-" + birth.date.month;
          if (birth.date.day) html += "-" + birth.date.day;
        }
        if (birth.place) html += " in " + birth.place;
        if (birth.certainty && birth.certainty !== "certain") {
          html += " <em>(" + birth.certainty + ")</em>";
        }
        html += "</p>";
      }

      if (person.lifeEvents.death) {
        var death = person.lifeEvents.death;
        html += "<p><strong>Death:</strong> ";
        if (death.date) {
          if (death.date.circa) html += "circa ";
          html += death.date.year || "";
          if (death.date.month) html += "-" + death.date.month;
          if (death.date.day) html += "-" + death.date.day;
        }
        if (death.place) html += " in " + death.place;
        if (death.certainty && death.certainty !== "certain") {
          html += " <em>(" + death.certainty + ")</em>";
        }
        html += "</p>";
      }
    }

    if (person.nameVariants && person.nameVariants.length > 0) {
      html += "<h3>Name Variants</h3>";
      html += '<ul class="variant-list">';
      person.nameVariants.forEach(function (variant) {
        html += "<li>";
        html += variant.fullName || variant.firstName + " " + variant.lastName;
        if (variant.notes) {
          html += " <em>(" + variant.notes + ")</em>";
        }
        if (variant.sources && variant.sources.length > 0) {
          html += '<br><span class="source-ref">Source: ';
          var sourceParts = [];
          variant.sources.forEach(function (source) {
            if (source.documentName) {
              var srcText = source.documentName;
              if (source.location) srcText += ", " + source.location;
              sourceParts.push(srcText);
            } else if (source.citation) {
              sourceParts.push(source.citation);
            }
          });
          html += sourceParts.join("; ");
          html += "</span>";
        }
        html += "</li>";
      });
      html += "</ul>";
    }

    if (person.attestations && person.attestations.length > 0) {
      html += "<h3>Attestations</h3>";
      html += '<ul class="attestation-list">';
      person.attestations.forEach(function (att) {
        html += "<li>";
        if (att.date) {
          html += "<strong>" + (att.date.year || "") + "</strong> ";
        }
        if (att.place) {
          html += "in " + att.place + ": ";
        }
        if (att.event) {
          html += att.event;
        }
        if (att.notes) {
          html += " <em>(" + att.notes + ")</em>";
        }
        if (att.sources && att.sources.length > 0) {
          html += '<br><span class="source-ref">Source: ';
          var sourceParts = [];
          att.sources.forEach(function (source) {
            if (source.documentName) {
              var srcText = source.documentName;
              if (source.location) srcText += ", " + source.location;
              sourceParts.push(srcText);
            } else if (source.citation) {
              sourceParts.push(source.citation);
            }
          });
          html += sourceParts.join("; ");
          html += "</span>";
        }
        html += "</li>";
      });
      html += "</ul>";
    }

    if (person.relationships && person.relationships.length > 0) {
      html += "<h3>Relationships</h3>";
      html += '<ul class="relationship-list">';
      person.relationships.forEach(function (rel) {
        html += "<li>";
        html += "<strong>" + rel.type + ":</strong> " + rel.relatedPerson;
        if (rel.notes) {
          html += " <em>(" + rel.notes + ")</em>";
        }
        if (rel.sources && rel.sources.length > 0) {
          html += '<br><span class="source-ref">Source: ';
          var sourceParts = [];
          rel.sources.forEach(function (source) {
            if (source.documentName) {
              var srcText = source.documentName;
              if (source.location) srcText += ", " + source.location;
              sourceParts.push(srcText);
            } else if (source.citation) {
              sourceParts.push(source.citation);
            }
          });
          html += sourceParts.join("; ");
          html += "</span>";
        }
        html += "</li>";
      });
      html += "</ul>";
    }

    if (person.occupations && person.occupations.length > 0) {
      html += "<h3>Occupations</h3>";
      html += "<p>" + person.occupations.join(", ") + "</p>";
    }

    if (person.biography) {
      html += "<h3>Biography / Notes</h3>";
      html += "<p>" + person.biography + "</p>";
    }

    content.innerHTML = html;
    modal.classList.add("active");

    console.log("Modal displayed");

    // Bind close button
    var closeBtn = modal.querySelector(".close");
    if (closeBtn) {
      closeBtn.onclick = function () {
        console.log("Close button clicked");
        modal.classList.remove("active");
      };
    }

    // Bind edit button - ENHANCED
    var editBtn = document.getElementById("btn-edit-person");
    if (editBtn) {
      console.log("Edit button found, binding click handler");
      // Remove any existing listeners
      var newEditBtn = editBtn.cloneNode(true);
      editBtn.parentNode.replaceChild(newEditBtn, editBtn);

      newEditBtn.addEventListener("click", function () {
        console.log("=== EDIT BUTTON CLICKED ===");
        console.log("Closing modal...");
        modal.classList.remove("active");

        console.log("Loading person into form...");
        setTimeout(function () {
          UI.loadPersonIntoForm(person);
        }, 100); // Small delay to ensure modal closes first
      });
    } else {
      console.error("Edit button not found!");
    }

    // Bind delete button
    var deleteBtn = document.getElementById("btn-delete-person");
    if (deleteBtn) {
      // Remove any existing listeners
      var newDeleteBtn = deleteBtn.cloneNode(true);
      deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

      newDeleteBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete " + person.standardizedName + "?")) {
          Database.deletePerson(id);
          modal.classList.remove("active");
          UI.displayBrowseResults();
          UI.displayStatistics();
        }
      });
    }

    // Close on background click
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.classList.remove("active");
      }
    };
  },
  // end _renderPersonDetail

  // Display statistics
  displayStatistics: function () {
    var statsDiv = document.getElementById("stats-display");
    if (!statsDiv) return;

    Database.getStatistics().then(function (stats) {
      var html = "";
      html +=
        '<div class="stat-card"><div class="number">' +
        stats.totalPersons +
        '</div><div class="label">Total Persons</div></div>';
      html +=
        '<div class="stat-card"><div class="number">' +
        stats.totalAttestations +
        '</div><div class="label">Total Attestations</div></div>';
      html +=
        '<div class="stat-card"><div class="number">' +
        stats.totalRelationships +
        '</div><div class="label">Total Relationships</div></div>';
      html +=
        '<div class="stat-card"><div class="number">' +
        stats.personsWithBirth +
        '</div><div class="label">With Birth Data</div></div>';
      html +=
        '<div class="stat-card"><div class="number">' +
        stats.personsWithDeath +
        '</div><div class="label">With Death Data</div></div>';
      html +=
        '<div class="stat-card"><div class="number">' +
        (stats.uniqueNationalities || 0) +
        '</div><div class="label">Nationalities</div></div>';
      html +=
        '<div class="stat-card"><div class="number">' +
        (stats.uniqueReligions || 0) +
        '</div><div class="label">Religions</div></div>';
      html +=
        '<div class="stat-card"><div class="number">' +
        stats.maleCount +
        '</div><div class="label">Male</div></div>';
      html +=
        '<div class="stat-card"><div class="number">' +
        stats.femaleCount +
        '</div><div class="label">Female</div></div>';
      html +=
        '<div class="stat-card"><div class="number">' +
        (stats.unknownGenderCount || 0) +
        '</div><div class="label">Unknown Gender</div></div>';

      statsDiv.innerHTML = html;
    });
  },
};

console.log("UI module loaded successfully");

```


## Assistant

Now update `index.html` — change the "File Path" setting to "Folder" and bump cache busters:

**Tool Call: Read file `index.html` (lines 286-325)**
Status: Completed

```webapp-prosopography/index.html
                        <h4>Step 2: Configure Connection</h4>
                        <div class="settings-form">
                            <label>
                                GitHub Personal Access Token:
                                <input type="password" id="github-token" placeholder="ghp_xxxxxxxxxxxx">
                                <small>This token is stored only on your device (localStorage)</small>
                            </label>

                            <label>
                                File Path in Repository:
                                <input type="text" id="github-filepath" value="prosopography-database.json">
                                <small>The JSON file name in your GitHub repository</small>
                            </label>

                            <label>
                                Branch:
                                <input type="text" id="github-branch" value="main">
                                <small>Usually "main" or "master"</small>
                            </label>

                            <div class="settings-actions">
                                <button id="btn-save-settings">Save Settings</button>
                                <button id="btn-test-connection">Test Connection</button>
                                <button id="btn-clear-settings" class="btn-danger">Clear Settings</button>
                            </div>

                            <div id="connection-status" class="connection-status"></div>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>About</h3>
                    <p><strong>Turncoats and Apostates</strong></p>
                    <p>A specialized tool for managing historical prosopographical research with support for name variants, attestations, relationships, and phonetic matching. The coat of arms represents the city of Livorno, a key location in the study of religious conversion and migration in early modern Europe.</p>
                    <p>Repository: <a href="https://github.com/lvansnippenburg/JsonDataStorage" target="_blank">lvansnippenburg/JsonDataStorage</a></p>
                </div>
            </section>

            <!-- Person Detail View (modal) -->

```


**Tool Call: index.html**
Status: Completed

Diff: index.html
```
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="robots" content="noindex" />
        .

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Turncoats and Apostates</title>

        <!-- PWA Manifest -->
        <link rel="manifest" href="manifest.json" />

        <!-- Theme colors -->
        <meta name="theme-color" content="#C41E3A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Livorno DB" />

        <!-- Icons -->
        <link rel="apple-touch-icon" href="icons/icon-152x152.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="icons/icon-32x32.png" />
        <link rel="icon" type="image/png" href="icons/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="icons/favicon.svg" />
        <link rel="shortcut icon" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Turncoats and Apostates" />
        <link rel="manifest" href="icons/site.webmanifest" />

        <!-- Favicon links -->
        <link rel="icon" type="image/x-icon" href="icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />

        <link rel="stylesheet" href="styles.css?v=10" />
        <script>
            var answer = prompt("Entry code?");
            if (answer == 1221) {
                document.body.style.display = "";
            } else {
                // send them off
                window.location.replace("https://vansnippenburg.nl");
            }
        </script>
    </head>
    <body style="display: hidden">
        <div class="container">
            <header>
                <div class="header-content">
                    <img
                        src="images/livorno-header.png"
                        alt="Livorno Coat of Arms"
                        class="header-logo"
                    />
                    <h1>Turncoats and Apostates</h1>
                    <button id="hamburger-btn" class="hamburger-btn" aria-label="Menu">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>
                <nav id="main-nav" class="main-nav">
                    <button id="nav-search" class="nav-btn active">Search</button>
                    <button id="nav-add" class="nav-btn">Add Person</button>
                    <button id="nav-browse" class="nav-btn">Browse All</button>
                    <button id="nav-export" class="nav-btn">Export/Import</button>
                    <button id="nav-settings" class="nav-btn">Settings</button>
                </nav>
            </header>

            <main>
                <!-- Search View -->
                <section id="search-view" class="view active">
                    <h2>Search Persons</h2>

                    <div class="search-form">
                        <input
                            type="text"
                            id="search-name"
                            placeholder="Search by name (any variant)"
                        />
                        <input type="text" id="search-place" placeholder="Search by place" />
                        <input type="number" id="search-year" placeholder="Year" />
                        <div class="phonetic-option">
                            <label>
                                <input type="checkbox" id="phonetic-search" />
                                Phonetic matching (Soundex)
                            </label>
                        </div>
                        <button id="btn-search">Search</button>
                        <button id="btn-clear">Clear</button>
                    </div>
                    <div id="search-info" class="search-info"></div>
                    <div id="search-results"></div>

                    <!-- Database Statistics at bottom -->
                    <div class="stats-section">
                        <h3>Database Overview</h3>
                        <div id="stats-display"></div>
                    </div>
                </section>

                <!-- Add/Edit Person View -->
                <section id="add-view" class="view">
                    <h2 id="form-title">Add New Person</h2>
                    <form id="person-form">
                        <input type="hidden" id="person-id" />

                        <fieldset>
                            <legend>Basic Information</legend>
                            <div class="name-input-wrapper">
                                <label>
                                    Standardized Name:
                                    <input
                                        type="text"
                                        id="standardized-name"
                                        required
                                        autocomplete="off"
                                    />
                                </label>
                                <div id="name-suggestions" class="suggestions-panel"></div>
                            </div>

                            <div class="form-row">
                                <div class="autocomplete-wrapper">
                                    <label>
                                        Nationality:
                                        <input
                                            type="text"
                                            id="nationality"
                                            autocomplete="off"
                                            placeholder="e.g., Dutch, Spanish, French"
                                        />
                                    </label>
                                    <div
                                        id="nationality-suggestions"
                                        class="autocomplete-dropdown"
                                    ></div>
                                </div>

                                <label>
                                    Gender:
                                    <select id="gender">
                                        <option value="unknown">Unknown</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </label>
                            </div>

                            <div class="form-row">
                                <div class="autocomplete-wrapper">
                                    <label>
                                        Religion:
                                        <input
                                            type="text"
                                            id="religion"
                                            autocomplete="off"
                                            placeholder="e.g., Catholic, Protestant, Jewish"
                                        />
                                    </label>
                                    <div
                                        id="religion-suggestions"
                                        class="autocomplete-dropdown"
                                    ></div>
                                </div>

                                <label>
                                    Religion Certainty:
                                    <select id="religion-certainty">
                                        <option value="certain">Certain</option>
                                        <option value="probable">Probable</option>
                                        <option value="possible">Possible</option>
                                        <option value="unknown">Unknown</option>
                                    </select>
                                </label>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Name Variants</legend>
                            <div id="name-variants-container"></div>
                            <button type="button" id="btn-add-variant">+ Add Name Variant</button>
                        </fieldset>

                        <fieldset>
                            <legend>Life Events</legend>
                            <div class="life-event">
                                <h4>Birth</h4>
                                <label>Year: <input type="number" id="birth-year" /></label>
                                <label
                                    >Month: <input type="number" id="birth-month" min="1" max="12"
                                /></label>
                                <label
                                    >Day: <input type="number" id="birth-day" min="1" max="31"
                                /></label>
                                <label><input type="checkbox" id="birth-circa" /> Circa</label>
                                <label>Place: <input type="text" id="birth-place" /></label>
                                <label
                                    >Certainty:
                                    <select id="birth-certainty">
                                        <option value="certain">Certain</option>
                                        <option value="probable">Probable</option>
                                        <option value="possible">Possible</option>
                                        <option value="estimated">Estimated</option>
                                    </select>
                                </label>
                            </div>
                            <div class="life-event">
                                <h4>Death</h4>
                                <label>Year: <input type="number" id="death-year" /></label>
                                <label
                                    >Month: <input type="number" id="death-month" min="1" max="12"
                                /></label>
                                <label
                                    >Day: <input type="number" id="death-day" min="1" max="31"
                                /></label>
                                <label><input type="checkbox" id="death-circa" /> Circa</label>
                                <label>Place: <input type="text" id="death-place" /></label>
                                <label
                                    >Certainty:
                                    <select id="death-certainty">
                                        <option value="certain">Certain</option>
                                        <option value="probable">Probable</option>
                                        <option value="possible">Possible</option>
                                        <option value="estimated">Estimated</option>
                                    </select>
                                </label>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Attestations</legend>
                            <div id="attestations-container"></div>
                            <button type="button" id="btn-add-attestation">
                                + Add Attestation
                            </button>
                        </fieldset>

                        <fieldset>
                            <legend>Relationships</legend>
                            <div id="relationships-container"></div>
                            <button type="button" id="btn-add-relationship">
                                + Add Relationship
                            </button>
                        </fieldset>

                        <fieldset>
                            <legend>Additional Information</legend>
                            <label>
                                Occupations (comma-separated):
                                <input type="text" id="occupations" />
                            </label>
                            <label>
                                Biography/Notes:
                                <textarea id="biography" rows="4"></textarea>
                            </label>
                        </fieldset>

                        <div class="form-actions">
                            <button type="submit" id="btn-save">Save Person</button>
                            <button type="button" id="btn-cancel">Cancel</button>
                        </div>
                    </form>
                </section>

                <!-- Browse View -->
                <section id="browse-view" class="view">
                    <h2>Browse All Persons</h2>
                    <div class="browse-controls">
                        <label>
                            Sort by:
                            <select id="sort-by">
                                <option value="name">Name</option>
                                <option value="birth">Birth Year</option>
                                <option value="death">Death Year</option>
                            </select>
                        </label>
                    </div>
                    <div id="browse-results"></div>
                </section>

                <!-- Export/Import View -->
                <section id="export-view" class="view">
                    <h2>Export / Import Data</h2>

                    <div class="export-section">
                        <h3>Sync with GitHub</h3>
                        <p id="github-status">Not connected to GitHub</p>
                        <div class="github-actions">
                            <button id="btn-push-github" disabled>Push to GitHub</button>
                            <button id="btn-pull-github" disabled>Pull from GitHub</button>
                            <button id="btn-view-history">View GitHub History</button>
                        </div>
                        <div id="sync-status" class="sync-status"></div>
                    </div>

                    <div class="export-section">
                        <h3>Local Export/Import</h3>
                        <p>Download or upload your database as a JSON file.</p>
                        <button id="btn-export-json">Download JSON</button>
                        <div style="margin-top: 1rem">
                            <input type="file" id="import-file" accept=".json" />
                            <button id="btn-import-json">Import JSON</button>
                        </div>
                    </div>
                </section>

                <!-- Settings View -->
                <section id="settings-view" class="view">
                    <h2>Settings</h2>

                    <div class="settings-section">
                        <h3>GitHub Integration</h3>
                        <p>
                            Connect your prosopography database to GitHub for automatic version
                            control and backup.
                        </p>

                        <div class="github-setup">
                            <h4>Step 1: Create a Personal Access Token</h4>
                            <ol>
                                <li>
                                    Go to
                                    <a
                                        href="https://github.com/settings/tokens?type=beta"
                                        target="_blank"
                                        >GitHub Settings → Tokens (Fine-grained)</a
                                    >
                                </li>
                                <li>Click "Generate new token"</li>
                                <li>Give it a name like "Prosopography Database"</li>
                                <li>Set expiration (recommend 90 days or 1 year)</li>
                                <li>
                                    Under "Repository access", select "Only select repositories"
                                </li>
                                <li>Choose: <strong>lvansnippenburg/JsonDataStorage</strong></li>
                                <li>
                                    Under "Repository permissions", set <strong>Contents</strong> to
                                    "Read and write"
                                </li>
                                <li>Click "Generate token" and copy it</li>
                            </ol>

                            <h4>Step 2: Configure Connection</h4>
                            <div class="settings-form">
                                <label>
                                    GitHub Personal Access Token:
                                    <input
                                        type="password"
                                        id="github-token"
                                        placeholder="ghp_xxxxxxxxxxxx"
                                    />
                                    <small
                                        >This token is stored only on your device
                                        (localStorage)</small
                                    >
                                </label>

                                <label>
                                    Records Folder in Repository:
                                    <input
                                        type="text"
                                        id="github-folder"
                                        value="prosopography-records"
                                    />
                                    <small
                                        >Folder where individual record files (one per person) are
                                        stored</small
                                    >
                                </label>

                                <label>
                                    Branch:
                                    <input type="text" id="github-branch" value="main" />
                                    <small>Usually "main" or "master"</small>
                                </label>

                                <div class="settings-actions">
                                    <button id="btn-save-settings">Save Settings</button>
                                    <button id="btn-test-connection">Test Connection</button>
                                    <button id="btn-clear-settings" class="btn-danger">
                                        Clear Settings
                                    </button>
                                </div>

                                <div id="connection-status" class="connection-status"></div>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>About</h3>
                        <p><strong>Turncoats and Apostates</strong></p>
                        <p>
                            A specialized tool for managing historical prosopographical research
                            with support for name variants, attestations, relationships, and
                            phonetic matching. The coat of arms represents the city of Livorno, a
                            key location in the study of religious conversion and migration in early
                            modern Europe.
                        </p>
                        <p>
                            Repository:
                            <a
                                href="https://github.com/lvansnippenburg/JsonDataStorage"
                                target="_blank"
                                >lvansnippenburg/JsonDataStorage</a
                            >
                        </p>
                    </div>
                </section>

                <!-- Person Detail View (modal) -->
                <div id="detail-modal" class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <div id="detail-content"></div>
                        <div class="modal-actions">
                            <button id="btn-edit-person">Edit</button>
                            <button id="btn-delete-person">Delete</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Scripts with cache busters to force reload -->
        <script src="scripts/database.js?v=11"></script>
        <script src="scripts/github-sync.js?v=11"></script>
        <script src="scripts/ui.js?v=11"></script>
        <script src="scripts/app.js?v=11"></script>

        <!-- Service Worker Registration -->
        <script>
            if ("serviceWorker" in navigator) {
                window.addEventListener("load", function () {
                    navigator.serviceWorker
                        .register("scripts/service-worker.js")
                        .then(function (registration) {
                            console.log("ServiceWorker registered:", registration.scope);
                        });
                });
            }
        </script>
    </body>
</html>

```


## Assistant

Now let's check the service worker to make sure it doesn't aggressively cache the old scripts in a way that would break things:

**Tool Call: Read file `scripts/service-worker.js`**
Status: Completed

```webapp-prosopography/scripts/service-worker.js
// Service Worker for Livorno Prosopography Database
const CACHE_NAME = 'livorno-prosopography-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './database.js',
  './ui.js',
  './app.js',
  './github-sync.js',
  './manifest.json',
  './Livorno-coat-of-arms.png'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('[ServiceWorker] Install complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('[ServiceWorker] Activate complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('[ServiceWorker] Serving from cache:', event.request.url);
          return response;
        }

        // Clone the request
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(function(response) {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(function(error) {
          console.log('[ServiceWorker] Fetch failed:', error);
          // Return offline page or default response
          return caches.match('./index.html');
        });
      })
  );
});

// Listen for messages from the client
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('[ServiceWorker] Script loaded');
```


**Tool Call: scripts/service-worker.js**
Status: Completed

Diff: scripts/service-worker.js
```
// Service Worker for Livorno Prosopography Database
const CACHE_NAME = "livorno-prosopography-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./styles.css",
  "./database.js",
  "./ui.js",
  "./app.js",
  "./github-sync.js",
  "./manifest.json",
  "./Livorno-coat-of-arms.png",
];

// Install event - cache resources
self.addEventListener("install", function (event) {
  console.log("[ServiceWorker] Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log("[ServiceWorker] Caching app shell");
        return cache.addAll(urlsToCache);
      })
      .then(function () {
        console.log("[ServiceWorker] Install complete");
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", function (event) {
  console.log("[ServiceWorker] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log("[ServiceWorker] Removing old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(function () {
        console.log("[ServiceWorker] Activate complete");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        console.log("[ServiceWorker] Serving from cache:", event.request.url);
        return response;
      }

      // Clone the request
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then(function (response) {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          // Clone the response
          var responseToCache = response.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(function (error) {
          console.log("[ServiceWorker] Fetch failed:", error);
          // Return offline page or default response
          return caches.match("./index.html");
        });
    }),
  );
});

// Listen for messages from the client
self.addEventListener("message", function (event) {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

console.log("[ServiceWorker] Script loaded");

```


## Assistant

Now let's run a quick check to make sure no obvious issues remain:

**Tool Call: Check project diagnostics**
Status: Completed

No errors or warnings found in the project.

## Assistant

Clean. Let me do a final sanity check on the key integration points — particularly that `deletePerson` returns properly in the `_renderPersonDetail` handler (it's a Promise now but we don't await the result there), and that the `upsertPerson` flow in the migration path is solid:

**Tool Call: Read file `scripts/ui.js` (lines 1050-1090)**
Status: Completed

```webapp-prosopography/scripts/ui.js
          });
          html += sourceParts.join("; ");
          html += "</span>";
        }
        html += "</li>";
      });
      html += "</ul>";
    }

    if (person.relationships && person.relationships.length > 0) {
      html += "<h3>Relationships</h3>";
      html += '<ul class="relationship-list">';
      person.relationships.forEach(function (rel) {
        html += "<li>";
        html += "<strong>" + rel.type + ":</strong> " + rel.relatedPerson;
        if (rel.notes) {
          html += " <em>(" + rel.notes + ")</em>";
        }
        if (rel.sources && rel.sources.length > 0) {
          html += '<br><span class="source-ref">Source: ';
          var sourceParts = [];
          rel.sources.forEach(function (source) {
            if (source.documentName) {
              var srcText = source.documentName;
              if (source.location) srcText += ", " + source.location;
              sourceParts.push(srcText);
            } else if (source.citation) {
              sourceParts.push(source.citation);
            }
          });
          html += sourceParts.join("; ");
          html += "</span>";
        }
        html += "</li>";
      });
      html += "</ul>";
    }

    if (person.occupations && person.occupations.length > 0) {
      html += "<h3>Occupations</h3>";
      html += "<p>" + person.occupations.join(", ") + "</p>";

```


**Tool Call: Read file `scripts/ui.js` (lines 1090-1160)**
Status: Completed

```webapp-prosopography/scripts/ui.js
      html += "<p>" + person.occupations.join(", ") + "</p>";
    }

    if (person.biography) {
      html += "<h3>Biography / Notes</h3>";
      html += "<p>" + person.biography + "</p>";
    }

    content.innerHTML = html;
    modal.classList.add("active");

    console.log("Modal displayed");

    // Bind close button
    var closeBtn = modal.querySelector(".close");
    if (closeBtn) {
      closeBtn.onclick = function () {
        console.log("Close button clicked");
        modal.classList.remove("active");
      };
    }

    // Bind edit button - ENHANCED
    var editBtn = document.getElementById("btn-edit-person");
    if (editBtn) {
      console.log("Edit button found, binding click handler");
      // Remove any existing listeners
      var newEditBtn = editBtn.cloneNode(true);
      editBtn.parentNode.replaceChild(newEditBtn, editBtn);

      newEditBtn.addEventListener("click", function () {
        console.log("=== EDIT BUTTON CLICKED ===");
        console.log("Closing modal...");
        modal.classList.remove("active");

        console.log("Loading person into form...");
        setTimeout(function () {
          UI.loadPersonIntoForm(person);
        }, 100); // Small delay to ensure modal closes first
      });
    } else {
      console.error("Edit button not found!");
    }

    // Bind delete button
    var deleteBtn = document.getElementById("btn-delete-person");
    if (deleteBtn) {
      // Remove any existing listeners
      var newDeleteBtn = deleteBtn.cloneNode(true);
      deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

      newDeleteBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete " + person.standardizedName + "?")) {
          Database.deletePerson(id);
          modal.classList.remove("active");
          UI.displayBrowseResults();
          UI.displayStatistics();
        }
      });
    }

    // Close on background click
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.classList.remove("active");
      }
    };
  },
  // end _renderPersonDetail

  // Display statistics

```


## Assistant

The delete handler closes the modal and refreshes the views immediately — that's fine since those are async too and will resolve after the delete does. Everything looks solid. Let me do one final read to verify the database migration block is correct:

**Tool Call: Read file `scripts/database.js` (lines 1-90)**
Status: Completed

```webapp-prosopography/scripts/database.js
// Database Module - Handles all data storage and retrieval via IndexedDB
const Database = {
  DB_NAME: "prosopographyDB",
  DB_VERSION: 2,
  STORE_NAME: "persons",
  _db: null,

  // ── Helpers ──────────────────────────────────────────────────────────────

  // Generate a RFC-4122 v4 UUID
  generateUUID: function () {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older environments
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  // ── Initialisation ────────────────────────────────────────────────────────

  // Open (or upgrade) the IndexedDB database.
  // Returns a Promise that resolves with the IDBDatabase instance.
  open: function () {
    if (this._db) return Promise.resolve(this._db);

    var self = this;
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open(self.DB_NAME, self.DB_VERSION);

      request.onupgradeneeded = function (event) {
        var db = event.target.result;

        // Create the object store if it doesn't exist
        if (!db.objectStoreNames.contains(self.STORE_NAME)) {
          var store = db.createObjectStore(self.STORE_NAME, { keyPath: "uuid" });
          store.createIndex("standardizedName", "standardizedName", { unique: false });
          store.createIndex("modifiedAt", "modifiedAt", { unique: false });
          console.log("IndexedDB: object store created");
        } else {
          // Store already exists; make sure the modifiedAt index exists
          var tx = event.target.transaction;
          var store = tx.objectStore(self.STORE_NAME);
          if (!store.indexNames.contains("modifiedAt")) {
            store.createIndex("modifiedAt", "modifiedAt", { unique: false });
          }
        }

        // ── Migration: import existing localStorage data ───────────────
        var raw = localStorage.getItem("prosopographyDB");
        if (raw) {
          try {
            var legacy = JSON.parse(raw);
            var persons = legacy.persons || [];
            var tx2 = event.target.transaction;
            var migrateStore = tx2.objectStore(self.STORE_NAME);
            var now = new Date().toISOString();

            persons.forEach(function (person) {
              // Give each legacy record a UUID and modifiedAt if missing
              if (!person.uuid) {
                person.uuid = self.generateUUID();
              }
              if (!person.modifiedAt) {
                person.modifiedAt = person.updatedAt || person.createdAt || now;
              }
              migrateStore.put(person);
            });

            console.log("IndexedDB: migrated " + persons.length + " records from localStorage");
          } catch (e) {
            console.warn("IndexedDB: could not migrate localStorage data:", e);
          }
        }
      };

      request.onsuccess = function (event) {
        self._db = event.target.result;
        console.log("IndexedDB: opened successfully");
        resolve(self._db);
      };

      request.onerror = function (event) {
        console.error("IndexedDB: open error", event.target.error);
        reject(event.target.error);
      };
    });

```


## Assistant

Everything looks great. Here's a complete summary of what was done:

---

## Summary of Changes

### `scripts/database.js` — Full rewrite
- **IndexedDB** replaces `localStorage` as the storage backend. The database is opened once and cached in `_db`.
- **`DB_VERSION: 2`** triggers an `onupgradeneeded` that:
  - Creates the `persons` object store with `uuid` as the primary key and indexes on `standardizedName` and `modifiedAt`.
  - **Automatically migrates** any existing `localStorage` data: every legacy record gets a freshly generated UUID and a `modifiedAt` timestamp derived from its old `updatedAt`/`createdAt`.
- Every record now carries **`uuid`**, **`modifiedAt`** (+ `id` aliased to `uuid` for backwards compat).
- All public methods (`getAllPersons`, `addPerson`, `updatePerson`, `deletePerson`, `searchPersons`, `getStatistics`, `exportJSON`, `importJSON`) are now **async and return Promises**.
- New **`upsertPerson(person)`** method: inserts if UUID is unknown, updates only if the incoming `modifiedAt` is strictly newer than the stored one (used by GitHub pull).

### `scripts/github-sync.js` — Full rewrite
- **Per-record backup**: each person is stored as `<folder>/<uuid>.json` (default folder: `prosopography-records/`).
- **Push**: loads all local records, lists the remote folder, then for each record fetches the remote file, compares `modifiedAt` dates, and only uploads if the local copy is newer. Reports counts of uploaded vs skipped.
- **Pull**: lists all `.json` files in the remote folder, fetches each one, and calls `Database.upsertPerson()` — which skips records that aren't newer than what's already local. Reports new / updated / skipped counts.
- Settings field changed from `github-filepath` → `github-folder` (both in the JS config and in `localStorage`).

### `scripts/app.js` — Async update
- All `Database.*` calls are now awaited via `.then()` chains.
- `handleSavePerson`, `exportJSON`, `importJSON`, the name-suggestion autocomplete — all updated.

### `scripts/ui.js` — Async update
- `displayBrowseResults`, `displayStatistics`, `showPersonDetail` (split into `showPersonDetail` + `_renderPersonDetail`), `initNationalityAutocomplete`, `initReligionAutocomplete`, `initSourceAutocomplete` — all updated to use `.then()` on the async Database calls.

### `index.html`
- "File Path in Repository" input renamed to **"Records Folder in Repository"**, `id` changed from `github-filepath` to `github-folder`, default value updated to `prosopography-records`.
- Script `?v=` cache-busters bumped to **`v=11`**.

### `scripts/service-worker.js`
- Cache name bumped to **`livorno-prosopography-v2`** to ensure the old cached scripts are evicted when the app reloads.

## User (checkpoint)

on application launch check the GitHub data and import any records if needed. If there are local records that are not on github upload these. When there is a conflict, show the conflict to the user, displaying the fields with conflicting values.

## Assistant

Let me read the current state of the relevant files before making changes.

**Tool Call: Read file `scripts/github-sync.js`**
Status: Completed

```webapp-prosopography/scripts/github-sync.js
SUCCESS: File outline retrieved. This file is too large to read all at once, so the outline below shows the file's structure with line numbers.

IMPORTANT: Do NOT retry this call without line numbers - you will get the same outline.
Instead, use the line numbers below to read specific sections by calling this tool again with start_line and end_line parameters.

# File outline for /Users/lvansnippenburg/Documents/Ontwikkeling/webapp-prosopography/scripts/github-sync.js

config [L6-12]
 token [L7]
 owner [L8]
 repo [L9]
 folder [L10]
 branch [L11]
init [L16-20]
loadSettings [L24-39]
saveSettings [L41-61]
clearSettings [L63-82]
updateStatus [L86-114]
bindEvents [L118-132]
_contentsUrl [L137-146]
_authHeaders [L148-153]
 Authorization [L150]
 Accept [L151]
_getRemoteFile [L157-164]
 headers [L159]
_decode [L167-169]
_encode [L172-174]
_putFile [L178-198]
 message [L180]
 content [L181]
 branch [L182]
 method [L187]
 headers [L188]
  Content-Type [L188]
 body [L189]
_deleteFile [L201-218]
 message [L203]
 sha [L204]
 branch [L205]
 method [L208]
 headers [L209]
  Content-Type [L209]
 body [L210]
_listRemoteRecords [L223-239]
 headers [L225]
testConnection [L243-273]
 headers [L254]
pushToGitHub [L277-407]
 sha [L309]
 remoteFile [L309]
pullFromGitHub [L411-518]
viewHistory [L522-533]

Showing symbols 1-45 (total symbols: 45)


NEXT STEPS: To read a specific symbol's implementation, call read_file with the same path plus start_line and end_line from the outline above.
For example, to read a function shown as [L100-150], use start_line: 100 and end_line: 150.
```


**Tool Call: Read file `scripts/app.js` (lines 1-30)**
Status: Completed

```webapp-prosopography/scripts/app.js
// App Module - Main application logic and form handling
var App = {
  init: function () {
    this.bindEvents();
    UI.init();
    console.log("App initialized");
  },

  bindEvents: function () {
    // Search form
    document.getElementById("btn-search").addEventListener("click", function () {
      App.handleSearch();
    });

    document.getElementById("btn-clear").addEventListener("click", function () {
      document.getElementById("search-name").value = "";
      document.getElementById("search-place").value = "";
      document.getElementById("search-year").value = "";
      document.getElementById("phonetic-search").checked = false;
      document.getElementById("search-info").style.display = "none";
      document.getElementById("search-results").innerHTML = "";
    });

    // Person form submission
    document.getElementById("person-form").addEventListener("submit", function (e) {
      e.preventDefault();
      App.handleSavePerson();
    });

    // Sort change in browse view

```


**Tool Call: Read file `scripts/github-sync.js` (lines 1-280)**
Status: Completed

```webapp-prosopography/scripts/github-sync.js
// GitHub Sync Module - Per-record sync with GitHub repository
// Each person record is stored as records/<uuid>.json
// modifiedAt is compared to avoid unnecessary writes/overwrites

var GitHubSync = {
  config: {
    token: "",
    owner: "lvansnippenburg",
    repo: "JsonDataStorage",
    folder: "prosopography-records",
    branch: "main",
  },

  // ── Initialisation ─────────────────────────────────────────────────────────

  init: function () {
    this.loadSettings();
    this.updateStatus();
    this.bindEvents();
  },

  // ── Settings ───────────────────────────────────────────────────────────────

  loadSettings: function () {
    var token = localStorage.getItem("github_token");
    var folder = localStorage.getItem("github_folder");
    var branch = localStorage.getItem("github_branch");

    if (token) this.config.token = token;
    if (folder) this.config.folder = folder;
    if (branch) this.config.branch = branch;

    if (document.getElementById("github-token"))
      document.getElementById("github-token").value = token || "";
    if (document.getElementById("github-folder"))
      document.getElementById("github-folder").value = folder || this.config.folder;
    if (document.getElementById("github-branch"))
      document.getElementById("github-branch").value = branch || "main";
  },

  saveSettings: function () {
    var token = document.getElementById("github-token").value.trim();
    var folder = document.getElementById("github-folder").value.trim();
    var branch = document.getElementById("github-branch").value.trim();

    if (token) {
      localStorage.setItem("github_token", token);
      this.config.token = token;
    }
    if (folder) {
      localStorage.setItem("github_folder", folder);
      this.config.folder = folder;
    }
    if (branch) {
      localStorage.setItem("github_branch", branch);
      this.config.branch = branch;
    }

    this.updateStatus();
    alert("GitHub settings saved successfully");
  },

  clearSettings: function () {
    if (!confirm("Are you sure you want to clear GitHub settings?")) return;

    ["github_token", "github_folder", "github_branch"].forEach(function (k) {
      localStorage.removeItem(k);
    });

    this.config.token = "";
    this.config.folder = "prosopography-records";
    this.config.branch = "main";

    if (document.getElementById("github-token")) document.getElementById("github-token").value = "";
    if (document.getElementById("github-folder"))
      document.getElementById("github-folder").value = this.config.folder;
    if (document.getElementById("github-branch"))
      document.getElementById("github-branch").value = "main";

    this.updateStatus();
    alert("GitHub settings cleared");
  },

  // ── Status display ─────────────────────────────────────────────────────────

  updateStatus: function () {
    var statusEl = document.getElementById("github-status");
    var pushBtn = document.getElementById("btn-push-github");
    var pullBtn = document.getElementById("btn-pull-github");

    if (!statusEl) return;

    if (this.config.token) {
      statusEl.innerHTML =
        "&#10003; Connected to GitHub repository: <strong>" +
        this.config.owner +
        "/" +
        this.config.repo +
        "</strong><br>" +
        "Folder: <code>" +
        this.config.folder +
        "/</code> &nbsp;(branch: " +
        this.config.branch +
        ")";
      statusEl.className = "github-status connected";
      if (pushBtn) pushBtn.disabled = false;
      if (pullBtn) pullBtn.disabled = false;
    } else {
      statusEl.innerHTML = "&#10007; Not connected to GitHub. Please configure settings below.";
      statusEl.className = "github-status disconnected";
      if (pushBtn) pushBtn.disabled = true;
      if (pullBtn) pullBtn.disabled = true;
    }
  },

  // ── Event binding ──────────────────────────────────────────────────────────

  bindEvents: function () {
    var self = this;

    var bind = function (id, fn) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", fn.bind(self));
    };

    bind("btn-save-settings", self.saveSettings);
    bind("btn-clear-settings", self.clearSettings);
    bind("btn-test-connection", self.testConnection);
    bind("btn-push-github", self.pushToGitHub);
    bind("btn-pull-github", self.pullFromGitHub);
    bind("btn-view-history", self.viewHistory);
  },

  // ── GitHub API helpers ─────────────────────────────────────────────────────

  // Returns the base URL for the contents API for a given path inside the repo
  _contentsUrl: function (path) {
    return (
      "https://api.github.com/repos/" +
      this.config.owner +
      "/" +
      this.config.repo +
      "/contents/" +
      path
    );
  },

  _authHeaders: function () {
    return {
      Authorization: "token " + this.config.token,
      Accept: "application/vnd.github.v3+json",
    };
  },

  // Fetch a single file's metadata (sha + content).
  // Resolves with { sha, content } or null when the file does not exist.
  _getRemoteFile: function (filePath) {
    var url = this._contentsUrl(filePath) + "?ref=" + this.config.branch;
    return fetch(url, { headers: this._authHeaders() }).then(function (res) {
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("GET " + filePath + " failed: " + res.statusText);
      return res.json();
    });
  },

  // Decode a GitHub contents API response body to a string.
  _decode: function (data) {
    return decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
  },

  // Encode a string for the GitHub contents API.
  _encode: function (str) {
    return btoa(unescape(encodeURIComponent(str)));
  },

  // PUT (create or update) a single file.  sha is required for updates,
  // omitted (undefined/null) for new files.
  _putFile: function (filePath, content, message, sha) {
    var body = {
      message: message,
      content: this._encode(content),
      branch: this.config.branch,
    };
    if (sha) body.sha = sha;

    return fetch(this._contentsUrl(filePath), {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, this._authHeaders()),
      body: JSON.stringify(body),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (d) {
          throw new Error(d.message || "PUT failed for " + filePath);
        });
      }
      return res.json();
    });
  },

  // DELETE a single file.
  _deleteFile: function (filePath, sha, message) {
    var body = {
      message: message,
      sha: sha,
      branch: this.config.branch,
    };
    return fetch(this._contentsUrl(filePath), {
      method: "DELETE",
      headers: Object.assign({ "Content-Type": "application/json" }, this._authHeaders()),
      body: JSON.stringify(body),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (d) {
          throw new Error(d.message || "DELETE failed for " + filePath);
        });
      }
    });
  },

  // List all files inside the records folder.
  // Resolves with an array of { name, path, sha, download_url } objects,
  // or [] when the folder doesn't exist yet.
  _listRemoteRecords: function () {
    var url = this._contentsUrl(this.config.folder) + "?ref=" + this.config.branch;
    return fetch(url, { headers: this._authHeaders() })
      .then(function (res) {
        if (res.status === 404) return [];
        if (!res.ok) throw new Error("Could not list remote folder: " + res.statusText);
        return res.json();
      })
      .then(function (items) {
        // filter to .json files only
        return Array.isArray(items)
          ? items.filter(function (f) {
              return f.type === "file" && f.name.endsWith(".json");
            })
          : [];
      });
  },

  // ── Test connection ────────────────────────────────────────────────────────

  testConnection: function () {
    if (!this.config.token) {
      alert("Please enter a GitHub token first");
      return;
    }

    var statusEl = document.getElementById("connection-status");
    statusEl.innerHTML = '<div class="status-progress">Testing connection...</div>';
    statusEl.style.display = "block";

    fetch("https://api.github.com/repos/" + this.config.owner + "/" + this.config.repo, {
      headers: this._authHeaders(),
    })
      .then(function (res) {
        if (res.ok) {
          statusEl.innerHTML =
            '<div class="status-success">&#10003; Connection successful! Repository found.</div>';
        } else {
          statusEl.innerHTML =
            '<div class="status-error">&#10007; Connection failed: ' +
            res.status +
            " " +
            res.statusText +
            "</div>";
        }
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="status-error">&#10007; Connection error: ' + err.message + "</div>";
      });
  },

  // ── Push to GitHub ─────────────────────────────────────────────────────────

  pushToGitHub: function () {
    if (!this.config.token) {
      alert("Please configure GitHub settings first");
      return;

```


**Tool Call: Read file `scripts/github-sync.js` (lines 280-541)**
Status: Completed

```webapp-prosopography/scripts/github-sync.js
      return;
    }
    if (
      !confirm(
        "Push local database to GitHub?\nOnly records newer than the remote copy will be uploaded.",
      )
    )
      return;

    var self = this;
    var statusEl = document.getElementById("sync-status");
    statusEl.innerHTML = '<div class="sync-progress">Preparing push...</div>';
    statusEl.style.display = "block";

    // 1. Load all local records
    Database.getAllPersons()
      .then(function (localPersons) {
        if (localPersons.length === 0) {
          statusEl.innerHTML =
            '<div class="sync-success">Nothing to push (database is empty).</div>';
          return;
        }

        // 2. List remote files so we can get their SHAs
        return self._listRemoteRecords().then(function (remoteFiles) {
          // Build a map of uuid -> { sha, remoteModifiedAt }
          var remoteMap = {};
          remoteFiles.forEach(function (f) {
            var uuid = f.name.replace(/\.json$/, "");
            remoteMap[uuid] = { sha: f.sha, remoteFile: f };
          });

          // 3. For each local record, decide whether to upload
          var uploadCount = 0;
          var skipCount = 0;
          var total = localPersons.length;
          var done = 0;

          var updateProgress = function () {
            statusEl.innerHTML =
              '<div class="sync-progress">Pushing... ' +
              done +
              " / " +
              total +
              " &nbsp;(uploaded: " +
              uploadCount +
              ", skipped: " +
              skipCount +
              ")</div>";
          };
          updateProgress();

          // Process records sequentially to avoid rate-limit bursts
          var sequence = localPersons.reduce(function (chain, person) {
            return chain.then(function () {
              var uuid = person.uuid;
              if (!uuid) {
                // Skip legacy records without uuid (shouldn't happen after migration)
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              var filePath = self.config.folder + "/" + uuid + ".json";
              var localModified = person.modifiedAt ? new Date(person.modifiedAt) : new Date(0);
              var remote = remoteMap[uuid];

              // If no remote copy exists, upload unconditionally
              if (!remote) {
                var content = JSON.stringify(person, null, 2);
                var msg =
                  "Add record " + uuid + " (" + (person.standardizedName || "unknown") + ")";
                return self._putFile(filePath, content, msg, null).then(function () {
                  uploadCount++;
                  done++;
                  updateProgress();
                });
              }

              // Remote exists — fetch its modifiedAt before deciding
              return self._getRemoteFile(filePath).then(function (remoteData) {
                var remoteModified = new Date(0);
                if (remoteData) {
                  try {
                    var remoteJson = JSON.parse(self._decode(remoteData));
                    if (remoteJson.modifiedAt) remoteModified = new Date(remoteJson.modifiedAt);
                  } catch (e) {
                    /* ignore parse errors */
                  }
                }

                if (localModified <= remoteModified) {
                  // Remote is same age or newer — skip
                  skipCount++;
                  done++;
                  updateProgress();
                  return;
                }

                var content = JSON.stringify(person, null, 2);
                var msg =
                  "Update record " + uuid + " (" + (person.standardizedName || "unknown") + ")";
                return self._putFile(filePath, content, msg, remote.sha).then(function () {
                  uploadCount++;
                  done++;
                  updateProgress();
                });
              });
            });
          }, Promise.resolve());

          return sequence.then(function () {
            statusEl.innerHTML =
              '<div class="sync-success">&#10003; Push complete &mdash; ' +
              uploadCount +
              " record(s) uploaded, " +
              skipCount +
              " skipped.</div>";
          });
        });
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="sync-error">&#10007; Push failed: ' + err.message + "</div>";
        console.error("pushToGitHub error:", err);
      });
  },

  // ── Pull from GitHub ───────────────────────────────────────────────────────

  pullFromGitHub: function () {
    if (!this.config.token) {
      alert("Please configure GitHub settings first");
      return;
    }
    if (
      !confirm(
        "Pull records from GitHub?\nOnly records newer than your local copy will be imported.",
      )
    )
      return;

    var self = this;
    var statusEl = document.getElementById("sync-status");
    statusEl.innerHTML = '<div class="sync-progress">Listing remote records...</div>';
    statusEl.style.display = "block";

    self
      ._listRemoteRecords()
      .then(function (remoteFiles) {
        if (remoteFiles.length === 0) {
          statusEl.innerHTML =
            '<div class="sync-success">No remote records found in folder <code>' +
            self.config.folder +
            "/</code>.</div>";
          return;
        }

        var total = remoteFiles.length;
        var done = 0;
        var insertCount = 0;
        var updateCount = 0;
        var skipCount = 0;

        var updateProgress = function () {
          statusEl.innerHTML =
            '<div class="sync-progress">Pulling... ' +
            done +
            " / " +
            total +
            " &nbsp;(new: " +
            insertCount +
            ", updated: " +
            updateCount +
            ", skipped: " +
            skipCount +
            ")</div>";
        };
        updateProgress();

        var sequence = remoteFiles.reduce(function (chain, remoteFile) {
          return chain.then(function () {
            return self._getRemoteFile(remoteFile.path).then(function (data) {
              if (!data) {
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              var person;
              try {
                person = JSON.parse(self._decode(data));
              } catch (e) {
                console.warn("Could not parse remote file:", remoteFile.path, e);
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              if (!person.uuid) {
                person.uuid = remoteFile.name.replace(/\.json$/, "");
                person.id = person.uuid;
              }

              return Database.upsertPerson(person).then(function (result) {
                if (result === "inserted") insertCount++;
                else if (result === "updated") updateCount++;
                else skipCount++;
                done++;
                updateProgress();
              });
            });
          });
        }, Promise.resolve());

        return sequence.then(function () {
          statusEl.innerHTML =
            '<div class="sync-success">&#10003; Pull complete &mdash; ' +
            insertCount +
            " new, " +
            updateCount +
            " updated, " +
            skipCount +
            " skipped.</div>";

          // Refresh UI
          UI.displayStatistics();
          UI.displayBrowseResults();
        });
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="sync-error">&#10007; Pull failed: ' + err.message + "</div>";
        console.error("pullFromGitHub error:", err);
      });
  },

  // ── History ────────────────────────────────────────────────────────────────

  viewHistory: function () {
    var url =
      "https://github.com/" +
      this.config.owner +
      "/" +
      this.config.repo +
      "/commits/" +
      this.config.branch +
      "/" +
      this.config.folder;
    alert("Commit history viewer\n\nVisit the folder on GitHub:\n" + url);
  },
};

// Initialise when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  GitHubSync.init();
});

console.log("GitHub Sync module loaded (per-record IndexedDB edition)");

```


## Assistant

Now let me look at the index.html for the current modal and the styles to understand what UI patterns are already in use:

**Tool Call: Read file `styles.css`**
Status: Completed

```webapp-prosopography/styles.css
SUCCESS: File outline retrieved. This file is too large to read all at once, so the outline below shows the file's structure with line numbers.

IMPORTANT: Do NOT retry this call without line numbers - you will get the same outline.
Instead, use the line numbers below to read specific sections by calling this tool again with start_line and end_line parameters.

# File outline for /Users/lvansnippenburg/Documents/Ontwikkeling/webapp-prosopography/styles.css

* [L2-6]
body [L8-13]
.container [L15-20]
header [L23-29]
.header-content [L31-36]
.header-logo [L38-47]
header h1 [L49-56]
.hamburger-btn [L59-70]
.hamburger-btn:hover [L72-74]
.hamburger-line [L76-83]
.hamburger-btn.active .hamburger-line:nth-child(1) [L85-87]
.hamburger-btn.active .hamburger-line:nth-child(2) [L89-91]
.hamburger-btn.active .hamburger-line:nth-child(3) [L93-95]
nav.main-nav [L98-109]
nav.main-nav.open [L111-113]
.nav-btn [L115-126]
.nav-btn:hover [L128-131]
.nav-btn.active [L133-138]
main [L141-143]
.view [L145-147]
.view.active [L149-151]
h2 [L153-159]
.search-form [L162-171]
.search-form input[type="text"], .search-form input[type="number"] [L173-179]
.search-form .phonetic-option [L181-185]
.search-form .phonetic-option label [L187-194]
.search-form .phonetic-option input[type="checkbox"] [L196-199]
.search-form button [L201-210]
.search-form button:hover [L212-214]
#btn-clear [L216-218]
#btn-clear:hover [L220-222]
.search-info [L225-231]
.search-info p [L233-236]
#search-results, #browse-results [L239-242]
.person-card [L244-251]
.person-card:hover [L253-257]
.person-card h3 [L259-266]
.badge [L268-275]
.nationality-badge [L277-281]
.gender-badge [L283-290]
.gender-badge.gender-male [L292-294]
.gender-badge.gender-female [L296-298]
.gender-badge.gender-unknown [L300-302]
.person-card .dates [L304-308]
.person-card .variants [L310-314]
.person-card .attestations-count [L316-320]
fieldset [L323-329]
legend [L331-335]
label [L337-342]
input[type="text"], input[type="number"], input[type="password"], select, textarea [L345-362]
select [L365-372]
input[type="text"]:focus, input[type="number"]:focus, input[type="password"]:focus, select:focus, textarea:focus [L375-383]
input[type="text"]:hover, input[type="number"]:hover, input[type="password"]:hover, select:hover, textarea:hover [L386-392]
input[type="checkbox"] [L394-397]
textarea [L399-401]
small [L403-408]
.form-row [L411-415]
.source-fields [L418-425]
.source-fields label [L427-429]
.source-doc-input [L431-433]
.autocomplete-wrapper [L436-438]
.autocomplete-dropdown [L440-454]
.autocomplete-item [L456-461]
.autocomplete-item:hover [L463-465]
.autocomplete-item:active [L467-469]
.name-input-wrapper [L472-474]
.suggestions-panel [L476-490]
.suggestions-header [L492-498]
.suggestions-list [L500-502]
.suggestion-item [L504-510]
.suggestion-main [L512-517]
.suggestion-main strong [L519-522]
.gender-indicator [L524-527]
.phonetic-badge [L529-536]
.suggestion-details [L538-542]
.suggestion-variants [L544-549]
.suggestion-actions [L551-554]
.btn-view-suggestion, .btn-load-suggestion [L556-564]
.btn-view-suggestion [L566-569]
.btn-view-suggestion:hover [L571-573]
.btn-load-suggestion [L575-578]
.btn-load-suggestion:hover [L580-582]
.life-event [L584-590]
.life-event h4 [L592-595]
.life-event label [L597-601]
.life-event input[type="number"] [L603-605]
.life-event select [L607-609]
.variant-item, .attestation-item, .relationship-item [L612-621]
.remove-btn [L623-636]
.remove-btn:hover [L638-640]
button[type="button"] [L642-651]
button[type="button"]:hover [L653-655]
.form-actions [L658-662]
.form-actions button [L664-671]
button[type="submit"] [L673-676]
button[type="submit"]:hover [L678-680]
#btn-cancel [L682-685]
#btn-cancel:hover [L687-689]
.modal [L692-702]
.modal.active [L704-706]
.modal-content [L708-719]
.close [L721-728]
.close:hover [L730-732]
.modal-actions [L734-738]
.modal-actions button [L740-746]
#btn-edit-person [L748-751]
#btn-edit-person:hover [L753-755]
#btn-delete-person [L757-760]
#btn-delete-person:hover [L762-764]
#detail-content h3 [L767-774]
#detail-content .detail-basic-info [L776-778]
#detail-content .detail-basic-info p [L780-783]
#detail-content .detail-section [L785-787]
#detail-content .variant-list, #detail-content .attestation-list, #detail-content .relationship-list [L789-794]
#detail-content li [L796-802]
#detail-content .source-ref [L804-808]
.browse-controls [L811-813]
.browse-controls select [L815-817]
.export-section, .import-section, .stats-section, .settings-section [L820-829]
.export-section h3, .import-section h3, .stats-section h3, .settings-section h3 [L831-837]
.export-section h4, .settings-section h4 [L839-845]
#github-status [L848-853]
#github-status a [L855-858]
.github-status.connected [L860-864]
.github-status.disconnected [L866-870]
.github-actions [L872-877]
.sync-status [L879-884]
.sync-progress [L886-891]
.sync-success [L893-898]
.sync-error [L900-905]
.history-modal-content h3 [L908-910]
.commit-list [L912-915]
.commit-item [L917-923]
.commit-header [L925-930]
.commit-sha [L932-939]
.commit-meta [L941-945]
.commit-link [L947-951]
.commit-link:hover [L953-955]
.github-setup ol [L958-961]
.github-setup ol li [L963-965]
.settings-form [L967-971]
.settings-actions [L973-978]
.btn-danger [L980-982]
.btn-danger:hover [L984-986]
.connection-status [L988-991]
.status-progress [L993-998]
.status-success [L1000-1005]
.status-error [L1007-1012]
#btn-export-json, #btn-import-json, #btn-push-github, #btn-pull-github, #btn-view-history, #btn-save-settings, #btn-test-connection, #btn-clear-settings [L1014-1030]
#btn-export-json:hover, #btn-import-json:hover, #btn-push-github:hover, #btn-pull-github:hover, #btn-view-history:hover, #btn-save-settings:hover, #btn-test-connection:hover [L1032-1040]
#btn-push-github:disabled, #btn-pull-github:disabled [L1042-1046]
#btn-view-history [L1048-1050]
#btn-view-history:hover [L1052-1054]
#import-file [L1056-1060]
#stats-display [L1062-1067]
.stat-card [L1069-1076]
.stat-card .number [L1078-1082]
.stat-card .label [L1084-1087]
@media (max-width: 768px) [L1090-1141]
 .header-logo [L1091-1093]
 header h1 [L1095-1097]
 .search-form [L1099-1101]
 .search-form .phonetic-option [L1103-1105]
 .form-row [L1107-1109]
 .source-fields [L1111-1113]
 .life-event label [L1115-1118]
 .life-event input[type="number"], .life-event select [L1120-1123]
 .suggestion-actions, .github-actions, .settings-actions [L1125-1129]
 .btn-view-suggestion, .btn-load-suggestion [L1131-1134]
 #btn-push-github, #btn-pull-github, #btn-view-history [L1136-1140]
.text-muted [L1144-1146]
.text-primary [L1148-1150]
.text-danger [L1152-1154]
.mb-1 [L1156-1158]
.mb-2 [L1160-1162]
.mt-1 [L1164-1166]
.mt-2 [L1168-1170]

Showing symbols 1-177 (total symbols: 177)


NEXT STEPS: To read a specific symbol's implementation, call read_file with the same path plus start_line and end_line from the outline above.
For example, to read a function shown as [L100-150], use start_line: 100 and end_line: 150.
```


**Tool Call: Read file `styles.css` (lines 692-770)**
Status: Completed

```webapp-prosopography/styles.css
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5);
}

.modal.active {
    display: block;
}

.modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 900px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    border-top: 4px solid #C41E3A;
}

.close {
    color: #aaa;
    float: right;
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
}

.close:hover {
    color: #C41E3A;
}

.modal-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
}

.modal-actions button {
    padding: 0.6rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95rem;
}

#btn-edit-person {
    background: #C41E3A;
    color: white;
}

#btn-edit-person:hover {
    background: #9B1B2E;
}

#btn-delete-person {
    background: #e74c3c;
    color: white;
}

#btn-delete-person:hover {
    background: #c0392b;
}

/* Detail View Styles */
#detail-content h3 {
    color: #8B0000;
    margin-top: 1.5rem;
    margin-bottom: 0.8rem;

```


**Tool Call: Read file `index.html` (lines 325-370)**
Status: Completed

```webapp-prosopography/index.html
                                    <a
                                        href="https://github.com/settings/tokens?type=beta"
                                        target="_blank"
                                        >GitHub Settings → Tokens (Fine-grained)</a
                                    >
                                </li>
                                <li>Click "Generate new token"</li>
                                <li>Give it a name like "Prosopography Database"</li>
                                <li>Set expiration (recommend 90 days or 1 year)</li>
                                <li>
                                    Under "Repository access", select "Only select repositories"
                                </li>
                                <li>Choose: <strong>lvansnippenburg/JsonDataStorage</strong></li>
                                <li>
                                    Under "Repository permissions", set <strong>Contents</strong> to
                                    "Read and write"
                                </li>
                                <li>Click "Generate token" and copy it</li>
                            </ol>

                            <h4>Step 2: Configure Connection</h4>
                            <div class="settings-form">
                                <label>
                                    GitHub Personal Access Token:
                                    <input
                                        type="password"
                                        id="github-token"
                                        placeholder="ghp_xxxxxxxxxxxx"
                                    />
                                    <small
                                        >This token is stored only on your device
                                        (localStorage)</small
                                    >
                                </label>

                                <label>
                                    Records Folder in Repository:
                                    <input
                                        type="text"
                                        id="github-folder"
                                        value="prosopography-records"
                                    />
                                    <small
                                        >Folder where individual record files (one per person) are
                                        stored</small
                                    >

```


## Assistant

Now I have a thorough picture of the whole codebase. Here's the plan:

1. **`github-sync.js`** — Add `autoSync()` method that:
   - Fetches the remote record list
   - For each remote record not local → insert; for each local not on remote → upload; for conflicts (both modified, dates differ) → collect and show the conflict UI
   - Returns a summary
2. **Conflict UI** — A dedicated conflict resolution modal (separate from the detail modal) that renders two side-by-side panels for conflicting fields, with "Keep Local" / "Keep Remote" / "Merge (keep both)" per conflict and a final "Apply" button
3. **`index.html`** — Add the conflict modal markup + a launch-sync status banner
4. **`styles.css`** — Add styles for the conflict modal and launch-sync banner
5. **`app.js`** — Call `GitHubSync.autoSync()` at startup after `UI.init()`

**Tool Call: Read file `scripts/database.js` (lines 100-170)**
Status: Completed

```webapp-prosopography/scripts/database.js
        var store = tx.objectStore("persons");
        var req = cb(store);
        if (req) {
          req.onsuccess = function () {
            resolve(req.result);
          };
          req.onerror = function () {
            reject(req.error);
          };
        } else {
          tx.oncomplete = function () {
            resolve();
          };
          tx.onerror = function () {
            reject(tx.error);
          };
        }
      });
    });
  },

  // Convenience: run a callback inside a readonly transaction.
  _txRead: function (cb) {
    return this.open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(["persons"], "readonly");
        var store = tx.objectStore("persons");
        var req = cb(store);
        req.onsuccess = function () {
          resolve(req.result);
        };
        req.onerror = function () {
          reject(req.error);
        };
      });
    });
  },

  // ── CRUD ──────────────────────────────────────────────────────────────────

  // Returns Promise<Person[]>
  getAllPersons: function () {
    return this._txRead(function (store) {
      return store.getAll();
    });
  },

  // Returns Promise<Person|undefined>
  getPersonByUUID: function (uuid) {
    return this._txRead(function (store) {
      return store.get(uuid);
    });
  },

  // Legacy alias used in older call-sites (id used to be a 'p'+timestamp string)
  // Now id === uuid.  Returns Promise<Person|undefined>
  getPersonById: function (id) {
    return this.getPersonByUUID(id);
  },

  // Returns Promise<string> — the new uuid
  addPerson: function (person) {
    var self = this;
    var now = new Date().toISOString();
    person.uuid = this.generateUUID();
    person.id = person.uuid; // keep id === uuid for compatibility
    person.createdAt = now;
    person.modifiedAt = now;
    // legacy field
    person.updatedAt = now;


```


## Assistant

Now I have everything I need. Let me implement all the changes:

**Tool Call: scripts/github-sync.js**
Status: Completed

Diff: scripts/github-sync.js
```
// GitHub Sync Module - Per-record sync with GitHub repository
// Each person record is stored as records/<uuid>.json
// modifiedAt is compared to avoid unnecessary writes/overwrites

var GitHubSync = {
  config: {
    token: "",
    owner: "lvansnippenburg",
    repo: "JsonDataStorage",
    folder: "prosopography-records",
    branch: "main",
  },

  // ── Initialisation ─────────────────────────────────────────────────────────

  init: function () {
    this.loadSettings();
    this.updateStatus();
    this.bindEvents();
  },

  // ── Settings ───────────────────────────────────────────────────────────────

  loadSettings: function () {
    var token = localStorage.getItem("github_token");
    var folder = localStorage.getItem("github_folder");
    var branch = localStorage.getItem("github_branch");

    if (token) this.config.token = token;
    if (folder) this.config.folder = folder;
    if (branch) this.config.branch = branch;

    if (document.getElementById("github-token"))
      document.getElementById("github-token").value = token || "";
    if (document.getElementById("github-folder"))
      document.getElementById("github-folder").value = folder || this.config.folder;
    if (document.getElementById("github-branch"))
      document.getElementById("github-branch").value = branch || "main";
  },

  saveSettings: function () {
    var token = document.getElementById("github-token").value.trim();
    var folder = document.getElementById("github-folder").value.trim();
    var branch = document.getElementById("github-branch").value.trim();

    if (token) {
      localStorage.setItem("github_token", token);
      this.config.token = token;
    }
    if (folder) {
      localStorage.setItem("github_folder", folder);
      this.config.folder = folder;
    }
    if (branch) {
      localStorage.setItem("github_branch", branch);
      this.config.branch = branch;
    }

    this.updateStatus();
    alert("GitHub settings saved successfully");
  },

  clearSettings: function () {
    if (!confirm("Are you sure you want to clear GitHub settings?")) return;

    ["github_token", "github_folder", "github_branch"].forEach(function (k) {
      localStorage.removeItem(k);
    });

    this.config.token = "";
    this.config.folder = "prosopography-records";
    this.config.branch = "main";

    if (document.getElementById("github-token")) document.getElementById("github-token").value = "";
    if (document.getElementById("github-folder"))
      document.getElementById("github-folder").value = this.config.folder;
    if (document.getElementById("github-branch"))
      document.getElementById("github-branch").value = "main";

    this.updateStatus();
    alert("GitHub settings cleared");
  },

  // ── Status display ─────────────────────────────────────────────────────────

  updateStatus: function () {
    var statusEl = document.getElementById("github-status");
    var pushBtn = document.getElementById("btn-push-github");
    var pullBtn = document.getElementById("btn-pull-github");

    if (!statusEl) return;

    if (this.config.token) {
      statusEl.innerHTML =
        "&#10003; Connected to GitHub repository: <strong>" +
        this.config.owner +
        "/" +
        this.config.repo +
        "</strong><br>" +
        "Folder: <code>" +
        this.config.folder +
        "/</code> &nbsp;(branch: " +
        this.config.branch +
        ")";
      statusEl.className = "github-status connected";
      if (pushBtn) pushBtn.disabled = false;
      if (pullBtn) pullBtn.disabled = false;
    } else {
      statusEl.innerHTML = "&#10007; Not connected to GitHub. Please configure settings below.";
      statusEl.className = "github-status disconnected";
      if (pushBtn) pushBtn.disabled = true;
      if (pullBtn) pullBtn.disabled = true;
    }
  },

  // ── Event binding ──────────────────────────────────────────────────────────

  bindEvents: function () {
    var self = this;

    var bind = function (id, fn) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", fn.bind(self));
    };

    bind("btn-save-settings", self.saveSettings);
    bind("btn-clear-settings", self.clearSettings);
    bind("btn-test-connection", self.testConnection);
    bind("btn-push-github", self.pushToGitHub);
    bind("btn-pull-github", self.pullFromGitHub);
    bind("btn-view-history", self.viewHistory);
  },

  // ── GitHub API helpers ─────────────────────────────────────────────────────

  _contentsUrl: function (path) {
    return (
      "https://api.github.com/repos/" +
      this.config.owner +
      "/" +
      this.config.repo +
      "/contents/" +
      path
    );
  },

  _authHeaders: function () {
    return {
      Authorization: "token " + this.config.token,
      Accept: "application/vnd.github.v3+json",
    };
  },

  // Fetch a single file's metadata (sha + content).
  // Resolves with GitHub API object or null when the file does not exist.
  _getRemoteFile: function (filePath) {
    var url = this._contentsUrl(filePath) + "?ref=" + this.config.branch;
    return fetch(url, { headers: this._authHeaders() }).then(function (res) {
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("GET " + filePath + " failed: " + res.statusText);
      return res.json();
    });
  },

  // Decode a GitHub contents API response body to a string.
  _decode: function (data) {
    return decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
  },

  // Encode a string for the GitHub contents API.
  _encode: function (str) {
    return btoa(unescape(encodeURIComponent(str)));
  },

  // PUT (create or update) a single file. sha required for updates.
  _putFile: function (filePath, content, message, sha) {
    var body = {
      message: message,
      content: this._encode(content),
      branch: this.config.branch,
    };
    if (sha) body.sha = sha;

    return fetch(this._contentsUrl(filePath), {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, this._authHeaders()),
      body: JSON.stringify(body),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (d) {
          throw new Error(d.message || "PUT failed for " + filePath);
        });
      }
      return res.json();
    });
  },

  // DELETE a single file.
  _deleteFile: function (filePath, sha, message) {
    var body = { message: message, sha: sha, branch: this.config.branch };
    return fetch(this._contentsUrl(filePath), {
      method: "DELETE",
      headers: Object.assign({ "Content-Type": "application/json" }, this._authHeaders()),
      body: JSON.stringify(body),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (d) {
          throw new Error(d.message || "DELETE failed for " + filePath);
        });
      }
    });
  },

  // List all .json files inside the records folder.
  // Resolves with array of GitHub file objects, or [] when folder missing.
  _listRemoteRecords: function () {
    var url = this._contentsUrl(this.config.folder) + "?ref=" + this.config.branch;
    return fetch(url, { headers: this._authHeaders() })
      .then(function (res) {
        if (res.status === 404) return [];
        if (!res.ok) throw new Error("Could not list remote folder: " + res.statusText);
        return res.json();
      })
      .then(function (items) {
        return Array.isArray(items)
          ? items.filter(function (f) {
              return f.type === "file" && f.name.endsWith(".json");
            })
          : [];
      });
  },

  // ── Test connection ────────────────────────────────────────────────────────

  testConnection: function () {
    if (!this.config.token) {
      alert("Please enter a GitHub token first");
      return;
    }

    var statusEl = document.getElementById("connection-status");
    statusEl.innerHTML = '<div class="status-progress">Testing connection...</div>';
    statusEl.style.display = "block";

    fetch("https://api.github.com/repos/" + this.config.owner + "/" + this.config.repo, {
      headers: this._authHeaders(),
    })
      .then(function (res) {
        if (res.ok) {
          statusEl.innerHTML =
            '<div class="status-success">&#10003; Connection successful! Repository found.</div>';
        } else {
          statusEl.innerHTML =
            '<div class="status-error">&#10007; Connection failed: ' +
            res.status +
            " " +
            res.statusText +
            "</div>";
        }
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="status-error">&#10007; Connection error: ' + err.message + "</div>";
      });
  },

  // ── Auto-sync on launch ────────────────────────────────────────────────────

  // Called once at app start. Silently syncs with GitHub if a token is configured.
  // Workflow:
  //   1. List remote records
  //   2. For each remote UUID:
  //        - not local  → insert
  //        - local & remote same date → skip
  //        - local newer → queue for upload
  //        - remote newer → update local
  //        - both modified, timestamps differ in both directions → conflict
  //   3. For each local UUID not in remote → upload
  //   4. If conflicts remain → show conflict resolution modal
  autoSync: function () {
    if (!this.config.token) return; // silently skip if not configured

    var self = this;
    var banner = document.getElementById("autosync-banner");
    var bannerMsg = document.getElementById("autosync-msg");

    function showBanner(msg, type) {
      if (!banner) return;
      bannerMsg.textContent = msg;
      banner.className = "autosync-banner autosync-" + type;
      banner.style.display = "flex";
      if (type === "success" || type === "info") {
        setTimeout(function () {
          banner.style.display = "none";
        }, 5000);
      }
    }

    showBanner("Syncing with GitHub…", "progress");

    // Step 1 – fetch all remote records in parallel with local records
    Promise.all([Database.getAllPersons(), self._listRemoteRecords()])
      .then(function (results) {
        var localPersons = results[0];
        var remoteFiles = results[1];

        // Build lookup maps
        var localByUUID = {};
        localPersons.forEach(function (p) {
          if (p.uuid) localByUUID[p.uuid] = p;
        });

        var remoteByUUID = {};
        remoteFiles.forEach(function (f) {
          var uuid = f.name.replace(/\.json$/, "");
          remoteByUUID[uuid] = f;
        });

        // Fetch remote content for every UUID that exists remotely
        // (we need the actual record to compare dates / detect conflicts)
        var remoteUUIDs = Object.keys(remoteByUUID);
        var fetchRemoteContents = remoteUUIDs.map(function (uuid) {
          return self
            ._getRemoteFile(self.config.folder + "/" + uuid + ".json")
            .then(function (data) {
              if (!data) return null;
              try {
                var person = JSON.parse(self._decode(data));
                person._remoteFileSha = data.sha; // stash SHA for later PUT
                return person;
              } catch (e) {
                return null;
              }
            });
        });

        return Promise.all(fetchRemoteContents).then(function (remotePersons) {
          // Build uuid → remotePersonRecord map
          var remoteRecordByUUID = {};
          remotePersons.forEach(function (p) {
            if (p && p.uuid) remoteRecordByUUID[p.uuid] = p;
          });

          var toUpload = []; // { person, sha|null }  local → remote
          var conflicts = []; // { local, remote }
          var summary = { inserted: 0, updated: 0, uploaded: 0, skipped: 0, conflicts: 0 };

          // --- Evaluate remote records ---
          var applyRemote = remoteUUIDs.reduce(function (chain, uuid) {
            return chain.then(function () {
              var remote = remoteRecordByUUID[uuid];
              if (!remote) return; // fetch failed, skip

              var local = localByUUID[uuid];

              if (!local) {
                // Remote only → insert locally
                return Database.upsertPerson(remote).then(function () {
                  summary.inserted++;
                });
              }

              var localDate = local.modifiedAt ? new Date(local.modifiedAt) : new Date(0);
              var remoteDate = remote.modifiedAt ? new Date(remote.modifiedAt) : new Date(0);

              if (localDate.getTime() === remoteDate.getTime()) {
                summary.skipped++;
                return; // identical, nothing to do
              }

              if (remoteDate > localDate) {
                // Remote is simply newer → update local
                return Database.upsertPerson(remote).then(function () {
                  summary.updated++;
                });
              }

              // localDate > remoteDate → local is newer; but we need to check
              // whether the remote was independently edited (true conflict) or
              // was just never pushed (local-only edit).
              // We detect a true conflict by checking whether remote.modifiedAt
              // differs from the last known-pushed timestamp stored locally.
              // As a pragmatic heuristic: if the remote record exists and its
              // modifiedAt is more recent than local.createdAt, it was edited
              // on the remote side too → conflict.
              var localCreated = local.createdAt ? new Date(local.createdAt) : new Date(0);
              if (remoteDate > localCreated) {
                // Both sides have been edited after the record was first created → conflict
                conflicts.push({ local: local, remote: remote });
                summary.conflicts++;
              } else {
                // Remote is just the original unedited version → safe to overwrite
                toUpload.push({
                  person: local,
                  sha: remote._remoteFileSha || null,
                  filePath: self.config.folder + "/" + uuid + ".json",
                });
              }
            });
          }, Promise.resolve());

          return applyRemote.then(function () {
            // --- Local-only records (not on remote) → upload ---
            localPersons.forEach(function (local) {
              if (!local.uuid) return;
              if (!remoteRecordByUUID[local.uuid]) {
                toUpload.push({
                  person: local,
                  sha: null,
                  filePath: self.config.folder + "/" + local.uuid + ".json",
                });
              }
            });

            // Upload all queued records sequentially
            var uploadChain = toUpload.reduce(function (chain, item) {
              return chain.then(function () {
                var content = JSON.stringify(item.person, null, 2);
                var msg =
                  (item.sha ? "Update" : "Add") +
                  " record " +
                  item.person.uuid +
                  " (" +
                  (item.person.standardizedName || "unknown") +
                  ")";
                return self
                  ._putFile(item.filePath, content, msg, item.sha)
                  .then(function () {
                    summary.uploaded++;
                  })
                  .catch(function (err) {
                    console.warn("autoSync: failed to upload " + item.person.uuid, err);
                  });
              });
            }, Promise.resolve());

            return uploadChain.then(function () {
              // Refresh UI counts
              UI.displayStatistics();
              UI.displayBrowseResults();

              if (conflicts.length > 0) {
                showBanner(conflicts.length + " conflict(s) need your attention.", "conflict");
                self._showConflictModal(conflicts);
              } else {
                var parts = [];
                if (summary.inserted) parts.push(summary.inserted + " imported");
                if (summary.updated) parts.push(summary.updated + " updated");
                if (summary.uploaded) parts.push(summary.uploaded + " uploaded");
                if (summary.skipped) parts.push(summary.skipped + " unchanged");
                var msg = parts.length
                  ? "GitHub sync: " + parts.join(", ") + "."
                  : "GitHub sync: already up to date.";
                showBanner(msg, "success");
              }
            });
          });
        });
      })
      .catch(function (err) {
        console.warn("autoSync failed:", err);
        showBanner("GitHub sync failed: " + err.message, "error");
      });
  },

  // ── Conflict resolution modal ──────────────────────────────────────────────

  // Scalar fields that are worth comparing individually.
  _COMPARABLE_FIELDS: [
    { key: "standardizedName", label: "Standardized Name" },
    { key: "nationality", label: "Nationality" },
    { key: "gender", label: "Gender" },
    { key: "religion", label: "Religion" },
    { key: "religionCertainty", label: "Religion Certainty" },
    { key: "biography", label: "Biography / Notes" },
    { key: "modifiedAt", label: "Last Modified" },
  ],

  _showConflictModal: function (conflicts) {
    var self = this;
    var modal = document.getElementById("conflict-modal");
    var body = document.getElementById("conflict-modal-body");
    if (!modal || !body) return;

    // Store pending resolutions: array parallel to conflicts[]
    // Each entry: { choice: 'local'|'remote'|null }
    var resolutions = conflicts.map(function () {
      return { choice: null };
    });

    function renderAll() {
      body.innerHTML = "";

      conflicts.forEach(function (pair, idx) {
        var local = pair.local;
        var remote = pair.remote;
        var res = resolutions[idx];

        var section = document.createElement("div");
        section.className = "conflict-item" + (res.choice ? " conflict-resolved" : "");

        // ── Header ──
        var header = document.createElement("div");
        header.className = "conflict-header";
        header.innerHTML =
          "<strong>" +
          (local.standardizedName || remote.standardizedName || "Unknown") +
          "</strong>" +
          '<span class="conflict-uuid">UUID: ' +
          (local.uuid || "") +
          "</span>";
        section.appendChild(header);

        if (res.choice) {
          var badge = document.createElement("div");
          badge.className = "conflict-resolved-badge";
          badge.textContent =
            res.choice === "local" ? "✓ Keeping local version" : "✓ Keeping remote version";
          section.appendChild(badge);

          var undoBtn = document.createElement("button");
          undoBtn.className = "conflict-undo-btn";
          undoBtn.textContent = "Undo";
          undoBtn.addEventListener("click", function () {
            resolutions[idx].choice = null;
            renderAll();
          });
          section.appendChild(undoBtn);
          body.appendChild(section);
          return;
        }

        // ── Timestamps ──
        var tsRow = document.createElement("div");
        tsRow.className = "conflict-timestamps";
        tsRow.innerHTML =
          "<span><strong>Local modified:</strong> " +
          self._fmtDate(local.modifiedAt) +
          "</span>" +
          "<span><strong>Remote modified:</strong> " +
          self._fmtDate(remote.modifiedAt) +
          "</span>";
        section.appendChild(tsRow);

        // ── Differing fields table ──
        var diffingFields = self._COMPARABLE_FIELDS.filter(function (f) {
          return String(local[f.key] || "") !== String(remote[f.key] || "");
        });

        // Also flag complex fields that differ
        var complexDiffs = [];
        ["nameVariants", "attestations", "relationships", "occupations", "lifeEvents"].forEach(
          function (key) {
            var lv = JSON.stringify(local[key] || null);
            var rv = JSON.stringify(remote[key] || null);
            if (lv !== rv) complexDiffs.push(key);
          },
        );

        if (diffingFields.length === 0 && complexDiffs.length === 0) {
          var noDiff = document.createElement("p");
          noDiff.className = "conflict-no-scalar-diff";
          noDiff.textContent = "No scalar field differences detected (complex fields may differ).";
          section.appendChild(noDiff);
        } else {
          var table = document.createElement("table");
          table.className = "conflict-table";
          table.innerHTML =
            "<thead><tr>" +
            "<th>Field</th>" +
            "<th>Local value</th>" +
            "<th>Remote value</th>" +
            "</tr></thead>";
          var tbody = document.createElement("tbody");

          diffingFields.forEach(function (f) {
            var tr = document.createElement("tr");
            tr.innerHTML =
              "<td class='conflict-field-name'>" +
              f.label +
              "</td>" +
              "<td class='conflict-local'>" +
              self._safeHtml(String(local[f.key] || "—")) +
              "</td>" +
              "<td class='conflict-remote'>" +
              self._safeHtml(String(remote[f.key] || "—")) +
              "</td>";
            tbody.appendChild(tr);
          });

          if (complexDiffs.length > 0) {
            var labels = {
              nameVariants: "Name Variants",
              attestations: "Attestations",
              relationships: "Relationships",
              occupations: "Occupations",
              lifeEvents: "Life Events",
            };
            complexDiffs.forEach(function (key) {
              var tr = document.createElement("tr");
              var lCount = self._complexCount(local[key]);
              var rCount = self._complexCount(remote[key]);
              tr.innerHTML =
                "<td class='conflict-field-name'>" +
                (labels[key] || key) +
                "</td>" +
                "<td class='conflict-local conflict-complex'>" +
                lCount +
                "</td>" +
                "<td class='conflict-remote conflict-complex'>" +
                rCount +
                "</td>";
              tbody.appendChild(tr);
            });
          }

          table.appendChild(tbody);
          section.appendChild(table);
        }

        // ── Choice buttons ──
        var actions = document.createElement("div");
        actions.className = "conflict-actions";

        var keepLocalBtn = document.createElement("button");
        keepLocalBtn.className = "conflict-btn conflict-btn-local";
        keepLocalBtn.innerHTML = "&#8592; Keep Local";
        keepLocalBtn.title = "Keep the locally-modified version and overwrite GitHub";
        keepLocalBtn.addEventListener("click", function () {
          resolutions[idx].choice = "local";
          renderAll();
          updateApplyBtn();
        });

        var keepRemoteBtn = document.createElement("button");
        keepRemoteBtn.className = "conflict-btn conflict-btn-remote";
        keepRemoteBtn.innerHTML = "Keep Remote &#8594;";
        keepRemoteBtn.title = "Accept the GitHub version and overwrite local";
        keepRemoteBtn.addEventListener("click", function () {
          resolutions[idx].choice = "remote";
          renderAll();
          updateApplyBtn();
        });

        actions.appendChild(keepLocalBtn);
        actions.appendChild(keepRemoteBtn);
        section.appendChild(actions);
        body.appendChild(section);
      });
    }

    var applyBtn = document.getElementById("conflict-apply-btn");
    var skipBtn = document.getElementById("conflict-skip-btn");

    function updateApplyBtn() {
      if (!applyBtn) return;
      var allResolved = resolutions.every(function (r) {
        return r.choice !== null;
      });
      applyBtn.disabled = !allResolved;
      applyBtn.title = allResolved ? "Apply all resolutions" : "Resolve all conflicts first";
    }

    renderAll();
    updateApplyBtn();
    modal.classList.add("active");

    // ── Apply button ──
    if (applyBtn) {
      // Remove stale listener
      var newApply = applyBtn.cloneNode(true);
      applyBtn.parentNode.replaceChild(newApply, applyBtn);

      newApply.addEventListener("click", function () {
        newApply.disabled = true;
        newApply.textContent = "Applying…";

        var chain = conflicts.reduce(function (p, pair, idx) {
          return p.then(function () {
            var choice = resolutions[idx].choice;
            if (!choice) return;

            if (choice === "remote") {
              // Overwrite local with remote version
              return Database.upsertPerson(
                Object.assign({}, pair.remote, { modifiedAt: pair.remote.modifiedAt }),
              ).then(function () {
                // Force-update by bumping modifiedAt to remote's value
                // upsertPerson already handles this if remote is "newer"
              });
            } else {
              // choice === "local" → push local to GitHub
              var filePath = self.config.folder + "/" + pair.local.uuid + ".json";
              var content = JSON.stringify(pair.local, null, 2);
              var sha = pair.remote._remoteFileSha || null;
              var msg =
                "Resolve conflict: keep local for " +
                pair.local.uuid +
                " (" +
                (pair.local.standardizedName || "unknown") +
                ")";
              return self._putFile(filePath, content, msg, sha).catch(function (err) {
                console.warn("Failed to push local resolution for " + pair.local.uuid, err);
              });
            }
          });
        }, Promise.resolve());

        chain.then(function () {
          modal.classList.remove("active");
          UI.displayStatistics();
          UI.displayBrowseResults();

          var banner = document.getElementById("autosync-banner");
          var bannerMsg = document.getElementById("autosync-msg");
          if (banner && bannerMsg) {
            bannerMsg.textContent = "All conflicts resolved.";
            banner.className = "autosync-banner autosync-success";
            banner.style.display = "flex";
            setTimeout(function () {
              banner.style.display = "none";
            }, 4000);
          }
        });
      });
    }

    // ── Skip button ──
    if (skipBtn) {
      var newSkip = skipBtn.cloneNode(true);
      skipBtn.parentNode.replaceChild(newSkip, skipBtn);

      newSkip.addEventListener("click", function () {
        modal.classList.remove("active");
      });
    }

    // Close on backdrop click
    modal.onclick = function (e) {
      if (e.target === modal) modal.classList.remove("active");
    };
  },

  // ── Conflict helpers ───────────────────────────────────────────────────────

  _fmtDate: function (iso) {
    if (!iso) return "unknown";
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso;
    }
  },

  _safeHtml: function (str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  _complexCount: function (val) {
    if (!val) return "—";
    if (Array.isArray(val)) return val.length + " item(s)";
    if (typeof val === "object") {
      var keys = Object.keys(val).filter(function (k) {
        return val[k];
      });
      return keys.length + " field(s)";
    }
    return String(val);
  },

  // ── Push to GitHub ─────────────────────────────────────────────────────────

  pushToGitHub: function () {
    if (!this.config.token) {
      alert("Please configure GitHub settings first");
      return;
    }
    if (
      !confirm(
        "Push local database to GitHub?\nOnly records newer than the remote copy will be uploaded.",
      )
    )
      return;

    var self = this;
    var statusEl = document.getElementById("sync-status");
    statusEl.innerHTML = '<div class="sync-progress">Preparing push...</div>';
    statusEl.style.display = "block";

    Database.getAllPersons()
      .then(function (localPersons) {
        if (localPersons.length === 0) {
          statusEl.innerHTML =
            '<div class="sync-success">Nothing to push (database is empty).</div>';
          return;
        }

        return self._listRemoteRecords().then(function (remoteFiles) {
          var remoteMap = {};
          remoteFiles.forEach(function (f) {
            remoteMap[f.name.replace(/\.json$/, "")] = f;
          });

          var uploadCount = 0,
            skipCount = 0,
            total = localPersons.length,
            done = 0;

          function updateProgress() {
            statusEl.innerHTML =
              '<div class="sync-progress">Pushing... ' +
              done +
              " / " +
              total +
              " &nbsp;(uploaded: " +
              uploadCount +
              ", skipped: " +
              skipCount +
              ")</div>";
          }
          updateProgress();

          var sequence = localPersons.reduce(function (chain, person) {
            return chain.then(function () {
              if (!person.uuid) {
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              var filePath = self.config.folder + "/" + person.uuid + ".json";
              var localModified = person.modifiedAt ? new Date(person.modifiedAt) : new Date(0);
              var remote = remoteMap[person.uuid];

              if (!remote) {
                var content = JSON.stringify(person, null, 2);
                var msg =
                  "Add record " + person.uuid + " (" + (person.standardizedName || "unknown") + ")";
                return self._putFile(filePath, content, msg, null).then(function () {
                  uploadCount++;
                  done++;
                  updateProgress();
                });
              }

              return self._getRemoteFile(filePath).then(function (remoteData) {
                var remoteModified = new Date(0);
                if (remoteData) {
                  try {
                    var rj = JSON.parse(self._decode(remoteData));
                    if (rj.modifiedAt) remoteModified = new Date(rj.modifiedAt);
                  } catch (e) {
                    /* ignore */
                  }
                }

                if (localModified <= remoteModified) {
                  skipCount++;
                  done++;
                  updateProgress();
                  return;
                }

                var content = JSON.stringify(person, null, 2);
                var msg =
                  "Update record " +
                  person.uuid +
                  " (" +
                  (person.standardizedName || "unknown") +
                  ")";
                return self._putFile(filePath, content, msg, remote.sha).then(function () {
                  uploadCount++;
                  done++;
                  updateProgress();
                });
              });
            });
          }, Promise.resolve());

          return sequence.then(function () {
            statusEl.innerHTML =
              '<div class="sync-success">&#10003; Push complete &mdash; ' +
              uploadCount +
              " record(s) uploaded, " +
              skipCount +
              " skipped.</div>";
          });
        });
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="sync-error">&#10007; Push failed: ' + err.message + "</div>";
        console.error("pushToGitHub error:", err);
      });
  },

  // ── Pull from GitHub ───────────────────────────────────────────────────────

  pullFromGitHub: function () {
    if (!this.config.token) {
      alert("Please configure GitHub settings first");
      return;
    }
    if (
      !confirm(
        "Pull records from GitHub?\nOnly records newer than your local copy will be imported.",
      )
    )
      return;

    var self = this;
    var statusEl = document.getElementById("sync-status");
    statusEl.innerHTML = '<div class="sync-progress">Listing remote records...</div>';
    statusEl.style.display = "block";

    self
      ._listRemoteRecords()
      .then(function (remoteFiles) {
        if (remoteFiles.length === 0) {
          statusEl.innerHTML =
            '<div class="sync-success">No remote records found in folder <code>' +
            self.config.folder +
            "/</code>.</div>";
          return;
        }

        var total = remoteFiles.length,
          done = 0;
        var insertCount = 0,
          updateCount = 0,
          skipCount = 0;

        function updateProgress() {
          statusEl.innerHTML =
            '<div class="sync-progress">Pulling... ' +
            done +
            " / " +
            total +
            " &nbsp;(new: " +
            insertCount +
            ", updated: " +
            updateCount +
            ", skipped: " +
            skipCount +
            ")</div>";
        }
        updateProgress();

        var sequence = remoteFiles.reduce(function (chain, remoteFile) {
          return chain.then(function () {
            return self._getRemoteFile(remoteFile.path).then(function (data) {
              if (!data) {
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              var person;
              try {
                person = JSON.parse(self._decode(data));
              } catch (e) {
                console.warn("Could not parse remote file:", remoteFile.path, e);
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              if (!person.uuid) {
                person.uuid = remoteFile.name.replace(/\.json$/, "");
                person.id = person.uuid;
              }

              return Database.upsertPerson(person).then(function (result) {
                if (result === "inserted") insertCount++;
                else if (result === "updated") updateCount++;
                else skipCount++;
                done++;
                updateProgress();
              });
            });
          });
        }, Promise.resolve());

        return sequence.then(function () {
          statusEl.innerHTML =
            '<div class="sync-success">&#10003; Pull complete &mdash; ' +
            insertCount +
            " new, " +
            updateCount +
            " updated, " +
            skipCount +
            " skipped.</div>";
          UI.displayStatistics();
          UI.displayBrowseResults();
        });
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="sync-error">&#10007; Pull failed: ' + err.message + "</div>";
        console.error("pullFromGitHub error:", err);
      });
  },

  // ── History ────────────────────────────────────────────────────────────────

  viewHistory: function () {
    var url =
      "https://github.com/" +
      this.config.owner +
      "/" +
      this.config.repo +
      "/commits/" +
      this.config.branch +
      "/" +
      this.config.folder;
    alert("Commit history viewer\n\nVisit the folder on GitHub:\n" + url);
  },
};

// Initialise when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  GitHubSync.init();
});

console.log("GitHub Sync module loaded (per-record IndexedDB edition)");

```


## Assistant

Now add the conflict modal HTML and the auto-sync banner to `index.html`:

**Tool Call: Read file `index.html` (lines 398-446)**
Status: Completed

```webapp-prosopography/index.html
                            phonetic matching. The coat of arms represents the city of Livorno, a
                            key location in the study of religious conversion and migration in early
                            modern Europe.
                        </p>
                        <p>
                            Repository:
                            <a
                                href="https://github.com/lvansnippenburg/JsonDataStorage"
                                target="_blank"
                                >lvansnippenburg/JsonDataStorage</a
                            >
                        </p>
                    </div>
                </section>

                <!-- Person Detail View (modal) -->
                <div id="detail-modal" class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <div id="detail-content"></div>
                        <div class="modal-actions">
                            <button id="btn-edit-person">Edit</button>
                            <button id="btn-delete-person">Delete</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Scripts with cache busters to force reload -->
        <script src="scripts/database.js?v=11"></script>
        <script src="scripts/github-sync.js?v=11"></script>
        <script src="scripts/ui.js?v=11"></script>
        <script src="scripts/app.js?v=11"></script>

        <!-- Service Worker Registration -->
        <script>
            if ("serviceWorker" in navigator) {
                window.addEventListener("load", function () {
                    navigator.serviceWorker
                        .register("scripts/service-worker.js")
                        .then(function (registration) {
                            console.log("ServiceWorker registered:", registration.scope);
                        });
                });
            }
        </script>
    </body>
</html>

```


**Tool Call: index.html**
Status: Completed

Diff: index.html
```
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="robots" content="noindex" />
        .

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Turncoats and Apostates</title>

        <!-- PWA Manifest -->
        <link rel="manifest" href="manifest.json" />

        <!-- Theme colors -->
        <meta name="theme-color" content="#C41E3A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Livorno DB" />

        <!-- Icons -->
        <link rel="apple-touch-icon" href="icons/icon-152x152.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="icons/icon-32x32.png" />
        <link rel="icon" type="image/png" href="icons/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="icons/favicon.svg" />
        <link rel="shortcut icon" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Turncoats and Apostates" />
        <link rel="manifest" href="icons/site.webmanifest" />

        <!-- Favicon links -->
        <link rel="icon" type="image/x-icon" href="icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />

        <link rel="stylesheet" href="styles.css?v=10" />
        <script>
            var answer = prompt("Entry code?");
            if (answer == 1221) {
                document.body.style.display = "";
            } else {
                // send them off
                window.location.replace("https://vansnippenburg.nl");
            }
        </script>
    </head>
    <body style="display: hidden">
        <div class="container">
            <header>
                <div class="header-content">
                    <img
                        src="images/livorno-header.png"
                        alt="Livorno Coat of Arms"
                        class="header-logo"
                    />
                    <h1>Turncoats and Apostates</h1>
                    <button id="hamburger-btn" class="hamburger-btn" aria-label="Menu">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>
                <nav id="main-nav" class="main-nav">
                    <button id="nav-search" class="nav-btn active">Search</button>
                    <button id="nav-add" class="nav-btn">Add Person</button>
                    <button id="nav-browse" class="nav-btn">Browse All</button>
                    <button id="nav-export" class="nav-btn">Export/Import</button>
                    <button id="nav-settings" class="nav-btn">Settings</button>
                </nav>
            </header>

            <main>
                <!-- Search View -->
                <section id="search-view" class="view active">
                    <h2>Search Persons</h2>

                    <div class="search-form">
                        <input
                            type="text"
                            id="search-name"
                            placeholder="Search by name (any variant)"
                        />
                        <input type="text" id="search-place" placeholder="Search by place" />
                        <input type="number" id="search-year" placeholder="Year" />
                        <div class="phonetic-option">
                            <label>
                                <input type="checkbox" id="phonetic-search" />
                                Phonetic matching (Soundex)
                            </label>
                        </div>
                        <button id="btn-search">Search</button>
                        <button id="btn-clear">Clear</button>
                    </div>
                    <div id="search-info" class="search-info"></div>
                    <div id="search-results"></div>

                    <!-- Database Statistics at bottom -->
                    <div class="stats-section">
                        <h3>Database Overview</h3>
                        <div id="stats-display"></div>
                    </div>
                </section>

                <!-- Add/Edit Person View -->
                <section id="add-view" class="view">
                    <h2 id="form-title">Add New Person</h2>
                    <form id="person-form">
                        <input type="hidden" id="person-id" />

                        <fieldset>
                            <legend>Basic Information</legend>
                            <div class="name-input-wrapper">
                                <label>
                                    Standardized Name:
                                    <input
                                        type="text"
                                        id="standardized-name"
                                        required
                                        autocomplete="off"
                                    />
                                </label>
                                <div id="name-suggestions" class="suggestions-panel"></div>
                            </div>

                            <div class="form-row">
                                <div class="autocomplete-wrapper">
                                    <label>
                                        Nationality:
                                        <input
                                            type="text"
                                            id="nationality"
                                            autocomplete="off"
                                            placeholder="e.g., Dutch, Spanish, French"
                                        />
                                    </label>
                                    <div
                                        id="nationality-suggestions"
                                        class="autocomplete-dropdown"
                                    ></div>
                                </div>

                                <label>
                                    Gender:
                                    <select id="gender">
                                        <option value="unknown">Unknown</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </label>
                            </div>

                            <div class="form-row">
                                <div class="autocomplete-wrapper">
                                    <label>
                                        Religion:
                                        <input
                                            type="text"
                                            id="religion"
                                            autocomplete="off"
                                            placeholder="e.g., Catholic, Protestant, Jewish"
                                        />
                                    </label>
                                    <div
                                        id="religion-suggestions"
                                        class="autocomplete-dropdown"
                                    ></div>
                                </div>

                                <label>
                                    Religion Certainty:
                                    <select id="religion-certainty">
                                        <option value="certain">Certain</option>
                                        <option value="probable">Probable</option>
                                        <option value="possible">Possible</option>
                                        <option value="unknown">Unknown</option>
                                    </select>
                                </label>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Name Variants</legend>
                            <div id="name-variants-container"></div>
                            <button type="button" id="btn-add-variant">+ Add Name Variant</button>
                        </fieldset>

                        <fieldset>
                            <legend>Life Events</legend>
                            <div class="life-event">
                                <h4>Birth</h4>
                                <label>Year: <input type="number" id="birth-year" /></label>
                                <label
                                    >Month: <input type="number" id="birth-month" min="1" max="12"
                                /></label>
                                <label
                                    >Day: <input type="number" id="birth-day" min="1" max="31"
                                /></label>
                                <label><input type="checkbox" id="birth-circa" /> Circa</label>
                                <label>Place: <input type="text" id="birth-place" /></label>
                                <label
                                    >Certainty:
                                    <select id="birth-certainty">
                                        <option value="certain">Certain</option>
                                        <option value="probable">Probable</option>
                                        <option value="possible">Possible</option>
                                        <option value="estimated">Estimated</option>
                                    </select>
                                </label>
                            </div>
                            <div class="life-event">
                                <h4>Death</h4>
                                <label>Year: <input type="number" id="death-year" /></label>
                                <label
                                    >Month: <input type="number" id="death-month" min="1" max="12"
                                /></label>
                                <label
                                    >Day: <input type="number" id="death-day" min="1" max="31"
                                /></label>
                                <label><input type="checkbox" id="death-circa" /> Circa</label>
                                <label>Place: <input type="text" id="death-place" /></label>
                                <label
                                    >Certainty:
                                    <select id="death-certainty">
                                        <option value="certain">Certain</option>
                                        <option value="probable">Probable</option>
                                        <option value="possible">Possible</option>
                                        <option value="estimated">Estimated</option>
                                    </select>
                                </label>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Attestations</legend>
                            <div id="attestations-container"></div>
                            <button type="button" id="btn-add-attestation">
                                + Add Attestation
                            </button>
                        </fieldset>

                        <fieldset>
                            <legend>Relationships</legend>
                            <div id="relationships-container"></div>
                            <button type="button" id="btn-add-relationship">
                                + Add Relationship
                            </button>
                        </fieldset>

                        <fieldset>
                            <legend>Additional Information</legend>
                            <label>
                                Occupations (comma-separated):
                                <input type="text" id="occupations" />
                            </label>
                            <label>
                                Biography/Notes:
                                <textarea id="biography" rows="4"></textarea>
                            </label>
                        </fieldset>

                        <div class="form-actions">
                            <button type="submit" id="btn-save">Save Person</button>
                            <button type="button" id="btn-cancel">Cancel</button>
                        </div>
                    </form>
                </section>

                <!-- Browse View -->
                <section id="browse-view" class="view">
                    <h2>Browse All Persons</h2>
                    <div class="browse-controls">
                        <label>
                            Sort by:
                            <select id="sort-by">
                                <option value="name">Name</option>
                                <option value="birth">Birth Year</option>
                                <option value="death">Death Year</option>
                            </select>
                        </label>
                    </div>
                    <div id="browse-results"></div>
                </section>

                <!-- Export/Import View -->
                <section id="export-view" class="view">
                    <h2>Export / Import Data</h2>

                    <div class="export-section">
                        <h3>Sync with GitHub</h3>
                        <p id="github-status">Not connected to GitHub</p>
                        <div class="github-actions">
                            <button id="btn-push-github" disabled>Push to GitHub</button>
                            <button id="btn-pull-github" disabled>Pull from GitHub</button>
                            <button id="btn-view-history">View GitHub History</button>
                        </div>
                        <div id="sync-status" class="sync-status"></div>
                    </div>

                    <div class="export-section">
                        <h3>Local Export/Import</h3>
                        <p>Download or upload your database as a JSON file.</p>
                        <button id="btn-export-json">Download JSON</button>
                        <div style="margin-top: 1rem">
                            <input type="file" id="import-file" accept=".json" />
                            <button id="btn-import-json">Import JSON</button>
                        </div>
                    </div>
                </section>

                <!-- Settings View -->
                <section id="settings-view" class="view">
                    <h2>Settings</h2>

                    <div class="settings-section">
                        <h3>GitHub Integration</h3>
                        <p>
                            Connect your prosopography database to GitHub for automatic version
                            control and backup.
                        </p>

                        <div class="github-setup">
                            <h4>Step 1: Create a Personal Access Token</h4>
                            <ol>
                                <li>
                                    Go to
                                    <a
                                        href="https://github.com/settings/tokens?type=beta"
                                        target="_blank"
                                        >GitHub Settings → Tokens (Fine-grained)</a
                                    >
                                </li>
                                <li>Click "Generate new token"</li>
                                <li>Give it a name like "Prosopography Database"</li>
                                <li>Set expiration (recommend 90 days or 1 year)</li>
                                <li>
                                    Under "Repository access", select "Only select repositories"
                                </li>
                                <li>Choose: <strong>lvansnippenburg/JsonDataStorage</strong></li>
                                <li>
                                    Under "Repository permissions", set <strong>Contents</strong> to
                                    "Read and write"
                                </li>
                                <li>Click "Generate token" and copy it</li>
                            </ol>

                            <h4>Step 2: Configure Connection</h4>
                            <div class="settings-form">
                                <label>
                                    GitHub Personal Access Token:
                                    <input
                                        type="password"
                                        id="github-token"
                                        placeholder="ghp_xxxxxxxxxxxx"
                                    />
                                    <small
                                        >This token is stored only on your device
                                        (localStorage)</small
                                    >
                                </label>

                                <label>
                                    Records Folder in Repository:
                                    <input
                                        type="text"
                                        id="github-folder"
                                        value="prosopography-records"
                                    />
                                    <small
                                        >Folder where individual record files (one per person) are
                                        stored</small
                                    >
                                </label>

                                <label>
                                    Branch:
                                    <input type="text" id="github-branch" value="main" />
                                    <small>Usually "main" or "master"</small>
                                </label>

                                <div class="settings-actions">
                                    <button id="btn-save-settings">Save Settings</button>
                                    <button id="btn-test-connection">Test Connection</button>
                                    <button id="btn-clear-settings" class="btn-danger">
                                        Clear Settings
                                    </button>
                                </div>

                                <div id="connection-status" class="connection-status"></div>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>About</h3>
                        <p><strong>Turncoats and Apostates</strong></p>
                        <p>
                            A specialized tool for managing historical prosopographical research
                            with support for name variants, attestations, relationships, and
                            phonetic matching. The coat of arms represents the city of Livorno, a
                            key location in the study of religious conversion and migration in early
                            modern Europe.
                        </p>
                        <p>
                            Repository:
                            <a
                                href="https://github.com/lvansnippenburg/JsonDataStorage"
                                target="_blank"
                                >lvansnippenburg/JsonDataStorage</a
                            >
                        </p>
                    </div>
                </section>

                <!-- Person Detail View (modal) -->
                <div id="detail-modal" class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <div id="detail-content"></div>
                        <div class="modal-actions">
                            <button id="btn-edit-person">Edit</button>
                            <button id="btn-delete-person">Delete</button>
                        </div>
                    </div>
                </div>

                <!-- Conflict Resolution Modal -->
                <div id="conflict-modal" class="modal">
                    <div class="modal-content conflict-modal-content">
                        <div class="conflict-modal-header">
                            <h2>&#9888; Sync Conflicts Detected</h2>
                            <p class="conflict-intro">
                                The following records were modified both locally and on GitHub.
                                Review the differences and choose which version to keep for each
                                conflict.
                            </p>
                        </div>
                        <div id="conflict-modal-body" class="conflict-modal-body"></div>
                        <div class="conflict-modal-footer">
                            <button id="conflict-apply-btn" class="conflict-apply-btn" disabled>
                                Apply Resolutions
                            </button>
                            <button id="conflict-skip-btn" class="conflict-skip-btn">
                                Decide Later
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Auto-sync status banner (fixed at top) -->
        <div id="autosync-banner" class="autosync-banner" style="display: none">
            <span id="autosync-msg"></span>
            <button
                id="autosync-dismiss"
                onclick="this.parentElement.style.display = 'none'"
                title="Dismiss"
            >
                &times;
            </button>
        </div>

        <!-- Scripts with cache busters to force reload -->
        <script src="scripts/database.js?v=12"></script>
        <script src="scripts/github-sync.js?v=12"></script>
        <script src="scripts/ui.js?v=12"></script>
        <script src="scripts/app.js?v=12"></script>

        <!-- Service Worker Registration -->
        <script>
            if ("serviceWorker" in navigator) {
                window.addEventListener("load", function () {
                    navigator.serviceWorker
                        .register("scripts/service-worker.js")
                        .then(function (registration) {
                            console.log("ServiceWorker registered:", registration.scope);
                        });
                });
            }
        </script>
    </body>
</html>

```


## Assistant

Now add the `autoSync()` call in `app.js`:

**Tool Call: scripts/app.js**
Status: Completed

Diff: scripts/app.js
```
// App Module - Main application logic and form handling
var App = {
  init: function () {
    this.bindEvents();
    UI.init();
    // Auto-sync with GitHub on launch (silently skipped if no token configured)
    GitHubSync.autoSync();
    console.log("App initialized");
  },

  bindEvents: function () {
    // Search form
    document.getElementById("btn-search").addEventListener("click", function () {
      App.handleSearch();
    });

    document.getElementById("btn-clear").addEventListener("click", function () {
      document.getElementById("search-name").value = "";
      document.getElementById("search-place").value = "";
      document.getElementById("search-year").value = "";
      document.getElementById("phonetic-search").checked = false;
      document.getElementById("search-info").style.display = "none";
      document.getElementById("search-results").innerHTML = "";
    });

    // Person form submission
    document.getElementById("person-form").addEventListener("submit", function (e) {
      e.preventDefault();
      App.handleSavePerson();
    });

    // Sort change in browse view
    document.getElementById("sort-by").addEventListener("change", function () {
      UI.displayBrowseResults();
    });

    // Export/Import buttons
    document.getElementById("btn-export-json").addEventListener("click", function () {
      App.exportJSON();
    });

    document.getElementById("btn-import-json").addEventListener("click", function () {
      App.importJSON();
    });

    // Standardized name input - check for similar names
    var nameInput = document.getElementById("standardized-name");
    var suggestionsPanel = document.getElementById("name-suggestions");

    nameInput.addEventListener("input", function () {
      var value = nameInput.value.trim();

      if (value.length < 3) {
        suggestionsPanel.style.display = "none";
        return;
      }

      Database.getAllPersons().then(function (persons) {
        var currentEditId = UI.currentEditId;

        // Find similar names
        var similar = persons.filter(function (p) {
          if (p.id === currentEditId) return false;

          // Check standardized name
          if (p.standardizedName.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
            return true;
          }

          // Check phonetic match
          if (Database.soundex(p.standardizedName) === Database.soundex(value)) {
            return true;
          }

          return false;
        });

        if (similar.length === 0) {
          suggestionsPanel.style.display = "none";
          return;
        }

        // Display suggestions
        var html =
          '<div class="suggestions-header">&#9888; Similar names found - possible duplicates:</div>';
        html += '<div class="suggestions-list">';

        similar.forEach(function (person) {
          html += '<div class="suggestion-item">';
          html += '<div class="suggestion-main">';
          html += "<strong>" + person.standardizedName + "</strong>";
          var genderIcon =
            person.gender === "male"
              ? "&#9794;"
              : person.gender === "female"
                ? "&#9792;"
                : "&#9711;";
          html += '<span class="gender-indicator">' + genderIcon + "</span>";

          if (Database.soundex(person.standardizedName) === Database.soundex(value)) {
            html += '<span class="phonetic-badge">Phonetic Match</span>';
          }
          html += "</div>";

          if (person.lifeEvents && (person.lifeEvents.birth || person.lifeEvents.death)) {
            var birthYear =
              person.lifeEvents.birth && person.lifeEvents.birth.date
                ? person.lifeEvents.birth.date.year || "?"
                : "?";
            var deathYear =
              person.lifeEvents.death && person.lifeEvents.death.date
                ? person.lifeEvents.death.date.year || "?"
                : "?";
            html += '<div class="suggestion-details">(' + birthYear + " - " + deathYear + ")";
            if (person.nationality) html += " &bull; " + person.nationality;
            html += "</div>";
          }

          if (person.nameVariants && person.nameVariants.length > 0) {
            var variants = person.nameVariants
              .slice(0, 3)
              .map(function (v) {
                return v.fullName || v.firstName + " " + v.lastName;
              })
              .join(", ");
            html += '<div class="suggestion-variants">Variants: ' + variants + "</div>";
          }

          html += '<div class="suggestion-actions">';
          html +=
            '<button type="button" class="btn-view-suggestion" data-id="' +
            person.id +
            '">View</button>';
          html +=
            '<button type="button" class="btn-load-suggestion" data-id="' +
            person.id +
            '">Load for Editing</button>';
          html += "</div>";
          html += "</div>";
        });

        html += "</div>";
        suggestionsPanel.innerHTML = html;
        suggestionsPanel.style.display = "block";

        // Bind suggestion buttons
        suggestionsPanel.querySelectorAll(".btn-view-suggestion").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var id = btn.dataset.id;
            suggestionsPanel.style.display = "none";
            UI.showPersonDetail(id);
          });
        });

        suggestionsPanel.querySelectorAll(".btn-load-suggestion").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var id = btn.dataset.id;
            suggestionsPanel.style.display = "none";
            Database.getPersonById(id).then(function (person) {
              if (person) UI.loadPersonIntoForm(person);
            });
          });
        });
      });
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", function (e) {
      if (e.target !== nameInput && !suggestionsPanel.contains(e.target)) {
        suggestionsPanel.style.display = "none";
      }
    });
  },

  handleSearch: function () {
    var name = document.getElementById("search-name").value.trim();
    var place = document.getElementById("search-place").value.trim();
    var year = document.getElementById("search-year").value.trim();
    var usePhonetic = document.getElementById("phonetic-search").checked;

    if (!name && !place && !year) {
      alert("Please enter at least one search criterion");
      return;
    }

    var criteria = {
      name: name,
      place: place,
      year: year ? parseInt(year) : null,
      usePhonetic: usePhonetic,
    };

    Database.searchPersons(criteria).then(function (results) {
      // Display search info
      var searchInfo = document.getElementById("search-info");
      var infoText = "Found " + results.length + " person(s)";
      if (name) infoText += ' matching name "' + name + '"';
      if (place) infoText += ' in place "' + place + '"';
      if (year) infoText += " in year " + year;
      if (usePhonetic) infoText += " (phonetic matching enabled)";

      searchInfo.innerHTML = "<p>" + infoText + "</p>";
      searchInfo.style.display = "block";

      UI.displaySearchResults(results);
    });
  },

  handleSavePerson: function () {
    var personData = this.collectFormData();

    if (!personData.standardizedName) {
      alert("Standardized name is required");
      return;
    }

    var editId = document.getElementById("person-id").value;

    var done = function () {
      UI.clearForm();
      UI.switchView("search-view");
      UI.displayStatistics();
    };

    if (editId) {
      Database.updatePerson(editId, personData)
        .then(function (success) {
          if (success) {
            alert("Person updated successfully");
          } else {
            alert("Update failed: person not found");
          }
          done();
        })
        .catch(function (err) {
          alert("Error saving person: " + err.message);
        });
    } else {
      Database.addPerson(personData)
        .then(function () {
          alert("Person added successfully");
          done();
        })
        .catch(function (err) {
          alert("Error saving person: " + err.message);
        });
    }
  },

  collectFormData: function () {
    var person = {
      standardizedName: document.getElementById("standardized-name").value.trim(),
      nationality: document.getElementById("nationality").value.trim(),
      gender: document.getElementById("gender").value,
      religion: document.getElementById("religion").value.trim(),
      religionCertainty: document.getElementById("religion-certainty").value,
      nameVariants: this.collectNameVariants(),
      lifeEvents: this.collectLifeEvents(),
      attestations: this.collectAttestations(),
      relationships: this.collectRelationships(),
      occupations: this.collectOccupations(),
      biography: document.getElementById("biography").value.trim(),
    };

    return person;
  },

  collectNameVariants: function () {
    var variants = [];
    var container = document.getElementById("name-variants-container");
    var items = container.querySelectorAll(".variant-item");

    items.forEach(function (item) {
      var index = item.dataset.index;

      var fullName = item.querySelector('[name="variant-fullname-' + index + '"]')
        ? item.querySelector('[name="variant-fullname-' + index + '"]').value.trim()
        : "";
      var firstName = item.querySelector('[name="variant-firstname-' + index + '"]')
        ? item.querySelector('[name="variant-firstname-' + index + '"]').value.trim()
        : "";
      var lastName = item.querySelector('[name="variant-lastname-' + index + '"]')
        ? item.querySelector('[name="variant-lastname-' + index + '"]').value.trim()
        : "";
      var notes = item.querySelector('[name="variant-notes-' + index + '"]')
        ? item.querySelector('[name="variant-notes-' + index + '"]').value.trim()
        : "";

      if (fullName || firstName || lastName) {
        var variant = {
          fullName: fullName,
          firstName: firstName,
          lastName: lastName,
          notes: notes,
          sources: [],
        };

        var sourceDoc = item.querySelector('[name="variant-source-doc-' + index + '"]')
          ? item.querySelector('[name="variant-source-doc-' + index + '"]').value.trim()
          : "";
        var sourceLoc = item.querySelector('[name="variant-source-loc-' + index + '"]')
          ? item.querySelector('[name="variant-source-loc-' + index + '"]').value.trim()
          : "";

        if (sourceDoc || sourceLoc) {
          variant.sources.push({
            documentName: sourceDoc || "",
            location: sourceLoc || "",
            citation: sourceDoc + (sourceLoc ? ", " + sourceLoc : ""),
          });
        }

        variants.push(variant);
      }
    });

    return variants;
  },

  collectLifeEvents: function () {
    var lifeEvents = {};

    // Birth
    var birthYear = document.getElementById("birth-year").value;
    var birthMonth = document.getElementById("birth-month").value;
    var birthDay = document.getElementById("birth-day").value;
    var birthCirca = document.getElementById("birth-circa").checked;
    var birthPlace = document.getElementById("birth-place").value.trim();
    var birthCertainty = document.getElementById("birth-certainty").value;

    if (birthYear || birthPlace) {
      lifeEvents.birth = {
        date: {
          year: birthYear ? parseInt(birthYear) : null,
          month: birthMonth ? parseInt(birthMonth) : null,
          day: birthDay ? parseInt(birthDay) : null,
          circa: birthCirca,
        },
        place: birthPlace,
        certainty: birthCertainty,
      };
    }

    // Death
    var deathYear = document.getElementById("death-year").value;
    var deathMonth = document.getElementById("death-month").value;
    var deathDay = document.getElementById("death-day").value;
    var deathCirca = document.getElementById("death-circa").checked;
    var deathPlace = document.getElementById("death-place").value.trim();
    var deathCertainty = document.getElementById("death-certainty").value;

    if (deathYear || deathPlace) {
      lifeEvents.death = {
        date: {
          year: deathYear ? parseInt(deathYear) : null,
          month: deathMonth ? parseInt(deathMonth) : null,
          day: deathDay ? parseInt(deathDay) : null,
          circa: deathCirca,
        },
        place: deathPlace,
        certainty: deathCertainty,
      };
    }

    return lifeEvents;
  },

  collectAttestations: function () {
    var attestations = [];
    var container = document.getElementById("attestations-container");
    var items = container.querySelectorAll(".attestation-item");

    items.forEach(function (item) {
      var index = item.dataset.index;

      var place = item.querySelector('[name="att-place-' + index + '"]')
        ? item.querySelector('[name="att-place-' + index + '"]').value.trim()
        : "";
      var year = item.querySelector('[name="att-year-' + index + '"]')
        ? item.querySelector('[name="att-year-' + index + '"]').value
        : "";
      var month = item.querySelector('[name="att-month-' + index + '"]')
        ? item.querySelector('[name="att-month-' + index + '"]').value
        : "";
      var day = item.querySelector('[name="att-day-' + index + '"]')
        ? item.querySelector('[name="att-day-' + index + '"]').value
        : "";
      var event = item.querySelector('[name="att-event-' + index + '"]')
        ? item.querySelector('[name="att-event-' + index + '"]').value.trim()
        : "";
      var notes = item.querySelector('[name="att-notes-' + index + '"]')
        ? item.querySelector('[name="att-notes-' + index + '"]').value.trim()
        : "";

      if (place || year || event) {
        var attestation = {
          place: place,
          date: {
            year: year ? parseInt(year) : null,
            month: month ? parseInt(month) : null,
            day: day ? parseInt(day) : null,
          },
          event: event,
          notes: notes,
          sources: [],
        };

        var sourceDoc = item.querySelector('[name="att-source-doc-' + index + '"]')
          ? item.querySelector('[name="att-source-doc-' + index + '"]').value.trim()
          : "";
        var sourceLoc = item.querySelector('[name="att-source-loc-' + index + '"]')
          ? item.querySelector('[name="att-source-loc-' + index + '"]').value.trim()
          : "";

        if (sourceDoc || sourceLoc) {
          attestation.sources.push({
            documentName: sourceDoc || "",
            location: sourceLoc || "",
            citation: sourceDoc + (sourceLoc ? ", " + sourceLoc : ""),
          });
        }

        attestations.push(attestation);
      }
    });

    return attestations;
  },

  collectRelationships: function () {
    var relationships = [];
    var container = document.getElementById("relationships-container");
    var items = container.querySelectorAll(".relationship-item");

    items.forEach(function (item) {
      var index = item.dataset.index;

      var relatedPerson = item.querySelector('[name="rel-person-' + index + '"]')
        ? item.querySelector('[name="rel-person-' + index + '"]').value.trim()
        : "";
      var type = item.querySelector('[name="rel-type-' + index + '"]')
        ? item.querySelector('[name="rel-type-' + index + '"]').value.trim()
        : "";
      var notes = item.querySelector('[name="rel-notes-' + index + '"]')
        ? item.querySelector('[name="rel-notes-' + index + '"]').value.trim()
        : "";

      if (relatedPerson || type) {
        var relationship = {
          relatedPerson: relatedPerson,
          type: type,
          notes: notes,
          sources: [],
        };

        var sourceDoc = item.querySelector('[name="rel-source-doc-' + index + '"]')
          ? item.querySelector('[name="rel-source-doc-' + index + '"]').value.trim()
          : "";
        var sourceLoc = item.querySelector('[name="rel-source-loc-' + index + '"]')
          ? item.querySelector('[name="rel-source-loc-' + index + '"]').value.trim()
          : "";

        if (sourceDoc || sourceLoc) {
          relationship.sources.push({
            documentName: sourceDoc || "",
            location: sourceLoc || "",
            citation: sourceDoc + (sourceLoc ? ", " + sourceLoc : ""),
          });
        }

        relationships.push(relationship);
      }
    });

    return relationships;
  },

  collectOccupations: function () {
    var occupationsStr = document.getElementById("occupations").value.trim();
    if (!occupationsStr) return [];

    return occupationsStr
      .split(",")
      .map(function (occ) {
        return occ.trim();
      })
      .filter(function (occ) {
        return occ.length > 0;
      });
  },

  exportJSON: function () {
    Database.exportJSON()
      .then(function (json) {
        var blob = new Blob([json], { type: "application/json" });
        var url = URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = url;
        a.download = "prosopography-database-" + new Date().toISOString().split("T")[0] + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert("Database exported successfully");
      })
      .catch(function (err) {
        alert("Export failed: " + err.message);
      });
  },

  importJSON: function () {
    var fileInput = document.getElementById("import-file");
    var file = fileInput.files[0];

    if (!file) {
      alert("Please select a file to import");
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      Database.importJSON(e.target.result)
        .then(function (success) {
          if (success) {
            alert("Database imported successfully");
            UI.displayStatistics();
            UI.displayBrowseResults();
          } else {
            alert("Import failed: Invalid file format");
          }
        })
        .catch(function (err) {
          alert("Import failed: " + err.message);
        });
    };

    reader.readAsText(file);
  },
};

document.addEventListener("DOMContentLoaded", function () {
  App.init();
});

```


## Assistant

Now add all the CSS for the banner and conflict modal to `styles.css`:

**Tool Call: Read file `styles.css` (lines 1160-1170)**
Status: Completed

```webapp-prosopography/styles.css
.mb-2 {
    margin-bottom: 1rem;
}

.mt-1 {
    margin-top: 0.5rem;
}

.mt-2 {
    margin-top: 1rem;
}
```


**Tool Call: styles.css**
Status: Completed

Diff: styles.css
```
/* Global Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    background: white;
    min-height: 100vh;
}

/* Header - Matching Livorno Coat of Arms Colors */
header {
    background: linear-gradient(135deg, #c41e3a 0%, #9b1b2e 100%);
    color: #fff8e7;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    position: relative;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.header-logo {
    height: 70px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.3));
    background: white;
    padding: 5px;
    border-radius: 8px;
    border: 2px solid #d4af37;
}

header h1 {
    margin: 0;
    font-size: 1.8rem;
    flex-grow: 1;
    color: #fff8e7;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    font-weight: 700;
}

/* Hamburger Menu Button - Always Visible */
.hamburger-btn {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: transform 0.3s ease;
}

.hamburger-btn:hover {
    transform: scale(1.1);
}

.hamburger-line {
    width: 100%;
    height: 3px;
    background: #fff8e7;
    border-radius: 3px;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.hamburger-btn.active .hamburger-line:nth-child(1) {
    transform: translateY(10.5px) rotate(45deg);
}

.hamburger-btn.active .hamburger-line:nth-child(2) {
    opacity: 0;
}

.hamburger-btn.active .hamburger-line:nth-child(3) {
    transform: translateY(-10.5px) rotate(-45deg);
}

/* Navigation - Always Hidden Until Opened */
nav.main-nav {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, #c41e3a 0%, #9b1b2e 100%);
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    z-index: 100;
}

nav.main-nav.open {
    display: flex;
}

.nav-btn {
    padding: 1rem 1.5rem;
    background: rgba(255, 248, 231, 0.1);
    color: #fff8e7;
    border: 1px solid rgba(255, 248, 231, 0.2);
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;
    text-align: left;
    margin-bottom: 0.5rem;
}

.nav-btn:hover {
    background: rgba(255, 248, 231, 0.2);
    border-color: #d4af37;
}

.nav-btn.active {
    background: #d4af37;
    color: #8b0000;
    border-color: #d4af37;
    font-weight: 600;
}

/* Main Content */
main {
    padding: 2rem;
}

.view {
    display: none;
}

.view.active {
    display: block;
}

h2 {
    color: #8b0000;
    margin-bottom: 1.5rem;
    font-size: 1.6rem;
    border-bottom: 2px solid #c41e3a;
    padding-bottom: 0.5rem;
}

/* Search Form */
.search-form {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto auto;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1.5rem;
    background: #fff8f0;
    border-radius: 6px;
    border: 1px solid #f5deb3;
}

.search-form input[type="text"],
.search-form input[type="number"] {
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
}

.search-form .phonetic-option {
    grid-column: 1 / 4;
    display: flex;
    align-items: center;
}

.search-form .phonetic-option label {
    display: flex;
    align-items: center;
    font-weight: normal;
    margin: 0;
    font-size: 0.9rem;
    color: #555;
}

.search-form .phonetic-option input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
}

.search-form button {
    padding: 0.6rem 1.5rem;
    background: #c41e3a;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.3s;
}

.search-form button:hover {
    background: #9b1b2e;
}

#btn-clear {
    background: #95a5a6;
}

#btn-clear:hover {
    background: #7f8c8d;
}

/* Search Info */
.search-info {
    padding: 0.8rem 1.5rem;
    margin-bottom: 1rem;
    background: #fff8f0;
    border-left: 4px solid #c41e3a;
    border-radius: 4px;
}

.search-info p {
    margin: 0;
    font-size: 0.9rem;
}

/* Results Display */
#search-results,
#browse-results {
    display: grid;
    gap: 1rem;
}

.person-card {
    border: 1px solid #f5deb3;
    padding: 1.5rem;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    transition:
        box-shadow 0.3s,
        transform 0.2s;
}

.person-card:hover {
    box-shadow: 0 4px 12px rgba(196, 30, 58, 0.15);
    transform: translateY(-2px);
    border-color: #c41e3a;
}

.person-card h3 {
    color: #8b0000;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 3px;
    font-size: 0.85rem;
    font-weight: normal;
    line-height: 1.4;
}

.nationality-badge {
    background: #c41e3a;
    color: white;
    margin-right: 0.3rem;
}

.gender-badge {
    background: #95a5a6;
    color: white;
    font-size: 0.85rem;
    padding: 0.2rem 0.6rem;
    border-radius: 3px;
    line-height: 1.4;
}

.gender-badge.gender-male {
    background: #4a90e2;
}

.gender-badge.gender-female {
    background: #e74c3c;
}

.gender-badge.gender-unknown {
    background: #95a5a6;
}

.person-card .dates {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.person-card .variants {
    font-size: 0.9rem;
    color: #555;
    margin-top: 0.5rem;
}

.person-card .attestations-count {
    font-size: 0.85rem;
    color: #c41e3a;
    margin-top: 0.5rem;
}

/* Form Styles */
fieldset {
    border: 1px solid #f5deb3;
    border-radius: 6px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    background: #fffaf0;
}

legend {
    font-weight: 600;
    color: #8b0000;
    padding: 0 0.5rem;
}

label {
    display: block;
    margin-bottom: 1rem;
    font-weight: 500;
    color: #555;
}

/* Unified styling for inputs and selects */
input[type="text"],
input[type="number"],
input[type="password"],
select,
textarea {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
    margin-top: 0.3rem;
    font-family: inherit;
    background-color: white;
    transition:
        border-color 0.3s,
        box-shadow 0.3s;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

/* Add custom dropdown arrow for select elements */
select {
    background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23C41E3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e');
    background-repeat: no-repeat;
    background-position: right 0.6rem center;
    background-size: 1.2em;
    padding-right: 2.5rem;
    cursor: pointer;
}

/* Focus states - identical for all inputs */
input[type="text"]:focus,
input[type="number"]:focus,
input[type="password"]:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: #c41e3a;
    box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
}

/* Hover states */
input[type="text"]:hover,
input[type="number"]:hover,
input[type="password"]:hover,
select:hover,
textarea:hover {
    border-color: #bdc3c7;
}

input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
}

textarea {
    resize: vertical;
}

small {
    display: block;
    color: #7f8c8d;
    font-size: 0.85rem;
    margin-top: 0.3rem;
}

/* Form Row for side-by-side fields */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

/* Source Fields - NEW */
.source-fields {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #f5deb3;
}

.source-fields label {
    margin-bottom: 0.5rem;
}

.source-doc-input {
    font-weight: 500;
}

/* Autocomplete for Nationality, Religion, and Sources */
.autocomplete-wrapper {
    position: relative;
}

.autocomplete-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #c41e3a;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 50;
    margin-top: 0.3rem;
}

.autocomplete-item {
    padding: 0.6rem 1rem;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 0.95rem;
}

.autocomplete-item:hover {
    background: #fff8f0;
}

.autocomplete-item:active {
    background: #fff0e0;
}

/* Name Input with Suggestions */
.name-input-wrapper {
    position: relative;
}

.suggestions-panel {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #c41e3a;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    max-height: 500px;
    overflow-y: auto;
    margin-top: 0.5rem;
}

.suggestions-header {
    background: #ffe6e6;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid #c41e3a;
    color: #8b0000;
    font-size: 0.95rem;
}

.suggestions-list {
    padding: 0.5rem;
}

.suggestion-item {
    padding: 1rem;
    border: 1px solid #f5deb3;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    background: #fffaf0;
}

.suggestion-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.suggestion-main strong {
    color: #8b0000;
    font-size: 1.1rem;
}

.gender-indicator {
    font-size: 1rem;
    color: #7f8c8d;
}

.phonetic-badge {
    background: #c41e3a;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.75rem;
    font-weight: normal;
}

.suggestion-details {
    font-size: 0.85rem;
    color: #7f8c8d;
    margin-bottom: 0.5rem;
}

.suggestion-variants {
    font-size: 0.85rem;
    color: #555;
    margin-bottom: 0.8rem;
    font-style: italic;
}

.suggestion-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-view-suggestion,
.btn-load-suggestion {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.3s;
}

.btn-view-suggestion {
    background: #c41e3a;
    color: white;
}

.btn-view-suggestion:hover {
    background: #9b1b2e;
}

.btn-load-suggestion {
    background: #d4af37;
    color: #8b0000;
}

.btn-load-suggestion:hover {
    background: #b8941f;
}

.life-event {
    background: #fffaf0;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #f5deb3;
}

.life-event h4 {
    margin-bottom: 0.8rem;
    color: #8b0000;
}

.life-event label {
    display: inline-block;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
}

.life-event input[type="number"] {
    width: 100px;
}

.life-event select {
    width: 150px;
}

/* Dynamic Form Sections */
.variant-item,
.attestation-item,
.relationship-item {
    background: #fffaf0;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    position: relative;
    border: 1px solid #f5deb3;
}

.remove-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #c41e3a;
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
}

.remove-btn:hover {
    background: #9b1b2e;
}

button[type="button"] {
    padding: 0.6rem 1.2rem;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.3s;
}

button[type="button"]:hover {
    background: #229954;
}

/* Form Actions */
.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.form-actions button {
    padding: 0.8rem 2rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
}

button[type="submit"] {
    background: #c41e3a;
    color: white;
}

button[type="submit"]:hover {
    background: #9b1b2e;
}

#btn-cancel {
    background: #95a5a6;
    color: white;
}

#btn-cancel:hover {
    background: #7f8c8d;
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal.active {
    display: block;
}

.modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 900px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border-top: 4px solid #c41e3a;
}

.close {
    color: #aaa;
    float: right;
    font-size: 2rem;
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
}

.close:hover {
    color: #c41e3a;
}

.modal-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
}

.modal-actions button {
    padding: 0.6rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95rem;
}

#btn-edit-person {
    background: #c41e3a;
    color: white;
}

#btn-edit-person:hover {
    background: #9b1b2e;
}

#btn-delete-person {
    background: #e74c3c;
    color: white;
}

#btn-delete-person:hover {
    background: #c0392b;
}

/* Detail View Styles */
#detail-content h3 {
    color: #8b0000;
    margin-top: 1.5rem;
    margin-bottom: 0.8rem;
    font-size: 1.2rem;
    border-bottom: 1px solid #f5deb3;
    padding-bottom: 0.5rem;
}

#detail-content .detail-basic-info {
    margin-bottom: 1.5rem;
}

#detail-content .detail-basic-info p {
    color: #555;
    margin-bottom: 0.5rem;
}

#detail-content .detail-section {
    margin-bottom: 1.5rem;
}

#detail-content .variant-list,
#detail-content .attestation-list,
#detail-content .relationship-list {
    list-style: none;
    padding: 0;
}

#detail-content li {
    background: #fffaf0;
    padding: 0.8rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    border-left: 3px solid #c41e3a;
}

#detail-content .source-ref {
    font-size: 0.85rem;
    color: #7f8c8d;
    font-style: italic;
}

/* Browse View */
.browse-controls {
    margin-bottom: 1.5rem;
}

.browse-controls select {
    width: 200px;
}

/* Export/Import View */
.export-section,
.import-section,
.stats-section,
.settings-section {
    background: #fffaf0;
    padding: 1.5rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    border: 1px solid #f5deb3;
}

.export-section h3,
.import-section h3,
.stats-section h3,
.settings-section h3 {
    color: #8b0000;
    margin-bottom: 1rem;
}

.export-section h4,
.settings-section h4 {
    color: #8b0000;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

/* GitHub Status */
#github-status {
    padding: 0.8rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

#github-status a {
    color: #c41e3a;
    text-decoration: underline;
}

.github-status.connected {
    background: #d4edda;
    border-left: 4px solid #28a745;
    color: #155724;
}

.github-status.disconnected {
    background: #f8d7da;
    border-left: 4px solid #dc3545;
    color: #721c24;
}

.github-actions {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.sync-status {
    display: none;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 4px;
}

.sync-progress {
    color: #856404;
    background: #fff3cd;
    padding: 0.8rem;
    border-radius: 4px;
}

.sync-success {
    color: #155724;
    background: #d4edda;
    padding: 0.8rem;
    border-radius: 4px;
}

.sync-error {
    color: #721c24;
    background: #f8d7da;
    padding: 0.8rem;
    border-radius: 4px;
}

/* GitHub History */
.history-modal-content h3 {
    margin-bottom: 1rem;
}

.commit-list {
    list-style: none;
    padding: 0;
}

.commit-item {
    background: white;
    padding: 1rem;
    margin-bottom: 0.8rem;
    border-radius: 4px;
    border-left: 3px solid #c41e3a;
}

.commit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.commit-sha {
    font-family: monospace;
    background: #fffaf0;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.85rem;
    color: #7f8c8d;
}

.commit-meta {
    font-size: 0.85rem;
    color: #7f8c8d;
    margin-bottom: 0.5rem;
}

.commit-link {
    font-size: 0.85rem;
    color: #c41e3a;
    text-decoration: none;
}

.commit-link:hover {
    text-decoration: underline;
}

/* Settings */
.github-setup ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
}

.github-setup ol li {
    margin-bottom: 0.5rem;
}

.settings-form {
    background: white;
    padding: 1.5rem;
    border-radius: 6px;
}

.settings-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}

.btn-danger {
    background: #e74c3c !important;
}

.btn-danger:hover {
    background: #c0392b !important;
}

.connection-status {
    display: none;
    margin-top: 1rem;
}

.status-progress {
    color: #856404;
    background: #fff3cd;
    padding: 0.8rem;
    border-radius: 4px;
}

.status-success {
    color: #155724;
    background: #d4edda;
    padding: 0.8rem;
    border-radius: 4px;
}

.status-error {
    color: #721c24;
    background: #f8d7da;
    padding: 0.8rem;
    border-radius: 4px;
}

#btn-export-json,
#btn-import-json,
#btn-push-github,
#btn-pull-github,
#btn-view-history,
#btn-save-settings,
#btn-test-connection,
#btn-clear-settings {
    padding: 0.8rem 1.5rem;
    background: #c41e3a;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95rem;
    margin-top: 0.5rem;
}

#btn-export-json:hover,
#btn-import-json:hover,
#btn-push-github:hover,
#btn-pull-github:hover,
#btn-view-history:hover,
#btn-save-settings:hover,
#btn-test-connection:hover {
    background: #9b1b2e;
}

#btn-push-github:disabled,
#btn-pull-github:disabled {
    background: #95a5a6;
    cursor: not-allowed;
}

#btn-view-history {
    background: #95a5a6;
}

#btn-view-history:hover {
    background: #7f8c8d;
}

#import-file {
    display: block;
    margin-top: 0.5rem;
    padding: 0.5rem;
}

#stats-display {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.stat-card {
    background: white;
    padding: 1rem;
    border-radius: 4px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #f5deb3;
}

.stat-card .number {
    font-size: 2rem;
    font-weight: bold;
    color: #c41e3a;
}

.stat-card .label {
    color: #7f8c8d;
    font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .header-logo {
        height: 50px;
    }

    header h1 {
        font-size: 1.2rem;
    }

    .search-form {
        grid-template-columns: 1fr;
    }

    .search-form .phonetic-option {
        grid-column: 1;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .source-fields {
        grid-template-columns: 1fr;
    }

    .life-event label {
        display: block;
        margin-right: 0;
    }

    .life-event input[type="number"],
    .life-event select {
        width: 100%;
    }

    .suggestion-actions,
    .github-actions,
    .settings-actions {
        flex-direction: column;
    }

    .btn-view-suggestion,
    .btn-load-suggestion {
        width: 100%;
    }

    #btn-push-github,
    #btn-pull-github,
    #btn-view-history {
        width: 100%;
    }
}

/* Utility Classes */
.text-muted {
    color: #7f8c8d;
}

.text-primary {
    color: #c41e3a;
}

.text-danger {
    color: #e74c3c;
}

.mb-1 {
    margin-bottom: 0.5rem;
}

.mb-2 {
    margin-bottom: 1rem;
}

.mt-1 {
    margin-top: 0.5rem;
}

.mt-2 {
    margin-top: 1rem;
}

/* ── Auto-sync banner ─────────────────────────────────────────────────────── */

.autosync-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    gap: 1rem;
}

.autosync-banner #autosync-dismiss {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.3rem;
    line-height: 1;
    cursor: pointer;
    opacity: 0.7;
    padding: 0 0.2rem;
    flex-shrink: 0;
}

.autosync-banner #autosync-dismiss:hover {
    opacity: 1;
}

.autosync-progress {
    background: #2c3e50;
    color: #ecf0f1;
}

.autosync-success {
    background: #27ae60;
    color: #fff;
}

.autosync-info {
    background: #2980b9;
    color: #fff;
}

.autosync-conflict {
    background: #e67e22;
    color: #fff;
}

.autosync-error {
    background: #c0392b;
    color: #fff;
}

/* ── Conflict resolution modal ────────────────────────────────────────────── */

.conflict-modal-content {
    max-width: 980px;
    padding: 0;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
}

.conflict-modal-header {
    padding: 1.5rem 2rem 1rem;
    border-bottom: 1px solid #e0e0e0;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
}

.conflict-modal-header h2 {
    color: #e67e22;
    margin: 0 0 0.4rem 0;
    font-size: 1.3rem;
}

.conflict-intro {
    margin: 0;
    color: #555;
    font-size: 0.9rem;
}

.conflict-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.conflict-modal-footer {
    padding: 1rem 2rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 1rem;
    align-items: center;
    background: #fafafa;
    position: sticky;
    bottom: 0;
}

/* Individual conflict card */

.conflict-item {
    border: 2px solid #e67e22;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
}

.conflict-item.conflict-resolved {
    border-color: #27ae60;
    background: #f0faf4;
}

.conflict-header {
    background: #fdf3e7;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.conflict-item.conflict-resolved .conflict-header {
    background: #e8f8ee;
}

.conflict-header strong {
    font-size: 1.05rem;
    color: #2c3e50;
}

.conflict-uuid {
    font-size: 0.75rem;
    color: #888;
    font-family: monospace;
    word-break: break-all;
}

.conflict-resolved-badge {
    padding: 0.5rem 1rem;
    color: #27ae60;
    font-weight: 600;
    font-size: 0.95rem;
    display: inline-block;
}

.conflict-undo-btn {
    margin: 0 1rem 0.75rem;
    background: none;
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    font-size: 0.85rem;
    color: #555;
    display: block;
}

.conflict-undo-btn:hover {
    background: #eee;
}

.conflict-timestamps {
    display: flex;
    gap: 2rem;
    padding: 0.5rem 1rem;
    background: #f9f9f9;
    font-size: 0.82rem;
    color: #666;
    flex-wrap: wrap;
}

/* Diff table */

.conflict-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
}

.conflict-table thead tr {
    background: #f0f0f0;
}

.conflict-table th {
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-weight: 600;
    color: #444;
    border-bottom: 2px solid #ddd;
}

.conflict-table th:first-child {
    width: 22%;
}

.conflict-table th:nth-child(2),
.conflict-table th:nth-child(3) {
    width: 39%;
}

.conflict-table td {
    padding: 0.45rem 0.75rem;
    border-bottom: 1px solid #eee;
    vertical-align: top;
}

.conflict-field-name {
    font-weight: 500;
    color: #555;
    white-space: nowrap;
}

.conflict-local {
    background: #fff8e1;
    color: #5d4037;
    word-break: break-word;
}

.conflict-remote {
    background: #e3f2fd;
    color: #0d47a1;
    word-break: break-word;
}

.conflict-complex {
    font-style: italic;
    font-size: 0.82rem;
    color: #777;
}

.conflict-no-scalar-diff {
    padding: 0.75rem 1rem;
    color: #888;
    font-style: italic;
    font-size: 0.88rem;
}

/* Choice buttons */

.conflict-actions {
    display: flex;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: #fafafa;
    border-top: 1px solid #eee;
    flex-wrap: wrap;
}

.conflict-btn {
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition:
        background 0.15s,
        transform 0.1s;
}

.conflict-btn:hover {
    transform: translateY(-1px);
}

.conflict-btn-local {
    background: #e67e22;
    color: #fff;
}

.conflict-btn-local:hover {
    background: #d35400;
}

.conflict-btn-remote {
    background: #2980b9;
    color: #fff;
}

.conflict-btn-remote:hover {
    background: #1a6a9a;
}

/* Footer buttons */

.conflict-apply-btn {
    background: #27ae60;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 0.65rem 1.8rem;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
}

.conflict-apply-btn:hover:not(:disabled) {
    background: #219a52;
}

.conflict-apply-btn:disabled {
    background: #aaa;
    cursor: not-allowed;
}

.conflict-skip-btn {
    background: none;
    border: 1px solid #aaa;
    border-radius: 5px;
    padding: 0.65rem 1.4rem;
    font-size: 0.9rem;
    cursor: pointer;
    color: #555;
}

.conflict-skip-btn:hover {
    background: #eee;
}

/* Responsive adjustments */

@media (max-width: 768px) {
    .conflict-table th:first-child {
        width: 30%;
    }
    .conflict-table th:nth-child(2),
    .conflict-table th:nth-child(3) {
        width: 35%;
    }

    .conflict-modal-header,
    .conflict-modal-body,
    .conflict-modal-footer {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .conflict-timestamps {
        flex-direction: column;
        gap: 0.3rem;
    }

    .autosync-banner {
        font-size: 0.82rem;
    }
}

```


## Assistant

Now let's verify there are no diagnostics:

**Tool Call: Check project diagnostics**
Status: Completed

No errors or warnings found in the project.

## Assistant

Let me do a quick review of the most critical integration points — the `autoSync` conflict detection logic and the `_showConflictModal` apply path — to make sure the "keep remote" force-upsert works correctly even when the local record has a newer `modifiedAt`:

**Tool Call: Read file `scripts/github-sync.js` (lines 540-660)**
Status: Completed

```webapp-prosopography/scripts/github-sync.js
          "<span><strong>Remote modified:</strong> " +
          self._fmtDate(remote.modifiedAt) +
          "</span>";
        section.appendChild(tsRow);

        // ── Differing fields table ──
        var diffingFields = self._COMPARABLE_FIELDS.filter(function (f) {
          return String(local[f.key] || "") !== String(remote[f.key] || "");
        });

        // Also flag complex fields that differ
        var complexDiffs = [];
        ["nameVariants", "attestations", "relationships", "occupations", "lifeEvents"].forEach(
          function (key) {
            var lv = JSON.stringify(local[key] || null);
            var rv = JSON.stringify(remote[key] || null);
            if (lv !== rv) complexDiffs.push(key);
          },
        );

        if (diffingFields.length === 0 && complexDiffs.length === 0) {
          var noDiff = document.createElement("p");
          noDiff.className = "conflict-no-scalar-diff";
          noDiff.textContent = "No scalar field differences detected (complex fields may differ).";
          section.appendChild(noDiff);
        } else {
          var table = document.createElement("table");
          table.className = "conflict-table";
          table.innerHTML =
            "<thead><tr>" +
            "<th>Field</th>" +
            "<th>Local value</th>" +
            "<th>Remote value</th>" +
            "</tr></thead>";
          var tbody = document.createElement("tbody");

          diffingFields.forEach(function (f) {
            var tr = document.createElement("tr");
            tr.innerHTML =
              "<td class='conflict-field-name'>" +
              f.label +
              "</td>" +
              "<td class='conflict-local'>" +
              self._safeHtml(String(local[f.key] || "—")) +
              "</td>" +
              "<td class='conflict-remote'>" +
              self._safeHtml(String(remote[f.key] || "—")) +
              "</td>";
            tbody.appendChild(tr);
          });

          if (complexDiffs.length > 0) {
            var labels = {
              nameVariants: "Name Variants",
              attestations: "Attestations",
              relationships: "Relationships",
              occupations: "Occupations",
              lifeEvents: "Life Events",
            };
            complexDiffs.forEach(function (key) {
              var tr = document.createElement("tr");
              var lCount = self._complexCount(local[key]);
              var rCount = self._complexCount(remote[key]);
              tr.innerHTML =
                "<td class='conflict-field-name'>" +
                (labels[key] || key) +
                "</td>" +
                "<td class='conflict-local conflict-complex'>" +
                lCount +
                "</td>" +
                "<td class='conflict-remote conflict-complex'>" +
                rCount +
                "</td>";
              tbody.appendChild(tr);
            });
          }

          table.appendChild(tbody);
          section.appendChild(table);
        }

        // ── Choice buttons ──
        var actions = document.createElement("div");
        actions.className = "conflict-actions";

        var keepLocalBtn = document.createElement("button");
        keepLocalBtn.className = "conflict-btn conflict-btn-local";
        keepLocalBtn.innerHTML = "&#8592; Keep Local";
        keepLocalBtn.title = "Keep the locally-modified version and overwrite GitHub";
        keepLocalBtn.addEventListener("click", function () {
          resolutions[idx].choice = "local";
          renderAll();
          updateApplyBtn();
        });

        var keepRemoteBtn = document.createElement("button");
        keepRemoteBtn.className = "conflict-btn conflict-btn-remote";
        keepRemoteBtn.innerHTML = "Keep Remote &#8594;";
        keepRemoteBtn.title = "Accept the GitHub version and overwrite local";
        keepRemoteBtn.addEventListener("click", function () {
          resolutions[idx].choice = "remote";
          renderAll();
          updateApplyBtn();
        });

        actions.appendChild(keepLocalBtn);
        actions.appendChild(keepRemoteBtn);
        section.appendChild(actions);
        body.appendChild(section);
      });
    }

    var applyBtn = document.getElementById("conflict-apply-btn");
    var skipBtn = document.getElementById("conflict-skip-btn");

    function updateApplyBtn() {
      if (!applyBtn) return;
      var allResolved = resolutions.every(function (r) {
        return r.choice !== null;
      });
      applyBtn.disabled = !allResolved;

```


**Tool Call: Read file `scripts/github-sync.js` (lines 660-775)**
Status: Completed

```webapp-prosopography/scripts/github-sync.js
      applyBtn.disabled = !allResolved;
      applyBtn.title = allResolved ? "Apply all resolutions" : "Resolve all conflicts first";
    }

    renderAll();
    updateApplyBtn();
    modal.classList.add("active");

    // ── Apply button ──
    if (applyBtn) {
      // Remove stale listener
      var newApply = applyBtn.cloneNode(true);
      applyBtn.parentNode.replaceChild(newApply, applyBtn);

      newApply.addEventListener("click", function () {
        newApply.disabled = true;
        newApply.textContent = "Applying…";

        var chain = conflicts.reduce(function (p, pair, idx) {
          return p.then(function () {
            var choice = resolutions[idx].choice;
            if (!choice) return;

            if (choice === "remote") {
              // Overwrite local with remote version
              return Database.upsertPerson(
                Object.assign({}, pair.remote, { modifiedAt: pair.remote.modifiedAt }),
              ).then(function () {
                // Force-update by bumping modifiedAt to remote's value
                // upsertPerson already handles this if remote is "newer"
              });
            } else {
              // choice === "local" → push local to GitHub
              var filePath = self.config.folder + "/" + pair.local.uuid + ".json";
              var content = JSON.stringify(pair.local, null, 2);
              var sha = pair.remote._remoteFileSha || null;
              var msg =
                "Resolve conflict: keep local for " +
                pair.local.uuid +
                " (" +
                (pair.local.standardizedName || "unknown") +
                ")";
              return self._putFile(filePath, content, msg, sha).catch(function (err) {
                console.warn("Failed to push local resolution for " + pair.local.uuid, err);
              });
            }
          });
        }, Promise.resolve());

        chain.then(function () {
          modal.classList.remove("active");
          UI.displayStatistics();
          UI.displayBrowseResults();

          var banner = document.getElementById("autosync-banner");
          var bannerMsg = document.getElementById("autosync-msg");
          if (banner && bannerMsg) {
            bannerMsg.textContent = "All conflicts resolved.";
            banner.className = "autosync-banner autosync-success";
            banner.style.display = "flex";
            setTimeout(function () {
              banner.style.display = "none";
            }, 4000);
          }
        });
      });
    }

    // ── Skip button ──
    if (skipBtn) {
      var newSkip = skipBtn.cloneNode(true);
      skipBtn.parentNode.replaceChild(newSkip, skipBtn);

      newSkip.addEventListener("click", function () {
        modal.classList.remove("active");
      });
    }

    // Close on backdrop click
    modal.onclick = function (e) {
      if (e.target === modal) modal.classList.remove("active");
    };
  },

  // ── Conflict helpers ───────────────────────────────────────────────────────

  _fmtDate: function (iso) {
    if (!iso) return "unknown";
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso;
    }
  },

  _safeHtml: function (str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  _complexCount: function (val) {
    if (!val) return "—";
    if (Array.isArray(val)) return val.length + " item(s)";
    if (typeof val === "object") {
      var keys = Object.keys(val).filter(function (k) {
        return val[k];
      });
      return keys.length + " field(s)";
    }
    return String(val);
  },

  // ── Push to GitHub ─────────────────────────────────────────────────────────

```


## Assistant

I can see one issue: when the user chooses "keep remote", `upsertPerson` will **skip** the update if the local record has a newer `modifiedAt` (which it always does in a conflict). We need to use a direct write that bypasses the date check. Let me add a `forceUpdatePerson` method to the database and use it here:

**Tool Call: Read file `scripts/database.js` (lines 175-250)**
Status: Completed

```webapp-prosopography/scripts/database.js
    });
  },

  // Returns Promise<boolean>
  updatePerson: function (id, updatedPerson) {
    var self = this;
    return this.getPersonByUUID(id).then(function (existing) {
      if (!existing) return false;

      var now = new Date().toISOString();
      updatedPerson.uuid = id;
      updatedPerson.id = id;
      updatedPerson.createdAt = existing.createdAt;
      updatedPerson.modifiedAt = now;
      updatedPerson.updatedAt = now;

      return self
        ._txWrite(function (store) {
          return store.put(updatedPerson);
        })
        .then(function () {
          return true;
        });
    });
  },

  // Returns Promise<void>
  deletePerson: function (id) {
    return this._txWrite(function (store) {
      return store.delete(id);
    });
  },

  // Upsert a person by uuid (used by import / GitHub pull).
  // If a record with this uuid already exists and the incoming modifiedAt is
  // not newer, the existing record is left untouched.
  // Returns Promise<'inserted'|'updated'|'skipped'>
  upsertPerson: function (person) {
    var self = this;
    if (!person.uuid) {
      person.uuid = this.generateUUID();
      person.id = person.uuid;
    }
    return this.getPersonByUUID(person.uuid).then(function (existing) {
      if (!existing) {
        // New record
        var now = new Date().toISOString();
        if (!person.modifiedAt) person.modifiedAt = now;
        if (!person.createdAt) person.createdAt = now;
        person.id = person.uuid;
        return self
          ._txWrite(function (store) {
            return store.put(person);
          })
          .then(function () {
            return "inserted";
          });
      }

      // Existing record — only overwrite if incoming is newer
      var incomingDate = person.modifiedAt ? new Date(person.modifiedAt) : new Date(0);
      var existingDate = existing.modifiedAt ? new Date(existing.modifiedAt) : new Date(0);

      if (incomingDate <= existingDate) {
        return "skipped";
      }

      person.id = person.uuid;
      person.createdAt = existing.createdAt || person.createdAt;
      return self
        ._txWrite(function (store) {
          return store.put(person);
        })
        .then(function () {
          return "updated";
        });

```


**Tool Call: scripts/database.js**
Status: Completed

Diff: scripts/database.js
```
// Database Module - Handles all data storage and retrieval via IndexedDB
const Database = {
  DB_NAME: "prosopographyDB",
  DB_VERSION: 2,
  STORE_NAME: "persons",
  _db: null,

  // ── Helpers ──────────────────────────────────────────────────────────────

  // Generate a RFC-4122 v4 UUID
  generateUUID: function () {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older environments
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  // ── Initialisation ────────────────────────────────────────────────────────

  // Open (or upgrade) the IndexedDB database.
  // Returns a Promise that resolves with the IDBDatabase instance.
  open: function () {
    if (this._db) return Promise.resolve(this._db);

    var self = this;
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open(self.DB_NAME, self.DB_VERSION);

      request.onupgradeneeded = function (event) {
        var db = event.target.result;

        // Create the object store if it doesn't exist
        if (!db.objectStoreNames.contains(self.STORE_NAME)) {
          var store = db.createObjectStore(self.STORE_NAME, { keyPath: "uuid" });
          store.createIndex("standardizedName", "standardizedName", { unique: false });
          store.createIndex("modifiedAt", "modifiedAt", { unique: false });
          console.log("IndexedDB: object store created");
        } else {
          // Store already exists; make sure the modifiedAt index exists
          var tx = event.target.transaction;
          var store = tx.objectStore(self.STORE_NAME);
          if (!store.indexNames.contains("modifiedAt")) {
            store.createIndex("modifiedAt", "modifiedAt", { unique: false });
          }
        }

        // ── Migration: import existing localStorage data ───────────────
        var raw = localStorage.getItem("prosopographyDB");
        if (raw) {
          try {
            var legacy = JSON.parse(raw);
            var persons = legacy.persons || [];
            var tx2 = event.target.transaction;
            var migrateStore = tx2.objectStore(self.STORE_NAME);
            var now = new Date().toISOString();

            persons.forEach(function (person) {
              // Give each legacy record a UUID and modifiedAt if missing
              if (!person.uuid) {
                person.uuid = self.generateUUID();
              }
              if (!person.modifiedAt) {
                person.modifiedAt = person.updatedAt || person.createdAt || now;
              }
              migrateStore.put(person);
            });

            console.log("IndexedDB: migrated " + persons.length + " records from localStorage");
          } catch (e) {
            console.warn("IndexedDB: could not migrate localStorage data:", e);
          }
        }
      };

      request.onsuccess = function (event) {
        self._db = event.target.result;
        console.log("IndexedDB: opened successfully");
        resolve(self._db);
      };

      request.onerror = function (event) {
        console.error("IndexedDB: open error", event.target.error);
        reject(event.target.error);
      };
    });
  },

  // Convenience: run a callback inside a readwrite transaction on the persons store.
  // cb receives (store) and must return a request or null.
  // Returns a Promise.
  _txWrite: function (cb) {
    return this.open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(["persons"], "readwrite");
        var store = tx.objectStore("persons");
        var req = cb(store);
        if (req) {
          req.onsuccess = function () {
            resolve(req.result);
          };
          req.onerror = function () {
            reject(req.error);
          };
        } else {
          tx.oncomplete = function () {
            resolve();
          };
          tx.onerror = function () {
            reject(tx.error);
          };
        }
      });
    });
  },

  // Convenience: run a callback inside a readonly transaction.
  _txRead: function (cb) {
    return this.open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(["persons"], "readonly");
        var store = tx.objectStore("persons");
        var req = cb(store);
        req.onsuccess = function () {
          resolve(req.result);
        };
        req.onerror = function () {
          reject(req.error);
        };
      });
    });
  },

  // ── CRUD ──────────────────────────────────────────────────────────────────

  // Returns Promise<Person[]>
  getAllPersons: function () {
    return this._txRead(function (store) {
      return store.getAll();
    });
  },

  // Returns Promise<Person|undefined>
  getPersonByUUID: function (uuid) {
    return this._txRead(function (store) {
      return store.get(uuid);
    });
  },

  // Legacy alias used in older call-sites (id used to be a 'p'+timestamp string)
  // Now id === uuid.  Returns Promise<Person|undefined>
  getPersonById: function (id) {
    return this.getPersonByUUID(id);
  },

  // Returns Promise<string> — the new uuid
  addPerson: function (person) {
    var self = this;
    var now = new Date().toISOString();
    person.uuid = this.generateUUID();
    person.id = person.uuid; // keep id === uuid for compatibility
    person.createdAt = now;
    person.modifiedAt = now;
    // legacy field
    person.updatedAt = now;

    return this._txWrite(function (store) {
      return store.add(person);
    }).then(function () {
      return person.uuid;
    });
  },

  // Returns Promise<boolean>
  updatePerson: function (id, updatedPerson) {
    var self = this;
    return this.getPersonByUUID(id).then(function (existing) {
      if (!existing) return false;

      var now = new Date().toISOString();
      updatedPerson.uuid = id;
      updatedPerson.id = id;
      updatedPerson.createdAt = existing.createdAt;
      updatedPerson.modifiedAt = now;
      updatedPerson.updatedAt = now;

      return self
        ._txWrite(function (store) {
          return store.put(updatedPerson);
        })
        .then(function () {
          return true;
        });
    });
  },

  // Returns Promise<void>
  deletePerson: function (id) {
    return this._txWrite(function (store) {
      return store.delete(id);
    });
  },

  // Unconditionally write a person record to IndexedDB, bypassing the
  // modifiedAt guard in upsertPerson.  Used by conflict resolution when the
  // user explicitly chooses "keep remote" even though the local copy is newer.
  // Returns Promise<void>
  forcePutPerson: function (person) {
    var self = this;
    return this.getPersonByUUID(person.uuid).then(function (existing) {
      var record = Object.assign({}, person);
      record.uuid = person.uuid;
      record.id = person.uuid;
      // Preserve the original createdAt if we have it locally
      if (existing && existing.createdAt) {
        record.createdAt = existing.createdAt;
      }
      return self._txWrite(function (store) {
        return store.put(record);
      });
    });
  },

  // Upsert a person by uuid (used by import / GitHub pull).
  // If a record with this uuid already exists and the incoming modifiedAt is
  // not newer, the existing record is left untouched.
  // Returns Promise<'inserted'|'updated'|'skipped'>
  upsertPerson: function (person) {
    var self = this;
    if (!person.uuid) {
      person.uuid = this.generateUUID();
      person.id = person.uuid;
    }
    return this.getPersonByUUID(person.uuid).then(function (existing) {
      if (!existing) {
        // New record
        var now = new Date().toISOString();
        if (!person.modifiedAt) person.modifiedAt = now;
        if (!person.createdAt) person.createdAt = now;
        person.id = person.uuid;
        return self
          ._txWrite(function (store) {
            return store.put(person);
          })
          .then(function () {
            return "inserted";
          });
      }

      // Existing record — only overwrite if incoming is newer
      var incomingDate = person.modifiedAt ? new Date(person.modifiedAt) : new Date(0);
      var existingDate = existing.modifiedAt ? new Date(existing.modifiedAt) : new Date(0);

      if (incomingDate <= existingDate) {
        return "skipped";
      }

      person.id = person.uuid;
      person.createdAt = existing.createdAt || person.createdAt;
      return self
        ._txWrite(function (store) {
          return store.put(person);
        })
        .then(function () {
          return "updated";
        });
    });
  },

  // ── Search ────────────────────────────────────────────────────────────────

  // Returns Promise<Person[]>
  searchPersons: function (criteria) {
    return this.getAllPersons().then(function (persons) {
      var results = persons;

      // Filter by name
      if (criteria.name) {
        var searchName = criteria.name.toLowerCase();

        if (criteria.usePhonetic) {
          var searchSoundex = Database.soundex(criteria.name);
          results = results.filter(function (person) {
            if (Database.soundex(person.standardizedName) === searchSoundex) return true;
            if (person.nameVariants) {
              return person.nameVariants.some(function (variant) {
                var fullName =
                  variant.fullName || (variant.firstName || "") + " " + (variant.lastName || "");
                return Database.soundex(fullName) === searchSoundex;
              });
            }
            return false;
          });
        } else {
          results = results.filter(function (person) {
            if (person.standardizedName.toLowerCase().indexOf(searchName) !== -1) return true;
            if (person.nameVariants) {
              return person.nameVariants.some(function (variant) {
                var fullName =
                  variant.fullName || (variant.firstName || "") + " " + (variant.lastName || "");
                return fullName.toLowerCase().indexOf(searchName) !== -1;
              });
            }
            return false;
          });
        }
      }

      // Filter by place
      if (criteria.place) {
        var searchPlace = criteria.place.toLowerCase();
        results = results.filter(function (person) {
          if (
            person.lifeEvents &&
            person.lifeEvents.birth &&
            person.lifeEvents.birth.place &&
            person.lifeEvents.birth.place.toLowerCase().indexOf(searchPlace) !== -1
          )
            return true;
          if (
            person.lifeEvents &&
            person.lifeEvents.death &&
            person.lifeEvents.death.place &&
            person.lifeEvents.death.place.toLowerCase().indexOf(searchPlace) !== -1
          )
            return true;
          if (person.attestations) {
            return person.attestations.some(function (att) {
              return att.place && att.place.toLowerCase().indexOf(searchPlace) !== -1;
            });
          }
          return false;
        });
      }

      // Filter by year
      if (criteria.year) {
        var searchYear = parseInt(criteria.year);
        results = results.filter(function (person) {
          if (
            person.lifeEvents &&
            person.lifeEvents.birth &&
            person.lifeEvents.birth.date &&
            person.lifeEvents.birth.date.year === searchYear
          )
            return true;
          if (
            person.lifeEvents &&
            person.lifeEvents.death &&
            person.lifeEvents.death.date &&
            person.lifeEvents.death.date.year === searchYear
          )
            return true;
          if (person.attestations) {
            return person.attestations.some(function (att) {
              return att.date && att.date.year === searchYear;
            });
          }
          return false;
        });
      }

      return results;
    });
  },

  // ── Soundex ───────────────────────────────────────────────────────────────

  soundex: function (name) {
    if (!name) return "";
    var s = name.toUpperCase();
    var a = s.split("");
    var f = a.shift();
    var r =
      f +
      a
        .map(function (char) {
          switch (char) {
            case "B":
            case "F":
            case "P":
            case "V":
              return "1";
            case "C":
            case "G":
            case "J":
            case "K":
            case "Q":
            case "S":
            case "X":
            case "Z":
              return "2";
            case "D":
            case "T":
              return "3";
            case "L":
              return "4";
            case "M":
            case "N":
              return "5";
            case "R":
              return "6";
            default:
              return "";
          }
        })
        .join("");
    r = r.replace(/(\d)\1+/g, "$1");
    return (r + "000").substring(0, 4);
  },

  // ── Statistics ────────────────────────────────────────────────────────────

  // Returns Promise<object>
  getStatistics: function () {
    return this.getAllPersons().then(function (persons) {
      var stats = {
        totalPersons: persons.length,
        totalAttestations: 0,
        totalRelationships: 0,
        personsWithBirth: 0,
        personsWithDeath: 0,
        uniqueNationalities: 0,
        uniqueReligions: 0,
        maleCount: 0,
        femaleCount: 0,
        unknownGenderCount: 0,
      };

      var nationalitiesSet = new Set();
      var religionsSet = new Set();

      persons.forEach(function (person) {
        if (person.attestations) stats.totalAttestations += person.attestations.length;
        if (person.relationships) stats.totalRelationships += person.relationships.length;
        if (person.lifeEvents && person.lifeEvents.birth) stats.personsWithBirth++;
        if (person.lifeEvents && person.lifeEvents.death) stats.personsWithDeath++;
        if (person.nationality) nationalitiesSet.add(person.nationality);
        if (person.religion) religionsSet.add(person.religion);

        if (person.gender === "male") stats.maleCount++;
        else if (person.gender === "female") stats.femaleCount++;
        else stats.unknownGenderCount++;
      });

      stats.uniqueNationalities = nationalitiesSet.size;
      stats.uniqueReligions = religionsSet.size;
      return stats;
    });
  },

  // ── Export / Import (local JSON) ─────────────────────────────────────────

  // Returns Promise<string>  (pretty-printed JSON)
  exportJSON: function () {
    return this.getAllPersons().then(function (persons) {
      var db = {
        persons: persons,
        exportedAt: new Date().toISOString(),
        version: "2.0",
      };
      return JSON.stringify(db, null, 2);
    });
  },

  // Returns Promise<boolean>
  importJSON: function (jsonString) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var data;
      try {
        data = JSON.parse(jsonString);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return resolve(false);
      }

      if (!data.persons || !Array.isArray(data.persons)) {
        console.error("Invalid database format");
        return resolve(false);
      }

      // Upsert every record (respects modifiedAt ordering)
      var promises = data.persons.map(function (person) {
        return self.upsertPerson(person);
      });

      Promise.all(promises)
        .then(function () {
          resolve(true);
        })
        .catch(function (e) {
          console.error("Error importing records:", e);
          resolve(false);
        });
    });
  },
};

// Open the database eagerly so the first user interaction feels instant
Database.open().catch(function (e) {
  console.error("Failed to open IndexedDB:", e);
});

console.log("Database module loaded (IndexedDB)");

```


## Assistant

Now update the conflict apply handler to use `forcePutPerson`:

**Tool Call: scripts/github-sync.js**
Status: Completed

Diff: scripts/github-sync.js
```
// GitHub Sync Module - Per-record sync with GitHub repository
// Each person record is stored as records/<uuid>.json
// modifiedAt is compared to avoid unnecessary writes/overwrites

var GitHubSync = {
  config: {
    token: "",
    owner: "lvansnippenburg",
    repo: "JsonDataStorage",
    folder: "prosopography-records",
    branch: "main",
  },

  // ── Initialisation ─────────────────────────────────────────────────────────

  init: function () {
    this.loadSettings();
    this.updateStatus();
    this.bindEvents();
  },

  // ── Settings ───────────────────────────────────────────────────────────────

  loadSettings: function () {
    var token = localStorage.getItem("github_token");
    var folder = localStorage.getItem("github_folder");
    var branch = localStorage.getItem("github_branch");

    if (token) this.config.token = token;
    if (folder) this.config.folder = folder;
    if (branch) this.config.branch = branch;

    if (document.getElementById("github-token"))
      document.getElementById("github-token").value = token || "";
    if (document.getElementById("github-folder"))
      document.getElementById("github-folder").value = folder || this.config.folder;
    if (document.getElementById("github-branch"))
      document.getElementById("github-branch").value = branch || "main";
  },

  saveSettings: function () {
    var token = document.getElementById("github-token").value.trim();
    var folder = document.getElementById("github-folder").value.trim();
    var branch = document.getElementById("github-branch").value.trim();

    if (token) {
      localStorage.setItem("github_token", token);
      this.config.token = token;
    }
    if (folder) {
      localStorage.setItem("github_folder", folder);
      this.config.folder = folder;
    }
    if (branch) {
      localStorage.setItem("github_branch", branch);
      this.config.branch = branch;
    }

    this.updateStatus();
    alert("GitHub settings saved successfully");
  },

  clearSettings: function () {
    if (!confirm("Are you sure you want to clear GitHub settings?")) return;

    ["github_token", "github_folder", "github_branch"].forEach(function (k) {
      localStorage.removeItem(k);
    });

    this.config.token = "";
    this.config.folder = "prosopography-records";
    this.config.branch = "main";

    if (document.getElementById("github-token")) document.getElementById("github-token").value = "";
    if (document.getElementById("github-folder"))
      document.getElementById("github-folder").value = this.config.folder;
    if (document.getElementById("github-branch"))
      document.getElementById("github-branch").value = "main";

    this.updateStatus();
    alert("GitHub settings cleared");
  },

  // ── Status display ─────────────────────────────────────────────────────────

  updateStatus: function () {
    var statusEl = document.getElementById("github-status");
    var pushBtn = document.getElementById("btn-push-github");
    var pullBtn = document.getElementById("btn-pull-github");

    if (!statusEl) return;

    if (this.config.token) {
      statusEl.innerHTML =
        "&#10003; Connected to GitHub repository: <strong>" +
        this.config.owner +
        "/" +
        this.config.repo +
        "</strong><br>" +
        "Folder: <code>" +
        this.config.folder +
        "/</code> &nbsp;(branch: " +
        this.config.branch +
        ")";
      statusEl.className = "github-status connected";
      if (pushBtn) pushBtn.disabled = false;
      if (pullBtn) pullBtn.disabled = false;
    } else {
      statusEl.innerHTML = "&#10007; Not connected to GitHub. Please configure settings below.";
      statusEl.className = "github-status disconnected";
      if (pushBtn) pushBtn.disabled = true;
      if (pullBtn) pullBtn.disabled = true;
    }
  },

  // ── Event binding ──────────────────────────────────────────────────────────

  bindEvents: function () {
    var self = this;

    var bind = function (id, fn) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", fn.bind(self));
    };

    bind("btn-save-settings", self.saveSettings);
    bind("btn-clear-settings", self.clearSettings);
    bind("btn-test-connection", self.testConnection);
    bind("btn-push-github", self.pushToGitHub);
    bind("btn-pull-github", self.pullFromGitHub);
    bind("btn-view-history", self.viewHistory);
  },

  // ── GitHub API helpers ─────────────────────────────────────────────────────

  _contentsUrl: function (path) {
    return (
      "https://api.github.com/repos/" +
      this.config.owner +
      "/" +
      this.config.repo +
      "/contents/" +
      path
    );
  },

  _authHeaders: function () {
    return {
      Authorization: "token " + this.config.token,
      Accept: "application/vnd.github.v3+json",
    };
  },

  // Fetch a single file's metadata (sha + content).
  // Resolves with GitHub API object or null when the file does not exist.
  _getRemoteFile: function (filePath) {
    var url = this._contentsUrl(filePath) + "?ref=" + this.config.branch;
    return fetch(url, { headers: this._authHeaders() }).then(function (res) {
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("GET " + filePath + " failed: " + res.statusText);
      return res.json();
    });
  },

  // Decode a GitHub contents API response body to a string.
  _decode: function (data) {
    return decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
  },

  // Encode a string for the GitHub contents API.
  _encode: function (str) {
    return btoa(unescape(encodeURIComponent(str)));
  },

  // PUT (create or update) a single file. sha required for updates.
  _putFile: function (filePath, content, message, sha) {
    var body = {
      message: message,
      content: this._encode(content),
      branch: this.config.branch,
    };
    if (sha) body.sha = sha;

    return fetch(this._contentsUrl(filePath), {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, this._authHeaders()),
      body: JSON.stringify(body),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (d) {
          throw new Error(d.message || "PUT failed for " + filePath);
        });
      }
      return res.json();
    });
  },

  // DELETE a single file.
  _deleteFile: function (filePath, sha, message) {
    var body = { message: message, sha: sha, branch: this.config.branch };
    return fetch(this._contentsUrl(filePath), {
      method: "DELETE",
      headers: Object.assign({ "Content-Type": "application/json" }, this._authHeaders()),
      body: JSON.stringify(body),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (d) {
          throw new Error(d.message || "DELETE failed for " + filePath);
        });
      }
    });
  },

  // List all .json files inside the records folder.
  // Resolves with array of GitHub file objects, or [] when folder missing.
  _listRemoteRecords: function () {
    var url = this._contentsUrl(this.config.folder) + "?ref=" + this.config.branch;
    return fetch(url, { headers: this._authHeaders() })
      .then(function (res) {
        if (res.status === 404) return [];
        if (!res.ok) throw new Error("Could not list remote folder: " + res.statusText);
        return res.json();
      })
      .then(function (items) {
        return Array.isArray(items)
          ? items.filter(function (f) {
              return f.type === "file" && f.name.endsWith(".json");
            })
          : [];
      });
  },

  // ── Test connection ────────────────────────────────────────────────────────

  testConnection: function () {
    if (!this.config.token) {
      alert("Please enter a GitHub token first");
      return;
    }

    var statusEl = document.getElementById("connection-status");
    statusEl.innerHTML = '<div class="status-progress">Testing connection...</div>';
    statusEl.style.display = "block";

    fetch("https://api.github.com/repos/" + this.config.owner + "/" + this.config.repo, {
      headers: this._authHeaders(),
    })
      .then(function (res) {
        if (res.ok) {
          statusEl.innerHTML =
            '<div class="status-success">&#10003; Connection successful! Repository found.</div>';
        } else {
          statusEl.innerHTML =
            '<div class="status-error">&#10007; Connection failed: ' +
            res.status +
            " " +
            res.statusText +
            "</div>";
        }
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="status-error">&#10007; Connection error: ' + err.message + "</div>";
      });
  },

  // ── Auto-sync on launch ────────────────────────────────────────────────────

  // Called once at app start. Silently syncs with GitHub if a token is configured.
  // Workflow:
  //   1. List remote records
  //   2. For each remote UUID:
  //        - not local  → insert
  //        - local & remote same date → skip
  //        - local newer → queue for upload
  //        - remote newer → update local
  //        - both modified, timestamps differ in both directions → conflict
  //   3. For each local UUID not in remote → upload
  //   4. If conflicts remain → show conflict resolution modal
  autoSync: function () {
    if (!this.config.token) return; // silently skip if not configured

    var self = this;
    var banner = document.getElementById("autosync-banner");
    var bannerMsg = document.getElementById("autosync-msg");

    function showBanner(msg, type) {
      if (!banner) return;
      bannerMsg.textContent = msg;
      banner.className = "autosync-banner autosync-" + type;
      banner.style.display = "flex";
      if (type === "success" || type === "info") {
        setTimeout(function () {
          banner.style.display = "none";
        }, 5000);
      }
    }

    showBanner("Syncing with GitHub…", "progress");

    // Step 1 – fetch all remote records in parallel with local records
    Promise.all([Database.getAllPersons(), self._listRemoteRecords()])
      .then(function (results) {
        var localPersons = results[0];
        var remoteFiles = results[1];

        // Build lookup maps
        var localByUUID = {};
        localPersons.forEach(function (p) {
          if (p.uuid) localByUUID[p.uuid] = p;
        });

        var remoteByUUID = {};
        remoteFiles.forEach(function (f) {
          var uuid = f.name.replace(/\.json$/, "");
          remoteByUUID[uuid] = f;
        });

        // Fetch remote content for every UUID that exists remotely
        // (we need the actual record to compare dates / detect conflicts)
        var remoteUUIDs = Object.keys(remoteByUUID);
        var fetchRemoteContents = remoteUUIDs.map(function (uuid) {
          return self
            ._getRemoteFile(self.config.folder + "/" + uuid + ".json")
            .then(function (data) {
              if (!data) return null;
              try {
                var person = JSON.parse(self._decode(data));
                person._remoteFileSha = data.sha; // stash SHA for later PUT
                return person;
              } catch (e) {
                return null;
              }
            });
        });

        return Promise.all(fetchRemoteContents).then(function (remotePersons) {
          // Build uuid → remotePersonRecord map
          var remoteRecordByUUID = {};
          remotePersons.forEach(function (p) {
            if (p && p.uuid) remoteRecordByUUID[p.uuid] = p;
          });

          var toUpload = []; // { person, sha|null }  local → remote
          var conflicts = []; // { local, remote }
          var summary = { inserted: 0, updated: 0, uploaded: 0, skipped: 0, conflicts: 0 };

          // --- Evaluate remote records ---
          var applyRemote = remoteUUIDs.reduce(function (chain, uuid) {
            return chain.then(function () {
              var remote = remoteRecordByUUID[uuid];
              if (!remote) return; // fetch failed, skip

              var local = localByUUID[uuid];

              if (!local) {
                // Remote only → insert locally
                return Database.upsertPerson(remote).then(function () {
                  summary.inserted++;
                });
              }

              var localDate = local.modifiedAt ? new Date(local.modifiedAt) : new Date(0);
              var remoteDate = remote.modifiedAt ? new Date(remote.modifiedAt) : new Date(0);

              if (localDate.getTime() === remoteDate.getTime()) {
                summary.skipped++;
                return; // identical, nothing to do
              }

              if (remoteDate > localDate) {
                // Remote is simply newer → update local
                return Database.upsertPerson(remote).then(function () {
                  summary.updated++;
                });
              }

              // localDate > remoteDate → local is newer; but we need to check
              // whether the remote was independently edited (true conflict) or
              // was just never pushed (local-only edit).
              // We detect a true conflict by checking whether remote.modifiedAt
              // differs from the last known-pushed timestamp stored locally.
              // As a pragmatic heuristic: if the remote record exists and its
              // modifiedAt is more recent than local.createdAt, it was edited
              // on the remote side too → conflict.
              var localCreated = local.createdAt ? new Date(local.createdAt) : new Date(0);
              if (remoteDate > localCreated) {
                // Both sides have been edited after the record was first created → conflict
                conflicts.push({ local: local, remote: remote });
                summary.conflicts++;
              } else {
                // Remote is just the original unedited version → safe to overwrite
                toUpload.push({
                  person: local,
                  sha: remote._remoteFileSha || null,
                  filePath: self.config.folder + "/" + uuid + ".json",
                });
              }
            });
          }, Promise.resolve());

          return applyRemote.then(function () {
            // --- Local-only records (not on remote) → upload ---
            localPersons.forEach(function (local) {
              if (!local.uuid) return;
              if (!remoteRecordByUUID[local.uuid]) {
                toUpload.push({
                  person: local,
                  sha: null,
                  filePath: self.config.folder + "/" + local.uuid + ".json",
                });
              }
            });

            // Upload all queued records sequentially
            var uploadChain = toUpload.reduce(function (chain, item) {
              return chain.then(function () {
                var content = JSON.stringify(item.person, null, 2);
                var msg =
                  (item.sha ? "Update" : "Add") +
                  " record " +
                  item.person.uuid +
                  " (" +
                  (item.person.standardizedName || "unknown") +
                  ")";
                return self
                  ._putFile(item.filePath, content, msg, item.sha)
                  .then(function () {
                    summary.uploaded++;
                  })
                  .catch(function (err) {
                    console.warn("autoSync: failed to upload " + item.person.uuid, err);
                  });
              });
            }, Promise.resolve());

            return uploadChain.then(function () {
              // Refresh UI counts
              UI.displayStatistics();
              UI.displayBrowseResults();

              if (conflicts.length > 0) {
                showBanner(conflicts.length + " conflict(s) need your attention.", "conflict");
                self._showConflictModal(conflicts);
              } else {
                var parts = [];
                if (summary.inserted) parts.push(summary.inserted + " imported");
                if (summary.updated) parts.push(summary.updated + " updated");
                if (summary.uploaded) parts.push(summary.uploaded + " uploaded");
                if (summary.skipped) parts.push(summary.skipped + " unchanged");
                var msg = parts.length
                  ? "GitHub sync: " + parts.join(", ") + "."
                  : "GitHub sync: already up to date.";
                showBanner(msg, "success");
              }
            });
          });
        });
      })
      .catch(function (err) {
        console.warn("autoSync failed:", err);
        showBanner("GitHub sync failed: " + err.message, "error");
      });
  },

  // ── Conflict resolution modal ──────────────────────────────────────────────

  // Scalar fields that are worth comparing individually.
  _COMPARABLE_FIELDS: [
    { key: "standardizedName", label: "Standardized Name" },
    { key: "nationality", label: "Nationality" },
    { key: "gender", label: "Gender" },
    { key: "religion", label: "Religion" },
    { key: "religionCertainty", label: "Religion Certainty" },
    { key: "biography", label: "Biography / Notes" },
    { key: "modifiedAt", label: "Last Modified" },
  ],

  _showConflictModal: function (conflicts) {
    var self = this;
    var modal = document.getElementById("conflict-modal");
    var body = document.getElementById("conflict-modal-body");
    if (!modal || !body) return;

    // Store pending resolutions: array parallel to conflicts[]
    // Each entry: { choice: 'local'|'remote'|null }
    var resolutions = conflicts.map(function () {
      return { choice: null };
    });

    function renderAll() {
      body.innerHTML = "";

      conflicts.forEach(function (pair, idx) {
        var local = pair.local;
        var remote = pair.remote;
        var res = resolutions[idx];

        var section = document.createElement("div");
        section.className = "conflict-item" + (res.choice ? " conflict-resolved" : "");

        // ── Header ──
        var header = document.createElement("div");
        header.className = "conflict-header";
        header.innerHTML =
          "<strong>" +
          (local.standardizedName || remote.standardizedName || "Unknown") +
          "</strong>" +
          '<span class="conflict-uuid">UUID: ' +
          (local.uuid || "") +
          "</span>";
        section.appendChild(header);

        if (res.choice) {
          var badge = document.createElement("div");
          badge.className = "conflict-resolved-badge";
          badge.textContent =
            res.choice === "local" ? "✓ Keeping local version" : "✓ Keeping remote version";
          section.appendChild(badge);

          var undoBtn = document.createElement("button");
          undoBtn.className = "conflict-undo-btn";
          undoBtn.textContent = "Undo";
          undoBtn.addEventListener("click", function () {
            resolutions[idx].choice = null;
            renderAll();
          });
          section.appendChild(undoBtn);
          body.appendChild(section);
          return;
        }

        // ── Timestamps ──
        var tsRow = document.createElement("div");
        tsRow.className = "conflict-timestamps";
        tsRow.innerHTML =
          "<span><strong>Local modified:</strong> " +
          self._fmtDate(local.modifiedAt) +
          "</span>" +
          "<span><strong>Remote modified:</strong> " +
          self._fmtDate(remote.modifiedAt) +
          "</span>";
        section.appendChild(tsRow);

        // ── Differing fields table ──
        var diffingFields = self._COMPARABLE_FIELDS.filter(function (f) {
          return String(local[f.key] || "") !== String(remote[f.key] || "");
        });

        // Also flag complex fields that differ
        var complexDiffs = [];
        ["nameVariants", "attestations", "relationships", "occupations", "lifeEvents"].forEach(
          function (key) {
            var lv = JSON.stringify(local[key] || null);
            var rv = JSON.stringify(remote[key] || null);
            if (lv !== rv) complexDiffs.push(key);
          },
        );

        if (diffingFields.length === 0 && complexDiffs.length === 0) {
          var noDiff = document.createElement("p");
          noDiff.className = "conflict-no-scalar-diff";
          noDiff.textContent = "No scalar field differences detected (complex fields may differ).";
          section.appendChild(noDiff);
        } else {
          var table = document.createElement("table");
          table.className = "conflict-table";
          table.innerHTML =
            "<thead><tr>" +
            "<th>Field</th>" +
            "<th>Local value</th>" +
            "<th>Remote value</th>" +
            "</tr></thead>";
          var tbody = document.createElement("tbody");

          diffingFields.forEach(function (f) {
            var tr = document.createElement("tr");
            tr.innerHTML =
              "<td class='conflict-field-name'>" +
              f.label +
              "</td>" +
              "<td class='conflict-local'>" +
              self._safeHtml(String(local[f.key] || "—")) +
              "</td>" +
              "<td class='conflict-remote'>" +
              self._safeHtml(String(remote[f.key] || "—")) +
              "</td>";
            tbody.appendChild(tr);
          });

          if (complexDiffs.length > 0) {
            var labels = {
              nameVariants: "Name Variants",
              attestations: "Attestations",
              relationships: "Relationships",
              occupations: "Occupations",
              lifeEvents: "Life Events",
            };
            complexDiffs.forEach(function (key) {
              var tr = document.createElement("tr");
              var lCount = self._complexCount(local[key]);
              var rCount = self._complexCount(remote[key]);
              tr.innerHTML =
                "<td class='conflict-field-name'>" +
                (labels[key] || key) +
                "</td>" +
                "<td class='conflict-local conflict-complex'>" +
                lCount +
                "</td>" +
                "<td class='conflict-remote conflict-complex'>" +
                rCount +
                "</td>";
              tbody.appendChild(tr);
            });
          }

          table.appendChild(tbody);
          section.appendChild(table);
        }

        // ── Choice buttons ──
        var actions = document.createElement("div");
        actions.className = "conflict-actions";

        var keepLocalBtn = document.createElement("button");
        keepLocalBtn.className = "conflict-btn conflict-btn-local";
        keepLocalBtn.innerHTML = "&#8592; Keep Local";
        keepLocalBtn.title = "Keep the locally-modified version and overwrite GitHub";
        keepLocalBtn.addEventListener("click", function () {
          resolutions[idx].choice = "local";
          renderAll();
          updateApplyBtn();
        });

        var keepRemoteBtn = document.createElement("button");
        keepRemoteBtn.className = "conflict-btn conflict-btn-remote";
        keepRemoteBtn.innerHTML = "Keep Remote &#8594;";
        keepRemoteBtn.title = "Accept the GitHub version and overwrite local";
        keepRemoteBtn.addEventListener("click", function () {
          resolutions[idx].choice = "remote";
          renderAll();
          updateApplyBtn();
        });

        actions.appendChild(keepLocalBtn);
        actions.appendChild(keepRemoteBtn);
        section.appendChild(actions);
        body.appendChild(section);
      });
    }

    var applyBtn = document.getElementById("conflict-apply-btn");
    var skipBtn = document.getElementById("conflict-skip-btn");

    function updateApplyBtn() {
      if (!applyBtn) return;
      var allResolved = resolutions.every(function (r) {
        return r.choice !== null;
      });
      applyBtn.disabled = !allResolved;
      applyBtn.title = allResolved ? "Apply all resolutions" : "Resolve all conflicts first";
    }

    renderAll();
    updateApplyBtn();
    modal.classList.add("active");

    // ── Apply button ──
    if (applyBtn) {
      // Remove stale listener
      var newApply = applyBtn.cloneNode(true);
      applyBtn.parentNode.replaceChild(newApply, applyBtn);

      newApply.addEventListener("click", function () {
        newApply.disabled = true;
        newApply.textContent = "Applying…";

        var chain = conflicts.reduce(function (p, pair, idx) {
          return p.then(function () {
            var choice = resolutions[idx].choice;
            if (!choice) return;

            if (choice === "remote") {
              // Overwrite local with remote version unconditionally —
              // forcePutPerson bypasses the modifiedAt guard in upsertPerson
              // so even though the local record is "newer" (that's why it's
              // a conflict), the remote version is written as-is.
              return Database.forcePutPerson(Object.assign({}, pair.remote));
            } else {
              // choice === "local" → push local to GitHub
              var filePath = self.config.folder + "/" + pair.local.uuid + ".json";
              var content = JSON.stringify(pair.local, null, 2);
              var sha = pair.remote._remoteFileSha || null;
              var msg =
                "Resolve conflict: keep local for " +
                pair.local.uuid +
                " (" +
                (pair.local.standardizedName || "unknown") +
                ")";
              return self._putFile(filePath, content, msg, sha).catch(function (err) {
                console.warn("Failed to push local resolution for " + pair.local.uuid, err);
              });
            }
          });
        }, Promise.resolve());

        chain.then(function () {
          modal.classList.remove("active");
          UI.displayStatistics();
          UI.displayBrowseResults();

          var banner = document.getElementById("autosync-banner");
          var bannerMsg = document.getElementById("autosync-msg");
          if (banner && bannerMsg) {
            bannerMsg.textContent = "All conflicts resolved.";
            banner.className = "autosync-banner autosync-success";
            banner.style.display = "flex";
            setTimeout(function () {
              banner.style.display = "none";
            }, 4000);
          }
        });
      });
    }

    // ── Skip button ──
    if (skipBtn) {
      var newSkip = skipBtn.cloneNode(true);
      skipBtn.parentNode.replaceChild(newSkip, skipBtn);

      newSkip.addEventListener("click", function () {
        modal.classList.remove("active");
      });
    }

    // Close on backdrop click
    modal.onclick = function (e) {
      if (e.target === modal) modal.classList.remove("active");
    };
  },

  // ── Conflict helpers ───────────────────────────────────────────────────────

  _fmtDate: function (iso) {
    if (!iso) return "unknown";
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso;
    }
  },

  _safeHtml: function (str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  _complexCount: function (val) {
    if (!val) return "—";
    if (Array.isArray(val)) return val.length + " item(s)";
    if (typeof val === "object") {
      var keys = Object.keys(val).filter(function (k) {
        return val[k];
      });
      return keys.length + " field(s)";
    }
    return String(val);
  },

  // ── Push to GitHub ─────────────────────────────────────────────────────────

  pushToGitHub: function () {
    if (!this.config.token) {
      alert("Please configure GitHub settings first");
      return;
    }
    if (
      !confirm(
        "Push local database to GitHub?\nOnly records newer than the remote copy will be uploaded.",
      )
    )
      return;

    var self = this;
    var statusEl = document.getElementById("sync-status");
    statusEl.innerHTML = '<div class="sync-progress">Preparing push...</div>';
    statusEl.style.display = "block";

    Database.getAllPersons()
      .then(function (localPersons) {
        if (localPersons.length === 0) {
          statusEl.innerHTML =
            '<div class="sync-success">Nothing to push (database is empty).</div>';
          return;
        }

        return self._listRemoteRecords().then(function (remoteFiles) {
          var remoteMap = {};
          remoteFiles.forEach(function (f) {
            remoteMap[f.name.replace(/\.json$/, "")] = f;
          });

          var uploadCount = 0,
            skipCount = 0,
            total = localPersons.length,
            done = 0;

          function updateProgress() {
            statusEl.innerHTML =
              '<div class="sync-progress">Pushing... ' +
              done +
              " / " +
              total +
              " &nbsp;(uploaded: " +
              uploadCount +
              ", skipped: " +
              skipCount +
              ")</div>";
          }
          updateProgress();

          var sequence = localPersons.reduce(function (chain, person) {
            return chain.then(function () {
              if (!person.uuid) {
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              var filePath = self.config.folder + "/" + person.uuid + ".json";
              var localModified = person.modifiedAt ? new Date(person.modifiedAt) : new Date(0);
              var remote = remoteMap[person.uuid];

              if (!remote) {
                var content = JSON.stringify(person, null, 2);
                var msg =
                  "Add record " + person.uuid + " (" + (person.standardizedName || "unknown") + ")";
                return self._putFile(filePath, content, msg, null).then(function () {
                  uploadCount++;
                  done++;
                  updateProgress();
                });
              }

              return self._getRemoteFile(filePath).then(function (remoteData) {
                var remoteModified = new Date(0);
                if (remoteData) {
                  try {
                    var rj = JSON.parse(self._decode(remoteData));
                    if (rj.modifiedAt) remoteModified = new Date(rj.modifiedAt);
                  } catch (e) {
                    /* ignore */
                  }
                }

                if (localModified <= remoteModified) {
                  skipCount++;
                  done++;
                  updateProgress();
                  return;
                }

                var content = JSON.stringify(person, null, 2);
                var msg =
                  "Update record " +
                  person.uuid +
                  " (" +
                  (person.standardizedName || "unknown") +
                  ")";
                return self._putFile(filePath, content, msg, remote.sha).then(function () {
                  uploadCount++;
                  done++;
                  updateProgress();
                });
              });
            });
          }, Promise.resolve());

          return sequence.then(function () {
            statusEl.innerHTML =
              '<div class="sync-success">&#10003; Push complete &mdash; ' +
              uploadCount +
              " record(s) uploaded, " +
              skipCount +
              " skipped.</div>";
          });
        });
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="sync-error">&#10007; Push failed: ' + err.message + "</div>";
        console.error("pushToGitHub error:", err);
      });
  },

  // ── Pull from GitHub ───────────────────────────────────────────────────────

  pullFromGitHub: function () {
    if (!this.config.token) {
      alert("Please configure GitHub settings first");
      return;
    }
    if (
      !confirm(
        "Pull records from GitHub?\nOnly records newer than your local copy will be imported.",
      )
    )
      return;

    var self = this;
    var statusEl = document.getElementById("sync-status");
    statusEl.innerHTML = '<div class="sync-progress">Listing remote records...</div>';
    statusEl.style.display = "block";

    self
      ._listRemoteRecords()
      .then(function (remoteFiles) {
        if (remoteFiles.length === 0) {
          statusEl.innerHTML =
            '<div class="sync-success">No remote records found in folder <code>' +
            self.config.folder +
            "/</code>.</div>";
          return;
        }

        var total = remoteFiles.length,
          done = 0;
        var insertCount = 0,
          updateCount = 0,
          skipCount = 0;

        function updateProgress() {
          statusEl.innerHTML =
            '<div class="sync-progress">Pulling... ' +
            done +
            " / " +
            total +
            " &nbsp;(new: " +
            insertCount +
            ", updated: " +
            updateCount +
            ", skipped: " +
            skipCount +
            ")</div>";
        }
        updateProgress();

        var sequence = remoteFiles.reduce(function (chain, remoteFile) {
          return chain.then(function () {
            return self._getRemoteFile(remoteFile.path).then(function (data) {
              if (!data) {
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              var person;
              try {
                person = JSON.parse(self._decode(data));
              } catch (e) {
                console.warn("Could not parse remote file:", remoteFile.path, e);
                done++;
                skipCount++;
                updateProgress();
                return;
              }

              if (!person.uuid) {
                person.uuid = remoteFile.name.replace(/\.json$/, "");
                person.id = person.uuid;
              }

              return Database.upsertPerson(person).then(function (result) {
                if (result === "inserted") insertCount++;
                else if (result === "updated") updateCount++;
                else skipCount++;
                done++;
                updateProgress();
              });
            });
          });
        }, Promise.resolve());

        return sequence.then(function () {
          statusEl.innerHTML =
            '<div class="sync-success">&#10003; Pull complete &mdash; ' +
            insertCount +
            " new, " +
            updateCount +
            " updated, " +
            skipCount +
            " skipped.</div>";
          UI.displayStatistics();
          UI.displayBrowseResults();
        });
      })
      .catch(function (err) {
        statusEl.innerHTML =
          '<div class="sync-error">&#10007; Pull failed: ' + err.message + "</div>";
        console.error("pullFromGitHub error:", err);
      });
  },

  // ── History ────────────────────────────────────────────────────────────────

  viewHistory: function () {
    var url =
      "https://github.com/" +
      this.config.owner +
      "/" +
      this.config.repo +
      "/commits/" +
      this.config.branch +
      "/" +
      this.config.folder;
    alert("Commit history viewer\n\nVisit the folder on GitHub:\n" + url);
  },
};

// Initialise when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  GitHubSync.init();
});

console.log("GitHub Sync module loaded (per-record IndexedDB edition)");

```


**Tool Call: Check project diagnostics**
Status: Completed

No errors or warnings found in the project.

## Assistant

All clean. Let me do a final end-to-end read of `autoSync` to make sure the flow is airtight:

**Tool Call: Read file `scripts/github-sync.js` (lines 264-430)**
Status: Completed

```webapp-prosopography/scripts/github-sync.js
      });
  },

  // ── Auto-sync on launch ────────────────────────────────────────────────────

  // Called once at app start. Silently syncs with GitHub if a token is configured.
  // Workflow:
  //   1. List remote records
  //   2. For each remote UUID:
  //        - not local  → insert
  //        - local & remote same date → skip
  //        - local newer → queue for upload
  //        - remote newer → update local
  //        - both modified, timestamps differ in both directions → conflict
  //   3. For each local UUID not in remote → upload
  //   4. If conflicts remain → show conflict resolution modal
  autoSync: function () {
    if (!this.config.token) return; // silently skip if not configured

    var self = this;
    var banner = document.getElementById("autosync-banner");
    var bannerMsg = document.getElementById("autosync-msg");

    function showBanner(msg, type) {
      if (!banner) return;
      bannerMsg.textContent = msg;
      banner.className = "autosync-banner autosync-" + type;
      banner.style.display = "flex";
      if (type === "success" || type === "info") {
        setTimeout(function () {
          banner.style.display = "none";
        }, 5000);
      }
    }

    showBanner("Syncing with GitHub…", "progress");

    // Step 1 – fetch all remote records in parallel with local records
    Promise.all([Database.getAllPersons(), self._listRemoteRecords()])
      .then(function (results) {
        var localPersons = results[0];
        var remoteFiles = results[1];

        // Build lookup maps
        var localByUUID = {};
        localPersons.forEach(function (p) {
          if (p.uuid) localByUUID[p.uuid] = p;
        });

        var remoteByUUID = {};
        remoteFiles.forEach(function (f) {
          var uuid = f.name.replace(/\.json$/, "");
          remoteByUUID[uuid] = f;
        });

        // Fetch remote content for every UUID that exists remotely
        // (we need the actual record to compare dates / detect conflicts)
        var remoteUUIDs = Object.keys(remoteByUUID);
        var fetchRemoteContents = remoteUUIDs.map(function (uuid) {
          return self
            ._getRemoteFile(self.config.folder + "/" + uuid + ".json")
            .then(function (data) {
              if (!data) return null;
              try {
                var person = JSON.parse(self._decode(data));
                person._remoteFileSha = data.sha; // stash SHA for later PUT
                return person;
              } catch (e) {
                return null;
              }
            });
        });

        return Promise.all(fetchRemoteContents).then(function (remotePersons) {
          // Build uuid → remotePersonRecord map
          var remoteRecordByUUID = {};
          remotePersons.forEach(function (p) {
            if (p && p.uuid) remoteRecordByUUID[p.uuid] = p;
          });

          var toUpload = []; // { person, sha|null }  local → remote
          var conflicts = []; // { local, remote }
          var summary = { inserted: 0, updated: 0, uploaded: 0, skipped: 0, conflicts: 0 };

          // --- Evaluate remote records ---
          var applyRemote = remoteUUIDs.reduce(function (chain, uuid) {
            return chain.then(function () {
              var remote = remoteRecordByUUID[uuid];
              if (!remote) return; // fetch failed, skip

              var local = localByUUID[uuid];

              if (!local) {
                // Remote only → insert locally
                return Database.upsertPerson(remote).then(function () {
                  summary.inserted++;
                });
              }

              var localDate = local.modifiedAt ? new Date(local.modifiedAt) : new Date(0);
              var remoteDate = remote.modifiedAt ? new Date(remote.modifiedAt) : new Date(0);

              if (localDate.getTime() === remoteDate.getTime()) {
                summary.skipped++;
                return; // identical, nothing to do
              }

              if (remoteDate > localDate) {
                // Remote is simply newer → update local
                return Database.upsertPerson(remote).then(function () {
                  summary.updated++;
                });
              }

              // localDate > remoteDate → local is newer; but we need to check
              // whether the remote was independently edited (true conflict) or
              // was just never pushed (local-only edit).
              // We detect a true conflict by checking whether remote.modifiedAt
              // differs from the last known-pushed timestamp stored locally.
              // As a pragmatic heuristic: if the remote record exists and its
              // modifiedAt is more recent than local.createdAt, it was edited
              // on the remote side too → conflict.
              var localCreated = local.createdAt ? new Date(local.createdAt) : new Date(0);
              if (remoteDate > localCreated) {
                // Both sides have been edited after the record was first created → conflict
                conflicts.push({ local: local, remote: remote });
                summary.conflicts++;
              } else {
                // Remote is just the original unedited version → safe to overwrite
                toUpload.push({
                  person: local,
                  sha: remote._remoteFileSha || null,
                  filePath: self.config.folder + "/" + uuid + ".json",
                });
              }
            });
          }, Promise.resolve());

          return applyRemote.then(function () {
            // --- Local-only records (not on remote) → upload ---
            localPersons.forEach(function (local) {
              if (!local.uuid) return;
              if (!remoteRecordByUUID[local.uuid]) {
                toUpload.push({
                  person: local,
                  sha: null,
                  filePath: self.config.folder + "/" + local.uuid + ".json",
                });
              }
            });

            // Upload all queued records sequentially
            var uploadChain = toUpload.reduce(function (chain, item) {
              return chain.then(function () {
                var content = JSON.stringify(item.person, null, 2);
                var msg =
                  (item.sha ? "Update" : "Add") +
                  " record " +
                  item.person.uuid +
                  " (" +
                  (item.person.standardizedName || "unknown") +
                  ")";
                return self
                  ._putFile(item.filePath, content, msg, item.sha)
                  .then(function () {
                    summary.uploaded++;
                  })

```


## Assistant

The logic is solid. Let me verify the full file compiles cleanly once more:

**Tool Call: Check project diagnostics**
Status: Completed

No errors or warnings found in the project.

## Assistant

Everything is clean. Here's a complete summary of what was done:

---

## Summary of Changes

### Auto-sync on launch

**`scripts/app.js`**
- `App.init()` now calls `GitHubSync.autoSync()` immediately after `UI.init()`. If no token is configured, it silently returns — so users without GitHub set up see no change.

---

### `scripts/github-sync.js` — new `autoSync()` method

The auto-sync runs a full bidirectional reconciliation in one shot:

1. **Fetch** local records from IndexedDB and the remote file listing from GitHub in parallel.
2. **Fetch** every remote record's actual JSON content (needed to read `modifiedAt` and detect conflicts).
3. **Classify** each UUID:

| Situation | Action |
|---|---|
| UUID only on remote | Insert into local IndexedDB |
| UUID on both, same `modifiedAt` | Skip (already in sync) |
| Remote `modifiedAt` newer | Update local with remote version |
| Local `modifiedAt` newer, remote is unedited original | Queue for upload to GitHub |
| Both modified after `createdAt` — true conflict | Add to conflict list |

4. **Upload** all queued local-only / locally-newer records to GitHub.
5. **Banner**: shows a brief colour-coded status bar at the top of the screen (progress → success / conflict / error).
6. If there are conflicts, opens the **conflict resolution modal** automatically.

---

### `scripts/github-sync.js` — `_showConflictModal(conflicts)`

A rich per-conflict diff UI:

- **One card per conflict**, showing the person's name and UUID.
- **Timestamps** for both local and remote versions.
- **Field-by-field diff table** for all scalar fields (name, nationality, gender, religion, certainty, biography, modifiedAt) — local values highlighted amber, remote highlighted blue.
- **Complex fields** (name variants, attestations, relationships, occupations, life events) show item counts when they differ.
- **"← Keep Local"** / **"Keep Remote →"** buttons per conflict. Choosing one collapses the card to a green resolved badge with an "Undo" link.
- **"Apply Resolutions"** button (disabled until all conflicts are resolved):
  - *Keep remote* → `Database.forcePutPerson()` overwrites local unconditionally.
  - *Keep local* → pushes the local record to GitHub via `_putFile`, overwriting the remote.
- **"Decide Later"** dismisses the modal without applying anything (the orange banner remains until dismissed).

---

### `scripts/database.js` — `forcePutPerson(person)`

New method that writes a record to IndexedDB unconditionally, bypassing the `modifiedAt` guard in `upsertPerson`. Used only by the conflict resolver's "keep remote" path.

---

### `index.html`
- Added the **conflict resolution modal** (`#conflict-modal`) with a sticky header, scrollable body, and sticky footer with the Apply/Decide Later buttons.
- Added the **auto-sync banner** (`#autosync-banner`) as a fixed top bar with a dismiss `×` button.
- Cache busters bumped to `v=12`.

---

### `styles.css`
- Full styling for the **autosync banner** (5 states: progress, success, info, conflict, error).
- Full styling for the **conflict modal**: sticky header/footer, diff table with colour-coded local/remote columns, resolved-badge state, choice buttons, apply/skip footer, responsive adjustments.

