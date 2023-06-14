<?php
namespace Elementor\Modules\Optimentor;

use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Module extends \Elementor\Core\Base\Module {

	public function get_name() {
		return 'optimentor';
	}

	public function submit_prompt() {
		$input_text = $_POST['input_text'];
		$this->interact_with_gpt_api( $input_text );
	}

	public function interact_with_gpt_api( $input_text ) {
		// API endpoint URL
		$api_url = 'https://api.openai.com/v1/chat/completions';
		$api_key = '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';

		// API request headers
		$headers = array(
			'Authorization' => 'Bearer ' . $api_key,
			'Content-Type' => 'application/json',
		);

		// API request payload
		$data = array(
			'prompt' => $input_text,
			'max_tokens' => 100,
		);

		// Send the POST request
		$response = wp_remote_post($api_url, array(
			'headers' => $headers,
			'body' => wp_json_encode( $data ),
		));

		// Check for errors
		if ( is_wp_error( $response ) ) {
			return 'API request failed: ' . $response->get_error_message();
		}

		// Get the response body
		$body = wp_remote_retrieve_body( $response );

		// Decode the JSON response
		$json_data = json_decode( $body, true );

		// Check if the response was successful
		if ( isset( $json_data['choices'][0]['text'] ) ) {
			return $json_data['choices'][0]['text'];
		} else {
			return 'API response error: ' . $body;
		}
	}

	public function register_submit_prompt_endpoint() {
		add_action( 'rest_api_init', function () {
			register_rest_route( 'optimentor/v1', '/submit_prompt', array(
				'methods' => 'POST',
				'callback' => array( $this, 'submit_prompt' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				},
			) );
		} );
	}

	public function __construct() {
		parent::__construct();

		$this->register_submit_prompt_endpoint();
	}
}
