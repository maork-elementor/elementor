var PanelHeaderItemView;
import Notifications from './components/notifications-center/notifications-center';

PanelHeaderItemView = Marionette.ItemView.extend( {
	template: '#tmpl-elementor-panel-header',

	id: 'elementor-panel-header',

	ui: {
		menuButton: '#elementor-panel-header-menu-button',
		menuIcon: '#elementor-panel-header-menu-button i',
		title: '#elementor-panel-header-title',
		addButton: '#elementor-panel-header-add-button',
		notificationCenter: '#notification-center-wrapper',
	},

	events: {
		'click @ui.addButton': 'onClickAdd',
		'click @ui.menuButton': 'onClickMenu',
	},

	behaviors() {
		return elementor.hooks.applyFilters( 'panel/header/behaviors', {}, this );
	},

	setTitle( title ) {
		this.ui.title.html( title );
	},

	onClickAdd() {
		$e.route( 'panel/elements/categories' );
	},

	onClickMenu() {
		if ( $e.routes.is( 'panel/menu' ) ) {
			$e.route( 'panel/elements/categories' );
		} else {
			$e.route( 'panel/menu' );
		}
	},
	onRender() {
		ReactDOM.render(
			<Notifications />,
			this.ui.notificationCenter[ 0 ],
		);
	},
} );

module.exports = PanelHeaderItemView;
