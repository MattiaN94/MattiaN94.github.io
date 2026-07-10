(() => {
  'use strict';

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toast = document.getElementById('toast');
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
    toast.textContent = message;
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
    themeToggle?.setAttribute('aria-label', `Switch to ${nextTheme === 'dark' ? 'light' : 'dark'} theme`);
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
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
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

  // Case-study decision logs. All text is static and rendered with textContent.
  const caseData = {
    research: {
      eyebrow: 'Knowledge workflow · internal system pattern',
      title: 'From fragmented sources to traceable briefs',
      summary: [
        ['User', 'Advisory teams working across heterogeneous sources'],
        ['Status', 'Reusable internal workflow pattern'],
        ['My contribution', 'Workflow design, orchestration logic, QA and prototype']
      ],
      details: [
        ['The problem', 'Research begins across documents, websites, databases and notes. Manual copy-paste obscures provenance, makes comparison costly and turns every brief into a one-off effort.'],
        ['Before → after', 'Scattered browsing and manual reconciliation become a staged pipeline: acquire, normalise, interpret, verify, review and publish.'],
        ['Product decision', 'Preserve sources before adding synthesis. A useful brief must let a reviewer inspect the evidence behind each important claim.'],
        ['Evaluation', 'Check source coverage, citation integrity, duplicate handling, exception queues and reviewer acceptance on representative tasks.']
      ],
      layers: [
        ['Deterministic', 'Source acquisition, metadata normalisation, deduplication, required fields and evidence-link checks.'],
        ['AI', 'Classification, thematic grouping, extraction and synthesis where language understanding creates leverage.'],
        ['Human', 'Scope decisions, interpretation of sensitive context, exception resolution and final editorial approval.']
      ],
      caveat: 'Outcome evidence is described qualitatively because the underlying work and sources are confidential. No throughput or accuracy metric is implied here.'
    },
    evaluation: {
      eyebrow: 'Evaluation system · prototype pattern',
      title: 'AI evaluation workbench',
      summary: [
        ['User', 'Teams comparing qualitative alternatives'],
        ['Status', 'Evaluation and decision-support pattern'],
        ['My contribution', 'Rubric design, controlled variation, scoring and review logic']
      ],
      details: [
        ['The problem', 'Qualitative decisions often lack repeatable criteria. Unstructured AI output can sound confident while simply mirroring the starting hypothesis.'],
        ['Before → after', 'Ad-hoc judgement becomes an explicit rubric with controlled variants, evidence thresholds, exception rules and comparable outputs.'],
        ['Product decision', 'Separate exploration from decision. Models can surface patterns and challenge assumptions; deterministic scoring preserves comparability.'],
        ['Evaluation', 'Test rubric coverage, inter-reviewer agreement, sensitivity to prompt variation, unsupported claims and known edge cases.']
      ],
      layers: [
        ['Deterministic', 'Rubric structure, allowed values, scoring ranges, threshold rules and completeness checks.'],
        ['AI', 'Scenario variation, qualitative interpretation, adversarial critique and evidence-aware explanation.'],
        ['Human', 'Criteria definition, weighting, dispute resolution and responsibility for the final decision.']
      ],
      caveat: 'Synthetic audiences are used to explore hypotheses and stress-test assumptions. They are not presented as a substitute for real audience research.'
    },
    platform: {
      eyebrow: 'Full-stack product · connected workflow',
      title: 'Secure assessment & reporting platform',
      summary: [
        ['User', 'Participants, process owners and authorised reviewers'],
        ['Status', 'End-to-end full-stack product pattern'],
        ['My contribution', 'Requirements, UX flows, data model, logic and prototype']
      ],
      details: [
        ['The problem', 'An external questionnaire quickly becomes a stateful process: correct access, persistent responses, scoring, status, dashboards, archives and generated reports.'],
        ['Before → after', 'Disconnected forms and spreadsheets become one traceable workflow with unique access paths, structured data, business rules and role-aware review.'],
        ['Product decision', 'Model the process instance first. Every response, calculation and output must belong to the right participant, version and review state.'],
        ['Evaluation', 'Test access boundaries, incomplete states, scoring determinism, retry behaviour, report fidelity and handoff to authorised users.']
      ],
      layers: [
        ['Deterministic', 'Identity and access flow, database constraints, state transitions, calculations and report assembly.'],
        ['AI', 'Optional assistance for synthesis or explanation after structured processing is complete.'],
        ['Human', 'Process ownership, exceptional cases, interpretation and approval before a result becomes authoritative.']
      ],
      caveat: 'This portfolio demonstrates product and prototype thinking. Production security, observability and scale require an explicit engineering review and deployment process.'
    },
    reporting: {
      eyebrow: 'Analytics automation · reusable pipeline',
      title: 'Evidence-to-report workflow',
      summary: [
        ['User', 'Analysts producing recurring business outputs'],
        ['Status', 'Structured analysis and reporting pattern'],
        ['My contribution', 'Pipeline design, validation boundaries and output system']
      ],
      details: [
        ['The problem', 'Recurring analysis becomes fragile when calculations, interpretation and document production live in one opaque workflow.'],
        ['Before → after', 'Manual recomputation and narrative assembly become separate stages: process, validate, structure, interpret and publish.'],
        ['Product decision', 'Never ask a language model to be the calculator of record. Create trusted structured outputs first, then use AI selectively around them.'],
        ['Evaluation', 'Use invariant tests for calculations, schema validation, reconciliation against source totals, claim-to-data checks and reviewer sign-off.']
      ],
      layers: [
        ['Deterministic', 'Parsing, calculations, validation, structured outputs, templates and export rules.'],
        ['AI', 'Categorisation, synthesis and explanation where the result can be traced to validated data.'],
        ['Human', 'Business interpretation, outlier review, narrative judgement and approval of the delivered report.']
      ],
      caveat: 'No performance claim is made without measured project data. The case documents the architecture and quality boundary rather than an invented ROI.'
    }
  };

  const caseOrder = ['research', 'evaluation', 'platform', 'reporting'];
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
    if (typeof text === 'string') element.textContent = text;
    return element;
  };

  const renderCase = (caseId) => {
    const data = caseData[caseId];
    if (!data || !caseDialogBody) return;
    activeCase = caseId;
    caseDialogTitle.textContent = data.title;
    caseDialogEyebrow.textContent = data.eyebrow;
    caseDialogBody.replaceChildren();

    const summary = makeElement('div', 'case-summary');
    data.summary.forEach(([label, value]) => {
      const item = document.createElement('div');
      item.append(makeElement('span', '', label), makeElement('strong', '', value));
      summary.append(item);
    });

    const detailGrid = makeElement('div', 'case-detail-grid');
    data.details.forEach(([label, value]) => {
      const item = document.createElement('div');
      item.append(makeElement('span', '', label), makeElement('p', '', value));
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

  copyCaseLink?.addEventListener('click', () => copyText(`${window.location.origin}${window.location.pathname}#case-${activeCase}`, 'Case link copied'));

  const handleCaseHash = () => {
    const match = window.location.hash.match(/^#case-(research|evaluation|platform|reporting)$/);
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
    if (tourNext) tourNext.innerHTML = tourIndex === tourSlides.length - 1 ? 'Finish <span aria-hidden="true">→</span>' : 'Next <span aria-hidden="true">→</span>';
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

  // Workflow Architect: transparent rule engine, no network request.
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
      gates: ['Source coverage on representative briefs', 'Claim-to-evidence link integrity', 'Reviewer acceptance and exception reasons']
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
      gates: ['Invariant tests for every calculation', 'Source totals reconciled before narration', 'Claim-to-data checks and owner approval']
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
      gates: ['Rubric coverage and stable scoring', 'Sensitivity to prompt and order variation', 'Human agreement on disputed cases']
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
      gates: ['Required-field and routing coverage', 'False-urgency and misclassification review', 'Escalation rate and owner corrections']
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
        target[1] = `${target[1]} within a constrained taxonomy`;
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
    blueprintMode.textContent = highControl ? 'High-control' : exploratory ? 'Exploration-first' : 'Balanced control';
    beforeFlow.textContent = plan.before;
    decisionLogic.textContent = `${plan.logic} ${highControl ? 'High-risk or sensitive work receives explicit approval and an auditable exception path.' : 'Review effort is concentrated on uncertainty and exceptions.'}`;

    blueprint.replaceChildren();
    blueprint.style.setProperty('--steps', String(steps.length));
    steps.forEach(([name, description, type], index) => {
      const step = makeElement('div', `blueprint-step type-${type}`);
      step.append(
        makeElement('em', '', `${String(index + 1).padStart(2, '0')} · ${type === 'rule' ? 'deterministic' : type === 'ai' ? 'AI' : 'human'}`),
        makeElement('b', '', name),
        makeElement('small', '', description)
      );
      blueprint.append(step);
    });

    const gates = [...plan.gates];
    if (state.volume === 'high') gates.push('Drift monitoring and sampled failure review');
    if (state.sensitive) gates.push('Access log, redaction checks and retention policy');
    if (state.risk === 3) gates.push('No silent fallback: low confidence enters a named review queue');
    evaluationGates.replaceChildren(...gates.map((gate) => makeElement('li', '', gate)));

    lastBlueprintText = [
      `Workflow blueprint: ${state.scenario}`,
      `Mode: ${blueprintMode.textContent}`,
      `Before: ${plan.before}`,
      '',
      ...steps.map(([name, description, type], index) => `${index + 1}. ${name} [${type.toUpperCase()}] — ${description}`),
      '',
      `Decision logic: ${decisionLogic.textContent}`,
      'Evaluation gates:',
      ...gates.map((gate) => `- ${gate}`),
      '',
      'Generated locally at https://mattian94.github.io/#lab'
    ].join('\n');
  };

  const updateRangeLabels = () => {
    if (ambiguityValue) ambiguityValue.value = levelLabels[Number(ambiguityInput?.value || 2) - 1];
    if (riskValue) riskValue.value = levelLabels[Number(riskInput?.value || 3) - 1];
  };

  workflowForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    updateRangeLabels();
    buildWorkflow();
    document.getElementById('workflowOutput')?.animate?.(
      [{ transform: 'translateY(4px)', opacity: 0.72 }, { transform: 'none', opacity: 1 }],
      { duration: prefersReducedMotion.matches ? 1 : 320, easing: 'ease-out' }
    );
    showToast('Blueprint rebuilt locally');
  });
  workflowForm?.addEventListener('input', updateRangeLabels);
  document.getElementById('resetWorkflow')?.addEventListener('click', () => window.setTimeout(() => {
    updateRangeLabels();
    buildWorkflow();
  }));
  document.getElementById('copyBlueprint')?.addEventListener('click', () => copyText(lastBlueprintText, 'Blueprint copied'));
  updateRangeLabels();
  buildWorkflow();

  // Evidence search and command palette.
  const commandDialog = document.getElementById('commandDialog');
  const commandInput = document.getElementById('commandInput');
  const commandResults = document.getElementById('commandResults');
  let selectedCommand = 0;
  let visibleCommands = [];

  const scrollTo = (selector) => {
    closeDialog(commandDialog);
    document.querySelector(selector)?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  };

  const commands = [
    { icon: '90', title: 'Open the 90-second recruiter tour', detail: 'Four evidence-led chapters', keywords: 'recruiter fit short proof role', action: () => { closeDialog(commandDialog); startTour(document.getElementById('commandTrigger')); } },
    { icon: 'AI', title: 'Try the Workflow Architect', detail: 'A transparent local rules engine', keywords: 'workflow mapping simplify automation LLM AI rules', action: () => scrollTo('#lab') },
    { icon: '01', title: 'Human judgement and review', detail: 'Responsible-by-design product method', keywords: 'human review human-in-the-loop accountability safety uncertainty', action: () => scrollTo('#approach') },
    { icon: '02', title: 'Product discovery evidence', detail: 'First employee at an NLP spin-off; market-led pivot', keywords: 'product discovery market users Chisito pivot NLP', action: () => scrollTo('#experience') },
    { icon: '03', title: 'Evaluation and QA evidence', detail: 'Rubrics, thresholds, exceptions and failure modes', keywords: 'evaluation evals QA scoring rubric threshold failure', action: () => openCase('evaluation', document.getElementById('commandTrigger')) },
    { icon: '04', title: 'Full-stack prototype evidence', detail: 'Secure intake, data, logic, dashboard and reports', keywords: 'full-stack prototype Next.js Supabase Postgres APIs web app', action: () => openCase('platform', document.getElementById('commandTrigger')) },
    { icon: '05', title: 'Corporate reputation & strategy', detail: 'Domain foundation in high-context advisory work', keywords: 'corporate reputation brand governance digital strategy communication', action: () => scrollTo('#experience') },
    { icon: '06', title: 'Knowledge systems evidence', detail: 'From sources to traceable briefs', keywords: 'knowledge systems research sources evidence LLMs Python', action: () => openCase('research', document.getElementById('commandTrigger')) },
    { icon: '☼', title: 'Toggle colour theme', detail: 'Light / dark', keywords: 'theme dark light appearance', action: () => { themeToggle?.click(); closeDialog(commandDialog); } },
    { icon: '↓', title: 'Print or save as PDF', detail: 'Recruiter-friendly print layout', keywords: 'download CV resume PDF print', action: () => { closeDialog(commandDialog); window.print(); } },
    { icon: '</>', title: 'Inspect this system', detail: 'Architecture, privacy and local performance', keywords: 'inspect technical architecture performance privacy easter egg simplify', action: () => { closeDialog(commandDialog); openInspect(document.getElementById('commandTrigger')); } }
  ];

  const normalise = (value) => value.toLocaleLowerCase('en').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const renderCommands = () => {
    if (!commandResults) return;
    const query = normalise(commandInput?.value.trim() || '');
    const tokens = query.split(/\s+/).filter(Boolean);
    visibleCommands = commands
      .map((command, originalIndex) => {
        const haystack = normalise(`${command.title} ${command.detail} ${command.keywords}`);
        const score = tokens.length === 0 ? 1 : tokens.reduce((total, token) => total + (haystack.includes(token) ? 2 : 0) + (normalise(command.title).includes(token) ? 2 : 0), 0);
        return { ...command, score, originalIndex };
      })
      .filter((command) => tokens.length === 0 || command.score > 0)
      .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);

    selectedCommand = Math.min(selectedCommand, Math.max(0, visibleCommands.length - 1));
    commandResults.replaceChildren();
    if (!visibleCommands.length) {
      commandResults.append(makeElement('p', 'command-empty', 'No exact match. Try “human review”, “product discovery”, “evaluation” or “inspect”.'));
      return;
    }

    visibleCommands.forEach((command, index) => {
      const button = makeElement('button', `command-result${index === selectedCommand ? ' active' : ''}`);
      button.type = 'button';
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', String(index === selectedCommand));
      const copy = document.createElement('span');
      copy.append(makeElement('strong', '', command.title), makeElement('small', '', command.detail));
      button.append(makeElement('span', 'command-icon', command.icon), copy, makeElement('span', '', '↵'));
      button.addEventListener('mouseenter', () => { selectedCommand = index; renderCommands(); });
      button.addEventListener('click', command.action);
      commandResults.append(button);
    });
  };

  const openCommand = (query = '', trigger = document.activeElement) => {
    commandInput.value = query;
    selectedCommand = 0;
    renderCommands();
    openDialog(commandDialog, trigger);
    window.setTimeout(() => commandInput.focus(), 0);
  };

  document.getElementById('commandTrigger')?.addEventListener('click', (event) => openCommand('', event.currentTarget));
  commandInput?.addEventListener('input', () => { selectedCommand = 0; renderCommands(); });
  commandInput?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedCommand = Math.min(visibleCommands.length - 1, selectedCommand + 1);
      renderCommands();
      commandResults?.querySelector('.active')?.scrollIntoView({ block: 'nearest' });
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedCommand = Math.max(0, selectedCommand - 1);
      renderCommands();
      commandResults?.querySelector('.active')?.scrollIntoView({ block: 'nearest' });
    }
    if (event.key === 'Enter' && visibleCommands[selectedCommand]) {
      event.preventDefault();
      visibleCommands[selectedCommand].action();
    }
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      commandDialog?.open ? closeDialog(commandDialog) : openCommand('', document.getElementById('commandTrigger'));
    }
  });

  document.querySelectorAll('[data-evidence]').forEach((button) => {
    button.addEventListener('click', () => openCommand(button.dataset.evidence, button));
  });

  // Runtime inspection easter egg.
  const inspectDialog = document.getElementById('inspectDialog');
  const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return 'cached';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
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
    document.getElementById('inspectLoad').textContent = navigation?.domContentLoadedEventEnd ? `${Math.round(navigation.domContentLoadedEventEnd)} ms` : 'ready';
    openDialog(inspectDialog, trigger);
  }

  document.getElementById('inspectTrigger')?.addEventListener('click', (event) => openInspect(event.currentTarget));

  // Contact utilities.
  const profileSummary = 'Mattia Necchio turns complex knowledge work into usable AI products. He bridges domain experts, product and engineering to map workflows, prototype end-to-end systems, define evaluation criteria and keep human judgement where it matters. His background spans corporate reputation, NLP products and strategic consulting.';
  document.getElementById('copyProfile')?.addEventListener('click', () => copyText(profileSummary, 'Short profile copied'));
  document.getElementById('printProfile')?.addEventListener('click', () => window.print());
  document.getElementById('currentYear').textContent = String(new Date().getFullYear());

  // Deep links and optional inspection/recruiter views.
  handleCaseHash();
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('view') === 'recruiter') window.setTimeout(() => startTour(document.getElementById('tourTrigger')), 250);
  if (urlParams.get('inspect') === '1') window.setTimeout(() => openInspect(document.getElementById('inspectTrigger')), 250);

  // Offline support is optional and fails silently when unsupported.
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  console.info('%cMN / SYSTEM NOTE', 'background:#c9ff4a;color:#111;padding:4px 8px;border-radius:4px;font-weight:bold', '\nThe best AI workflow begins with a boring question: what decision must become easier?\nPress Ctrl/Cmd + K and type “inspect”.');
})();
