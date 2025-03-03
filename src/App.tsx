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
              
              <ListItem title="Aspect & Modifiers">
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
