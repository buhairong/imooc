<template>
	<view class="content">
		<view class="todo-header" v-if="list.length">
			<!-- 状态栏左侧 -->
			<view class="todo-header__left">
				<text class="active-text">{{text}}</text>
				<text>{{listDate.length}}条</text>
			</view>
			<!-- 状态栏右侧 -->
			<view class="todo-header__right">
				<view 
				class="todo-header__right-item" 
				:class="{'active-tab': activeIndex === 0}"
				@click="tab(0)">全部</view>
				<view class="todo-header__right-item" :class="{'active-tab': activeIndex === 1}" @click="tab(1)">待办</view>
				<view class="todo-header__right-item" :class="{'active-tab': activeIndex === 2}" @click="tab(2)">已完成</view>
			</view>
		</view>
		<view v-if="!list.length" class="default">
			<view class="image-default">
				<image src="../../static/default.png" mode="aspectFit"></image>
			</view>
			<view class="default-info">
				<view class="default-info__text">您还没有创建待办事项</view>
				<view class="default-info__text">点击下方+号创建</view>
			</view>
		</view>
		<view class="todo-content" v-else>
			<view class="todo-list" 
			v-for="item in listDate" 
			:key="item.id"
			:class="{'todo--finish': item.isDone}" 
			@click="finish(item.id)">
				<view class="todo-list__checkbox">
					<view class="checkbox"></view>
				</view>
				<view class="todo-list__content">
					{{item.content}}
				</view>
			</view>
		</view>
		<!-- 创建按钮 -->
		<view class="create-todo" @click="create">
			<text class="iconfont icon-add"></text>
		</view>
		<!-- 输入框 -->
		<view class="create-content" v-show="active">
			<view class="create-content-box">
				<view class="create-input">
					<input type="text" placeholder="请输入待办事项" v-model="value">
				</view>
				<view class="create-button" @click="add">
					创建
				</view>
			</view>			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				active: false,
				value: '',
				activeIndex: 0,
				text: '全部'
			}
		},
		onLoad() {

		},
		computed: {
			listDate() {
				let list = JSON.parse(JSON.stringify(this.list))
				if(this.activeIndex === 0) {
					this.text = '全部'
					return list
				}
				
				if(this.activeIndex === 1) {
					this.text = '待办'
					return list.filter(item => !item.isDone)
				}
				
				if(this.activeIndex === 2) {
					this.text = '已完成'
					return list.filter(item => item.isDone)
				}
				
				return list
			}
		},
		methods: {
			// 打开输入框
			create() {
				this.active = true
			},
			add() {
				const val = this.value.trim()
				if(!val) {
					uni.showToast({						
						title: '请输入内容',
						icon: 'none'
					})
					return
				}
				this.list.unshift({
					id: new Date().getTime(),
					content: val,
					isDone: false
				})
				this.value = ''
				this.active = false
			},
			finish(id) {
				this.list.map(item => {
					if(item.id === id) {
						item.isDone = !item.isDone
					}
					return item
				})
			},
			tab(index) {
				this.activeIndex = index
			}
		}
	}
</script>

<style>
	@import "../../common/icon.css";
	
	.todo-header {
		position: fixed;
		top: 44px;
		left: 0;
		z-index: 10;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 0 15px;
		font-size: 12px;
		color: #333;
		height: 45px;
		box-shadow: -1px 1px 5px 0 rgba(0, 0, 0, .1);
		background: #fff;
	}		
	.todo-header__left {
		width: 100%;
	}
	.todo-header__right {
		display: flex;
		flex-shrink: 0;
	}
	.todo-header__right-item {
		padding: 0 5px;
	}
	.active-tab {
		color: #279abf;
	}
	.active-text {
		font-size: 14px;
		color: #279abf;
		padding-right: 10px;
	}
	.todo-content {
		position: relative;
		padding-top: 50px;
		padding-bottom: 100px;
	}
	.todo-list {
		position: relative;
		padding: 15px;
		margin: 15px;
		color: #0c3854;
		font-size: 14px;
		border-radius: 10px;
		background: #cfebfd;
		box-shadow: -1px 1px 5px 1px rgba(0, 0, 0, .1), -1px 2px 1px 0 rgba(255, 255, 255) inset;
		overflow: hidden;
		display: flex;
	}
	.todo-list::after{
		position: absolute;
		content: '';
		top: 0;
		bottom: 0;
		left: 0;
		width: 5px;
		background: #91d1e8;
	}
	.checkbox {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #fff;
		margin-right: 10px;
		box-shadow: 0 0 5px 1px rgba(0, 0, 0, .1);
	}
	.todo--finish .checkbox {
		position: relative;
		background: #eee;
	}
	.todo--finish .checkbox::after {
		content: '';
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		background: #CFEBFD;
		box-shadow: 0 0 2px 0 rgba(0, 0, 0, .2) inset;
	}
	.todo--finish .todo-list__content {
		color: #999;
	}
	.todo--finish{
		position: relative;
	}
	.todo--finish::before {
		content: '';
		position: absolute;		
		height: 2px;
		background: #bdcdd8;
		top: 0;
		bottom: 0;
		left: 40px;
		right: 10px;
		margin: auto 0;
	}
	.todo--finish::after{
		background: #ccc;
	}
	.create-todo {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 20px;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: #deeff5;
		box-shadow: -1px 1px 5px 2px rgba(0, 0, 0, .1), -1px 1px 1px 0 rgba(255, 255, 255) inset;
	}
	.icon-add {
		font-size: 30px;
		color: #add8e6;
	}
	.create-content{
		position: fixed;
		bottom: 95px;
		left: 20px;
		right: 20px;
	}
	.create-content-box {
		display: flex;
		align-items: center;		
		margin: 0 auto;
		padding-left: 15px;
		border-radius: 50px;
		background: #DEEFF5;
		box-shadow: -1px 1px 5px 2px rgba(0, 0, 0, .1), -1px 1px 1px 0 rgba(255, 255, 255) inset;
	}
	.create-input {
		width: 100%;
		padding-right: 15px;
		color: #add8e6;			
	}
	.create-button {
		flex-shrink: 0;
		width: 80px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		border-radius: 50px;
		font-size: 16px;
		color: #88d4ec;
		box-shadow: -2px 0 2px 1px rgba(0, 0, 0, .1);
	}
	.create-content::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -8px;
		margin: 0 auto;
		width: 20px;
		height: 20px;
		background: #DEEFF5;
		transform: rotate(45deg);
		box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, .1);
		z-index: -1;
	}
	.create-content-box::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -8px;
		margin: 0 auto;
		width: 20px;
		height: 20px;
		background: #DEEFF5;
		transform: rotate(45deg);
	}
	.default {
		padding-top: 100px;
	}
	.image-default {
		display: flex;
		justify-content: center;
	}
	.image-default image {
		width: 100%;
	}
	.default-info {
		text-align: center;
		font-size: 14px;
		color: #ccc;
	}
</style>
