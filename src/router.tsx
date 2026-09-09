import React from "react";
import { Route, Switch } from "wouter";
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

export const AppRouter: React.FC = () => {
  return (
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
        {/* Fallback 404 */}
        <Route component={HomeRoute} />
      </Switch>
    </AppShell>
  );
};
