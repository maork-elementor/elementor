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
	Container,
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

const areasNames = [ 'SEO', 'Performance', 'UX' ];
const widgetsNames = [ 'Heading', 'Image', 'Text Editor' ];

export default function AiPanel() {
	const [ areas, setAreas ] = React.useState( [ 'SEO', 'UX' ] );
	const [ widgets, setWidgets ] = React.useState( [ 'Heading', 'Text Editor' ] );
	const [ recommendations, setRecommendations ] = React.useState( [] );
	const [ loading, setLoading ] = React.useState( false );

	const handleChange = ( event ) => {
		const {
			target: { value },
		} = event;
		setAreas(
			// On autofill we get a stringified value.
			'string' === typeof value ? value.split( ',' ) : value,
		);
	};

	const generateRecommendations = () => {
		setLoading( true );
		const endpoint = 'https://optimentor.ai/api/v1/recommendations';
		const data = {
			areas,
			widgets,
		};
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( data ),
		};
		const response = fetch( endpoint, options );
		response
			.then( ( res ) => res.json() )
			.then( ( res ) => {
				setRecommendations( res );
				console.log( res );
				setLoading( false );
			} );
	};

	return (
		<Panel>
			<PanelHeader>
				<PanelHeaderTitle>Optimentor AI Assistant</PanelHeaderTitle>
			</PanelHeader>
			{ loading && <LinearProgress color="primary" /> }
			<PanelBody>
				<Container maxWidth="sm">
					<Box my={ 4 } textAlign={ 'center' }>
						<Typography
							variant="subtitle1"
							gutterBottom
							style={ {
								fontWeight: 'bold',
							} }
						>
							Hello, Im Optimentor AI Assistant
							<br />I can help you to create a better website!
						</Typography>
						<img
							alt="Optimentor AI Assistant"
							src={
								'https://miro.medium.com/v2/resize:fit:1400/1*fZsdZisozTZbM6AaPQKI4Q.gif'
							}
						/>
						<Typography variant="subtitle1" gutterBottom>
							What do you want to improve?
						</Typography>

						<FormControl sx={ { m: 1, width: '90%', marginTop: '30px' } }>
							<InputLabel id="demo-multiple-chip-label">
								Select Focus Areas:
							</InputLabel>
							<Select
								labelId="demo-multiple-chip-label"
								id="demo-multiple-chip"
								multiple
								value={ areas }
								onChange={ handleChange }
								input={
									<OutlinedInput
										id="select-multiple-chip"
										label="Select Focus Areas:"
									/>
								}
								renderValue={ ( selected ) => (
									<Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
										{ selected.map( ( value ) => (
											<Chip key={ value } label={ value } />
										) ) }
									</Box>
								) }
								MenuProps={ MenuProps }
							>
								{ areasNames.map( ( name ) => (
									<MenuItem key={ name } value={ name }>
										{ name }
									</MenuItem>
								) ) }
							</Select>
						</FormControl>

						<FormControl sx={ { m: 1, width: '90%', marginTop: '20px' } }>
							<InputLabel id="demo-multiple-chip-label">
								Select Widgets:
							</InputLabel>
							<Select
								labelId="demo-multiple-chip-label"
								id="demo-multiple-chip"
								multiple
								value={ widgets }
								onChange={ handleChange }
								input={
									<OutlinedInput
										id="select-multiple-chip"
										label="Select Widgets:"
									/>
								}
								renderValue={ ( selected ) => (
									<Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
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
							Generate Recommendations
						</Button>
					</Box>
				</Container>
			</PanelBody>
		</Panel>
	);
}
