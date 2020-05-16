import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TextService {
  private text$ = new BehaviorSubject(null);
  private synonyms$ = new BehaviorSubject(null);

  constructor( private http: HttpClient ) { }

  getMockText(): Observable<WordState[]> {
    return new Observable(observer => {
      observer.next('A year ago I was in the audience at a gathering of designers in San Francisco. ' +
      'There were four designers on stage, and two of them worked for me. I was there to support them. ' +
      'The topic of design responsibility came up, possibly brought up by one of my designers, I honestly don’t remember the details. ' +
      'What I do remember is that at some point in the discussion I raised my hand and suggested, to this group of designers, ' +
      'that modern design problems were very complex. And we ought to need a license to solve them.');
    }).pipe(
      map(
        (text: string) => {
          const words = text.split(' ');
          const textState = [];
          words.forEach((word: string, i: number) => textState.push(new WordState(i, word)));
          return textState;
        }
      )
    );;
  }

  getSynonym(word: string) {
    if (word) {
      const url = `https://api.datamuse.com/words?rel_syn=${word}`;
      return this.http.get(url).pipe(
        map((synonyms: Array<any>) => synonyms.map(synonym => synonym.word))
      );
    }

    return of(null);
  }

  setTextState(text: Array<WordState>) {
    this.text$.next(text);
  }

  get text() {
    return this.text$;
  }

  setSynonyms(synonyms: Array<string>) {
    this.synonyms$.next(synonyms);
  }

  get synonyms() {
    return this.synonyms$;
  }
}

export class WordState {
  isBold: boolean;
  isUnderlined: boolean;
  isItalic: boolean;
  isSelected: boolean;
  id: number;
  word: string;

  constructor(id, word) {
    this.isBold = false;
    this.isUnderlined = false;
    this.isItalic = false;
    this.isSelected = false;
    this.id = id;
    this.word = word;
  }
}
