import { NgTemplateOutlet } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	ViewEncapsulation,
} from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnColumnDefComponent } from '@spartan-ng/ui-table-brain';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-td',
	standalone: true,
	imports: [NgTemplateOutlet],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-template #content>
			<ng-content />
		</ng-template>
		@if (truncate()) {
			<span class="flex-1 truncate">
				<ng-container [ngTemplateOutlet]="content" />
			</span>
		} @else {
			<ng-container [ngTemplateOutlet]="content" />
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmTdComponent {
	public _columnDef? = inject(BrnColumnDefComponent, { optional: true });
	public truncate = input(false, { transform: booleanAttribute });

	public _userClass = input<ClassValue>('', { alias: 'class' });
	public _computedClass = computed(() =>
		hlm('flex flex-none p-4 items-center [&:has([role=checkbox])]:pr-0', this._userClass()),
	);
}
