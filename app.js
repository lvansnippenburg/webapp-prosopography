// Main application logic and event handlers
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing app...');
    initializeApp();
});

function initializeApp() {
    try {
        // Initialize name suggestions functionality
        UI.initNameSuggestions();
        console.log('Name suggestions initialized');

        // Initialize nationality autocomplete
        UI.initNationalityAutocomplete();
        console.log('Nationality autocomplete initialized');

        // Navigation
        document.getElementById('nav-search').addEventListener('click', () => {
            UI.showView('search-view');
            performSearch();
        });

        document.getElementById('nav-add').addEventListener('click', () => {
            UI.clearForm();
            UI.showView('add-view');
        });

        document.getElementById('nav-browse').addEventListener('click', () => {
            UI.showView('browse-view');
            loadBrowseView();
        });

        document.getElementById('nav-export').addEventListener('click', () => {
            UI.showView('export-view');
            UI.displayStatistics();
            GitHubSync.updateConnectionStatus();
        });

        document.getElementById('nav-settings').addEventListener('click', () => {
            UI.showView('settings-view');
            loadSettings();
        });

        console.log('Navigation initialized');

        // Search functionality
        document.getElementById('btn-search').addEventListener('click', performSearch);

        document.getElementById('btn-clear').addEventListener('click', () => {
            document.getElementById('search-name').value = '';
            document.getElementById('search-place').value = '';
            document.getElementById('search-year').value = '';
            document.getElementById('phonetic-search').checked = false;
            document.getElementById('search-results').innerHTML = '';
            document.getElementById('search-info').innerHTML = '';
        });

        // Allow Enter key to search
        ['search-name', 'search-place', 'search-year'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch();
            });
        });

        console.log('Search functionality initialized');

        // Form functionality
        document.getElementById('person-form').addEventListener('submit', handleFormSubmit);

        document.getElementById('btn-cancel').addEventListener('click', () => {
            UI.clearForm();
            UI.showView('search-view');
        });

        document.getElementById('btn-add-variant').addEventListener('click', () => {
            UI.addNameVariantField();
        });

        document.getElementById('btn-add-attestation').addEventListener('click', () => {
            UI.addAttestationField();
        });

        document.getElementById('btn-add-relationship').addEventListener('click', () => {
            UI.addRelationshipField();
        });

        console.log('Form functionality initialized');

        // Modal functionality
        document.querySelector('.close').addEventListener('click', closeModal);

        document.getElementById('btn-edit-person').addEventListener('click', () => {
            closeModal();
            UI.loadPersonIntoForm(UI.currentPersonId);
        });

        document.getElementById('btn-delete-person').addEventListener('click', handleDeletePerson);

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('detail-modal');
            if (e.target === modal) {
                closeModal();
            }
        });

        console.log('Modal functionality initialized');

        // Browse sorting
        document.getElementById('sort-by').addEventListener('change', loadBrowseView);

        // Local Export/Import
        document.getElementById('btn-export-json').addEventListener('click', exportData);
        document.getElementById('btn-import-json').addEventListener('click', importData);

        // GitHub Sync
        document.getElementById('btn-push-github').addEventListener('click', pushToGitHub);
        document.getElementById('btn-pull-github').addEventListener('click', pullFromGitHub);
        document.getElementById('btn-view-history').addEventListener('click', viewGitHubHistory);

        console.log('Export/Import functionality initialized');

        // Settings
        document.getElementById('btn-save-settings').addEventListener('click', saveGitHubSettings);
        document.getElementById('btn-test-connection').addEventListener('click', testGitHubConnection);
        document.getElementById('btn-clear-settings').addEventListener('click', clearGitHubSettings);

        console.log('Settings functionality initialized');

        // Initial load - show all persons in search
        performSearch();
        console.log('Initial search performed');

        console.log('App initialization complete!');

    } catch (error) {
        console.error('Error during app initialization:', error);
        alert('Error initializing app: ' + error.message);
    }
}

