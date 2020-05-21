import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TextService {
  private selectedWord$: BehaviorSubject<WordState> = new BehaviorSubject(null);
  private synonyms$: BehaviorSubject<string[]> = new BehaviorSubject(null);

  constructor( private http: HttpClient ) { }

  public getMockText(): Observable<WordState[]> {
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

  private getSynonym(word: string): Observable<string[]> {
    const url = `https://api.datamuse.com/words?rel_syn=${word}`;
    return this.http.get(url).pipe(
      map((synonyms: Array<any>) => synonyms.map(synonym => synonym.word))
    );
  }

  public setSynonyms(word: string): void {
    if (word) {
      this.getSynonym(word).subscribe(
        synonyms => this.synonyms$.next(synonyms)
      );
    } else {
      this.synonyms$.next([]);
    }
  }

  public get synonyms(): Observable<string[]> {
    return this.synonyms$.asObservable();
  }

  public setSelectedWord(word: WordState): void {
    this.selectedWord$.next(word);
  }

  public get selectedWord(): Observable<WordState> {
    return this.selectedWord$.asObservable();
  }
}

export class WordState {
  bold?: boolean;
  underlined?: boolean;
  italic?: boolean;
  color: string;
  isSelected: boolean;
  id: number;
  word: string;

  constructor(id, word) {
    this.isSelected = false;
    this.id = id;
    this.word = word;
    this.color = '#000000';
  }
}
