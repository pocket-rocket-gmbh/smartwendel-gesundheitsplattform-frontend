<template>
	<div class="component is-dark-grey">
		<div v-if="loading">
			<LoadingSpinner></LoadingSpinner>
		</div>
		<div v-else>
			<v-icon>mdi-map-marker</v-icon>
			<span v-if="address?.road">&nbsp; {{ address?.road }},</span>
			<span v-if="address?.house_number">&nbsp; {{ address?.house_number }},</span>
			<span v-if="address?.postcode">&nbsp; {{ address?.postcode }}</span>
			<span v-if="address?.city_district">&nbsp; {{ address?.city_district }},</span>
			<span v-if="address?.town">&nbsp; {{ address?.town }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from 'axios';

const config = useRuntimeConfig();

const props = defineProps<{
	lat: number;
	long: number;
	itemId: string | null;
}>();

const loading = ref(false);

const address = ref<any>({});

watch(props, () => {
	setAddress();
	getCareFacility();
});

const api = useCollectionApi();
api.setBaseApi(usePrivateApi());

const getCareFacility = async () => {
	loading.value = true;
	api.setEndpoint(`care_facilities/${props.itemId}`);
	await api.getItem();
	loading.value = false;
};

const setAddress = async () => {
	setTimeout(async () => {
		const { data } = await axios.get(
			`https://geocode.maps.co/reverse?lat=${props.lat}&lon=${props.long}&api_key=${config.public.GEOCODE_API_KEY}`
		);
		address.value = data.address;
	}, 2000);
};

onMounted(() => {
	setAddress();
});
</script>

<style lang="scss" scoped></style>
