(() => {
  'use strict';

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toast = document.getElementById('toast');
  const tr = (source, replacements = {}) => {
    const translated = window.portfolioI18n?.t?.(source) ?? source;
    return String(translated).replace(/\{([a-z]+)\}/gi, (match, key) => (
      Object.prototype.hasOwnProperty.call(replacements, key) ? String(replacements[key]) : match
    ));
  };
  const activeLanguage = () => window.portfolioI18n?.language || root.lang || 'en';
  const interfaceCopy = Object.freeze({
    commandNoResults: () => tr('No exact match. Try “human review”, “product discovery”, “evaluation” or “inspect”.'),
    commandResultCount: (count) => tr(count === 1 ? '{count} result available' : '{count} results available', { count }),
    casePosition: (current, total) => tr('System {current} of {total}', { current, total })
  });
  let toastTimer;
  let lastDialogTrigger = null;

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (_) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (_) { /* Storage can be blocked. */ }
    }
  };

  const showToast = (message) => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = tr(message);
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  };

  const copyText = async (text, confirmation = 'Copied to clipboard') => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      showToast(confirmation);
      return true;
    } catch (_) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (copied) showToast(confirmation);
      return copied;
    }
  };

  const openDialog = (dialog, trigger = document.activeElement) => {
    if (!dialog) return;
    lastDialogTrigger = trigger instanceof HTMLElement ? trigger : null;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  const closeDialog = (dialog) => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
    dialog.addEventListener('close', () => {
      if (lastDialogTrigger?.isConnected) lastDialogTrigger.focus({ preventScroll: true });
      lastDialogTrigger = null;
    });
    dialog.querySelectorAll('[data-close-dialog]').forEach((button) => {
      button.addEventListener('click', () => closeDialog(dialog));
    });
  });

  // Theme: protected storage, system preference, explicit accessible state.
  const themeToggle = document.getElementById('themeToggle');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = (theme, persist = false) => {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    themeToggle?.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    themeToggle?.setAttribute('aria-label', tr(nextTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));
    if (persist) safeStorage.set('mn-theme', nextTheme);
  };

  const savedTheme = safeStorage.get('mn-theme');
  applyTheme(savedTheme || (systemPrefersDark.matches ? 'dark' : 'light'));

  themeToggle?.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  if (!savedTheme) {
    systemPrefersDark.addEventListener?.('change', (event) => applyTheme(event.matches ? 'dark' : 'light'));
  }

  // Navigation, progress and mobile menu.
  const scrollProgress = document.getElementById('scrollProgress');
  let scrollFrame = null;
  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress * 100}%`;
    scrollFrame = null;
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });
  updateScrollProgress();

  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55%', threshold: 0 });
    navSections.forEach((section) => navObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8%', threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const setMenu = (open) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', tr(open ? 'Close navigation menu' : 'Open navigation menu'));
    mobileMenu.hidden = !open;
  };
  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  mobileMenu?.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });

  // Progressive disclosure keeps mobile concise without removing any content.
  const compactViewport = window.matchMedia('(max-width: 700px)');
  const syncDisclosures = () => {
    document.querySelectorAll('.method-grid .mobile-disclosure').forEach((details) => {
      details.open = !compactViewport.matches;
    });
    document.querySelectorAll('.experience-details').forEach((details, index) => {
      details.open = !compactViewport.matches || index === 0;
    });
    document.querySelectorAll('.case-detail-item').forEach((details, index) => {
      details.open = !compactViewport.matches || index === 0;
    });
  };
  syncDisclosures();
  compactViewport.addEventListener?.('change', syncDisclosures);

  let printDisclosureState = [];
  window.addEventListener('beforeprint', () => {
    const disclosures = [...document.querySelectorAll('.mobile-disclosure')];
    printDisclosureState = disclosures.map((details) => details.open);
    disclosures.forEach((details) => { details.open = true; });
  });
  window.addEventListener('afterprint', () => {
    document.querySelectorAll('.mobile-disclosure').forEach((details, index) => {
      details.open = printDisclosureState[index] ?? details.open;
    });
  });

  // Mobile case carousel position: visual updates stay responsive while live announcements wait for scroll to settle.
  const caseGrid = document.querySelector('.case-grid');
  const caseCards = caseGrid ? [...caseGrid.querySelectorAll('.case-card')] : [];
  const caseCounter = document.getElementById('caseCounter');
  const caseCounterStatus = document.getElementById('caseCounterStatus');
  let activeCarouselCase = -1;
  let announcedCarouselCase = -1;
  let caseCounterFrame = null;
  let caseCounterTimer = null;

  const setCaseCounter = (index, announce = false) => {
    if (!caseCards.length || index < 0 || index >= caseCards.length) return;
    const current = index + 1;
    const total = caseCards.length;
    if (activeCarouselCase !== index) {
      activeCarouselCase = index;
      if (caseCounter) caseCounter.textContent = `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
    if (announce && announcedCarouselCase !== index) {
      announcedCarouselCase = index;
      if (caseCounterStatus) caseCounterStatus.textContent = interfaceCopy.casePosition(current, total);
    }
  };

  const nearestCarouselCase = () => {
    if (!caseGrid || !caseCards.length) return -1;
    const gridRect = caseGrid.getBoundingClientRect();
    const gridCentre = gridRect.left + (gridRect.width / 2);
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    caseCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const distance = Math.abs((cardRect.left + (cardRect.width / 2)) - gridCentre);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  };

  const updateCaseCounter = (announce = false) => {
    if (!compactViewport.matches) return;
    setCaseCounter(nearestCarouselCase(), announce);
  };

  const requestCaseCounterUpdate = () => {
    if (!compactViewport.matches) return;
    if (!caseCounterFrame) {
      caseCounterFrame = window.requestAnimationFrame(() => {
        caseCounterFrame = null;
        updateCaseCounter(false);
      });
    }
    window.clearTimeout(caseCounterTimer);
    caseCounterTimer = window.setTimeout(() => updateCaseCounter(true), 160);
  };

  if (caseGrid && caseCards.length) {
    setCaseCounter(0, false);
    caseGrid.addEventListener('scroll', requestCaseCounterUpdate, { passive: true });
    caseGrid.addEventListener('focusin', (event) => {
      if (!compactViewport.matches) return;
      const card = event.target instanceof Element ? event.target.closest('.case-card') : null;
      const index = caseCards.indexOf(card);
      if (index >= 0) setCaseCounter(index, true);
    });
    window.addEventListener('resize', requestCaseCounterUpdate, { passive: true });
    compactViewport.addEventListener?.('change', () => {
      if (compactViewport.matches) requestCaseCounterUpdate();
    });
    updateCaseCounter(false);
  }

  // Case-study decision logs. All text is static and rendered with textContent.
  const caseData = {
    research: {
      eyebrow: 'Knowledge workflow · composite pattern',
      title: 'From fragmented sources to reviewable outputs',
      summary: [
        ['User', 'Cross-functional teams working across heterogeneous sources'],
        ['Status', 'Reusable anonymised composite'],
        ['Skills demonstrated', 'Workflow design, orchestration, QA and prototyping']
      ],
      details: [
        ['The problem', 'Knowledge work begins across documents, websites, structured sources and notes. Manual copy-paste obscures provenance, makes comparison costly and turns every output into a one-off effort.'],
        ['Before → after', 'Scattered browsing and manual reconciliation become a staged pipeline: acquire, normalise, interpret, verify, review and publish.'],
        ['Product decision', 'Preserve sources before adding synthesis. A useful output lets a reviewer inspect the evidence behind each important claim.'],
        ['What to measure', 'Evidence coverage on a fixed benchmark set, unsupported-claim rate, time to correct, and reviewer acceptance with reason-coded edits.']
      ],
      layers: [
        ['Deterministic', 'Source acquisition, metadata normalisation, deduplication, required fields and evidence-link checks.'],
        ['AI', 'Classification, thematic grouping, extraction and synthesis where language understanding creates leverage.'],
        ['Human', 'Scope decisions, interpretation of sensitive context, exception resolution and final editorial approval.']
      ],
      caveat: 'Outcome evidence is described qualitatively because the underlying work and sources are confidential. No throughput or accuracy metric is implied here.'
    },
    evaluation: {
      eyebrow: 'Evaluation system · pre-calibration pattern',
      title: 'Evidence-first evaluation workbench',
      summary: [
        ['User', 'Teams comparing complex qualitative options and scenarios'],
        ['Status', 'Prototype and pre-calibration workflow pattern'],
        ['Skills demonstrated', 'Evidence modelling, rubric design, agent flow, scoring and review logic']
      ],
      details: [
        ['The problem', 'Complex evaluations mix observed facts, interpretation and speculation. A polished score can hide weak evidence or mirror the starting hypothesis.'],
        ['Before → after', 'Ad-hoc judgement becomes an evidence-first flow: capture observations, label inference and uncertainty, apply a stable rubric, compare variants and route sensitive cases to review.'],
        ['Product decision', 'Evidence comes before score. Early outputs carry confidence limits, and exploratory scenarios remain separate from real-world observations.'],
        ['What to measure', 'Reviewer agreement and disagreement reasons, ordering stability under input changes, unsupported claims, override reasons and calibration against observed outcomes.']
      ],
      layers: [
        ['Deterministic', 'Evidence schemas, observed/inferred/unknown states, scoring ranges, confidence caps and completeness checks.'],
        ['AI', 'Evidence extraction, qualitative lenses, scenario variation, critique and evidence-bound explanation.'],
        ['Human', 'Criteria definition, sensitive-case review, calibration, dispute resolution and the final decision.']
      ],
      caveat: 'This pre-calibration pattern is not population-validated. Synthetic scenarios explore hypotheses; they do not replace real research, and no live performance claim is made without observed evidence.'
    },
    platform: {
      eyebrow: 'Self-service product · adaptation and hardening',
      title: 'Structured self-service workflow',
      summary: [
        ['User', 'Non-technical teams producing recurring structured outputs'],
        ['Status', 'Adaptation and product-hardening pattern'],
        ['Skills demonstrated', 'UX simplification, configuration, batch data flows, security hardening and deployment readiness']
      ],
      details: [
        ['The problem', 'Small changes and team-wide updates often bounce between data sources, specialists and administrators, creating rework and inconsistent outputs.'],
        ['Before → after', 'Templates, individual or batch inputs, guided editing and export become one coherent self-service flow.'],
        ['Product decision', 'Automate repeatable placement and validation while keeping meaningful adjustments with the user. Different access paths share the same clear mental model.'],
        ['What to measure', 'Task completion without help, import error and recovery rate, output fidelity, time to a usable result and reason-coded rework.']
      ],
      layers: [
        ['Deterministic', 'Input validation, field mapping, access policies, private storage and export rules.'],
        ['Automation', 'Template population, batch generation and reusable layout behaviour.'],
        ['Human', 'Template choice, guided adjustment, exception handling and approval of the final output.']
      ],
      caveat: 'This pattern includes adaptation of an open-source foundation. The contribution described here is product adaptation, UX and security hardening, configuration and deployment readiness — not original authorship of the foundation.'
    },
    reporting: {
      eyebrow: 'Analysis automation · reusable pipeline',
      title: 'Validated data-to-output workflow',
      summary: [
        ['User', 'Analysts producing recurring business outputs'],
        ['Status', 'Structured analysis and reporting pattern'],
        ['Skills demonstrated', 'Pipeline design, validation boundaries and output architecture']
      ],
      details: [
        ['The problem', 'Recurring analysis becomes fragile when calculations, interpretation and document production live in one opaque workflow.'],
        ['Before → after', 'Manual recomputation and narrative assembly become separate stages: process, validate, structure, interpret and publish.'],
        ['Product decision', 'Never ask a language model to be the calculator of record. Create trusted structured outputs first, then use AI selectively around them.'],
        ['What to measure', 'Reconciliation failure rate, claim-to-data errors, reviewer corrections and time to an approved report — not draft speed alone.']
      ],
      layers: [
        ['Deterministic', 'Parsing, calculations, validation, structured outputs, templates and export rules.'],
        ['AI', 'Categorisation, synthesis and explanation where the result can be traced to validated data.'],
        ['Human', 'Business interpretation, outlier review, narrative judgement and approval of the delivered report.']
      ],
      caveat: 'No ROI is stated without measured project data. The case documents the architecture and quality boundary instead.'
    },
    measurement: {
      eyebrow: 'Analysis & measurement · anonymised multi-surface pattern',
      title: 'Multi-surface analysis & measurement system',
      summary: [
        ['User', 'Analysts, contributors and authorised reviewers'],
        ['Surfaces', 'Browser and installed-client inputs, operational views, structured storage and role-aware outputs'],
        ['Skills demonstrated', 'Workflow mapping, UX, data modelling, measurement logic, prototyping and evaluation']
      ],
      details: [
        ['The problem', 'Distributed analysis becomes a stateful product once access, multiple input paths, shared calculations, status, evidence, review and useful outputs need to stay aligned.'],
        ['Before → after', 'Disconnected inputs and separately calculated outputs become one coordinated flow backed by a structured model, shared rules and explicit review states.'],
        ['Product decision', 'One versioned calculation and validation layer serves every surface. The analysis record — not a generated summary — is the source of truth, and privileged actions stay protected.'],
        ['What to measure', 'Calculation consistency across surfaces, completion and recovery rates, access exceptions, time to reviewed output, human overrides and output fidelity.']
      ],
      layers: [
        ['Deterministic', 'Access, data constraints, process states, shared measurement rules, routing, audit trails and output assembly.'],
        ['AI', 'Optional evidence-bound synthesis and explanation after structured processing; never an autonomous final response.'],
        ['Human', 'Interpretation, exception resolution, measurement review, recommendation and final approval.']
      ],
      caveat: 'This anonymised composite reflects architecture and local build work; production deployment and real-world adoption are not claimed. Production security and scale still require formal engineering review.'
    },
    orchestration: {
      eyebrow: 'Agentic orchestration · governed composite pattern',
      title: 'Governed multi-stage knowledge workflow',
      summary: [
        ['User', 'Teams delivering complex, evidence-heavy outputs'],
        ['Status', 'Multi-stage agentic workflow pattern'],
        ['Skills demonstrated', 'Workflow architecture, stage contracts, decision records and QA boundaries']
      ],
      details: [
        ['The problem', 'Large knowledge tasks create missed constraints, generic reuse and repeated questions. Intake, research, option design and production often drift apart before final review.'],
        ['Before → after', 'Intake, contextual research, alternative design, production and independent QA run as explicit stages that can reopen when evidence changes.'],
        ['Product decision', 'Ask only questions that change the route. Facts, evidence, interpretations and assumptions remain distinct, while a shared state keeps the next action obvious.'],
        ['What to measure', 'Constraint coverage, unsupported assertions, reopened-stage reasons, high-impact questions per phase and QA findings caught before delivery.']
      ],
      layers: [
        ['Deterministic', 'Stage contracts, required artefacts, status transitions, source registers and completion gates.'],
        ['AI', 'Specialist analysis, research synthesis, option generation, production support and independent challenge.'],
        ['Human', 'Strategic choices, material commitments, assumptions, approvals and final accountability.']
      ],
      caveat: 'This is a workflow and prompt-governance pattern, not a claim of autonomous delivery. Evidence and material commitments always require human verification.'
    },
    control: {
      eyebrow: 'AI-assisted operations · production-oriented pattern',
      title: 'Governed operations control plane',
      summary: [
        ['User', 'Operators managing multiple software products and releases'],
        ['Status', 'Production-oriented architecture, not claimed as live production'],
        ['Skills demonstrated', 'Product architecture, operator UX, safety gates and system prototyping']
      ],
      details: [
        ['The problem', 'AI-assisted maintenance becomes unsafe when intent, code changes, tests, deployment state and rollback live in disconnected tools or opaque agents.'],
        ['Before → after', 'A conversational request becomes an event and a visible task timeline across specialised workers for analysis, changes, review, tests, security and release.'],
        ['Product decision', 'Preview is the default. Risky actions need approval, direct commits to the main branch are blocked, and every release keeps a pause and rollback path.'],
        ['What to measure', 'Approval latency, failed or retried tasks by type, test and security gate failures, rollback readiness, recovery time and operator interventions.']
      ],
      layers: [
        ['Deterministic', 'Typed events, queues, allowlists, isolated workspaces, idempotency, audit logs and release gates.'],
        ['AI', 'Intent interpretation and specialised workers for analysis, implementation, review and remediation plans.'],
        ['Human', 'Approval of risky actions, exception handling, release control and rollback decisions.']
      ],
      caveat: 'The architecture is production-oriented, not verified in production. RBAC, stronger isolation, observability and dead-letter handling remain explicit hardening work.'
    }
  };

  const caseOrder = ['research', 'evaluation', 'platform', 'reporting', 'measurement', 'orchestration', 'control'];
  const caseDialog = document.getElementById('caseDialog');
  const caseDialogTitle = document.getElementById('caseDialogTitle');
  const caseDialogEyebrow = document.getElementById('caseDialogEyebrow');
  const caseDialogBody = document.getElementById('caseDialogBody');
  const copyCaseLink = document.getElementById('copyCaseLink');
  let activeCase = caseOrder[0];
  let lastNonCaseHash = '#work';

  const makeElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = tr(text);
    return element;
  };

  const renderCase = (caseId) => {
    const data = caseData[caseId];
    if (!data || !caseDialogBody) return;
    activeCase = caseId;
    caseDialogTitle.textContent = tr(data.title);
    caseDialogEyebrow.textContent = tr(data.eyebrow);
    caseDialogBody.replaceChildren();

    const summary = makeElement('div', 'case-summary');
    data.summary.forEach(([label, value]) => {
      const item = document.createElement('div');
      item.append(makeElement('span', '', label), makeElement('strong', '', value));
      summary.append(item);
    });

    const detailGrid = makeElement('div', 'case-detail-grid');
    data.details.forEach(([label, value], index) => {
      const item = document.createElement('details');
      item.className = 'case-detail-item';
      item.open = !compactViewport.matches || index === 0;
      item.append(makeElement('summary', '', label), makeElement('p', '', value));
      detailGrid.append(item);
    });

    const decisionStack = makeElement('div', 'decision-stack');
    data.layers.forEach(([label, value]) => {
      const layer = makeElement('div', 'decision-layer');
      layer.append(makeElement('span', '', label), makeElement('p', '', value));
      decisionStack.append(layer);
    });

    caseDialogBody.append(summary, detailGrid, decisionStack, makeElement('div', 'case-caveat', data.caveat));
  };

  const openCase = (caseId, trigger, updateUrl = true) => {
    if (!caseData[caseId]) return;
    if (!window.location.hash.startsWith('#case-')) lastNonCaseHash = window.location.hash || '#work';
    renderCase(caseId);
    if (updateUrl) history.pushState({ caseId }, '', `#case-${caseId}`);
    if (!caseDialog.open) openDialog(caseDialog, trigger);
  };

  document.querySelectorAll('.case-open').forEach((button) => {
    button.addEventListener('click', () => openCase(button.dataset.case, button));
  });

  caseDialog?.addEventListener('close', () => {
    if (window.location.hash === `#case-${activeCase}`) history.replaceState({}, '', lastNonCaseHash || '#work');
  });

  document.querySelector('[data-next-case]')?.addEventListener('click', () => {
    const nextIndex = (caseOrder.indexOf(activeCase) + 1) % caseOrder.length;
    renderCase(caseOrder[nextIndex]);
    history.replaceState({ caseId: caseOrder[nextIndex] }, '', `#case-${caseOrder[nextIndex]}`);
    caseDialog?.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  });

  copyCaseLink?.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    url.searchParams.delete('inspect');
    url.hash = `case-${activeCase}`;
    copyText(url.toString(), 'Case link copied');
  });

  const handleCaseHash = () => {
    const match = window.location.hash.match(/^#case-(research|evaluation|platform|reporting|measurement|orchestration|control)$/);
    if (match) openCase(match[1], null, false);
  };
  window.addEventListener('hashchange', handleCaseHash);

  // Recruiter tour.
  const tourDialog = document.getElementById('tourDialog');
  const tourSlides = [...document.querySelectorAll('[data-tour-slide]')];
  const tourProgress = document.getElementById('tourProgress');
  const tourBack = document.getElementById('tourBack');
  const tourNext = document.getElementById('tourNext');
  let tourIndex = 0;

  const renderTour = () => {
    tourSlides.forEach((slide, index) => {
      const active = index === tourIndex;
      slide.hidden = !active;
      slide.classList.toggle('active', active);
    });
    if (tourProgress) tourProgress.style.width = `${((tourIndex + 1) / tourSlides.length) * 100}%`;
    if (tourBack) tourBack.disabled = tourIndex === 0;
    if (tourNext) {
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      tourNext.replaceChildren(document.createTextNode(`${tr(tourIndex === tourSlides.length - 1 ? 'Finish' : 'Next')} `), arrow);
    }
  };

  const startTour = (trigger) => {
    tourIndex = 0;
    renderTour();
    openDialog(tourDialog, trigger);
  };

  document.getElementById('tourTrigger')?.addEventListener('click', (event) => startTour(event.currentTarget));
  document.querySelectorAll('[data-open-tour]').forEach((button) => button.addEventListener('click', () => startTour(button)));
  tourBack?.addEventListener('click', () => {
    tourIndex = Math.max(0, tourIndex - 1);
    renderTour();
  });
  tourNext?.addEventListener('click', () => {
    if (tourIndex < tourSlides.length - 1) {
      tourIndex += 1;
      renderTour();
      return;
    }
    closeDialog(tourDialog);
    document.getElementById('contact')?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  });
  tourDialog?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') tourNext?.click();
    if (event.key === 'ArrowLeft' && !tourBack?.disabled) tourBack?.click();
  });
  document.querySelectorAll('[data-close-and-go]').forEach((link) => link.addEventListener('click', () => closeDialog(tourDialog)));
  document.getElementById('copyTourLink')?.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.hash = '';
    url.searchParams.set('view', 'recruiter');
    copyText(url.toString(), 'Recruiter link copied');
  });

  // Plain-language mode: a short transition into a deliberately simple explanation.
  const simpleDialog = document.getElementById('simpleDialog');
  const simpleFade = document.getElementById('simpleFade');
  let simpleFadeTimer;

  const openSimple = (trigger) => {
    if (!simpleDialog || simpleDialog.open) return;
    window.clearTimeout(simpleFadeTimer);
    if (prefersReducedMotion.matches || !simpleFade) {
      openDialog(simpleDialog, trigger);
      return;
    }
    simpleFade.classList.add('is-active');
    simpleFadeTimer = window.setTimeout(() => {
      openDialog(simpleDialog, trigger);
      window.requestAnimationFrame(() => simpleFade.classList.remove('is-active'));
    }, 180);
  };

  document.getElementById('simpleTrigger')?.addEventListener('click', (event) => openSimple(event.currentTarget));
  document.querySelectorAll('[data-open-simple]').forEach((button) => button.addEventListener('click', () => openSimple(button)));
  document.querySelectorAll('[data-simple-go]').forEach((button) => button.addEventListener('click', () => {
    const target = button.dataset.simpleGo;
    closeDialog(simpleDialog);
    window.setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
    }, 0);
  }));

  // Workflow Lab: transparent rule engine, no network request.
  const workflowForm = document.getElementById('workflowForm');
  const ambiguityInput = document.getElementById('ambiguity');
  const riskInput = document.getElementById('risk');
  const ambiguityValue = document.getElementById('ambiguityValue');
  const riskValue = document.getElementById('riskValue');
  const volumeInput = document.getElementById('volume');
  const sensitiveInput = document.getElementById('sensitive');
  const blueprint = document.getElementById('blueprint');
  const blueprintMode = document.getElementById('blueprintMode');
  const beforeFlow = document.getElementById('beforeFlow');
  const decisionLogic = document.getElementById('decisionLogic');
  const evaluationGates = document.getElementById('evaluationGates');
  let lastBlueprintText = '';

  const levelLabels = ['Low', 'Medium', 'High'];
  const scenarioBlueprints = {
    research: {
      before: 'Open tabs → copy notes → reconcile manually → write brief → chase sources',
      steps: [
        ['Acquire', 'Connect sources and keep provenance', 'rule'],
        ['Normalise', 'Create one evidence schema', 'rule'],
        ['Interpret', 'Extract and group meaning', 'ai'],
        ['Verify', 'Check claims against evidence', 'rule'],
        ['Approve', 'Resolve context and publish', 'human']
      ],
      logic: 'Preserve provenance before synthesis. Language models help interpret varied material; rules protect the evidence chain.',
      gates: ['Evidence coverage on a fixed benchmark set', 'Unsupported-claim rate and time to correct', 'Reviewer acceptance with reason-coded edits']
    },
    reporting: {
      before: 'Export data → repair sheets → calculate → paste charts → draft narrative → recheck totals',
      steps: [
        ['Validate', 'Reject malformed source data', 'rule'],
        ['Calculate', 'Produce trusted metrics', 'rule'],
        ['Explain', 'Draft evidence-bound narrative', 'ai'],
        ['Reconcile', 'Trace claims to values', 'rule'],
        ['Sign off', 'Apply business judgement', 'human']
      ],
      logic: 'The calculator of record stays deterministic. AI works after validation, where it can explain rather than invent the numbers.',
      gates: ['Reconciliation failure rate', 'Claim-to-data errors and reviewer corrections', 'Time to an approved report — not draft speed alone']
    },
    evaluation: {
      before: 'Discuss options → rely on instinct → write rationale → discover criteria changed midstream',
      steps: [
        ['Define rubric', 'Make criteria explicit', 'human'],
        ['Generate variants', 'Explore controlled alternatives', 'ai'],
        ['Score', 'Apply stable criteria', 'rule'],
        ['Challenge', 'Surface edge cases and counterpoints', 'ai'],
        ['Decide', 'Own trade-offs and outcome', 'human']
      ],
      logic: 'AI expands the option space and challenges assumptions. A fixed rubric preserves comparability; people own the weighting and decision.',
      gates: ['Reviewer agreement and reasons for disagreement', 'Ranking stability under prompt and order changes', 'Unsupported claims and override reasons']
    },
    intake: {
      before: 'Read request → ask for missing context → forward messages → lose status → follow up manually',
      steps: [
        ['Validate', 'Require essential context', 'rule'],
        ['Classify', 'Interpret intent and urgency', 'ai'],
        ['Route', 'Apply ownership rules', 'rule'],
        ['Draft action', 'Prepare a grounded next step', 'ai'],
        ['Confirm', 'Accept, edit or escalate', 'human']
      ],
      logic: 'Rules protect required information and ownership. AI helps interpret messy requests; a named owner confirms the next action.',
      gates: ['Correct routing and time to first useful action', 'Rework and escalation precision', 'Owner corrections by failure type']
    },
    measurement: {
      before: 'Collect inputs → reconcile versions → calculate separately → chase status → assemble outputs',
      steps: [
        ['Capture', 'Accept distributed inputs', 'rule'],
        ['Structure', 'Create one analysis record', 'rule'],
        ['Assist', 'Summarise evidence and gaps', 'ai'],
        ['Reconcile', 'Apply one shared measurement layer', 'rule'],
        ['Approve', 'Review exceptions and publish', 'human']
      ],
      logic: 'One analysis record and one shared measurement layer serve every surface. AI can explain evidence; people own exceptions and recommendations.',
      gates: ['Cross-surface calculation consistency', 'Completion and recovery failures', 'Human overrides and time to reviewed output']
    }
  };

  const getWorkflowState = () => ({
    scenario: workflowForm?.querySelector('input[name="scenario"]:checked')?.value || 'research',
    ambiguity: Number(ambiguityInput?.value || 2),
    risk: Number(riskInput?.value || 3),
    volume: volumeInput?.value || 'medium',
    sensitive: Boolean(sensitiveInput?.checked)
  });

  const buildWorkflow = () => {
    if (!blueprint) return;
    const state = getWorkflowState();
    const plan = scenarioBlueprints[state.scenario];
    const steps = plan.steps.map((step) => [...step]);

    if (state.ambiguity === 1 && (steps[2]?.[2] === 'ai' || steps[1]?.[2] === 'ai')) {
      const target = steps.find((step) => step[2] === 'ai');
      if (target) {
        target[1] = `${tr(target[1])} ${tr('within a constrained taxonomy')}`;
        target[2] = 'rule';
      }
    }
    if (state.risk === 3) {
      steps[steps.length - 1][0] = 'Named approval';
      steps[steps.length - 1][1] = 'Record accountable sign-off';
    } else if (state.risk === 1) {
      steps[steps.length - 1][0] = 'Sample review';
      steps[steps.length - 1][1] = 'Inspect exceptions and a sample';
    }
    if (state.sensitive) {
      steps.splice(1, 0, ['Privacy gate', 'Minimise, redact and control access', 'rule']);
    }

    const highControl = state.risk === 3 || state.sensitive;
    const exploratory = state.risk === 1 && state.ambiguity === 3;
    blueprintMode.textContent = tr(highControl ? 'High-control' : exploratory ? 'Exploration-first' : 'Balanced control');
    beforeFlow.textContent = tr(plan.before);
    decisionLogic.textContent = `${tr(plan.logic)} ${tr(highControl ? 'High-risk or sensitive work receives explicit approval and an auditable exception path.' : 'Review effort is concentrated on uncertainty and exceptions.')} ${tr('Measure corrections, exceptions and time to completion — not output volume.')}`;

    blueprint.replaceChildren();
    blueprint.style.setProperty('--steps', String(steps.length));
    steps.forEach(([name, description, type], index) => {
      const step = makeElement('div', `blueprint-step type-${type}`);
      step.style.setProperty('--step-index', String(index));
      step.append(
        makeElement('em', '', `${String(index + 1).padStart(2, '0')} · ${tr(type === 'rule' ? 'deterministic' : type === 'ai' ? 'AI' : 'human')}`),
        makeElement('b', '', name),
        makeElement('small', '', description)
      );
      blueprint.append(step);
    });

    const gates = [...plan.gates];
    if (state.volume === 'high') gates.push('Sampled failure rate and drift by input type');
    if (state.sensitive) gates.push('Redaction failures, access exceptions and retention checks');
    if (state.risk === 3) gates.push('No silent fallback: low confidence enters a named review queue');
    evaluationGates.replaceChildren(...gates.map((gate, index) => {
      const item = makeElement('li', '', gate);
      item.style.setProperty('--gate-index', String(index));
      return item;
    }));

    const labUrl = new URL(activeLanguage() === 'it' ? '/it/' : '/', window.location.origin);
    labUrl.hash = 'lab';
    lastBlueprintText = [
      `${tr('My workflow approach')}: ${tr(state.scenario)}`,
      `${tr('Mode')}: ${blueprintMode.textContent}`,
      `${tr('Before')}: ${tr(plan.before)}`,
      '',
      ...steps.map(([name, description, type], index) => `${index + 1}. ${tr(name)} [${tr(type === 'rule' ? 'DETERMINISTIC' : type.toUpperCase())}] — ${tr(description)}`),
      '',
      `${tr('Decision logic')}: ${decisionLogic.textContent}`,
      `${tr('What to measure')}:`,
      ...gates.map((gate) => `- ${tr(gate)}`),
      '',
      `${tr('Generated locally at')} ${labUrl.toString()}`
    ].join('\n');
  };

  const updateRangeLabels = () => {
    const ambiguityLabel = tr(levelLabels[Number(ambiguityInput?.value || 2) - 1]);
    const riskLabel = tr(levelLabels[Number(riskInput?.value || 3) - 1]);
    if (ambiguityValue) ambiguityValue.value = ambiguityLabel;
    if (riskValue) riskValue.value = riskLabel;
    ambiguityInput?.setAttribute('aria-valuetext', ambiguityLabel);
    riskInput?.setAttribute('aria-valuetext', riskLabel);
  };

  workflowForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    updateRangeLabels();
    buildWorkflow();
    document.getElementById('workflowOutput')?.animate?.(
      [{ transform: 'translateY(4px)', opacity: 0.72 }, { transform: 'none', opacity: 1 }],
      { duration: prefersReducedMotion.matches ? 1 : 320, easing: 'ease-out' }
    );
    showToast('Approach rebuilt locally');
  });
  workflowForm?.addEventListener('input', updateRangeLabels);
  document.getElementById('resetWorkflow')?.addEventListener('click', () => window.setTimeout(() => {
    updateRangeLabels();
    buildWorkflow();
  }));
  document.getElementById('copyBlueprint')?.addEventListener('click', () => copyText(lastBlueprintText, 'Approach copied'));
  updateRangeLabels();
  buildWorkflow();

  // Evidence search and command palette.
  const commandDialog = document.getElementById('commandDialog');
  const commandInput = document.getElementById('commandInput');
  const commandResults = document.getElementById('commandResults');
  const commandStatus = document.getElementById('commandStatus');
  const commandEmpty = document.getElementById('commandEmpty');
  const commandClose = document.getElementById('commandClose');
  const commandTrigger = document.getElementById('commandTrigger');
  let selectedCommand = 0;
  let visibleCommands = [];
  let commandOrigin = commandTrigger;

  if (commandInput && commandResults) {
    commandInput.setAttribute('role', 'combobox');
    commandInput.setAttribute('aria-autocomplete', 'list');
    commandInput.setAttribute('aria-controls', commandResults.id);
    commandInput.setAttribute('aria-haspopup', 'listbox');
    commandInput.setAttribute('aria-expanded', 'false');
  }

  const scrollTo = (selector) => {
    closeDialog(commandDialog);
    document.querySelector(selector)?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  };

  const openCaseFromCommand = (caseId) => {
    const trigger = commandOrigin?.isConnected ? commandOrigin : commandTrigger;
    closeDialog(commandDialog);
    window.setTimeout(() => openCase(caseId, trigger), 0);
  };

  const startTourFromCommand = () => {
    const trigger = commandOrigin?.isConnected ? commandOrigin : commandTrigger;
    closeDialog(commandDialog);
    window.setTimeout(() => startTour(trigger), 0);
  };

  const openSimpleFromCommand = () => {
    const trigger = commandOrigin?.isConnected ? commandOrigin : commandTrigger;
    closeDialog(commandDialog);
    window.setTimeout(() => openSimple(trigger), 0);
  };

  const inspectFromCommand = () => {
    const trigger = commandOrigin?.isConnected ? commandOrigin : commandTrigger;
    closeDialog(commandDialog);
    window.setTimeout(() => openInspect(trigger), 0);
  };

  const commands = [
    { icon: '90', title: 'Open the 90-second recruiter tour', detail: 'Four evidence-led chapters', keywords: 'recruiter fit short proof role', action: startTourFromCommand },
    { icon: 'Aa', title: 'Explain the site simply', detail: 'A plain-language guide with no technical jargon', keywords: 'simple explain non technical child plain language accessibility', action: openSimpleFromCommand },
    { icon: 'AI', title: 'Try the Workflow Lab', detail: 'A transparent local rules engine', keywords: 'workflow mapping simplify automation LLM AI rules', action: () => scrollTo('#lab') },
    { icon: '01', title: 'Human judgement and review', detail: 'Responsible-by-design product method', keywords: 'human review human-in-the-loop accountability safety uncertainty', action: () => scrollTo('#approach') },
    { icon: '02', title: 'Product discovery evidence', detail: 'First employee at an NLP spin-off; market-led pivot', keywords: 'product discovery market users Chisito pivot NLP', action: () => scrollTo('#experience') },
    { icon: '03', title: 'Evaluation-system evidence', detail: 'Evidence-first scoring, uncertainty and review', keywords: 'evaluation evals QA evidence scoring rubric uncertainty', action: () => openCaseFromCommand('evaluation') },
    { icon: '04', title: 'Multi-surface analysis evidence', detail: 'Input surfaces, data model, measurement logic and review', keywords: 'full-stack prototype multi-surface analysis measurement data model interfaces review APIs Next.js Supabase Postgres desktop Tauri', action: () => openCaseFromCommand('measurement') },
    { icon: '05', title: 'Corporate reputation & strategy', detail: 'Domain foundation in high-context advisory work', keywords: 'corporate reputation brand governance digital strategy communication', action: () => scrollTo('#experience') },
    { icon: '06', title: 'Knowledge systems evidence', detail: 'From sources to reviewable outputs', keywords: 'knowledge systems research sources evidence LLMs Python', action: () => openCaseFromCommand('research') },
    { icon: '07', title: 'Deterministic reporting evidence', detail: 'Metrics computed in code before AI explanation', keywords: 'reporting metrics KPI calculations Python PowerPoint spreadsheet reconciliation', action: () => openCaseFromCommand('reporting') },
    { icon: '08', title: 'Agentic orchestration evidence', detail: 'Stage gates, specialist agents and independent QA', keywords: 'agentic orchestration workflow agents research QA decision log', action: () => openCaseFromCommand('orchestration') },
    { icon: '09', title: 'AI operations evidence', detail: 'Preview, approval, test, release and rollback', keywords: 'AI operations control plane queues workers Git GitHub release rollback security', action: () => openCaseFromCommand('control') },
    { icon: 'UX', title: 'Self-service UX evidence', detail: 'Templates, structured import, guided editing and export', keywords: 'self-service product UX structured import editor hardening deployment', action: () => openCaseFromCommand('platform') },
    { icon: '☼', title: 'Toggle colour theme', detail: 'Light / dark', keywords: 'theme dark light appearance', action: () => { themeToggle?.click(); closeDialog(commandDialog); } },
    { icon: '↓', title: 'Print or save as PDF', detail: 'Recruiter-friendly print layout', keywords: 'download CV resume PDF print', action: () => { closeDialog(commandDialog); window.print(); } },
    { icon: '</>', title: 'Inspect this system', detail: 'Architecture, privacy and local performance', keywords: 'inspect technical architecture performance privacy easter egg simplify', action: inspectFromCommand }
  ];

  const tokenise = (value) => (
    String(value ?? '')
      .toLocaleLowerCase(root.lang || 'en')
      .normalize('NFKD')
      .replace(/\p{M}/gu, '')
      .match(/[\p{L}\p{N}]+/gu) || []
  );

  const indexCommands = () => commands.map((command, originalIndex) => ({
    ...command,
    originalIndex,
    titleTokens: new Set([...tokenise(command.title), ...tokenise(tr(command.title))]),
    searchTokens: new Set(tokenise(`${command.title} ${command.detail} ${command.keywords} ${tr(command.title)} ${tr(command.detail)} ${tr(command.keywords)}`))
  }));

  const setCommandPopupState = () => {
    if (!commandInput) return;
    const expanded = Boolean(commandDialog?.open && visibleCommands.length);
    commandInput.setAttribute('aria-expanded', String(expanded));
    if (!expanded) commandInput.removeAttribute('aria-activedescendant');
  };

  const syncCommandSelection = (scroll = false) => {
    if (!commandResults || !commandInput) return;
    const options = [...commandResults.querySelectorAll('[role="option"]:not([aria-disabled="true"])')];
    if (!options.length) {
      commandInput.removeAttribute('aria-activedescendant');
      return;
    }
    selectedCommand = Math.min(Math.max(0, selectedCommand), options.length - 1);
    options.forEach((option, index) => {
      const active = index === selectedCommand;
      option.classList.toggle('active', active);
      option.setAttribute('aria-selected', String(active));
    });
    const activeOption = options[selectedCommand];
    commandInput.setAttribute('aria-activedescendant', activeOption.id);
    if (scroll) activeOption.scrollIntoView({ block: 'nearest' });
  };

  const renderCommands = () => {
    if (!commandResults) return;
    const tokens = [...new Set(tokenise(commandInput?.value.trim() || ''))];
    visibleCommands = indexCommands()
      .map((command) => {
        const score = tokens.length === 0 ? 1 : tokens.reduce((total, token) => (
          total + (command.searchTokens.has(token) ? 2 : 0) + (command.titleTokens.has(token) ? 2 : 0)
        ), 0);
        return { ...command, score };
      })
      .filter((command) => tokens.length === 0 || command.score > 0)
      .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);

    selectedCommand = visibleCommands.length ? Math.min(selectedCommand, visibleCommands.length - 1) : 0;
    commandResults.replaceChildren();
    commandResults.hidden = visibleCommands.length === 0 && Boolean(commandEmpty);
    if (commandEmpty) {
      commandEmpty.hidden = visibleCommands.length > 0;
      commandEmpty.textContent = interfaceCopy.commandNoResults();
    }
    if (commandStatus) commandStatus.textContent = interfaceCopy.commandResultCount(visibleCommands.length);

    if (!visibleCommands.length) {
      if (!commandEmpty) {
        const emptyOption = makeElement('div', 'command-empty', interfaceCopy.commandNoResults());
        emptyOption.setAttribute('role', 'option');
        emptyOption.setAttribute('aria-disabled', 'true');
        commandResults.append(emptyOption);
      }
      setCommandPopupState();
      syncCommandSelection();
      return;
    }

    visibleCommands.forEach((command, index) => {
      const button = makeElement('button', 'command-result');
      button.type = 'button';
      button.id = `command-option-${command.originalIndex}`;
      button.tabIndex = -1;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', 'false');
      const copy = document.createElement('span');
      copy.append(makeElement('strong', '', command.title), makeElement('small', '', command.detail));
      button.append(makeElement('span', 'command-icon', command.icon), copy, makeElement('span', '', '↵'));
      button.addEventListener('mouseenter', () => {
        selectedCommand = index;
        syncCommandSelection();
      });
      button.addEventListener('click', command.action);
      commandResults.append(button);
    });
    setCommandPopupState();
    syncCommandSelection();
  };

  const openCommand = (query = '', trigger = document.activeElement) => {
    if (!commandInput || !commandDialog) return;
    commandOrigin = trigger instanceof HTMLElement ? trigger : commandTrigger;
    commandInput.value = query;
    selectedCommand = 0;
    openDialog(commandDialog, commandOrigin);
    renderCommands();
    window.setTimeout(() => commandInput.focus(), 0);
  };

  commandTrigger?.addEventListener('click', (event) => openCommand('', event.currentTarget));
  if (commandClose && !commandClose.hasAttribute('data-close-dialog')) {
    commandClose.addEventListener('click', () => closeDialog(commandDialog));
  }
  commandDialog?.addEventListener('close', () => {
    commandInput?.setAttribute('aria-expanded', 'false');
    commandInput?.removeAttribute('aria-activedescendant');
    commandOrigin = commandTrigger;
  });
  commandInput?.addEventListener('input', () => { selectedCommand = 0; renderCommands(); });
  commandInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog(commandDialog);
      return;
    }
    if (event.key === 'ArrowDown' && visibleCommands.length) {
      event.preventDefault();
      selectedCommand = Math.min(visibleCommands.length - 1, selectedCommand + 1);
      syncCommandSelection(true);
    }
    if (event.key === 'ArrowUp' && visibleCommands.length) {
      event.preventDefault();
      selectedCommand = Math.max(0, selectedCommand - 1);
      syncCommandSelection(true);
    }
    if (event.key === 'Home' && visibleCommands.length) {
      event.preventDefault();
      selectedCommand = 0;
      syncCommandSelection(true);
    }
    if (event.key === 'End' && visibleCommands.length) {
      event.preventDefault();
      selectedCommand = visibleCommands.length - 1;
      syncCommandSelection(true);
    }
    if (event.key === 'Enter' && visibleCommands[selectedCommand]) {
      event.preventDefault();
      visibleCommands[selectedCommand].action();
    }
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      commandDialog?.open ? closeDialog(commandDialog) : openCommand('', commandTrigger);
    }
  });

  document.querySelectorAll('[data-evidence]').forEach((button) => {
    button.addEventListener('click', () => openCommand(button.dataset.evidence, button));
  });

  // Runtime inspection easter egg.
  const inspectDialog = document.getElementById('inspectDialog');
  const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return tr('cached');
    if (bytes < 1024) return `${bytes} B`;
    return `${new Intl.NumberFormat(root.lang || 'en', { maximumFractionDigits: bytes < 10240 ? 1 : 0 }).format(bytes / 1024)} KB`;
  };

  function openInspect(trigger) {
    const resources = performance.getEntriesByType?.('resource') || [];
    const localResources = resources.filter((entry) => {
      try { return new URL(entry.name).origin === window.location.origin; } catch (_) { return false; }
    });
    const transferred = localResources.reduce((sum, entry) => sum + (entry.transferSize || entry.encodedBodySize || 0), 0);
    const navigation = performance.getEntriesByType?.('navigation')?.[0];
    document.getElementById('inspectResources').textContent = String(localResources.length + 1);
    document.getElementById('inspectTransfer').textContent = formatBytes(transferred);
    document.getElementById('inspectLoad').textContent = navigation?.domContentLoadedEventEnd ? `${Math.round(navigation.domContentLoadedEventEnd)} ms` : tr('ready');
    openDialog(inspectDialog, trigger);
  }

  document.getElementById('inspectTrigger')?.addEventListener('click', (event) => openInspect(event.currentTarget));

  // Contact utilities.
  const profileSummary = 'Mattia Necchio designs useful AI products for complex workflows. He maps how work happens, prototypes the full path, and defines where data, rules, AI and human review belong. His background spans corporate reputation, NLP products, digital strategy and AI-assisted knowledge systems.';
  document.getElementById('copyProfile')?.addEventListener('click', () => copyText(tr(profileSummary), 'Short profile copied'));
  document.getElementById('printProfile')?.addEventListener('click', () => window.print());
  document.getElementById('currentYear').textContent = String(new Date().getFullYear());

  window.addEventListener('portfolio:languagechange', () => {
    applyTheme(root.getAttribute('data-theme'), false);
    if (menuToggle) setMenu(menuToggle.getAttribute('aria-expanded') === 'true');
    updateRangeLabels();
    buildWorkflow();
    renderTour();
    renderCommands();
    if (caseDialog?.open) renderCase(activeCase);
    updateCaseCounter(true);
  });

  // Deep links and optional inspection/recruiter views.
  handleCaseHash();
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('view') === 'recruiter') window.setTimeout(() => startTour(document.getElementById('tourTrigger')), 250);
  if (urlParams.get('inspect') === '1') window.setTimeout(() => openInspect(document.getElementById('inspectTrigger')), 250);

  // Offline support is optional and fails silently when unsupported.
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }

  console.info('%cMN / SYSTEM NOTE', 'background:#8e88ff;color:#101116;padding:4px 8px;border-radius:4px;font-weight:bold', `\n${tr('A useful AI workflow begins with a boring question: what decision must become easier?')}\n${tr('Press Ctrl/Cmd + K and type “inspect”.')}`);
})();
