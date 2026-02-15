import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngil-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgilSelectOptionsComponent<T> implements OnDestroy {
  @Input() selectedItems: T | T[] | null = null;
  @Input() items: T[] = [];
  @Input() displayKey?: keyof T;
  @Input() multiple = false;
  @Input() display = false;

  @Output() itemSelected = new EventEmitter<T | T[]>();

  protected readonly destroy$ = new Subject<void>();

  onItemSelected(item: T) {
    let newSelection: T | T[];

    if (Array.isArray(this.selectedItems)) {
      newSelection = this.selectedItems.includes(item)
        ? this.selectedItems.filter(selectedItem => selectedItem !== item)
        : [...this.selectedItems, item];
    } else if (this.multiple && this.selectedItems) {
      newSelection = [this.selectedItems, item];
    } else {
      newSelection = item;
    }

    this.itemSelected.emit(newSelection);
  }

  isSelected(item: T) {
    if (Array.isArray(this.selectedItems)) {
      return this.selectedItems.includes(item);
    }

    return item === this.selectedItems;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
