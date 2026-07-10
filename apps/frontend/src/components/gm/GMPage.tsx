import { useState } from 'react';
import { DashboardStats } from '../DashboardModal';
import { CombatTab } from './CombatTab';
import { CampaignTab } from './CampaignTab';
import './GMPage.css';

type Tab = 'dashboard' | 'combat' | 'campagne';

type Props = {
  open: boolean;
  onClose: () => void;
  token: string | null;
  onOpenGraphModal: () => void;
};

export function GMPage({ open, onClose, token, onOpenGraphModal }: Props) {
  const [tab, setTab] = useState<Tab>('dashboard');

  if (!open) return null;

  return (
    <div className="gm-overlay">
      <div className="gm-page glass">
        <div className="gm-header">
          <h2 className="gm-title">Maître du Jeu</h2>
          <nav className="gm-tabs">
            <button
              className={tab === 'dashboard' ? 'primary glass' : 'ghost'}
              onClick={() => setTab('dashboard')}
            >
              Tableau de bord
            </button>
            <button
              className={tab === 'combat' ? 'primary glass' : 'ghost'}
              onClick={() => setTab('combat')}
            >
              Combat
            </button>
            <button
              className={tab === 'campagne' ? 'primary glass' : 'ghost'}
              onClick={() => setTab('campagne')}
            >
              Campagne
            </button>
            <button className="ghost" onClick={onOpenGraphModal}>Graphe</button>
          </nav>
          <button type="button" className="detail-close ghost" onClick={onClose}>×</button>
        </div>

        <div className="gm-content">
          {tab === 'dashboard' && <DashboardStats active={tab === 'dashboard'} />}
          {tab === 'combat' && <CombatTab token={token} />}
          {tab === 'campagne' && <CampaignTab token={token} />}
        </div>
      </div>
    </div>
  );
}
