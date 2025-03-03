export class Noun {
  protected word: string;
  private _ipa: string;
  private _isDefinite: boolean;
  private _isPlural: boolean;
  private _isCountable: boolean;

  constructor(word: string, ipa: string, isDefinite: boolean, isPlural: boolean, isCountable: boolean) {
    this.word = word;
    this._ipa = ipa;
    this._isDefinite = isDefinite;
    this._isPlural = isPlural;
    this._isCountable = isCountable;
  }

  public isPlural(): boolean {
    return this._isPlural;
  }

  public isSingular(): boolean {
    return !this._isPlural;
  }

  public asString() {
    const article = this._getArticle();
    return article ? `${article} ${this.word}` : this.word;
  }

  private _getArticle() {
    if (this._isDefinite) {
      return "the";
    }
    if (this._isCountable && !this._isPlural) {
      return this._isVowel(this._ipa) ? "an" : "a";
    }
    return "";
  }

  private _isVowel(ipa: string) {
    const englishVowelIPAs = ["aɪ", "aʊ", "eɪ", "oʊ", "ɪ", "ʊ", "ɛ", "ɔ", "ɒ", "æ", "ʌ", "ə", "i", "u", "ɑ", "ɜ", "ɔɪ", "eə", "ʊə"];
    return englishVowelIPAs.some(vowel => ipa.startsWith(vowel));
  }
}

enum Person {
  First = 1,
  Second = 2,
  Third = 3
}

export class Subject extends Noun {
  public getPerson() {
    const subjectLower = this.word.toLowerCase();
    switch (subjectLower) {
      case "i": return Person.First;
      case "you": return Person.Second;
      default: return Person.Third;
    }
  }
}

export class Object extends Noun {}

export class Verb {
  private _v1: string;
  private _v2: string;
  private _v3: string;

  constructor(v1: string, v2: string, v3: string) {
    this._v1 = v1;
    this._v2 = v2;
    this._v3 = v3;
  }

  public getV1() { return this._v1; }
  public getV2() { return this._v2; }
  public getV3() { return this._v3; }
  public getIng() { return `${this._v1}ing`; }
}

export enum Tense {
  Present,
  Past,
  Future
}

export enum Aspect {
  Simple,
  Perfect,
  Continuous,
  PerfectContinuous,
}

enum ModalVerb {
  Can = "can",
  Could = "could",
  May = "may",
  Might = "might",
  Shall = "shall",
  Should = "should",
  Will = "will",
  Would = "would",
  Must = "must",
}

export class Sentence {
  private _subject: Subject;
  private _verb: Verb;

  constructor(subject: Subject, verb: Verb) {
    this._subject = subject;
    this._verb = verb;
  }

  public asString() {
    return `${this._subject.asString()} ${this._verb.getV1()}`;
  }
}

export class SentenceBuilder {
  private _subject: Subject;
  private _verb: Verb;
  private _object: Object | null = null;
  private _tense: Tense = Tense.Present;
  private _aspect: Aspect = Aspect.Simple;
  private _isQuestion = false;
  private _isNegation = false;

  constructor(subject: Subject, verb: Verb) {
    this._subject = subject;
    this._verb = verb;
  }

  setTense(tense: Tense) {
    this._tense = tense;
    return this;
  }

  setAspect(aspect: Aspect) {
    this._aspect = aspect;
    return this;
  }

  setIsQuestion(isQuestion: boolean) {
    this._isQuestion = isQuestion;
    return this;
  }

  setIsNegation(isNegation: boolean) {
    this._isNegation = isNegation;
    return this;
  }

  setObject(object: Object) {
    this._object = object;
    return this;
  }

  private _getToDo() {
    const needsDo = [Tense.Present, Tense.Past].includes(this._tense) &&
      this._aspect === Aspect.Simple &&
      (this._isNegation || this._isQuestion);

    if (!needsDo) return "";

    if (this._tense === Tense.Past) return "did";
    if (this._tense === Tense.Present &&
        this._subject.getPerson() === Person.Third &&
        this._subject.isSingular()) return "does";
    return "do";
  }

  private _getToHave() {
    if (![Aspect.Perfect, Aspect.PerfectContinuous].includes(this._aspect)) return "";

    if (this._tense === Tense.Past) return "had";
    if (this._tense === Tense.Present &&
        this._subject.getPerson() === Person.Third &&
        this._subject.isSingular()) return "has";
    return "have";
  }

  private _getToBe() {
    if (![Aspect.Continuous, Aspect.PerfectContinuous].includes(this._aspect)) return "";

    if (this._aspect === Aspect.Continuous) {
      switch (this._tense) {
        case Tense.Present:
          return this._subject.isSingular()
            ? (this._subject.getPerson() === Person.First ? "am" : "is")
            : "are";
        case Tense.Past:
          return this._subject.isSingular() ? "was" : "were";
        case Tense.Future:
          return "be";
      }
    }
    return "been";
  }

  private _getAuxiliary() {
    const auxiliary: string[] = [];
    if (this._tense === Tense.Future) auxiliary.push(ModalVerb.Will);

    switch (this._aspect) {
      case Aspect.Simple:
        auxiliary.push(this._getToDo());
        break;
      case Aspect.Perfect:
        auxiliary.push(this._getToHave());
        break;
      case Aspect.Continuous:
        auxiliary.push(this._getToBe());
        break;
      case Aspect.PerfectContinuous:
        auxiliary.push(this._getToHave(), this._getToBe());
        break;
    }

    if (this._isNegation) auxiliary.splice(1, 0, "not");
    return auxiliary.filter(x => x);
  }

  private _getVerb() {
    const baseVerb = this._verb.getV1();
    if (this._aspect === Aspect.Simple && !this._isNegation && !this._isQuestion) {
      if (this._tense === Tense.Present &&
          this._subject.getPerson() === Person.Third &&
          this._subject.isSingular()) return `${baseVerb}s`;
      if (this._tense === Tense.Past) return this._verb.getV2();
    }
    return this._aspect === Aspect.Perfect ? this._verb.getV3() : `${baseVerb}ing`;
  }

  public build() {
    const parts = [
      this._subject.asString(),
      ...this._getAuxiliary(),
      this._getVerb(),
      this._object?.asString()
    ].filter(x => x);

    if (this._isQuestion && parts.length > 1) {
      [parts[0], parts[1]] = [parts[1], parts[0]];
    }

    let sentence = parts.join(' ');
    if (this._isQuestion) sentence += '?';
    if (!sentence.endsWith('?')) sentence += '.';

    return sentence[0].toUpperCase() + sentence.slice(1);
  }
}