// ============================================================
// SIFT Dashboard (v1)
// Handles: auth guard (redirect to login if signed out), loading
// the user's questionnaire responses + account info from
// Firestore, rendering them into the page, and logout.
//
// NOTE: dynamic import, same reasoning as script.js/questionnaire.js
// — a broken firebase-config.js shouldn't crash the whole page.
// ============================================================

const profileFields = document.querySelectorAll("[data-field]");
const preferenceBadges = document.getElementById("preferenceBadges");
const welcomeHeading = document.getElementById("welcomeHeading");

const accountName = document.getElementById("accountName");
const accountEmail = document.getElementById("accountEmail");
const accountJoined = document.getElementById("accountJoined");
const accountQuestionnaireStatus = document.getElementById("accountQuestionnaireStatus");
const accountProvider = document.getElementById("accountProvider");

const logoutBtn = document.getElementById("logout");
const quickLogoutBtn = document.getElementById("quickLogoutBtn");
const generateBtn = document.getElementById("generateBtn");

const recommendationsCard = document.getElementById("recommendationsCard");
const confidenceValue = document.getElementById("confidenceValue");
const resourceList = document.getElementById("resourceList");
const nextCardHeading = document.getElementById("nextCardHeading");
const nextCardText = document.getElementById("nextCardText");
const journeyStepRecommend = document.getElementById("journeyStepRecommend");
const journeyStepLearning = document.getElementById("journeyStepLearning");
const completionBarFill = document.getElementById("completionBarFill");
const completionPercentLabel = document.getElementById("completionPercentLabel");

const whyResourceCard = document.getElementById("whyResourceCard");
const whyList = document.getElementById("whyList");
const compareCard = document.getElementById("compareCard");
const compareTable = document.getElementById("compareTable");

(async () => {
    try {
        const { auth, db } = await import("./firebase-config.js");
        const { onAuthStateChanged, signOut } = await import(
            "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
        );
        const { doc, getDoc } = await import(
            "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
        );

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // No one is signed in — this page requires auth.
                window.location.href = "login.html";
                return;
            }

            await loadDashboard(user, db, doc, getDoc);
        });

        const doLogout = () => signOut(auth).then(() => {
            window.location.href = "index.html";
        });

        logoutBtn?.addEventListener("click", doLogout);
        quickLogoutBtn?.addEventListener("click", doLogout);

    } catch (err) {
        console.warn("Dashboard could not initialize Firebase — check firebase-config.js.", err);
    }
})();

/**
 * Retries an async operation a few times with a short delay —
 * same reasoning as auth-guard.js: a Firestore read right after
 * navigating here can hit a transient connectivity hiccup, and a
 * single failed round-trip shouldn't leave the dashboard blank.
 */
async function withRetry(fn, attempts = 3, delayMs = 400) {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (err) {
            lastErr = err;
            if (i < attempts - 1) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
    }
    throw lastErr;
}

/**
 * Loads the signed-in user's Firestore doc and renders their
 * questionnaire responses, badges, and account info into the page.
 */
