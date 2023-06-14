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

	public function __construct() {
		parent::__construct();
	}
}
