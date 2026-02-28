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

    // Step 1 – fetch all records (including tombstones) and the remote listing
    Promise.all([Database.getAllPersonsIncludingDeleted(), self._listRemoteRecords()])
      .then(function (results) {
        var localPersons = results[0];
        var remoteFiles = results[1];

        // Build lookup maps (includes tombstones — getAllPersonsIncludingDeleted was used)
        var localByUUIDAll = {};
        localPersons.forEach(function (p) {
          if (p.uuid) localByUUIDAll[p.uuid] = p;
        });
        var localByUUID = localByUUIDAll;

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
          var summary = {
            inserted: 0,
            updated: 0,
            uploaded: 0,
            deleted: 0,
            skipped: 0,
            conflicts: 0,
          };

          // --- Evaluate remote records ---
          var applyRemote = remoteUUIDs.reduce(function (chain, uuid) {
            return chain.then(function () {
              var remote = remoteRecordByUUID[uuid];
              if (!remote) return; // fetch failed, skip

              var local = localByUUID[uuid];
              var remoteDate = remote.modifiedAt ? new Date(remote.modifiedAt) : new Date(0);

              if (!local) {
                // Remote only → apply locally (upsertPerson handles tombstones)
                return Database.upsertPerson(remote).then(function (result) {
                  if (result === "deleted") summary.deleted++;
                  else summary.inserted++;
                });
              }

              var localDate = local.modifiedAt ? new Date(local.modifiedAt) : new Date(0);

              if (localDate.getTime() === remoteDate.getTime()) {
                summary.skipped++;
                return; // identical, nothing to do
              }

              if (remoteDate > localDate) {
                // Remote is newer → apply locally.
                // If the remote is a tombstone, soft-delete locally.
                // If the local is already soft-deleted and the remote is also a
                // tombstone (or vice-versa) upsertPerson handles it correctly.
                return Database.upsertPerson(remote).then(function (result) {
                  if (result === "deleted") summary.deleted++;
                  else summary.updated++;
                });
              }

              // localDate > remoteDate — local is newer.
              // Special case: if the local is a tombstone but the remote is not,
              // we want to push the deletion to GitHub rather than treat it as a
              // conflict — queue it for upload.
              if (local.deletedAt && !remote.deletedAt) {
                toUpload.push({
                  person: local,
                  sha: remote._remoteFileSha || null,
                  filePath: self.config.folder + "/" + uuid + ".json",
                });
                return;
              }

              // Both sides are live records — check for true conflict vs. simple
              // local-only edit (remote has been changed since the record was created).
              var localCreated = local.createdAt ? new Date(local.createdAt) : new Date(0);
              if (remoteDate > localCreated) {
                // Both sides have been edited after the record was first created → conflict
                // Skip conflict UI for tombstones — local deletion wins silently.
                if (local.deletedAt) {
                  toUpload.push({
                    person: local,
                    sha: remote._remoteFileSha || null,
                    filePath: self.config.folder + "/" + uuid + ".json",
                  });
                } else {
                  conflicts.push({ local: local, remote: remote });
                  summary.conflicts++;
                }
              } else {
                // Remote is the original unedited version → safe to push local
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
                // Don't push a tombstone for something GitHub has never seen
                if (local.deletedAt) return;
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
                if (summary.deleted) parts.push(summary.deleted + " deleted");
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

    Database.getAllPersonsIncludingDeleted()
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
                // Don't bother pushing a tombstone for something GitHub has never seen
                if (person.deletedAt) {
                  done++;
                  skipCount++;
                  updateProgress();
                  return;
                }
                var content = JSON.stringify(person, null, 2);
                var label = person.standardizedName || "unknown";
                var msg = "Add record " + person.uuid + " (" + label + ")";
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
                var verb = person.deletedAt ? "Delete (tombstone)" : "Update";
                var msg =
                  verb +
                  " record " +
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
                else if (result === "deleted") {
                  // Count deletions separately — reuse updateCount for display
                  updateCount++;
                } else {
                  skipCount++;
                }
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
