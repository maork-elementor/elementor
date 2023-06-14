<?php
namespace Elementor\Modules\Payments\Widgets;

use Elementor\Widget_Base;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Optimentor extends Widget_Base {

	public function get_name() {
		return 'optimentor';
	}

	public function get_title() {
		return esc_html__( 'Optimentor', 'elementor-pro' );
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
		register_rest_route( 'optimentor/v1', '/submit_prompt', array(
			'methods' => 'POST',
			'callback' => array( $this, 'submit_prompt' ),
		) );
	}
}
