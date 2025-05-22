import "./App.css";
import React, { useState, useEffect } from "react";

// Import Framework7 Core
import Framework7 from 'framework7/lite';
/*
Or import bundle with all components:
import Framework7 from 'framework7/lite-bundle';
*/

// Import Framework7 React
import Framework7React, { App, View, Block } from 'framework7-react';
// Init plugin
Framework7.use(Framework7React)

import {
  Subject,
  Verb,
  Object,
  Tense,
  Aspect,
  SentenceBuilder,
} from "./English";

// SubjectComponent
const SubjectComponent = ({ subject, setSubject }: { subject: Subject, setSubject: (subject: Subject) => void }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(subject.getWord());
  const subjects = [
    new Subject("You", "juː", false, false, false),
    new Subject("I", "aɪ", false, false, false),
    new Subject("He", "hiː", false, false, false),
    new Subject("She", "ʃiː", false, false, false),
    new Subject("It", "ɪt", false, false, false),
    new Subject("They", "ðeɪ", false, false, false),
  ];

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubject = subjects.find(s => s.getWord() === event.target.value);
    if (newSubject) {
      setSelectedSubject(newSubject.getWord());
      setSubject(newSubject);
    }
  };

  return (
    <div>
      <select value={selectedSubject} onChange={handleSubjectChange}>
        {subjects.map(s => (
          <option key={s.getWord()} value={s.getWord()}>
            {s.getWord()}
          </option>
        ))}
      </select>
      
      <div>
        Person: {subject.getPerson() === 1 ? '1st' : subject.getPerson() === 2 ? '2nd' : '3rd'}
      </div>
    </div>
  );
};

// VerbComponent
const VerbComponent = ({ verb, setVerb }: { verb: Verb, setVerb: (verb: Verb) => void }) => {
  const [selectedVerb, setSelectedVerb] = useState<string>(verb.getV1());
  const verbs = [
    new Verb("eat", "ate", "eaten"),
    new Verb("drink", "drank", "drunk"),
    new Verb("sleep", "slept", "slept"),
    new Verb("run", "ran", "run"),
    new Verb("walk", "walked", "walked"),
  ];

  const handleVerbChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVerb = verbs.find(v => v.getV1() === event.target.value);
    if (newVerb) {
      setSelectedVerb(newVerb.getV1());
      setVerb(newVerb);
    }
  };

  return (
    <div>
      <select value={selectedVerb} onChange={handleVerbChange}>
        {verbs.map(v => (
          <option key={v.getV1()} value={v.getV1()}>
            {v.getV1()}
          </option>
        ))}
      </select>
      
      <div>
        V2: {verb.getV2()}
      </div>
      <div>
        V3: {verb.getV3()}
      </div>
      <div>
        V-ing: {verb.getIng()}
      </div>
    </div>
  );
};

// ObjectComponent
const ObjectComponent = ({ object, setObject }: { object: Object, setObject: (object: Object) => void }) => {
  const [selectedObject, setSelectedObject] = useState<string>(object.getWord());
  const objects = [
    new Object("apple", "æpəl", false, false, true),
    new Object("ball", "bɔːl", false, false, true),
    new Object("book", "bʊk", false, false, true),
    new Object("dog", "dɔːɡ", false, false, true),
    new Object("cat", "kæt", false, false, true),
    new Object("water", "ˈwɔːtər", false, false, false),
  ];

  const handleObjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newObject = objects.find(o => o.getWord() === event.target.value);
    if (newObject) {
      setSelectedObject(newObject.getWord());
      setObject(newObject);
    }
  };

  return (
    <div>
      <select value={selectedObject} onChange={handleObjectChange}>
        {objects.map(o => (
          <option key={o.getWord()} value={o.getWord()}>
            {o.getWord()}
          </option>
        ))}
      </select>
      
      <div>
        IPA: <b>{object.getIPA()[0]}</b>{object.getIPA().slice(1)}
      </div>
      <div>
        Is Vowel: {object.isVowel() ? "yes" : "no"}
      </div>
      <div>
        Is Definite: {object.isDefinite() ? "yes" : "no"}
      </div>
      <div>
        Is Plural: {object.isPlural() ? "yes" : "no"}
      </div>
      <div>
        Is Countable: {object.isCountable() ? "yes" : "no"}
      </div>
    </div>
  );
};

