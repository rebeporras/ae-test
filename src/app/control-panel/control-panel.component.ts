import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { TextService, WordState } from '../text-service/text.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  subscriptions: Subscription;
  selectedWord: WordState;
  synonyms: Observable<string[]>;
  
  constructor(
    private textService: TextService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscriptions = new Subscription();
    this.synonyms = this.textService.synonyms;

    const textSubscription = this.textService.text.subscribe(
      (text: Array<WordState>) => {
        this.selectedWord = text ? text.find(word => word.isSelected) : null;
        this.cd.markForCheck();
      }
    );

    this.subscriptions.add(textSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setBold() {
    if (this.selectedWord) {
      this.selectedWord.isBold = !this.selectedWord.isBold;
    }
  }

  setItalic() {
    if (this.selectedWord) {
      this.selectedWord.isItalic = !this.selectedWord.isItalic;
    }
  }

  setUnderlined() {
    if (this.selectedWord) {
      this.selectedWord.isUnderlined = !this.selectedWord.isUnderlined;
    }
  }

  selectSynonym({target}) {
    this.selectedWord.word = target.value;
  }
}
