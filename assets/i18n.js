(() => {
  'use strict';

  const STORAGE_KEY = 'mn-language';
  const IT = Object.freeze({
    'AI Product & Workflow Designer | Mattia Necchio': 'AI Product & Workflow Designer | Mattia Necchio',
    'Skip to content': 'Vai al contenuto',
    'Primary navigation': 'Navigazione principale',
    'MN Mattia Necchio — back to top': 'MN Mattia Necchio — torna all’inizio',
    'AI product · workflow design': 'Prodotti AI · progettazione di workflow',
    'Page sections': 'Sezioni della pagina',
    'Work': 'Progetti',
    'Workflow lab': 'Workflow Lab',
    'Approach': 'Metodo',
    'Experience': 'Esperienza',
    'Find portfolio evidence': 'Cerca nel portfolio',
    'Find evidence': 'Cerca',
    'Switch to dark theme': 'Attiva il tema scuro',
    'Switch to light theme': 'Attiva il tema chiaro',
    'Switch to Italian': 'Passa all’italiano',
    'Switch to English': 'Passa all’inglese',
    'Open navigation menu': 'Apri il menu di navigazione',
    'Close navigation menu': 'Chiudi il menu di navigazione',
    'Selected work': 'Progetti selezionati',
    'Contact': 'Contatti',
    'Start 90-sec tour': 'Avvia il tour di 90 secondi',
    '90-sec tour': 'Tour 90 sec',
    'Communication × product × AI workflows': 'Comunicazione × prodotto × workflow AI',
    'Corporate Reputation & Communication Strategy | Building AI Systems for Knowledge Work': 'Corporate Reputation & Communication Strategy | Building AI Systems for Knowledge Work',
    'AI products.': 'Prodotti AI.',
    'Explain it simply': 'Spiegamelo semplice',
    'I turn complex work into': 'Trasformo processi complessi in',
    'useful AI products.': 'prodotti AI utili.',
    'I map real workflows, prototype the full path and define how to check whether the result actually helps.': 'Mappo i workflow reali, ne prototipo l’intero percorso e definisco come verificare che il risultato sia davvero utile.',
    'View the systems': 'Esplora i sistemi',
    '90-second overview': 'Panoramica in 90 secondi',
    'Mattia Necchio · Padova, Italy · Product thinking grounded in communication, NLP and knowledge work.': 'Mattia Necchio · Padova, Italia · Approccio al prodotto fondato su comunicazione, NLP e knowledge work.',
    'Padova, Italy · communication, NLP, knowledge systems.': 'Padova, Italia · comunicazione, NLP, sistemi di conoscenza.',
    'live': 'attivo',
    'A useful system is a chain of clear decisions.': 'Un sistema utile è una sequenza di decisioni chiare.',
    'Messy inputs →': 'Input disordinati →',
    'usable output': 'output utilizzabile',
    'Ingest': 'Acquisisci',
    'Sources become structured inputs': 'Le fonti diventano input strutturati',
    'RULES': 'REGOLE',
    'Interpret': 'Interpreta',
    'Context is classified and synthesised': 'Il contesto viene classificato e sintetizzato',
    'Verify': 'Verifica',
    'Evidence and exceptions are checked': 'Evidenze ed eccezioni vengono controllate',
    'Decide': 'Decidi',
    'Accountability stays explicit': 'La responsabilità resta esplicita',
    'HUMAN': 'PERSONA',
    'Useful, reviewable output': 'Output utile e verificabile',
    'Evidence, exceptions and review stay visible.': 'Evidenze, eccezioni e revisione restano visibili.',
    'Professional evidence at a glance': 'Evidenze professionali in sintesi',
    'First employee': 'Primo dipendente',
    'at an NLP product spin-off': 'in uno spin-off di prodotto NLP',
    '2018 → now': '2018 → oggi',
    'across domain, product and systems': 'tra dominio, prodotto e sistemi',
    '4 working layers': '4 livelli operativi',
    'data · rules · AI · human review': 'dati · regole · AI · revisione umana',
    '0 trackers': '0 tracker',
    'this demo runs locally in your browser': 'questa demo gira localmente nel browser',

    '01 · Selected product systems': '01 · Sistemi di prodotto selezionati',
    'System patterns from real work.': 'Pattern di sistema tratti da esperienze reali.',
    'Anonymised composites showing problem types, architecture and checks without mapping one-to-one to a specific project.': 'Casi compositi anonimizzati che mostrano problemi, architetture e controlli senza corrispondere a un singolo progetto.',
    'Swipe to explore the systems →': 'Scorri per esplorare i sistemi →',
    'System 1 of 7': 'Sistema 1 di 7',
    'System {current} of {total}': 'Sistema {current} di {total}',
    'Knowledge workflow': 'Workflow di conoscenza',
    'How I work': 'Come lavoro',
    'How I turn fragmented sources into reviewable outputs': 'Come trasformo fonti frammentate in output verificabili',
    'I structure mixed inputs first, preserve where each claim comes from, then use AI to synthesise and rules to verify.': 'Prima strutturo input eterogenei e conservo la provenienza di ogni affermazione; poi uso l’AI per sintetizzare e le regole per verificare.',
    'Composite pattern': 'Pattern composito',
    'REVIEWABLE': 'VERIFICABILE',
    'OUTPUT': 'OUTPUT',
    'From fragmented sources to reviewable outputs': 'Da fonti frammentate a output verificabili',
    'A staged pipeline structures mixed inputs, preserves provenance and produces outputs reviewers can inspect.': 'Una pipeline a fasi struttura input eterogenei, conserva la provenienza e produce output verificabili.',
    'System layers': 'Livelli del sistema',
    'Rules': 'Regole',
    'Human review': 'Revisione umana',
    'Architecture & checks': 'Architettura e controlli',
    'Evaluation system': 'Sistema di valutazione',
    'Pre-calibration pattern': 'Pattern pre-calibrazione',
    'Evidence-first evaluation workbench': 'Ambiente di valutazione basato sulle evidenze',
    'Observed evidence, inference and uncertainty stay separate while teams compare options, scenarios and qualitative risk.': 'Evidenze osservate, inferenze e incertezza restano separate mentre si confrontano opzioni, scenari e rischi qualitativi.',
    'Benchmark set': 'Set di benchmark',
    'Stability check': 'Test di stabilità',
    'Override log': 'Registro override',
    'Evidence + scoring': 'Evidenze + scoring',
    'AI lenses': 'Lenti AI',
    'Reviewer': 'Revisore',
    'Self-service product': 'Prodotto self-service',
    'Adaptation & hardening': 'Adattamento e hardening',
    'Structured self-service workflow': 'Workflow self-service strutturato',
    'Templates, structured imports, guided editing and export reduce repetitive production and administration work.': 'Template, import strutturati, editing guidato ed export riducono attività produttive e amministrative ripetitive.',
    'Template': 'Template',
    'Import': 'Importa',
    'Edit': 'Modifica',
    'Export': 'Esporta',
    'Validation + access': 'Validazione + accessi',
    'Automation': 'Automazione',
    'User control': 'Controllo utente',
    'Analysis automation': 'Automazione dell’analisi',
    'Reusable pipeline': 'Pipeline riutilizzabile',
    'Validated data-to-output workflow': 'Workflow validato dai dati all’output',
    'Deterministic calculations feed structured outputs; AI helps explain results only after the numbers reconcile.': 'Calcoli deterministici alimentano output strutturati; l’AI spiega i risultati solo dopo la riconciliazione dei numeri.',
    'Calculations': 'Calcoli',
    'Synthesis': 'Sintesi',
    'Sign-off': 'Approvazione',
    'Analysis & measurement': 'Analisi e misurazione',
    'Multi-surface pattern': 'Pattern multi-interfaccia',
    'Multi-surface analysis & measurement system': 'Sistema multi-interfaccia per analisi e misurazione',
    'Browser and installed-client inputs, operational views, structured storage and reviewable outputs share one measurement layer.': 'Input da browser e applicazioni desktop, viste operative, archiviazione strutturata e output verificabili condividono un unico livello di misurazione.',
    'Input surfaces': 'Interfacce di input',
    'Data model': 'Modello dati',
    'Review': 'Revisione',
    'Data + measurement': 'Dati + misurazione',
    'Evidence assist': 'Supporto alle evidenze',
    'Agentic orchestration': 'Orchestrazione agentica',
    'Governed workspace': 'Workspace governato',
    'Governed multi-stage knowledge workflow': 'Workflow di conoscenza multi-fase e governato',
    'Specialist stages coordinate intake, research, option design, production and independent QA while surfacing only high-impact questions.': 'Fasi specialistiche coordinano intake, ricerca, progettazione delle opzioni, produzione e QA indipendente, facendo emergere solo le domande ad alto impatto.',
    'Capture': 'Acquisisci',
    'Research': 'Ricerca',
    'Build': 'Costruisci',
    'Stage gates': 'Gate di fase',
    'Specialist agents': 'Agenti specialistici',
    'Decisions': 'Decisioni',
    'AI-assisted operations': 'Operazioni assistite dall’AI',
    'Production-oriented pattern': 'Pattern orientato alla produzione',
    'Governed operations control plane': 'Control plane operativo e governato',
    'Natural-language intent becomes visible, gated tasks for analysis, changes, tests, security, release and rollback.': 'L’intento espresso in linguaggio naturale diventa una sequenza visibile e controllata di analisi, modifiche, test, sicurezza, release e rollback.',
    'PREVIEW': 'ANTEPRIMA',
    'APPROVE': 'APPROVA',
    'RUN': 'ESEGUI',
    'ROLL BACK': 'RIPRISTINA',
    'Events + queues': 'Eventi + code',
    'Worker agents': 'Agenti operativi',
    'Approval': 'Approvazione',

    '02 · Interactive workflow lab': '02 · Workflow Lab interattivo',
    '02 · My interactive workflow lab': '02 · Il mio Workflow Lab interattivo',
    'See how I would approach the workflow.': 'Scopri come affronterei il workflow.',
    'Choose a situation and its constraints. This local demo shows how I would divide the work across rules, AI and human judgement — and what I would measure.': 'Scegli una situazione e i suoi vincoli. Questa demo locale mostra come dividerei il lavoro tra regole, AI e giudizio umano — e cosa misurerei.',
    'Build a workflow blueprint.': 'Crea un blueprint di workflow.',
    'Choose a use case and set ambiguity, risk, volume and sensitivity. The local engine shows which steps fit rules, AI or human review.': 'Scegli il caso d’uso e imposta ambiguità, rischio, volume e sensibilità. Il motore locale mostra quali passaggi affidare a regole, AI o revisione umana.',
    'Choose a workflow': 'Scegli un workflow',
    'Sources → brief': 'Fonti → sintesi',
    'Reporting': 'Reporting',
    'Data → narrative': 'Dati → narrazione',
    'Evaluation': 'Valutazione',
    'Options → decision': 'Opzioni → decisione',
    'Intake': 'Intake',
    'Requests → action': 'Richieste → azione',
    'Measurement': 'Misurazione',
    'Inputs → review': 'Input → revisione',
    'Set the constraints': 'Imposta i vincoli',
    'Input ambiguity': 'Ambiguità degli input',
    'Low': 'Bassa',
    'Medium': 'Media',
    'High': 'Alta',
    'Cost of a wrong answer': 'Costo di una risposta errata',
    'Recurring volume': 'Volume ricorrente',
    'Occasional': 'Occasionale',
    'Weekly': 'Settimanale',
    'High-volume': 'Alto volume',
    'Sensitive data': 'Dati sensibili',
    'Add privacy gates': 'Aggiungi controlli di privacy',
    'Generate blueprint': 'Genera il blueprint',
    'Show my approach': 'Mostra il mio approccio',
    'Reset': 'Reimposta',
    'Runs in your browser. No data is sent or stored.': 'Funziona nel browser. Nessun dato viene inviato o salvato.',
    'Generated workflow blueprint': 'Blueprint del workflow generato',
    'Workflow approach generated by Mattia': 'Approccio al workflow generato da Mattia',
    'Suggested architecture': 'Architettura suggerita',
    'How I would structure it': 'Come lo strutturerei',
    'Balanced control': 'Controllo bilanciato',
    'High-control': 'Controllo rigoroso',
    'Exploration-first': 'Priorità all’esplorazione',
    'Before': 'Prima',
    'Suggested workflow steps': 'Passaggi suggeriti',
    'Steps I would use': 'Passaggi che userei',
    'Decision logic': 'Logica decisionale',
    'Why I would structure it this way': 'Perché lo strutturerei così',
    'What I would measure': 'Cosa misurerei',
    'What to measure': 'Cosa misurare',
    'Architecture legend': 'Legenda dell’architettura',
    'Deterministic': 'Deterministico',
    'deterministic': 'deterministico',
    'DETERMINISTIC': 'DETERMINISTICO',
    'human': 'umano',
    'rule': 'regola',
    'ai': 'ai',
    'Copy blueprint': 'Copia il blueprint',
    'Copy my approach': 'Copia il mio approccio',
    'Workflow blueprint': 'Blueprint del workflow',
    'My workflow approach': 'Il mio approccio al workflow',
    'Mode': 'Modalità',
    'Generated locally at': 'Generato localmente su',

    '03 · Product method': '03 · Metodo di prodotto',
    'Start with the workflow, then choose the tools.': 'Parti dal workflow, poi scegli gli strumenti.',
    'Use AI for variable interpretation, rules for repeatability, and human review for context, risk and accountability.': 'Usa l’AI per interpretare la variabilità, le regole per garantire ripetibilità e le persone per contesto, rischio e responsabilità.',
    'Frame': 'Inquadra',
    'Define the user, decision and friction.': 'Definisci utente, decisione e attrito.',
    'Map': 'Mappa',
    'Capture inputs, handoffs, exceptions and tacit judgement.': 'Rileva input, passaggi di consegna, eccezioni e giudizio implicito.',
    'Architect': 'Progetta',
    'Assign each step to data, rules, AI or people.': 'Assegna ogni passaggio a dati, regole, AI o persone.',
    'Prototype': 'Prototipa',
    'Build the smallest complete path with real inputs.': 'Costruisci il percorso completo più piccolo usando input reali.',
    'Evaluate': 'Valuta',
    'Test quality, effort, failure modes and review thresholds.': 'Testa qualità, impegno, modalità di errore e soglie di revisione.',
    'Operationalise': 'Rendi operativo',
    'Set ownership, monitoring and feedback loops.': 'Definisci ownership, monitoraggio e cicli di feedback.',
    'Solution ladder': 'Solution Ladder',
    'Choose the least complex intervention that meets the need.': 'Scegli l’intervento meno complesso che risponde al bisogno.',
    'These are options, not a maturity score. Move up only when the previous level cannot solve the workflow reliably.': 'Sono opzioni, non livelli di maturità. Sali solo quando il livello precedente non risolve il workflow in modo affidabile.',
    'Simplify': 'Semplifica',
    'Remove steps, clarify the decision and improve the interface.': 'Elimina passaggi, chiarisci la decisione e migliora l’interfaccia.',
    'Structure': 'Struttura',
    'Standardise inputs, ownership, states and source data.': 'Standardizza input, ownership, stati e dati sorgente.',
    'Automate': 'Automatizza',
    'Use rules for repeatable validation, calculation and routing.': 'Usa regole per validazione, calcolo e instradamento ripetibili.',
    'Assist': 'Assisti',
    'Use AI for variable language, retrieval, synthesis or explanation, with evidence and review.': 'Usa l’AI per linguaggio variabile, retrieval, sintesi o spiegazione, mantenendo evidenze e revisione.',
    'Orchestrate': 'Orchestra',
    'Connect tools, agents and handoffs around shared state and approval gates.': 'Collega strumenti, agenti e passaggi di consegna attorno a stato condiviso e gate di approvazione.',
    'Productise': 'Trasforma in prodotto',
    'Add dedicated UX, permissions, evaluation, monitoring and support.': 'Aggiungi UX dedicata, permessi, valutazione, monitoraggio e supporto.',
    'Stop at any level. Added complexity is justified only when it improves a useful outcome.': 'Fermati a qualsiasi livello. La complessità aggiunta è giustificata solo se migliora un risultato utile.',
    'Responsible by design': 'Responsabilità integrata',
    'Set the boundaries before automating.': 'Definisci i confini prima di automatizzare.',
    'Traceability': 'Tracciabilità',
    'Link claims to sources and transformations.': 'Collega le affermazioni a fonti e trasformazioni.',
    'Uncertainty': 'Incertezza',
    'Route low-confidence cases to review.': 'Invia i casi a bassa confidenza alla revisione.',
    'Accountability': 'Responsabilità',
    'Name the owner, checkpoint and override.': 'Definisci responsabile, checkpoint e override.',
    'Simulation': 'Simulazione',
    'Use synthetic audiences to test hypotheses — not replace research.': 'Usa audience sintetiche per esplorare ipotesi, non per sostituire la ricerca.',

    '04 · Experience': '04 · Esperienza',
    'Experience across strategy, product and AI systems.': 'Esperienza tra strategia, prodotto e sistemi AI.',
    'Roles spanning communication, NLP products, digital work and internal AI tools.': 'Ruoli tra comunicazione, prodotti NLP, digitale e strumenti AI interni.',
    '2022 — today': '2022 — oggi',
    'AI knowledge systems, brand and digital strategy': 'Sistemi AI per la conoscenza, brand e strategia digitale',
    'I joined through innovation and special projects, working across corporate reputation, sustainability, culture, events and emerging media. My role expanded toward brand governance, positioning, digital strategy, partnerships and the systems used to organise internal knowledge.': 'Sono entrato nell’area innovazione e progetti speciali, lavorando su reputazione corporate, sostenibilità, cultura, eventi e media emergenti. Il ruolo si è poi esteso a brand governance, posizionamento, strategia digitale, partnership e sistemi per organizzare la conoscenza interna.',
    'More recently, I have designed and prototyped AI-assisted workflows for research, monitoring, scoring, knowledge bases, synthetic-audience exploration, evaluation and reporting — translating between consultants, domain experts and technical systems.': 'Più di recente ho progettato e prototipato workflow assistiti dall’AI per ricerca, monitoraggio, scoring, knowledge base, audience sintetiche, valutazione e reporting, collegando consulenti, esperti di dominio e sistemi tecnici.',
    'Corporate reputation': 'Reputazione corporate',
    'AI adoption': 'Adozione dell’AI',
    'Knowledge systems': 'Sistemi di conoscenza',
    'Digital strategy': 'Strategia digitale',
    'NLP product, client work and product discovery': 'Prodotto NLP, clienti e product discovery',
    'I worked across digital-media analysis, client consulting and product development for an NLP-driven platform turning online conversations into social-listening, sentiment and corporate-reputation insights.': 'Ho lavorato tra analisi dei media digitali, consulenza ai clienti e sviluppo prodotto per una piattaforma NLP che trasformava conversazioni online in insight di social listening, sentiment e reputazione corporate.',
    'Sitting between technology and market taught me to distinguish what a product could do from what users actually needed. I later supported its market-driven pivot toward performance tools for Customer Success teams managing retail networks.': 'Lavorare tra tecnologia e mercato mi ha insegnato a distinguere ciò che un prodotto poteva fare da ciò che serviva davvero agli utenti. Ho poi supportato un pivot guidato dal mercato verso strumenti di performance per team Customer Success impegnati nella gestione di reti retail.',
    'Unstructured data': 'Dati non strutturati',
    'Product discovery': 'Product discovery',
    'Client advisory': 'Consulenza ai clienti',
    'Market pivot': 'Pivot di mercato',
    'UniSMART & independent work': 'UniSMART e attività indipendente',
    'Technology transfer and digital products': 'Trasferimento tecnologico e prodotti digitali',
    'I translated research, technologies and innovation opportunities into materials and narratives that non-specialist stakeholders could understand and use. Alongside this, I delivered websites, content systems, social media and digital positioning for SMEs.': 'Ho trasformato ricerca, tecnologie e opportunità di innovazione in materiali e narrazioni utilizzabili da interlocutori non specialisti. In parallelo ho realizzato siti, sistemi di contenuto, social media e posizionamento digitale per PMI.',
    'This is where I learned that translating between specialists and decision-makers is not only a communication skill. It is a product skill.': 'Qui ho capito che tradurre tra specialisti e decisori non è solo una competenza di comunicazione: è una competenza di prodotto.',
    'Technology transfer': 'Trasferimento tecnologico',
    'Open innovation': 'Open innovation',
    'Web projects': 'Progetti web',
    'Knowledge translation': 'Traduzione della conoscenza',

    '05 · Capabilities': '05 · Competenze',
    'Capabilities linked to examples.': 'Competenze collegate a evidenze.',
    'Choose a skill to open the relevant evidence in the on-device site search.': 'Seleziona una competenza per aprire le evidenze correlate nella ricerca locale.',
    'Domain & strategy': 'Dominio e strategia',
    'Brand governance': 'Brand governance',
    'Product & systems': 'Prodotto e sistemi',
    'Workflow mapping': 'Mappatura dei workflow',
    'Human-in-the-loop': 'Human-in-the-loop',
    'QA & evals': 'QA e valutazione',
    'Multi-surface products': 'Prodotti multi-interfaccia',
    'Agentic workflows': 'Workflow agentici',
    'AI operations': 'Operazioni AI',
    'Hands-on stack': 'Stack operativo',
    'LLMs & agents': 'LLM e agenti',
    'Scope': 'Perimetro',
    'I build and validate prototypes independently. Production security, reliability and scale are handled with engineering through explicit requirements and quality checks.': 'Progetto e valido prototipi in autonomia. Sicurezza, affidabilità e scalabilità in produzione vengono gestite con l’ingegneria tramite requisiti espliciti e controlli di qualità.',
    '06 · Background': '06 · Formazione e attività',
    'Communication strategy, technology and applied research.': 'Strategia di comunicazione, tecnologia e ricerca applicata.',
    'Education': 'Formazione',
    "Master's degree in Communication Strategies": 'Laurea magistrale in Strategie di Comunicazione',
    'University of Padua · communication analysis, online conversations, NLP and clustering applied to communication research.': 'Università di Padova · analisi della comunicazione, conversazioni online, NLP e clustering applicati alla ricerca.',
    'Leadership & public work': 'Leadership e attività pubblica',
    'FERPI, teaching and professional events': 'FERPI, didattica ed eventi professionali',
    'Former youth lead and UniFERPI coordinator; speaker and guest lecturer on sentiment analysis, social listening and digital communication work.': 'Già responsabile giovani e coordinatore UniFERPI; speaker e docente ospite su sentiment analysis, social listening e comunicazione digitale.',
    'Message on LinkedIn': 'Scrivimi su LinkedIn',
    'Copy short profile': 'Copia il profilo breve',
    'AI product · workflow design · knowledge systems': 'Prodotti AI · workflow design · sistemi di conoscenza',
    'Back to top ↑': 'Torna all’inizio ↑',
    'Inspect this system': 'Esamina questo sistema',
    'Designed and built as a privacy-friendly, dependency-free portfolio.': 'Progettato e sviluppato come portfolio senza dipendenze e rispettoso della privacy.',

    'Case study': 'Caso di studio',
    'Close case study': 'Chiudi il caso di studio',
    'Copy link to this case': 'Copia il link a questo caso',
    'Next case': 'Caso successivo',
    'The short version.': 'La versione breve.',
    '90-second business overview': 'Panoramica business in 90 secondi',
    'What I do and why it matters.': 'Cosa faccio e perché conta.',
    'Close recruiter tour': 'Chiudi il tour',
    'Tour progress': 'Avanzamento del tour',
    'Start with the workflow.': 'Parti dal workflow.',
    'Map the user, decision, friction and exceptions before choosing a model.': 'Mappa utente, decisione, attriti ed eccezioni prima di scegliere un modello.',
    'See the product method →': 'Scopri il metodo di prodotto →',
    'Choose the right mechanism.': 'Scegli il meccanismo giusto.',
    'Rules handle repeatability, AI handles variable language, and people retain contextual or high-risk decisions.': 'Le regole gestiscono la ripetibilità, l’AI il linguaggio variabile e le persone mantengono le decisioni contestuali o ad alto rischio.',
    'Try the workflow lab →': 'Prova il Workflow Lab →',
    'Prototype the complete path.': 'Prototipa il percorso completo.',
    'Interfaces, data, APIs, dashboards, reports and evaluation are tested as one workflow.': 'Interfacce, dati, API, dashboard, report e valutazione vengono testati come un unico workflow.',
    'Open the systems →': 'Apri i sistemi →',
    'Where I can contribute.': 'Dove posso contribuire.',
    'AI product roles connecting domain experts, product and engineering — especially for complex knowledge work.': 'Ruoli di prodotto AI che collegano esperti di dominio, prodotto e ingegneria, soprattutto nel knowledge work complesso.',
    'I start with the business problem.': 'Parto dal problema di business.',
    'I clarify who needs to decide what, where time is lost and what a useful outcome looks like.': 'Chiarisco chi deve decidere cosa, dove si perde tempo e come si riconosce un risultato utile.',
    'See selected work →': 'Vedi i progetti selezionati →',
    'I simplify before adding AI.': 'Semplifico prima di aggiungere l’AI.',
    'I remove unnecessary steps, structure the work and use AI only where it makes the experience faster or clearer.': 'Elimino i passaggi inutili, strutturo il lavoro e uso l’AI solo dove rende l’esperienza più rapida o più chiara.',
    'See how I work →': 'Scopri come lavoro →',
    'I turn ideas into testable products.': 'Trasformo le idee in prodotti verificabili.',
    'I connect user experience, data and practical checks in a working prototype, so teams can evaluate value before scaling.': 'Collego esperienza utente, dati e controlli pratici in un prototipo funzionante, così il team può valutarne il valore prima di scalarlo.',
    'Try my Workflow Lab →': 'Prova il mio Workflow Lab →',
    'The role I can play.': 'Il ruolo che posso svolgere.',
    'I connect business context, communication, product and technical teams to build AI tools people can actually use.': 'Collego contesto di business, comunicazione, prodotto e team tecnici per costruire strumenti AI che le persone riescano davvero a usare.',
    'Start a conversation →': 'Iniziamo una conversazione →',
    'Copy recruiter link': 'Copia il link del tour',
    'Back': 'Indietro',
    'Next': 'Avanti',
    'Finish': 'Fine',

    'I make complicated work easier.': 'Rendo più semplice il lavoro complicato.',
    'Close simple explanation': 'Chiudi la spiegazione semplice',
    'Imagine a desk covered in papers, messages and little jobs. I help turn that mess into one clear path.': 'Immagina una scrivania piena di fogli, messaggi e piccoli compiti. Aiuto a trasformare quel disordine in un percorso chiaro.',
    'First, I listen.': 'Prima ascolto.',
    'I learn what people are trying to do and what keeps getting in their way.': 'Capisco cosa stanno cercando di fare le persone e cosa continua a ostacolarle.',
    'Then, I tidy the work.': 'Poi metto ordine nel lavoro.',
    'I remove extra steps and give every piece of information a clear place.': 'Elimino i passaggi in più e assegno a ogni informazione un posto chiaro.',
    'Only then, I add AI.': 'Solo dopo aggiungo l’AI.',
    'AI helps read, write or spot patterns. Rules check the facts. A person makes important decisions.': 'L’AI aiuta a leggere, scrivere o riconoscere schemi. Le regole controllano i fatti. Una persona prende le decisioni importanti.',
    'The goal': 'L’obiettivo',
    'Not more AI. Less confusion, less repetitive work and a result people can understand and check.': 'Non più AI. Meno confusione, meno lavoro ripetitivo e un risultato che le persone possano capire e controllare.',
    'This site shows examples of that thinking, a small tool you can try and the experience I bring.': 'Questo sito mostra esempi di questo approccio, un piccolo strumento da provare e l’esperienza che porto.',
    'Got it': 'Ho capito',
    'Show me an example': 'Fammi vedere un esempio',

    'Find portfolio evidence or run a command': 'Cerca evidenze nel portfolio o esegui un comando',
    'Try “human review” or “product discovery”…': 'Prova “revisione umana” o “product discovery”…',
    'Close evidence search': 'Chiudi la ricerca',
    'On-device evidence search · nothing leaves your browser': 'Ricerca nel portfolio, eseguita in locale · nulla lascia il browser',
    'Search results': 'Risultati della ricerca',
    'No exact match. Try “human review”, “product discovery”, “evaluation” or “inspect”.': 'Nessuna corrispondenza. Prova “revisione umana”, “product discovery”, “valutazione” o “ispeziona”.',
    '{count} result available': '{count} risultato disponibile',
    '{count} results available': '{count} risultati disponibili',
    'navigate': 'naviga',
    'select': 'seleziona',
    'Tip: type “inspect”': 'Suggerimento: scrivi “ispeziona”',
    'System x-ray · local runtime': 'Radiografia del sistema · runtime locale',
    'What this page is doing.': 'Cosa sta facendo questa pagina.',
    'Close system inspection': 'Chiudi l’ispezione del sistema',
    'local resources': 'risorse locali',
    'transferred': 'trasferiti',
    'third-party trackers': 'tracker di terze parti',
    'DOM ready': 'DOM pronto',
    'Architecture': 'Architettura',
    'Static HTML · modular CSS · vanilla JavaScript': 'HTML statico · CSS modulare · JavaScript vanilla',
    'Privacy': 'Privacy',
    'No analytics, cookies, external fonts or API calls': 'Nessuna analytics, cookie, font esterno o chiamata API',
    'Resilience': 'Resilienza',
    'Core content works without JavaScript': 'I contenuti principali funzionano senza JavaScript',
    'Accessibility': 'Accessibilità',
    'Keyboard paths, semantic controls, reduced motion and print mode': 'Navigazione da tastiera, controlli semantici, movimento ridotto e modalità stampa',
    'Why build it this way?': 'Perché costruirlo così?',
    'The simplest architecture that meets the need is usually the strongest. This portfolio treats performance, privacy and graceful degradation as product choices rather than cleanup tasks.': 'L’architettura più semplice che soddisfa il bisogno è spesso la più solida. Questo portfolio tratta performance, privacy e degradazione controllata come scelte di prodotto, non come pulizia finale.',
    'The portfolio content remains available without JavaScript. Interactive workflow generation, dialogs and theme controls require it.': 'I contenuti del portfolio restano disponibili senza JavaScript. Generazione interattiva, dialoghi e controlli del tema lo richiedono.',
    'cached': 'in cache',
    'ready': 'pronto',

    'Page not found | Mattia Necchio': 'Pagina non trovata | Mattia Necchio',
    'Skip to recovery options': 'Vai alle opzioni di recupero',
    'Error page navigation': 'Navigazione della pagina di errore',
    'MN Mattia Necchio — portfolio home': 'MN Mattia Necchio — home del portfolio',
    'Portfolio home': 'Home del portfolio',
    '404 / Recovery mode': '404 / Modalità di recupero',
    'This route': 'Questo percorso',
    'failed gracefully.': 'ha fallito senza fare danni.',
    'The page at': 'La pagina',
    'this address': 'a questo indirizzo',
    'was not found.': 'non è stata trovata.',
    'A useful system does not guess: it exposes the failure and offers a safe next step.': 'Un sistema utile non improvvisa: mostra l’errore e offre un passo successivo sicuro.',
    'was not found. A useful system does not guess: it exposes the failure and offers a safe next step.': 'non è stata trovata. Un sistema utile non improvvisa: mostra l’errore e offre un passo successivo sicuro.',
    'Recovery options': 'Opzioni di recupero',
    'Return home': 'Torna alla home',
    'See selected systems': 'Vedi i sistemi selezionati',
    'Run recovery check': 'Esegui il controllo di recupero',
    'Repair workflow': 'Workflow di recupero',
    'Safe fallback': 'Fallback sicuro',
    'Receive request': 'Ricevi la richiesta',
    'Read the requested path locally.': 'Leggi localmente il percorso richiesto.',
    'Pending': 'In attesa',
    'Validate route': 'Verifica il percorso',
    'Check for a known destination.': 'Verifica la presenza di una destinazione nota.',
    'Prepare fallback': 'Prepara il fallback',
    'Offer verified navigation only.': 'Offri solo percorsi verificati.',
    'Keep a human in control': 'Mantieni il controllo umano',
    'You choose what happens next.': 'Sei tu a scegliere il prossimo passo.',
    'Recovery is available.': 'Il recupero è disponibile.',
    'Run the check or choose a verified link.': 'Esegui il controllo o scegli un link verificato.',
    'View decision log': 'Vedi il log decisionale',
    'No speculative redirect was applied. This page sends no analytics, stores no input and makes no network request; the requested path is displayed from your browser only.': 'Non è stato applicato alcun reindirizzamento non verificato. La pagina non usa analytics, non salva input e non effettua richieste di rete; il percorso richiesto resta nel browser.',
    'JavaScript is off.': 'JavaScript è disattivato.',
    'The verified links remain fully available.': 'I link verificati restano disponibili.',
    'No analytics · no cookies · no data transmitted by this page.': 'Niente analytics · niente cookie · nessun dato trasmesso da questa pagina.',
    'Curious? Read': 'Vuoi curiosare? Leggi',
    'Checking.': 'Controllo in corso.',
    'Validating this route without sending data anywhere.': 'Verifico il percorso senza inviare dati.',
    'Reading': 'Lettura',
    'Received': 'Ricevuta',
    'Checking': 'Verifica',
    'No match': 'Nessuna corrispondenza',
    'Preparing': 'Preparazione',
    'Ready': 'Pronto',
    'Your choice': 'A te la scelta',
    'In control': 'Decidi tu',
    'Recovery path ready.': 'Percorso di recupero pronto.',
    'Choose a verified destination; no automatic redirect will override you.': 'Scegli una destinazione verificata: nessun redirect automatico deciderà al posto tuo.',
    'Run check again': 'Ripeti il controllo',

    // Case-study dialogs: labels, architecture decisions and honest boundaries.
    'User': 'Utenti',
    'Status': 'Stato',
    'Surfaces': 'Interfacce',
    'Skills demonstrated': 'Competenze applicate',
    'My contribution': 'Competenze mostrate',
    'The problem': 'Il problema',
    'Before → after': 'Prima → dopo',
    'Product decision': 'Scelta di prodotto',
    'AI': 'AI',
    'Human': 'Persone',
    'Knowledge workflow · composite pattern': 'Workflow della conoscenza · pattern composito',
    'Cross-functional teams working across heterogeneous sources': 'Team trasversali che lavorano su fonti eterogenee',
    'Reusable anonymised composite': 'Composito anonimizzato e riutilizzabile',
    'Workflow design, orchestration, QA and prototyping': 'Workflow design, orchestrazione, QA e prototipazione',
    'Knowledge work begins across documents, websites, structured sources and notes. Manual copy-paste obscures provenance, makes comparison costly and turns every output into a one-off effort.': 'Il knowledge work parte da documenti, siti, fonti strutturate e note. Il copia-incolla manuale nasconde la provenienza, rende oneroso il confronto e trasforma ogni output in un lavoro una tantum.',
    'Scattered browsing and manual reconciliation become a staged pipeline: acquire, normalise, interpret, verify, review and publish.': 'Navigazione dispersa e riconciliazione manuale diventano una pipeline a fasi: acquisire, normalizzare, interpretare, verificare, revisionare e pubblicare.',
    'Preserve sources before adding synthesis. A useful output lets a reviewer inspect the evidence behind each important claim.': 'Conserva le fonti prima di aggiungere la sintesi. Un output utile permette di verificare le evidenze dietro ogni affermazione importante.',
    'Evidence coverage on a fixed benchmark set, unsupported-claim rate, time to correct, and reviewer acceptance with reason-coded edits.': 'Copertura delle evidenze su un benchmark fisso, tasso di affermazioni non supportate, tempo di correzione e accettazione con modifiche motivate.',
    'Source acquisition, metadata normalisation, deduplication, required fields and evidence-link checks.': 'Acquisizione delle fonti, normalizzazione dei metadati, deduplicazione, campi obbligatori e controllo dei link alle evidenze.',
    'Classification, thematic grouping, extraction and synthesis where language understanding creates leverage.': 'Classificazione, raggruppamento tematico, estrazione e sintesi dove la comprensione del linguaggio crea valore.',
    'Scope decisions, interpretation of sensitive context, exception resolution and final editorial approval.': 'Definizione del perimetro, interpretazione dei contesti sensibili, gestione delle eccezioni e approvazione editoriale finale.',
    'Outcome evidence is described qualitatively because the underlying work and sources are confidential. No throughput or accuracy metric is implied here.': 'I risultati sono descritti in modo qualitativo perché lavoro e fonti sottostanti sono riservati. Non viene suggerita alcuna metrica di velocità o accuratezza.',

    'Evaluation system · pre-calibration pattern': 'Sistema di valutazione · pattern pre-calibrazione',
    'Teams comparing complex qualitative options and scenarios': 'Team che confrontano opzioni e scenari qualitativi complessi',
    'Prototype and pre-calibration workflow pattern': 'Pattern di workflow prototipale e pre-calibrazione',
    'Evidence modelling, rubric design, agent flow, scoring and review logic': 'Modellazione delle evidenze, rubriche, flusso degli agenti, scoring e logica di revisione',
    'Complex evaluations mix observed facts, interpretation and speculation. A polished score can hide weak evidence or mirror the starting hypothesis.': 'Le valutazioni complesse mescolano fatti osservati, interpretazione e ipotesi. Un punteggio ben presentato può nascondere evidenze deboli o riflettere il presupposto iniziale.',
    'Ad-hoc judgement becomes an evidence-first flow: capture observations, label inference and uncertainty, apply a stable rubric, compare variants and route sensitive cases to review.': 'Il giudizio ad hoc diventa un flusso evidence-first: raccoglie osservazioni, distingue inferenza e incertezza, applica una rubrica stabile, confronta varianti e invia i casi sensibili alla revisione.',
    'Evidence comes before score. Early outputs carry confidence limits, and exploratory scenarios remain separate from real-world observations.': 'Le evidenze vengono prima del punteggio. Gli output iniziali esplicitano i limiti di confidenza e gli scenari esplorativi restano separati dalle osservazioni reali.',
    'Reviewer agreement and disagreement reasons, ordering stability under input changes, unsupported claims, override reasons and calibration against observed outcomes.': 'Accordo tra revisori e motivi del disaccordo, stabilità dell’ordinamento al variare degli input, affermazioni non supportate, motivi degli override e calibrazione sui risultati osservati.',
    'Evidence schemas, observed/inferred/unknown states, scoring ranges, confidence caps and completeness checks.': 'Schemi delle evidenze, stati osservato/inferito/sconosciuto, intervalli di scoring, limiti di confidenza e controlli di completezza.',
    'Evidence extraction, qualitative lenses, scenario variation, critique and evidence-bound explanation.': 'Estrazione delle evidenze, prospettive qualitative, variazione degli scenari, critica e spiegazioni ancorate alle fonti.',
    'Criteria definition, sensitive-case review, calibration, dispute resolution and the final decision.': 'Definizione dei criteri, revisione dei casi sensibili, calibrazione, risoluzione dei disaccordi e decisione finale.',
    'This pre-calibration pattern is not population-validated. Synthetic scenarios explore hypotheses; they do not replace real research, and no live performance claim is made without observed evidence.': 'Questo pattern pre-calibrazione non è validato sulla popolazione. Gli scenari sintetici esplorano ipotesi, non sostituiscono la ricerca reale e non implicano prestazioni sul campo senza evidenze osservate.',

    'Self-service product · adaptation and hardening': 'Prodotto self-service · adattamento e hardening',
    'Non-technical teams producing recurring structured outputs': 'Team non tecnici che producono output strutturati ricorrenti',
    'Adaptation and product-hardening pattern': 'Pattern di adattamento e hardening di prodotto',
    'UX simplification, configuration, batch data flows, security hardening and deployment readiness': 'Semplificazione della UX, configurazione, flussi dati batch, security hardening e preparazione al deploy',
    'Small changes and team-wide updates often bounce between data sources, specialists and administrators, creating rework and inconsistent outputs.': 'Piccole modifiche e aggiornamenti su larga scala rimbalzano spesso tra fonti dati, specialisti e amministratori, generando rilavorazioni e output incoerenti.',
    'Templates, individual or batch inputs, guided editing and export become one coherent self-service flow.': 'Template, input singoli o batch, modifica guidata ed export diventano un unico flusso self-service coerente.',
    'Automate repeatable placement and validation while keeping meaningful adjustments with the user. Different access paths share the same clear mental model.': 'Automatizza posizionamento e validazione ripetibili, lasciando all’utente le regolazioni che contano. I diversi percorsi di accesso condividono lo stesso modello mentale.',
    'Task completion without help, import error and recovery rate, output fidelity, time to a usable result and reason-coded rework.': 'Completamento senza assistenza, errori e recupero dell’import, fedeltà dell’output, tempo al risultato utilizzabile e rilavorazioni motivate.',
    'Input validation, field mapping, access policies, private storage and export rules.': 'Validazione degli input, mapping dei campi, policy di accesso, storage privato e regole di export.',
    'Template population, batch generation and reusable layout behaviour.': 'Compilazione dei template, generazione batch e comportamento riutilizzabile del layout.',
    'Template choice, guided adjustment, exception handling and approval of the final output.': 'Scelta del template, regolazione guidata, gestione delle eccezioni e approvazione dell’output finale.',
    'This pattern includes adaptation of an open-source foundation. The contribution described here is product adaptation, UX and security hardening, configuration and deployment readiness — not original authorship of the foundation.': 'Il pattern include l’adattamento di una base open source. Il lavoro descritto riguarda prodotto, UX, security hardening, configurazione e preparazione al deploy, non la paternità della base.',

    'Analysis automation · reusable pipeline': 'Automazione dell’analisi · pipeline riutilizzabile',
    'Analysts producing recurring business outputs': 'Analisti che producono output aziendali ricorrenti',
    'Structured analysis and reporting pattern': 'Pattern strutturato di analisi e reporting',
    'Pipeline design, validation boundaries and output architecture': 'Progettazione della pipeline, confini di validazione e architettura dell’output',
    'Recurring analysis becomes fragile when calculations, interpretation and document production live in one opaque workflow.': 'L’analisi ricorrente diventa fragile quando calcoli, interpretazione e produzione dei documenti convivono in un workflow opaco.',
    'Manual recomputation and narrative assembly become separate stages: process, validate, structure, interpret and publish.': 'Ricalcolo manuale e costruzione della narrazione diventano fasi distinte: elaborare, validare, strutturare, interpretare e pubblicare.',
    'Never ask a language model to be the calculator of record. Create trusted structured outputs first, then use AI selectively around them.': 'Non usare un modello linguistico come calcolatore ufficiale. Prima crea output strutturati affidabili, poi usa l’AI in modo selettivo.',
    'Reconciliation failure rate, claim-to-data errors, reviewer corrections and time to an approved report — not draft speed alone.': 'Tasso di mancata riconciliazione, errori tra affermazioni e dati, correzioni del revisore e tempo al report approvato, non solo velocità della bozza.',
    'Parsing, calculations, validation, structured outputs, templates and export rules.': 'Parsing, calcoli, validazione, output strutturati, template e regole di export.',
    'Categorisation, synthesis and explanation where the result can be traced to validated data.': 'Categorizzazione, sintesi e spiegazione quando il risultato può essere ricondotto a dati validati.',
    'Business interpretation, outlier review, narrative judgement and approval of the delivered report.': 'Interpretazione di business, revisione degli outlier, giudizio narrativo e approvazione del report.',
    'No ROI is stated without measured project data. The case documents the architecture and quality boundary instead.': 'Non viene dichiarato alcun ROI senza dati misurati. Il caso documenta invece architettura e confini di qualità.',

    'Analysis & measurement · anonymised multi-surface pattern': 'Analisi e misurazione · pattern multi-interfaccia anonimizzato',
    'Analysts, contributors and authorised reviewers': 'Analisti, contributori e revisori autorizzati',
    'Browser and installed-client inputs, operational views, structured storage and role-aware outputs': 'Input da browser e applicazioni desktop, viste operative, archiviazione strutturata e output differenziati per ruolo',
    'Workflow mapping, UX, data modelling, measurement logic, prototyping and evaluation': 'Mappatura del workflow, UX, modellazione dei dati, logica di misurazione, prototipazione e valutazione',
    'Distributed analysis becomes a stateful product once access, multiple input paths, shared calculations, status, evidence, review and useful outputs need to stay aligned.': 'L’analisi distribuita richiede un prodotto capace di mantenere allineati accessi, percorsi di input, calcoli condivisi, avanzamento, evidenze, revisione e output.',
    'Disconnected inputs and separately calculated outputs become one coordinated flow backed by a structured model, shared rules and explicit review states.': 'Input scollegati e output calcolati separatamente diventano un flusso coordinato basato su un modello strutturato, regole condivise e stati di revisione espliciti.',
    'One versioned calculation and validation layer serves every surface. The analysis record — not a generated summary — is the source of truth, and privileged actions stay protected.': 'Un unico livello versionato di calcolo e validazione serve ogni interfaccia. Il record di analisi, non una sintesi generata, resta il riferimento autorevole; le azioni privilegiate sono protette.',
    'Calculation consistency across surfaces, completion and recovery rates, access exceptions, time to reviewed output, human overrides and output fidelity.': 'Coerenza dei calcoli tra interfacce, tassi di completamento e recupero, eccezioni di accesso, tempo necessario per ottenere un output revisionato, override umani e fedeltà dell’output.',
    'Access, data constraints, process states, shared measurement rules, routing, audit trails and output assembly.': 'Accessi, vincoli sui dati, stati di processo, regole di misurazione condivise, routing, audit trail e composizione degli output.',
    'Optional evidence-bound synthesis and explanation after structured processing; never an autonomous final response.': 'Sintesi e spiegazione opzionali, ancorate alle evidenze e successive all’elaborazione strutturata; mai una risposta finale autonoma.',
    'Interpretation, exception resolution, measurement review, recommendation and final approval.': 'Interpretazione, risoluzione delle eccezioni, revisione delle misure, raccomandazione e approvazione finale.',
    'This anonymised composite reflects architecture and local build work; production deployment and real-world adoption are not claimed. Production security and scale still require formal engineering review.': 'Questo composito anonimizzato riflette lavoro di architettura e prototipi eseguibili in locale; non dichiara rilascio in produzione né adozione reale. Sicurezza e scalabilità richiedono una revisione ingegneristica formale.',

    'Agentic orchestration · governed composite pattern': 'Orchestrazione agentica · pattern composito governato',
    'Teams delivering complex, evidence-heavy outputs': 'Team che producono output complessi e ad alta densità di evidenze',
    'Multi-stage agentic workflow pattern': 'Pattern di workflow agentico multi-fase',
    'Workflow architecture, stage contracts, decision records and QA boundaries': 'Architettura del workflow, contratti di fase, registri decisionali e confini di QA',
    'Large knowledge tasks create missed constraints, generic reuse and repeated questions. Intake, research, option design and production often drift apart before final review.': 'I grandi task di conoscenza generano vincoli mancati, riuso generico e domande ripetute. Intake, ricerca, progettazione delle opzioni e produzione possono divergere prima della revisione finale.',
    'Intake, contextual research, alternative design, production and independent QA run as explicit stages that can reopen when evidence changes.': 'Intake, ricerca contestuale, progettazione di alternative, produzione e QA indipendente operano come fasi esplicite che possono riaprirsi quando cambiano le evidenze.',
    'Ask only questions that change the route. Facts, evidence, interpretations and assumptions remain distinct, while a shared state keeps the next action obvious.': 'Fai solo domande che cambiano il percorso. Fatti, evidenze, interpretazioni e ipotesi restano distinti; uno stato condiviso rende chiara la prossima azione.',
    'Constraint coverage, unsupported assertions, reopened-stage reasons, high-impact questions per phase and QA findings caught before delivery.': 'Copertura dei vincoli, affermazioni non supportate, motivi di riapertura delle fasi, domande ad alto impatto e rilievi QA intercettati prima della consegna.',
    'Stage contracts, required artefacts, status transitions, source registers and completion gates.': 'Contratti di fase, artefatti obbligatori, transizioni di stato, registri delle fonti e gate di completamento.',
    'Specialist analysis, research synthesis, option generation, production support and independent challenge.': 'Analisi specialistica, sintesi della ricerca, generazione di opzioni, supporto alla produzione e verifica indipendente.',
    'Strategic choices, material commitments, assumptions, approvals and final accountability.': 'Scelte strategiche, impegni sostanziali, ipotesi, approvazioni e responsabilità finale.',
    'This is a workflow and prompt-governance pattern, not a claim of autonomous delivery. Evidence and material commitments always require human verification.': 'È un pattern di workflow e prompt governance, non una promessa di delivery autonoma. Evidenze e impegni sostanziali richiedono sempre verifica umana.',

    'AI-assisted operations · production-oriented pattern': 'Operazioni assistite dall’AI · pattern orientato alla produzione',
    'Operators managing multiple software products and releases': 'Operatori che gestiscono più prodotti software e release',
    'Production-oriented architecture, not claimed as live production': 'Architettura orientata alla produzione, non dichiarata come sistema live',
    'Product architecture, operator UX, safety gates and system prototyping': 'Architettura di prodotto, UX operativa, gate di sicurezza e prototipazione del sistema',
    'AI-assisted maintenance becomes unsafe when intent, code changes, tests, deployment state and rollback live in disconnected tools or opaque agents.': 'La manutenzione assistita dall’AI diventa rischiosa quando intento, modifiche al codice, test, stato del deploy e rollback vivono in strumenti scollegati o agenti opachi.',
    'A conversational request becomes an event and a visible task timeline across specialised workers for analysis, changes, review, tests, security and release.': 'Una richiesta conversazionale diventa un evento e una timeline visibile di task affidati a worker specializzati in analisi, modifiche, revisione, test, sicurezza e release.',
    'Preview is the default. Risky actions need approval, direct commits to the main branch are blocked, and every release keeps a pause and rollback path.': 'L’anteprima è il comportamento predefinito. Le azioni rischiose richiedono approvazione, i commit diretti sul branch principale sono bloccati e ogni release mantiene percorsi di pausa e rollback.',
    'Approval latency, failed or retried tasks by type, test and security gate failures, rollback readiness, recovery time and operator interventions.': 'Latenza di approvazione, task falliti o ripetuti per tipo, errori nei gate di test e sicurezza, prontezza del rollback, tempo di recupero e interventi dell’operatore.',
    'Typed events, queues, allowlists, isolated workspaces, idempotency, audit logs and release gates.': 'Eventi tipizzati, code, allowlist, workspace isolati, idempotenza, audit log e gate di release.',
    'Intent interpretation and specialised workers for analysis, implementation, review and remediation plans.': 'Interpretazione dell’intento e worker specializzati per analisi, implementazione, revisione e piani di correzione.',
    'Approval of risky actions, exception handling, release control and rollback decisions.': 'Approvazione delle azioni rischiose, gestione delle eccezioni, controllo delle release e decisioni di rollback.',
    'The architecture is production-oriented, not verified in production. RBAC, stronger isolation, observability and dead-letter handling remain explicit hardening work.': 'L’architettura è orientata alla produzione, ma non verificata in produzione. RBAC, isolamento più forte, osservabilità e gestione delle dead-letter restano attività esplicite di hardening.',

    // Workflow Lab plans and dynamically assembled evaluation states.
    'Open tabs → copy notes → reconcile manually → write brief → chase sources': 'Apri schede → copia note → riconcilia a mano → scrivi la sintesi → recupera le fonti',
    'Acquire': 'Acquisisci',
    'Connect sources and keep provenance': 'Collega le fonti e conserva la provenienza',
    'Normalise': 'Normalizza',
    'Create one evidence schema': 'Crea un unico schema delle evidenze',
    'Extract and group meaning': 'Estrai e raggruppa i significati',
    'Check claims against evidence': 'Verifica le affermazioni sulle evidenze',
    'Approve': 'Approva',
    'Resolve context and publish': 'Risolvi il contesto e pubblica',
    'Preserve provenance before synthesis. Language models help interpret varied material; rules protect the evidence chain.': 'Conserva la provenienza prima della sintesi. I modelli linguistici interpretano materiali diversi; le regole proteggono la catena delle evidenze.',
    'Evidence coverage on a fixed benchmark set': 'Copertura delle evidenze su un benchmark fisso',
    'Unsupported-claim rate and time to correct': 'Tasso di affermazioni non supportate e tempo di correzione',
    'Reviewer acceptance with reason-coded edits': 'Accettazione del revisore con modifiche motivate',
    'Export data → repair sheets → calculate → paste charts → draft narrative → recheck totals': 'Esporta dati → correggi fogli → calcola → incolla grafici → prepara la narrazione → ricontrolla i totali',
    'Validate': 'Valida',
    'Reject malformed source data': 'Rifiuta dati sorgente non validi',
    'Calculate': 'Calcola',
    'Produce trusted metrics': 'Produci metriche affidabili',
    'Explain': 'Spiega',
    'Draft evidence-bound narrative': 'Prepara una narrazione ancorata alle evidenze',
    'Reconcile': 'Riconcilia',
    'Trace claims to values': 'Collega le affermazioni ai valori',
    'Sign off': 'Approva',
    'Apply business judgement': 'Applica il giudizio di business',
    'The calculator of record stays deterministic. AI works after validation, where it can explain rather than invent the numbers.': 'Il calcolatore ufficiale resta deterministico. L’AI interviene dopo la validazione, per spiegare i numeri senza inventarli.',
    'Reconciliation failure rate': 'Tasso di mancata riconciliazione',
    'Claim-to-data errors and reviewer corrections': 'Errori tra affermazioni e dati e correzioni del revisore',
    'Time to an approved report — not draft speed alone': 'Tempo al report approvato, non solo velocità della bozza',
    'Discuss options → rely on instinct → write rationale → discover criteria changed midstream': 'Discuti opzioni → affidati all’istinto → scrivi la motivazione → scopri criteri cambiati in corsa',
    'Define rubric': 'Definisci la rubrica',
    'Make criteria explicit': 'Rendi espliciti i criteri',
    'Generate variants': 'Genera varianti',
    'Explore controlled alternatives': 'Esplora alternative controllate',
    'Score': 'Assegna il punteggio',
    'Apply stable criteria': 'Applica criteri stabili',
    'Challenge': 'Metti alla prova',
    'Surface edge cases and counterpoints': 'Fai emergere casi limite e controargomenti',
    'Own trade-offs and outcome': 'Assumi la responsabilità di compromessi e risultato',
    'AI expands the option space and challenges assumptions. A fixed rubric preserves comparability; people own the weighting and decision.': 'L’AI amplia lo spazio delle opzioni e mette alla prova le ipotesi. Una rubrica fissa mantiene la comparabilità; alle persone restano pesi e decisione.',
    'Reviewer agreement and reasons for disagreement': 'Accordo tra revisori e motivi del disaccordo',
    'Ranking stability under prompt and order changes': 'Stabilità del ranking al variare di prompt e ordine',
    'Unsupported claims and override reasons': 'Affermazioni non supportate e motivi degli override',
    'Read request → ask for missing context → forward messages → lose status → follow up manually': 'Leggi la richiesta → chiedi il contesto mancante → inoltra messaggi → perdi lo stato → sollecita a mano',
    'Require essential context': 'Richiedi il contesto essenziale',
    'Classify': 'Classifica',
    'Interpret intent and urgency': 'Interpreta intento e urgenza',
    'Route': 'Instrada',
    'Apply ownership rules': 'Applica le regole di ownership',
    'Draft action': 'Proponi un’azione',
    'Prepare a grounded next step': 'Prepara un passo successivo motivato',
    'Confirm': 'Conferma',
    'Accept, edit or escalate': 'Accetta, modifica o inoltra',
    'Rules protect required information and ownership. AI helps interpret messy requests; a named owner confirms the next action.': 'Le regole proteggono informazioni obbligatorie e ownership. L’AI interpreta richieste disordinate; un responsabile nominato conferma la prossima azione.',
    'Correct routing and time to first useful action': 'Correttezza del routing e tempo alla prima azione utile',
    'Rework and escalation precision': 'Rilavorazioni e precisione dell’escalation',
    'Owner corrections by failure type': 'Correzioni del responsabile per tipo di errore',
    'Collect inputs → reconcile versions → calculate separately → chase status → assemble outputs': 'Raccogli input → riconcilia versioni → calcola separatamente → insegui lo stato → componi gli output',
    'Accept distributed inputs': 'Accetta input distribuiti',
    'Create one analysis record': 'Crea un unico record di analisi',
    'Summarise evidence and gaps': 'Sintetizza evidenze e lacune',
    'Apply one shared measurement layer': 'Applica un livello di misurazione condiviso',
    'Review exceptions and publish': 'Revisiona le eccezioni e pubblica',
    'One analysis record and one shared measurement layer serve every surface. AI can explain evidence; people own exceptions and recommendations.': 'Un record di analisi e un livello di misurazione condiviso servono ogni interfaccia. L’AI spiega le evidenze; le persone gestiscono eccezioni e raccomandazioni finali.',
    'Cross-surface calculation consistency': 'Coerenza dei calcoli tra interfacce',
    'Completion and recovery failures': 'Errori di completamento e recupero',
    'Human overrides and time to reviewed output': 'Override umani e tempo necessario per ottenere un output revisionato',
    'within a constrained taxonomy': 'entro una tassonomia vincolata',
    'Named approval': 'Approvazione con responsabile identificato',
    'Record accountable sign-off': 'Registra chi approva e se ne assume la responsabilità',
    'Sample review': 'Revisione a campione',
    'Inspect exceptions and a sample': 'Controlla eccezioni e un campione',
    'Privacy gate': 'Controllo di privacy',
    'Minimise, redact and control access': 'Riduci i dati, anonimizza e limita gli accessi',
    'High-risk or sensitive work receives explicit approval and an auditable exception path.': 'Il lavoro sensibile o ad alto rischio richiede approvazione esplicita e un percorso di eccezione verificabile.',
    'Review effort is concentrated on uncertainty and exceptions.': 'La revisione si concentra su incertezza ed eccezioni.',
    'Measure corrections, exceptions and time to completion — not output volume.': 'Misura correzioni, eccezioni e tempo di completamento, non il volume degli output.',
    'Sampled failure rate and drift by input type': 'Tasso di errore su campione e drift per tipo di input',
    'Redaction failures, access exceptions and retention checks': 'Errori di anonimizzazione, eccezioni di accesso e controlli di conservazione',
    'No silent fallback: low confidence enters a named review queue': 'Nessun fallback silenzioso: la bassa confidenza entra in una coda di revisione assegnata',

    // Command palette and copyable profile content.
    'Open the 90-second recruiter tour': 'Apri il tour di 90 secondi',
    'Four evidence-led chapters': 'Quattro tappe basate su esempi concreti',
    'Explain the site simply': 'Spiega il sito in modo semplice',
    'A plain-language guide with no technical jargon': 'Una guida in parole semplici, senza gergo tecnico',
    'Try the Workflow Lab': 'Prova il Workflow Lab',
    'A transparent local rules engine': 'Un motore locale di regole trasparente',
    'Human judgement and review': 'Giudizio umano e revisione',
    'Responsible-by-design product method': 'Metodo di prodotto con responsabilità integrate',
    'Product discovery evidence': 'Product discovery',
    'First employee at an NLP spin-off; market-led pivot': 'Primo dipendente in uno spin-off NLP; pivot guidato dal mercato',
    'Evaluation-system evidence': 'Sistema di valutazione',
    'Evidence-first scoring, uncertainty and review': 'Scoring evidence-first, incertezza e revisione',
    'Multi-surface analysis evidence': 'Analisi multi-interfaccia',
    'Input surfaces, data model, measurement logic and review': 'Interfacce di input, modello dati, logica di misurazione e revisione',
    'Corporate reputation & strategy': 'Reputazione corporate e strategia',
    'Domain foundation in high-context advisory work': 'Esperienza di dominio in contesti consulenziali complessi',
    'Knowledge systems evidence': 'Sistemi di conoscenza',
    'From sources to reviewable outputs': 'Dalle fonti a output verificabili',
    'Deterministic reporting evidence': 'Reporting deterministico',
    'Metrics computed in code before AI explanation': 'Metriche calcolate nel codice prima della spiegazione AI',
    'Agentic orchestration evidence': 'Orchestrazione agentica',
    'Stage gates, specialist agents and independent QA': 'Gate di fase, agenti specialistici e QA indipendente',
    'AI operations evidence': 'Operazioni AI',
    'Preview, approval, test, release and rollback': 'Anteprima, approvazione, test, release e rollback',
    'Self-service UX evidence': 'UX self-service',
    'Templates, structured import, guided editing and export': 'Template, import strutturato, modifica guidata ed export',
    'Toggle colour theme': 'Cambia tema',
    'Light / dark': 'Chiaro / scuro',
    'Architecture, privacy and local performance': 'Architettura, privacy e performance locali',
    'Mattia Necchio designs useful AI products for complex workflows. He maps how work happens, prototypes the full path, and defines where data, rules, AI and human review belong. His background spans corporate reputation, NLP products, digital strategy and AI-assisted knowledge systems.': 'Mattia Necchio progetta prodotti AI utili per workflow complessi. Mappa il lavoro reale, prototipa l’intero percorso e definisce dove usare dati, regole, AI e revisione umana. Il suo percorso unisce reputazione corporate, prodotti NLP, strategia digitale e sistemi di conoscenza assistiti dall’AI.',
    'research': 'ricerca',
    'reporting': 'reporting',
    'evaluation': 'valutazione',
    'intake': 'intake',
    'measurement': 'misurazione',

    // Italian aliases make the bilingual command palette searchable in either language.
    'recruiter fit short proof role': 'selezione compatibilità sintesi evidenze ruolo',
    'simple explain non technical child plain language accessibility': 'semplice spiega non tecnico bambino parole chiare accessibilità',
    'workflow mapping simplify automation LLM AI rules': 'mappatura workflow semplificare automazione LLM AI regole',
    'human review human-in-the-loop accountability safety uncertainty': 'revisione umana human-in-the-loop responsabilità sicurezza incertezza',
    'product discovery market users Chisito pivot NLP': 'product discovery mercato utenti Chisito pivot NLP',
    'evaluation evals QA evidence scoring rubric uncertainty': 'valutazione test QA evidenze scoring rubrica incertezza',
    'full-stack prototype multi-surface analysis measurement data model interfaces review APIs Next.js Supabase Postgres desktop Tauri': 'full-stack prototipo multi-interfaccia analisi misurazione modello dati interfacce revisione API Next.js Supabase Postgres desktop Tauri',
    'corporate reputation brand governance digital strategy communication': 'reputazione corporate brand governance strategia digitale comunicazione',
    'knowledge systems research sources evidence LLMs Python': 'sistemi di conoscenza ricerca fonti evidenze LLM Python',
    'reporting metrics KPI calculations Python PowerPoint spreadsheet reconciliation': 'reporting metriche KPI calcoli Python PowerPoint fogli di calcolo riconciliazione',
    'agentic orchestration workflow agents research QA decision log': 'orchestrazione agentica workflow agenti ricerca QA registro decisionale',
    'AI operations control plane queues workers Git GitHub release rollback security': 'operazioni AI control plane code worker Git GitHub release rollback sicurezza',
    'self-service product UX structured import editor hardening deployment': 'prodotto self-service UX import strutturato editor hardening deploy',
    'theme dark light appearance': 'tema scuro chiaro aspetto',
    'inspect technical architecture performance privacy easter egg simplify': 'ispeziona architettura tecnica performance privacy easter egg semplificare',

    'Copied to clipboard': 'Copiato negli appunti',
    'Case link copied': 'Link del caso copiato',
    'Recruiter link copied': 'Link del tour copiato',
    'Approach rebuilt locally': 'Approccio rigenerato in locale',
    'Approach copied': 'Approccio copiato',
    'Blueprint rebuilt locally': 'Blueprint rigenerato localmente',
    'Blueprint copied': 'Blueprint copiato',
    'Short profile copied': 'Profilo breve copiato',
    'A useful AI workflow begins with a boring question: what decision must become easier?': 'Un workflow AI utile parte da una domanda poco spettacolare: quale decisione deve diventare più semplice?',
    'Press Ctrl/Cmd + K and type “inspect”.': 'Premi Ctrl/Cmd + K e scrivi “ispeziona”.'
  });

  const phraseEntries = Object.entries(IT)
    .filter(([source]) => source.length >= 18 || source === 'was not found.')
    .sort((a, b) => b[0].length - a[0].length);
  const originals = new WeakMap();
  const attributeOriginals = new WeakMap();
  const structuredDataOriginals = new WeakMap();
  let language = 'en';

  const safeStorage = {
    get() {
      try { return window.localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
    },
    set(value) {
      try { window.localStorage.setItem(STORAGE_KEY, value); } catch (_) { /* Storage may be disabled. */ }
    }
  };

  const normaliseLanguage = (value) => {
    const code = String(value || '').trim().toLowerCase();
    if (code === 'it' || code.startsWith('it-')) return 'it';
    if (code === 'en' || code.startsWith('en-')) return 'en';
    return null;
  };

  const translateCore = (source, targetLanguage) => {
    if (targetLanguage !== 'it' || !source) return source;
    if (Object.prototype.hasOwnProperty.call(IT, source)) return IT[source];

    let match = source.match(/^System (\d+) of (\d+)$/);
    if (match) return `Sistema ${match[1]} di ${match[2]}`;
    match = source.match(/^(\d+) (result|results) available$/);
    if (match) return `${match[1]} ${Number(match[1]) === 1 ? 'risultato disponibile' : 'risultati disponibili'}`;
    match = source.match(/^(\d{2}) · (deterministic|AI|human)$/);
    if (match) {
      const kind = match[2] === 'deterministic' ? 'deterministico' : match[2] === 'human' ? 'persona' : 'AI';
      return `${match[1]} · ${kind}`;
    }

    // App.js composes some sentences at runtime. Longest-first phrase replacement
    // translates those messages without touching URLs, identifiers or user input.
    let translated = source;
    phraseEntries.forEach(([english, italian]) => {
      if (translated.includes(english)) translated = translated.split(english).join(italian);
    });
    return translated;
  };

  const t = (source, requestedLanguage = language) => {
    if (typeof source !== 'string') return source;
    const targetLanguage = normaliseLanguage(requestedLanguage) || language;
    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    const core = source.slice(leading.length, source.length - trailing.length || undefined);
    return `${leading}${translateCore(core, targetLanguage)}${trailing}`;
  };

  const isIgnored = (element) => Boolean(element?.closest(
    'script, style, [data-no-i18n], #languageToggle, #mobileLanguageToggle'
  ));

  const translateTextNode = (node) => {
    if (!(node instanceof Text) || !node.parentElement) return;
    if (isIgnored(node.parentElement)) return;
    const current = node.nodeValue;
    let record = originals.get(node);
    if (!record || current !== record.applied) {
      record = { source: current, applied: current };
      originals.set(node, record);
    }
    if (!record.source.trim()) return;
    const translated = t(record.source);
    record.applied = translated;
    if (current !== translated) node.nodeValue = translated;
  };

  const translateAttributes = (element) => {
    if (!(element instanceof Element) || isIgnored(element)) return;
    if (!attributeOriginals.has(element)) attributeOriginals.set(element, new Map());
    const stored = attributeOriginals.get(element);
    ['aria-label', 'placeholder', 'title', 'alt'].forEach((name) => {
      if (!element.hasAttribute(name)) return;
      const current = element.getAttribute(name);
      let record = stored.get(name);
      if (!record || current !== record.applied) {
        record = { source: current, applied: current };
        stored.set(name, record);
      }
      const translated = t(record.source);
      record.applied = translated;
      if (current !== translated) element.setAttribute(name, translated);
    });
  };

  const translateTree = (rootNode = document.body) => {
    if (!rootNode) return;
    if (rootNode instanceof Text) {
      translateTextNode(rootNode);
      return;
    }
    if (rootNode instanceof Element) translateAttributes(rootNode);
    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node instanceof Text) translateTextNode(node);
      if (node instanceof Element) translateAttributes(node);
      node = walker.nextNode();
    }
  };

  const setMeta = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value) element.setAttribute('content', value);
  };

  const updateMetadata = () => {
    const italian = language === 'it';
    const page404 = document.title.includes('Page not found') || document.body?.querySelector('#repairWorkflow');
    document.title = page404
      ? (italian ? 'Pagina non trovata | Mattia Necchio' : 'Page not found | Mattia Necchio')
      : (italian ? 'Product designer AI e workflow | Mattia Necchio' : 'AI Product & Workflow Designer | Mattia Necchio');
    const description = page404
      ? (italian ? 'La pagina richiesta non è stata trovata. Usa un percorso di recupero sicuro per tornare al portfolio di Mattia Necchio.' : "The requested page could not be found. Use a safe recovery path to return to Mattia Necchio's portfolio.")
      : (italian ? 'Mattia Necchio progetta prodotti AI utili per workflow complessi: ricerca, valutazione, sistemi multi-interfaccia, reporting e revisione umana.' : 'Mattia Necchio designs useful AI products for complex workflows: research, evaluation, multi-surface tools, reporting and human review.');
    setMeta('meta[name="description"]', description);
    if (!page404) {
      setMeta('meta[property="og:locale"]', italian ? 'it_IT' : 'en_US');
      setMeta('meta[property="og:locale:alternate"]', italian ? 'en_US' : 'it_IT');
      setMeta('meta[property="og:title"]', document.title);
      setMeta('meta[name="twitter:title"]', document.title);
      setMeta('meta[property="og:description"]', italian ? 'Prodotti AI utili per workflow complessi, con regole chiare, controlli pratici e giudizio umano.' : 'Useful AI products for complex workflows — with clear rules, practical checks and human judgement built in.');
      setMeta('meta[name="twitter:description"]', italian ? 'Prodotti AI utili per workflow complessi, dalla prima mappa al prototipo testato.' : 'Useful AI products for complex workflows, from first map to tested prototype.');
      setMeta('meta[property="og:image:alt"]', italian ? 'Mattia Necchio, AI Product e Workflow Designer — dal lavoro complesso a sistemi utili' : 'Mattia Necchio, AI Product and Workflow Designer — from messy work to useful systems');
      const localizedUrl = italian ? 'https://mattian94.github.io/it/' : 'https://mattian94.github.io/';
      setMeta('meta[property="og:url"]', localizedUrl);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.href = localizedUrl;
    }
    const manifest = document.querySelector('link[rel="manifest"]');
    if (manifest) manifest.href = italian ? '/site-it.webmanifest?v=7' : '/site.webmanifest?v=7';
  };

  const updateStructuredData = () => {
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      if (!structuredDataOriginals.has(script)) structuredDataOriginals.set(script, script.textContent);
      const original = structuredDataOriginals.get(script);
      if (language !== 'it') {
        if (script.textContent !== original) script.textContent = original;
        return;
      }
      try {
        const data = JSON.parse(original);
        if (data['@type'] === 'WebSite') {
          data.description = 'Portfolio su prodotti AI, semplificazione dei workflow e sistemi di conoscenza.';
          data.inLanguage = ['en', 'it'];
        }
        if (data['@type'] === 'ProfilePage') data.name = 'Mattia Necchio — AI Product & Workflow Designer';
        if (data['@type'] === 'Person') {
          data.jobTitle = 'AI Product & Workflow Designer';
          if (data.homeLocation) data.homeLocation.name = 'Padova, Italia';
          if (data.alumniOf) data.alumniOf.name = 'Università di Padova';
        }
        script.textContent = JSON.stringify(data);
      } catch (_) { /* Keep valid source JSON-LD when parsing is unavailable. */ }
    });
  };

  const syncLanguageControls = () => {
    const italian = language === 'it';
    const nextLabel = italian ? 'EN' : 'IT';
    const nextName = italian ? 'English' : 'Italiano';
    const aria = italian ? 'Passa all’inglese' : 'Switch to Italian';
    const desktop = document.getElementById('languageToggle');
    const mobile = document.getElementById('mobileLanguageToggle');
    if (desktop) {
      desktop.textContent = nextLabel;
      desktop.setAttribute('aria-label', aria);
    }
    if (mobile) {
      mobile.textContent = nextName;
      mobile.setAttribute('aria-label', aria);
    }
  };

  const localizedLinkOriginals = new WeakMap();
  const syncLocalizedLinks = () => {
    document.querySelectorAll('a[href="/"], a[href^="/#"]').forEach((link) => {
      if (!localizedLinkOriginals.has(link)) localizedLinkOriginals.set(link, link.getAttribute('href'));
      const original = localizedLinkOriginals.get(link);
      if (language === 'it') {
        const hash = original.startsWith('/#') ? original.slice(1) : '';
        link.setAttribute('href', `/it/${hash}`);
      } else {
        link.setAttribute('href', original);
      }
    });
  };

  const languageUrl = (nextLanguage) => {
    const url = new URL(window.location.href);
    const homeRoute = /^(?:\/|\/index\.html|\/it\/|\/it\/index\.html)$/i.test(url.pathname);
    const italianErrorRoute = /^\/it(?:\/|$)/i.test(url.pathname) && !homeRoute;
    if (homeRoute) {
      url.pathname = nextLanguage === 'it' ? '/it/' : '/';
      url.searchParams.delete('lang');
    } else if (nextLanguage === 'it') {
      url.searchParams.set('lang', 'it');
    } else {
      if (italianErrorRoute) url.pathname = url.pathname.replace(/^\/it(?=\/|$)/i, '') || '/';
      url.searchParams.delete('lang');
    }
    return url;
  };

  const toggle = () => {
    const next = language === 'it' ? 'en' : 'it';
    safeStorage.set(next);
    window.location.assign(languageUrl(next));
  };

  const apply = (nextLanguage, { notify = true, updateUrl = false } = {}) => {
    language = normaliseLanguage(nextLanguage) || 'en';
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
    if (updateUrl) history.replaceState(history.state, '', languageUrl(language));
    translateTree(document.body);
    updateMetadata();
    updateStructuredData();
    syncLanguageControls();
    syncLocalizedLinks();
    if (notify) window.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { language } }));
  };

  const params = new URLSearchParams(window.location.search);
  const requested = normaliseLanguage(params.get('lang'));
  const pathLanguage = /^\/it(?:\/|$)/i.test(window.location.pathname) ? 'it' : null;
  const saved = normaliseLanguage(safeStorage.get());
  const browserLanguage = (navigator.languages || [navigator.language])
    .map(normaliseLanguage)
    .find(Boolean) || 'en';
  const initialLanguage = pathLanguage || requested || saved || browserLanguage;

  if (!pathLanguage && initialLanguage === 'it' && /^(?:\/|\/index\.html)$/i.test(window.location.pathname)) {
    window.location.replace(languageUrl('it'));
    return;
  }

  if (pathLanguage || requested) safeStorage.set(initialLanguage);

  window.portfolioI18n = {
    t,
    apply,
    toggle,
    catalog: IT,
    get language() { return language; }
  };

  apply(initialLanguage, { notify: false, updateUrl: false });
  document.getElementById('languageToggle')?.addEventListener('click', toggle);
  document.getElementById('mobileLanguageToggle')?.addEventListener('click', toggle);

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === 'childList') record.addedNodes.forEach((node) => translateTree(node));
      if (record.type === 'characterData') translateTextNode(record.target);
      if (record.type === 'attributes') translateAttributes(record.target);
    });
  });
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-label', 'placeholder', 'title', 'alt']
    });
  }

  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { language } }));
  }, 0);
})();
