<template>
	<view class="box" hover-class="hoverclass">
		<text>测试文字</text>
		
			<view style="overflow-x: auto;">
				<view v-for="tab in tabs" :key="tab.id" class="tab">{{tab.text}}</view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				tabs: [
					{id: 1, text: '目录列表1'},
					{id: 2, text: '目录列表2'},
					{id: 3, text: '目录列表3'},
					{id: 4, text: '目录列表4'},
					{id: 5, text: '目录列表5'},
					{id: 6, text: '目录列表6'},
					{id: 7, text: '目录列表7'},
					{id: 8, text: '目录列表8'},
				]
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
	.tab {
		float: left;
		width:100px;
		height: 40px;
		line-height: 40px;
	}
</style>
