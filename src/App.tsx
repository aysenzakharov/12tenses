import "./App.css";
import React, { useState, useEffect } from "react";

// Import Framework7 Core
import Framework7 from 'framework7/lite';
/*
Or import bundle with all components:
import Framework7 from 'framework7/lite-bundle';
*/

// Import Framework7 React
import Framework7React, { App, View, List, ListItem, Radio, Checkbox, Block } from 'framework7-react';
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

  // Framework7 parameters
  const f7params = {
    name: 'English Sentence Builder',
    theme: 'auto',
  };

  useEffect(() => {
    setSentence(
      new SentenceBuilder(subjectState, verbState)
        .setObject(objectState)
        .setTense(tenseState)
        .setAspect(aspectState)
        .setIsNegation(negationState)
        .setIsQuestion(questionState)
        .build(),
    );
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
            <List>
              <ListItem title="Tense">
                <div className="segmented segmented-raised">
                  <button 
                    className={`button ${tenseState === Tense.Present ? 'button-active' : ''}`}
                    onClick={() => setTenseState(Tense.Present)}
                  >
                    Present
                  </button>
                  <button 
                    className={`button ${tenseState === Tense.Past ? 'button-active' : ''}`}
                    onClick={() => setTenseState(Tense.Past)}
                  >
                    Past
                  </button>
                  <button 
                    className={`button ${tenseState === Tense.Future ? 'button-active' : ''}`}
                    onClick={() => setTenseState(Tense.Future)}
                  >
                    Future
                  </button>
                </div>
              </ListItem>
              
              <ListItem title="Aspect">
                <div className="segmented segmented-raised">
                  <button 
                    className={`button ${aspectState === Aspect.Simple ? 'button-active' : ''}`}
                    onClick={() => setAspectState(Aspect.Simple)}
                  >
                    Simple
                  </button>
                  <button 
                    className={`button ${aspectState === Aspect.Continuous ? 'button-active' : ''}`}
                    onClick={() => setAspectState(Aspect.Continuous)}
                  >
                    Continuous
                  </button>
                  <button 
                    className={`button ${aspectState === Aspect.Perfect ? 'button-active' : ''}`}
                    onClick={() => setAspectState(Aspect.Perfect)}
                  >
                    Perfect
                  </button>
                  <button 
                    className={`button ${aspectState === Aspect.PerfectContinuous ? 'button-active' : ''}`}
                    onClick={() => setAspectState(Aspect.PerfectContinuous)}
                  >
                    Perfect Continuous
                  </button>
                </div>
              </ListItem>
              
              <ListItem>
                <Checkbox
                  checked={negationState}
                  onChange={() => setNegationState(!negationState)}
                >
                  Negation
                </Checkbox>
              </ListItem>
              
              <ListItem>
                <Checkbox
                  checked={questionState}
                  onChange={() => setQuestionState(!questionState)}
                >
                  Question
                </Checkbox>
              </ListItem>
            </List>
          
          <Block strong className="result-block">
            <h2>Generated Sentence:</h2>
            <p>{sentence}</p>
          </Block>
      </View>
    </App>
  );
}
