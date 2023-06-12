import { AIIcon } from '@elementor/icons';
import { usePanelActions, usePanelStatus } from '../panel';

export default function useToggleActionProps() {
	const { isOpen, isBlocked } = usePanelStatus();
	const { open, close } = usePanelActions();

	return {
		title: 'Ai Panel',
		icon: AIIcon,
		onClick: () => isOpen ? close() : open(),
		selected: isOpen,
		disabled: isBlocked,
	};
}
