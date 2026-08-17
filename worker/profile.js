// GENERATED from index.html by make_profile.py — do not edit by hand.
export default `## Who I am
I'm Muhammad Waseem — 22, from Pakistan. I run a small security
lab out of my bedroom and point machine learning at the logs it
produces.

Practically that means two halves that keep meeting: attacking my own network so
I know what an intrusion looks like from the inside, and then building detection
for it. I'm applying to study AI and cyber security in Korea on the Global Korea
Scholarship.

## How I got started
I bricked the family router at sixteen and spent a week working out why. The router
came back. What stayed was the habit of taking something apart until I understood
the failure, not just the fix.

The lab I built afterwards produces far more log data than I can read, which is
how I ended up in machine learning. Writing detection rules only catches what you
already thought of. A model that has learned what normal looks like can flag the
thing you didn't.

## The home lab
Modest, and entirely mine to break:

pfSense at the edge, so I control routing and can watch traffic
leave
A three-host Windows domain — DC, member server, workstation
A Kali box I use to attack the domain
Zeek, Sysmon and Wazuh recording
everything, which is the part that actually matters

The point isn't the hardware. It's that every attack I run leaves evidence I then
have to go and find.

## The projects
Four documented records, each written as question → method → result:

Lab 01 — an Isolation Forest that learned my network's normal
traffic and caught a beacon it was never labelled for
Lab 02 — walked my own Active Directory to Domain Admin, then
wrote the detections that should have caught it
Lab 03 — rebuilt an intrusion timeline a week cold, using only
what the SIEM had kept
Lab 04 — a phishing URL classifier where the evaluation, not
the model, turned out to be the finding

Everything is sanitised. No flags, no credentials, no unredacted addresses.

## Lab 01 — anomaly detection
I wanted to know whether an unsupervised model could flag beaconing traffic I had
never labelled for it.

Two weeks of Zeek connection logs, features engineered for interval regularity and
payload-size variance, then an Isolation Forest fitted on them and a real beacon run
through it.

It caught the beacon — and flagged my own nightly backup job as well. Tuning
out that false positive taught me more than the detection did. Base rates
matter more than model choice, and that lesson came back in Lab 04.

## Lab 02 — Active Directory
The question: starting from one ordinary domain user, how far could I get before
anything in the lab logged it?

I collected the graph with BloodHound, Kerberoasted a service account with a weak
password, and moved to the file server. Then I replayed the identical path with
Sysmon and Wazuh recording.

Four steps to Domain Admin, and only two of them produced an alert under
the default configuration. I wrote the Sigma rules for the other two — that
part is what was worth keeping.

## Lab 03 — incident response
I ran a scripted intrusion against the lab, left it a week, then tried to reconstruct
the timeline using only what the pipeline had retained — no memory of what I'd run.

Initial access and persistence came back cleanly. Lateral movement was
completely invisible — Sysmon Event ID 3 was never being forwarded.

Fixing the pipeline mattered more than any rule I could have written on top of it.
You cannot detect what you never collected.

## Lab 04 — phishing classifier
How much of a phishing URL is detectable from its text alone — no page fetch, no
reputation feed?

Lexical features (length, character entropy, subdomain depth, token counts, TLD)
over a public corpus, then logistic regression against gradient boosting, compared on
precision-recall rather than accuracy.

0.96 accuracy on a balanced split, which is meaningless. Re-weighted to the
prevalence a real mail gateway sees, precision collapsed. The model was fine.
The evaluation was the finding.

## Machine learning
Applied rather than theoretical, and pointed at one problem: detection.

Anomaly detection — Isolation Forest, and why unsupervised is the honest choice
when you have no labels
Feature engineering on logs, which is most of the actual work
scikit-learn, pandas, numpy
Model evaluation at a realistic base rate, not a balanced test split

I'm not going to claim depth I don't have. I want the degree precisely because the
theory underneath this is where I'm thinnest.

## Defensive skills
Log analysis, SIEM rule writing, threat hunting and packet analysis — Wazuh, Sysmon,
Zeek and Wireshark in practice.

This is the half I'm strongest in and the half I want to build a career on. Lab 02
and Lab 03 both ended in a defensive deliverable rather than an exploit, which was
the point.

## Offensive skills
Enumeration, web exploitation, privilege escalation and writing it up — Nmap, Burp
Suite, BloodHound, and the TryHackMe path work behind them.

I attack my own network so I understand the evidence it leaves. I'm not aiming at a
red-team career; I want to be a defender who knows what the other side actually does.

## Foundations
Linux administration, TCP/IP networking, Python and Bash. Unglamorous and
non-negotiable — every one of the four labs failed at some point for a reason that
turned out to be networking rather than security.

## Toolset
Python, scikit-learn and pandas on the modelling side. Wireshark, Zeek, Wazuh and
Sysmon on the telemetry side. Nmap, Burp Suite and BloodHound when I'm the one
attacking. Linux underneath all of it.

## Certifications
Three, and each one links to a record that can be checked independently:

CompTIA Security+ (SY0-701) — 2025
Google Cybersecurity Certificate, Coursera — 2024
SOC Level 1 pathway, TryHackMe — 2025

I'd rather have three that survive verification than a longer list that doesn't.

## Why Korea
Because in the departments I'm applying to, security research and applied AI sit
together rather than in separate buildings. That seam — a model that has to hold up
as a detection, not just as a benchmark score — is exactly where my own lab
work keeps falling.

Korea also has the industry density to make the applied half real: there is
somewhere to actually go after the degree.

## Universities
Two:

Korea University Sejong — Department of AI Cyber Security
(인공지능사이버보안학과). The closer fit for the anomaly-detection research I
want to do.
Konyang University — Department of Smart Security
(스마트보안학과). The more applied of the two; its industry placement is the
part I'd use hardest.

Both teach entirely in Korean, which is why the language year comes first.

## The scholarship
I'm applying to the Global Korea Scholarship for undergraduate study,
2027 intake, embassy track.

The structure is one year of Korean language study followed by four years of the
degree. This site isn't part of the submission — GKS doesn't accept extra documents.
It exists for the interview.

## Korean language
Learning, and not yet where I need to be — I'd rather say that than inflate it.
한국에서 정보보안을 공부하고 싶습니다.

Both target departments require TOPIK 3 for admission after the
language year, so that's the concrete target the first year is built around.

## After graduating
Three or four years in a SOC somewhere under genuine load — long enough to learn what
detection actually costs at scale, rather than what it costs in a bedroom lab.

Then back to Pakistan to teach it. There are organisations at home running enough
infrastructure to need real detection engineering and very few people trained to
build it. A detection-engineering curriculum in Urdu doesn't exist.
I'm not convinced it should stay that way.

## The role I want
Detection-side. SOC analyst first, detection engineer after — the work where you own
both the telemetry and the rules written on top of it.

The machine learning is in service of that, not separate from it. I'm not looking to
be a data scientist who happens to work on security data.

## Strengths and gaps
What I'm good at: not stopping at the fix. Every one of the four records ends in
something I got wrong and then chased down — a false positive, a missing event ID, a
metric that flattered the model.

Where I'm thin: the theory under the machine learning. I can fit a model and
evaluate it honestly; I can't yet derive why one converges and another doesn't.
That gap is the reason I'm applying, not something I'm hiding from the
panel.

## Contact
Email is best: muhammad.waseem.study1@gmail.com.

LinkedIn, GitHub and TryHackMe are all linked at the bottom of the page. Happy to
talk about any specific finding in more detail — including the ones that didn't
work.

## CV
There's a CV download button at the top of the page. If you need the full document
set — transcripts, certificates, write-ups — email me and I'll send it across.

## This site
One HTML file, no build step, no framework, no dependencies beyond a webfont.
The hero is a real layered classifier — signed edge weights, a forward pass, periodic
detections on the output layer — not a video.

This chat runs entirely in your browser against a written profile. No model, no
server, no key. An API key in client-side source is a key anyone can spend.

## About this assistant
Not an LLM. I'm a small retrieval script matching your question against answers
Muhammad wrote for this page, then typing them out.

That means I can't improvise. If I don't have something, I'll say so rather than
invent it — which is the whole reason it was built this way.

## What I would bring to a lab
Four labs I designed, ran and wrote up without supervision — including the parts
that failed. I built the attack, the detection and the evaluation for each, so I am
used to owning a question end to end.

Specifically: I already treat false-positive cost and base rates as first-class,
which is the habit most junior work lacks. And I document — every project here has a
stated question, method and result, including the results that embarrassed me.

## Working independently
Everything on this page was self-directed. Nobody set the questions, marked the
work, or told me the phishing classifier was being evaluated wrongly — I found that
by testing it at a realistic base rate instead of a balanced one.

The limit I have hit is not motivation, it is scale: one bedroom network, no peer
review, and no adversary who is not me. That is what I am applying for.

## Ethics and scope
Every attack described here ran against hardware I own, on a network I own, in an
isolated lab. No third-party system, no production network, no target that was not
mine.

That boundary is not a formality in this field — it is the difference between a
security researcher and a defendant. If I found something in someone else's system I
would report it and stop.

## Start date and timeline
Both target departments admit for the March intake. The GKS route
is one funded year of Korean language study first, then four years of the degree —
five years in total.

Neither department allows skipping the language year, so the degree itself would
begin the March after the language programme finishes.

## What I cannot do yet
Named honestly, because a supervisor will find them anyway.

Scale. Everything I have tested ran on three hosts. I do not know
how my assumptions hold at real traffic volume.

Adversarial ML. My models catch attacks I wrote myself. They have
never faced someone trying to evade them on purpose.

Formal method. I learned by building. I have not been taught to
design an experiment properly, and it showed in how I used to evaluate.
`;
