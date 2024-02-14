<template>
	<v-card style="border-radius: 20px">
		<v-img v-if="imageUrl" :src="imageUrl" />
		<div style="background-color: #f4f5f7; color: #565657; padding: 12px">
			<template v-if="tags || date">
				<div style="display: flex; flex-direction: row; justify-content: space-between">
					<div
						v-if="tags"
						style="display: flex; flex-direction: row; align-items: center; gap: 3px"
					>
						<IconTag :size="18" class="is-primary-color" />
						<span style="font-size: 10px">
							{{ tags.splice(0, 3).join(', ') }}
						</span>
					</div>
					<div
						v-if="date"
						style="display: flex; flex-direction: row; align-items: center; gap: 3px"
					>
						<IconCalendar :size="18" class="is-primary-color" />
						<span style="font-size: 10px">
							{{ date.toLocaleDateString() }}
						</span>
					</div>
				</div>
				<div style="padding-top: 6px">
					<hr style="border: none; border-top: 1px solid #c5c5c5" />
				</div>
			</template>

			<div style="display: flex; flex-direction: column; gap: 20px; padding: 14px 0px">
				<h3 class="is-primary-color" style="font-weight: 400; font-size: 1.1875rem">
					{{ title }}
				</h3>
				<div style="font-size: 1rem; font-weight: 300">
					<slot name="content"></slot>
				</div>
				<div>
					<v-btn size="small" rounded variant="outlined">
						Zum Beitrag
						<IconArrowRight :size="18" />
					</v-btn>
				</div>
			</div>
		</div>
	</v-card>
</template>

<script setup lang="ts">
import { IconArrowRight, IconCalendar, IconTag } from '@tabler/icons-vue';

const props = defineProps<{
	imageUrl?: string;
	title: string;
	tags?: string[];
	date?: Date;
}>();
const slots = defineSlots<{
	content: () => any;
}>();
</script>
