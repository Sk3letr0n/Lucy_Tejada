import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentGrades from "./pages/student/StudentGrades";
import StudentProgress from "./pages/student/StudentProgress";
import StudentSchedule from "./pages/student/StudentSchedule";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherGrades from "./pages/teacher/TeacherGrades";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";
import TeacherReports from "./pages/teacher/TeacherReports";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminAudit from "./pages/admin/AdminAudit";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/student/dashboard"} component={StudentDashboard} />
      <Route path={"/student/grades"} component={StudentGrades} />
      <Route path={"/student/progress"} component={StudentProgress} />
      <Route path={"/student/schedule"} component={StudentSchedule} />
      <Route path={"/teacher/dashboard"} component={TeacherDashboard} />
      <Route path={"/teacher/grades"} component={TeacherGrades} />
      <Route path={"/teacher/attendance"} component={TeacherAttendance} />
      <Route path={"/teacher/analytics"} component={TeacherAnalytics} />
      <Route path={"/teacher/reports"} component={TeacherReports} />
      <Route path={"/teacher/schedule"} component={TeacherSchedule} />
      <Route path={"/admin/dashboard"} component={AdminDashboard} />
      <Route path={"/admin/students"} component={AdminStudents} />
      <Route path={"/admin/teachers"} component={AdminTeachers} />
      <Route path={"/admin/subjects"} component={AdminSubjects} />
      <Route path={"/admin/schedule"} component={AdminSchedule} />
      <Route path={"/admin/audit"} component={AdminAudit} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
