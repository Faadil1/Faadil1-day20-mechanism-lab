# Blind Surface Legibility Repair — 2026-10-04

Trigger: builder/operator screen recording review before external participant testing.

Evidence class: **OPERATOR_OBSERVED / NOT_EXTERNAL_BLIND_PARTICIPANT_EVIDENCE**

## Observed problems in v0.1

1. **Probe A stale reveal**
   - After completing A, restarting the probe could leave the prior reveal visible beneath a new item.
   - This made the experience appear to loop or contradict itself.

2. **Probe B exposed research scaffolding**
   - Letter-only nodes, manual reveal controls and raw JSON made the experience read like a developer diagnostic.
   - Map movement was too subtle relative to the amount of explanatory/debug output.

3. **Probe C used an artificial “LINGER” button**
   - The interface asked the participant to explicitly label a behavior that the mechanism was supposed to observe.
   - This weakened the ambiguity between behavior and inferred meaning.

4. **Blind framing still exposed too much test structure**
   - Probe labels and technical reveal copy made the participant feel they were operating an experiment rather than experiencing a phenomenon.

5. **Potential thesis flash**
   - The working law existed in initial HTML and was replaced after JavaScript execution.
   - A slow render could theoretically expose the thesis before blind mode applied.

6. **Session contamination risk**
   - Reusing one browser could preserve prior probe state between participants.

## v0.2 repairs

### Probe A
- clean restart semantics;
- one item at a time;
- natural actions: NEXT / KEEP / PASS;
- no stale reveal;
- final comparison uses stated starting goal versus resulting model state without declaring what the participant “really meant.”

### Probe B
- labeled places instead of letter-only graph;
- stronger animated topology movement;
- minimum exploration before the return task;
- participant must find **Deep Time** again in the modified map;
- final surface shows start positions versus end positions visually;
- raw JSON removed from blind experience.

### Probe C
- removed LINGER button;
- actual dwell time is observed;
- next-item ranking reacts to dwell-derived bias;
- recall and causal question remain;
- final trace shows time/effect in readable form, not raw JSON.

### Blind protocol
- initial HTML is neutral;
- working thesis is inserted only in non-blind mode;
- per-participant `pid` namespaces session state.

## Truth boundary

This repair improves test validity and usability. It does **not** prove:
- participant comprehension;
- superiority of any mechanism;
- causal generalization beyond this lab;
- production readiness.

## Gate consequence

External Round 1 remains paused until the v0.2 Cloudflare preview is runtime-verified.

Exact next gate:
`BLIND_SURFACE_LEGIBILITY_REPAIR__RUNTIME_VERIFY_V0_2`
