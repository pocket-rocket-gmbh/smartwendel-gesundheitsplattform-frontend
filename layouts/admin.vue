<template>
	<v-app v-if="useUser().currentUser">
		<div @click.stop="drawer = !drawer" class="d-flex justify-start">
			<v-icon size="x-large" class="is-dark-grey">mdi-menu-close</v-icon>
		</div>
		<v-navigation-drawer v-model="drawer">
			<div @click.stop="drawer = !drawer" class="d-flex justify-end">
				<v-icon size="x-large" class="is-dark-grey">mdi-backburger</v-icon>
			</div>
			<div class="d-flex">
				<router-link to="/">
					<img class="mt-3 ml-4" src="~/assets/images/logo.png" width="200" />
				</router-link>
			</div>
			<v-list-item>
				<v-list-item-title class="general-font-size is-dark-grey font-weight-bold my-1 mb-5">
					Gesundheitsplattform
				</v-list-item-title>
				<v-list-item-subtitle class="has-lk-logo my-1">
					<img :src="logo" width="40" />
					Smart Wendeler Land
				</v-list-item-subtitle>
			</v-list-item>
			<v-divider></v-divider>
			<div v-if="!useUser().statusOnHealthScope()" class="d-flex align-center">
				<v-alert type="info" density="compact" color="grey">
					Du bist zur Zeit in Prüfung und nicht freigegeben.
					<v-tooltip location="top" width="200">
						<template v-slot:activator="{ props }">
							<v-icon class="is-clickable" v-bind="props">mdi-information-outline</v-icon>
						</template>
						<span>
							Der Landkreis prüft momentan deine Kontaktdaten, sowie die Daten deiner Einrichtung.
							Nach erfolgreichem Abschluss wirst du freigeschaltet. Du kannst weiterhin deine
							Inhalte pflegen.
						</span>
					</v-tooltip>
				</v-alert>
			</div>
			<v-list dense nav>
				<template v-if="useUser().isAdmin()">
					<v-list-item
						link
						to="/admin/matomo"
						nuxt
						class="general-font-size is-dark-grey"
						prepend-icon="mdi-arrow-left"
					>
						Zu den Statistiken
					</v-list-item>
					<v-divider></v-divider>
					<v-list-item link to="/admin" nuxt class="general-font-size is-dark-grey">
						Admin-Bereich
					</v-list-item>
					<v-divider></v-divider>
					<v-list-item
						link
						to="/admin/filter/facilities"
						nuxt
						class="general-font-size is-dark-grey"
					>
						Einrichtungsfilter
					</v-list-item>
					<v-list-item link to="/admin/filter/courses" nuxt class="general-font-size is-dark-grey">
						Kursfilter
					</v-list-item>
					<v-divider></v-divider>
					<v-list-item link to="/admin/categories" nuxt class="general-font-size is-dark-grey">
						Bereiche und Kategorien
					</v-list-item>
					<v-divider></v-divider>
				</template>

				<template v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')">
					<v-list-item nuxt to="/admin/news">Neuigkeiten</v-list-item>
					<v-list-item nuxt to="/admin/cultural-providers">Kulturanbieter</v-list-item>
					<v-list-item nuxt to="/admin/projects">Projekte</v-list-item>
					<v-list-item nuxt to="/admin/events">Veranstaltungen</v-list-item>
					<v-list-item nuxt to="/admin/cultural-exchange">Kulturbörse</v-list-item>
				</template>
				<!-- <v-list-item link to="/admin/care_facilities" nuxt class="general-font-size is-dark-grey">
					<span v-if="useUser().isFacilityOwner()">Meine Einrichtung</span>
					<span v-else>Einrichtungen</span>
				</v-list-item>
				<v-list-item
					:disabled="!setupFinished"
					link
					to="/admin/courses"
					nuxt
					v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
					class="general-font-size is-dark-grey"
				>
					<span v-if="useUser().isFacilityOwner()">Meine Kurse</span>
					<span v-else>Kurse</span>
				</v-list-item>
				<v-list-item
					:disabled="!setupFinished"
					link
					to="/admin/events"
					nuxt
					v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
					class="general-font-size is-dark-grey"
				>
					<span v-if="useUser().isFacilityOwner()">Meine Veranstaltungen</span>
					<span v-else>Veranstaltungen</span>
				</v-list-item>
				<v-list-item
					:disabled="!setupFinished"
					link
					to="/admin/news_articles"
					nuxt
					v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
					class="general-font-size is-dark-grey"
				>
					<span v-if="useUser().isFacilityOwner()">Meine Beiträge</span>
					<span v-else>Beiträge</span>
				</v-list-item> -->
				<v-divider></v-divider>
				<v-list-item
					link
					to="/admin/user_profile"
					nuxt
					v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
					class="general-font-size is-dark-grey"
				>
					<span>Mein Konto</span>
				</v-list-item>
				<v-list-item
					link
					to="/admin/tooltips"
					nuxt
					v-if="useAccessPrivileges().canAccessEndpointAction('tooltips', 'list')"
					class="general-font-size is-dark-grey"
				>
					Tooltips
				</v-list-item>
				<v-list-item
					link
					to="/admin/users"
					nuxt
					v-if="useAccessPrivileges().canAccessEndpointAction('users', 'list')"
					class="general-font-size is-dark-grey"
				>
					Benutzer
				</v-list-item>
				<v-divider></v-divider>
				<v-list-item @click="handleLogout" class="general-font-size is-dark-grey">
					<v-icon>mdi-logout</v-icon>
					Logout
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-main>
			<v-container :fluid="true" class="container">
				<slot />
				<div v-if="adminStore.loading" class="loading">
					<div class="spinner"></div>
					Daten werden geladen...
				</div>
			</v-container>
		</v-main>

		<ClientOnly>
			<ClientSnackbar />
		</ClientOnly>
	</v-app>
</template>

<script lang="ts" setup>
import { useAccessPrivileges } from '~/composables';
import { useUser } from '~/composables';
import { useAdminStore } from '~/store/admin';
import logo from '@/assets/images/lk-logo.png';

const user = useUser();

const drawer = ref(true);

const adminStore = useAdminStore();
const setupFinished = ref(false);

const handleLogout = () => {
	user.logout();
};

const checkSetupFinished = async () => {
	adminStore.loading = true;
	setupFinished.value = await user.setupFinished();
	adminStore.loading = false;
	useUser().statusOnHealthScope();
};

onMounted(async () => {
	await checkSetupFinished();
	useNuxtApp().$bus.$on('facilityUpdate', async () => {
		await checkSetupFinished();
	});
});
</script>

<style lang="scss" scoped>
@keyframes spinner {
	to {
		transform: rotate(360deg);
	}
}

.container {
	position: relative;

	.loading {
		position: fixed;
		width: 100%;
		height: 100vh;
		top: 0;
		left: 0;
		backdrop-filter: blur(1px) brightness(95%);
		cursor: wait;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 1rem;

		.spinner {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			border: 2px solid #ccc;
			border-top-color: #000;
			animation: spinner 0.6s linear infinite;
		}
	}
}

.has-lk-logo {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
</style>
