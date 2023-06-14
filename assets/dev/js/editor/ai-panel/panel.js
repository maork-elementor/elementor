import { createPanel } from '@elementor/editor-panels';
import AiPanel from './components/ai-panel';

export const {
	panel,
	usePanelActions,
	usePanelStatus,
} = createPanel( {
	id: 'ai-panel',
	component: AiPanel,
} );
