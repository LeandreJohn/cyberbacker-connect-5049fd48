import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Copy, Download, GraduationCap, Plus, Rocket, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Tier = "trainable" | "experienced";

const TIERS: Record<Tier, { label: string; desc: string; exp: string; rate: string; icon: typeof Rocket; blurb: string }> = {
  trainable: {
    label: "Trainable / Entry",
    desc: "Has the fundamentals — you'll provide training on your processes.",
    exp: "0–2 years",
    rate: "$9–$12 / hr",
    icon: GraduationCap,
    blurb: "We're looking for a motivated, coachable professional eager to learn our systems. Full training will be provided.",
  },
  experienced: {
    label: "Experienced / Plug-and-play",
    desc: "Ready from day one — no training required.",
    exp: "3+ years",
    rate: "$14–$20 / hr",
    icon: Rocket,
    blurb: "We need a seasoned professional who can hit the ground running and independently own these responsibilities from day one.",
  },
};

const SKILL_SUGGESTIONS = ["Calendar Management", "Email Management", "CRM", "Lead Generation", "Social Media", "Bookkeeping", "Customer Service", "Transaction Coordination", "Canva", "Data Entry"];

function ListEditor({ label, items, setItems, placeholder }: { label: string; items: string[]; setItems: (v: string[]) => void; placeholder: string }) {
  const [v, setV] = useState("");
  const add = () => { if (v.trim()) { setItems([...items, v.trim()]); setV(""); } };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} />
        <Button type="button" variant="outline" size="icon" onClick={add} aria-label={`Add ${label}`}><Plus className="h-4 w-4" /></Button>
      </div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-1.5 text-sm">
            {it}
            <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label="Remove"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobDescriptionBuilder({ compact }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Executive Virtual Assistant");
  const [department, setDepartment] = useState("Operations");
  const [tasks, setTasks] = useState(["Manage daily calendar and meetings", "Triage inbox and draft replies"]);
  const [resp, setResp] = useState(["Keep CRM records up to date", "Coordinate with clients and vendors"]);
  const [skills, setSkills] = useState<string[]>(["Calendar Management", "Email Management", "CRM"]);
  const [skillInput, setSkillInput] = useState("");
  const [tools, setTools] = useState("Google Workspace, Slack, HubSpot");
  const [schedule, setSchedule] = useState("Mon–Fri, 9am–5pm EST");
  const [hours, setHours] = useState(40);
  const [tier, setTier] = useState<Tier>("trainable");
  const t = TIERS[tier];

  const addSkill = (s: string) => { const x = s.trim(); if (x && !skills.includes(x)) setSkills([...skills, x]); setSkillInput(""); };

  const text = useMemo(() => [
    `${title} (${department})`,
    `Level: ${t.label} · Experience: ${t.exp} · Est. rate: ${t.rate}`,
    `Schedule: ${schedule} · ${hours} hrs/week`,
    "",
    t.blurb,
    "",
    "Key Tasks:", ...tasks.map((x) => `• ${x}`),
    "",
    "Responsibilities:", ...resp.map((x) => `• ${x}`),
    "",
    `Required Skills: ${skills.join(", ")}`,
    `Tools: ${tools}`,
  ].join("\n"), [title, department, t, schedule, hours, tasks, resp, skills, tools]);

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url; a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-jd.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("grid grid-cols-1 gap-6", !compact && "xl:grid-cols-2")}>
      <Card>
        <CardHeader><CardTitle>Role details</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Job title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></div>
          </div>

          <div className="space-y-2">
            <Label>Candidate tier</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(TIERS) as Tier[]).map((k) => {
                const T = TIERS[k];
                return (
                  <button key={k} type="button" onClick={() => setTier(k)}
                    className={cn("rounded-xl border p-4 text-left transition-colors", tier === k ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-accent")}>
                    <T.icon className="mb-2 h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold">{T.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{T.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <ListEditor label="Tasks" items={tasks} setItems={setTasks} placeholder="e.g. Schedule property showings" />
          <ListEditor label="Responsibilities" items={resp} setItems={setResp} placeholder="e.g. Own weekly reporting" />

          <div className="space-y-2">
            <Label>Required skills</Label>
            <Input value={skillInput} placeholder="Type a skill and press Enter" onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))} />
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <Badge key={s} className="gap-1">{s}<button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} aria-label={`Remove ${s}`}><X className="h-3 w-3" /></button></Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 6).map((s) => (
                <button key={s} type="button" onClick={() => addSkill(s)} className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent">+ {s}</button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-3"><Label>Tools</Label><Input value={tools} onChange={(e) => setTools(e.target.value)} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Schedule / time zone</Label><Input value={schedule} onChange={(e) => setSchedule(e.target.value)} /></div>
            <div className="space-y-2"><Label>Hours / week</Label><Input type="number" min={5} max={60} value={hours} onChange={(e) => setHours(Number(e.target.value))} /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit xl:sticky xl:top-20">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Preview</CardTitle>
          <Badge variant="secondary">{t.label}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-lg bg-muted/60 p-4 font-sans text-sm leading-relaxed">{text}</pre>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { void navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); }}><Copy className="mr-1.5 h-4 w-4" />Copy</Button>
            <Button variant="outline" onClick={download}><Download className="mr-1.5 h-4 w-4" />Download</Button>
            <Button
              onClick={() => {
                toast.success("Filters applied from your job description", {
                  description: `${skills.length} skill${skills.length === 1 ? "" : "s"} · ${t.label}`,
                });
                navigate({
                  to: "/marketplace",
                  search: {
                    title,
                    skills,
                    tier,
                    kw: [...tasks, ...resp].join(" "),
                  },
                });
              }}
            >
              <Search className="mr-1.5 h-4 w-4" />Find matching candidates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