async function loadDashboard(user, db, doc, getDoc) {
    accountEmail.textContent = user.email || "—";
    accountProvider.textContent = describeProvider(user);
    accountJoined.textContent = formatJoinedDate(user.metadata?.creationTime);

    let data = {};

    try {
        const snapshot = await withRetry(() => getDoc(doc(db, "users", user.uid)));
        data = snapshot.exists() ? snapshot.data() : {};
    } catch (err) {
        console.warn("Could not load user data from Firestore.", err);
    }

    const questionnaire = data.questionnaire || {};
    const displayName = user.displayName || (user.email ? user.email.split("@")[0] : "there");

    welcomeHeading.textContent = `👋 Welcome back, ${displayName}!`;
    accountName.textContent = user.displayName || "—";
    accountQuestionnaireStatus.textContent = data.questionnaireCompleted ? "Completed" : "Not completed";

    // Populate the six Learning Profile fields.
    profileFields.forEach((el) => {
        const key = el.dataset.field;
        el.textContent = questionnaire[key] || "—";
    });

    // Populate preference badges: skill, experience, learningStyle,
    // language, studyTime, goal, plus any multi-select preferences.
    const badgeValues = [
        questionnaire.skill,
        questionnaire.experience,
        questionnaire.learningStyle,
        questionnaire.language,
        questionnaire.studyTime,
        questionnaire.goal,
        ...(Array.isArray(questionnaire.preferences) ? questionnaire.preferences : []),
    ].filter(Boolean);

    preferenceBadges.innerHTML = "";

    if (badgeValues.length === 0) {
        preferenceBadges.innerHTML = `<span class="badge">No preferences recorded yet</span>`;
    } else {
        badgeValues.forEach((value) => {
            const span = document.createElement("span");
            span.className = "badge";
            span.textContent = value;
            preferenceBadges.appendChild(span);
        });
    }

    // Recommendations: questionnaire.js writes topResources + a
    // confidenceScore to Firestore once it scores resources.json.
    // If that data exists, reveal the recommendations card and flip
    // the journey/CTA into their "generated" state. If not, the
    // dashboard falls back to its original "Coming Soon" state.
    const hasRecommendations = Array.isArray(data.topResources) && data.topResources.length > 0;

    if (hasRecommendations) {
        renderRecommendations(data.topResources, data.confidenceScore);
        renderWhyThisResource(data.topResources[0], data.questionnaire || {});
        renderComparisonTable(data.topResources);
        setJourneyStepDone(journeyStepRecommend, "Complete");
        // "Start Learning" only truly starts once the user has acted
        // on a recommendation, not merely because one exists — so it
        // stays pending here regardless.

        nextCardHeading.textContent = "Your Recommendations Are In!";
        nextCardText.textContent = "We've matched your learning profile against our resource library. Check out your top 3 picks above, or retake the questionnaire if your goals have changed.";

        if (generateBtn) {
            generateBtn.innerHTML = `<i class="ri-check-line"></i> Recommendations Ready`;
            generateBtn.disabled = true; // still non-interactive; it's a status, not an action
        }

        completionBarFill.style.width = "90%";
        completionPercentLabel.textContent = "90%";
    } else {
        // Original v1 behavior: nothing generated yet.
        if (generateBtn) {
            generateBtn.innerHTML = `<i class="ri-hourglass-line"></i> Coming Soon`;
            generateBtn.disabled = true;
        }
    }
}

/**
 * Renders the Recommended Resources card: confidence score plus
 * up to 3 resource cards (title, meta tags, link), with the first
 * one marked as the best match.
 */
function renderRecommendations(topResources, score) {
    recommendationsCard.style.display = "";
    confidenceValue.textContent = typeof score === "number" ? `${score}%` : "—";

    resourceList.innerHTML = "";

    topResources.forEach((resource, index) => {
        const card = document.createElement("div");
        card.className = "resource-card" + (index === 0 ? " best" : "");

        const meta = [resource.difficulty, resource.duration, resource.teachingStyle, resource.language]
            .filter(Boolean)
            .map((m) => `<span>${escapeHtml(m)}</span>`)
            .join("");

        card.innerHTML = `
            <div class="resource-card-head">
                <h3>${escapeHtml(resource.title || "Untitled Resource")}</h3>
                ${index === 0 ? '<span class="best-tag">Best Match</span>' : ""}
            </div>
            <div class="resource-meta">${meta}</div>
            ${resource.link ? `<a class="resource-link" href="${escapeHtml(resource.link)}" target="_blank" rel="noopener">Visit Resource <i class="ri-external-link-line"></i></a>` : ""}
        `;

        resourceList.appendChild(card);
    });
}

/**
 * Renders the "Why This Resource?" card: for the top-ranked resource,
 * checks it against each questionnaire answer using the same criteria
 * as questionnaire.js's scoreResource() (skill, experience/difficulty,
 * goal/bestFor, learning style, language, study time), and shows a
 * matched/unmatched line for each. This is computed here rather than
 * stored in Firestore, since it's fully derivable from data already
 * saved (topResources + questionnaire) — no new write needed.
 */
