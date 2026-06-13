import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Database, ScrollText, ShieldCheck, UserPlus, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { StatusBadge, toneFor } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { q } from "@/lib/data/queries";

export const Route = createFileRoute("/_app/internal/admin")({
  head: () => ({
    meta: [
      { title: "System Administration — Cyberbacker" },
      { name: "description", content: "Manage users, roles, audit logs and platform settings." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(q.systemUsers());
    context.queryClient.ensureQueryData(q.auditLog());
  },
  component: Administration,
});

const roles = [
  "Client",
  "Recruiter",
  "Facilitator",
  "Support Agent",
  "Finance Team",
  "Administrator",
  "Executive",
];

function Administration() {
  const { data: users } = useSuspenseQuery(q.systemUsers());
  const { data: audit } = useSuspenseQuery(q.auditLog());
  const activeUsers = users.filter((u) => u.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration"
        description="Users, roles, audit trail and platform configuration"
        actions={
          <Button>
            <UserPlus className="mr-1.5 h-4 w-4" /> Invite user
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Users" value={String(users.length)} icon={Users} />
        <StatCard label="Active" value={String(activeUsers)} icon={ShieldCheck} hint="enabled accounts" />
        <StatCard label="Roles" value={String(roles.length)} icon={ShieldCheck} />
        <StatCard label="System Health" value="99.98%" icon={Database} hint="uptime · 30d" />
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last active</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <InitialsAvatar
                              initials={u.name.split(" ").map((n) => n[0]).join("")}
                              size="sm"
                            />
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{u.lastActive}</TableCell>
                        <TableCell className="text-right">
                          <StatusBadge label={u.status} tone={toneFor(u.status)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {roles.map((role) => (
              <Card key={role} className="shadow-card">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-base">{role}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>{users.filter((u) => u.role === role).length} users assigned</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage permissions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-muted-foreground" /> Activity audit trail
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audit.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.actor}</TableCell>
                        <TableCell>{a.action}</TableCell>
                        <TableCell className="text-muted-foreground">{a.resource}</TableCell>
                        <TableCell className="text-muted-foreground tabular-nums">{a.time}</TableCell>
                        <TableCell className="text-right text-muted-foreground tabular-nums">
                          {a.ip}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
