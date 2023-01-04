const ControlBaseDataView = require( 'elementor-controls/base-data' );

export default class extends ControlBaseDataView {
	onReady() {
		const options = _.extend( {
			enableTime: true,
			minuteIncrement: 1,
		}, this.model.get( 'picker_options' ) );

		this.ui.input.flatpickr( options );
	}

	events() {
		return {
			...super.events(),
			'change @ui.input': 'onBaseInputChange',
		};
	}

	onBaseInputChange() {
		super.onBaseInputChange( ...arguments );
		if ( this.model.attributes.verify_min_date_field ) {
			const startDate = this.options.container.settings.get( this.model.attributes.verify_min_date_field.compare_field_name );
			if ( ! startDate ) {
				return;
			}

			const endDate = this.ui.input[ 0 ].value;
			const startDateTimestamp = new Date( startDate ).getTime();
			const endDateTimestamp = new Date( endDate ).getTime();

			switch ( this.model.attributes.verify_min_date_field.compare_field_operator ) {
				case '>=':
					if ( startDateTimestamp >= endDateTimestamp ) {
						this.ui.input[ 0 ].value = '';
					}
					break;
				case '<=':
					if ( startDateTimestamp <= endDateTimestamp ) {
						this.ui.input[ 0 ].value = '';
					}
					break;
				case '>':
					if ( startDateTimestamp > endDateTimestamp ) {
						this.ui.input[ 0 ].value = '';
					}
					break;
				case '<':
					if ( startDateTimestamp < endDateTimestamp ) {
						this.ui.input[ 0 ].value = '';
					}
					break;
				case '==':
					if ( startDateTimestamp === endDateTimestamp ) {
						this.ui.input[ 0 ].value = '';
					}
					break;
				case '!=':
					if ( startDateTimestamp !== endDateTimestamp ) {
						this.ui.input[ 0 ].value = '';
					}
					break;
			}
		}
	}

	onBeforeDestroy() {
		this.ui.input.flatpickr().destroy();
	}
}
