import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import BootSequence from "./pages/boot-sequence";
import Workspace from "./pages/workspace";
import NotFound from "./pages/not-found"; // updated import
import SoundEffectsProvider from "./components/SoundEffectsProvider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={BootSequence} />
      <Route path="/boot" component={BootSequence} />
      <Route path="/workspace" component={Workspace} />
      <Route component={NotFound} /> {/* fallback 404 */}
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <SoundEffectsProvider>
        <Toaster />
        <Router />
      </SoundEffectsProvider>
    </TooltipProvider>
  );
}

export default App;