function performSearch() {
    const criteria = {
        name: document.getElementById('search-name').value.trim(),
        place: document.getElementById('search-place').value.trim(),
        year: document.getElementById('search-year').value.trim(),
        usePhonetic: document.getElementById('phonetic-search').checked
    };

    // Display search info if phonetic matching is enabled
    const searchInfo = document.getElementById('search-info');
    if (criteria.usePhonetic && criteria.name) {
        const soundexCode = Database.soundex(criteria.name);
        searchInfo.innerHTML = `<p class="text-muted">Phonetic search enabled. Soundex code: <strong>${soundexCode}</strong></p>`;
    } else {
        searchInfo.innerHTML = '';
    }

    // If all fields are empty, show all persons
    if (!criteria.name && !criteria.place && !criteria.year) {
        const allPersons = Database.getAllPersons();
        UI.renderSearchResults(allPersons);
        return;
    }

    const results = Database.searchPersons(criteria);
    UI.renderSearchResults(results);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const personId = document.getElementById('person-id').value;

    // Build person object
    const person = {
        standardizedName: document.getElementById('standardized-name').value.trim(),
        nationality: document.getElementById('nationality').value.trim() || null,
        gender: document.getElementById('gender').value,
        nameVariants: collectNameVariants(),
        lifeEvents: {
            birth: collectLifeEvent('birth'),
            death: collectLifeEvent('death')
        },
        attestations: collectAttestations(),
        relationships: collectRelationships(),
        occupation: document.getElementById('occupations').value
            .split(',')
            .map(o => o.trim())
            .filter(o => o),
        biography: document.getElementById('biography').value.trim()
    };

    // Save or update
    if (personId) {
        Database.updatePerson(personId, person);
        alert('Person updated successfully!');
    } else {
        const newId = Database.addPerson(person);
        alert(`Person added successfully with ID: ${newId}`);
    }

    // Return to search view
    UI.clearForm();
    UI.showView('search-view');
    performSearch();
}

function collectNameVariants() {
    const container = document.getElementById('name-variants-container');
    const variants = [];

    container.querySelectorAll('.variant-item').forEach((item, index) => {
        const firstName = item.querySelector(`[name="variant-first-${index}"]`)?.value.trim();
        const lastName = item.querySelector(`[name="variant-last-${index}"]`)?.value.trim();
        const patronym = item.querySelector(`[name="variant-patronym-${index}"]`)?.value.trim();
        const fullName = item.querySelector(`[name="variant-full-${index}"]`)?.value.trim();
        const sourceCitation = item.querySelector(`[name="variant-source-${index}"]`)?.value.trim();

        if (firstName || lastName || patronym || fullName) {
            const variant = {
                firstName: firstName || null,
                lastName: lastName || null,
                patronym: patronym || null,
                fullName: fullName || null,
                sources: []
            };

            if (sourceCitation) {
                variant.sources.push({
                    sourceId: '',
                    citation: sourceCitation
                });
            }

            variants.push(variant);
        }
    });

    return variants;
}

function collectLifeEvent(type) {
    const year = document.getElementById(`${type}-year`).value;
    const month = document.getElementById(`${type}-month`).value;
    const day = document.getElementById(`${type}-day`).value;
    const circa = document.getElementById(`${type}-circa`).checked;
    const place = document.getElementById(`${type}-place`).value.trim();
    const certainty = document.getElementById(`${type}-certainty`).value;

    if (!year && !place) return null;

    return {
        date: year ? {
            year: parseInt(year),
            month: month ? parseInt(month) : null,
            day: day ? parseInt(day) : null,
            circa: circa
        } : null,
        place: place || null,
        certainty: certainty,
        sources: []
    };
}

