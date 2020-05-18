import Vue from 'vue'
import Vuex from 'vuex';
import "regenerator-runtime";
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import VFC from 'vfc'
import 'vfc/dist/vfc.css'
import App from './App.vue'


Vue.use(BootstrapVue) //Используем Bootstrap для некоторых стилей
Vue.use(VFC) // Используем Vue Form Component для создания форм
Vue.use(Vuex); // Используем Vuex для хранения состояния формы

const store = new Vuex.Store({
	state: {
		currentRegion: '', // Храним текущий регион
		activeWaterbases: '', // Храним доступные водобазы
		currentWaterbase: '', // Храним текущую водобазу
		currentQuantity: '', // Храним текущее количество воды
		currentAddress: '', // Храним текущий адрес
		currentPosition: '', // Храним текущую геолокацию
	},
	// Геттеры и мутации для объектов состояния
	getters: {
		getCurrentRegion: state => {
			return state.currentRegion;
		},
		getActiveWaterbases: state => {
			return state.activeWaterbases;
		},
		getCurrentWaterbase: state => {
			return state.currentWaterbase;
		},
		getCurrentAddress: state => {
			return state.currentAddress;
		},
		getCurrentQuantity: state => {
			return state.currentQuantity;
		},
		getCurrentPosition: state => {
			return state.currentPosition;
		},
	},
	mutations: {
		setCurrentRegion(state, region) {
			state.currentRegion = region
		},
		setActiveWaterbases(state, waterbases) {
			state.activeWaterbases = waterbases
		},
		setCurrentWaterbase(state, waterbase) {
			state.currentWaterbase = waterbase
		},		
		setCurrentQuantity(state, quantity) {
			state.currentQuantity = quantity
		},		
		setCurrentAddress(state, address) {
			state.currentAddress = address
		},		
		setCurrentPosition(state, position) {
			state.currentPosition = position
		},		
	}
})

new Vue({
	el: '#app',
	store,
	render: h => h(App)
})
