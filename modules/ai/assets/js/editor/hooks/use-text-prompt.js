import { getCompletionText, getCompletionTitles, getEditText } from '../api';
import usePrompt from './use-prompt';

const getTextResult = async ( prompt, instruction ) => {
	if ( instruction ) {
		return getEditText( prompt, instruction );
	}

	return getCompletionTitles( prompt );
};

const useTextPrompt = ( initialValue ) => {
	const promptData = usePrompt( getTextResult, initialValue );

	return promptData;
};

export default useTextPrompt;
