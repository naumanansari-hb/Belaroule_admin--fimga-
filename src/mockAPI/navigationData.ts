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
  User,
  Map,
  UserCog,
  UsersRound,
  Shapes,
  Baby,
  Shirt,
  DollarSign,
  History,
  MessageSquare,
  Palette,
  Layers,
  Building2,
  AlertTriangle,
  Award,
  Mail,
} from "lucide-react";

export interface SubMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
  superAdminOnly?: boolean;
  isGroup?: boolean;
  children?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  onClick?: () => void;
  active?: boolean;
  subItems?: SubMenuItem[];
  superAdminOnly?: boolean;
}

export const getNavigationData = (
  currentPage: string = "dashboard",
  onNavigate: (pageId: string) => void = () => {},
): MenuItem[] => {
  return [
    // Home
    {
      id: "home",
      label: "Home",
      icon: LayoutDashboard,
      subItems: [
        {
          id: "dashboard",
          label: "Dashboard",
          onClick: () => onNavigate("dashboard"),
          active: currentPage === "dashboard",
        },
        {
          id: "site-map",
          label: "Site Map",
          onClick: () => onNavigate("site-map"),
          active: currentPage === "site-map",
        },
      ],
    },

    // User Management
    {
      id: "user-management",
      label: "User Management",
      icon: Users,
      subItems: [
        {
          id: "users",
          label: "Users",
          onClick: () => onNavigate("users"),
          active: currentPage === "users",
        },
        {
          id: "sub-admins",
          label: "Admin Users",
          onClick: () => onNavigate("sub-admins"),
          active: currentPage === "sub-admins",
          superAdminOnly: true,
        },
        {
          id: "guest-users",
          label: "Guest Users",
          onClick: () => onNavigate("guest-users"),
          active: currentPage === "guest-users",
        },
        {
          id: "deleted-users",
          label: "Deleted Users",
          onClick: () => onNavigate("deleted-users"),
          active: currentPage === "deleted-users",
          superAdminOnly: true,
        },
      ],
    },

    // Master Management (Super Admin only)
    {
      id: "master-management",
      label: "Master Management",
      icon: Settings,
      superAdminOnly: true,
      subItems: [
        {
          id: "roles",
          label: "Roles",
          onClick: () => onNavigate("roles"),
          active: currentPage === "roles",
        },
        {
          id: "default-wardrobe",
          label: "Default Wardrobe",
          onClick: () => onNavigate("default-wardrobe"),
          active: currentPage === "default-wardrobe",
        },
      ],
    },

    // Plan Management
    {
      id: "rewards-payments",
      label: "Plan Management",
      icon: Gift,
      subItems: [
        {
          id: "reward-plans",
          label: "Reward Plans",
          onClick: () => onNavigate("reward-plans"),
          active: currentPage === "reward-plans",
        },
        {
          id: "payment-history",
          label: "Payment History",
          onClick: () => onNavigate("payment-history"),
          active: currentPage === "payment-history",
        },
      ],
    },

    // Community Management
    {
      id: "content-moderation",
      label: "Community Management",
      icon: Flag,
      subItems: [
        {
          id: "posts",
          label: "Posts",
          onClick: () => onNavigate("posts"),
          active: currentPage === "posts",
        },
      ],
    },

    // Flagged Content Management
    {
      id: "flagged-content-management",
      label: "Flagged Content Management",
      icon: AlertTriangle,
      subItems: [
        {
          id: "flagged-users",
          label: "Flagged Users",
          onClick: () => onNavigate("flagged-users"),
          active: currentPage === "flagged-users",
        },
        {
          id: "flagged-posts",
          label: "Flagged Posts",
          onClick: () => onNavigate("flagged-posts"),
          active: currentPage === "flagged-posts",
        },
        {
          id: "flagged-comments",
          label: "Flagged Comments",
          onClick: () => onNavigate("flagged-comments"),
          active: currentPage === "flagged-comments",
        },
        {
          id: "flagged-messages",
          label: "Flagged Messages",
          onClick: () => onNavigate("flagged-messages"),
          active: currentPage === "flagged-messages",
        },
        {
          id: "flagged-wardrobe-items",
          label: "Flagged Wardrobe Items",
          onClick: () => onNavigate("flagged-wardrobe-items"),
          active: currentPage === "flagged-wardrobe-items",
        },
      ],
    },

    // Communication Management
    {
      id: "communication-management",
      label: "Communication Management",
      icon: Mail,
      subItems: [
        {
          id: "bulk-emails",
          label: "Bulk Emails",
          onClick: () => onNavigate("bulk-emails"),
          active: currentPage === "bulk-emails",
        },
        {
          id: "bulk-notifications",
          label: "Bulk Notifications",
          onClick: () => onNavigate("bulk-notifications"),
          active: currentPage === "bulk-notifications",
        },
        {
          id: "contact-us",
          label: "Contact Us",
          onClick: () => onNavigate("contact-us"),
          active: currentPage === "contact-us",
          superAdminOnly: true,
        },
      ],
    },

    // Prompt Management
    {
      id: "prompt-management",
      label: "Prompt Management",
      icon: Brain,
      subItems: [
        {
          id: "model-master",
          label: "Model Master",
          onClick: () => onNavigate("model-master"),
          active: currentPage === "model-master",
        },
        {
          id: "prompt-api-settings",
          label: "Prompt Configurations",
          onClick: () => onNavigate("prompt-api-settings"),
          active: currentPage === "prompt-api-settings",
        },
        {
          id: "ai-api-configuration",
          label: "AI API Configuration",
          onClick: () => onNavigate("ai-api-configuration"),
          active: currentPage === "ai-api-configuration",
        },
      ],
    },

    // BCA & BCC Management
    {
      id: "bca-bcc-management",
      label: "BCA & BCC Management",
      icon: Award,
      subItems: [
        {
          id: "bca-task-configuration",
          label: "BCA Task Configuration",
          onClick: () => onNavigate("bca-task-configuration"),
          active: currentPage === "bca-task-configuration",
        },
        {
          id: "bcc-task-configuration",
          label: "BCC Task Configuration",
          onClick: () => onNavigate("bcc-task-configuration"),
          active: currentPage === "bcc-task-configuration",
        },
        {
          id: "bcc-packages",
          label: "BCC Packages",
          onClick: () => onNavigate("bcc-packages"),
          active: currentPage === "bcc-packages",
        },
      ],
    },

    // Configuration (renamed from Content Management)
    {
      id: "configuration",
      label: "Configuration",
      icon: FileText,
      superAdminOnly: true,
      subItems: [
        {
          id: "email-templates",
          label: "Email Notifications",
          onClick: () => onNavigate("email-templates"),
          active: currentPage === "email-templates",
          superAdminOnly: true,
        },
        {
          id: "static-pages",
          label: "Static Pages",
          onClick: () => onNavigate("static-pages"),
          active: currentPage === "static-pages",
        },
        {
          id: "faqs",
          label: "FAQs",
          onClick: () => onNavigate("faqs"),
          active: currentPage === "faqs",
        },
        {
          id: "things-to-know",
          label: "Things to Know",
          onClick: () => onNavigate("things-to-know"),
          active: currentPage === "things-to-know",
        },
        {
          id: "system-notifications",
          label: "System Notifications",
          onClick: () => onNavigate("system-notifications"),
          active: currentPage === "system-notifications",
          superAdminOnly: true,
        },
        {
          id: "app-configuration",
          label: "App Configuration",
          onClick: () => onNavigate("app-configuration"),
          active: currentPage === "app-configuration",
          superAdminOnly: true,
        },
      ],
    },

    // Reports
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      subItems: [
        {
          id: "revenue-report",
          label: "Revenue Report",
          onClick: () => onNavigate("revenue-report"),
          active: currentPage === "revenue-report",
        },
        {
          id: "reward-report",
          label: "Reward Points Report",
          onClick: () => onNavigate("reward-report"),
          active: currentPage === "reward-report",
        },
        {
          id: "api-failure-report",
          label: "AI API Failure Report",
          onClick: () => onNavigate("api-failure-report"),
          active: currentPage === "api-failure-report",
        },
        {
          id: "api-consumption-report",
          label: "API Consumption Report",
          onClick: () => onNavigate("api-consumption-report"),
          active: currentPage === "api-consumption-report",
        },
        {
          id: "ootd-report",
          label: "OOTD Report",
          onClick: () => onNavigate("ootd-report"),
          active: currentPage === "ootd-report",
        },
      ],
    },

    // HB Template (Keep existing)
    {
      id: "hb-templates",
      label: "HB Template",
      icon: Building2,
      subItems: [
        {
          id: "ui-kit",
          label: "UI Kit",
          onClick: () => onNavigate("ui-kit"),
          active: currentPage === "ui-kit",
        },
        {
          id: "sample-design",
          label: "Sample Page",
          onClick: () => onNavigate("sample-design"),
          active: currentPage === "sample-design",
        },
      ],
    },
  ];
};