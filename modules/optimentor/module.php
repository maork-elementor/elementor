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

	public function __construct() {
		parent::__construct();
		add_action( 'wp_ajax_optimentor_generate_recommendations', array( $this, 'optimentor_generate_recommendations' ) );
		add_action( 'wp_ajax_nopriv_optimentor_generate_recommendations', array( $this, 'optimentor_generate_recommendations' ) );
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

	public function interact_with_gpt_api( $prompt ) {
		// API endpoint URL
		$api_url = 'https://api.openai.com/v1/chat/completions';
		$api_key = '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';

		$data = array(
			'model' => 'gpt-3.5-turbo',
			'messages' => array(
				array(
					'role' => 'system',
					'content' => 'You are a helpful assistant.',
				),
				array(
					'role' => 'user',
					'content' => $prompt,
				),
			),
		);

		$headers = array(
			'Content-Type' => 'application/json',
			'Authorization' => 'Bearer ' . $api_key,
		);

		$args = array(
			'headers' => $headers,
			'body' => json_encode( $data ),
		);

		// Send the request using wp_remote_post
		$response = wp_remote_post( $api_url, $args );

		if ( is_wp_error( $response ) ) {
			return 'Error occurred while connecting to ChatGPT API.';
		}

		$result = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( isset( $result['choices'][0]['message']['content'] ) ) {
			$answer = $result['choices'][0]['message']['content'];
			return json_decode( $answer, true );
		}

		return false;

	}

	public function optimentor_generate_recommendations() {

		global $wpdb;

		$metrics = $_POST['metrics'];
		$widgets = $_POST['widgets'];
		$post_id = $_POST['post_id'];

		$site_title = get_bloginfo( 'name' );
		$site_description = get_bloginfo( 'description' );

		$promot = '';
		// get elementor page data and search for heading widget and get the heading text sql
		$query_response = $wpdb->get_results(
			"SELECT `meta_value` FROM `wp_postmeta` WHERE `meta_key` = '_elementor_data' AND `post_id` = $post_id"
		);

		$elementor_data = $query_response[0]->meta_value;

		$elementor_data = json_decode( $elementor_data, true );

		$heading = '';

		//make this recursive later on
		foreach ( $elementor_data[0]['elements'] as $item ) {
			foreach ( $item as $key => $value ) {
				if ( 'elements' == $key ) {
					foreach ( $value as $element ) {
						if ( $element['widgetType'] == 'heading' ) {
							$heading = $element['settings']['title'];
							break;
						}
					}
				}
			}
		}

		$seo_recommendations = null;
		//loop through each metric
		foreach ( $metrics as $metric ) {
			//switch case for each metric
			switch ( $metric ) {
				case 'SEO':
					$promot .= 'I have a website named ' . $site_title . ' and it is about ' . $site_description . '. I want to improve my SEO. ';
					$promot .= 'I want to rank higher on Google. ';
					$promot .= 'This is my current page headline (h1) "' . $heading . '". ';
					$promot .= 'Please suggest me a better headline so that I can rank higher on Google.';
					$promot .= 'give me response in json format, please { new_title: "new title" , explanation: "explanation" }';
					$seo_recommendations = $this->interact_with_gpt_api( $promot );
					break;
				case 'banana':
					break;
				case 'pear':
					break;
				default:
					break;
			}
		}

		wp_send_json_success( array(
			'metrics' => $metrics,
			'widgets' => $widgets,
			'recommendations' => array(
				'seo' => $seo_recommendations,
			),
		));
	}

}