function collectAttestations() {
    const container = document.getElementById('attestations-container');
    const attestations = [];

    container.querySelectorAll('.attestation-item').forEach((item, index) => {
        const year = item.querySelector(`[name="att-year-${index}"]`)?.value;
        const month = item.querySelector(`[name="att-month-${index}"]`)?.value;
        const day = item.querySelector(`[name="att-day-${index}"]`)?.value;
        const circa = item.querySelector(`[name="att-circa-${index}"]`)?.checked;
        const place = item.querySelector(`[name="att-place-${index}"]`)?.value.trim();
        const activity = item.querySelector(`[name="att-activity-${index}"]`)?.value.trim();
        const personNameUsed = item.querySelector(`[name="att-name-${index}"]`)?.value.trim();
        const context = item.querySelector(`[name="att-context-${index}"]`)?.value.trim();
        const sourceId = item.querySelector(`[name="att-source-${index}"]`)?.value.trim();

        if (year || place || activity) {
            attestations.push({
                id: `a${Date.now()}_${index}`,
                date: year ? {
                    year: parseInt(year),
                    month: month ? parseInt(month) : null,
                    day: day ? parseInt(day) : null,
                    circa: circa || false
                } : null,
                place: place || null,
                activity: activity || null,
                personNameUsed: personNameUsed || null,
                context: context || null,
                sourceId: sourceId || null
            });
        }
    });

    return attestations;
}

function collectRelationships() {
    const container = document.getElementById('relationships-container');
    const relationships = [];

    container.querySelectorAll('.relationship-item').forEach((item, index) => {
        const type = item.querySelector(`[name="rel-type-${index}"]`)?.value;
        const personId = item.querySelector(`[name="rel-person-${index}"]`)?.value.trim();
        const certainty = item.querySelector(`[name="rel-certainty-${index}"]`)?.value;
        const sourceCitation = item.querySelector(`[name="rel-source-${index}"]`)?.value.trim();

        if (type && personId) {
            const relationship = {
                type: type,
                personId: personId,
                certainty: certainty,
                sources: []
            };

            if (sourceCitation) {
                relationship.sources.push({
                    sourceId: '',
                    citation: sourceCitation
                });
            }

            relationships.push(relationship);
        }
    });

    return relationships;
}

function loadBrowseView() {
    let persons = Database.getAllPersons();
    const sortBy = document.getElementById('sort-by').value;

    // Sort persons
    persons = persons.sort((a, b) => {
        if (sortBy === 'name') {
            return a.standardizedName.localeCompare(b.standardizedName);
        } else if (sortBy === 'birth') {
            const aYear = a.lifeEvents?.birth?.date?.year || 9999;
            const bYear = b.lifeEvents?.birth?.date?.year || 9999;
            return aYear - bYear;
        } else if (sortBy === 'death') {
            const aYear = a.lifeEvents?.death?.date?.year || 9999;
            const bYear = b.lifeEvents?.death?.date?.year || 9999;
            return aYear - bYear;
        }
        return 0;
    });

    const browseResults = document.getElementById('browse-results');

    if (persons.length === 0) {
        browseResults.innerHTML = '<p class="text-muted">No persons in database. Add some to get started!</p>';
        return;
    }

    browseResults.innerHTML = persons.map(p => UI.renderPersonCard(p)).join('');

    // Add click handlers
    browseResults.querySelectorAll('.person-card').forEach(card => {
        card.addEventListener('click', () => {
            const personId = card.dataset.personId;
            UI.showPersonDetail(personId);
        });
    });
}

function closeModal() {
    document.getElementById('detail-modal').classList.remove('active');
}

function handleDeletePerson() {
    if (!UI.currentPersonId) return;

    const person = Database.getPersonById(UI.currentPersonId);
    if (!person) return;

    if (confirm(`Are you sure you want to delete ${person.standardizedName}? This cannot be undone.`)) {
        Database.deletePerson(UI.currentPersonId);
        closeModal();
        alert('Person deleted successfully.');
        performSearch();
    }
}

function exportData() {
    const json = Database.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prosopography_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Database exported successfully!');
}