function renderWhyThisResource(resource, questionnaire) {
    if (!resource) return;
    whyResourceCard.style.display = "";
    whyList.innerHTML = "";

    const difficultyMap = { "Beginner": "beginner", "Intermediate": "intermediate", "Advanced": "advanced" };

    const checks = [
        {
            label: "Skill",
            matched: !!(resource.skill && questionnaire.skill &&
                resource.skill.toLowerCase() === questionnaire.skill.toLowerCase()),
            text: `Focuses on ${resource.skill || "your chosen skill"}, matching what you want to learn.`,
        },
        {
            label: "Experience",
            matched: !!(resource.difficulty && questionnaire.experience &&
                resource.difficulty.toLowerCase() === (difficultyMap[questionnaire.experience] || "")),
            text: `Pitched at a ${resource.difficulty || "—"} level, matching your ${questionnaire.experience || "experience"} experience.`,
        },
        {
            label: "Goal",
            matched: !!(resource.bestFor && questionnaire.goal &&
                resource.bestFor.toLowerCase().includes(questionnaire.goal.toLowerCase())),
            text: `Best suited for ${resource.bestFor || "general learning"}, aligning with your goal of "${questionnaire.goal || "—"}".`,
        },
        {
            label: "Learning Style",
            matched: !!(resource.teachingStyle && questionnaire.learningStyle &&
                resource.teachingStyle.toLowerCase() === questionnaire.learningStyle.toLowerCase()),
            text: `Taught as ${resource.teachingStyle || "—"}, matching your preferred "${questionnaire.learningStyle || "—"}" style.`,
        },
        {
            label: "Language",
            matched: !!(resource.language && questionnaire.language &&
                (questionnaire.language === "Both" || resource.language.toLowerCase() === questionnaire.language.toLowerCase())),
            text: `Available in ${resource.language || "—"}, matching your language preference.`,
        },
    ];

    checks.forEach((check) => {
        const row = document.createElement("div");
        row.className = "why-item " + (check.matched ? "matched" : "unmatched");
        row.innerHTML = `
            <i class="${check.matched ? "ri-checkbox-circle-fill" : "ri-close-circle-line"}"></i>
            <span><span class="why-label">${escapeHtml(check.label)}</span>${escapeHtml(check.text)}</span>
        `;
        whyList.appendChild(row);
    });
}

/**
 * Renders the Compare Your Top 3 table: one column per resource,
 * one row per attribute (difficulty, duration, teaching style,
 * language, strengths, weaknesses, best for). Built entirely from
 * fields already present on each resource object in topResources.
 */
function renderComparisonTable(topResources) {
    if (!Array.isArray(topResources) || topResources.length === 0) return;
    compareCard.style.display = "";

    const headerCells = topResources.map((resource, index) => `
        <th>
            <span class="compare-resource-name">${escapeHtml(resource.title || "Untitled Resource")}</span>
            ${index === 0 ? '<span class="best-tag-inline">Best</span>' : ""}
        </th>
    `).join("");

    const rows = [
        { label: "Difficulty", render: (r) => escapeHtml(r.difficulty || "—") },
        { label: "Duration", render: (r) => escapeHtml(r.duration || "—") },
        { label: "Teaching Style", render: (r) => escapeHtml(r.teachingStyle || "—") },
        { label: "Language", render: (r) => escapeHtml(r.language || "—") },
        { label: "Best For", render: (r) => escapeHtml(r.bestFor || "—") },
        {
            label: "Strengths",
            render: (r) => Array.isArray(r.strengths) && r.strengths.length
                ? `<ul>${r.strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
                : "—",
        },
        {
            label: "Weaknesses",
            render: (r) => Array.isArray(r.weaknesses) && r.weaknesses.length
                ? `<ul>${r.weaknesses.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>`
                : "—",
        },
        {
            label: "Link",
            render: (r) => r.link
                ? `<a class="resource-link" href="${escapeHtml(r.link)}" target="_blank" rel="noopener">Visit <i class="ri-external-link-line"></i></a>`
                : "—",
        },
    ];

    const bodyRows = rows.map((row) => `
        <tr>
            <td>${escapeHtml(row.label)}</td>
            ${topResources.map((r) => `<td>${row.render(r)}</td>`).join("")}
        </tr>
    `).join("");

    compareTable.innerHTML = `
        <thead><tr><th></th>${headerCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
    `;
}

/**
 * Flips a journey timeline step from "pending" to "done" and
 * updates its status text.
 */
function setJourneyStepDone(stepEl, statusText) {
    if (!stepEl) return;
    stepEl.classList.remove("pending");
    stepEl.classList.add("done");
    stepEl.querySelector(".journey-dot i").className = "ri-check-line";
    stepEl.querySelector("[data-status]").textContent = statusText;
}

/**
 * Minimal HTML escaping for resource data pulled from Firestore/
 * resources.json before it's inserted via innerHTML.
 */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function describeProvider(user) {
    const providerId = user.providerData?.[0]?.providerId || "";
    if (providerId.includes("google")) return "Google";
    if (providerId.includes("password")) return "Email";
    return providerId || "—";
}

function formatJoinedDate(isoString) {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
