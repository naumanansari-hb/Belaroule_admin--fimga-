import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Sidebar } from "./components/Sidebar";
import { GlobalHeader } from "./components/GlobalHeader";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import Dashboard from "./components/Dashboard";
import SiteMap from "./components/SiteMap";
import UIKit from "./components/UIKit";
import SampleDesign from "./components/SampleDesign";
import UserManagement from "./components/UserManagement";
import DeletedUsersManagement from "./components/DeletedUsersManagement";
import DeletedUserDetail from "./components/DeletedUserDetail";
import RoleManagement from "./components/RoleManagement";
import CategoryManagement from "./components/CategoryManagement";
import BodyShapeManagement from "./components/BodyShapeManagement";
import AgeGroupManagement from "./components/AgeGroupManagement";
import TransactionTypeManagement from "./components/TransactionTypeManagement";
import DefaultWardrobeManagement from "./components/DefaultWardrobeManagement";
import RewardPlanManagement from "./components/RewardPlanManagement";
import PaymentHistoryManagement from "./components/PaymentHistoryManagement";
import PostsManagement from "./components/PostsManagement";
import FlaggedPostsManagement from "./components/FlaggedPostsManagement";
import FlaggedCommentsManagement from "./components/FlaggedCommentsManagement";
import FlaggedUsersManagement from "./components/FlaggedUsersManagement";
import FlaggedMessagesManagement from "./components/FlaggedMessagesManagement";
import FlaggedWardrobeManagement from "./components/FlaggedWardrobeManagement";
import EmailTemplatesManagement from "./components/EmailTemplatesManagement";
import SystemNotifications from "./components/SystemNotifications";
import PromptManagement from "./components/PromptManagement";
import APIConfigurationManagement from "./components/APIConfigurationManagement";
import AppConfiguration from "./components/AppConfiguration";
import TaskConfigurationManagement from "./components/TaskConfigurationManagement";
import StaticPagesManagement from "./components/StaticPagesManagement";
import FAQsManagement from "./components/FAQsManagement";
import RevenueReport from "./components/RevenueReport";
import OOTDReport from "./components/OOTDReport";
import RewardPointsReport from "./components/RewardPointsReport";
import APIFailureReport from "./components/APIFailureReport";
import APIConsumptionReport from "./components/APIConsumptionReport";
import BulkEmails from "./components/BulkEmails";
import BulkNotifications from "./components/BulkNotifications";
import ContactUsManagement from "./components/ContactUsManagement";
import AddBulkEmail from "./components/AddBulkEmail";
import AddBulkNotification from "./components/AddBulkNotification";
import ViewBulkEmail from "./components/ViewBulkEmail";
import ViewBulkNotification from "./components/ViewBulkNotification";
import MyProfile from "./components/MyProfile";
import ChangePassword from "./components/ChangePassword";
import Notifications from "./components/Notifications";

