import { registerPanel } from '@elementor/editor-panels';
import { panel } from './panel';
import { toolsMenu } from '@elementor/editor-app-bar';
import useToggleActionProps from './hooks/use-toggle-action-props';

export default function init() {
	registerPanel( panel );

	toolsMenu.registerToggleAction( {
		id: 'open-ai-panel',
		useProps: useToggleActionProps,
	} );
}
