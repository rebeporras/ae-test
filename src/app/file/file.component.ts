import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TextService, WordState } from '../text-service/text.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FileComponent implements OnInit, OnDestroy {
  subscriptions: Subscription;
  text: Array<WordState>;

  constructor(
    private textService: TextService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscriptions = new Subscription();
    this.text = [];

    this.initTextState();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initTextState() {
    const textSubscription = this.textService.getMockText().subscribe( 
      (text: Array<WordState>) => {
        this.textService.setTextState(text);
        this.text = text
        this.cd.markForCheck();
      }
    );

    this.subscriptions.add(textSubscription);
  }

  getClasses({isBold, isUnderlined, isItalic, isSelected}) {
    return {
      'bold': isBold,
      'underlined': isUnderlined,
      'italic': isItalic,
      'selected': isSelected
    };
  }

  selectWord(word: WordState) {
    if (!word.isSelected) {
      this.deselectText();
      this.textService.getSynonym(word.word).subscribe(
        (synonyms: Array<string>) => this.textService.setSynonyms(synonyms)
      );
    }
    word.isSelected = !word.isSelected;
    this.textService.setTextState(this.text);
  }

  private deselectText() {
    this.text.map(word => word.isSelected = false);
  }
}


