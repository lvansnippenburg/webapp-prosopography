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
        item.className = 'attestation-item';
        item.dataset.index = index;

        var sourceData = this.getSourceData(attestation ? attestation.sources : null, 0);
        var attDate = attestation && attestation.date ? attestation.date : {};

        var html = '';
        html += '<button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>';
        html += '<label>Place: <input type="text" name="att-place-' + index + '" value="' + (attestation && attestation.place ? attestation.place : '') + '"></label>';

        html += '<div class="form-row">';
        html += '<label>Year: <input type="number" name="att-year-' + index + '" value="' + (attDate.year || '') + '"></label>';
        html += '<label>Month: <input type="number" name="att-month-' + index + '" min="1" max="12" value="' + (attDate.month || '') + '"></label>';
        html += '<label>Day: <input type="number" name="att-day-' + index + '" min="1" max="31" value="' + (attDate.day || '') + '"></label>';
        html += '</div>';

        html += '<label>Event/Activity: <input type="text" name="att-event-' + index + '" value="' + (attestation && attestation.event ? attestation.event : '') + '"></label>';
        html += '<label>Notes: <input type="text" name="att-notes-' + index + '" value="' + (attestation && attestation.notes ? attestation.notes : '') + '"></label>';

        // New source fields structure
        html += '<div class="source-fields">';
        html += '<div class="autocomplete-wrapper">';
        html += '<label>Source Document:';
        html += '<input type="text" class="source-doc-input" name="att-source-doc-' + index + '" value="' + sourceData.documentName + '" autocomplete="off" placeholder="e.g., Notarial Archive...">';
        html += '<div class="autocomplete-dropdown att-source-dropdown-' + index + '"></div>';
        html += '</label>';
        html += '</div>';
        html += '<label>Location:';
        html += '<input type="text" name="att-source-loc-' + index + '" value="' + sourceData.location + '" placeholder="e.g., fol. 45v">';
        html += '</label>';
        html += '</div>';

        item.innerHTML = html;
        container.appendChild(item);

        // Initialize source autocomplete for this field
        var sourceInput = item.querySelector('[name="att-source-doc-' + index + '"]');
        var sourceDropdown = item.querySelector('.att-source-dropdown-' + index);
        this.initSourceAutocomplete(sourceInput, sourceDropdown);
    },

    // Add relationship field with source autocomplete
    addRelationshipField: function(relationship) {
        var container = document.getElementById('relationships-container');
        var index = this.relationshipCounter++;

        var item = document.createElement('div');
        item.className = 'relationship-item';
        item.dataset.index = index;

        var sourceData = this.getSourceData(relationship ? relationship.sources : null, 0);

        var html = '';
        html += '<button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>';
        html += '<label>Related Person: <input type="text" name="rel-person-' + index + '" value="' + (relationship && relationship.relatedPerson ? relationship.relatedPerson : '') + '"></label>';
        html += '<label>Relationship Type: <input type="text" name="rel-type-' + index + '" value="' + (relationship && relationship.type ? relationship.type : '') + '" placeholder="e.g., father, spouse, business partner"></label>';
        html += '<label>Notes: <input type="text" name="rel-notes-' + index + '" value="' + (relationship && relationship.notes ? relationship.notes : '') + '"></label>';

        // New source fields structure
        html += '<div class="source-fields">';
        html += '<div class="autocomplete-wrapper">';
        html += '<label>Source Document:';
        html += '<input type="text" class="source-doc-input" name="rel-source-doc-' + index + '" value="' + sourceData.documentName + '" autocomplete="off" placeholder="e.g., Parish Records...">';
        html += '<div class="autocomplete-dropdown rel-source-dropdown-' + index + '"></div>';
        html += '</label>';
        html += '</div>';
        html += '<label>Location:';
        html += '<input type="text" name="rel-source-loc-' + index + '" value="' + sourceData.location + '" placeholder="e.g., p. 78">';
        html += '</label>';
        html += '</div>';

        item.innerHTML = html;
        container.appendChild(item);

        // Initialize source autocomplete for this field
        var sourceInput = item.querySelector('[name="rel-source-doc-' + index + '"]');
        var sourceDropdown = item.querySelector('.rel-source-dropdown-' + index);
        this.initSourceAutocomplete(sourceInput, sourceDropdown);
    },

    // Load person data into form for editing - WITH DETAILED LOGGING
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
};

console.log('UI module loaded successfully');