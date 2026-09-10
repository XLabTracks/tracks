export interface EvaderMove {
  code: string;
  name: string;
  what: string;
}

export interface MonitorOption {
  id: string;
  label: string;
  right: boolean;
  note: string;
}

export interface EvaderRound {
  id: string;
  n: number;
  title: string;
  evader: EvaderMove[];
  question: string;
  options: MonitorOption[];
  actual: string;
  baseline: string;
  hardened: string;
  reading: string;
}

export const CORPUS = {
  binary: "98.2%",
  families: 20,
  models: 9,
  generations: 4,
};

export const ROUNDS: EvaderRound[] = [
  {
    id: "r1",
    n: 1,
    title: "Utilization Manipulation",
    evader: [
      {
        code: "A",
        name: "Utilization modulation",
        what: "Drive the card in waves rather than at a flat high load, so the utilization trace stops looking like a training run.",
      },
      {
        code: "B",
        name: "Low-utilization training",
        what: "Train slowly, well under the card's capacity, and accept a longer run.",
      },
      {
        code: "D",
        name: "Temporal disruption",
        what: "Break the run into irregular pieces so no long continuous block appears.",
      },
    ],
    question:
      "You hold the monitor. The classifier was trained on ordinary training and inference traces, and these three workloads are new to it. What do you do first?",
    options: [
      {
        id: "retrain",
        label: "Retrain the classifier on the evasive traces themselves",
        right: true,
        note: "This is what the team did. The cheapest move is to make the known evasions part of the training corpus, which is why the first round is not where the difficulty lives.",
      },
      {
        id: "threshold",
        label: "Raise the utilization threshold that flags a run as training",
        right: false,
        note: "A static threshold is what strategies A and B are built to walk under. The paper's own limitations note that some inference configurations sit in the same utilization and arithmetic-intensity range as training.",
      },
      {
        id: "power",
        label: "Add power-and-memory correlation features",
        right: false,
        note: "A real countermeasure, and the team did add it, but two rounds later against dilution. Spending it here would leave nothing new for round 3.",
      },
    ],
    actual:
      "The monitor retrained the classifier on the adversarial examples themselves.",
    baseline: "6 to 96% against the untrained baseline, depending on strategy",
    hardened: "100% on the strategies it had seen, 59 to 100% on unseen ones",
    reading:
      "The spread in the baseline row is the finding: one of these strategies walked past an untrained classifier almost every time. Retraining closes the seen cases completely, and the unseen floor is where the round actually ends.",
  },
  {
    id: "r2",
    n: 2,
    title: "Memory Reduction and Mimicry",
    evader: [
      {
        code: "E",
        name: "Minimal-memory training",
        what: "Hold as little in memory as the run can tolerate, so the memory footprint stops reading as training.",
      },
      {
        code: "F",
        name: "Interleaving",
        what: "Thread the training steps between other work.",
      },
      {
        code: "G",
        name: "Clock throttling",
        what: "Cap the clock so the card never reaches the rates a training run reaches.",
      },
      {
        code: "H",
        name: "FFT and mining mimicry",
        what: "Shape the load to resemble signal processing or cryptocurrency mining.",
      },
      {
        code: "I",
        name: "Stochastic control",
        what: "Randomise the load pattern.",
      },
      {
        code: "J",
        name: "PID control",
        what: "Hold the observable signal at a chosen setpoint with a feedback controller.",
      },
    ],
    question:
      "Six strategies at once, and two of them are shaped to look like a named non-AI workload. What do you add?",
    options: [
      {
        id: "retrain2",
        label: "Retrain again, on this round's traces",
        right: true,
        note: "Still the answer at this stage. Mimicry of a workload the monitor has samples of is a problem retraining can absorb.",
      },
      {
        id: "kernel",
        label: "Require an authenticated list of the CUDA kernels each process launched",
        right: false,
        note: "That is a different mechanism, not a telemetry feature, and it needs a trusted path into the software stack. The paper's classifier is deliberately content-agnostic.",
      },
      {
        id: "ban",
        label: "Treat any mining-shaped or FFT-shaped load on a covered accelerator as a violation",
        right: false,
        note: "A rule, not a measurement, and it converts every legitimate signal-processing job into a false positive.",
      },
    ],
    actual: "The monitor retrained an improved hardened classifier.",
    baseline: "0 to 91% against the baseline",
    hardened: "100% on seen strategies, 80 to 100% on unseen ones",
    reading:
      "A zero in the baseline row means one strategy was invisible to the untrained classifier. The unseen floor rose from 59 to 80%, so hardening generalised a little rather than only memorising.",
  },
  {
    id: "r3",
    n: 3,
    title: "Training Disguised as Inference",
    evader: [
      {
        code: "K",
        name: "Online learning",
        what: "Update the model continuously while serving, so the run never looks like a discrete training job.",
      },
      {
        code: "L",
        name: "Dilution",
        what: "Run training alongside 2, 5, 10 or 20 times as much genuine inference and let the inference dominate the trace.",
      },
    ],
    question:
      "Dilution is the move that breaks the pattern the classifier was reading. What do you measure instead?",
    options: [
      {
        id: "corr",
        label: "Power-and-memory correlation, plus cumulative energy over the window",
        right: true,
        note: "This is what the team added. Dilution hides the shape of the signal but not the total: the work still has to be paid for in joules, and the correlation between power and memory behaviour survives the mixing.",
      },
      {
        id: "peak",
        label: "Peak utilization inside each one-second window",
        right: false,
        note: "Dilution keeps peaks that are ordinary for inference. A peak statistic is exactly what mixing 20 parts inference into 1 part training is designed to defeat.",
      },
      {
        id: "variance",
        label: "Variance of the utilization trace alone",
        right: false,
        note: "Closer, but a single-channel statistic. The finding of this round is that the surviving signal is a relationship between channels, not a property of one.",
      },
    ],
    actual:
      "The monitor added power-and-memory correlation features and cumulative energy features.",
    baseline: "52 to 60% against the baseline, which is close to a coin toss",
    hardened:
      "100% on seen strategies, 87 to 100% on unseen ones, once the correlation and energy features were in",
    reading:
      "This is the round that matters for a treaty. Dilution took a working classifier down to roughly chance, and the recovery came from a feature that is about totals rather than shapes. That is the same quantity a compute meter is trying to hold, which is why 2.1.4 puts the meter and the classifier on the same page.",
  },
  {
    id: "r4",
    n: 4,
    title: "Composites and Multiple Cards",
    evader: [
      {
        code: "M",
        name: "Minimal-memory composite",
        what: "Combine the memory-minimal strategy with the rest of the toolkit.",
      },
      {
        code: "N",
        name: "Gradient-accumulation structuring",
        what: "Restructure the arithmetic so each visible step is smaller.",
      },
      {
        code: "O",
        name: "Idle padding",
        what: "Pad the run with idle time, swept from 0 to 95% idle.",
      },
      {
        code: "DDP",
        name: "Distributed data parallel",
        what: "Spread the same run across several cards, including staggered variants.",
      },
    ],
    question:
      "The run is now spread across cards and padded with idle time. What do you add?",
    options: [
      {
        id: "plateau",
        label: "Pre-allocation memory-plateau features, and multi-GPU traces in the training corpus",
        right: true,
        note: "This is what the team did. A training job reserves its memory up front and holds it, and that plateau persists through idle padding because the padding does not release the allocation.",
      },
      {
        id: "sum",
        label: "Sum the utilization of every card in the node and threshold the total",
        right: false,
        note: "Staggering is built against exactly this: the same total work, arranged so no summed window looks unusual.",
      },
      {
        id: "network",
        label: "Read the interconnect traffic between the cards",
        right: false,
        note: "Plausible, and it is what an off-chip design in 2.1.6 would reach for. It is not available to a zero-overhead NVML telemetry monitor, which is the constraint this study works under.",
      },
    ],
    actual:
      "The monitor retrained on multi-GPU data and added pre-allocation memory-plateau features.",
    baseline:
      "19 to 100% on single-GPU strategies and 72 to 100% on the multi-GPU variants",
    hardened: "100% across all of them",
    reading:
      "A round the monitor wins outright. Note what it cost: the monitor now needs traces from the same multi-card configuration the prover is running, which is an assumption about access, not about physics.",
  },
  {
    id: "r5",
    n: 5,
    title: "The White-Box Round",
    evader: [
      {
        code: "WB-D",
        name: "Diluted full-model fine-tuning",
        what: "Fine-tune the whole model, diluted into inference, with the classifier's own features in hand.",
      },
      {
        code: "WB-L",
        name: "Diluted LoRA fine-tuning",
        what: "Update a small adapter instead of the full model, diluted into inference.",
      },
      {
        code: "WB+N",
        name: "White box with gradient accumulation",
        what: "The same, restructured so each visible step is smaller again.",
      },
    ],
    question:
      "The evader now has the classifier and its features. What is left to the monitor?",
    options: [
      {
        id: "corpus",
        label: "Widen the corpus of genuine datacenter inference the classifier has seen",
        right: true,
        note: "This is what the team did, and it is the honest answer: against an adversary who holds your classifier, the remaining move is to know normal better, not to know the attack better.",
      },
      {
        id: "secret",
        label: "Keep the feature set secret",
        right: false,
        note: "A treaty classifier is inspected by the party it is used against, so its features are known by construction. Secrecy is not available here, which is why the white-box round is the one that counts.",
      },
      {
        id: "more",
        label: "Retrain on the white-box traces, as in rounds 1, 2 and 4",
        right: false,
        note: "It works on the strategies you collected, which reach 100%, and that is not the number to quote. The unseen white-box strategies are what the range below reports.",
      },
    ],
    actual:
      "The monitor collected additional non-adversarial datacenter inference examples.",
    baseline: "100% on the white-box strategies the monitor had seen",
    hardened:
      "43 to 87% on unseen white-box strategies. In the paper's leave-one-strategy-out evaluation, diluted LoRA fine-tuning is detected 42.6% of the time and full-model fine-tuning 87.4%",
    reading:
      "The sequence ends here, unsolved. A small adapter, updated inside a genuine inference service, by an operator who knows how the monitor works, is detected less often than a coin toss in the paper's own leave-one-out evaluation. Nothing in rounds 1 to 4 recovers it.",
  },
];

