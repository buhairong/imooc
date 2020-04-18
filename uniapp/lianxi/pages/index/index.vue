<template>
	<view class="box" hover-class="hoverclass">
		<text>测试文字</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.box {
		border: 1px solid red;
	}
	.hoverclass {
		background:#007AFF;
	}
</style>
