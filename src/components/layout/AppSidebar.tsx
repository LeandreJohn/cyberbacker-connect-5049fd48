import { Link, useRouterState } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navGroups } from "./nav-config";
import wordmarkDark from "@/assets/cyberbacker-mark-dark.png.asset.json";
import wordmarkLight from "@/assets/cyberbacker-logo-light.png.asset.json";

export function AppSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link
          to="/"
          onClick={() => isMobile && setOpenMobile(false)}
          className="flex items-center gap-2.5 px-1 py-1.5"
        >
          {collapsed ? (
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-powder text-sm font-bold text-powder-foreground">
              CB
            </span>
          ) : (
            <>
              <img
                src={wordmarkDark.url}
                alt="Cyberbacker"
                className="h-7 w-auto dark:hidden"
              />
              <img
                src={wordmarkLight.url}
                alt="Cyberbacker"
                className="hidden h-9 w-auto dark:block"
              />
            </>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.to)}
                      tooltip={item.title}
                    >
                      <Link
                        to={item.to}
                        onClick={() => isMobile && setOpenMobile(false)}
                        className="flex items-center gap-2.5"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
