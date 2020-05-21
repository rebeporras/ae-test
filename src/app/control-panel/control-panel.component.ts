import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { TextService, WordState } from '../text-service/text.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  private selectedWord: WordState;
  public synonyms: Observable<string[]>;
  public color: string;
  
  constructor(
    private textService: TextService
  ) { }

  ngOnInit() {
    this.subscriptions = new Subscription();
    this.synonyms = this.textService.synonyms;
    this.color = '#000000';

    const selectedWordSubscription = this.textService.selectedWord.subscribe(
      (word: WordState) => this.selectedWord = word
    );

    this.subscriptions.add(selectedWordSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public formatWord(action: string): void {
    if (this.selectedWord) {
      this.selectedWord[action] = !this.selectedWord[action];
    }
  }

  public selectSynonym({target}): void {
    if (this.selectedWord) {
      this.selectedWord.word = target.value;
    }
  }

  public updateColor({color}): void {
    this.color = color;
    if (this.selectedWord) {
      this.selectedWord['color'] = color;
    }
  }
}
