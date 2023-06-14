import { useState, useRef } from 'react';
import { Box, Button, Grid, Stack, TextField, IconButton, Typography } from '@elementor/ui';
import { AIIcon, MessageIcon, ShrinkIcon, ExpandIcon } from '@elementor/icons';
import Loader from '../../components/loader';
import PromptSearch from '../../components/prompt-search';
import Textarea from '../../components/textarea';
import PromptSuggestions from '../../components/prompt-suggestions';
import PromptActionSelection from '../../components/prompt-action-selection';
import GenerateButton from '../../components/generate-button';
import PromptAction from '../../components/prompt-action';
import PromptErrorMessage from '../../components/prompt-error-message';
import useTextPrompt from '../../hooks/use-text-prompt';
import { textAutocomplete, textareaAutocomplete, vocalTones, translateLanguages } from '../../actions-data';
import PromptCredits from '../../components/prompt-credits';

import EditIcon from '@mui/icons-material/Edit';
import InputAdornment from '@mui/material/InputAdornment';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

import Radio from '@mui/material/Radio';
import { Slider } from '@mui/material';
import { InputLabel, MenuItem, Select } from '@mui/material';

const promptActions = [
	{
		label: __( 'Simplify language', 'elementor' ),
		icon: <MessageIcon />, value: 'Simplify the language of the following message',
	},
	{
		label: __( 'Make it longer', 'elementor' ),
		icon: <ExpandIcon />, value: 'Make the following message longer',
	},
	{
		label: __( 'Make it shorter', 'elementor' ),
		icon: <ShrinkIcon />, value: 'Make the following message shorter',
	},
	{
		label: __( 'Fix spelling & grammar', 'elementor' ),
		icon: <AIIcon />, value: 'Fix the spelling and grammar of the following message',
	},
];

const promptInstructions = [
	{
		label: __( 'Change tone', 'elementor' ),
		options: vocalTones, getInstruction: ( value ) => `Change the tone of the following message to ${ value }`,
	},
	{
		label: __( 'Translate to', 'elementor' ),
		options: translateLanguages, getInstruction: ( value ) => `Translate the following message to ${ value }`,
	},
];

