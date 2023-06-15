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
	Modal,
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

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 15,
};

const widgetsNames = [ 'Heading', 'Image', 'Text Editor' ];

export default function AiPanel() {
	const [ widgets, setWidgets ] = React.useState( [ 'Heading' ] );
	const [ recommendations, setRecommendations ] = React.useState( [] );
	const [ loading, setLoading ] = React.useState( false );
	const [ isTyping, setIsTyping ] = React.useState( false );
	const [ dataFetched, setDataFetched ] = React.useState( false );
	const [ currentFetchWidget, setCurrentFetchWidget ] = React.useState( '' );
	const [ fetchRetry, setFetchRetry ] = React.useState( 0 );

	const [ open, setOpen ] = React.useState( false );
	const handleOpen = () => setOpen( true );
	const handleClose = () => setOpen( false );

	const handleWidgetsChange = ( event ) => {
		const {
			target: { value },
		} = event;
		setWidgets(
			// On autofill we get a stringified value.
			'string' === typeof value ? value.split( ',' ) : value,
		);
	};

	const validateJson = ( json ) => {
		if ( ! Array.isArray( json ) || json.length !== 4 ) {
			return false;
		}

		// Check each child object
		for ( let i = 0; i < json.length; i++ ) {
			const obj = json[ i ];

			// Check that each child object is not null or empty
			if ( null === obj || 0 === Object.keys( obj ).length ) {
				return false;
			}
		}

		return true;
	};

	const generateRecommendations = () => {
		// Loop on widgets
		// set current widget

		if ( 2 === fetchRetry ) {
			setLoading( false );
			setIsTyping( false );
			setDataFetched( true );
			const recommendations_ = localStorage.getItem( 'optimentor_recommendations' );
			setRecommendations( JSON.parse( recommendations_ ) );
			return;
		}

		for ( const widget of widgets ) {
			setCurrentFetchWidget( widget );
			setLoading( true );
			setTimeout( () => {
				setIsTyping( true );
			}, 2000 );
			const widgetName = widget.toLowerCase().replace( ' ', '_' );
			jQuery.ajax( {
				url: '/wp-admin/admin-ajax.php',
				type: 'POST',
				data: {
					action: 'optimentor_generate_recommendations',
					widget: widgetName,
					post_id: window.elementor.config.document.id,
				},
				success( response ) {
					console.log( response );

					setFetchRetry( fetchRetry + 1 );
					setIsTyping( false );
					// Get old recommendations and merge with new ones
					const newRecommendations = [ response.data.recommendations.data ];
					if ( ! validateJson( newRecommendations[ 0 ][ widgetName ] ) ) {
						console.log( 'No recommendations found, fetching new ones...' );
						generateRecommendations();
						return;
					}
					// Marge old recommendations with new ones
					const margedRecommendations = [
						...recommendations,
						...newRecommendations,
					];
					// Save to local storage
					localStorage.setItem( 'optimentor_recommendations', JSON.stringify( margedRecommendations ) );
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

	const previewStyle = ( styleObject ) => {
		var iframe = document.getElementById( 'elementor-preview-iframe' );

		var doc = iframe.contentDocument || iframe.contentWindow.document;
		let style = false;

		if ( ! styleObject ) {
			style = doc.getElementById( 'tmpStyleTag' );
			// Remove the style tag
			if ( style ) {
				doc.head.removeChild( style );
			}
			return;
		}

		style = doc.createElement( 'style' );

		let css = ' .elementor-heading-title {';

		for ( const [ key, value ] of Object.entries( styleObject ) ) {
			css += `${ key }: ${ value } !important;`;
		}

		css += '}';

		style.innerHTML = css;

		// Set the id attribute of the style tag
		style.id = 'tmpStyleTag';

		// Append the style to the head
		doc.body.appendChild( style );
	};

	return (
		<Panel>
			<PanelHeader>
				<PanelHeaderTitle>Optimentor AI Assistant</PanelHeaderTitle>
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
												{ Object.entries( styles ).map( ( key ) => {
													const title = key[ 0 ].replace( '_', ' ' );
													return (
														<Button
															onMouseOver={ () => {
																previewStyle( key[ 1 ] );
															} }
															onMouseLeave={ () => {
																previewStyle( false );
															} }
															onClick={ () => {
																handleOpen();
															} }
															style={ {
																marginLeft: '10px',
																fontSize: '12px',
																padding: '10px',
															} }
															key={ key[ 0 ] }
														>
															Style { title }
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
								<br /><br />
								<Typography variant="caption" gutterBottom>
									Based on your website's niche, I've generated personalized
									recommendations for you to improve your conversion rates.
								</Typography>

								<Modal
									open={ open }
									onClose={ handleClose }
									aria-labelledby="modal-modal-title"
									aria-describedby="modal-modal-description"
								>
									<Box sx={ style }>
										<Typography id="modal-modal-title" variant="h6" component="h3" style={ {
											textAlign: 'center',
											color: 'white',
											backgroundColor: 'black',
											padding: '7px',
											fontSize: '16px',
											fontWeight: 'normal',
										} }>
											Apply Recommendation
										</Typography>
										<Typography id="modal-modal-description" sx={ { mt: 2 } }
											style={ {
												textAlign: 'center',
												paddingTop: '20px',
											} }>

											<Button
												variant="contained"
												style={ { marginBottom: '30px', marginRight: '20px' } }
											>
												Apply Style
											</Button>

											<Button
												variant="contained"
												style={ { marginBottom: '30px' } }
											>
												Apply as A/B Test
											</Button>

										</Typography>
									</Box>
								</Modal>

							</>
						) }
					</Box>
				</Container>
			</PanelBody>
		</Panel>
	);
}
