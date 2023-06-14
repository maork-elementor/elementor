import {
	Panel,
	PanelHeader,
	PanelHeaderTitle,
	PanelBody,
} from '@elementor/editor-panels';

import {
	Chip,
	FormControl,
	InputLabel,
	Button,
	Select,
	MenuItem,
	Typography,
	Divider,
	Container,
	ButtonGroup,
	LinearProgress,
	OutlinedInput,
	Box,
} from '@elementor/ui';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const widgetsNames = [ 'Heading', 'Image', 'Text Editor' ];

export default function AiPanel() {
	const [ widgets, setWidgets ] = React.useState( [ 'Heading' ] );
	const [ recommendations, setRecommendations ] = React.useState( [] );
	const [ loading, setLoading ] = React.useState( false );
	const [ isTyping, setIsTyping ] = React.useState( false );
	const [ dataFetched, setDataFetched ] = React.useState( false );
	const [ currentFetchWidget, setCurrentFetchWidget ] = React.useState( '' );

	const handleWidgetsChange = ( event ) => {
		const {
			target: { value },
		} = event;
		setWidgets(
			// On autofill we get a stringified value.
			'string' === typeof value ? value.split( ',' ) : value,
		);
	};

	const generateRecommendations = () => {
		// Loop on widgets
		// set current widget

		for ( const widget of widgets ) {
			setCurrentFetchWidget( widget );
			setLoading( true );
			setTimeout( () => {
				setIsTyping( true );
			}, 2000 );
			jQuery.ajax( {
				url: '/wp-admin/admin-ajax.php',
				type: 'POST',
				data: {
					action: 'optimentor_generate_recommendations',
					widget: widget.toLowerCase().replace( ' ', '_' ),
					post_id: window.elementor.config.document.id,
				},
				success( response ) {
					console.log( response );

					setIsTyping( false );
					// Get old recommendations and merge with new ones
					const newRecommendations = [ response.data.recommendations.data ];
					if ( null === newRecommendations[ 0 ] || 0 === newRecommendations[ 0 ].length ) {
						console.log( 'No recommendations found, fetching new ones...' );
						newRecommendations();
						return;
					}
					// Marge old recommendations with new ones
					const margedRecommendations = [
						...recommendations,
						...newRecommendations,
					];
					setRecommendations( margedRecommendations );

					setLoading( false );
					setDataFetched( true );
					setCurrentFetchWidget( '' );
				},
				error( error ) {
					console.log( error );
					setLoading( false );
					setIsTyping( false );
				},
			} );
		}
	};

	return (
		<Panel>
			<PanelHeader>
				<PanelHeaderTitle>Optimentor AI UX Assistant</PanelHeaderTitle>
			</PanelHeader>
			{ loading && <LinearProgress color="primary" /> }
			<PanelBody>
				<Container maxWidth="sm">
					{ ! dataFetched && (
						<Box my={ 4 } textAlign={ 'center' }>
							{ ! loading && 0 === recommendations.length && (
								<Typography
									variant="subtitle1"
									gutterBottom
									style={ {
										fontWeight: 'bold',
									} }
								>
									Hello, I'm Optimentor, I'm here to make optimizing your
									website a breeze!
								</Typography>
							) }

							{ loading && (
								<Typography
									variant="subtitle1"
									gutterBottom
									style={ {
										fontWeight: 'bold',
									} }
								>
									Just a moment, I'm generating personalized recommendations for
									you...
								</Typography>
							) }

							{ ! loading && 0 === recommendations.length && (
								<>
									<img
										alt="Optimentor AI Assistant"
										width={ '60%' }
										src={ 'https://s12.gifyu.com/images/SQbgy.gif' }
									/>

									<Typography variant="subtitle1" gutterBottom>
										Which widgets are you want to improve conversion rates?
									</Typography>

									<FormControl sx={ { m: 1, width: '90%', marginTop: '20px' } }>
										<InputLabel id="demo-multiple-chip-label">
											Choose Widgets:
										</InputLabel>
										<Select
											labelId="demo-multiple-chip-label"
											id="demo-multiple-chip"
											multiple
											value={ widgets }
											onChange={ handleWidgetsChange }
											input={
												<OutlinedInput
													id="select-multiple-chip"
													label="Choose Widgets:"
												/>
											}
											renderValue={ ( selected ) => (
												<Box
													sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }
												>
													{ selected.map( ( value ) => (
														<Chip key={ value } label={ value } />
													) ) }
												</Box>
											) }
											MenuProps={ MenuProps }
										>
											{ widgetsNames.map( ( name ) => (
												<MenuItem key={ name } value={ name }>
													{ name }
												</MenuItem>
											) ) }
										</Select>
									</FormControl>

									<Button
										variant="contained"
										style={ { marginTop: '30px' } }
										onClick={ generateRecommendations }
										disabled={ loading }
									>
										Get Started
									</Button>
								</>
							) }
						</Box>
					) }

					<Box my={ 4 } textAlign={ 'center' }>
						{ isTyping && (
							<span>
								<img
									style={ {
										height: '25px',
										float: 'left',
										marginLeft: '11px',
									} }
									alt="Optimentor AI Assistant"
									src={
										'https://res.cloudinary.com/practicaldev/image/fetch/s--aLdmG8eR--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/rf4nb3r7qsn2u9fjrf47.gif'
									}
								/>
								<Typography
									variant="caption"
									gutterBottom
									style={ {
										textAlign: 'left',
										float: 'left',
										marginTop: '4px',
										marginLeft: '10px',
									} }
								>
									<strong>Optimentor</strong> is Typing...
								</Typography>
							</span>
						) }

						{ ! loading && recommendations?.length > 0 && (
							<>
								{ /* Loop index and value */ }
								{ recommendations.map( ( recommendation, index ) => {
									// Modify the data as you wish
									const widgetName = Object.keys( recommendation )[ 0 ];
									const styles = recommendation[ widgetName ];

									return (
										<>
											<Typography
												variant="h6"
												gutterBottom
												style={ {
													fontWeight: '700',
													fontSize: '18px',
													textTransform: 'capitalize',
													marginBottom: '9px',
												} }
											>
												{ widgetName }
											</Typography>

											<Divider
												style={ {
													marginBottom: '9px',
												} }
											/>

											<ButtonGroup
												variant="contained"
												aria-label="outlined primary button group"
											>
												{ Object.entries( styles[ 0 ] ).map( ( key ) => {
													// Get last char
													const number = key[ 0 ].slice( -1 );
													return (
														<Button
															style={ {
																marginLeft: '10px',
																fontSize: '12px',
																padding: '10px',
															} }
															key={ key }
														>
															Style { number }
														</Button>
													);
												} ) }

												{ /* { Object.keys( styles[ 0 ] ).map( ( key ) => {
												// Debugger;
												return (
													<Button key={ key }>{ key }</Button>
												// { JSON.stringify( styles[ 0 ][ key ] ) }
												);
											} ) } */ }
											</ButtonGroup>
										</>
									);
								} ) }
							</>
						) }
					</Box>
				</Container>
			</PanelBody>
		</Panel>
	);
}
