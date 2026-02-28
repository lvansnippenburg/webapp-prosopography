// Database Module - Handles all data storage and retrieval via IndexedDB
const Database = {
  DB_NAME: "prosopographyDB",
  DB_VERSION: 3,
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

          // ── Re-migration: fix any records where id !== uuid ──────────
          // (DB_VERSION 2 migration forgot to set id = uuid, so legacy
          //  records like "p001" are stored under a uuid key but still
          //  carry the old id, causing card clicks to fail the lookup.)
          var fixStore = tx.objectStore(self.STORE_NAME);
          var cursorReq = fixStore.openCursor();
          cursorReq.onsuccess = function (e) {
            var cursor = e.target.result;
            if (!cursor) return;
            var record = cursor.value;
            if (record.uuid && record.id !== record.uuid) {
              record.id = record.uuid;
              cursor.update(record);
            }
            cursor.continue();
          };
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
              // Ensure id always equals uuid so data-id on cards matches the IDB key
              person.id = person.uuid;
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
    }).then(function (found) {
      if (found) return found;

      // Fallback: full scan for records whose id field still holds the old
      // legacy value (e.g. "p001") while the IDB key is a proper uuid.
      // This handles any records that slipped through before the re-migration
      // in onupgradeneeded ran (e.g. first page-load after the DB_VERSION bump).
      return Database._txRead(function (store) {
        return store.getAll();
      }).then(function (all) {
        return all.find(function (p) {
          return p.id === uuid || p.uuid === uuid;
        });
      });
    });
  },

  // Legacy alias — id === uuid after migration.
  // Returns Promise<Person|undefined>
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