function AppContent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    }
    return false;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("colorTheme") || "natural";
    }
    return "natural";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");

  const [selectedEmailId, setSelectedEmailId] = useState<string | undefined>(undefined);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | undefined>(undefined);
  const [selectedDeletedUserId, setSelectedDeletedUserId] = useState<string | undefined>(undefined);

  const [userRole, setUserRole] = useState<'super-admin' | 'sub-admin'>('super-admin');

  const [authScreen, setAuthScreen] = useState<'login' | 'forgot-password'>('login');

  /* -------------------- Theme Effects -------------------- */
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("colorTheme", currentTheme);
    document.documentElement.setAttribute(
      "data-theme",
      currentTheme,
    );
  }, [currentTheme]);

  // Update userRole from authenticated user
  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {authScreen === 'login' ? (
          <Login onLogin={login} onForgotPassword={() => setAuthScreen('forgot-password')} />
        ) : (
          <ForgotPassword onBackToLogin={() => setAuthScreen('login')} />
        )}
        <Toaster
          position="top-right"
          expand
          richColors
          closeButton
          theme={isDark ? "dark" : "light"}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors">
      {/* Sidebar */}
      <Sidebar
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() =>
          setIsSidebarCollapsed(!isSidebarCollapsed)
        }
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userRole={userRole}
        onUserRoleChange={setUserRole}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Global Header */}
        <GlobalHeader
          isDarkMode={isDark}
          onToggleDarkMode={() => setIsDark(!isDark)}
          isSidebarCollapsed={isSidebarCollapsed}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userRole={userRole}
          onUserRoleChange={setUserRole}
        />

        {/* Page Content */}
        {currentPage === "ui-kit" ? (
          <UIKit />
        ) : currentPage === "dashboard" ? (
          <Dashboard />
        ) : currentPage === "site-map" ? (
          <SiteMap onNavigate={handleNavigate} />
        ) : currentPage === "sample-design" ? (
          <SampleDesign />
        ) : currentPage === "users" || currentPage === "sub-admins" || currentPage === "guest-users" ? (
          <UserManagement currentView={currentPage} />
        ) : currentPage === "deleted-users" ? (
          <DeletedUsersManagement 
            onViewDetail={(deletedUserId) => {
              setSelectedDeletedUserId(deletedUserId);
              setCurrentPage('deleted-user-detail');
            }}
          />
        ) : currentPage === "deleted-user-detail" && selectedDeletedUserId ? (
          <DeletedUserDetail 
            deletedUserId={selectedDeletedUserId}
            onBack={() => setCurrentPage('deleted-users')}
          />
        ) : currentPage === "roles" ? (
          <RoleManagement />
        ) : currentPage === "categories" ? (
          <CategoryManagement />
        ) : currentPage === "body-shapes" ? (
          <BodyShapeManagement />
        ) : currentPage === "age-groups" ? (
          <AgeGroupManagement />
        ) : currentPage === "transaction-types" ? (
          <TransactionTypeManagement />
        ) : currentPage === "default-wardrobe" ? (
          <DefaultWardrobeManagement />
        ) : currentPage === "reward-plans" ? (
          <RewardPlanManagement />
        ) : currentPage === "payment-history" ? (
          <PaymentHistoryManagement />
        ) : currentPage === "posts" ? (
          <PostsManagement />
        ) : currentPage === "flagged-posts" ? (
          <FlaggedPostsManagement />
        ) : currentPage === "flagged-comments" ? (
          <FlaggedCommentsManagement />
        ) : currentPage === "flagged-users" ? (
          <FlaggedUsersManagement />
        ) : currentPage === "flagged-messages" ? (
          <FlaggedMessagesManagement />
        ) : currentPage === "flagged-wardrobe-items" ? (
          <FlaggedWardrobeManagement />
        ) : currentPage === "email-templates" ? (
          <EmailTemplatesManagement />
        ) : currentPage === "system-notifications" ? (
          <SystemNotifications />
        ) : currentPage === "prompt-api-settings" ? (
          <PromptManagement />
        ) : currentPage === "ai-api-configuration" ? (
          <APIConfigurationManagement />
        ) : currentPage === "app-configuration" ? (
          <AppConfiguration />
        ) : currentPage === "task-configurations" ? (
          <TaskConfigurationManagement />
        ) : currentPage === "static-pages" ? (
          <StaticPagesManagement />
        ) : currentPage === "faqs" ? (
          <FAQsManagement />
        ) : currentPage === "revenue-report" ? (
          <RevenueReport />
        ) : currentPage === "ootd-report" ? (
          <OOTDReport />
        ) : currentPage === "reward-report" ? (
          <RewardPointsReport />
        ) : currentPage === "api-failure-report" ? (
          <APIFailureReport />
        ) : currentPage === "api-consumption-report" ? (
          <APIConsumptionReport />
        ) : currentPage === "bulk-emails" ? (
          <BulkEmails 
            onNavigate={handleNavigate}
            onViewEmail={(emailId) => {
              setSelectedEmailId(emailId);
              setCurrentPage('view-bulk-email');
            }}
          />
        ) : currentPage === "bulk-notifications" ? (
          <BulkNotifications 
            onNavigate={handleNavigate}
            onViewNotification={(notificationId) => {
              setSelectedNotificationId(notificationId);
              setCurrentPage('view-bulk-notification');
            }}
          />
        ) : currentPage === "contact-us" ? (
          <ContactUsManagement />
        ) : currentPage === "add-bulk-email" ? (
          <AddBulkEmail onNavigate={handleNavigate} />
        ) : currentPage === "add-bulk-notification" ? (
          <AddBulkNotification onNavigate={handleNavigate} />
        ) : currentPage === "view-bulk-email" ? (
          <ViewBulkEmail onNavigate={handleNavigate} emailId={selectedEmailId} />
        ) : currentPage === "view-bulk-notification" ? (
          <ViewBulkNotification onNavigate={handleNavigate} notificationId={selectedNotificationId} />
        ) : currentPage === "my-profile" ? (
          <MyProfile />
        ) : currentPage === "change-password" ? (
          <ChangePassword />
        ) : currentPage === "notifications" ? (
          <Notifications onNavigate={handleNavigate} />
        ) : (
          <div className="p-6 text-neutral-500">
            {currentPage === "company-profile" && "Company Profile Page"}
            {currentPage !== "dashboard" && currentPage !== "company-profile" && "Select a module to preview UI components"}
          </div>
        )}
      </main>

      {/* Toast */}
      <Toaster
        position="top-right"
        expand
        richColors
        closeButton
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}