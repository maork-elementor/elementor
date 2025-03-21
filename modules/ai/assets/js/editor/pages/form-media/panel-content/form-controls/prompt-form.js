import { IMAGE_PROMPT_SETTINGS, IMAGE_PROMPT_CATEGORIES } from '../../consts/consts';
import PromptActionSelection from '../../../../components/prompt-action-selection';
import { FormControl, Slider, Stack, TextField, Box, Typography } from '@elementor/ui';
import useSessionStorage from '../../../../hooks/use-session-storage';

const getPromptPlaceholder = ( data ) => {
	if ( ! data?.images?.length ) {
		return __( 'describe your image', 'elementor' );
	}

	const { images } = data;

	const randomImage = images[ Math.floor( Math.random() * images.length ) ];

	return randomImage.prompt;
};

const PromptForm = ( {
	promptSettings,
	updatePromptSettings,
	prompt = '',
	setPrompt,
	panelActive,
	hasImage = false,
} ) => {
	const selectedCategory = IMAGE_PROMPT_CATEGORIES.find( ( category ) => category.key === promptSettings[ IMAGE_PROMPT_SETTINGS.STYLE_PRESET ] ) || { subCategories: {} };

	const { data } = useSessionStorage( 'ai-image-gallery' );

	const placeholderInitialValue = getPromptPlaceholder( data );

	return <>
		{
			hasImage && (
				<FormControl sx={ { width: '100%', mb: 8 } }>
					<Slider
						onChange={ ( _, value ) => updatePromptSettings( { [ IMAGE_PROMPT_SETTINGS.IMAGE_STRENGTH ]: value } ) }
						id={ 'image_strength' }
						name={ 'image_strength' }
						aria-label={ __( 'Reference strength', 'elementor' ) }
						defaultValue={ 45 }
						getAriaValueText={ ( value ) => `${ value }%` }
						valueLabelDisplay="auto"
						step={ 10 }
						marks
						min={ 0 }
						max={ 100 }
						color="secondary"
					/>

					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="caption">{ __( 'Prompt', 'elementor' ) }</Typography>

						<Typography variant="caption">{ __( 'Reference image', 'elementor' ) }</Typography>
					</Box>
				</FormControl>
			)
		}

		<Stack gap={ 6 }>
			<PromptActionSelection
				wrapperStyle={ { width: '100%' } }
				label={ __( 'Image type', 'elementor' ) }
				options={ IMAGE_PROMPT_CATEGORIES.map( ( category ) => {
					return { label: category.label, value: category.key };
				} ) }
				onChange={ ( event ) => updatePromptSettings( { [ IMAGE_PROMPT_SETTINGS.STYLE_PRESET ]: event.target.value } ) }
				value={ promptSettings[ IMAGE_PROMPT_SETTINGS.STYLE_PRESET ] || '' }
			/>

			<PromptActionSelection
				wrapperStyle={ { width: '100%' } }
				label={ __( 'Style', 'elementor' ) }
				options={
					Object.entries( selectedCategory.subCategories ).map( ( [ value, label ] ) => {
						return { label, value };
					} ) }
				onChange={ ( event ) => updatePromptSettings( { [ IMAGE_PROMPT_SETTINGS.IMAGE_TYPE ]: event.target.value } ) }
				value={ promptSettings[ IMAGE_PROMPT_SETTINGS.IMAGE_TYPE ] || '' }
			/>

			<TextField
				multiline
				rows={ 6 }
				disabled={ ! panelActive }
				placeholder={ placeholderInitialValue }
				onChange={ ( event ) => setPrompt( event.target.value ) }
				value={ prompt }
			>
			</TextField>
		</Stack>
	</>;
};

PromptForm.propTypes = {
	panelActive: PropTypes.bool,
	prompt: PropTypes.string,
	setPrompt: PropTypes.func,
	promptSettings: PropTypes.object,
	updatePromptSettings: PropTypes.func,
	hasImage: PropTypes.bool,
};

export default PromptForm;
