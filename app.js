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
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

console.log('App module loaded successfully');