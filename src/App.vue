<template>
	<div id="app">
		<h1>Форма заказа воды</h1>
		<order-form />
	</div>
</template>

<script>
	import axios from 'axios'
	import OrderForm from '../src/components/OrderForm'
	export default {
		name: 'app',
		components: {
		OrderForm
		}
	}
</script>

<style>
	/* Основные стили */
	* {
		margin: 0;
		padding: 0;
	}
	*, ::after, ::before {
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		padding: 50px;
		height: 100vh;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		align-content: center;
	}
	h1, h2 {
		font-weight: normal;
		flex: 0 0 100%;
		width: 100%;
		margin-bottom: 30px;
	}
	.vue-form {
		flex: 0 0 100%;
		width: 100%;
		max-width: 500px;
	}
	.vue-textarea__inner {
		width: 100%;
	}
	.modal-backdrop
	{
		opacity:0.8;
	}	
</style>
