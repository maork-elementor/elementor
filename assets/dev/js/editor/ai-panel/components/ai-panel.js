import { Panel, PanelHeader, PanelHeaderTitle, PanelBody } from '@elementor/editor-panels';

export default function AiPanel() {
	return (
		<Panel>
			<PanelHeader>
				<PanelHeaderTitle>
					AI Panel
				</PanelHeaderTitle>
			</PanelHeader>
			<PanelBody>
				<p>Here should be all the body</p>
			</PanelBody>
		</Panel>
	);
}
