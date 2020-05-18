<template>
	<vue-form :model="form" style="width: 100%" label-position="top" label-width="150px" ref="form">
    	<vue-form-item field="region" label="Регион">
      		<vue-select
			  	v-model="form.region"
				:data="regions"
				name="region"
				v-validate="validation.region"
				data-vv-as="Водобаза"
				@change="onRegionChange($event)"
				placeholder="Выберите регион">
        		<vue-option v-for="i in regions" :key="i.value" :value="i.value" :label="i.label"></vue-option>
      		</vue-select>
    	</vue-form-item>
    	<vue-form-item field="waterbase" label="Водобаза">
			<vue-select
				v-model="form.waterbase"
				:data="activeWaterbases"
				name="waterbase"
				v-validate="validation.waterbase"
				data-vv-as="Водобаза"
				@change="onWaterbaseChange($event)"
				placeholder="Выберите водобазу">
				<vue-option v-for="i in activeWaterbases" :key="i.value" :value="i.value" :label="i.label"></vue-option>
			</vue-select>
    	</vue-form-item>
    	<vue-form-item field="quantity" label="Количество воды">
			<vue-input
				v-model="form.quantity"
				placeholder="Введите количество воды в тоннах"
				name="quantity"
				v-validate="validation.quantity"
				data-vv-as="Количество воды"
				@input="onQuantityInput($event)"
				style="width: 100%">
			</vue-input>
    	</vue-form-item>	
    	<vue-form-item field="address" label="Адрес">
        	<vue-input
				type="textarea"
				v-model="form.address"
				name="address"
				v-validate="validation.address"
				data-vv-as="Адрес"
				@input="onAddressInput($event)"
				placeholder="Введите адрес доставки"
				style="width: 100%">
        	</vue-input>
    	</vue-form-item>
    	<vue-form-item>
      		<vue-button @click="onSubmit" type="success">Отправить</vue-button>
    	</vue-form-item>
		<b-modal ref="my-modal" hide-footer title="Форма заказа воды" class="text-center">
			<div class="d-block text-center">
				<p>Ваш заказ успешно отправлен!</p>
			</div>
		</b-modal>		
  	</vue-form>