const FormText = (
	{
		type,
		onClose,
		getControlValue,
		setControlValue,
		additionalOptions,
		credits,
		usagePercentage,
	},
) => {
	const initialValue = getControlValue() === additionalOptions?.defaultValue ? '' : getControlValue();

	const { data, isLoading, error, reset, send, sendUsageData } = useTextPrompt( { result: initialValue, credits } );
	const cleanData = data?.result?.replace( /\n/g, '' ) || '';
	let titles;

	try {
		titles = JSON.parse( cleanData ).titles;
	} catch ( error ) {
		titles = cleanData.split( '#####' );
	}

	const [ checked1, setChecked1 ] = useState( true );
	const [ checked2, setChecked2 ] = useState( false );
	const [ checked3, setChecked3 ] = useState( false );
	const [ checked4, setChecked4 ] = useState( false );

	const handleCheckbox1Change = ( event ) => {
		setChecked1( event.target.checked );
		updateCheckedCount();
	};

	const handleCheckbox2Change = ( event ) => {
		setChecked2( event.target.checked );
		updateCheckedCount();
	};

	const handleCheckbox3Change = ( event ) => {
		setChecked3( event.target.checked );
		updateCheckedCount();
	};

	const handleCheckbox4Change = ( event ) => {
		setChecked4( event.target.checked );
		updateCheckedCount();
	};

	const updateCheckedCount = () => {
		setTimeout( () => {
			const checkedCount = document.querySelectorAll( '[data-testid="CheckBoxIcon"]' ).length;

			const elements = document.getElementsByClassName( checkedCount >= 2 ? 'start-testing' : 'use-text' );
			console.log( elements );

			for ( let i = 0; i < elements.length; i++ ) {
				elements[ i ].style.display = 'block';
			}

			const elements2 = document.getElementsByClassName( checkedCount >= 2 ? 'use-text' : 'start-testing' );

			for ( let i = 0; i < elements2.length; i++ ) {
				elements2[ i ].style.display = 'none';
			}
		}, 200 );
	};

	const [ prompt, setPrompt ] = useState( '' );
	const [ test, setTest ] = useState( '' );
	const [ edit, setEdit ] = useState( '' );
	const [ joinedString, setJoinedString ] = useState( '' );

	const searchField = useRef( null );

	const resultField = useRef( null );

	const lastRun = useRef( () => {} );

	const autocompleteItems = 'textarea' === type ? textareaAutocomplete : textAutocomplete;

	const showSuggestions = ! prompt;
	const showTestingDiv = ! ! test;
	const showEditDiv = ! ! edit;

	const handleSubmit = ( event ) => {
		event.preventDefault();

		lastRun.current = () => send( prompt );

		lastRun.current();
	};

	const handleCustomInstruction = async ( instruction ) => {
		lastRun.current = () => send( resultField.current.value, instruction );

		lastRun.current();
	};

	const handleSuggestion = ( suggestion ) => {
		setPrompt( suggestion + ' ' );
		searchField.current.focus();
	};

	const applyPrompt = () => {
		sendUsageData();

		const firstTextInput = document.querySelector( '.options input[type="text"]' );
		const value = firstTextInput.value;

		// SetControlValue( resultField.current.value );
		setControlValue( value );

		onClose();
	};

	const startTesting = () => {
		const targetDiv = document.querySelector( '.options' );

		const textInputs = targetDiv.querySelectorAll( 'input[type="text"]' );

		const inputValues = [];

		textInputs.forEach( ( input ) => {
			if ( '' !== input.value ) {
				inputValues.push( input.value );
			}
		} );

		const joinedString = inputValues.join( '#####' );

		setJoinedString( joinedString );
		setTest( 'text' );
	};

	const startTest = () => {
		sendUsageData();

		setControlValue( joinedString );

		onClose();
	};

	const handleEdit = () => {
		setEdit( 'edit' );
	};

	const goBack = () => {
		setEdit( '' );
	};

	const [ value, setValue ] = useState( 50 );

	const handleSliderChange = ( event, newValue ) => {
		setValue( newValue );
	};

	const valuetext = ( value ) => {
		return `${ value }%`;
	};

	const selectStyles = {
		color: 'white',
		border: '1px solid white',
		marginBottom: '20px',
		'&:before': {
		  borderColor: 'white',
		},
		'&:after': {
		  borderColor: 'white',
		},
	};

	if ( isLoading ) {
		return <Loader />;
	}

	return (
		<>
			{ error && <PromptErrorMessage error={ error } onRetry={ lastRun.current } sx={ { mb: 6 } } /> }

			{ showTestingDiv && (
				<>
					<Grid container direction="column" alignItems="left" spacing={ 3 } sx={ { marginBottom: '80px' } }>
						<Grid item style={ { textAlign: 'left' } }>
							<Typography variant="h4" color="text.secondary" style={ { marginBottom: '10px' } }>
								{ 'Split Ratio:' }
							</Typography>
						</Grid>
						<Grid item container alignItems="center" spacing={ 1 }>
							<Grid item>
								<Typography variant="body2" color="text.secondary">
									A
								</Typography>
							</Grid>
							<Grid item xs>
								<div style={{ textAlign: 'center' }}>
									{ value} / { 100 - value }
								</div>
								<Slider
									value={typeof value === 'number' ? value : 0}
									onChange={handleSliderChange}
									aria-labelledby="input-slider"
								/>
							</Grid>
							<Grid item>
								<Typography variant="body2" color="text.secondary">
									B
								</Typography>
							</Grid>
						</Grid>
						<Grid item style={ { textAlign: 'left' } }>
							<Typography variant="h4" color="text.secondary" style={ { marginBottom: '15px', marginTop: '15px' } }>
								{ 'Goal Trigger:' }
							</Typography>
							<Box width="100%">
								<FormControl fullWidth>
									<InputLabel style={ { color: 'white' } }>Choose a Goal Trigger</InputLabel>
									<Select
										sx={ selectStyles }
									>
										<MenuItem value={ 1 }>Arrived to the next step</MenuItem>
									</Select>
								</FormControl>
								<FormControl fullWidth>
									<InputLabel style={ { color: 'white' } }>Choose a page</InputLabel>
									<Select
										sx={ selectStyles }
									>
										<MenuItem value={ 1 }>Home</MenuItem>
										<MenuItem value={ 2 }>Shop</MenuItem>
										<MenuItem value={ 3 }>Contact Us</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</Grid>
					</Grid>
					<Stack direction="row" alignItems="center" sx={ { my: 1 } }>
						<Stack direction="row" gap={ 3 } justifyContent="flex-end" flexGrow={ 1 }>
							<Button size="small" variant="contained" color="primary" onClick={ startTest }>
								{ __( 'Start test', 'elementor' ) }
							</Button>
						</Stack>
					</Stack>
				</>
			) }

			{ ! data.result && (
				<Box component="form" onSubmit={ handleSubmit }>
					<Box sx={ { mb: 6 } }>
						<PromptSearch
							ref={ searchField }
							placeholder={ __( 'Describe the text and tone you want to use...', 'elementor' ) }
							name="prompt"
							value={ prompt }
							onChange={ ( event ) => setPrompt( event.target.value ) }
						/>
					</Box>

					{ showSuggestions && (
						<PromptSuggestions
							suggestions={ autocompleteItems }
							onSelect={ handleSuggestion }
							suggestionFilter={ ( suggestion ) => suggestion + '...' }
						/>
					) }

					<Stack direction="row" alignItems="center" sx={ { py: 4, mt: 8 } }>
						<PromptCredits usagePercentage={ usagePercentage } />

						<Stack direction="row" justifyContent="flex-end" flexGrow={ 1 }>
							<GenerateButton>
								{ __( 'Generate text', 'elementor' ) }
							</GenerateButton>
						</Stack>
					</Stack>
				</Box>
			) }

			{ data.result && ! showTestingDiv && ! showEditDiv && (
				<Box sx={ { mt: 3 } }>
					<p style={ { marginBottom: '30px', lineHeight: '20px' } }>Choose up to two headline options:<br></br>Select one to use immediately or choose two to start an A/B test</p>

					<form className="options">
						<FormControl sx={ { m: 3 } } component="fieldset" variant="standard" style={ { width: '100%', margin: '0px' } }>
							<FormGroup>
								<FormControlLabel
									control={
										<div style={ { display: 'flex', alignItems: 'center', marginBottom: '20px', width: '100%' } }>
											<Checkbox
												checked={ checked1 }
												onChange={ handleCheckbox1Change }
											/>
											<TextField
												defaultValue={ titles[ 0 ] }
												fullWidth
												label="Option 1"
												InputProps={ {
													endAdornment: (
														<InputAdornment position="end" sx={ { marginRight: '-12px' } }>
															<div onClick={ handleEdit }>
																<IconButton size="small">
																	<EditIcon fontSize="small" />
																</IconButton>
															</div>
														</InputAdornment>
													),
												} }
											/>
										</div>
									}
								/>
								<FormControlLabel
									control={
										<div style={ { display: 'flex', alignItems: 'center', marginBottom: '20px', width: '100%' } }>
											<Checkbox
												checked={ checked2 }
												onChange={ handleCheckbox2Change }
											/>
											<TextField
												defaultValue={ titles[ 1 ] }
												fullWidth
												label="Option 2"
												InputProps={ {
													endAdornment: (
														<InputAdornment position="end" sx={ { marginRight: '-12px' } }>
															<IconButton size="small">
																<EditIcon fontSize="small" />
															</IconButton>
														</InputAdornment>
													),
												} }
											/>
										</div>
									}
								/>
								<FormControlLabel
									control={
										<div style={ { display: 'flex', alignItems: 'center', marginBottom: '20px', width: '100%' } }>
											<Checkbox
												checked={ checked3 }
												onChange={ handleCheckbox3Change }
											/>
											<TextField
												defaultValue={ titles[ 2 ] }
												fullWidth
												label="Option 3"
												InputProps={ {
													endAdornment: (
														<InputAdornment position="end" sx={ { marginRight: '-12px' } }>
															<IconButton size="small">
																<EditIcon fontSize="small" />
															</IconButton>
														</InputAdornment>
													),
												} }
											/>
										</div>
									}
								/>
								<FormControlLabel
									control={
										<div style={ { display: 'flex', alignItems: 'center', marginBottom: '20px', width: '100%' } }>
											<Checkbox
												checked={ checked4 }
												onChange={ handleCheckbox4Change }
											/>
											<TextField
												defaultValue={ titles[ 3 ] }
												fullWidth
												label="Option 4"
												InputProps={ {
													endAdornment: (
														<InputAdornment position="end" sx={ { marginRight: '-12px' } }>
															<IconButton size="small">
																<EditIcon fontSize="small" />
															</IconButton>
														</InputAdornment>
													),
												} }
											/>
										</div>
									}
								/>
							</FormGroup>
						</FormControl>
						<Stack direction="row" alignItems="center" sx={ { my: 2 } }>
							<Stack direction="row" gap={ 3 } justifyContent="flex-end" flexGrow={ 1 }>
								<div className="start-testing" style={ { display: 'none' } }>
									<Button size="small" variant="contained" color="primary" onClick={ startTesting }>
										{ __( 'Start testing', 'elementor' ) }
									</Button>
								</div>
								<div className="use-text">
									<Button size="small" variant="contained" color="primary" onClick={ applyPrompt }>
										{ __( 'Use text', 'elementor' ) }
									</Button>
								</div>
							</Stack>
						</Stack>
					</form>
				</Box>
			) }

			{ data.result && showEditDiv && (
				<Box sx={ { mt: 3 } }>
					<Textarea
						fullWidth
						ref={ resultField }
						defaultValue={ titles[ 1 ] }
						helperText={ __( 'Text generated by AI may be inaccurate or offensive.', 'elementor' ) }
					/>

					<Grid container spacing={ 3 } sx={ { mt: 6 } }>
						{
							promptActions.map( ( { label, icon, value } ) => (
								<Grid item key={ label }>
									<PromptAction label={ label } icon={ icon } onClick={ () => handleCustomInstruction( value ) } />
								</Grid>
							) )
						}
					</Grid>

					<Grid container spacing={ 3 } sx={ { mt: 6 } }>
						{
							promptInstructions.map( ( { label, options, getInstruction } ) => (
								<Grid item key={ label }>
									<PromptActionSelection
										label={ label }
										options={ options }
										onChange={ ( event ) => handleCustomInstruction( getInstruction( event.target.value ) ) }
									/>
								</Grid>
							) )
						}
					</Grid>

					<Stack direction="row" alignItems="center" sx={ { my: 8 } }>
						<PromptCredits usagePercentage={ usagePercentage } />
						<Stack direction="row" gap={ 3 } justifyContent="flex-end" flexGrow={ 1 }>
							<Button size="small" color="secondary" variant="text" onClick={ goBack } style={ { position: 'relative', right: '70%' } }>
								{ __( '< Go Back', 'elementor' ) }
							</Button>
							<Button size="small" variant="contained" color="primary" onClick={ applyPrompt }>
								{ __( 'Use text', 'elementor' ) }
							</Button>
						</Stack>
					</Stack>
				</Box>
			) }
		</>
	);
};

FormText.propTypes = {
	type: PropTypes.string.isRequired,
	controlType: PropTypes.string,
	onClose: PropTypes.func.isRequired,
	getControlValue: PropTypes.func.isRequired,
	setControlValue: PropTypes.func.isRequired,
	additionalOptions: PropTypes.object,
	credits: PropTypes.number,
	usagePercentage: PropTypes.number,
};

export default FormText;
