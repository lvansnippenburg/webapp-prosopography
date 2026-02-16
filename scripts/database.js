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