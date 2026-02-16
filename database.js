// Database module - handles all data operations
const Database = {
    STORAGE_KEY: 'prosopography_db',

    // Soundex algorithm implementation for phonetic matching
    soundex(word) {
        if (!word) return null;

        word = word.toUpperCase().replace(/[^A-Z]/g, '');
        if (word.length === 0) return null;

        const firstLetter = word[0];

        // Soundex letter codes
        const getCode = (char) => {
            switch(char) {
                case 'B': case 'F': case 'P': case 'V':
                    return '1';
                case 'C': case 'G': case 'J': case 'K': case 'Q': case 'S': case 'X': case 'Z':
                    return '2';
                case 'D': case 'T':
                    return '3';
                case 'L':
                    return '4';
                case 'M': case 'N':
                    return '5';
                case 'R':
                    return '6';
                default:
                    return null;
            }
        };

        let code = firstLetter;
        let lastCode = getCode(firstLetter);

        for (let i = 1; i < word.length && code.length < 4; i++) {
            const currentCode = getCode(word[i]);
            if (currentCode && currentCode !== lastCode) {
                code += currentCode;
                lastCode = currentCode;
            } else if (!currentCode) {
                lastCode = null;
            }
        }

        // Pad with zeros to make it 4 characters
        while (code.length < 4) {
            code += '0';
        }

        return code;
    },

    // Check if two words sound similar using Soundex
    soundsLike(word1, word2) {
        const code1 = this.soundex(word1);
        const code2 = this.soundex(word2);
        return code1 && code2 && code1 === code2;
    },

    // Get all unique nationalities from existing persons
    getAllNationalities() {
        const persons = this.getAllPersons();
        const nationalities = new Set();

        persons.forEach(person => {
            if (person.nationality && person.nationality.trim()) {
                nationalities.add(person.nationality.trim());
            }
        });

        return Array.from(nationalities).sort();
    },

    // Filter nationalities based on input
    filterNationalities(input) {
        if (!input || input.length < 1) return [];

        const allNationalities = this.getAllNationalities();
        const searchTerm = input.toLowerCase();

        return allNationalities.filter(nat => 
            nat.toLowerCase().includes(searchTerm)
        );
    },

    // Initialize database
    init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const initialData = {
                persons: [],
                sources: [],
                nextPersonId: 1,
                nextSourceId: 1
            };
            this.save(initialData);
        }
    },

    // Get all data
    getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : { persons: [], sources: [], nextPersonId: 1, nextSourceId: 1 };
    },

    // Save all data
    save(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Generate new person ID
    generatePersonId() {
        const data = this.getData();
        const id = `p${String(data.nextPersonId).padStart(3, '0')}`;
        data.nextPersonId++;
        this.save(data);
        return id;
    },

    // Generate new source ID
    generateSourceId() {
        const data = this.getData();
        const id = `s${String(data.nextSourceId).padStart(3, '0')}`;
        data.nextSourceId++;
        this.save(data);
        return id;
    },

    // CRUD operations for persons
    getAllPersons() {
        return this.getData().persons;
    },

    getPersonById(id) {
        const data = this.getData();
        return data.persons.find(p => p.id === id);
    },

    addPerson(person) {
        const data = this.getData();
        if (!person.id) {
            person.id = this.generatePersonId();
        }
        data.persons.push(person);
        this.save(data);
        return person.id;
    },

    updatePerson(id, updatedPerson) {
        const data = this.getData();
        const index = data.persons.findIndex(p => p.id === id);
        if (index !== -1) {
            data.persons[index] = { ...updatedPerson, id };
            this.save(data);
            return true;
        }
        return false;
    },

    deletePerson(id) {
        const data = this.getData();
        data.persons = data.persons.filter(p => p.id !== id);
        this.save(data);
    },

    // Enhanced search with phonetic matching
    searchPersons(criteria) {
        const persons = this.getAllPersons();
        const usePhonetic = criteria.usePhonetic || false;

        return persons.filter(person => {
            // Search by name (any variant) with optional phonetic matching
            if (criteria.name) {
                const searchTerm = criteria.name.toLowerCase();
                const searchSoundex = usePhonetic ? this.soundex(criteria.name) : null;

                // Check standardized name
                const standardMatch = person.standardizedName.toLowerCase().includes(searchTerm);
                const standardPhoneticMatch = usePhonetic && searchSoundex ? 
                    this.soundex(person.standardizedName) === searchSoundex : false;

                // Check name variants
                const variantMatch = person.nameVariants?.some(v => {
                    const textMatch = 
                        v.firstName?.toLowerCase().includes(searchTerm) ||
                        v.lastName?.toLowerCase().includes(searchTerm) ||
                        v.patronym?.toLowerCase().includes(searchTerm) ||
                        v.fullName?.toLowerCase().includes(searchTerm);

                    if (usePhonetic && searchSoundex) {
                        const phoneticMatch = 
                            this.soundex(v.firstName) === searchSoundex ||
                            this.soundex(v.lastName) === searchSoundex ||
                            this.soundex(v.patronym) === searchSoundex;
                        return textMatch || phoneticMatch;
                    }

                    return textMatch;
                });

                if (!standardMatch && !standardPhoneticMatch && !variantMatch) return false;
            }

            // Search by place
            if (criteria.place) {
                const placeTerm = criteria.place.toLowerCase();
                const birthMatch = person.lifeEvents?.birth?.place?.toLowerCase().includes(placeTerm);
                const deathMatch = person.lifeEvents?.death?.place?.toLowerCase().includes(placeTerm);
                const attestationMatch = person.attestations?.some(a => 
                    a.place?.toLowerCase().includes(placeTerm)
                );
                if (!birthMatch && !deathMatch && !attestationMatch) return false;
            }

            // Search by year
            if (criteria.year) {
                const year = parseInt(criteria.year);
                const birthYear = person.lifeEvents?.birth?.date?.year;
                const deathYear = person.lifeEvents?.death?.date?.year;
                const attestationYear = person.attestations?.some(a => a.date?.year === year);
                if (birthYear !== year && deathYear !== year && !attestationYear) return false;
            }

            return true;
        });
    },

    // Utility functions
    formatDate(dateObj) {
        if (!dateObj || !dateObj.year) return '';

        const parts = [];
        if (dateObj.circa) parts.push('c.');

        if (dateObj.day && dateObj.month) {
            parts.push(`${dateObj.day}/${dateObj.month}/${dateObj.year}`);
        } else if (dateObj.month) {
            parts.push(`${dateObj.month}/${dateObj.year}`);
        } else {
            parts.push(dateObj.year);
        }

        return parts.join(' ');
    },

    formatDateRange(birth, death) {
        const birthStr = birth?.date ? this.formatDate(birth.date) : '?';
        const deathStr = death?.date ? this.formatDate(death.date) : '?';
        return `${birthStr} - ${deathStr}`;
    },

    // Export data
    exportJSON() {
        return JSON.stringify(this.getData(), null, 2);
    },

    // Import data
    importJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            // Validate basic structure
            if (!data.persons || !Array.isArray(data.persons)) {
                throw new Error('Invalid data format');
            }
            this.save(data);
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    },

    // Get statistics
    getStatistics() {
        const data = this.getData();
        const persons = data.persons;

        const totalAttestations = persons.reduce((sum, p) => 
            sum + (p.attestations?.length || 0), 0
        );

        const totalRelationships = persons.reduce((sum, p) => 
            sum + (p.relationships?.length || 0), 0
        );

        const personsWithBirth = persons.filter(p => 
            p.lifeEvents?.birth?.date?.year
        ).length;

        const personsWithDeath = persons.filter(p => 
            p.lifeEvents?.death?.date?.year
        ).length;

        const nationalities = this.getAllNationalities();

        const maleCount = persons.filter(p => p.gender === 'male').length;
        const femaleCount = persons.filter(p => p.gender === 'female').length;
        const unknownGender = persons.filter(p => !p.gender || p.gender === 'unknown').length;

        return {
            totalPersons: persons.length,
            totalSources: data.sources.length,
            totalAttestations,
            totalRelationships,
            personsWithBirth,
            personsWithDeath,
            totalNationalities: nationalities.length,
            maleCount,
            femaleCount,
            unknownGender
        };
    }
};

// Initialize database on load
Database.init();

console.log('Database module loaded successfully');