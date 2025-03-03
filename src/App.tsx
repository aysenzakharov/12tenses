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
              <ListItem>
                <Radio
                  name="tense"
                  value="present"
                  checked={tenseState === Tense.Present}
                  onChange={() => setTenseState(Tense.Present)}
                >
                  Present
                </Radio>
                <Radio
                  name="tense"
                  value="past"
                  checked={tenseState === Tense.Past}
                  onChange={() => setTenseState(Tense.Past)}
                >
                  Past
                </Radio>
                <Radio
                  name="tense"
                  value="future"
                  checked={tenseState === Tense.Future}
                  onChange={() => setTenseState(Tense.Future)}
                >
                  Future
                </Radio>
              </ListItem>
              
              <ListItem header="Aspect">
                <Radio
                  name="aspect"
                  value="simple"
                  checked={aspectState === Aspect.Simple}
                  onChange={() => setAspectState(Aspect.Simple)}
                >
                  Simple
                </Radio>
                <Radio
                  name="aspect"
                  value="continuous"
                  checked={aspectState === Aspect.Continuous}
                  onChange={() => setAspectState(Aspect.Continuous)}
                >
                  Continuous
                </Radio>
                <Radio
                  name="aspect"
                  value="perfect"
                  checked={aspectState === Aspect.Perfect}
                  onChange={() => setAspectState(Aspect.Perfect)}
                >
                  Perfect
                </Radio>
                <Radio
                  name="aspect"
                  value="perfect-continuous"
                  checked={aspectState === Aspect.PerfectContinuous}
                  onChange={() => setAspectState(Aspect.PerfectContinuous)}
                >
                  Perfect Continuous
                </Radio>
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
