import { Component, OnInit, OnDestroy } from '@angular/core';
import { TextService, WordState } from '../text-service/text.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  public text: Array<WordState>;

  constructor(
    private textService: TextService
  ) { }

  ngOnInit() {
    this.subscriptions = new Subscription();
    this.text = [];

    this.initTextState();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private initTextState(): void {
    const textSubscription = this.textService.getMockText().subscribe( 
      (text: Array<WordState>) => this.text = text
    );

    this.subscriptions.add(textSubscription);
  }

  public getClasses({bold, underlined, italic, isSelected}): any {
    return {
      bold,
      underlined,
      italic,
      selected: isSelected
    };
  }

  public selectWord(word: WordState): void {
    if (!word.isSelected) {
      this.deselectText();
    }
    word.isSelected = !word.isSelected;
    this.textService.setSelectedWord(word.isSelected ? word : null);
    this.textService.setSynonyms(word.isSelected ? word.word : null);
  }

  private deselectText(): void {
    this.text.map(word => word.isSelected = false);
  }
}


