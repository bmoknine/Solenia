import { useState } from 'react';
import { CombatTab } from './CombatTab';
import { CampaignTab } from './CampaignTab';
import { SessionsTab } from './SessionsTab';
import { launchCombatParty } from '../../api/gm';
import { useToast } from '../../toast/ToastProvider';
import './GMPage.css';

type Tab = 'campagne' | 'journal' | 'combat';

type Props = {
  open: boolean;
  onClose: () => void;
  token: string | null;
};

export function GMPage({ open, onClose, token }: Props) {
  // Campagne devient l'onglet d'accueil (Combat passe en dernier).
  const [tab, setTab] = useState<Tab>('campagne');
  const [pendingCombatId, setPendingCombatId] = useState<string | null>(null);
  const { push } = useToast();

  const handleLaunchCombat = async (combatId: string) => {
    try {
      await launchCombatParty(token, combatId); // ajoute les PJ de la campagne
    } catch (e) {
      push(e instanceof Error ? e.message : 'Erreur au lancement du combat', 'error');
    }
    setPendingCombatId(combatId);
    setTab('combat');
  };

  if (!open) return null;

  return (
    <div className="gm-overlay">
      <div className="gm-page glass">
        <div className="gm-header">
          <h2 className="gm-title">Maître du Jeu</h2>
          <nav className="gm-tabs">
            <button
              className={tab === 'campagne' ? 'primary glass' : 'ghost'}
              onClick={() => setTab('campagne')}
            >
              Campagne
            </button>
            <button
              className={tab === 'journal' ? 'primary glass' : 'ghost'}
              onClick={() => setTab('journal')}
            >
              Journal
            </button>
            <button
              className={tab === 'combat' ? 'primary glass' : 'ghost'}
              onClick={() => setTab('combat')}
            >
              Combat
            </button>
          </nav>
          <button type="button" className="detail-close ghost" onClick={onClose}>×</button>
        </div>

        <div className="gm-content">
          {tab === 'combat' && (
            <CombatTab
              token={token}
              openCombatId={pendingCombatId}
              onConsumeOpen={() => setPendingCombatId(null)}
            />
          )}
          {tab === 'campagne' && <CampaignTab token={token} onLaunchCombat={handleLaunchCombat} />}
          {tab === 'journal' && <SessionsTab token={token} />}
        </div>
      </div>
    </div>
  );
}
