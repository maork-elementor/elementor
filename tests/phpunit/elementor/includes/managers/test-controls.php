<?php
namespace Elementor\Testing\Includes\Managers;

use Elementor\Controls_Manager;
use Elementor\Plugin;
use Elementor\Tests\Phpunit\Includes\Base\Mock\Mock_Widget;
use ElementorEditorTesting\Elementor_Test_Base;

class Test_Controls extends Elementor_Test_Base {

	static $responsive_control_desktop_mock = [
		'name' => 'desktop_mock',
	];

	static $responsive_control_tablet_mock = [
		'name' => 'tablet_mock',
		'responsive' => [
			'max' => 'tablet',
		],
	];

	public function setUp() {
		parent::setUp();

		// Force controls cache to reset.
		Plugin::$instance->controls_manager = new Controls_Manager();
	}

	public function test_get_responsive_control_device_suffix_desktop() {
		$device_suffix = Controls_Manager::get_responsive_control_device_suffix( static::$responsive_control_desktop_mock );

		$this->assertEquals( '', $device_suffix );
	}

	public function test_get_responsive_control_device_suffix_tablet() {
		$device_suffix = Controls_Manager::get_responsive_control_device_suffix( static::$responsive_control_tablet_mock );

		$this->assertEquals( '_tablet', $device_suffix );
	}

	public function test_delete_stack() {
		// Arrange
		$widget = new Mock_Widget( [
			'settings' => [],
			'id' => '1',
		], [] );

		// Act
		Plugin::$instance->controls_manager->open_stack( $widget );

		// Assert
		$this->assertNotEmpty( Plugin::$instance->controls_manager->get_stacks( $widget->get_unique_name() ) );

		// Act
		Plugin::$instance->controls_manager->delete_stack( $widget );

		// Assert
		$this->assertNull( Plugin::$instance->controls_manager->get_stacks( $widget->get_unique_name() ) );
	}

	public function test_clear_stack_cache() {
		// Arrange
		$stacks_mock = [
			'button' => [
				'controls' => [
					'border_border' => [
					'type'=>'select',
					'tab'=>'style',
					'section'=>'section_style',
					'label'=>'Border Type',
					'options'=>[''=>'Default'],
					'none'=>'None',
					'solid'=>'Solid',
					'double'=>'Double',
					'dotted'=>'Dotted',
					'dashed'=>'Dashed',
					'groove'=>'Groove',
					'selectors'=>['{{WRAPPER}} .elementor-button'=>'border-style: {{VALUE}};'],
					'separator'=>'before',
					'classes'=>'elementor-group-control-border elementor-group-control elementor-group-control-border',
					'name'=>'border_border',
					'default'=>''
					],
				],
			],
		];

		$widget = new Mock_Widget( [
			'settings' => [],
			'id' => '1',
		], $stacks_mock );

		// Act
		Plugin::$instance->controls_manager->open_stack( $widget );

		// Assert
		$stacks = Plugin::$instance->controls_manager->get_stacks();
		$this->assertNotEmpty( $stacks );

		// Assert
		$stack_cache_has_been_cleared = Plugin::$instance->controls_manager->has_stacks_cache_been_cleared();
		$this->assertFalse( $stack_cache_has_been_cleared );

		// Act
		if ( ! $stack_cache_has_been_cleared ) {
			Plugin::$instance->controls_manager->clear_stack_cache();
		}

		// Assert
		$stack_cache_has_been_cleared = Plugin::$instance->controls_manager->has_stacks_cache_been_cleared();
		$this->assertTrue( $stack_cache_has_been_cleared );

		// Assert
		$stacks = Plugin::$instance->controls_manager->get_stacks();
		$this->assertEmpty( $stacks );
	}
}