export default () => {
  const [subjectState, setSubjectState] = useState<Subject>(
    new Subject("You", "juː", false, false, false),
  );
  const [verbState, setVerbState] = useState<Verb>(
    new Verb("eat", "ate", "eaten"),
  );
  const [objectState, setObjectState] = useState<Object>(
    new Object("apple", "æpəl", false, false, true),
  );

  const [tenseState, setTenseState] = useState<Tense>(Tense.Present);
  const [aspectState, setAspectState] = useState<Aspect>(Aspect.Simple);
  const [negationState, setNegationState] = useState<boolean>(false);
  const [questionState, setQuestionState] = useState<boolean>(false);

  const [sentence, setSentence] = useState<string>("");
  const [prevSentence, setPrevSentence] = useState<string>("");
  const [highlightedDiff, setHighlightedDiff] = useState<JSX.Element | null>(null);


  // Function to highlight differences between two sentences
  const highlightDifferences = (oldSentence: string, newSentence: string) => {
    // Split sentences into words
    const oldWords = oldSentence.split(/\s+/);
    const newWords = newSentence.split(/\s+/);

    const result: JSX.Element[] = [];

    // Find which words changed by comparing old and new
    const changedIndices = new Set<number>();

    // First identify changes (additions, removals, replacements)
    for (let i = 0; i < Math.max(oldWords.length, newWords.length); i++) {
      const oldWord = i < oldWords.length ? oldWords[i] : null;
      const newWord = i < newWords.length ? newWords[i] : null;

      if (oldWord !== newWord) {
        changedIndices.add(i);
      }
    }

    // Now create the result with highlighted changed words
    for (let i = 0; i < newWords.length; i++) {
      if (changedIndices.has(i)) {
        // This getWord() changed - highlight it
        result.push(
          <span key={i} className="highlighted-getWord()">{newWords[i]}</span>
        );
      } else {
        // This getWord() didn't change
        result.push(<span key={i}>{newWords[i]}</span>);
      }
    }

    setHighlightedDiff(<>{result.map((element, idx) => 
      idx < result.length - 1 ? <React.Fragment key={idx}>{element}{' '}</React.Fragment> : element
    )}</>);

    // Reset highlight after animation completes
    setTimeout(() => {
      setHighlightedDiff(null);
    }, 2000);
  };

  // Framework7 parameters
  const f7params = {
    name: 'English Sentence Builder',
    theme: 'auto',
  };

  useEffect(() => {
    const newSentence = new SentenceBuilder(subjectState, verbState)
      .setObject(objectState)
      .setTense(tenseState)
      .setAspect(aspectState)
      .setIsNegation(negationState)
      .setIsQuestion(questionState)
      .build();

    setPrevSentence(sentence);
    setSentence(newSentence);

    // Create highlighted diff when sentence changes
    if (prevSentence && prevSentence !== newSentence) {
      highlightDifferences(prevSentence, newSentence);
    }
  }, [
    subjectState,
    verbState,
    objectState,
    tenseState,
    aspectState,
    negationState,
    questionState,
  ]);

  return (
    <App>
      <View>
            <Block strong>
              <div className="inline-groups">
                <div className="group">
                  <div className="group-title">Subject</div>
                  <SubjectComponent subject={subjectState} setSubject={setSubjectState} />
                </div>

                <div className="group">
                  <div className="group-title">Verb</div>
                  <VerbComponent verb={verbState} setVerb={setVerbState} />
                </div>

                <div className="group">
                  <div className="group-title">Object</div>
                  <ObjectComponent object={objectState} setObject={setObjectState} />
                </div>
              </div>
            </Block>

            <Block strong>
              <div className="group">
                <div className="group-title">Tense</div>
                <div className="segmented segmented-raised">
                  <button 
                    className={`button ${tenseState === Tense.Past ? 'button-active' : ''}`}
                    onClick={() => setTenseState(Tense.Past)}
                  >
                    Past
                  </button>
                  <button 
                    className={`button ${tenseState === Tense.Present ? 'button-active' : ''}`}
                    onClick={() => setTenseState(Tense.Present)}
                  >
                    Present
                  </button>
                  <button 
                    className={`button ${tenseState === Tense.Future ? 'button-active' : ''}`}
                    onClick={() => setTenseState(Tense.Future)}
                  >
                    Future
                  </button>
                </div>
              </div>
            </Block>

            <Block strong>
              <div className="inline-groups">
                <div className="group">
                  <div className="group-title">Aspect</div>
                  <div className="toggle-group">
                    <div className="toggle-container">
                      <span>Perfect</span>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={aspectState === Aspect.Perfect || aspectState === Aspect.PerfectContinuous}
                          onChange={() => {
                            if (aspectState === Aspect.Simple) setAspectState(Aspect.Perfect);
                            else if (aspectState === Aspect.Continuous) setAspectState(Aspect.PerfectContinuous);
                            else if (aspectState === Aspect.Perfect) setAspectState(Aspect.Simple);
                            else if (aspectState === Aspect.PerfectContinuous) setAspectState(Aspect.Continuous);
                          }}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="toggle-container">
                      <span>Continuous</span>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={aspectState === Aspect.Continuous || aspectState === Aspect.PerfectContinuous}
                          onChange={() => {
                            if (aspectState === Aspect.Simple) setAspectState(Aspect.Continuous);
                            else if (aspectState === Aspect.Perfect) setAspectState(Aspect.PerfectContinuous);
                            else if (aspectState === Aspect.Continuous) setAspectState(Aspect.Simple);
                            else if (aspectState === Aspect.PerfectContinuous) setAspectState(Aspect.Perfect);
                          }}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="group-title">Modifiers</div>
                  <div className="toggle-group">
                    <div className="toggle-container">
                      <span>Negation</span>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={negationState}
                          onChange={() => setNegationState(!negationState)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="toggle-container">
                      <span>Question</span>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={questionState}
                          onChange={() => setQuestionState(!questionState)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Block>

          <Block strong className="result-block">
            <h2>Generated Sentence:</h2>
            <p>{highlightedDiff || sentence}</p>
            {prevSentence && prevSentence !== sentence && (
              <div className="previous-sentence">
                <h3>Previous:</h3>
                <p>{prevSentence}</p>
              </div>
            )}
          </Block>
      </View>
    </App>
  );
}