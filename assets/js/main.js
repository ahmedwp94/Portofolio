// ============================================================
// CONFIG — replace with your deployed Google Apps Script Web App URL
// (see /apps-script/Code.gs and README.md for setup steps)
// ============================================================
const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// ============================================================
// Footer year
// ============================================================
document.getElementById("year").textContent = new Date().getFullYear();

// ============================================================
// Altitude tab switching
// ============================================================
const tabs = document.querySelectorAll(".altitude-tab");
const panels = document.querySelectorAll(".altitude-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-target");

    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    panels.forEach((p) => p.classList.remove("active"));
    document.getElementById(`panel-${target}`).classList.add("active");
  });
});

// ============================================================
// Demo request form -> Google Sheet via Apps Script
// ============================================================
const form = document.getElementById("demo-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (SCRIPT_URL.includes("PASTE_YOUR")) {
    status.textContent = "Form isn't connected yet — add your Apps Script URL in assets/js/main.js (see README.md).";
    status.className = "form-status err";
    return;
  }

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  status.textContent = "Sending…";
  status.className = "form-status";

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    company: form.company.value.trim(),
    message: form.message.value.trim(),
    submittedAt: new Date().toISOString(),
  };

  try {
    // Apps Script web apps don't return CORS headers, so the response
    // body isn't readable from the browser. mode: "no-cors" still lets
    // the POST go through and reach the sheet — we just can't inspect
    // the response, so we optimistically show success after it resolves.
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    status.textContent = "Thanks — your request has been sent. I'll follow up by email shortly.";
    status.className = "form-status ok";
    form.reset();
  } catch (err) {
    status.textContent = "Something went wrong sending your request. Please try again or email directly.";
    status.className = "form-status err";
  } finally {
    submitBtn.disabled = false;
  }
});
