import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MentalHealth from "./pages/MentalHealth";
import LogicalThinking from "./pages/LogicalThinking";
import Creativity from "./pages/Creativity";
import MathematicalThinking from "./pages/MathematicalThinking";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/mental-health"} component={MentalHealth} />
      <Route path={"/logical-thinking"} component={LogicalThinking} />
      <Route path={"/creativity"} component={Creativity} />
      <Route path={"/mathematical-thinking"} component={MathematicalThinking} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
