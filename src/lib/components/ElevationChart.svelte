<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import zoomPlugin from 'chartjs-plugin-zoom';
	import type { ElevationProfile } from '$lib/api';

	export let profile: ElevationProfile;
	const dispatch = createEventDispatcher();
	let container: HTMLCanvasElement;
	let chart: Chart;
	const labels = profile.ms.map((m) => m.toFixed(0));
	const data = profile.elevations;

	function getNavigatorLanguage() {
		if (navigator.languages && navigator.languages.length) {
			return navigator.languages[0];
		} else {
			return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
		}
	}

	const formatter = Intl.NumberFormat(getNavigatorLanguage(), {
		notation: 'compact'
	});

	const tooltip = {
		yAlign: 'bottom',
		callbacks: {
			title: (chart) => {
				dispatch('hover', chart[0].dataIndex);
				console.log(chart[0].dataIndex);
			}
		}
	};
	const config = {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					data: data,
					borderWidth: 1,
					pointRadius: 0.2,
					pointHitRadius: 25,
					borderColor: 'rgb(0, 0, 0)'
				}
			]
		},
		plugins: [
			{
				id: 'mouseOut',
				beforeEvent(chart, args, pluginOptions) {
					const event = args.event;
					if (event.type == 'mouseout') {
						console.log('mouseout');
						dispatch('unhover');
					}
				}
			}
		],
		options: {
			indexAxis: 'x',
			scales: {
				y: {
					position: 'right',
					ticks: {
						font: {
							size: 10
						},
						padding: 5,
						callback: (value) => {
							return formatter.format(value);
						}
					}
				},
				x: {
					beginAtZero: true,
					ticks: {
						font: {
							size: 10
						},
						padding: 5,
						callback: (value) => {
							return formatter.format(value);
						}
					}
				}
			},
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				decimation: {
					enabled: true
				},
				tooltip: tooltip,

				zoom: {
					zoom: {
						wheel: {
							enabled: true
						},
						pinch: {
							enabled: true
						},
						mode: 'x'
					},
					pan: {
						enabled: true,
						mode: 'x'
					}
				},
				legend: {
					display: false
				}
			}
		}
	};

	onMount(() => {
		Chart.register(zoomPlugin);
		const c = container.getContext('2d');
		chart = new Chart(c, config);
	});
</script>

<div class="chart">
	<canvas id="chart" bind:this={container} />
</div>

<style>
	.chart {
		position: relative;
		height: 20vh;
		width: 100%;
		background-color: var(--color-white);
	}
</style>
