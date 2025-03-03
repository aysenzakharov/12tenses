export class Noun {
  protected word: string;
  private _ipa: string;
  private _is_definite: boolean;
  private _is_plural: boolean;
  private _is_countable: boolean;
  
  constructor(word: string, ipa: string, is_definite: boolean, is_plural: boolean, is_countable: boolean) {
    this.word = word
    this._ipa = ipa
    this._is_definite = is_definite
    this._is_plural = is_plural
    this._is_countable = is_countable
  }

  public isPlural(): boolean {
    return this._is_plural
  }

  public isSingular(): boolean {
    return !this._is_plural
  }
  
  public asString() {
    return this._getArticle() + ' ' + this.word
  }
  
  private _getArticle() {
    if (this._is_definite) {
      return "the"
    }
    if (this._is_countable && !this._is_plural) { // a/an
      if (this._isVowel(this._ipa.charAt(0))) {
        return "an"
      }
      return "a"
    }
    return "" // zero article a.k.a. not applicable
  }
  
  private _isVowel(IPASymbol: string) {
    let englishVowelIPAs = ["ɪ", "ʊ", "ɛ", "ɔ", "ɒ", "ɔ", "æ", "aɪ", "aʊ", "eɪ", "oʊ"]
    return englishVowelIPAs.includes(IPASymbol)
  }
  
}

enum Person {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3
}

export class Subject extends Noun {
  public getPerson() {
    let subjectLowerCase = this.word.toLowerCase()
    switch (subjectLowerCase) {
      case "i":
        return Person.FIRST
      case "you":
        return Person.SECOND
      default:
        return Person.THIRD
    }
  }
}

export class Object extends Noun {}

export class Verb {

  private _v1: string;
  private _v2: string;
  private _v3: string;

  constructor(v1: string, v2: string, v3: string) {
    this._v1 = v1
    this._v2 = v2
    this._v3 = v3
  }

  public getV1() {
    return this._v1
  }

  public getV2() {
    return this._v2
  }

  public getV3() {
    return this._v3
  }

  public getIng() {
    return this._v1 + "ing"
  }

}

export enum Tense {
  PRESENT,
  PAST,
  FUTURE
}

export enum Aspect {
  SIMPLE,
  PERFECT,
  CONTINUOUS,
  PERFECT_CONTINUOUS,
}

enum ModalVerb {
  CAN = "can",
  COULD = "could",
  MAY = "may",
  MIGHT = "migth",
  SHALL = "shall",
  SHOULD = "should",
  WILL = "will",
  WOULD = "would",
  MUST = "must",
}

export class Sentence {

  private _subject: Subject
  private _verb: Verb
  
  constructor(subject: Subject, verb: Verb) {
    this._subject = subject
    this._verb = verb
  }
  
  public asString() {
    return this._subject.asString() + " " + this._verb.getV1()
  }

}

export class SentenceBuilder {

  private _subject: Subject
  private _verb: Verb
  private _object: Object|null = null
  private _tense: Tense = Tense.PRESENT
  private _aspect: Aspect = Aspect.SIMPLE
  private _isQuestion: boolean = false
  private _isNegation: boolean = false
  
  constructor(subject: Subject, verb: Verb) {
    this._subject = subject
    this._verb = verb
  }

  public setTense(tense: Tense) {
    this._tense = tense
    return this
  }
  
  public setAspect(aspect: Aspect) {
    this._aspect = aspect
    return this
  }

  public setIsQuestion(isQuestion: boolean) {
    this._isQuestion = isQuestion
    return this
  }

  public setIsNegation(isNegation: boolean) {
    this._isNegation = isNegation
    return this
  }

  public setObject(object: Object) {
    this._object = object
    return this
  }

  private _getToDo() {
    let isToDoCondition = (
      [Tense.PRESENT, Tense.PAST].includes(this._tense) &&
      this._aspect === Aspect.SIMPLE &&
      (this._isNegation || this._isQuestion)
    )
    if (!isToDoCondition) return ""
    
    let person = this._subject.getPerson()
    
    if (this._tense === Tense.PAST) return "did"
    if (
      this._tense === Tense.PRESENT &&
      person === Person.THIRD &&
      this._subject.isSingular()
    ) {
      return "does"
    }
    return "do"
  }

  private _getToHave() {
    let isToHaveCondition = [Aspect.PERFECT, Aspect.PERFECT_CONTINUOUS].includes(this._aspect)
    if (!isToHaveCondition) return ""
    
    let person = this._subject.getPerson()
    
    if (
      this._tense === Tense.PRESENT && this._aspect === Aspect.PERFECT &&
      person === Person.THIRD &&
      this._subject.isSingular()
    ) {
      return "has"
    }
    if (this._tense === Tense.PAST) {
      return "had"
    }
    return "have"
  }

  private _getToBe() {
    let isToBeCondition = [Aspect.CONTINUOUS, Aspect.PERFECT_CONTINUOUS].includes(this._aspect)
    if (!isToBeCondition) return ""
    
    let person = this._subject.getPerson()

    if (this._aspect === Aspect.CONTINUOUS) {
      switch (this._tense) {
        case Tense.PRESENT:
          if (this._subject.isSingular()) {
            switch (person) {
              case Person.FIRST:
                return "am"
              case Person.THIRD:
                return "is"
            }
          }
          return "are"
        case Tense.PAST:
          if (this._subject.isSingular() && [Person.FIRST, Person.THIRD].includes(person)) {
            return "was"
          }
          return "were"
        case Tense.FUTURE:
          return "be"
      }
    }
    return "been"
  }

  private _getAuxiliary() {
    let auxiliary: string[] = []

    if (this._tense === Tense.FUTURE) {
      auxiliary.push(this._getModalVerb())
    }

    switch (this._aspect) {
      case Aspect.SIMPLE:
        auxiliary.push(this._getToDo())
        break
      case Aspect.PERFECT:
        auxiliary.push(this._getToHave())
        break
      case Aspect.CONTINUOUS:
        auxiliary.push(this._getToBe())
        break
      case Aspect.PERFECT_CONTINUOUS:
        auxiliary.push(this._getToHave())
        auxiliary.push(this._getToBe())
        break
    }
    
    if (this._isNegation) {
      auxiliary.splice(1, 0, "not")
    }
    
    return auxiliary
  }

  private _getVerb() {
    let person = this._subject.getPerson()
    switch (this._aspect) {
      case Aspect.SIMPLE:
        if (!this._isNegation && !this._isQuestion) {
          if (
            this._tense === Tense.PRESENT &&
            person === Person.THIRD &&
            this._subject.isSingular()
          ) {
            return this._verb.getV1() + "s"
          }
          if (this._tense === Tense.PAST) return this._verb.getV2()
        }
        return this._verb.getV1()
      case Aspect.PERFECT:
        return this._verb.getV3()
      default:
        return this._verb.getIng()
    }
  }

  private _getModalVerb() {
    return ModalVerb.WILL.toString()
  }

  public build() {
    let sentence = []
    
    sentence.push(this._subject.asString())
    this._getAuxiliary().forEach(auxiliary => sentence.push(auxiliary))
    
    if (this._isQuestion) {
      let temp = sentence[0]
      sentence[0] = sentence[1]
      sentence[1] = temp
    }

    sentence.push(this._getVerb())
    
    if (this._object) sentence.push(this._object.asString())

    if (this._isQuestion) sentence.push("?")
    
    return sentence.join(" ").replace(/^\w/, c => c.toUpperCase())
  }

}