export const ASSUMPTION =
  "The whole sequence assumes the operator cannot tamper with the NVML readings or the performance counters, and cannot inject synthetic telemetry. The authors say so directly: those guarantees require a hardware-enabled mechanism for tamper-resistant telemetry and an authenticated channel. Neither exists in a deployed product.";

export const LIMITS = [
  "Single-node configurations, up to eight accelerators. Frontier-scale multi-node clusters were not tested.",
  "NVIDIA cards released since 2020. No AMD, no Huawei, no custom silicon such as Google TPUs.",
  "Evasion implemented at framework level in PyTorch. Custom low-level kernels were not covered.",
  "Model sizes bounded by memory: up to 70B parameters for training, 671B mixture-of-experts for inference.",
];

export const CLOSING_FIELDS = [
  {
    id: "observation",
    label: "Observation",
    q: "What did the experiment measure?",
    model:
      "Temporal NVML telemetry from nine NVIDIA GPU models over five rounds of monitor-evader iteration and twenty evasion strategy families, scored as binary training-or-not classification: 98.2% across the whole corpus, 43 to 87% against unseen adversarially disguised workloads in the final round.",
  },
  {
    id: "inference",
    label: "Supported inference",
    q: "What conclusion is justified inside that setting?",
    model:
      "Training leaves temporal signatures that survive a substantial adversarial effort to remove them, on single-node NVIDIA hardware, when the telemetry itself is trustworthy and the monitor can retrain on traces from the same configuration.",
  },
  {
    id: "leap",
    label: "Unsupported policy leap",
    q: "What stronger claim would exceed the evidence?",
    model:
      "That workload classification can establish, against a state-backed owner, that no prohibited training occurred on a frontier multi-node cluster. The study is a component demonstration on up to eight cards, with the tamper-resistance of its own input assumed rather than shown.",
  },
  {
    id: "deps",
    label: "Deployment dependencies",
    q: "What else would have to exist?",
    model:
      "Tamper-resistant telemetry rooted in hardware, an authenticated channel to the verifier, protected monitoring software, aggregation rules across cards and time, coverage of non-NVIDIA and legacy hardware, and an institution with authority to act on a classifier output that is sometimes wrong.",
  },
];
