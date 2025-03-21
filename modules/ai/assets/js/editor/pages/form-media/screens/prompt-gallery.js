import { useMemo, useEffect } from 'react';
import { Box, Stack, ImageList, ImageListItem, IconButton, Typography, Button, Tooltip } from '@elementor/ui';
import Loader from '../../../components/loader';
import useImagesPreload from '../../../hooks/use-images-preload';
import { IMAGE_PROMPT_SETTINGS } from '../consts/consts';
import useSessionStorage from '../../../hooks/use-session-storage';
import Overlay from '../../../components/ui/overlay';
import OverlayBar from '../../../components/ui/overlay-bar';
import CopyIcon from '../../../icons/copy-icon';
import DownloadIcon from '../../../icons/download-icon';

const shuffleImages = ( images ) => {
	return images
		.map( ( image ) => [ Math.random(), image ] )
		.sort( ( [ a ], [ b ] ) => a - b )
		.map( ( [ , image ] ) => image );
};

const PromptGallery = ( {
	maybeUploadImage,
	setPrompt,
	selectedCategory,
	updatePromptSettings,
} ) => {
	const { data, setStateAndSessionData } = useSessionStorage( 'ai-image-gallery', { images: [] } );
	const { imagesPreloaded, preloadImages } = useImagesPreload( 'thumbnailUrl' );

	const imagesToRender = useMemo( () => {
		const shuffledImages = shuffleImages( data.images );

		if ( ! selectedCategory ) {
			return shuffledImages;
		}

		const categoryImages = shuffledImages.filter( ( { imageType } ) => imageType.includes( selectedCategory ) );

		// Some categories don't have images, so we TEMPORARLY fallback to the shuffled images.
		return categoryImages.length ? categoryImages : shuffledImages;
	}, [ selectedCategory ] );

	const fetchJson = () => {
		fetch( 'https://my.elementor.com/ai/images-prompt-gallery/ai-gallery.json' )
			.then( ( response ) => response.json() )
			.then( ( json ) => setStateAndSessionData( json ) )
			.catch( ( e ) => console.log( e.message ) );
	};

	useEffect( () => {
		if ( 0 === data?.images.length ) {
			fetchJson();
			return;
		}

		preloadImages( data.images );
	}, [ data ] );

	if ( ! imagesPreloaded ) {
		return (
			<Box sx={ { width: '100%', maxWidth: 600, margin: '0 auto', alignSelf: 'center' } }>
				<Loader color="inherit" />
			</Box>
		);
	}

	return (
		<Box sx={ { overflowY: 'scroll', p: 10 } } flexGrow={ 1 }>
			<Stack gap={ 4 } sx={ { mb: 7 } }>
				<Typography variant="h6">{ __( 'Ideas for you', 'elementor' ) }</Typography>
				<Typography variant="body1">{ __( 'Check out these images and the prompts used to create them.', 'elementor' ) }</Typography>
			</Stack>

			<ImageList width="100%" cols={ 3 } gap={ 24 }>
				{
					imagesToRender.map( ( suggestedPrompt ) => {
						return (
							<ImageListItem key={ suggestedPrompt.prompt }>
								<img
									src={ `${ suggestedPrompt.thumbnailUrl }` }
									alt={ suggestedPrompt.prompt }
									style={ { width: '100%', maxHeight: '238px' } }
								/>

								<Overlay>
									<OverlayBar gap={ 3 } position="bottom">
										<Typography variant="caption" color="common.white">{ suggestedPrompt.prompt }</Typography>

										<Box display="flex" justifyContent="space-between" alignItems="center">
											<Button
												fullWidth
												size="small"
												variant="contained"
												startIcon={ <DownloadIcon /> }
												onClick={ () => maybeUploadImage( suggestedPrompt, true ) }
											>
												{ __( 'Use Image', 'elementor' ) }
											</Button>

											<Tooltip title={ __( 'Copy prompt', 'elementor' ) }>
												<IconButton sx={ { mr: -4, ml: 2, color: 'common.white', '&:hover': { color: 'common.white' } } } onClick={ () => {
													setPrompt( suggestedPrompt.prompt );
													const [ stylePreset, imageType ] = suggestedPrompt.imageType.split( '/' );
													updatePromptSettings( {
														[ IMAGE_PROMPT_SETTINGS.STYLE_PRESET ]: stylePreset,
														[ IMAGE_PROMPT_SETTINGS.IMAGE_TYPE ]: imageType,
													} );
												} }>

													<CopyIcon />
												</IconButton>
											</Tooltip>
										</Box>
									</OverlayBar>
								</Overlay>
							</ImageListItem>
						);
					} )
				}
			</ImageList>
		</Box>
	);
};

PromptGallery.propTypes = {
	maybeUploadImage: PropTypes.func,
	setPrompt: PropTypes.func,
	selectedCategory: PropTypes.string,
	updatePromptSettings: PropTypes.func,
};

export default PromptGallery;
