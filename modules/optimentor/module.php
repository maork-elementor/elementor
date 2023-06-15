<?php
namespace Elementor\Modules\Optimentor;

use Elementor\Plugin;
use ElementorPro\Core\Utils;
use phpDocumentor\Reflection\DocBlock\Tags\Var_;

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
		add_action( 'elementor/frontend/before_render', array( $this, 'randomize_test' ) );
		add_action( 'init', array( $this, 'start_session' ) );
	}

	public function start_session() {
		session_start();
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
		$api_key = '';

		$data = array(
			'model' => 'gpt-3.5-turbo',
			'messages' => array(
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
			'timeout' => 500,
		);

		// Send the request using wp_remote_post
		$response = wp_remote_post( $api_url, $args );

		if ( is_wp_error( $response ) ) {
			return 'Error occurred while connecting to ChatGPT API.';
		}

		$result = json_decode( wp_remote_retrieve_body( $response ), true );

		// var_dump( $result['choices'][0]['message']['content'] );

		if ( isset( $result['choices'][0]['message']['content'] ) ) {
			return $result['choices'][0]['message']['content'];
		}

		return false;
	}

	public function optimentor_generate_recommendations() {

		global $wpdb;

		$metrics = $_POST['metrics'];
		$widget = $_POST['widget'];
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

		$recommendations = [];

		$widget_settings = [];

				//make this recursive later on
		foreach ( $elementor_data[0]['elements'] as $item ) {
			foreach ( $item as $key => $value ) {
				if ( 'elements' == $key ) {
					foreach ( $value as $element ) {

						if ( $element['widgetType'] == $widget ) {
							foreach ( $element['settings'] as $key => $value ) {
								//if  $value is not array
								if ( ! is_array( $value ) ) {
									if ( 'title' === $key || 'size' === $key ) {
										continue;
									}
									$widget_settings[ $key ] = $value;
								}
							}
							break;
						}
					}
				}
			}
		}

		$promot .= 'You are a helpful UI UX designer. I have a website named ' . $site_title . ' and it is about ' . $site_description . '.\n\n';
		$promot .= 'I will give you a list of css properties that i currently have on my title, please suggest me a better UI UX for my title. \n\n';
		$promot .= '4 different styles for my title please. feel free to change all the properties but please keep in mind my website';
		$promot .= ' name and description and make the style to match my website niche and client base. \n\n';
		$promot .= 'My main goal is to improve my conversion rate and user engagement. \n\n';
		$promot .= 'if you change the font family please use browser supported font \n\n';
		$promot .= 'provide me 4 different styles in JSON format \n\n';
		$promot .= 'in this format: \n\n';
		$promot .= '{xxx:xxx,xxx:xxx},{xxx:xxx,xxx:xxx} \n\n';
		$promot .= 'The current css properties for my title are: \n\n	';

		foreach ( $widget_settings as $key => $value ) {
			$promot .= $key . ': ' . $value . '\n';
		}

		$promot .= 'give me response in json format, please so i will be able to parse it and add the styles to my title. \n';

		$widget_recomandations = $this->interact_with_gpt_api( $promot );

		// Use regex to match JSON strings
		preg_match_all( '/\{(?:[^{}]|(?R))*\}/x', $widget_recomandations, $matches );

		$json_arrays = [];

		// Loop over matches and json_decode each one
		foreach ( $matches[0] as $match ) {
			$json_arrays[] = json_decode( $match, true );
		}

		$recommendations[ $widget ] = $json_arrays;

		//loop through each metric

		wp_send_json_success( array(
			'metrics' => $metrics,
			'widgets' => $widgets,
			'recommendations' => array(
				'widget' => $widget,
				'data' => $recommendations,
			),
		));
	}

	public function randomize_test() {

		$page_id = get_the_ID();
		// Generate a random number between 0 and 1
//		unset( $_SESSION['elementor_ab_test_title'] );
		if ( ! isset( $_SESSION['elementor_ab_test_title'] ) ) {
			$random_number = wp_rand( 0, 1 );
			$_SESSION['elementor_ab_test_title'] = $random_number . '_' . $page_id;
		}
	}
}