function importData() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to import.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const jsonString = e.target.result;
        const success = Database.importJSON(jsonString);

        if (success) {
            alert('Database imported successfully!');
            UI.displayStatistics();
            performSearch();
        } else {
            alert('Import failed. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

// GitHub Functions
async function pushToGitHub() {
    if (!GitHubSync.isConfigured()) {
        alert('Please configure GitHub settings first.');
        UI.showView('settings-view');
        return;
    }

    const statusDiv = document.getElementById('sync-status');
    statusDiv.innerHTML = '<p class="sync-progress">Pushing to GitHub...</p>';
    statusDiv.style.display = 'block';

    try {
        const result = await GitHubSync.push();
        statusDiv.innerHTML = `<p class="sync-success">✓ ${result.message}</p>`;
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    } catch (error) {
        statusDiv.innerHTML = `<p class="sync-error">✗ Push failed: ${error.message}</p>`;
    }
}

async function pullFromGitHub() {
    if (!GitHubSync.isConfigured()) {
        alert('Please configure GitHub settings first.');
        UI.showView('settings-view');
        return;
    }

    if (!confirm('This will replace your local database with the version from GitHub. Continue?')) {
        return;
    }

    const statusDiv = document.getElementById('sync-status');
    statusDiv.innerHTML = '<p class="sync-progress">Pulling from GitHub...</p>';
    statusDiv.style.display = 'block';

    try {
        const result = await GitHubSync.pull();
        statusDiv.innerHTML = `<p class="sync-success">✓ ${result.message}</p>`;

        // Refresh the display
        UI.displayStatistics();
        performSearch();

        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    } catch (error) {
        statusDiv.innerHTML = `<p class="sync-error">✗ Pull failed: ${error.message}</p>`;
    }
}

async function viewGitHubHistory() {
    if (!GitHubSync.isConfigured()) {
        alert('Please configure GitHub settings first.');
        UI.showView('settings-view');
        return;
    }

    await GitHubSync.showHistory();
}

// Settings Functions
function loadSettings() {
    const settings = GitHubSync.getSettings();
    if (settings) {
        document.getElementById('github-token').value = settings.token;
        document.getElementById('github-filepath').value = settings.filepath;
        document.getElementById('github-branch').value = settings.branch;
    }
}

function saveGitHubSettings() {
    const token = document.getElementById('github-token').value.trim();
    const filepath = document.getElementById('github-filepath').value.trim();
    const branch = document.getElementById('github-branch').value.trim();

    if (!token) {
        alert('Please enter a GitHub Personal Access Token.');
        return;
    }

    GitHubSync.saveSettings(token, filepath, branch);

    const statusDiv = document.getElementById('connection-status');
    statusDiv.innerHTML = '<p class="status-success">✓ Settings saved successfully!</p>';
    statusDiv.style.display = 'block';

    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

async function testGitHubConnection() {
    const token = document.getElementById('github-token').value.trim();

    if (!token) {
        alert('Please enter a GitHub Personal Access Token first.');
        return;
    }

    // Temporarily save settings for testing
    const filepath = document.getElementById('github-filepath').value.trim();
    const branch = document.getElementById('github-branch').value.trim();
    GitHubSync.saveSettings(token, filepath, branch);

    const statusDiv = document.getElementById('connection-status');
    statusDiv.innerHTML = '<p class="status-progress">Testing connection...</p>';
    statusDiv.style.display = 'block';

    const result = await GitHubSync.testConnection();

    if (result.success) {
        statusDiv.innerHTML = `<p class="status-success">✓ ${result.message}</p>`;
    } else {
        statusDiv.innerHTML = `<p class="status-error">✗ ${result.message}</p>`;
    }
}

function clearGitHubSettings() {
    if (!confirm('Are you sure you want to clear your GitHub settings? This will not delete any data.')) {
        return;
    }

    GitHubSync.clearSettings();
    document.getElementById('github-token').value = '';
    document.getElementById('github-filepath').value = 'prosopography-database.json';
    document.getElementById('github-branch').value = 'main';

    const statusDiv = document.getElementById('connection-status');
    statusDiv.innerHTML = '<p class="status-success">✓ Settings cleared.</p>';
    statusDiv.style.display = 'block';

    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

console.log('App.js loaded successfully');