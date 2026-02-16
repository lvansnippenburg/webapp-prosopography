// UI module - handles rendering and form management
const UI = {
    currentPersonId: null,

    // Get gender icon
    getGenderIcon(gender) {
        switch(gender) {
            case 'male': return '♂';
            case 'female': return '♀';
            default: return '?';
        }
    },

    // Render person card for lists
    renderPersonCard(person) {
        const dateRange = Database.formatDateRange(
            person.lifeEvents?.birth,
            person.lifeEvents?.death
        );

        const variantsText = person.nameVariants && person.nameVariants.length > 0
            ? `Variants: ${person.nameVariants.map(v => v.fullName).join(', ')}`
            : '';

        const attestationsCount = person.attestations?.length || 0;
        const nationalityText = person.nationality ? `<span class="badge nationality-badge">${person.nationality}</span>` : '';
        const genderIcon = this.getGenderIcon(person.gender);
        const genderText = `<span class="badge gender-badge gender-${person.gender || 'unknown'}">${genderIcon}</span>`;

        return `
            <div class="person-card" data-person-id="${person.id}">
                <h3>${person.standardizedName} ${genderText}</h3>
                ${nationalityText}
                <div class="dates">${dateRange}</div>
                ${variantsText ? `<div class="variants">${variantsText}</div>` : ''}
                <div class="attestations-count">${attestationsCount} attestation(s)</div>
            </div>
        `;
    },

    // Initialize nationality autocomplete
    initNationalityAutocomplete() {
        const nationalityInput = document.getElementById('nationality');
        const suggestionsDiv = document.getElementById('nationality-suggestions');
        let debounceTimer;

        nationalityInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const value = e.target.value.trim();
                if (value.length < 1) {
                    suggestionsDiv.style.display = 'none';
                    return;
                }

                const matches = Database.filterNationalities(value);

                if (matches.length === 0) {
                    suggestionsDiv.style.display = 'none';
                    return;
                }

                suggestionsDiv.innerHTML = matches.map(nat => 
                    `<div class="autocomplete-item" data-value="${nat}">${nat}</div>`
                ).join('');
                suggestionsDiv.style.display = 'block';

                // Add click handlers
                suggestionsDiv.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', () => {
                        nationalityInput.value = item.dataset.value;
                        suggestionsDiv.style.display = 'none';
                    });
                });
            }, 150);
        });

        nationalityInput.addEventListener('focus', () => {
            if (nationalityInput.value.length >= 1) {
                const matches = Database.filterNationalities(nationalityInput.value);
                if (matches.length > 0) {
                    suggestionsDiv.innerHTML = matches.map(nat => 
                        `<div class="autocomplete-item" data-value="${nat}">${nat}</div>`
                    ).join('');
                    suggestionsDiv.style.display = 'block';

                    suggestionsDiv.querySelectorAll('.autocomplete-item').forEach(item => {
                        item.addEventListener('click', () => {
                            nationalityInput.value = item.dataset.value;
                            suggestionsDiv.style.display = 'none';
                        });
                    });
                }
            } else {
                // Show all existing nationalities on focus
                const allNationalities = Database.getAllNationalities();
                if (allNationalities.length > 0) {
                    suggestionsDiv.innerHTML = allNationalities.map(nat => 
                        `<div class="autocomplete-item" data-value="${nat}">${nat}</div>`
                    ).join('');
                    suggestionsDiv.style.display = 'block';

                    suggestionsDiv.querySelectorAll('.autocomplete-item').forEach(item => {
                        item.addEventListener('click', () => {
                            nationalityInput.value = item.dataset.value;
                            suggestionsDiv.style.display = 'none';
                        });
                    });
                }
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!nationalityInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                suggestionsDiv.style.display = 'none';
            }
        });
    },

    // Render search results
    renderSearchResults(persons) {
        const resultsDiv = document.getElementById('search-results');

        if (persons.length === 0) {
            resultsDiv.innerHTML = '<p class="text-muted">No persons found.</p>';
            return;
        }

        resultsDiv.innerHTML = persons.map(p => this.renderPersonCard(p)).join('');

        // Add click handlers
        resultsDiv.querySelectorAll('.person-card').forEach(card => {
            card.addEventListener('click', () => {
                const personId = card.dataset.personId;
                this.showPersonDetail(personId);
            });
        });
    },

    // Show duplicate/similar person suggestions
    showNameSuggestions(inputValue) {
        const suggestionsDiv = document.getElementById('name-suggestions');

        if (!inputValue || inputValue.length < 2) {
            suggestionsDiv.innerHTML = '';
            suggestionsDiv.style.display = 'none';
            return;
        }

        // Search for similar names
        const exactMatches = Database.searchPersons({ name: inputValue, usePhonetic: false });
        const phoneticMatches = Database.searchPersons({ name: inputValue, usePhonetic: true });

        // Combine and deduplicate
        const allMatches = [...exactMatches];
        phoneticMatches.forEach(pm => {
            if (!allMatches.find(am => am.id === pm.id)) {
                allMatches.push(pm);
            }
        });

        // Don't show the current person being edited
        const matches = allMatches.filter(p => p.id !== this.currentPersonId);

        if (matches.length === 0) {
            suggestionsDiv.innerHTML = '';
            suggestionsDiv.style.display = 'none';
            return;
        }

        // Build suggestions HTML
        let html = '<div class="suggestions-header">';
        html += '<strong>⚠️ Possible duplicates found:</strong>';
        html += '</div>';
        html += '<div class="suggestions-list">';

        matches.forEach(person => {
            const dateRange = Database.formatDateRange(
                person.lifeEvents?.birth,
                person.lifeEvents?.death
            );
            const soundexCode = Database.soundex(person.standardizedName);
            const inputSoundex = Database.soundex(inputValue);
            const isPhoneticMatch = soundexCode === inputSoundex;
            const genderIcon = this.getGenderIcon(person.gender);

            html += `
                <div class="suggestion-item" data-person-id="${person.id}">
                    <div class="suggestion-main">
                        <strong>${person.standardizedName}</strong>
                        <span class="gender-indicator">${genderIcon}</span>
                        ${isPhoneticMatch ? '<span class="phonetic-badge">Sounds similar</span>' : ''}
                    </div>
                    <div class="suggestion-details">
                        ${dateRange} • ID: ${person.id}${person.nationality ? ' • ' + person.nationality : ''}
                    </div>
                    ${person.nameVariants && person.nameVariants.length > 0 ? 
                        `<div class="suggestion-variants">Variants: ${person.nameVariants.map(v => v.fullName).join(', ')}</div>` 
                        : ''}
                    <div class="suggestion-actions">
                        <button type="button" class="btn-view-suggestion" data-person-id="${person.id}">View Details</button>
                        <button type="button" class="btn-load-suggestion" data-person-id="${person.id}">Edit This Person</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        suggestionsDiv.innerHTML = html;
        suggestionsDiv.style.display = 'block';

        // Add event listeners to suggestion buttons
        suggestionsDiv.querySelectorAll('.btn-view-suggestion').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const personId = btn.dataset.personId;
                this.showPersonDetail(personId);
            });
        });

        suggestionsDiv.querySelectorAll('.btn-load-suggestion').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const personId = btn.dataset.personId;
                if (confirm('Load this person for editing? Any unsaved changes will be lost.')) {
                    this.loadPersonIntoForm(personId);
                    document.getElementById('name-suggestions').style.display = 'none';
                }
            });
        });
    },

    // Initialize name suggestion functionality
    initNameSuggestions() {
        const nameInput = document.getElementById('standardized-name');
        let debounceTimer;

        nameInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.showNameSuggestions(e.target.value);
            }, 300);
        });

        nameInput.addEventListener('focus', (e) => {
            if (e.target.value.length >= 2) {
                this.showNameSuggestions(e.target.value);
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            const suggestionsDiv = document.getElementById('name-suggestions');
            if (!nameInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                suggestionsDiv.style.display = 'none';
            }
        });
    },

    // Render person detail in modal
    showPersonDetail(personId) {
        const person = Database.getPersonById(personId);
        if (!person) return;

        this.currentPersonId = personId;

        const genderIcon = this.getGenderIcon(person.gender);
        const genderLabel = person.gender ? person.gender.charAt(0).toUpperCase() + person.gender.slice(1) : 'Unknown';

        let html = `<h2>${person.standardizedName}</h2>`;

        html += '<div class="detail-basic-info">';
        if (person.gender) {
            html += `<p><strong>Gender:</strong> ${genderIcon} ${genderLabel}</p>`;
        }
        if (person.nationality) {
            html += `<p><strong>Nationality:</strong> ${person.nationality}</p>`;
        }
        html += '</div>';

        // Name variants
        if (person.nameVariants && person.nameVariants.length > 0) {
            html += '<div class="detail-section"><h3>Name Variants</h3><ul class="variant-list">';
            person.nameVariants.forEach(v => {
                html += `<li><strong>${v.fullName}</strong>`;
                if (v.firstName) html += `<br>First: ${v.firstName}`;
                if (v.lastName) html += `, Last: ${v.lastName}`;
                if (v.patronym) html += `, Patronym: ${v.patronym}`;
                if (v.sources && v.sources.length > 0) {
                    html += `<br><span class="source-ref">Sources: ${v.sources.map(s => s.citation).join('; ')}</span>`;
                }
                html += '</li>';
            });
            html += '</ul></div>';
        }

        // Life events
        html += '<div class="detail-section"><h3>Life Events</h3>';
        if (person.lifeEvents?.birth?.date) {
            const birth = person.lifeEvents.birth;
            html += `<p><strong>Birth:</strong> ${Database.formatDate(birth.date)}`;
            if (birth.place) html += ` in ${birth.place}`;
            html += ` (${birth.certainty || 'unknown certainty'})`;
            if (birth.sources && birth.sources.length > 0) {
                html += `<br><span class="source-ref">${birth.sources[0].citation}</span>`;
            }
            html += '</p>';
        }
        if (person.lifeEvents?.death?.date) {
            const death = person.lifeEvents.death;
            html += `<p><strong>Death:</strong> ${Database.formatDate(death.date)}`;
            if (death.place) html += ` in ${death.place}`;
            html += ` (${death.certainty || 'unknown certainty'})`;
            if (death.sources && death.sources.length > 0) {
                html += `<br><span class="source-ref">${death.sources[0].citation}</span>`;
            }
            html += '</p>';
        }
        html += '</div>';

        // Attestations
        if (person.attestations && person.attestations.length > 0) {
            html += '<div class="detail-section"><h3>Attestations</h3><ul class="attestation-list">';
            person.attestations.forEach(a => {
                html += `<li><strong>${Database.formatDate(a.date)}</strong> - ${a.place || 'unknown place'}<br>`;
                html += `Activity: ${a.activity || 'not specified'}<br>`;
                if (a.personNameUsed) html += `Name used: ${a.personNameUsed}<br>`;
                if (a.context) html += `Context: ${a.context}<br>`;
                if (a.sourceId) html += `<span class="source-ref">Source ID: ${a.sourceId}</span>`;
                html += '</li>';
            });
            html += '</ul></div>';
        }

        // Relationships
        if (person.relationships && person.relationships.length > 0) {
            html += '<div class="detail-section"><h3>Relationships</h3><ul class="relationship-list">';
            person.relationships.forEach(r => {
                const relatedPerson = Database.getPersonById(r.personId);
                const relatedName = relatedPerson ? relatedPerson.standardizedName : r.personId;
                html += `<li><strong>${r.type}</strong>: ${relatedName} (${r.certainty || 'unknown certainty'})`;
                if (r.sources && r.sources.length > 0) {
                    html += `<br><span class="source-ref">${r.sources[0].citation}</span>`;
                }
                html += '</li>';
            });
            html += '</ul></div>';
        }

        // Occupations
        if (person.occupation && person.occupation.length > 0) {
            html += `<div class="detail-section"><h3>Occupations</h3><p>${person.occupation.join(', ')}</p></div>`;
        }

        // Biography
        if (person.biography) {
            html += `<div class="detail-section"><h3>Biography/Notes</h3><p>${person.biography}</p></div>`;
        }

        document.getElementById('detail-content').innerHTML = html;
        document.getElementById('detail-modal').classList.add('active');
    },

    // Load person into form for editing
    loadPersonIntoForm(personId) {
        const person = Database.getPersonById(personId);
        if (!person) return;

        this.currentPersonId = personId;
        document.getElementById('form-title').textContent = 'Edit Person';
        document.getElementById('person-id').value = personId;
        document.getElementById('standardized-name').value = person.standardizedName || '';
        document.getElementById('nationality').value = person.nationality || '';
        document.getElementById('gender').value = person.gender || 'unknown';

        // Hide suggestions when loading a person
        document.getElementById('name-suggestions').style.display = 'none';
        document.getElementById('nationality-suggestions').style.display = 'none';

        // Load life events
        if (person.lifeEvents?.birth) {
            const birth = person.lifeEvents.birth;
            document.getElementById('birth-year').value = birth.date?.year || '';
            document.getElementById('birth-month').value = birth.date?.month || '';
            document.getElementById('birth-day').value = birth.date?.day || '';
            document.getElementById('birth-circa').checked = birth.date?.circa || false;
            document.getElementById('birth-place').value = birth.place || '';
            document.getElementById('birth-certainty').value = birth.certainty || 'certain';
        }

        if (person.lifeEvents?.death) {
            const death = person.lifeEvents.death;
            document.getElementById('death-year').value = death.date?.year || '';
            document.getElementById('death-month').value = death.date?.month || '';
            document.getElementById('death-day').value = death.date?.day || '';
            document.getElementById('death-circa').checked = death.date?.circa || false;
            document.getElementById('death-place').value = death.place || '';
            document.getElementById('death-certainty').value = death.certainty || 'certain';
        }

        // Load name variants
        const variantsContainer = document.getElementById('name-variants-container');
        variantsContainer.innerHTML = '';
        if (person.nameVariants) {
            person.nameVariants.forEach(variant => {
                this.addNameVariantField(variant);
            });
        }

        // Load attestations
        const attestationsContainer = document.getElementById('attestations-container');
        attestationsContainer.innerHTML = '';
        if (person.attestations) {
            person.attestations.forEach(attestation => {
                this.addAttestationField(attestation);
            });
        }

        // Load relationships
        const relationshipsContainer = document.getElementById('relationships-container');
        relationshipsContainer.innerHTML = '';
        if (person.relationships) {
            person.relationships.forEach(relationship => {
                this.addRelationshipField(relationship);
            });
        }

        // Load additional info
        document.getElementById('occupations').value = person.occupation?.join(', ') || '';
        document.getElementById('biography').value = person.biography || '';

        // Show form view
        this.showView('add-view');
    },

    // Add name variant field
    addNameVariantField(data = null) {
        const container = document.getElementById('name-variants-container');
        const index = container.children.length;

        const div = document.createElement('div');
        div.className = 'variant-item';
        div.innerHTML = `
            <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
            <label>First Name: <input type="text" name="variant-first-${index}" value="${data?.firstName || ''}"></label>
            <label>Last Name: <input type="text" name="variant-last-${index}" value="${data?.lastName || ''}"></label>
            <label>Patronym: <input type="text" name="variant-patronym-${index}" value="${data?.patronym || ''}"></label>
            <label>Full Name: <input type="text" name="variant-full-${index}" value="${data?.fullName || ''}"></label>
            <label>Source Citation: <input type="text" name="variant-source-${index}" value="${data?.sources?.[0]?.citation || ''}"></label>
        `;
        container.appendChild(div);
    },

    // Add attestation field
    addAttestationField(data = null) {
        const container = document.getElementById('attestations-container');
        const index = container.children.length;

        const div = document.createElement('div');
        div.className = 'attestation-item';
        div.innerHTML = `
            <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
            <label>Year: <input type="number" name="att-year-${index}" value="${data?.date?.year || ''}"></label>
            <label>Month: <input type="number" name="att-month-${index}" min="1" max="12" value="${data?.date?.month || ''}"></label>
            <label>Day: <input type="number" name="att-day-${index}" min="1" max="31" value="${data?.date?.day || ''}"></label>
            <label><input type="checkbox" name="att-circa-${index}" ${data?.date?.circa ? 'checked' : ''}> Circa</label>
            <label>Place: <input type="text" name="att-place-${index}" value="${data?.place || ''}"></label>
            <label>Activity: <input type="text" name="att-activity-${index}" value="${data?.activity || ''}"></label>
            <label>Name Used: <input type="text" name="att-name-${index}" value="${data?.personNameUsed || ''}"></label>
            <label>Context: <input type="text" name="att-context-${index}" value="${data?.context || ''}"></label>
            <label>Source ID: <input type="text" name="att-source-${index}" value="${data?.sourceId || ''}"></label>
        `;
        container.appendChild(div);
    },

    // Add relationship field
    addRelationshipField(data = null) {
        const container = document.getElementById('relationships-container');
        const index = container.children.length;

        const div = document.createElement('div');
        div.className = 'relationship-item';
        div.innerHTML = `
            <button type="button" class="remove-btn" onclick="this.parentElement.remove()">×</button>
            <label>Relationship Type: 
                <select name="rel-type-${index}">
                    <option value="father" ${data?.type === 'father' ? 'selected' : ''}>Father</option>
                    <option value="mother" ${data?.type === 'mother' ? 'selected' : ''}>Mother</option>
                    <option value="son" ${data?.type === 'son' ? 'selected' : ''}>Son</option>
                    <option value="daughter" ${data?.type === 'daughter' ? 'selected' : ''}>Daughter</option>
                    <option value="sibling" ${data?.type === 'sibling' ? 'selected' : ''}>Sibling</option>
                    <option value="brother" ${data?.type === 'brother' ? 'selected' : ''}>Brother</option>
                    <option value="sister" ${data?.type === 'sister' ? 'selected' : ''}>Sister</option>
                    <option value="spouse" ${data?.type === 'spouse' ? 'selected' : ''}>Spouse</option>
                    <option value="nephew" ${data?.type === 'nephew' ? 'selected' : ''}>Nephew</option>
                    <option value="niece" ${data?.type === 'niece' ? 'selected' : ''}>Niece</option>
                    <option value="uncle" ${data?.type === 'uncle' ? 'selected' : ''}>Uncle</option>
                    <option value="aunt" ${data?.type === 'aunt' ? 'selected' : ''}>Aunt</option>
                    <option value="cousin" ${data?.type === 'cousin' ? 'selected' : ''}>Cousin</option>
                </select>
            </label>
            <label>Person ID: <input type="text" name="rel-person-${index}" value="${data?.personId || ''}" placeholder="e.g., p001"></label>
            <label>Certainty: 
                <select name="rel-certainty-${index}">
                    <option value="certain" ${data?.certainty === 'certain' ? 'selected' : ''}>Certain</option>
                    <option value="probable" ${data?.certainty === 'probable' ? 'selected' : ''}>Probable</option>
                    <option value="possible" ${data?.certainty === 'possible' ? 'selected' : ''}>Possible</option>
                    <option value="uncertain" ${data?.certainty === 'uncertain' ? 'selected' : ''}>Uncertain</option>
                </select>
            </label>
            <label>Source Citation: <input type="text" name="rel-source-${index}" value="${data?.sources?.[0]?.citation || ''}"></label>
        `;
        container.appendChild(div);
    },

    // Clear form
    clearForm() {
        this.currentPersonId = null;
        document.getElementById('form-title').textContent = 'Add New Person';
        document.getElementById('person-form').reset();
        document.getElementById('person-id').value = '';
        document.getElementById('gender').value = 'unknown';
        document.getElementById('name-variants-container').innerHTML = '';
        document.getElementById('attestations-container').innerHTML = '';
        document.getElementById('relationships-container').innerHTML = '';
        document.getElementById('name-suggestions').innerHTML = '';
        document.getElementById('name-suggestions').style.display = 'none';
        document.getElementById('nationality-suggestions').innerHTML = '';
        document.getElementById('nationality-suggestions').style.display = 'none';
    },

    // Show specific view
    showView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');

        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const navBtnId = 'nav-' + viewId.replace('-view', '');
        const navBtn = document.getElementById(navBtnId);
        if (navBtn) navBtn.classList.add('active');
    },

    // Display statistics
    displayStatistics() {
        const stats = Database.getStatistics();
        const statsDiv = document.getElementById('stats-display');

        statsDiv.innerHTML = `
            <div class="stat-card">
                <div class="number">${stats.totalPersons}</div>
                <div class="label">Total Persons</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.maleCount}</div>
                <div class="label">Male</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.femaleCount}</div>
                <div class="label">Female</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.totalAttestations}</div>
                <div class="label">Total Attestations</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.totalRelationships}</div>
                <div class="label">Total Relationships</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.personsWithBirth}</div>
                <div class="label">Persons with Birth Data</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.personsWithDeath}</div>
                <div class="label">Persons with Death Data</div>
            </div>
            <div class="stat-card">
                <div class="number">${stats.totalNationalities}</div>
                <div class="label">Unique Nationalities</div>
            </div>
        `;
    }
};