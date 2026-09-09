import React from "react";
import { Route, Switch, useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { HomeRoute } from "@/routes/index";
import { SaudeRoute } from "@/routes/saude";
import { SaudeAguaRoute } from "@/routes/saude.agua";
import { SaudeAlimentacaoRoute } from "@/routes/saude.alimentacao";
import { SaudeAtividadeRoute } from "@/routes/saude.atividade";
import { SaudeGlicemiaRoute } from "@/routes/saude.glicemia";
import { SaudePressaoRoute } from "@/routes/saude.pressao";
import { SaudeHumorRoute } from "@/routes/saude.humor";
import { SaudeMedicamentosRoute } from "@/routes/saude.medicamentos";
import { SaudeFemininaRoute } from "@/routes/saude.feminina";
import { AvatarRoute } from "@/routes/avatar";
import { RecompensasRoute } from "@/routes/recompensas";
import { JogosRoute } from "@/routes/jogos";
import { MaisRoute } from "@/routes/mais";
import { SettingsRoute } from "@/routes/settings";
import { ConviteRoute } from "@/routes/convite";
import { LoginRoute } from "@/routes/login";
import { CadastroRoute } from "@/routes/cadastro";
import { HistoricoRoute } from "@/routes/historico";
import { DesempenhoRoute } from "@/routes/desempenho";
import { IndicadoresRoute } from "@/routes/indicadores";
import { ExportarDadosRoute } from "@/routes/exportar-dados";
import { useAuth } from "@/lib/auth-context";

// ─── Auth Guard ───────────────────────────────────────────────────────────────
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isLoading && !currentUser) {
      setLocation("/login");
    }
  }, [currentUser, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white text-sm font-bold">Carregando FarmHero...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return <>{children}</>;
};

// ─── App Router ───────────────────────────────────────────────────────────────
export const AppRouter: React.FC = () => {
  return (
    <Switch>
      {/* Public routes — no auth required */}
      <Route path="/login" component={LoginRoute} />
      <Route path="/cadastro" component={CadastroRoute} />
      <Route path="/convite" component={ConviteRoute} />
      <Route path="/acesso-publico" component={ConviteRoute} />

      {/* Protected routes — wrapped with AuthGuard + AppShell */}
      <Route>
        <AuthGuard>
          <AppShell>
            <Switch>
              <Route path="/" component={HomeRoute} />
              <Route path="/saude" component={SaudeRoute} />
              <Route path="/saude/agua" component={SaudeAguaRoute} />
              <Route path="/saude/alimentacao" component={SaudeAlimentacaoRoute} />
              <Route path="/saude/atividade" component={SaudeAtividadeRoute} />
              <Route path="/saude/glicemia" component={SaudeGlicemiaRoute} />
              <Route path="/saude/pressao" component={SaudePressaoRoute} />
              <Route path="/saude/humor" component={SaudeHumorRoute} />
              <Route path="/saude/medicamentos" component={SaudeMedicamentosRoute} />
              <Route path="/saude/feminina" component={SaudeFemininaRoute} />
              <Route path="/avatar" component={AvatarRoute} />
              <Route path="/personalizar-avatar" component={AvatarRoute} />
              <Route path="/recompensas" component={RecompensasRoute} />
              <Route path="/jogos" component={JogosRoute} />
              <Route path="/mais" component={MaisRoute} />
              <Route path="/settings" component={SettingsRoute} />
              <Route path="/historico" component={HistoricoRoute} />
              <Route path="/desempenho" component={DesempenhoRoute} />
              <Route path="/indicadores" component={IndicadoresRoute} />
              <Route path="/exportar-dados" component={ExportarDadosRoute} />
              {/* Fallback 404 */}
              <Route component={HomeRoute} />
            </Switch>
          </AppShell>
        </AuthGuard>
      </Route>
    </Switch>
  );
};