</template>
<script>
	import axios from 'axios'
  	export default {
    data () {
      	return {
			regions: [], // Все регионы
			waterbases: [], // Все водобазы
			activeWaterbases: [], //Доступные водобазы
			// Значения полей формы по умолчанию
			form: {
				region: '',
				waterbase: '',
				quantity: '',
				address: '',
			},
			// Схема для валидации формы
			validation: {
				region: {
					required: true,
				},
				waterbase: {
					required: true,
				},
				quantity:  {
					required: true,
					decimal: 3
				},
				address: {
					required: true,
					min: 10
				},
			},
      	}
    },
    methods: {
		// Отправка формы
		async onSubmit () {
			const res = await this.$validator.validate()
			if (res) {
				// Подготавливаем объект с данными формы
				let formData = {}
				formData.region = this.getRegionByUUID(this.$store.getters.getCurrentRegion);
				formData.waterbase = this.getWaterbaseByUUID(this.$store.getters.getCurrentWaterbase);
				formData.quantity = this.$store.getters.getCurrentQuantity;
				formData.address = this.$store.getters.getCurrentAddress;
				var formDataJSON = JSON.stringify(formData);
				// Отправляем данные в API
				axios({
					url: 'api/form/create.php',
					method: 'post',
					data: formData
				})
				.then((function (response) {
					// Показываем сообщение об успешной отправке 
					this.$refs['my-modal'].show()
				}).bind(this))
				.catch(function (error) {
					// Пока просто выводим ошибку в консоль
					console.log(error);
				});
			}
		},
		// Смена региона
		onRegionChange(event) {
			// Записываем выбранный регион в хранилище
			this.$store.commit('setCurrentRegion', event)
			// Записываем водобазы, доступные для региона в хранилище
			this.$store.commit('setActiveWaterbases', this.waterbases.filter(waterbase => waterbase.region_uuid == event))
			// Обновляем доступные водобазы в data
			this.activeWaterbases = this.$store.getters.getActiveWaterbases
			// Вывод uuid региона в консоль для отладки
			console.log(this.$store.getters.getCurrentRegion)
		},
		// Смена водобазы
		onWaterbaseChange(event) {
			// Записываем выбранную водобазу в хранилище
			this.$store.commit('setCurrentWaterbase', event)
			// Вывод uuid водобазы в консоль для отладки
			console.log(this.$store.getters.getCurrentWaterbase)
		},
		// Ввод количества воды
		onQuantityInput(event) {
			// Записываем количество воды в хранилище
			this.$store.commit('setCurrentQuantity', event)
			// Вывод количества воды в консоль для отладки
			console.log(this.$store.getters.getCurrentQuantity)
		},
		// Ввод адреса
		onAddressInput(event) {
			// Записываем адрес в хранилище
			this.$store.commit('setCurrentAddress', event)
			// Вывод адреса в консоль для отладки
			console.log(this.$store.getters.getCurrentAddress)
		},
		// Запрос геолокации
		async detectGeolocation() {
			navigator.geolocation.getCurrentPosition(this.detectGeolocationSuccess, this.detectGeolocationError);
		},
		// Успешное определение геолокации
		detectGeolocationSuccess(position) {
			// Записываем текущую геолокацию в хранилище
			this.$store.commit('setCurrentPosition', position)
			// Вызываем метод для определения региона
			this.detectRegion()
		},
		// Ошибка определения геолокации
		detectGeolocationError() {
			console.log('Region detect error');
		},
		// Определяем регион
		detectRegion() {
			let currentLatitude = this.$store.getters.getCurrentPosition.coords.latitude // Текущая широта
			let currentLongitude = this.$store.getters.getCurrentPosition.coords.longitude // Текущая долгота
			axios
			.get('https://geocode-maps.yandex.ru/1.x/?apikey=45ccaf60-7908-468d-adde-66b6dca72de5&format=json&kind=locality&geocode='+currentLongitude+','+currentLatitude)
			.then(
				response => {
					// С помощью геокодера Яндекса находим ближайшие населенные пункты
					let nearLocations = response.data.response.GeoObjectCollection.featureMember
					// Отфильтровываем ближайшие пункты, сравнивая их по названиям с регионами в нашем списке регионов
					let nearLocationsKnown = nearLocations.filter((function(nearLocation) {
						// Массив для совпадений
						let currentRegionsUUIDs = [];
						this.regions.forEach((function(item) {
							if (item.area_names.indexOf(nearLocation.GeoObject.name) > -1) {
								nearLocation.GeoObject.uuid = item.uuid
								nearLocation.GeoObject.nameAlias = item.name
								// Добавляем совпадения в массив
								currentRegionsUUIDs.push(item.uuid)
							}
						}));
						if(currentRegionsUUIDs.length > 0) {
							// Отбираем населенный пункт, если есть совпадение
							return true;
						} else {
							return false;
						}
					}).bind(this));

					if (nearLocationsKnown.length > 0) {
						// Если список ближайших населенных пунктов с совпавшими названиями не пуст, устанавливаем регион
						this.setRegion(nearLocationsKnown)
					}
				}
			)
		},
		// Установка региона из ближайших населенных пунктов
		setRegion(nearLocationsKnown) {
			// Записываем выбранный регион (первый из списка) в хранилище
			this.$store.commit('setCurrentRegion', nearLocationsKnown[0].GeoObject.uuid)
			// Записываем водобазы, доступные для региона в хранилище
			this.$store.commit('setActiveWaterbases', this.waterbases.filter(waterbase => waterbase.region_uuid == nearLocationsKnown[0].GeoObject.uuid))
			// Обновляем доступные водобазы в data
			this.activeWaterbases = this.$store.getters.getActiveWaterbases
			// Устанавливаем значение поля Регион
			this.form.region = nearLocationsKnown[0].GeoObject.uuid
			// Вывод uuid региона в консоль для отладки
			console.log(this.$store.getters.getCurrentRegion)
		},
		// Получение всех данных региона по uuid
		getRegionByUUID(uuid) {
			return this.regions.filter(
				region => region.uuid == uuid
			)
		},
		// Получение всех данных водобазы по uuid
		getWaterbaseByUUID(uuid) {
			return this.waterbases.filter(
				waterbase => waterbase.uuid == uuid
			)
		},
		// Подготовка валидатора формы
		prepareValidator() {
			// Словарь с кастомными сообщениями валидатора
			const validatorDictionary = {
				custom: {
					region: {
						required: 'Выберите регион',
					},
					waterbase: {
						required: 'Выберите водобазу',
					},
					quantity:  {
						required: 'Введите количество воды в тоннах',
						decimal: 'Допустимые символы: цифры и точка'
					},
					address: {
						required: 'Введите адрес доставки',
						min: 'Количество символов должно быть не менее 10'
					},
				}
			};
			// Заменяем стандартные фразы на кастомные
			this.$validator.localize('ru', validatorDictionary);
		}
    },
	mounted() {
		// Подгружаем регионы из файла
		axios
		.get('json/regions.json')
		.then(
			response => {
				this.regions = response.data.data
				this.regions.forEach(function(item) {
					// Добавляем поля для генерации селектов в форме
					item['label'] = item['name']
					item['value'] = item['uuid']
				})
				// Запрускаем определение геолокации
				this.detectGeolocation()
			}
		)
		// Подгружаем водобазы из файла
		axios
		.get('json/waterbases.json')
		.then(
			response => {
				this.waterbases = response.data.data
				this.waterbases.forEach(function(item) {
					// Добавляем поля для генерации селектов в форме
					item['label'] = item['name']
					item['value'] = item['uuid']
				})
			}
		)
		// Запускаем подготовку валидатора формы
		this.prepareValidator()
	},
  }
</script>