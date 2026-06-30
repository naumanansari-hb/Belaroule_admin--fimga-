import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  Gift,
  CreditCard,
  Flag,
  Brain,
  FileText,
  BarChart3,
  Building2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { getNavigationData } from "../../mockAPI/navigationData";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "./hb/listing";

// Color themes for each section
const sectionColors: Record<string, {
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  hoverBg: string;
}> = {
  home: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
    hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900',
  },
  'user-management': {
    bg: 'bg-purple-50 dark:bg-purple-950',
    border: 'border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400',
    hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-900',
  },
  'master-management': {
    bg: 'bg-slate-50 dark:bg-slate-950',
    border: 'border-slate-200 dark:border-slate-800',
    iconBg: 'bg-slate-100 dark:bg-slate-900',
    iconColor: 'text-slate-600 dark:text-slate-400',
    hoverBg: 'hover:bg-slate-100 dark:hover:bg-slate-900',
  },
  'rewards-payments': {
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
    iconColor: 'text-amber-600 dark:text-amber-400',
    hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-900',
  },
  'content-moderation': {
    bg: 'bg-teal-50 dark:bg-teal-950',
    border: 'border-teal-200 dark:border-teal-800',
    iconBg: 'bg-teal-100 dark:bg-teal-900',
    iconColor: 'text-teal-600 dark:text-teal-400',
    hoverBg: 'hover:bg-teal-100 dark:hover:bg-teal-900',
  },
  'flagged-content-management': {
    bg: 'bg-rose-50 dark:bg-rose-950',
    border: 'border-rose-200 dark:border-rose-800',
    iconBg: 'bg-rose-100 dark:bg-rose-900',
    iconColor: 'text-rose-600 dark:text-rose-400',
    hoverBg: 'hover:bg-rose-100 dark:hover:bg-rose-900',
  },
  'prompt-management': {
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    border: 'border-indigo-200 dark:border-indigo-800',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    hoverBg: 'hover:bg-indigo-100 dark:hover:bg-indigo-900',
  },
  'bca-bcc-management': {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-200 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    hoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-900',
  },
  configuration: {
    bg: 'bg-cyan-50 dark:bg-cyan-950',
    border: 'border-cyan-200 dark:border-cyan-800',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    hoverBg: 'hover:bg-cyan-100 dark:hover:bg-cyan-900',
  },
  reports: {
    bg: 'bg-violet-50 dark:bg-violet-950',
    border: 'border-violet-200 dark:border-violet-800',
    iconBg: 'bg-violet-100 dark:bg-violet-900',
    iconColor: 'text-violet-600 dark:text-violet-400',
    hoverBg: 'hover:bg-violet-100 dark:hover:bg-violet-900',
  },
};

interface SiteMapProps {
  onNavigate?: (pageId: string) => void;
}

export default function SiteMap({ onNavigate }: SiteMapProps) {
  const { user } = useAuth();
  const userRole = user?.role || 'super-admin';
  const isUserSuperAdmin = userRole === 'super-admin';

  // Get navigation data with the onNavigate function
  const menuItems = getNavigationData("site-map", onNavigate || (() => {}));

  // Filter menu items based on super admin status
  const filteredMenuItems = menuItems
    .filter((menuItem) => {
      if (menuItem.superAdminOnly && !isUserSuperAdmin) {
        return false;
      }
      return true;
    })
    .map((menuItem) => {
      if (menuItem.subItems) {
        return {
          ...menuItem,
          subItems: menuItem.subItems.filter((subItem) => {
            if (subItem.superAdminOnly && !isUserSuperAdmin) {
              return false;
            }
            return true;
          }),
        };
      }
      return menuItem;
    });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Content Container */}
      <div className="p-6">
        {/* Page Header */}
        <PageHeader
          title="Site Map"
          subtitle="Navigate through all available modules and features"
          breadcrumbs={[
            { label: "Home", onClick: () => {} },
            { label: "Site Map", current: true },
          ]}
        />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((menuItem) => {
              const Icon = menuItem.icon;
              const colors = sectionColors[menuItem.id] || sectionColors.home;
              
              return (
                <div
                  key={menuItem.id}
                  className={`${colors.bg} ${colors.border} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}
                >
                  {/* Menu Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${colors.iconBg} w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">
                        {menuItem.label}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {menuItem.subItems?.length || 0} {menuItem.subItems?.length === 1 ? 'module' : 'modules'}
                      </p>
                    </div>
                  </div>

                  {/* Sub Items */}
                  {menuItem.subItems && menuItem.subItems.length > 0 && (
                    <div className="space-y-1">
                      {menuItem.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={subItem.onClick}
                          className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg ${colors.hoverBg} transition-colors group text-left`}
                        >
                          <ChevronRight className={`w-4 h-4 ${colors.iconColor} flex-shrink-0 transition-transform group-hover:translate-x-1`} />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                            {subItem.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Role Information Banner */}
          <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-100 dark:bg-primary-900 w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-1">
                  Current Role: {userRole === 'super-admin' ? 'Super Admin' : 'Sub Admin'}
                </h4>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  {userRole === 'super-admin'
                    ? 'You have full access to all modules including Super Admin exclusive features.'
                    : 'Your access is based on role permissions. Some modules may be restricted or hidden.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}