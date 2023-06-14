<?php
namespace Elementor\Modules\Optimentor;

use Elementor\Plugin;
use ElementorPro\Core\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Module extends \Elementor\Core\Base\Module {

	public function get_name() {
		return 'optimentor';
	}

	public function submit_prompt( $request ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$data = Utils::_unstable_get_super_global_value( $_POST, 'data' );

		$json_data = $request->get_param( 'json_data' );
		// Process the JSON data as needed
		// Example: Convert JSON data to an array
		$data_array = json_decode( $json_data, true );

		// Perform additional actions or operations with the data

		// Return a response
		$response = array(
			'success' => true,
			'message' => 'JSON data received and processed successfully',
			'data' => $data_array,
		);

		$this->interact_with_gpt_api( $data );
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
		) );

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
			register_rest_route( 'optimentor/v1', '/submit_prompt/', array(
				'methods' => 'POST',
				'callback' => 
				'permission_callback' => function () {
					return current_user_can( 'edit_others_posts' );
				},
			) );
	}

	public function __construct() {
		parent::__construct();
		add_action( 'rest_api_init', 'register_prompt_submit_endpoint' );
	}
}
