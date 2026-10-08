import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Copy, Download, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPERIENCE_TIERS, type ExperienceTier } from "@/lib/jobs/matching";
import { cn } from "@/lib/utils";

const INDUSTRIES = ["Real Estate", "Construction & Trades", "Financial Services", "Retail & E-commerce", "Legal Services", "Healthcare & Wellness", "Coaching & Consulting", "Marketing & Creative", "Technology & SaaS", "Professional Services", "Education & Online Training", "Hospitality & Events", "Insurance & Risk", "Nonprofit & Associations", "Personal Administration"];
const SKILL_SUGGESTIONS = ["Calendar Management", "Email Management", "CRM", "Lead Generation", "Social Media", "Bookkeeping", "Customer Service", "Transaction Coordination", "Canva", "Data Entry"];
const DURATION_OPTIONS = ["Temporary / project-based", "3–6 months", "6–12 months", "Long-term / ongoing", "Not sure yet"];

function ListEditor({ label, items, setItems, placeholder }: { label: string; items: string[]; setItems: (value: string[]) => void; placeholder: string }) {
  const [value, setValue] = useState("");
  const add = () => {
    const next = value.trim();
    if (next) setItems([...items, next]);
    setValue("");
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={value} placeholder={placeholder} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), add())} />
        <Button type="button" variant="outline" size="icon" onClick={add} aria-label={`Add ${label}`}><Plus className="h-4 w-4" /></Button>
      </div>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-1.5 text-sm">
            {item}
            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${item}`}><X className="h-3.5 w-3.5" /></Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SelectField({ label, value, onValueChange, options }: { label: string; value: string; onValueChange: (value: string) => void; options: string[] }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

export function JobDescriptionBuilder({ compact }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Executive Virtual Assistant");
  const [department, setDepartment] = useState("Operations");
  const [industry, setIndustry] = useState("Professional Services");
  const [duration, setDuration] = useState("Long-term / ongoing");
  const [tasks, setTasks] = useState(["Manage daily calendar and meetings", "Triage inbox and draft replies"]);
  const [responsibilities, setResponsibilities] = useState(["Keep CRM records up to date", "Coordinate with clients and vendors"]);
  const [deliverables, setDeliverables] = useState(["Weekly priorities and follow-up report"]);
  const [requiredSkills, setRequiredSkills] = useState(["Calendar Management", "Email Management"]);
  const [preferredSkills, setPreferredSkills] = useState(["CRM"]);
  const [skillInput, setSkillInput] = useState("");
  const [tools, setTools] = useState("Google Workspace, Slack, HubSpot");
  const [certification, setCertification] = useState("");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Eastern");
  const [coverage, setCoverage] = useState("Standard business hours");
  const [hours, setHours] = useState(40);
  const [communication, setCommunication] = useState("Slack");
  const [checkIns, setCheckIns] = useState("Daily summary");
  const [workStyle, setWorkStyle] = useState("Proactive");
  const [startDate, setStartDate] = useState("2026-11-02");
  const [tier, setTier] = useState<ExperienceTier>("intermediate");
  const tierDefinition = EXPERIENCE_TIERS[tier];

  const addSkill = (skill: string, preferred = false) => {
    const next = skill.trim();
    if (!next) return;
    const setSkills = preferred ? setPreferredSkills : setRequiredSkills;
    const current = preferred ? preferredSkills : requiredSkills;
    if (!current.includes(next)) setSkills([...current, next]);
    setSkillInput("");
  };
  const toolList = tools.split(",").map((tool) => tool.trim()).filter(Boolean);
  const complete = Boolean(title && industry && tasks.length && responsibilities.length && requiredSkills.length && timezone && coverage && hours);

  const text = useMemo(() => [
    `${title} — ${department}`,
    `Industry: ${industry} · Duration: ${duration}`,
    `Experience: ${tierDefinition.label} (${tierDefinition.experience})`,
    `Start date: ${startDate}`,
    "",
    tierDefinition.blurb,
    "",
    "Key Tasks:", ...tasks.map((item) => `• ${item}`),
    "", "Responsibilities:", ...responsibilities.map((item) => `• ${item}`),
    "", "Expected Outcomes:", ...deliverables.map((item) => `• ${item}`),
    "", `Required Skills: ${requiredSkills.join(", ")}`,
    `Preferred Skills: ${preferredSkills.join(", ") || "None specified"}`,
    `Software & Tools: ${tools}`,
    `Certification: ${certification || "No preference"}`,
    `Language: ${language}`,
    "", `Schedule: ${coverage}, ${timezone} · ${hours} hrs/week`,
    `Communication: ${communication} · Updates: ${checkIns}`,
    `Work style: ${workStyle}`,
  ].join("\n"), [title, department, industry, duration, tierDefinition, startDate, tasks, responsibilities, deliverables, requiredSkills, preferredSkills, tools, certification, language, coverage, timezone, hours, communication, checkIns, workStyle]);

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.replace(/\s+/g, "-").toLowerCase()}-jd.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("grid grid-cols-1 gap-6", !compact && "xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]")}>
      <div className="space-y-5">
        <Card>
          <CardHeader><CardTitle>1. Role basics</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Job title</Label><Input value={title} onChange={(event) => setTitle(event.target.value)} /></div>
            <div className="space-y-2"><Label>Department / team</Label><Input value={department} onChange={(event) => setDepartment(event.target.value)} /></div>
            <SelectField label="Area of support" value={industry} onValueChange={setIndustry} options={INDUSTRIES} />
            <SelectField label="Role duration" value={duration} onValueChange={setDuration} options={DURATION_OPTIONS} />
            <div className="space-y-2 sm:col-span-2">
              <Label>Experience tier</Label>
              <div className="grid gap-3 md:grid-cols-3">
                {(Object.keys(EXPERIENCE_TIERS) as ExperienceTier[]).map((key) => {
                  const definition = EXPERIENCE_TIERS[key];
                  return <Button key={key} type="button" variant="outline" onClick={() => setTier(key)} className={cn("h-auto min-h-28 flex-col items-start justify-start whitespace-normal p-4 text-left", tier === key && "border-primary bg-primary/5 ring-1 ring-primary")}><span className="font-semibold">{definition.label}</span><span className="text-xs font-medium text-primary">{definition.experience}</span><span className="mt-1 text-xs text-muted-foreground">{definition.description}</span></Button>;
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. Work scope</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <ListEditor label="Task areas" items={tasks} setItems={setTasks} placeholder="e.g. Schedule client meetings" />
            <ListEditor label="Responsibilities" items={responsibilities} setItems={setResponsibilities} placeholder="e.g. Own weekly reporting" />
            <ListEditor label="Expected deliverables / outcomes" items={deliverables} setItems={setDeliverables} placeholder="e.g. Inbox cleared daily" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>3. Requirements</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Required skills</Label>
              <div className="flex gap-2"><Input value={skillInput} placeholder="Type a required skill" onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addSkill(skillInput))} /><Button type="button" variant="outline" size="icon" onClick={() => addSkill(skillInput)} aria-label="Add required skill"><Plus className="h-4 w-4" /></Button></div>
              <div className="flex flex-wrap gap-1.5">{requiredSkills.map((skill) => <Badge key={skill} className="gap-1">{skill}<Button type="button" variant="ghost" size="icon" className="h-4 w-4 text-primary-foreground" onClick={() => setRequiredSkills(requiredSkills.filter((item) => item !== skill))} aria-label={`Remove ${skill}`}><X className="h-3 w-3" /></Button></Badge>)}</div>
              <div className="flex flex-wrap gap-1.5">{SKILL_SUGGESTIONS.filter((skill) => !requiredSkills.includes(skill)).slice(0, 7).map((skill) => <Button key={skill} type="button" size="sm" variant="outline" className="h-7 border-dashed text-xs" onClick={() => addSkill(skill)}>+ {skill}</Button>)}</div>
            </div>
            <ListEditor label="Preferred skills" items={preferredSkills} setItems={setPreferredSkills} placeholder="Helpful, but not required" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2"><Label>Software and tools</Label><Input value={tools} onChange={(event) => setTools(event.target.value)} /></div>
              <div className="space-y-2"><Label>Certification or credential</Label><Input value={certification} placeholder="No preference" onChange={(event) => setCertification(event.target.value)} /></div>
              <div className="space-y-2"><Label>Language requirement</Label><Input value={language} onChange={(event) => setLanguage(event.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>4. Work style</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Operating time zone</Label><Input value={timezone} onChange={(event) => setTimezone(event.target.value)} /></div>
            <SelectField label="Preferred coverage" value={coverage} onValueChange={setCoverage} options={["Standard business hours", "Early hours", "Evening coverage", "Flexible / split shifts"]} />
            <div className="space-y-2"><Label>Hours per week</Label><Input type="number" min={10} max={60} value={hours} onChange={(event) => setHours(Number(event.target.value))} /></div>
            <SelectField label="Day-to-day communication" value={communication} onValueChange={setCommunication} options={["Email", "Slack", "Phone", "Zoom / video calls", "Text / WhatsApp", "Project management platform"]} />
            <SelectField label="Check-ins and updates" value={checkIns} onValueChange={setCheckIns} options={["Daily summary", "Twice weekly check-in", "Weekly sync meeting", "As-needed updates only"]} />
            <SelectField label="Preferred work style" value={workStyle} onValueChange={setWorkStyle} options={["Proactive", "Reactive", "Combination"]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>5. Timing</CardTitle></CardHeader>
          <CardContent><div className="max-w-sm space-y-2"><Label>Ideal start date</Label><Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></div></CardContent>
        </Card>
      </div>

      <Card className="h-fit xl:sticky xl:top-20">
        <CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle>Job description preview</CardTitle><Badge variant={complete ? "secondary" : "outline"} className="gap-1"><CheckCircle2 className="h-3.5 w-3.5" />{complete ? "Ready" : "Needs details"}</Badge></CardHeader>
        <CardContent className="space-y-4">
          <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap rounded-lg bg-muted/60 p-4 font-sans text-sm leading-relaxed">{text}</pre>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { void navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); }}><Copy className="mr-1.5 h-4 w-4" />Copy</Button>
            <Button variant="outline" onClick={download}><Download className="mr-1.5 h-4 w-4" />Download</Button>
            <Button disabled={!complete} onClick={() => {
              toast.success("Structured job filters applied", { description: `${requiredSkills.length} required skills · ${tierDefinition.label}` });
              navigate({ to: "/marketplace", search: { title, industry, tier, requiredSkills, preferredSkills, responsibilities, deliverables, tools: toolList, timezone, availabilityHours: coverage, workStyle, language, certification } });
            }}><Search className="mr-1.5 h-4 w-4" />Find matching candidates</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}